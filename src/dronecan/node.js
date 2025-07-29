/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const EventEmitter = require('events');
const TransferManager = require('./transfer_manager');
const CompoundType = require('./compound_type');
const PrimitiveType = require('./primitive_type');
const Frame = require('./frame');
const Transfer = require('./transfer');
const DSDL = require('./dsdl');
var Buffer = require('buffer').Buffer;

const REQUEST_PRIORITY = 30;

class Node extends EventEmitter {
    constructor({
        nodeId = null,
        name = 'dronecan.js',
        nodeStatusInterval = 1.0,
        mode = 0,
        nodeInfo = null,
        catchHandlerExceptions = true,
        sendCanfd = false
    } = {}) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.nodeStatusInterval = nodeStatusInterval;
        this.mode = mode;
        this.nodeInfo = nodeInfo;
        this.catchHandlerExceptions = catchHandlerExceptions;
        this.sendCanfd = sendCanfd;

        this.bus = 0;
        this.nodeMonitors = {};
        this.changeBusTimestamp = 0;
        this.nodeParams = {};
        this.nodeParamsRequestingIndex = {};
        this.nodeParamsRequestingNodeId = null;
        this.subscribers = {};
        this.subscribersMaxItems = 10;
        this.transferManager = new TransferManager();
        this.priority = 20; // Set default priority
        this.callbacks = new Map();

        this.uptimeBegin = new Date();
        this.status = new DSDL.uavcan_protocol_NodeStatus();
        this.status.fields.uptime_sec.value = 0;
        this.status.fields.health.value = 0;
        this.status.fields.mode.value = mode;
        this.status.fields.sub_mode.value = 0;
        this.status.fields.vendor_specific_status_code.value = 0;
        this.status.fields.uptime_sec.value = parseInt((new Date() - this.uptimeBegin) / 1000);

        this.hardware_version = new DSDL.uavcan_protocol_HardwareVersion();
        this.hardware_version.fields.major.value = 1;
        this.hardware_version.fields.minor.value = 0;
        this.hardware_version.fields.unique_id.items = new Array(16).fill(new PrimitiveType(0, PrimitiveType.KIND_UNSIGNED_INT, 8));;
        this.hardware_version.fields.certificate_of_authenticity.items = [];

        this.software_version = new DSDL.uavcan_protocol_SoftwareVersion();
        this.software_version.fields.major.value = 1;
        this.software_version.fields.minor.value = 0;
        this.software_version.fields.vcs_commit.value = 0;
        this.software_version.fields.optional_field_flags.value = 1;
        this.software_version.fields.image_crc.value = 0;

        const nodeStatusIntervalID = setInterval(() => {
            if (this.nodeId) {
                this.status.fields.uptime_sec.value = parseInt((new Date() - this.uptimeBegin) / 1000);
                this.request({req: this.status, destNodeId: 0, serviceNotMessage: false, priority: REQUEST_PRIORITY});
            }
        }, 1000 * nodeStatusInterval);

        this.nodeStatusIntervalID = nodeStatusIntervalID;

        this.on('can-frame', (id, data, len) => {
            let buf = Buffer.from(data, 'binary');
            buf = buf.slice(0, len);
            let canId = id & 0x1FFFFFFF;
            const canFrame = new Frame(
                canId,
                buf,
                true,
                false
            );
            this.handleFrame(canFrame);
        });

        this.on('uavcan.protocol.GetNodeInfo.Request', (transfer) => {
            this.responseNodeInfo();
        });

        this.on('uavcan.protocol.NodeStatus', (transfer) => {
            this.nodeMonitorsUpdate(transfer);
        });
    }

    setNodeId(nodeId) {
        this.nodeId = nodeId;
    }

    refreshNodeMonitor() {
        this.nodeMonitors = {};
    }

    setBus(bus) {
        this.bus = bus;
    }

    changeBus(bus) {
        this.bus = bus;
        this.changeBusTimestamp = new Date();
        setTimeout(() => {
            this.refreshNodeMonitor();
        });
    }

    updateSubscribers(transfer) {
        if (this.subscribers[transfer.dataTypeId] === undefined) {
            this.subscribers[transfer.dataTypeId] = [];
        }
        const msg = transfer.payload;
        this.subscribers[transfer.dataTypeId].push([msg.name, msg.toObj()]);
    }

    setSubscriberMaxItems(maxItems) {
        if (maxItems < 1) {
            throw new Error('Max items must be greater than 0');
        }
        if (maxItems > 50) {
            throw new Error('Max items must be less than 100');
        }
        this.subscribersMaxItems = maxItems;
    }

    responseNodeInfo() {
        if (this.nodeId) {
            const msg = new DSDL.uavcan_protocol_GetNodeInfo_Response();
            this.status.fields.uptime_sec.value = parseInt((new Date() - this.uptimeBegin) / 1000);
            msg.fields.status.msg = this.status;
            msg.fields.name.fromString(this.name);
            msg.fields.hardware_version.msg = this.hardware_version;
            msg.fields.software_version.msg = this.software_version;
            this.request({req: msg, requestNotResponse: false, serviceNotMessage: true, destNodeId: 0, priority: REQUEST_PRIORITY});
        }
    }

    nodeMonitorsUpdate(transfer) {
        if (this.nodeId) {
            this.getNodeInfo(transfer.sourceNodeId);
        }
        if ((new Date() - this.changeBusTimestamp) > 3000) {
            this.updateNodeMonitorStatus(transfer);
        } else {
            this.refreshNodeMonitor();
        }
        if (this.listenerCount('nodeList') > 0) {
            this.emit('nodeList', this.nodeMonitors);
        }
    }

    handleFrame(frame) {
        const transfer = this.transferManager.addFrame(frame);
        if (transfer) {
            const msg = transfer.payload;
            let topicName;
            if (transfer.serviceNotMessage) {
                if (transfer.requestNotResponse) {
                    if (msg) {
                        topicName = `${msg.name}.Request`;
                    }
                } else {
                    if (msg) {
                        topicName = `${msg.name}.Response`;
                    }
                    const callback = this.callbacks.get(transfer.transferId);
                    if (callback) {
                        callback(transfer);
                        this.callbacks.delete(transfer.transferId); // Remove the callback after invoking it
                    }
                }
                // console.log(`recv transfer dtid: ${transfer.dataTypeId}`);

                if (topicName && this.listenerCount(topicName) > 0) {
                    this.emit(topicName, transfer);
                }
            } else {
                if (!transfer.dataTypeId || !transfer.payload) {
                    // console.error('#TODO dataTypeId or payload is null');
                    return;
                }
                if (transfer.payload) {
                    const msg = transfer.payload;
                    if (this.listenerCount(msg.name) > 0) {
                        this.emit(msg.name, transfer);
                    }
                }

                if (this.listenerCount('message') > 0) {
                    this.emit('message', transfer);
                }
                // console.log('Message frame');
            }
            if (this.listenerCount('transfer-rx') > 0) {
                this.emit('transfer-rx', transfer);
            }
        }
    }

    request({req, destNodeId, requestNotResponse=true, serviceNotMessage=true, priority=REQUEST_PRIORITY, canfd=false, callback=null}) {
        // console.log('Request:', req, targetNodeId);
        const transfer = new Transfer({
            transferId: this.transferManager.getNextTransferId(),
            sourceNodeId: this.nodeId,
            destNodeId: destNodeId,
            payload: req,
            requestNotResponse: requestNotResponse,
            serviceNotMessage: serviceNotMessage,
            transferPriority: priority,
            canfd: canfd,
        });
        this.callbacks.set(transfer.transferId, callback);
        const frames = transfer.toFrames(req);
        // console.log('Request Transfer ID:', transfer.transferId);
        frames.forEach(frame => {
            let messageId = frame.id;
            if (frame.extended) {
                messageId = (messageId | (1 << 31)) >>> 0;
            }
            if (this.listenerCount('sendFrame') > 0) {
                this.emit('sendFrame', messageId, frame.data, frame.data.length);
            }
        });

        if (this.listenerCount('transfer-tx') > 0) {
            this.emit('transfer-tx', transfer);
        }
    }

    response({res, transfer, canfd=false}) {
        const responseTransfer = new Transfer({
            transferId: transfer.transferId,
            sourceNodeId: this.nodeId,
            destNodeId: transfer.sourceNodeId,
            payload: res,
            requestNotResponse: false,
            serviceNotMessage: transfer.serviceNotMessage,
            transferPriority: transfer.transferPriority,
            canfd: canfd,
        });
        const frames = responseTransfer.toFrames(res);
        frames.forEach(frame => {
            let messageId = frame.id;
            if (frame.extended) {
                messageId = (messageId | (1 << 31)) >>> 0;
            }
            if (this.listenerCount('sendFrame') > 0) {
                this.emit('sendFrame', messageId, frame.data, frame.data.length);
            }
        });
    }

    updateNodeMonitorFromResponse(transfer) {
        if (transfer.destNodeId === this.nodeId) {
            const msg = transfer.payload;
            if (msg instanceof DSDL.uavcan_protocol_GetNodeInfo_Response) {
                this.nodeMonitors[transfer.sourceNodeId] = msg.toObj();
            } else {
                console.error('msg is not instance of uavcan_protocol_GetNodeInfo_Response');
            }
        }
    }

    updateNodeMonitorStatus(transfer) {
        const msg = transfer.payload;
        if (msg instanceof DSDL.uavcan_protocol_NodeStatus) {
            if (this.nodeMonitors[transfer.sourceNodeId] === undefined) {
                this.nodeMonitors[transfer.sourceNodeId] = {};
            }
            this.nodeMonitors[transfer.sourceNodeId].status = msg.toObj();
        } else {
            console.error('msg is not instance of uavcan_protocol_NodeStatus');
        }
    }

    getNodeInfo(nodeId) {
        // console.log('Fetching node info:', nodeId);
        const msg = new DSDL.uavcan_protocol_GetNodeInfo_Request();
        this.request({req: msg, destNodeId: nodeId, priority: REQUEST_PRIORITY, callback: (transfer) => {
            this.updateNodeMonitorFromResponse(transfer);
        }});
    }

    restartNode(nodeId, callback=null) {
        const msg = new DSDL.uavcan_protocol_RestartNode_Request();
        msg.fields.magic_number.value = 0xACCE551B1E; //magic number;
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: true, priority: REQUEST_PRIORITY, callback: callback});
    }

    requestUavcanProtocolParamExecuteOpcode(nodeId, opcode, argument, callback=null) {
        const msg = new DSDL.uavcan_protocol_param_ExecuteOpcode_Request();
        msg.fields.opcode.value = opcode;
        msg.fields.argument.value = argument;
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: true, priority: REQUEST_PRIORITY, callback: callback});
    } 

    sendUavcanEquipmentEscRawCommand(nodeId, cmd, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_equipment_esc_RawCommand();
        msg.fields.cmd.items = cmd.map((value) => new PrimitiveType(value, PrimitiveType.KIND_SIGNED_INT, 14));
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: false, priority: priority});
    }

    sendUavcanEquipmentActuatorArrayCommand(nodeId, commands, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_equipment_actuator_ArrayCommand();
        msg.fields.commands.items = commands.map((command) => {
            if (command.id < 0 || command.id > 32) {
                throw new Error('Actuator ID must be between 0 and 255');
            }
            if (command.type < 0 || command.type > 3) {
                throw new Error('Command type must be between 0 and 3');
            }
            switch (command.type) {
                case 0:
                    if (command.value < -1 || command.value > 1) {
                        throw new Error('Command value must be between -1 and 1');
                    }
                    break;
                default:
                    if (command.value < -65504 || command.value > 65504) {
                        throw new Error('Command value must be between -65504 and 65504 for float16');
                    }
                    break;
            }
            const cmd = new DSDL.uavcan_equipment_actuator_Command();
            cmd.fields.actuator_id.value = command.id;
            cmd.fields.command_type.value = command.type;
            cmd.fields.command_value.value = command.value;
            return cmd;
        });
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: false, priority: priority});
    }

    sendUavcanProtocolDynamicNodeIdAllocation(first_part_of_unique_id, nodeId, unique_id, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_protocol_dynamic_node_id_Allocation();
        msg.fields.first_part_of_unique_id.value = first_part_of_unique_id;
        msg.fields.node_id.value = nodeId;
        msg.fields.unique_id.items = unique_id.map((value) => new PrimitiveType(value, PrimitiveType.KIND_UNSIGNED_INT, 8));
        this.request({req: msg, destNodeId: 0, requestNotResponse: false, serviceNotMessage: false, priority: priority});
    }

    sendUavcanEquipmentSafetyArmingStatus(nodeId, status, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_equipment_safety_ArmingStatus();
        msg.fields.status.value = Number(status);
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: false, priority: priority});
    }

    sendArdupilotIndicationSafetyState(nodeId, status, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.ardupilot_indication_SafetyState();
        msg.fields.status.value = Number(status);
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: false, priority: priority});
    }

    beginFirmwareUpdate(nodeId, filePath, callback=null) {
        const msg = new DSDL.uavcan_protocol_file_BeginFirmwareUpdate_Request();
        msg.fields.source_node_id.value = this.nodeId;
        msg.fields.image_file_remote_path.fields.path.fromString(filePath)
        this.request({req: msg, destNodeId: nodeId, requestNotResponse: true, serviceNotMessage: true, priority: REQUEST_PRIORITY, callback:callback}); 
    }

    responseUavcanProtocolFileRead(transfer, error, path, data) {
        const msg = new DSDL.uavcan_protocol_file_Read_Response();
        msg.fields.error.msg.fields.value.value = error;
        msg.fields.path = path;
        for (let i = 0; i < data.length; i++) {
            msg.fields.data.items.push(new PrimitiveType(data[i], PrimitiveType.KIND_UNSIGNED_INT, 8));
        }
        this.response({res: msg, transfer: transfer});
    }


    setNodeParamsRequestingIndex(sourceNodeId, index) {
        this.nodeParamsRequestingIndex[sourceNodeId] = index;
    }

    getNodeParamsRequestingIndex(sourceNodeId) {
        return this.nodeParamsRequestingIndex[sourceNodeId];
    }

    updateNodeParamsFromResponse(transfer, paramIndex) {
        const msg = transfer.payload;
        if (this.nodeParams[transfer.sourceNodeId] === undefined) {
            this.nodeParams[transfer.sourceNodeId] = {};
        }
        this.nodeParams[transfer.sourceNodeId][paramIndex] = msg;
    }

    setNodeParam(sourceNodeId, index, value) {
        const currentRequestIndex = index;
        const responseMsg = this.nodeParams[sourceNodeId][index];
        if (responseMsg === undefined) {
            console.error('Response message is undefined');
            return;
        }
        const msg = new DSDL.uavcan_protocol_param_GetSet_Request();
        msg.fields.index.value = index;
        msg.fields.name = responseMsg.fields.name;
        msg.fields.value = responseMsg.fields.value;
        if (responseMsg.fields.value.fields.string_value) {
            msg.fields.value.msg.unionField.fromString(value);
        } else {
            msg.fields.value.msg.unionField.value = value;
        }
        this.request({req: msg, destNodeId: sourceNodeId, serviceNotMessage: true, requestNotResponse: true, priority: REQUEST_PRIORITY, callback: (transfer) => {
            if (transfer.destNodeId === this.nodeId) {
                if (transfer.payload.fields.name.toString() === responseMsg.fields.name.toString()) {
                    this.updateNodeParamsFromResponse(transfer, currentRequestIndex);
                    console.log('Set param response:', transfer.payload.fields.name.toString(), transfer.payload);
                } else {
                    console.error('Set param response name mismatch');
                }
            }
        }});
    }

    fetchNodeParam(sourceNodeId, index, name, callback=null) {
        // console.log('Fetching node param:', sourceNodeId, index, name);
        // const currentRequestIndex = index;
        this.nodeParamsRequestingNodeId = sourceNodeId;
        this.setNodeParamsRequestingIndex(sourceNodeId, index);
        const msg = new DSDL.uavcan_protocol_param_GetSet_Request();
        msg.fields.index.value = index;
        const valueMsg = new DSDL.uavcan_protocol_param_Value();
        valueMsg.unionFieldIndex.value = 0;
        valueMsg.fields.empty = new CompoundType(new DSDL.uavcan_protocol_param_Empty());
        msg.fields.value.msg = valueMsg;
        msg.fields.name.fromString(name);
        this.request({req: msg, destNodeId: sourceNodeId, serviceNotMessage: true, requestNotResponse: true, priority: REQUEST_PRIORITY, callback: callback}); 
    }

    bitsToBuffer(bits) {
        const byteLength = Math.ceil(bits.length / 8);
        const buffer = Buffer.alloc(byteLength);
        for (let i = 0; i < bits.length; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            if (bits[i]) {
                buffer[byteIndex] |= (1 << (7 - bitIndex));
            }
        }
        return buffer;
    }
}

module.exports = Node;