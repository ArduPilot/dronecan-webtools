import { EventEmitter } from 'events';
import { Buffer } from 'buffer';
import WebSocketClient from './ws_client';
import WebSerial from './web_serial';
import dronecan from './dronecan';
import './mavlink';

class MavlinkSession extends EventEmitter {
    constructor(localNode) {
        super();
        this.localNode = localNode;
        this.targetSystem = 255;
        this.targetComponent = 0;
        this.transport = null;
        this.forwardingInterval = null;
        this.closing = Promise.resolve();
        this.sendCanFrame = this.sendCanFrame.bind(this);
    }

    attachTransport(transport, kind, nodeId) {
        if (this.transport) throw new Error('Close the current adapter before connecting another');
        this.transport = transport;
        this.targetSystem = 255;
        this.mavlinkProcessor = new MAVLink20Processor(null, this.targetSystem, this.targetComponent);
        this.mavlinkProcessor.file = transport;
        this.localNode.on('sendFrame', this.sendCanFrame);
        transport.addMessageHandler(buffer => this.parseBuffer(buffer, transport));
        transport.addOpenHandler(() => {
            if (this.transport !== transport) return;
            this.localNode.setNodeId(nodeId);
            if (this.transport !== transport) return;
            this.forwardingInterval = setInterval(() => this.enableMavlinkCanForward(this.localNode.bus), 1000);
            this.emit('connection-change', kind);
        });
        const disconnect = error => {
            if (this.transport === transport) this.close(error);
        };
        transport.addCloseHandler(() => disconnect());
        transport.addErrorHandler(disconnect);
    }

    initWebSocketConnection(ip, port, signing = '', nodeId = this.localNode.nodeId) {
        const transport = new WebSocketClient(`${signing ? 'wss' : 'ws'}://${ip}:${port}`);
        this.attachTransport(transport, 'websocket', nodeId);
        if (signing) {
            const hash = mavlink20.sha256(new TextEncoder().encode(signing));
            this.mavlinkProcessor.signing.secret_key = new Uint8Array(hash);
            this.mavlinkProcessor.signing.sign_outgoing = true;
        }
    }

    initWebSerialConnection(port, baudRate, nodeId = this.localNode.nodeId) {
        this.attachTransport(new WebSerial(port, baudRate), 'serial', nodeId);
    }

    connect() {
        return this.transport.connect();
    }

    close(error) {
        const transport = this.transport;
        if (!transport) return this.closing;
        if (!error && this.isConnected()) this.localNode.emit('before-disconnect');
        this.localNode.off('sendFrame', this.sendCanFrame);
        this.transport = null;
        clearInterval(this.forwardingInterval);
        this.forwardingInterval = null;
        this.mavlinkProcessor.file = null;
        this.closing = Promise.resolve().then(() => transport.close());
        if (this.localNode.nodeId !== null) this.localNode.setNodeId(null);
        else this.localNode.resetSession('disconnected');
        this.emit('connection-change', null, error);
        return this.closing;
    }

    parseBuffer(buffer, transport = this.transport) {
        if (!transport || this.transport !== transport) return;
        const messages = this.mavlinkProcessor.parseBuffer(buffer);
        for (const message of messages ?? []) {
            if (this.transport !== transport) break;
            this.handleMavlinkMsg(message);
        }
    }

    handleMavlinkMsg(message) {
        const canfd = message._id === mavlink20.MAVLINK_MSG_ID_CANFD_FRAME;
        if (message._id === mavlink20.MAVLINK_MSG_ID_HEARTBEAT) {
            this.targetSystem = message._header.srcSystem;
        } else if ((canfd || message._id === mavlink20.MAVLINK_MSG_ID_CAN_FRAME) &&
                   message.bus === this.localNode.bus && (message.id & dronecan.TransferManager.FlagEFF)) {
            this.localNode.emit('can-frame', message.id, message.data, message.len, message.bus, canfd);
        }
        this.emit('mav-rx', message);
    }

    sendCanFrame(id, data, len, bus = this.localNode.bus, canfd = false) {
        const FrameMessage = canfd ? mavlink20.messages.canfd_frame : mavlink20.messages.can_frame;
        const msg = new FrameMessage(this.targetSystem, this.targetComponent, bus, len, id,
            Buffer.from(data).toString('latin1'));
        this.sendMavlinkMsg(msg);
    }

    sendMavlinkMsg(msg) {
        if (this.isConnected()) {
            this.mavlinkProcessor.send(msg);
            this.emit('mav-tx', msg);
        }
    }

    enableMavlinkCanForward(bus) {
        // console.log('Enabling CAN forward on bus:', bus);
        const msg = new mavlink20.messages.command_long(
            this.targetSystem, // target_system
            this.targetComponent, // target_component
            mavlink20.MAV_CMD_CAN_FORWARD, // command
            0, // confirmation
            bus + 1, // param1
            0, // param2
            0, // param3
            0, // param4
            0, // param5
            0, // param6
            0 // param7
        );
        this.sendMavlinkMsg(msg);
    }

    isConnected() {
        return this.transport?.isConnected() === true;
    }
}

export default MavlinkSession;
