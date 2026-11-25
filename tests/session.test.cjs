const assert = require('node:assert/strict');
const { EventEmitter, once } = require('node:events');
const { ReadableStream, WritableStream } = require('node:stream/web');
const test = require('node:test');
const { loadModule } = require('./load-module.cjs');
const mavlink = require('../src/mavlink');
const { Node, TransferManager } = require('../src/dronecan');

const noOutput = { log() {}, warn() {}, error() {} };
const serial = loadModule('src/web_serial.js', {}, { console: noOutput, ArrayBuffer, Uint8Array, Blob });
const { mavlink20: dialect, MAVLink20Processor: Processor } = mavlink;
const remote = new Processor(null, 19, 1);
const pack = (message, sender = remote) => Uint8Array.from(message.pack(sender));
const extId = (TransferManager.FlagEFF | 0x300) >>> 0;
const can = (bus, id = extId) => new dialect.messages.can_frame(255, 0, bus, 3, id, 'abc');
const heartbeat = () => new dialect.messages.heartbeat(2, 3, 0, 0, 4);

function setup() {
    const sockets = [];
    class MockWebSocket extends EventEmitter {
        static OPEN = 1;

        constructor(url) {
            super();
            this.url = url;
            this.readyState = 0;
            this.writes = [];
            sockets.push(this);
        }

        addEventListener(event, callback) {
            this.on(event, callback);
        }

        open() {
            this.readyState = MockWebSocket.OPEN;
            this.emit('open', {});
        }

        close() {
            this.readyState = 3;
            this.emit('close', {});
        }

        send(bytes) {
            this.writes.push(bytes);
        }

        receive(bytes) {
            this.emit('message', { data: bytes.buffer });
        }
    }

    const socket = loadModule('src/ws_client.js', {}, {
        WebSocket: MockWebSocket, console: noOutput, ArrayBuffer, Uint8Array
    });
    const { default: Session } = loadModule('src/mavlink_session.js', {
        './web_serial': serial, './ws_client': socket, './mavlink': mavlink
    }, { ...mavlink, TextEncoder, setInterval, clearInterval });
    const node = new Node();
    clearInterval(node.nodeStatusIntervalID);
    return { node, session: new Session(node), sockets };
}

test('WebSocket close/error invalidates the node session, signing and stale receive callbacks', async () => {
    const { node, session, sockets } = setup();
    const changes = [];
    const received = [];
    session.on('connection-change', (kind, error) => changes.push({ kind, error }));
    session.on('mav-rx', message => received.push(message._id));
    try {
        session.initWebSocketConnection('localhost', 5555, 'test key', 42);
        await session.connect();
        const signed = sockets[0];
        signed.open();
        assert.equal(signed.url, 'wss://localhost:5555');
        assert.equal(signed.binaryType, 'arraybuffer');
        assert.equal(session.mavlinkProcessor.signing.sign_outgoing, true);
        assert.equal(session.mavlinkProcessor.signing.secret_key.length, 32);
        session.sendMavlinkMsg(heartbeat());
        assert.equal(signed.writes[0][2] & 1, 1);
        assert.equal(node.nodeId, 42);
        const connectedGeneration = node.sessionId;

        const signedRemote = new Processor(null, 19, 1);
        signedRemote.signing.secret_key = session.mavlinkProcessor.signing.secret_key;
        signedRemote.signing.sign_outgoing = true;
        signed.receive(pack(heartbeat(), signedRemote));
        assert.equal(session.targetSystem, 19);
        signed.close();
        await session.closing;
        assert.equal(node.nodeId, null);
        assert.ok(node.sessionId > connectedGeneration);
        assert.equal(session.isConnected(), false);
        assert.deepEqual(changes.map(change => change.kind), ['websocket', null]);

        session.initWebSocketConnection('localhost', 5555, '', 54);
        await session.connect();
        const unsigned = sockets[1];
        unsigned.open();
        assert.equal(unsigned.url, 'ws://localhost:5555');
        assert.equal(session.mavlinkProcessor.signing.secret_key.length, 0);
        assert.equal(session.mavlinkProcessor.signing.sign_outgoing, false);
        assert.equal(session.targetSystem, 255);
        session.sendMavlinkMsg(heartbeat());
        assert.equal(unsigned.writes[0][2] & 1, 0);
        signed.receive(pack(heartbeat()));
        assert.equal(session.targetSystem, 255);
        assert.equal(received.length, 1);
        unsigned.receive(pack(heartbeat()));
        assert.equal(session.targetSystem, 19);
        assert.equal(received.length, 2);

        const failure = Error('socket failed');
        unsigned.emit('error', failure);
        await session.closing;
        assert.deepEqual(changes.map(change => change.kind), ['websocket', null, 'websocket', null]);
        assert.equal(changes.at(-1).error, failure);
    } finally {
        await session.close();
    }
});

test('receives only extended frames on the active CAN bus and drops frames remaining in a replaced transport batch', async () => {
    const { node, session, sockets } = setup();
    const frames = [];
    node.on('can-frame', (id, _, length, bus) => frames.push({ id, length, bus }));
    try {
        node.changeBus(1);
        session.initWebSocketConnection('localhost', 5555, '', 42);
        await session.connect();
        const socket = sockets[0];
        socket.open();

        socket.receive(pack(can(0)));
        socket.receive(pack(can(1, 0x300)));
        socket.receive(pack(can(1)));
        assert.deepEqual(frames, [{ id: extId, length: 3, bus: 1 }]);
        node.changeBus(0);
        socket.receive(pack(can(1)));
        socket.receive(pack(can(0)));
        assert.deepEqual(frames.map(frame => frame.bus), [1, 0]);

        node.once('can-frame', () => { session.close(); });
        const first = pack(can(0));
        const second = pack(can(0));
        socket.receive(Uint8Array.from([...first, ...second]));
        await session.closing;
        assert.deepEqual(frames.map(frame => frame.bus), [1, 0, 0]);
    } finally {
        await session.close();
    }
});

function makeSerialPort(openGate, write) {
    let receive;
    const readable = new ReadableStream({ start(controller) { receive = controller; } });
    const writable = new WritableStream({ write });
    const port = {
        readable,
        writable,
        opens: 0,
        closes: 0,
        async open() {
            if (openGate) await openGate;
            this.opens++;
        },
        async close() {
            assert.equal(this.opens, 1);
            assert.equal(readable.locked || writable.locked, false);
            this.closes++;
        }
    };
    return { port, receive };
}

for (const kind of ['WebSocket', 'Web Serial']) {
    test(`${kind} preserves Classic and FD frame format, bus and binary data in both directions`, { timeout: 2000 }, async () => {
        const { node, session, sockets } = setup();
        const writes = [];
        let receive;
        try {
            node.changeBus(1);
            if (kind === 'WebSocket') {
                session.initWebSocketConnection('localhost', 5555, '', 42);
                await session.connect();
                sockets[0].open();
                sockets[0].send = packet => writes.push(packet);
                receive = packet => sockets[0].receive(packet);
            } else {
                const serialPort = makeSerialPort(undefined, packet => writes.push(packet));
                session.initWebSerialConnection(serialPort.port, 115200, 42);
                await session.connect();
                receive = packet => serialPort.receive.enqueue(packet);
            }
            const decoder = new Processor(null, 19, 1);
            const received = [];
            node.on('can-frame', (id, data, len, bus, canfd) => {
                received.push({ id, data: Buffer.from(data, 'latin1').subarray(0, len), bus, canfd });
            });
            for (const [canfd, size] of [[false, 8], [true, 8], [true, 64]]) {
                const bytes = Buffer.alloc(size, 0xff);
                bytes[0] = 0;
                bytes[1] = 0x80;
                bytes[size - 1] = 0;
                node.emit('sendFrame', extId, bytes, bytes.length, 1, canfd);
                if (kind === 'Web Serial') await session.transport.writer.ready;
                assert.equal(writes.length, 1);
                const [message] = decoder.parseBuffer(writes.shift());
                assert.equal(message._id, canfd ? dialect.MAVLINK_MSG_ID_CANFD_FRAME : dialect.MAVLINK_MSG_ID_CAN_FRAME);
                assert.equal(message.len, size);
                assert.equal(message.id, extId);
                assert.equal(message.bus, 1);
                assert.deepEqual(Buffer.from(message.data, 'latin1').subarray(0, size), bytes);

                for (const bus of [0, 1]) {
                    message.bus = bus;
                    const parsed = once(session, 'mav-rx');
                    receive(pack(message));
                    await parsed;
                    assert.deepEqual(received, bus === 1 ? [{ id: extId, data: bytes, bus, canfd }] : []);
                    received.length = 0;
                }
            }
        } finally {
            await session.close();
        }
    });
}

test('Web Serial EOF and read error close the session and release browser stream locks', async () => {
    const { session, node } = setup();
    for (const failure of [undefined, Error('read failed')]) {
        const { port, receive } = makeSerialPort();
        try {
            session.initWebSerialConnection(port, 115200, 42);
            await session.connect();
            assert.equal(session.isConnected(), true);
            assert.equal(node.nodeId, 42);
            const expected = once(session, 'connection-change');
            if (failure) receive.error(failure);
            else receive.close();
            assert.deepEqual(await expected, [null, failure]);
            await session.closing;
            assert.equal(session.isConnected(), false);
            assert.equal(node.nodeId, null);
            assert.equal(port.closes, 1);
        } finally {
            await session.close();
        }
    }
});

test('closing Web Serial during port.open waits for the open and never activates the obsolete adapter', async () => {
    const { node, session } = setup();
    let allowOpen;
    const openGate = new Promise(resolve => { allowOpen = resolve; });
    const { port } = makeSerialPort(openGate);
    const connections = [];
    session.on('connection-change', kind => connections.push(kind));

    session.initWebSerialConnection(port, 115200, 42);
    const connecting = session.connect();
    const closing = session.close();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(port.closes, 0);
    assert.equal(session.isConnected(), false);
    allowOpen();
    await Promise.all([connecting, closing]);
    assert.deepEqual(connections, [null]);
    assert.equal(node.nodeId, null);
    assert.equal(port.closes, 1);
});

test('closing from the node session-change listener prevents a stale connection-open event', async () => {
    const { node, session, sockets } = setup();
    const connections = [];
    session.on('connection-change', kind => connections.push(kind));
    try {
        session.initWebSocketConnection('localhost', 5555, '', 42);
        await session.connect();
        node.once('session-change', () => { session.close(); });
        sockets[0].open();
        await session.closing;
        assert.deepEqual(connections, [null]);
        assert.equal(session.forwardingInterval, null);
    } finally {
        await session.close();
    }
});
