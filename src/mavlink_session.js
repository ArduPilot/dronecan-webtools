import { EventEmitter } from 'events';
import WebSocketClient from './ws_client';
import WebSerial from './web_serial';
import dronecan from './dronecan';
import './mavlink';

class MavlinkSession extends EventEmitter {
    constructor() {
        super();
        this.targetSystem = 255;
        this.targetComponent = 0;
        this.mavlinkProcessor = new MAVLink20Processor(null, this.targetSystem, this.targetComponent);
        this.wsClient = null;
        this.serial = null;
        this.parseBuffer = this.parseBuffer.bind(this);
    }

    addWebSocketErrorHandler(handler) {
        if (this.wsClient) {
            this.wsClient.addErrorHandler(handler);
        }
    }

    addWebSocketOpenHandler(handler) {
        if (this.wsClient) {
            this.wsClient.addOpenHandler(handler);
        }
    }

    initWebSocketConnection(ip, port, mavlinkSigning='') {
        if (mavlinkSigning) {
            const enc = new TextEncoder();
            const data = enc.encode(mavlinkSigning);
            const hash = mavlink20.sha256(data);
            this.mavlinkProcessor.signing.secret_key = new Uint8Array(hash);
            this.mavlinkProcessor.signing.sign_outgoing = true;
            this.wsClient = new WebSocketClient(`wss://${ip}:${port}`);
        } else {
            this.wsClient = new WebSocketClient(`ws://${ip}:${port}`);
        }
        this.mavlinkProcessor.file = this.wsClient;

        this.wsClient.addMessageHandler((buffer) => {
            this.parseBuffer(buffer);
        });
    }

    webSocketConnect() {
        this.wsClient.connect();
    }

    initWebSerialConnection(port, baudRate) {
        this.serial = new WebSerial(port, baudRate);
        this.mavlinkProcessor.file = this.serial;

        this.serial.addMessageHandler((buffer) => {
            // console.log('Received buffer:', buffer);
            this.parseBuffer(buffer);
        });
    }

    addWebSerialErrorHandler(handler) {
        if (this.serial) {
            this.serial.addErrorHandler(handler);
        }
    }

    addWebSerialOpenHandler(handler) {
        if (this.serial) {
            this.serial.addOpenHandler(handler);
        }
    }

    webSerialConnect() {
        this.serial.connect();
    }

    close() {
        if (this.wsClient) {
            this.wsClient.close();
        }
        if (this.serial) {
            this.serial.close();
        }
    }

    parseBuffer(buffer) {
        // console.log('Parsing buffer:', buffer);
        const messages = this.mavlinkProcessor.parseBuffer(buffer);
        if (messages && messages.length > 0) {
            messages.forEach(this.handleMavlinkMsg.bind(this));
        } else {
            // console.error('No messages parsed from buffer or messages is null.');
        }
    }

    handleMavlinkMsg(message) {
        switch (message._id) {
            case mavlink20.MAVLINK_MSG_ID_HEARTBEAT:
                {
                    // console.log('Heartbeat message received:', message);
                    this.targetSystem = message._header.srcSystem;
                }
                break;
            case mavlink20.MAVLINK_MSG_ID_CAN_FRAME:
                {
                    // console.log('CAN frame message received:', message);
                    let isExtended = message.id & dronecan.TransferManager.FlagEFF;
                    if (isExtended) {
                        // this.localNode.emit('can-frame', message.id, message.data, message.len);
                        if (localNode) {
                            localNode.emit('can-frame', message.id, message.data, message.len);
                        }
                    } else {
                        console.log('Standard frame');
                    }
                }
                break;
            default:
        }

        if (this.getMaxListeners('mav-rx') > 0) {
            this.emit('mav-rx', message);
        }
    }

    sendMavlinkMsg(msg) {
        if ((this.wsClient && this.wsClient.connected) || (this.serial && this.serial.connected)) {
            this.mavlinkProcessor.send(msg);
            if (this.getMaxListeners('mav-tx') > 0) {
                this.emit('mav-tx', msg);
            }
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
        return (this.wsClient && this.wsClient.isConnected()) || 
               (this.serial && this.serial.connected);
    }

}

export default MavlinkSession;