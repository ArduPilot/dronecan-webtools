const assert = require('node:assert/strict');
const test = require('node:test');
const React = require('react');
const Node = require('../src/dronecan/node');
const Transfer = require('../src/dronecan/transfer');
const TransferManager = require('../src/dronecan/transfer_manager');
const DSDL = require('../src/dronecan/dsdl');
const ArrayType = require('../src/dronecan/array_type');
const PrimitiveType = require('../src/dronecan/primitive_type');
const { loadModule } = require('./load-module.cjs');

function createNode(t, nodeId, NodeClass = Node) {
    const node = new NodeClass({ nodeId });
    clearInterval(node.nodeStatusIntervalID);
    const frames = [];
    node.on('sendFrame', (id, data, len, bus) => frames.push([id, data, len, bus]));
    t.after(() => {
        node.removeAllListeners();
        for (const { transfer } of node.callbacks.values()) node.cancelRequest(transfer);
    });
    return { node, frames };
}

function receive(node, frames) {
    for (const frame of frames) node.emit('can-frame', ...frame);
}

function reply(node, request, payload, sourceNodeId = request.destNodeId, destNodeId = request.sourceNodeId) {
    const transfer = new Transfer({
        transferId: request.transferId, sourceNodeId, destNodeId, payload, serviceNotMessage: true
    });
    for (const frame of transfer.toFrames(payload)) node.handleFrame(frame);
}

function parameter(name, value = 1) {
    const response = new DSDL.uavcan_protocol_param_GetSet_Response();
    for (const fieldName of ['value', 'default_value', 'min_value', 'max_value']) {
        response.fields[fieldName].msg.fields.empty = new DSDL.uavcan_protocol_param_Empty();
    }
    if (name) {
        response.fields.name.fromString(name);
        const valueField = response.fields.value.msg;
        valueField.unionFieldIndex.value = 1;
        valueField.fields.integer_value = new PrimitiveType(value, PrimitiveType.KIND_SIGNED_INT, 64);
    }
    return response;
}

const parameterNames = (node, nodeId) => Object.values(node.nodeParams[nodeId])
    .map(response => response.fields.name.toString());

function createParamClient(t) {
    const timers = new Map();
    const TimedNode = loadModule('src/dronecan/node.js', {}, {
        RangeError, // Match the realm of the imported TransferManager.
        setInterval: () => null,
        setTimeout(callback, delay) {
            const timer = Symbol();
            timers.set(timer, { callback, delay });
            return timer;
        },
        clearTimeout(timer) { timers.delete(timer); }
    });
    const { node } = createNode(t, 127, TimedNode);
    const requests = [];
    node.on('transfer-tx', transfer => requests.push(transfer));

    function expire(request, expectedDelay) {
        const pending = node.callbacks.get(request.serviceKey);
        assert.equal(pending?.transfer, request);
        const timeout = timers.get(pending.timer);
        assert.equal(timeout?.delay, expectedDelay);
        timers.delete(pending.timer);
        timeout.callback();
    }
    function expireReservations() {
        assert.equal(timers.size, node.cancelledServiceKeys.size);
        for (const [id, timer] of timers) {
            assert.equal(timer.delay, TransferManager.TRANSFER_TIMEOUT_MS);
            timers.delete(id);
            timer.callback();
        }
        assert.equal(node.cancelledServiceKeys.size, 0);
    }
    return { node, requests, timers, expireReservations, expire };
}

test('transfer IDs advance per descriptor and broadcast traffic leaves requests pending', t => {
    const { node } = createNode(t, 127);
    const pending = node.getNodeInfo(42);
    for (let i = 0; i < 32; i++) {
        const broadcast = node.request({
            req: new DSDL.uavcan_protocol_NodeStatus(), destNodeId: i, serviceNotMessage: false
        });
        assert.equal(broadcast.transferId, i);
    }
    assert.equal(node.callbacks.size, 1);
    assert.equal(node.callbacks.get(pending.serviceKey).transfer, pending);
    assert.equal(node.getNodeInfo(42).transferId, 1);
    assert.equal(node.getNodeInfo(43).transferId, 0);
    assert.equal(node.restartNode(42).transferId, 0);
});

test('GetNodeInfo responds only to its destination with the request ID and priority', t => {
    const client = createNode(t, 127);
    const server = createNode(t, 42);
    let response;
    const request = client.node.request({
        req: new DSDL.uavcan_protocol_GetNodeInfo_Request(),
        destNodeId: 42,
        priority: 11,
        callback: transfer => { response = transfer; }
    });

    const ignored = createNode(t, 43);
    receive(ignored.node, client.frames);
    assert.equal(ignored.frames.length, 0);

    const unrelated = new DSDL.uavcan_protocol_RestartNode_Response();
    unrelated.fields.ok.value = true;
    reply(client.node, request, unrelated);
    assert.equal(response, undefined);
    assert.equal(client.node.callbacks.size, 1);

    receive(server.node, client.frames);
    assert(server.frames.length > 0);
    const foreign = createNode(t, 44);
    foreign.node.getNodeInfo(42, () => assert.fail('Reply belongs to node 127'));
    receive(foreign.node, server.frames);
    assert.equal(foreign.node.callbacks.size, 1);

    receive(client.node, server.frames);
    assert(response.isResponseTo(request));
    assert.equal(response.transferPriority, 11);
    assert.equal(response.payload.fields.name.toString(), server.node.name);
    assert.equal(client.node.callbacks.size, 0);
});

function createNodeMonitor(t) {
    let now = 0;
    let maintenanceTick;
    const TimedNode = loadModule('src/dronecan/node.js', {}, {
        performance: { now: () => now },
        setInterval(callback) { maintenanceTick = callback; },
    });
    const { node } = createNode(t, 127, TimedNode);
    function heartbeat(id, uptime, mode = 0) {
        const payload = new DSDL.uavcan_protocol_NodeStatus();
        payload.fields.uptime_sec.value = uptime;
        payload.fields.mode.value = mode;
        node.emit('uavcan.protocol.NodeStatus', { sourceNodeId: id, payload });
    }
    function tick(time) {
        now = time;
        maintenanceTick();
    }
    return { node, heartbeat, tick };
}

test('a quiet bus marks each node offline from its own last heartbeat and restores it on return', t => {
    const { node, heartbeat, tick } = createNodeMonitor(t);
    let updates = 0;
    node.on('nodeList', () => updates++);
    heartbeat(10, 12);
    heartbeat(42, 30);
    tick(2000);
    heartbeat(42, 32);
    tick(2999);
    assert.equal(node.nodeMonitors[10].offline, false);
    const beforeTimeout = updates;
    tick(3000);
    assert.equal(node.nodeMonitors[10].offline, true);
    assert.equal(node.nodeMonitors[10].status.uptime_sec, 12);
    assert.equal(node.nodeMonitors[42].offline, false);
    assert.equal(updates, beforeTimeout + 1);
    tick(4999);
    assert.equal(updates, beforeTimeout + 1);
    tick(5000);
    assert.equal(node.nodeMonitors[42].offline, true);
    heartbeat(10, 0);
    assert.equal(node.nodeMonitors[10].offline, false);
    assert.equal(node.nodeMonitors[42].offline, true);

    node.changeBus(1);
    heartbeat(10, 75);
    tick(7999);
    assert.equal(node.nodeMonitors[10].offline, false);
    assert.equal(node.nodeMonitors[42], undefined);
});

test('GetNodeInfo preserves heartbeat freshness and an explicit OFFLINE clears only on a live heartbeat', t => {
    const { node, heartbeat, tick } = createNodeMonitor(t);
    heartbeat(10, 12);
    tick(2500);
    const info = new DSDL.uavcan_protocol_GetNodeInfo_Response();
    info.fields.name.fromString('test.periph');
    reply(node, node.getNodeInfo(10), info);
    assert.equal(node.nodeMonitors[10].status.uptime_sec, 12);
    tick(3000);
    assert.equal(node.nodeMonitors[10].offline, true);
    assert.equal(node.nodeMonitors[10].name, 'test.periph');

    heartbeat(10, 15);
    assert.equal(node.nodeMonitors[10].offline, false);
    heartbeat(10, 16, DSDL.uavcan_protocol_NodeStatus.CONSTANTS.mode.OFFLINE);
    assert.equal(node.nodeMonitors[10].offline, true);
    reply(node, node.getNodeInfo(10), info);
    assert.equal(node.nodeMonitors[10].offline, true);
    heartbeat(10, 17);
    assert.equal(node.nodeMonitors[10].offline, false);
});

test('parallel requests to the same node and to another node can finish out of order', t => {
    const client = createNode(t, 127);
    const target = createNode(t, 42);
    const otherTarget = createNode(t, 43);
    const seen = [];
    const requests = [
        client.node.getNodeInfo(42, () => seen.push('first')),
        client.node.getNodeInfo(42, () => seen.push('second')),
        client.node.getNodeInfo(43, () => seen.push('third')),
    ];
    assert.deepEqual(requests.map(request => request.transferId), [0, 1, 0]);
    receive(target.node, client.frames.slice(1, 2));
    receive(otherTarget.node, client.frames.slice(2, 3));
    receive(client.node, otherTarget.frames);
    receive(client.node, target.frames.splice(0));
    receive(target.node, client.frames.slice(0, 1));
    receive(client.node, target.frames);
    assert.deepEqual(seen, ['third', 'second', 'first']);
    assert.equal(client.node.callbacks.size, 0);
});

test('unanswered requests expire without consuming a subsequent valid response', async t => {
    const client = createNode(t, 127);
    const server = createNode(t, 42);
    const error = await new Promise(resolve => {
        const request = client.node.request({
            req: new DSDL.uavcan_protocol_GetNodeInfo_Request(),
            destNodeId: 42,
            timeoutMs: 10,
            callback: () => assert.fail('Expired request callback'),
            onError: resolve
        });
        client.node.callbacks.get(request.serviceKey).timer.ref();
    });
    assert.equal(error.code, 'REQUEST_TIMEOUT');
    assert.equal(client.node.callbacks.size, 0);

    let nextResponse;
    client.node.getNodeInfo(42, transfer => { nextResponse = transfer; });
    receive(server.node, client.frames.slice(0, 1));
    receive(client.node, server.frames.splice(0));
    assert.equal(nextResponse, undefined);
    receive(server.node, client.frames.slice(1));
    receive(client.node, server.frames);
    assert.equal(nextResponse.transferId, 1);
});

test('a descriptor wrap cannot overwrite an outstanding request', t => {
    const { node } = createNode(t, 127);
    const requests = Array.from({ length: 32 }, () => node.restartNode(42));
    assert.equal(node.restartNode(42, null, error => assert.equal(error.code, 'REQUEST_PENDING')), null);
    assert.equal(node.callbacks.size, 32);
    assert.equal(node.cancelRequest(requests[0]), true);
    // A cancelled transfer ID remains reserved while its late reply could arrive.
    assert.equal(node.restartNode(42, null, error => assert.equal(error.code, 'REQUEST_PENDING')), null);
    assert.equal(node.cancelRequest(requests[0]), false);
});

test('bus changes drop pending requests, parameters, nodes and incomplete transfers', t => {
    const client = createNode(t, 127);
    const server = createNode(t, 42);
    const transitions = [];
    client.node.on('before-bus-change', () => transitions.push(client.node.bus));
    client.node.on('session-change', () => transitions.push(client.node.bus));

    let requestError;
    client.node.getNodeInfo(42, () => assert.fail('Previous bus response delivered'), error => { requestError = error; });
    receive(server.node, client.frames);
    let received = 0;
    client.node.on('transfer-rx', () => received++);
    assert.ok(server.frames.length > 1);
    receive(client.node, server.frames.slice(0, 1));
    assert.equal(received, 0);
    client.node.nodeMonitors[42] = {};
    client.node.nodeParams[42] = {};
    client.node.changeBus(1);
    assert.deepEqual(transitions, [0, 1]);
    assert.equal(client.node.sessionId, 1);
    assert.equal(requestError.code, 'SESSION_RESET');
    assert.equal(client.node.callbacks.size, 0);
    assert.deepEqual(client.node.nodeMonitors, {});
    assert.deepEqual(client.node.nodeParams, {});

    client.node.getNodeInfo(42, () => assert.fail('Wrong bus response delivered'));
    // A trailing fragment on the new bus cannot complete a transfer started on the old one.
    receive(client.node, server.frames.slice(1).map(([id, data, len]) => [id, data, len, 1]));
    receive(client.node, server.frames);
    assert.equal(received, 0);
    assert.equal(client.node.callbacks.size, 1);
});

test('malformed or expired fragments do not produce a partial transfer', t => {
    const client = createNode(t, 127);
    const server = createNode(t, 42);
    const transfers = new TransferManager();
    client.node.getNodeInfo(42);
    receive(server.node, client.frames);

    const Frame = require('../src/dronecan/frame');
    const frames = server.frames.map(([id, data]) => new Frame(id & 0x1FFFFFFF, data, true, false));
    assert.equal(transfers.addFrame(frames[0], 0), null);
    for (const frame of frames.slice(1)) assert.equal(transfers.addFrame(frame, 3000), null);

    frames[0].data[0] ^= 1; // Corrupt CRC.
    for (const frame of frames) assert.equal(transfers.addFrame(frame), null);
});

test('File.Read can emit an EOF reply and every short or full chunk', t => {
    const client = createNode(t, 127);
    const server = createNode(t, 42);
    let data;
    server.node.on('uavcan.protocol.file.Read.Request', transfer => {
        const response = server.node.responseUavcanProtocolFileRead(transfer, 0, transfer.payload.fields.path, data);
        assert(response.isResponseTo(transfer));
    });
    for (const size of [0, 1, 2, 3, 255, 256]) {
        data = Uint8Array.from({ length: size }, (_, i) => i % 256);
        const request = new DSDL.uavcan_protocol_file_Read_Request();
        request.fields.offset.value = 256;
        request.fields.path.fields.path.fromString('firmware');
        let response;
        client.node.request({ req: request, destNodeId: 42, callback: transfer => { response = transfer; } });
        receive(server.node, client.frames.splice(0));
        receive(client.node, server.frames.splice(0));
        assert.equal(response.payload.fields.error.fields.value.value, 0);
        assert.deepEqual(response.payload.fields.data.toObj(true), [...data]);
    }

    const oversized = new DSDL.uavcan_protocol_file_Read_Request();
    oversized.fields.offset.value = 0;
    data = new Uint8Array(257);
    client.node.request({ req: oversized, destNodeId: 42 });
    assert.throws(() => receive(server.node, client.frames), /Array is full/);
    assert.equal(server.frames.length, 0);
});

test('Fetch All clears the selected node and notifies synchronously even if the first request fails', t => {
    const { node } = createNode(t, 127);
    const oldCache = { 0: parameter('OLD_FIRST'), 1: parameter('OLD_SECOND') };
    const otherCache = { 0: parameter('OTHER_NODE') };
    node.nodeParams[42] = oldCache;
    node.nodeParams[43] = otherCache;
    node.removeAllListeners('sendFrame'); // Requests fail synchronously as disconnected.

    const notifications = [];
    const errors = [];
    node.on('node-params', id => notifications.push([id, node.paramFetchStatus[id].phase, parameterNames(node, id)]));
    node.on('request-error', error => errors.push(error.code));
    node.fetchAllNodeParams(42);

    assert.notEqual(node.nodeParams[42], oldCache);
    assert.equal(node.nodeParams[43], otherCache);
    assert.deepEqual(notifications, [[42, 'loading', []], [42, 'failed', []]]);
    assert.deepEqual(errors, ['NOT_CONNECTED']);
    assert.equal(typeof node.paramFetchStatus[42].error, 'string');
    assert.equal(node.callbacks.size, 0);
});

test('Fetch All on node 125 retries index 10 after reading ten parameters, then reads all 20', t => {
    const { node, requests, expireReservations, expire } = createParamClient(t);
    const nodeId = 125;
    const missedIndex = 10;
    const expected = Array.from({ length: 20 }, (_, index) => `PARAM_${index + 1}`);
    node.nodeParams[nodeId] = { 0: parameter('OLD') };
    node.on('sendFrame', () => {
        if (requests.length === 0) {
            assert.deepEqual(parameterNames(node, nodeId), [], 'the cache is empty before sending index 0');
        }
    });
    node.on('transfer-tx', transfer => {
        assert.equal(transfer.destNodeId, nodeId);
        assert.equal(node.callbacks.size, 1, 'no second read is pending when a new request goes out');
    });
    node.fetchAllNodeParams(nodeId);
    const cache = node.nodeParams[nodeId];
    for (const [index, name] of expected.entries()) {
        if (index === missedIndex) {
            const missed = requests.at(-1);
            expire(missed, 1000);
            const retry = requests.at(-1);
            assert.notEqual(retry.transferId, missed.transferId);
            const { phase, index: retryIndex, attempt, maxAttempts } = node.paramFetchStatus[nodeId];
            assert.deepEqual([phase, retryIndex, attempt, maxAttempts], ['retrying', index, 2, 4]);
            reply(node, missed, parameter('LATE_INDEX_10'));
            assert.equal(requests.at(-1), retry, 'the expired transfer ID cannot advance the fetch');
            assert.deepEqual(parameterNames(node, nodeId), expected.slice(0, index));
        }
        const request = requests.at(-1);
        assert.equal(request.payload.fields.index.value, index);
        reply(node, request, parameter(name));
        assert.equal(node.paramFetchStatus[nodeId].phase, 'loading');
        assert.equal(node.nodeParams[nodeId], cache);
    }

    reply(node, requests.at(-1), parameter());
    const expectedIndexes = expected.map((_, index) => index);
    expectedIndexes.splice(missedIndex, 0, missedIndex);
    expectedIndexes.push(20);
    assert.deepEqual(requests.map(request => request.payload.fields.index.value), expectedIndexes);
    assert.deepEqual(parameterNames(node, nodeId), expected);
    assert.equal(node.paramFetchStatus[nodeId].phase, 'complete');
    assert.equal(node.callbacks.size, 0);
    expireReservations();
});

test('Fetch All waits for a cancelled transfer ID when fast reads wrap the sequence', t => {
    const { node, requests, timers, expire } = createParamClient(t);
    node.fetchAllNodeParams(42);
    expire(requests[0], 1000);
    for (let index = 0; index < 31; index++) {
        const request = requests.at(-1);
        assert.equal(request.payload.fields.index.value, index);
        reply(node, request, parameter('P' + index));
    }
    assert.equal(node.paramFetchStatus[42].phase, 'retrying');
    assert.equal(node.callbacks.size, 0);
    reply(node, requests[0], parameter('LATE'));
    const waiting = [...timers];
    assert.equal(waiting.length, 2); // Release the old ID, then retry the blocked index.
    for (const [id, timer] of waiting) {
        assert.equal(timer.delay, TransferManager.TRANSFER_TIMEOUT_MS);
        timers.delete(id);
        timer.callback();
    }
    assert.equal(requests.at(-1).payload.fields.index.value, 31);
    reply(node, requests.at(-1), parameter('P31'));
    reply(node, requests.at(-1), parameter());
    assert.equal(node.paramFetchStatus[42].phase, 'complete');
    assert.deepEqual(parameterNames(node, 42), Array.from({ length: 32 }, (_, i) => 'P' + i));
});

test('Fetch All exhausts exactly three timeout retries and keeps current partial data', t => {
    const { node, requests, expireReservations, expire } = createParamClient(t);
    node.fetchAllNodeParams(42);
    reply(node, requests[0], parameter('CURRENT'));

    for (let attempt = 1; attempt <= 4; attempt++) {
        assert.equal(requests.length, attempt + 1);
        const request = requests.at(-1);
        assert.equal(request.payload.fields.index.value, 1);
        const status = node.paramFetchStatus[42];
        if (attempt > 1) {
            assert.equal(status.phase, 'retrying');
            assert.equal(status.attempt, attempt);
        }
        expire(request, attempt === 1 ? 1000 : 2000);
        assert.deepEqual(parameterNames(node, 42), ['CURRENT']);
    }
    const { phase, index, attempt, error } = node.paramFetchStatus[42];
    assert.deepEqual([phase, index, attempt], ['failed', 1, 4]);
    assert.match(error, /timed out/i);
    assert.equal(requests.length, 5, 'no fifth attempt for index 1');
    assert.equal(node.callbacks.size, 0);
    expireReservations();
    reply(node, requests.at(-1), parameter('LATE_PARTIAL'));
    assert.deepEqual(parameterNames(node, 42), ['CURRENT']);
    assert.equal(node.paramFetchStatus[42].phase, 'failed');

    node.fetchAllNodeParams(42);
    assert.deepEqual(parameterNames(node, 42), []);
    assert.equal(requests.at(-1).payload.fields.index.value, 0);
    reply(node, requests.at(-1), parameter());
    assert.equal(node.paramFetchStatus[42].phase, 'complete');
    assert.deepEqual(parameterNames(node, 42), []);
});

test('starting Fetch All again ignores old timeout retries and a pending write response', t => {
    const { node, requests, expire } = createParamClient(t);
    node.nodeParams[42] = { 0: parameter('PREVIOUS', 3), 1: parameter('REMOVED') };
    const write = node.setNodeParam(42, 0, 7);
    node.fetchAllNodeParams(42);
    reply(node, requests.at(-1), parameter('FIRST_ROUND'));
    expire(requests.at(-1), 1000);
    const supersededRetry = requests.at(-1);
    assert.equal(node.paramFetchStatus[42].phase, 'retrying');

    node.fetchAllNodeParams(42);
    const current = requests.at(-1);
    assert.equal(current.payload.fields.index.value, 0);
    assert.deepEqual(parameterNames(node, 42), []);
    const sent = requests.length;
    if (node.callbacks.has(supersededRetry.serviceKey)) expire(supersededRetry, 2000);
    reply(node, supersededRetry, parameter('LATE_RETRY'));
    reply(node, write, parameter('PREVIOUS', 7));
    assert.equal(requests.length, sent);
    assert.deepEqual(parameterNames(node, 42), []);
    assert.equal(node.paramFetchStatus[42].phase, 'loading');

    reply(node, current, parameter('SECOND_ROUND'));
    reply(node, requests.at(-1), parameter());
    assert.equal(node.paramFetchStatus[42].phase, 'complete');
    assert.deepEqual(parameterNames(node, 42), ['SECOND_ROUND']);
});

test('resetting the session cancels an in-progress Fetch All retry', t => {
    const { node, requests, expireReservations, expire } = createParamClient(t);
    node.fetchAllNodeParams(42);
    reply(node, requests.at(-1), parameter('OLD_SESSION'));
    expire(requests.at(-1), 1000);
    const retry = requests.at(-1);
    assert.equal(node.paramFetchStatus[42].phase, 'retrying');
    const write = node.setNodeParam(42, 0, 7);
    const sent = requests.length;

    node.resetSession();
    expireReservations();
    assert.equal(node.callbacks.size, 0);
    assert.equal(node.paramFetchStatus[42], undefined);
    assert.equal(node.nodeParams[42], undefined);
    assert.equal(requests.length, sent);

    node.fetchAllNodeParams(42);
    const fresh = requests.at(-1);
    assert.equal(fresh.payload.fields.index.value, 0);
    reply(node, retry, parameter('LATE_SESSION'));
    reply(node, write, parameter('OLD_SESSION', 7));
    assert.deepEqual(parameterNames(node, 42), []);
    assert.equal(requests.at(-1), fresh);
    reply(node, fresh, parameter('NEW_SESSION'));
    reply(node, requests.at(-1), parameter());
    assert.equal(node.paramFetchStatus[42].phase, 'complete');
    assert.deepEqual(parameterNames(node, 42), ['NEW_SESSION']);
});

test('the parameter table shows retry and partial failure without a node-status update', t => {
    const { node, requests, expire } = createParamClient(t);
    node.nodeParams[42] = { 0: parameter('OLD_FROM_UI') };
    let cursor = 0;
    let pendingRender = false;
    const state = [];
    let cleanup;
    function useTestState(initial, reducer) {
        const index = cursor++;
        if (!(index in state)) state[index] = initial;
        return [state[index], action => {
            const next = reducer(state[index], action);
            pendingRender ||= !Object.is(state[index], next);
            state[index] = next;
        }];
    }
    const component = loadModule('src/NodeParam.js', new Proxy({
        react: {
            ...React,
            useState(initial) {
                return useTestState(initial, (prior, update) => typeof update === 'function' ? update(prior) : update);
            },
            useReducer(reducer, initial) { return useTestState(initial, reducer); },
            useEffect(callback) { cleanup ??= callback(); }
        },
        '@mui/material': new Proxy({}, { get: (_, name) => name }),
        './ParamEditors/ParamEditorSelector': 'ParamEditorSelector',
        './am32_rtttl': {}
    }, {
        get(overrides, name) {
            return overrides[name] ?? (name.startsWith('@mui/icons-material/') ? name.split('/').at(-1) : undefined);
        }
    }), { window: { localNode: node }, localNode: node }).default;
    t.after(() => cleanup?.());

    function render() {
        cursor = 0;
        pendingRender = false;
        return component({ nodeId: 42, nodes: { 42: {} } });
    }
    function withText(tree, text) {
        if (Array.isArray(tree)) return tree.map(child => withText(child, text)).find(Boolean);
        if (!React.isValidElement(tree)) return;
        const children = tree.props.children;
        const matches = typeof text === 'string' ? children === text : typeof children === 'string' && text.test(children);
        return matches ? tree : withText(children, text);
    }

    const initial = render();
    assert.ok(withText(initial, 'OLD_FROM_UI'));
    withText(initial, 'Fetch All').props.onClick();
    assert.ok(pendingRender, 'the open table received the synchronous cache notification');
    const loading = render();
    assert.equal(withText(loading, 'OLD_FROM_UI'), undefined);
    assert.equal(withText(loading, /Fetching parameters.*0 received/).props.role, 'status');
    assert.equal(withText(loading, 'Store All').props.disabled, true);
    assert.equal(withText(loading, 'Download').props.disabled, true);
    assert.equal(requests[0].payload.fields.index.value, 0);

    reply(node, requests[0], parameter('FRESH_FROM_UI'));
    assert.ok(pendingRender, 'receiving a new parameter also updates the open table');
    assert.ok(withText(render(), 'FRESH_FROM_UI'));

    expire(requests[1], 1000);
    assert.ok(pendingRender, 'a timeout retry updates the open table');
    const retrying = render();
    assert.equal(withText(retrying, /Retrying parameter index 1.*attempt 2 of 4.*1 received/).props.role, 'status');
    assert.ok(withText(retrying, 'FRESH_FROM_UI'));
    for (let attempt = 2; attempt <= 4; attempt++) expire(requests.at(-1), 2000);

    assert.ok(pendingRender, 'exhausting the retries updates the open table');
    const partial = render();
    assert.ok(withText(partial, 'FRESH_FROM_UI'));
    assert.equal(withText(partial, 'OLD_FROM_UI'), undefined);
    assert.equal(withText(partial, /Fetch failed.*1 parameter before the failure.*Index 1, 4 attempts/).props.role, 'status');
    assert.equal(withText(partial, 'Download').props.disabled, false);
});

test('writing a parameter leaves the cached value and name intact until response', t => {
    const { node } = createNode(t, 127);
    const param = new DSDL.uavcan_protocol_param_GetSet_Response();
    param.fields.name.fromString('BATTERY_CHANNEL');
    const value = param.fields.value.msg;
    value.unionFieldIndex.value = 1;
    value.fields.integer_value = new PrimitiveType(2, PrimitiveType.KIND_SIGNED_INT, 64);
    node.nodeParams[42] = { 0: param };
    const write = node.setNodeParam(42, 0, 9);
    assert.equal(value.unionField.value, 2);
    assert.equal(write.payload.fields.value.msg.unionField.value, 9);
    assert.notEqual(write.payload.fields.name, param.fields.name);

    const text = new ArrayType(new PrimitiveType(null, PrimitiveType.KIND_UNSIGNED_INT, 8), ArrayType.MODE_DYNAMIC, 128);
    text.fromString('before');
    value.unionFieldIndex.value = 4;
    value.fields.string_value = text;
    const stringWrite = node.setNodeParam(42, 0, 'after');
    assert.equal(value.unionField.toString(), 'before');
    assert.equal(stringWrite.payload.fields.value.msg.unionField.toString(), 'after');
});

test('validates ESC int14 data and actuator uint8 IDs before sending commands', t => {
    const { node, frames } = createNode(t, 127);
    assert.throws(() => node.sendUavcanEquipmentEscRawCommand(0, Array(21).fill(0)), RangeError);
    assert.throws(() => node.sendUavcanEquipmentEscRawCommand(0, [8192]), RangeError);
    assert.throws(() => node.sendUavcanEquipmentEscRawCommand(0, [0.5]), RangeError);
    assert.throws(() => node.sendUavcanEquipmentActuatorArrayCommand(0, [{ id: 256, type: 0, value: 0 }]), RangeError);
    assert.throws(() => node.sendUavcanEquipmentActuatorArrayCommand(0, [{ id: 0.5, type: 0, value: 0 }]), RangeError);
    assert.throws(() => node.sendUavcanEquipmentActuatorArrayCommand(0, [{ id: 0, type: 0, value: NaN }]), RangeError);
    assert.equal(frames.length, 0);
    assert(node.sendUavcanEquipmentEscRawCommand(0, Array(20).fill(8191)));
    assert(node.sendUavcanEquipmentActuatorArrayCommand(0, [{ id: 255, type: 0, value: 1 }]));
});

test('the bus monitor retains matching transmitted and received payload bytes on Classic CAN and CAN FD', () => {
    const payload = new DSDL.uavcan_protocol_file_Read_Response();
    payload.fields.data.fromBytes([0, 0x80, 0xff]);
    for (const canfd of [false, true]) {
        const sent = new Transfer({
            sourceNodeId: 125, destNodeId: 127, payload, serviceNotMessage: true, canfd,
        });
        const frames = sent.toFrames();
        const received = new Transfer();
        received.fromFrames(frames);
        assert.ok(Buffer.isBuffer(sent._payloadBytes));
        assert.deepEqual(sent._payloadBytes, received._payloadBytes);
        assert.deepEqual([...received.payload.fields.data.toBytes()], [0, 0x80, 0xff]);
    }
});
