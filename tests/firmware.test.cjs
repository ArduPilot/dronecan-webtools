const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');
const React = require('react');

const { loadModule } = require('./load-module.cjs');
const { FileServer } = loadModule('src/FileServer.js');
const { Node, DSDL, Frame, TransferManager } = require('../src/dronecan');
const Transfer = require('../src/dronecan/transfer');

test('File.Read counts fresh covered bytes, accepts retries and requires a short EOF response', () => {
    const server = new FileServer();
    const progress = [];
    const responses = [];
    const node = {
        nodeId: 127,
        sessionId: 4,
        responseUavcanProtocolFileRead(transfer, error, path, bytes) {
            responses.push({ error, length: bytes.length });
            return {};
        }
    };
    const file = { data: new ArrayBuffer(512) };
    const remotePath = server.startTransfer(file, node, 42, (state) => progress.push(state));
    const request = (offset, { sourceNodeId = 42, sessionId = node.sessionId } = {}) => {
        server.handleReadRequest({
            sourceNodeId,
            destNodeId: node.nodeId,
            sessionId,
            payload: { fields: { path: { msg: { fields: { path: remotePath } } }, offset: { value: offset } } }
        }, node);
    };

    request(256n);
    assert.equal(responses.at(-1).length, 256);
    assert.equal(progress.at(-1).coveredBytes, 256);
    assert.equal(progress.at(-1).complete, false);
    request(256);
    assert.equal(progress.at(-1).coveredBytes, 256);
    request(512);
    assert.equal(responses.at(-1).length, 0);
    assert.equal(progress.at(-1).complete, false);
    request(0);
    assert.equal(progress.at(-1).coveredBytes, 512);
    assert.equal(progress.at(-1).complete, true);

    request(0, { sourceNodeId: 43 });
    assert.equal(responses.at(-1).error, 2);
    request(513);
    assert.equal(responses.at(-1).error, 22);
    assert.equal(progress.length, 4);

    node.sessionId++;
    request(0);
    assert.equal(responses.at(-1).error, 2);
    server.stopTransfer(remotePath);
    assert.equal(server.transfers.size, 0);
});

test('File.Read progress waits for an emitted response', () => {
    const server = new FileServer();
    let progress;
    const node = { nodeId: 127, sessionId: 0, responseUavcanProtocolFileRead: () => null };
    const remotePath = server.startTransfer({ data: new ArrayBuffer(12) }, node, 42, (state) => { progress = state; });
    const request = {
        sourceNodeId: 42, destNodeId: 127, sessionId: 0,
        payload: { fields: { path: { msg: { fields: { path: remotePath } } }, offset: { value: 0 } } }
    };
    server.handleReadRequest(request, node);
    assert.equal(progress, undefined);
    node.responseUavcanProtocolFileRead = () => ({});
    server.handleReadRequest(request, node);
    assert.equal(progress.coveredBytes, 12);
    assert.equal(progress.complete, true);
});

test('a real File.Read transfer serves the selected bytes through the node encoder', () => {
    const server = new FileServer();
    const node = new Node({ nodeId: 127 });
    clearInterval(node.nodeStatusIntervalID);
    const decoder = new TransferManager();
    const responses = [];
    node.on('sendFrame', (id, data) => {
        const response = decoder.addFrame(new Frame(id & 0x1fffffff, data, true, false));
        if (response) responses.push(response);
    });
    node.on('uavcan.protocol.file.Read.Request', (request) => server.handleReadRequest(request, node));

    const data = Uint8Array.from({ length: 256 }, (_, i) => i).buffer;
    const remotePath = server.startTransfer({ data }, node, 42, () => {});
    const request = new DSDL.uavcan_protocol_file_Read_Request();
    request.fields.offset.value = 0n;
    request.fields.path.msg.fields.path.fromString(remotePath);
    const incoming = new Transfer({
        transferId: 6, sourceNodeId: 42, destNodeId: 127, payload: request,
        requestNotResponse: true, serviceNotMessage: true, transferPriority: 30
    });
    for (const frame of incoming.toFrames(request)) node.handleFrame(frame);
    assert.equal(responses.length, 1);
    assert.equal(responses[0].destNodeId, 42);
    const fields = responses[0].payload.fields;
    assert.equal(fields.error.msg.fields.value.value, 0);
    assert.deepEqual(fields.data.items.map((item) => item.value), Array.from(new Uint8Array(data)));
});

function createFirmwareDialog() {
    const server = new FileServer();
    const state = [];
    let stateIndex = 0;
    let mount;
    let cleanup;
    const scopes = {
        ...React,
        useState(initial) {
            const index = stateIndex++;
            if (!(index in state)) state[index] = initial;
            return [state[index], (value) => { state[index] = value; }];
        },
        useRef(initial) {
            const index = stateIndex++;
            state[index] ??= { current: initial };
            return state[index];
        },
        useEffect(callback) {
            mount ??= callback;
        }
    };

    let begun;
    let readback;
    const timers = new Map();
    const localNode = Object.assign(new EventEmitter(), {
        nodeId: 127,
        nodeMonitors: {},
        sessionId: 1,
        beginFirmwareUpdate(target, remotePath, onResponse, onError) {
            begun = { target, remotePath, onResponse, onError };
            return {};
        },
        getNodeInfo(_, versionResponse) {
            readback = versionResponse;
            return {};
        },
        responseUavcanProtocolFileRead: () => ({}),
        cancelRequest() {}
    });

    const component = loadModule('src/FirmwareUpdateModal.js', {
        react: scopes,
        '@mui/material': new Proxy({}, { get: (_, prop) => prop }),
        '@mui/icons-material/FileUpload': 'FileUploadIcon',
        './FileServer': server
    }, {
        window: { localNode, mavlinkSession: { isConnected: () => true } },
        setTimeout(callback, delay) {
            const timer = Symbol();
            timers.set(timer, { callback, delay });
            return timer;
        },
        clearTimeout(timer) { timers.delete(timer); }
    }).default;

    function elementWith(tree, key, value) {
        if (Array.isArray(tree)) {
            return tree.map((item) => elementWith(item, key, value)).find(Boolean);
        }
        if (!tree?.props) return;
        return tree.props[key] === value ? tree : elementWith(tree.props.children, key, value);
    }

    function render() {
        stateIndex = 0;
        const tree = component({ open: true, onClose() {}, targetNodeId: 42 });
        cleanup ??= mount();
        return tree;
    }

    function select(name) {
        let ready;
        const file = { name, arrayBuffer: () => new Promise((resolve) => { ready = resolve; }) };
        const input = elementWith(render(), 'type', 'file');
        const completion = input.props.onChange({ target: { files: [file] } });
        return async (firstByte, size = 1) => {
            ready(new Uint8Array(size).fill(firstByte).buffer);
            await completion;
        };
    }

    return { server, localNode, timers, render, select, elementWith,
        get begun() { return begun; },
        get readback() { return readback; },
        unmount() { cleanup?.(); }
    };
}

test('modal ignores stale selections and sessions, supports retry and reports version readback', async () => {
    const dialog = createFirmwareDialog();
    const { server, localNode, timers, render, select, elementWith } = dialog;
    try {
        await select('old.bin')(1);
        const staleUpdate = elementWith(render(), 'children', 'Update');
        assert.equal(staleUpdate.props.disabled, false);
        const finishSlow = select('slow.bin');
        staleUpdate.props.onClick();
        assert.equal(dialog.begun, undefined);
        assert.equal(elementWith(render(), 'children', 'Update').props.disabled, true);

        const finishLatest = select('latest.bin');
        await finishLatest(3);
        await finishSlow(2);
        elementWith(render(), 'children', 'Update').props.onClick();
        assert.equal(dialog.begun.target, 42);
        assert.equal(server.transfers.get(dialog.begun.remotePath).data[0], 3);
        const oldResponse = dialog.begun.onResponse;
        localNode.sessionId++;
        localNode.emit('session-change');
        assert.equal(server.transfers.size, 0);
        oldResponse({ payload: { fields: { error: { value: 0 } } } });
        assert.equal(elementWith(render(), 'children', 'Retry Update').props.disabled, true);

        await select('retry.bin')(4, 300);
        elementWith(render(), 'children', 'Update').props.onClick();
        dialog.begun.onResponse({ payload: { fields: { error: { value: 1 } } } });
        assert.equal(server.transfers.size, 0);
        assert.equal(timers.size, 0);

        elementWith(render(), 'children', 'Retry Update').props.onClick();
        const timedOutPath = dialog.begun.remotePath;
        const [[timerId, readTimer]] = timers;
        assert.equal(readTimer.delay, 15_000);
        dialog.begun.onError({ code: 'REQUEST_TIMEOUT' });
        assert.ok(server.transfers.has(timedOutPath));
        assert.ok(timers.has(timerId), 'keep the original deadline for the first file read');
        localNode.nodeMonitors[42] = { offline: true };
        readTimer.callback();
        assert.equal(server.transfers.size, 0);
        assert.ok(elementWith(render(), 'children', 'Firmware transfer to node 42 timed out after 15 seconds. No firmware data was sent. The node is offline. Retry when it is back online.'));
        localNode.nodeMonitors[42].offline = false;
        elementWith(render(), 'children', 'Retry Update').props.onClick();
        assert.notEqual(dialog.begun.remotePath, timedOutPath);
        dialog.begun.onError({ code: 'REQUEST_TIMEOUT' });
        const sendStatus = (mode, uptime) => localNode.emit('uavcan.protocol.NodeStatus', {
            sourceNodeId: 42, sessionId: localNode.sessionId,
            payload: { toObj: () => ({ mode, uptime_sec: uptime }) }
        });
        sendStatus(3, 10);
        const readChunk = offset => server.handleReadRequest({
            sourceNodeId: 42, destNodeId: 127, sessionId: localNode.sessionId,
            payload: { fields: { path: { msg: { fields: { path: dialog.begun.remotePath } } }, offset: { value: offset } } }
        }, localNode);
        readChunk(0);
        assert.ok(elementWith(render(), 'children', 'Uploading firmware 85.3% (256 / 300 bytes)'));
        readChunk(256);
        assert.equal(elementWith(render(), 'children', 'Update'), undefined);
        assert.ok(elementWith(render(), 'children',
            'Upload complete (100%). Waiting for node 42 to report its firmware version.'));
        assert.equal(dialog.readback, undefined);
        sendStatus(0, 1);
        dialog.readback({ payload: { toObj: () => ({ software_version: { major: 3, minor: 2 } }) } });
        assert.ok(elementWith(render(), 'children',
            'Upload complete. Node 42 reports firmware version 3.2.'));
        assert.equal(elementWith(render(), 'children', 'Update'), undefined);
        assert.equal(elementWith(render(), 'type', 'file'), undefined);
        assert.equal(elementWith(render(), 'children', 'Close').props.disabled, false);
        assert.equal(server.transfers.size, 0);
        assert.equal(timers.size, 0);
    } finally {
        dialog.unmount();
    }
});

for (const [beginError, size, release] of [
    ['NODE_RESTARTED', 300, 'timeout'],
    ['NODE_RECONNECTED', 256, 'session-change'],
    ['NODE_RESTARTED', 300, 'version']
]) {
    test(`firmware remains readable after ${beginError} and dialog close until ${release}`, async () => {
        const dialog = createFirmwareDialog();
        const { localNode, timers, server, render, select, elementWith } = dialog;
        let response;
        localNode.responseUavcanProtocolFileRead = (_, error, path, bytes) => {
            response = { error, bytes: Array.from(bytes) };
            return {};
        };
        await select('firmware.bin')(7, size);
        elementWith(render(), 'children', 'Update').props.onClick();
        const path = dialog.begun.remotePath;
        const read = offset => server.handleReadRequest({
            sourceNodeId: 42, destNodeId: 127, sessionId: localNode.sessionId,
            payload: { fields: { path: { msg: { fields: { path } } }, offset: { value: offset } } }
        }, localNode);
        const status = (mode, uptime_sec) => localNode.emit('uavcan.protocol.NodeStatus', {
            sourceNodeId: 42, sessionId: localNode.sessionId,
            payload: { toObj: () => ({ mode, uptime_sec }) }
        });
        const [firstReadTimer] = timers.keys();
        dialog.begun.onError({ code: beginError });
        assert.ok(timers.has(firstReadTimer));
        status(3, 10);
        read(0);
        read(256);
        const close = elementWith(render(), 'children', 'Close');
        assert.equal(close.props.disabled, false);
        const [[deadline, timer]] = timers;
        assert.equal(timer.delay, 30_000);
        close.props.onClick();
        dialog.unmount();
        read(256);
        assert.deepEqual(response, { error: 0, bytes: Array(size - 256).fill(7) });
        assert.ok(timers.has(deadline));

        if (release === 'timeout') timer.callback();
        if (release === 'session-change') {
            localNode.sessionId++;
            localNode.emit('session-change');
        }
        if (release === 'version') {
            status(0, 1);
            dialog.readback({ payload: { toObj: () => ({ software_version: { major: 4, minor: 7 } }) } });
        }
        assert.equal(server.transfers.size, 0);
        assert.equal(timers.size, 0);
        assert.equal(localNode.listenerCount('uavcan.protocol.NodeStatus'), 0);
        assert.equal(localNode.listenerCount('session-change'), 0);
    });
}
