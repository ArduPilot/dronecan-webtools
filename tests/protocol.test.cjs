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
