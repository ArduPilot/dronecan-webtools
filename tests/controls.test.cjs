const assert = require('node:assert/strict');
const test = require('node:test');
const React = require('react');
const Node = require('../src/dronecan/node');
const DSDL = require('../src/dronecan/dsdl');
const Transfer = require('../src/dronecan/transfer');
const PrimitiveType = require('../src/dronecan/primitive_type');
const { loadModule } = require('./load-module.cjs');

// Exercise the panel function, its event handlers, and effect cleanup without a browser.
function controlledRender() {
    let key;
    let cursor;
    let changed;
    let state = [];
    let effects = [];
    const layout = [];
    const passive = [];

    function effect(queue, callback, deps) {
        const index = cursor++;
        const previous = effects[index];
        if (deps && previous?.deps?.length === deps.length &&
            deps.every((value, i) => Object.is(value, previous.deps[i]))) return;
        queue.push(() => {
            previous?.cleanup?.();
            effects[index] = { deps, cleanup: callback() };
        });
    }

    function unmount() {
        effects.forEach(previous => previous.cleanup?.());
        state = [];
        effects = [];
    }

    return {
        react: {
            ...React,
            useRef(value) { return state[cursor++] ??= { current: value }; },
            useState(initial) {
                const index = cursor++;
                if (!(index in state)) state[index] = initial;
                return [state[index], update => {
                    const next = typeof update === 'function' ? update(state[index]) : update;
                    if (!Object.is(state[index], next)) changed = true;
                    state[index] = next;
                }];
            },
            useLayoutEffect(callback, deps) { effect(layout, callback, deps); },
            useEffect(callback, deps) { effect(passive, callback, deps); },
            useSyncExternalStore(_subscribe, snapshot) { return snapshot(); }
        },
        render(element) {
            if (key !== element.key) unmount();
            key = element.key;
            for (let pass = 0; pass < 5; pass++) {
                changed = false;
                cursor = 0;
                const tree = element.type(element.props);
                layout.splice(0).forEach(run => run());
                passive.splice(0).forEach(run => run());
                if (!changed) return tree;
            }
            throw new Error('Panel state did not settle');
        },
        get hasPendingRender() { return changed; },
        unmount
    };
}

function findElement(tree, matches) {
    if (Array.isArray(tree)) return tree.map(child => findElement(child, matches)).find(Boolean);
    if (!React.isValidElement(tree)) return;
    if (matches(tree)) return tree;
    return findElement(tree.props.children, matches) ?? findElement(tree.props.control, matches);
}

function setup(t, panelName, globals = {}) {
    const renderer = controlledRender();
    const node = new Node({ nodeId: 127 });
    const transfers = [];
    const frames = [];
    const workers = [];
    clearInterval(node.nodeStatusIntervalID);
    node.on('sendFrame', (...frame) => frames.push(frame));
    node.on('transfer-tx', transfer => transfers.push(transfer));
    t.after(renderer.unmount);

    const opener = { localNode: node, closed: false, mavlinkSession: { isConnected: () => node.nodeId !== null } };
    const mocks = new Proxy({
        react: renderer.react,
        '@mui/material': new Proxy({}, { get: (_, name) => name })
    }, {
        get(overrides, name) {
            return overrides[name] ?? (name.startsWith('@mui/icons-material/') ? name.split('/').at(-1) : undefined);
        }
    });
    class WorkerStub {
        constructor() {
            this.messages = [];
            workers.push(this);
        }
        postMessage(message) { this.messages.push(message); }
        terminate() { this.terminated = true; }
    }
    const Panel = loadModule(`src/${panelName}.js`, mocks, {
        Worker: WorkerStub, URL, performance, setInterval, clearInterval, ...globals
    }).default;
    const Session = loadModule('src/ControlPanelSession.js', mocks, { window: { opener } }).default;
    function render() { return renderer.render(Session({ panel: Panel })); }
    return {
        node, transfers, frames, workers, render,
        hasPendingRender: () => renderer.hasPendingRender,
        unmount: renderer.unmount
    };
}

function startAtZero(tree) {
    findElement(tree, el => el.props['aria-label'] === 'Start broadcasting at zero').props.onClick();
}

function toggleEscBroadcast(tree, label = 'Start broadcasting') {
    const button = findElement(tree, el => el.props['aria-label'] === label);
    assert.ok(button, `found ${label} button`);
    assert.notEqual(button.props.disabled, true);
    button.props.onClick();
}

function moveFirstSlider(tree, value) {
    const slider = findElement(tree, el => el.type === 'Slider');
    assert.notEqual(slider.props.disabled, true);
    slider.props.onChange({}, value);
}

const workerTick = type => ({ data: { type } });
const escTick = workerTick('requestEscCommand');
const safetyTick = workerTick('requestSafetyCommand');
const armingTick = workerTick('requestArmingCommand');
const actuatorTick = workerTick('requestActuatorCommand');
const rawThrust = transfer => Array.from(transfer.payload.fields.cmd.items, item => item.value);
const actuatorValues = transfer => Array.from(transfer.payload.fields.commands.items,
    item => item.fields.command_value.value);
const RAW_COMMAND = 'uavcan.equipment.esc.RawCommand';
const SAFETY_STATE = 'ardupilot.indication.SafetyState';
const ARMING_STATUS = 'uavcan.equipment.safety.ArmingStatus';

const panelCheckbox = (tree, label) => findElement(tree, el =>
    el.type === 'Checkbox' && el.props.inputProps?.['aria-label'] === label);

const readOnlyCheckbox = tree => panelCheckbox(tree, 'View Mode');

function setPanelCheckbox(tree, label, checked) {
    const checkbox = panelCheckbox(tree, label);
    assert.ok(checkbox, `found ${label} checkbox`);
    assert.notEqual(checkbox.props.disabled, true);
    checkbox.props.onChange({ target: { checked } }, checked);
}

function setReadOnly(tree, checked) {
    setPanelCheckbox(tree, 'View Mode', checked);
}

function receiveBroadcast(node, sourceNodeId, payload, transferId = 0, timestampMs) {
    const transfer = new Transfer({ sourceNodeId, payload, transferId });
    for (const frame of transfer.toFrames(payload)) {
        if (timestampMs !== undefined) frame.tsMonotonic = timestampMs / 1000;
        node.handleFrame(frame);
    }
}

function receiveEscCommand(node, sourceNodeId, values, transferId = 0, timestampMs) {
    const payload = new DSDL.uavcan_equipment_esc_RawCommand();
    payload.fields.cmd.items = values.map(value => new PrimitiveType(value, PrimitiveType.KIND_SIGNED_INT, 14));
    receiveBroadcast(node, sourceNodeId, payload, transferId, timestampMs);
}

function escText(tree, text) {
    return findElement(tree, el => el.type === 'Typography'
        && React.Children.toArray(el.props.children).join('').includes(text));
}

function panelClock() {
    let now = 1000;
    const timers = new Map();
    const schedule = (callback, delay, repeat = false) => {
        const id = Symbol();
        timers.set(id, { callback, due: now + delay, interval: repeat ? delay : null });
        return id;
    };
    const cancel = id => timers.delete(id);

    return {
        now: () => now,
        globals: {
            performance: { now: () => now },
            setTimeout: schedule,
            clearTimeout: cancel,
            setInterval: (callback, delay) => schedule(callback, delay, true),
            clearInterval: cancel
        },
        advance(elapsedMs) {
            const end = now + elapsedMs;
            let next;
            while ((next = [...timers].filter(([, timer]) => timer.due <= end)
                .sort(([, first], [, second]) => first.due - second.due)[0])) {
                const [id, timer] = next;
                now = timer.due;
                if (timer.interval === null) timers.delete(id);
                else timer.due += timer.interval;
                timer.callback();
            }
            now = end;
        },
        get pending() { return timers.size; }
    };
}

function telemetryRate(tree, index, idLabel = 'Index') {
    const card = findElement(tree, element => element.type === 'Card' && escText(element, `${idLabel}: ${index}`));
    assert.ok(card, `found channel ${index}`);
    const label = escText(card, 'FPS: ');
    assert.ok(label, `channel ${index} has a telemetry rate label`);
    const text = React.Children.toArray(label.props.children).join('');
    const match = /^FPS: (\d+\.\d)$/.exec(text);
    assert.ok(match, `FPS label displays one decimal: ${text}`);
    return Number(match[1]);
}

test('ESC telemetry rates track each channel and expire despite unrelated RawCommand traffic', t => {
    const clock = panelClock();
    const { node, frames, render, hasPendingRender, unmount } = setup(t, 'EscPanel', clock.globals);
    const statuses = [0, 1].map(index => {
        const status = new DSDL.uavcan_equipment_esc_Status();
        status.fields.esc_index.value = index;
        return status;
    });
    let statusId = 0;
    let commandId = 0;

    function deliverFor(durationMs, { channel0 = false, channel1 = false, rawCommands = false } = {}) {
        for (let elapsed = 50; elapsed <= durationMs; elapsed += 50) {
            clock.advance(50);
            const now = clock.now();
            // The main window and the popup have different performance time origins.
            const frameTime = now + 20_000;
            if (channel0 && now % 100 === 0) {
                receiveBroadcast(node, 45, statuses[0], statusId++ % 32, frameTime);
            }
            if (channel1 && now % 250 === 0) {
                receiveBroadcast(node, 45, statuses[1], statusId++ % 32, frameTime);
            }
            if (rawCommands && now % 100 === 0) {
                receiveEscCommand(node, 45, [800, -800], commandId++ % 32, frameTime);
            }
        }
    }

    assert.equal(telemetryRate(render(), 0), 0);
    deliverFor(3000, { channel0: true, channel1: true, rawCommands: true });
    let tree = render();
    assert.equal(telemetryRate(tree, 0), 10);
    assert.equal(telemetryRate(tree, 1), 4);
    assert.equal(telemetryRate(tree, 2), 0);

    deliverFor(950, { channel1: true, rawCommands: true });
    assert.ok(telemetryRate(render(), 0) > 0, 'the rate does not expire before one second of silence');
    deliverFor(350, { channel1: true, rawCommands: true });
    tree = render();
    assert.equal(telemetryRate(tree, 0), 0);
    assert.equal(telemetryRate(tree, 1), 4);
    assert.ok(escText(tree, 'cmd: [800, -800]'));

    clock.advance(200);
    render(); // Commit the previous RawCommand display before checking idle updates.
    clock.advance(1100);
    assert.ok(hasPendingRender(), 'expiration requests a render without an incoming frame');
    assert.equal(telemetryRate(render(), 1), 0);
    assert.equal(frames.length, 0);

    unmount();
    assert.equal(clock.pending, 0);
    assert.equal(node.listenerCount('uavcan.equipment.esc.Status'), 0);
});

test('ESC opens in read-only mode and displays incoming telemetry and short RawCommand without transmitting', t => {
    const { node, transfers, frames, workers, render, unmount } = setup(t, 'EscPanel');
    const initial = render();
    assert.ok(readOnlyCheckbox(initial));
    assert.equal(readOnlyCheckbox(initial).props.checked, true);
    assert.equal(workers.length, 0);
    assert.equal(panelCheckbox(initial, 'Send Safety'), undefined);
    assert.equal(findElement(initial, el => el.type === 'Button' && ['Arm', 'Disarm'].includes(el.props.children)), undefined);
    const start = findElement(initial, el => el.props['aria-label'] === 'Start broadcasting');
    assert.ok(!start || start.props.disabled);
    assert.equal(findElement(initial, el => el.type === 'Button' && el.props.children === 'Stop All').props.disabled, true);

    const status = new DSDL.uavcan_equipment_esc_Status();
    status.fields.esc_index.value = 0;
    status.fields.voltage.value = 23.5;
    status.fields.rpm.value = 4200;
    receiveBroadcast(node, 45, status);
    receiveEscCommand(node, 42, [8191, -8192]);
    const observing = render();
    assert.ok(escText(observing, '23.50 V'));
    assert.ok(escText(observing, 'RPM: 4200'));
    assert.ok(escText(observing, 'node 42 · cmd: [8191, -8192]'));
    for (const value of [100, -100]) {
        assert.ok(findElement(observing, el => el.type === 'Slider' && el.props.value === value && el.props.disabled));
    }
    assert.ok(findElement(observing, el => el.type === 'TextField' && el.props.value === '' && el.props.disabled));
    assert.equal(readOnlyCheckbox(observing).props.checked, true);
    assert.equal(readOnlyCheckbox(observing).props.disabled, true);
    assert.equal(workers.length, 0);

    // A local loopback frame cannot replace the external values on screen.
    receiveEscCommand(node, node.nodeId, [0, 0]);
    assert.ok(findElement(render(), el => el.type === 'Slider' && el.props.value === 100));

    node.emit('before-disconnect');
    node.changeBus(1);
    assert.equal(readOnlyCheckbox(render()).props.checked, true);
    unmount();
    assert.equal(frames.length, 0);
    assert.equal(transfers.length, 0);
    assert.equal(node.listenerCount('uavcan.equipment.esc.RawCommand'), 0);
    assert.equal(node.listenerCount('uavcan.equipment.esc.Status'), 0);
});

test('ESC control starts at zero and Send Arming works independently of RawCommand', t => {
    const { node, transfers, workers, render } = setup(t, 'EscPanel');
    setReadOnly(render(), false);
    const paused = render();
    assert.equal(panelCheckbox(paused, 'Send Safety'), undefined);
    assert.equal(panelCheckbox(paused, 'Send Arming').props.checked, false);
    assert.equal(findElement(paused, el => el.type === 'Button' && ['Arm', 'Disarm'].includes(el.props.children)), undefined);
    const runTicks = (...ticks) => {
        transfers.length = 0;
        for (const tick of ticks) workers[0].onmessage(tick);
        return transfers.map(transfer => transfer.payload.name);
    };

    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), []);
    setPanelCheckbox(paused, 'Send Arming', true);
    render();
    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), [ARMING_STATUS]);
    assert.equal(transfers[0].payload.fields.status.value, node.escCommandSpec.arming.STATUS_FULLY_ARMED);
    transfers.length = 0;
    setPanelCheckbox(render(), 'Send Arming', false);
    render();
    assert.equal(transfers.length, 0, 'unchecking a status stream sends no immediate frame');

    toggleEscBroadcast(render());
    render();
    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), [RAW_COMMAND]);
    assert.deepEqual(rawThrust(transfers[0]), [0, 0, 0, 0]);
    moveFirstSlider(render(), 50);
    render();
    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), [RAW_COMMAND]);
    assert.ok(rawThrust(transfers[0])[0] > 0, 'Send Arming is optional for the local RawCommand stream');

    setPanelCheckbox(render(), 'Send Arming', true);
    render();
    assert.deepEqual(runTicks(safetyTick, armingTick), [ARMING_STATUS]);

    transfers.length = 0;
    toggleEscBroadcast(render(), 'Pause broadcasting');
    const pausedWithSetpoint = render();
    assert.equal(transfers.length, 0, 'Pause does not send a zero or safe-state frame');
    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), [ARMING_STATUS]);
    assert.equal(findElement(pausedWithSetpoint, el => el.type === 'Slider').props.value, 50, 'Pause preserves the setpoint');
    moveFirstSlider(pausedWithSetpoint, 25);
    toggleEscBroadcast(render());
    render();
    assert.deepEqual(runTicks(escTick, safetyTick, armingTick), [RAW_COMMAND, ARMING_STATUS]);
    assert.deepEqual(rawThrust(transfers[0]), [Math.round(node.escCommandSpec.max / 4), 0, 0, 0]);

    toggleEscBroadcast(render(), 'Pause broadcasting');
    render();
    transfers.length = 0;
    setReadOnly(render(), true);
    assert.deepEqual(transfers.map(transfer => transfer.payload.name), [ARMING_STATUS]);
    assert.equal(transfers[0].payload.fields.status.value, node.escCommandSpec.arming.STATUS_DISARMED);
    setReadOnly(render(), false);
    assert.equal(panelCheckbox(render(), 'Send Arming').props.checked, false);
});

test('ESC external command interrupts active local control synchronously without a stop frame', t => {
    const timeouts = new Map();
    const { node, frames, transfers, workers, render } = setup(t, 'EscPanel', {
        setTimeout(callback, delay) {
            const timer = Symbol();
            timeouts.set(timer, { callback, delay });
            return timer;
        },
        clearTimeout(timer) { timeouts.delete(timer); }
    });

    setReadOnly(render(), false);
    toggleEscBroadcast(render());
    setPanelCheckbox(render(), 'Send Arming', true);
    moveFirstSlider(render(), 50);
    render();
    const oldTick = workers[0].onmessage;
    for (const tick of [escTick, safetyTick, armingTick]) oldTick(tick);
    assert.deepEqual(transfers.map(transfer => transfer.payload.name), [RAW_COMMAND, ARMING_STATUS]);
    assert.ok(rawThrust(transfers[0])[0] > 0);
    transfers.length = 0;
    frames.length = 0;

    receiveEscCommand(node, 42, [-8192]);
    for (const tick of [escTick, safetyTick, armingTick]) oldTick(tick);
    assert.equal(frames.length, 0, 'a queued callback cannot transmit before the observer UI commits');
    assert.equal(transfers.length, 0);
    const observing = render();
    assert.equal(workers[0].terminated, true);
    assert.equal(findElement(observing, el => el.type === 'Button' && ['Arm', 'Disarm'].includes(el.props.children)), undefined);
    assert.equal(readOnlyCheckbox(observing).props.checked, true);
    assert.equal(readOnlyCheckbox(observing).props.disabled, true);
    assert.ok(escText(observing, 'node 42 · cmd: [-8192]'));

    receiveEscCommand(node, 42, [8191], 1);
    const displayTimers = [...timeouts].filter(([, timeout]) => timeout.delay === 100);
    assert.equal(displayTimers.length, 1);
    const [[displayTimer, { callback: publishLatest }]] = displayTimers;
    timeouts.delete(displayTimer);
    publishLatest();
    assert.ok(escText(render(), 'node 42 · cmd: [8191]'));

    const unlockTimers = [...timeouts].filter(([, timeout]) => timeout.delay === 2000);
    assert.equal(unlockTimers.length, 1, 'each new external command replaces the old unlock timer');
    const [[unlockTimer, { callback: unlock }]] = unlockTimers;
    timeouts.delete(unlockTimer);
    unlock();
    const unlockedObserver = render();
    assert.equal(readOnlyCheckbox(unlockedObserver).props.checked, true);
    assert.notEqual(readOnlyCheckbox(unlockedObserver).props.disabled, true);
    assert.equal(frames.length, 0);

    setReadOnly(unlockedObserver, false);
    const paused = render();
    assert.equal(panelCheckbox(paused, 'Send Arming').props.checked, false, 'Send Arming requires a fresh opt-in');
    const newWorker = workers[1];
    for (const tick of [escTick, safetyTick, armingTick]) newWorker.onmessage(tick);
    oldTick(escTick);
    assert.equal(frames.length, 0);
    toggleEscBroadcast(paused);
    render();
    for (const tick of [escTick, safetyTick, armingTick]) newWorker.onmessage(tick);
    assert.deepEqual(transfers.map(transfer => transfer.payload.name), [RAW_COMMAND]);
    assert.deepEqual(rawThrust(transfers[0]), [0, 0, 0, 0]);

    transfers.length = 0;
    const tickBeforeManualRelease = newWorker.onmessage;
    setReadOnly(render(), true);
    assert.deepEqual(transfers.map(transfer => transfer.payload.name), [RAW_COMMAND]);
    assert.deepEqual(rawThrust(transfers[0]), [0, 0, 0, 0]);
    assert.equal(readOnlyCheckbox(render()).props.checked, true);
    assert.equal(newWorker.terminated, true);
    frames.length = 0;
    for (const tick of [escTick, safetyTick, armingTick]) tickBeforeManualRelease(tick);
    node.emit('before-disconnect');
    assert.equal(frames.length, 0);
});

test('ESC bus change releases the old bus and the replacement panel returns to read-only mode', t => {
    const { node, transfers, workers, render } = setup(t, 'EscPanel');
    setReadOnly(render(), false);
    toggleEscBroadcast(render());
    setPanelCheckbox(render(), 'Send Arming', true);
    moveFirstSlider(render(), 50);
    render();
    const oldTick = workers[0].onmessage;
    oldTick(escTick);
    assert(rawThrust(transfers.pop())[0] > 0);

    node.changeBus(1);
    assert.deepEqual(transfers.map(xfer => [xfer.bus, xfer.payload.name]), [
        [0, RAW_COMMAND],
        [0, ARMING_STATUS]
    ]);
    assert.deepEqual(rawThrust(transfers[0]), [0, 0, 0, 0]);
    assert.equal(transfers[1].payload.fields.status.value, node.escCommandSpec.arming.STATUS_DISARMED);
    transfers.length = 0;
    oldTick(escTick); // The callback was already queued before the React remount.
    oldTick(armingTick);
    assert.equal(transfers.length, 0);

    const newTree = render();
    assert.equal(workers[0].terminated, true);
    assert.equal(workers.length, 1);
    assert.equal(readOnlyCheckbox(newTree).props.checked, true);
    assert.equal(transfers.length, 0);

    setReadOnly(newTree, false);
    const enabledTree = render();
    assert.equal(workers[1].messages.at(-1).command, 'stop');
    workers[1].onmessage(escTick);
    assert.equal(transfers.length, 0);
    toggleEscBroadcast(enabledTree);
    render();
    for (const tick of [escTick, safetyTick, armingTick]) workers[1].onmessage(tick);
    assert.deepEqual(transfers.map(transfer => transfer.payload.name), [RAW_COMMAND]);
    assert.equal(transfers[0].bus, 1);
    assert.deepEqual(rawThrust(transfers[0]), [0, 0, 0, 0]);
});

test('Actuator telemetry FPS tracks each ID and starts fresh when the reporting node changes', t => {
    const clock = panelClock();
    const { node, render, hasPendingRender, unmount } = setup(t, 'ActuatorPanel', clock.globals);
    const statuses = [0, 1].map(id => {
        const message = new DSDL.uavcan_equipment_actuator_Status();
        message.fields.actuator_id.value = id;
        return message;
    });
    const nextTransferIds = new Map();
    const receiveStatus = (id, source) => {
        const transferId = nextTransferIds.get(source) ?? 0;
        nextTransferIds.set(source, (transferId + 1) % 32);
        // CAN frames are timestamped in the opener, whose monotonic clock starts earlier.
        receiveBroadcast(node, source, statuses[id], transferId, clock.now() + 20_000);
    };
    function deliverFor(durationMs, channels) {
        for (let elapsed = 50; elapsed <= durationMs; elapsed += 50) {
            clock.advance(50);
            for (const { id, source, period } of channels) {
                if (clock.now() % period === 0) receiveStatus(id, source);
            }
        }
    }

    assert.equal(telemetryRate(render(), 0, 'ID'), 0);
    const channel1 = { id: 1, source: 45, period: 250 };
    deliverFor(3000, [{ id: 0, source: 45, period: 100 }, channel1]);
    let tree = render();
    assert.equal(telemetryRate(tree, 0, 'ID'), 10);
    assert.equal(telemetryRate(tree, 1, 'ID'), 4);
    assert.equal(telemetryRate(tree, 2, 'ID'), 0);

    clock.advance(50);
    receiveStatus(0, 46);
    tree = render();
    assert.equal(telemetryRate(tree, 0, 'ID'), 0, 'the new source starts a new rate sample');
    assert.equal(telemetryRate(tree, 1, 'ID'), 4);
    deliverFor(2950, [{ id: 0, source: 46, period: 200 }, channel1]);
    tree = render();
    assert.equal(telemetryRate(tree, 0, 'ID'), 5);
    assert.equal(telemetryRate(tree, 1, 'ID'), 4);

    deliverFor(950, [channel1]);
    assert.ok(telemetryRate(render(), 0, 'ID') > 0);
    deliverFor(350, [channel1]);
    tree = render();
    assert.equal(telemetryRate(tree, 0, 'ID'), 0);
    assert.equal(telemetryRate(tree, 1, 'ID'), 4);

    clock.advance(1300);
    assert.ok(hasPendingRender(), 'idle channels expire without an incoming frame');
    assert.equal(telemetryRate(render(), 1, 'ID'), 0);
    unmount();
    assert.equal(clock.pending, 0);
    assert.equal(node.listenerCount('uavcan.equipment.actuator.Status'), 0);
});

test('Actuator telemetry measures 0.5 FPS when the same ID reports every two seconds', t => {
    const clock = panelClock();
    const { node, render } = setup(t, 'ActuatorPanel', clock.globals);
    const status = new DSDL.uavcan_equipment_actuator_Status();
    status.fields.actuator_id.value = 0;
    render();
    receiveBroadcast(node, 45, status, 0, clock.now() + 20_000);
    assert.equal(telemetryRate(render(), 0, 'ID'), 0);

    for (const transferId of [1, 2]) {
        clock.advance(2000);
        receiveBroadcast(node, 45, status, transferId, clock.now() + 20_000);
        assert.equal(telemetryRate(render(), 0, 'ID'), 0.5);
    }

    clock.advance(1500);
    assert.equal(telemetryRate(render(), 0, 'ID'), 0);
});

test('Actuator Send Safety publishes at 2 Hz independently and unchecking leaves actuator output running', t => {
    const clock = panelClock();
    const { node, transfers, workers, render, unmount } = setup(t, 'ActuatorPanel', clock.globals);
    const initial = render();
    assert.equal(panelCheckbox(initial, 'Send Safety').props.checked, false);
    const worker = workers[0];
    const workerSide = { postMessage: data => worker.onmessage({ data }) };
    loadModule('src/workers/actuator-command-worker.js', {}, {
        self: workerSide, console: { log() {}, warn() {} }, ...clock.globals
    });
    const updateWorker = () => {
        for (const data of worker.messages.splice(0)) workerSide.onmessage({ data });
    };
    const safetyTimes = [];
    node.on('transfer-tx', transfer => {
        if (transfer.payload.name === SAFETY_STATE) safetyTimes.push(clock.now());
    });

    updateWorker();
    clock.advance(600);
    assert.deepEqual(transfers, []);

    setPanelCheckbox(render(), 'Send Safety', true);
    render();
    updateWorker();
    clock.advance(1600);
    assert.ok(safetyTimes.length >= 3);
    assert.ok(safetyTimes.slice(1).every((time, index) => time - safetyTimes[index] === 500));
    assert.equal(transfers.length, safetyTimes.length, 'no Actuator ArrayCommand while paused');
    for (const transfer of transfers) {
        assert.equal(transfer.payload.fields.status.value, node.escCommandSpec.safety.STATUS_SAFETY_OFF);
    }

    startAtZero(render());
    moveFirstSlider(render(), 0.5);
    render();
    updateWorker();
    clock.advance(600);
    assert.ok(transfers.some(transfer => transfer.payload.name === 'uavcan.equipment.actuator.ArrayCommand'));
    const queuedTick = worker.onmessage;
    transfers.length = 0;
    setPanelCheckbox(render(), 'Send Safety', false);
    queuedTick(safetyTick);
    assert.deepEqual(transfers, [], 'unchecking blocks a pending Safety tick without a fallback frame');
    render();
    updateWorker();
    clock.advance(600);
    assert.ok(transfers.length > 0);
    for (const transfer of transfers) {
        assert.equal(transfer.payload.name, 'uavcan.equipment.actuator.ArrayCommand');
        assert.deepEqual(actuatorValues(transfer), [0.5, 0, 0, 0]);
    }
    transfers.length = 0;
    unmount();
    assert.ok(transfers.every(transfer => transfer.payload.name !== SAFETY_STATE));
});

const actuatorSafetyReleases = {
    'bus change': ({ node, render }) => {
        node.changeBus(1);
        render();
    },
    'adapter disconnect': ({ node, render }) => {
        node.emit('before-disconnect');
        node.setNodeId(null);
        node.setNodeId(127);
        render();
    },
    'popup close': ({ unmount }) => unmount()
};

for (const [label, release] of Object.entries(actuatorSafetyReleases)) {
    test(`Actuator Send Safety releases the old session once on ${label}`, t => {
        const panel = setup(t, 'ActuatorPanel');
        const { node, transfers, workers, render } = panel;
        setPanelCheckbox(render(), 'Send Safety', true);
        render();
        const previousSession = node.sessionId;
        const oldWorker = workers[0];
        const queuedTick = oldWorker.onmessage;
        queuedTick(safetyTick);
        assert.equal(transfers.pop().payload.fields.status.value, node.escCommandSpec.safety.STATUS_SAFETY_OFF);

        release(panel);
        queuedTick(safetyTick);
        assert.equal(oldWorker.terminated, true);
        assert.deepEqual(transfers.map(transfer => [
            transfer.bus, transfer.sessionId, transfer.payload.name, transfer.payload.fields.status.value
        ]), [[0, previousSession, SAFETY_STATE, node.escCommandSpec.safety.STATUS_SAFETY_ON]]);
        if (label !== 'popup close') {
            assert.equal(panelCheckbox(render(), 'Send Safety').props.checked, false);
            workers[1].onmessage(safetyTick);
            assert.equal(transfers.length, 1);
        }
    });
}

test('actuator disconnect stops queued output and reconnect requires an explicit zero start', t => {
    const { node, transfers, workers, render } = setup(t, 'ActuatorPanel');
    startAtZero(render());
    moveFirstSlider(render(), 0.5);
    render();
    const oldTick = workers[0].onmessage;
    oldTick(actuatorTick);
    assert.deepEqual(actuatorValues(transfers.pop()), [0.5, 0, 0, 0]);

    node.setNodeId(null);
    oldTick(actuatorTick);
    node.setNodeId(127);
    oldTick(actuatorTick);
    assert.equal(transfers.length, 0);

    const newTree = render();
    assert.equal(workers[0].terminated, true);
    assert.equal(workers[1].messages.at(-1).command, 'stop');
    workers[1].onmessage(actuatorTick);
    assert.equal(transfers.length, 0);
    startAtZero(newTree);
    render();
    workers[1].onmessage(actuatorTick);
    assert.deepEqual(actuatorValues(transfers[0]), [0, 0, 0, 0]);
});
