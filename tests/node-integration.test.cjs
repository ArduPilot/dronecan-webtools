const test = require('node:test');
const assert = require('node:assert/strict');
const Node = require('../src/dronecan/node');
const DSDL = require('../src/dronecan/dsdl');

test('Fetch All and edits preserve UTF-8 text and AM32 binary string parameters over CAN FD', t => {
    const client = new Node({ nodeId: 127, sendCanfd: true });
    const server = new Node({ nodeId: 42 });
    for (const node of [client, server]) {
        clearInterval(node.nodeStatusIntervalID);
        node.changeBus(1);
        t.after(() => node.resetSession());
    }
    for (const [sender, receiver] of [[client, server], [server, client]]) {
        sender.on('sendFrame', (id, bytes, len, bus, canfd) => {
            assert.equal(bus, 1);
            assert.equal(canfd, true);
            receiver.emit('can-frame', id, bytes, len, bus, canfd);
        });
    }

    const names = ['STARTUP_TUNE', 'LABEL'];
    const values = [Buffer.from([0, 0x80, 0xff]), Buffer.from('初始', 'utf8')];
    server.on('uavcan.protocol.param.GetSet.Request', request => {
        const query = request.payload.fields;
        const i = query.index.value;
        const result = new DSDL.uavcan_protocol_param_GetSet_Response();
        if (i < names.length) {
            result.fields.name.fromString(names[i]);
            if (query.name.toString()) {
                assert.equal(query.name.toString(), names[i]);
                values[i] = query.value.msg.unionField.toBytes();
            }
            const value = result.fields.value.msg;
            value.unionFieldIndex.value = value.unionFields.indexOf('string_value');
            value.unionField.fromBytes(values[i]);
        }
        const response = server.response({ res: result, transfer: request });
        assert.ok(response.isResponseTo(request));
    });

    client.fetchAllNodeParams(42);
    assert.equal(client.paramFetchStatus[42].phase, 'complete');
    const cached = index => client.nodeParams[42][index].fields.value.msg.unionField;
    assert.deepEqual(cached(0).toBytes(), Buffer.from([0, 0x80, 0xff]));
    const tune = Uint8Array.of(255, 0, 128, 1);
    client.setNodeParam(42, 0, tune);
    assert.deepEqual(cached(0).toBytes(), Buffer.from(tune));
    client.setNodeParam(42, 1, '已更新');
    assert.equal(cached(1).toString(), '已更新');
    assert.equal(client.callbacks.size, 0);
});
