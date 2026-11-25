/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const EventEmitter = require('events');
const TransferManager = require('./transfer_manager');
const PrimitiveType = require('./primitive_type');
const Frame = require('./frame');
const Transfer = require('./transfer');
const DSDL = require('./dsdl');
var Buffer = require('buffer').Buffer;

const REQUEST_PRIORITY = 30;
const REQUEST_TIMEOUT_MS = 1000;
// OFFLINE_TIMEOUT_MS from uavcan.protocol.NodeStatus.
const NODE_OFFLINE_TIMEOUT_MS = 3000;

function normalizeNodeId(id, allowAnonymous = false) {
    if (allowAnonymous && id == null) return null;
    if (typeof id === 'string' && /^\d+$/.test(id)) id = Number(id);
    const min = allowAnonymous ? 0 : 1;
    if (!Number.isInteger(id) || id < min || id > 127) {
        throw new RangeError(`Node ID must be an integer between ${min} and 127`);
    }
    return id;
}

function serviceDescriptor(bus, dataTypeId, client, server) {
    return [bus, 'service', dataTypeId, client, server].join(':');
}

function requestError(code, message) {
    return Object.assign(new Error(message), { code });
}

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
        this.nodeId = normalizeNodeId(nodeId, true);
        this.name = name;
        this.nodeStatusInterval = nodeStatusInterval;
        this.mode = mode;
        this.nodeInfo = nodeInfo;
        this.catchHandlerExceptions = catchHandlerExceptions;
        this.sendCanfd = sendCanfd;

        this.bus = 0;
        this.nodeMonitors = {};
        this.lastHeartbeats = new Map();
        this.peerSessionIds = new Uint32Array(128);
        this.sessionId = 0;
        this.nodeInfoPending = new Map();
        this.nodeParams = {};
        this.nodeParamsRequestingIndex = {};
        this.nodeParamsRequestingNodeId = null;
        this.subscribers = {};
        this.subscribersMaxItems = 10;
        this.transferManager = new TransferManager();
        this.txQueue = [];
        this.priority = 20; // Set default priority
        this.callbacks = new Map();
        this.cancelledServiceKeys = new Set();
        this.paramWriteOrder = new WeakMap();
        this.nextParamWrite = 0;

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
        this.hardware_version.fields.certificate_of_authenticity.items = [];

        this.software_version = new DSDL.uavcan_protocol_SoftwareVersion();
        this.software_version.fields.major.value = 1;
        this.software_version.fields.minor.value = 0;
        this.software_version.fields.vcs_commit.value = 0;
        this.software_version.fields.optional_field_flags.value = 1;
        this.software_version.fields.image_crc.value = 0;

        const nodeStatusIntervalID = setInterval(() => {
            this.transferManager.removeInactiveTransfers();
            if (this.nodeId) {
                this.status.fields.uptime_sec.value = parseInt((new Date() - this.uptimeBegin) / 1000);
                this.request({req: this.status, destNodeId: 0, serviceNotMessage: false, priority: REQUEST_PRIORITY});
            }
        }, 1000 * nodeStatusInterval);

        this.nodeStatusIntervalID = nodeStatusIntervalID;

        this.on('can-frame', (id, data, len, bus = this.bus, canfd = false) => {
            if (bus !== this.bus || (id & (TransferManager.FlagRTR | TransferManager.FlagERR))) return;
            let buf = Buffer.from(data, 'binary');
            buf = buf.slice(0, len);
            let canId = id & 0x1FFFFFFF;
            const canFrame = new Frame(
                canId,
                buf,
                true,
                canfd
            );
            this.handleFrame(canFrame);
        });

        this.on('uavcan.protocol.GetNodeInfo.Request', (transfer) => {
            this.responseNodeInfo(transfer);
        });

        this.on('uavcan.protocol.NodeStatus', (transfer) => {
            this.nodeMonitorsUpdate(transfer);
        });
    }

    setNodeId(nodeId) {
        nodeId = normalizeNodeId(nodeId, true);
        if (nodeId === this.nodeId) return;
        this.nodeId = nodeId;
        this.resetSession('node-id-changed');
    }

    refreshNodeMonitor() {
        this.nodeMonitors = {};
    }

    setBus(bus) {
        this.changeBus(bus);
    }

    changeBus(bus) {
        if (bus === this.bus) return;
        this.bus = bus;
        this.resetSession('bus-changed');
    }

    resetSession(reason = 'session-reset') {
        this.sessionId += 1;
        const pendingRequests = [...this.callbacks.values()];
        for (const pending of pendingRequests) {
            this.cancelRequest(pending.transfer);
        }
        this.transferManager.resetReceiveState();
        this.lastHeartbeats.clear();
        this.refreshNodeMonitor();
        this.nodeParams = {};
        this.nodeInfoPending.clear();
        this.nodeParamsRequestingIndex = {};
        this.nodeParamsRequestingNodeId = null;
        this.subscribers = {};
        this.emit('session-change', { reason, bus: this.bus, nodeId: this.nodeId, sessionId: this.sessionId });
        this.emit('nodeList', this.nodeMonitors);
        for (const pending of pendingRequests) {
            this.notifyRequestFailure(pending.transfer, pending.onError, requestError(
                'SESSION_RESET', `DroneCAN session changed (${reason})`
            ));
        }
    }

    updateSubscribers(transfer) {
        if (this.subscribers[transfer.dataTypeId] === undefined) {
            this.subscribers[transfer.dataTypeId] = [];
        }
        const msg = transfer.payload;
        const history = this.subscribers[transfer.dataTypeId];
        history.push([msg.name, msg.toObj()]);
        if (history.length > this.subscribersMaxItems) {
            history.splice(0, history.length - this.subscribersMaxItems);
        }
    }

    setSubscriberMaxItems(maxItems) {
        if (!Number.isInteger(maxItems) || maxItems < 1) {
            throw new Error('Max items must be greater than 0');
        }
        if (maxItems > 50) {
            throw new Error('Max items must be at most 50');
        }
        this.subscribersMaxItems = maxItems;
    }

    responseNodeInfo(transfer) {
        if (this.nodeId && transfer?.destNodeId === this.nodeId) {
            const msg = new DSDL.uavcan_protocol_GetNodeInfo_Response();
            this.status.fields.uptime_sec.value = parseInt((new Date() - this.uptimeBegin) / 1000);
            msg.fields.status.msg = this.status;
            msg.fields.name.fromString(this.name);
            msg.fields.hardware_version.msg = this.hardware_version;
            msg.fields.software_version.msg = this.software_version;
            this.response({res: msg, transfer});
        }
    }

    nodeMonitorsUpdate(transfer) {
        const now = performance.now();
        const nodeId = transfer.sourceNodeId;
        const lastHeartbeat = this.lastHeartbeats.get(nodeId);
        const previous = lastHeartbeat?.status ?? this.nodeMonitors[nodeId]?.status;
        const offlineMode = DSDL.uavcan_protocol_NodeStatus.CONSTANTS.mode.OFFLINE;
        const offline = transfer.payload.fields.mode.value === offlineMode;
        const restarted = previous?.uptime_sec > transfer.payload.fields.uptime_sec.value;
        const reconnected = lastHeartbeat !== undefined && !offline &&
            (now - lastHeartbeat.at >= NODE_OFFLINE_TIMEOUT_MS || previous?.mode === offlineMode);
        const cancelled = [];
        if (restarted || reconnected) {
            this.peerSessionIds[nodeId]++;
            this.transferManager.resetSourceReceiveState(transfer);
            delete this.nodeMonitors[nodeId];
            delete this.nodeParams[nodeId];
            delete this.nodeParamsRequestingIndex[nodeId];
            if (this.nodeParamsRequestingNodeId === nodeId) this.nodeParamsRequestingNodeId = null;
            this.nodeInfoPending.delete(nodeId);
            for (const request of this.callbacks.values()) {
                if (request.transfer.destNodeId === nodeId) {
                    this.cancelRequest(request.transfer);
                    cancelled.push(request);
                }
            }
        }
        this.updateNodeMonitorStatus(transfer);
        this.lastHeartbeats.set(nodeId, { at: now, status: this.nodeMonitors[nodeId].status });
        const pending = this.nodeInfoPending;
        if (!offline && this.nodeId && nodeId !== this.nodeId && !this.nodeMonitors[nodeId].name && !pending.has(nodeId)) {
            const done = () => {
                if (pending.get(nodeId) === done) pending.delete(nodeId);
            };
            pending.set(nodeId, done);
            this.getNodeInfo(nodeId, done, done);
        }
        this.emit('nodeList', this.nodeMonitors);
        for (const { transfer: request, onError } of cancelled) {
            const error = restarted ? requestError('NODE_RESTARTED', `Node ${nodeId} restarted`)
                : requestError('NODE_RECONNECTED', `Node ${nodeId} returned after going offline`);
            this.notifyRequestFailure(request, onError, error);
        }
    }

    handleFrame(frame) {
        const transfer = this.transferManager.addFrame(frame);
        if (!transfer) return;
        transfer.bus = this.bus;
        transfer.sessionId = this.sessionId;
        const topic = transfer.payload.name;
        if (transfer.serviceNotMessage) {
            if (transfer.requestNotResponse) {
                transfer.peerSessionId = this.peerSessionIds[transfer.sourceNodeId];
            } else {
                const descriptor = serviceDescriptor(this.bus, transfer.dataTypeId, transfer.destNodeId, transfer.sourceNodeId);
                const key = descriptor + ':' + transfer.transferId;
                const pending = this.callbacks.get(key);
                if (pending && transfer.isResponseTo(pending.transfer)) {
                    clearTimeout(pending.timer);
                    this.callbacks.delete(key);
                    pending.callback?.(transfer);
                }
            }
            this.emit(topic + (transfer.requestNotResponse ? '.Request' : '.Response'), transfer);
        } else {
            this.emit(topic, transfer);
            this.emit('message', transfer);
        }
        this.emit('transfer-rx', transfer);
    }

    request({
        req, destNodeId, requestNotResponse = true, serviceNotMessage = true,
        priority = REQUEST_PRIORITY, canfd = this.sendCanfd, callback = null, onError = null,
        timeoutMs = REQUEST_TIMEOUT_MS
    }) {
        if (serviceNotMessage && !requestNotResponse) {
            throw new TypeError('Send a service response with response()');
        }
        if (serviceNotMessage) destNodeId = normalizeNodeId(destNodeId);
        const transfer = new Transfer({
            sourceNodeId: this.nodeId ?? 0, destNodeId, payload: req, requestNotResponse,
            serviceNotMessage, transferPriority: priority, canfd
        });
        transfer.bus = this.bus;
        transfer.sessionId = this.sessionId;
        if (serviceNotMessage && !this.nodeId) {
            this.notifyRequestFailure(transfer, onError, requestError('NO_NODE_ID', 'A service request requires a local node ID'));
            return null;
        }

        const descriptor = serviceNotMessage
            ? serviceDescriptor(this.bus, req.dataTypeId, this.nodeId, destNodeId)
            : [this.bus, 'message', req.dataTypeId, this.nodeId].join(':');
        const isPending = serviceNotMessage ? tid => {
            const key = descriptor + ':' + tid;
            return this.callbacks.has(key) || this.cancelledServiceKeys.has(key);
        } : null;
        // Invalid payloads must not advance the sequence. Reserve the ID before any sendFrame callback.
        const payload = transfer.encodePayload();
        try {
            transfer.transferId = this.transferManager.getNextTransferId(descriptor, isPending);
        } catch (error) {
            if (!(error instanceof RangeError)) throw error;
            this.notifyRequestFailure(transfer, onError, requestError('REQUEST_PENDING', error.message));
            return null;
        }

        const frames = transfer.framesFromPayload(payload);
        if (serviceNotMessage) {
            transfer.peerSessionId = this.peerSessionIds[destNodeId];
            const key = descriptor + ':' + transfer.transferId;
            const timer = setTimeout(() => {
                if (this.cancelRequest(transfer)) {
                    this.notifyRequestFailure(transfer, onError, requestError('REQUEST_TIMEOUT',
                        `Timed out waiting for ${req.name} response from node ${destNodeId}`));
                }
            }, timeoutMs);
            timer.unref?.();
            transfer.serviceKey = key;
            this.callbacks.set(key, { transfer, callback, onError, timer });
        }

        return this.sendTransfer(transfer, frames);
    }

    notifyRequestFailure(transfer, onError, error) {
        onError?.(error);
        this.emit('request-error', error, transfer);
    }

    cancelRequest(transfer) {
        const key = transfer.serviceKey;
        const pending = this.callbacks.get(key);
        if (pending?.transfer !== transfer) return false;
        clearTimeout(pending.timer);
        this.callbacks.delete(key);
        // A late response carries only the 5-bit transfer ID, even across a session reset.
        this.cancelledServiceKeys.add(key);
        setTimeout(() => this.cancelledServiceKeys.delete(key), TransferManager.TRANSFER_TIMEOUT_MS).unref?.();
        return true;
    }

    response({res, transfer, canfd = transfer.canfd}) {
        if (!this.nodeId || !transfer.serviceNotMessage || !transfer.requestNotResponse
            || transfer.destNodeId !== this.nodeId || transfer.dataTypeId !== res.dataTypeId
            || (transfer.peerSessionId !== undefined && transfer.peerSessionId !== this.peerSessionIds[transfer.sourceNodeId])
            || (transfer.sessionId !== undefined && transfer.sessionId !== this.sessionId)) {
            return null;
        }

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
        responseTransfer.bus = this.bus;
        responseTransfer.sessionId = this.sessionId;
        responseTransfer.peerSessionId = transfer.peerSessionId;
        return this.sendTransfer(responseTransfer, responseTransfer.toFrames(res));
    }

    sendTransfer(transfer, frames) {
        // sendFrame listeners can submit another transfer before the current frame returns.
        const entry = { transfer, frames };
        this.txQueue.push(entry);
        if (this.txQueue.length > 1) return transfer;

        let result = null;
        const failures = [];
        try {
            for (const item of this.txQueue) {
                try {
                    const sent = this.sendFrames(item.transfer, item.frames, item !== entry);
                    if (item === entry) result = sent;
                } catch (error) {
                    // Finish the queue even if the adapter or an error listener throws.
                    failures.push(error);
                }
            }
        } finally {
            this.txQueue.length = 0;
        }
        if (failures.length) throw failures[0];
        return result;
    }

    sendFrames(transfer, frames, queued) {
        const pending = this.callbacks.get(transfer.serviceKey);
        try {
            return this.emitTransferFrames(transfer, frames);
        } catch (error) {
            const cancelled = this.cancelRequest(transfer);
            // A queued caller already has its handle, so report its error on that transfer.
            if (queued || (cancelled && pending.onError)) {
                this.notifyRequestFailure(transfer, cancelled ? pending.onError : null, error);
                return null;
            }
            throw error;
        }
    }

    emitTransferFrames(transfer, frames) {
        const sessionIsCurrent = () => transfer.sessionId === this.sessionId &&
            (transfer.peerSessionId === undefined || transfer.peerSessionId === this.peerSessionIds[transfer.destNodeId]);
        if (!sessionIsCurrent()) return null;
        for (const frame of frames) {
            if (transfer.serviceKey && this.callbacks.get(transfer.serviceKey)?.transfer !== transfer) return null;
            let messageId = frame.id;
            if (frame.extended) {
                messageId = (messageId | (1 << 31)) >>> 0;
            }
            this.emit('sendFrame', messageId, frame.data, frame.data.length, transfer.bus, frame.canfd);
            if (!sessionIsCurrent()) return null;
        }
        this.emit('transfer-tx', transfer);
        return transfer;
    }

    updateNodeMonitorFromResponse(transfer) {
        if (transfer.destNodeId === this.nodeId) {
            const msg = transfer.payload;
            if (msg instanceof DSDL.uavcan_protocol_GetNodeInfo_Response) {
                const info = msg.toObj();
                const nodeId = transfer.sourceNodeId;
                // Heartbeats determine uptime continuity. A service reply can arrive between them.
                info.status = this.lastHeartbeats.get(nodeId)?.status ?? info.status;
                this.nodeMonitors[nodeId] = info;
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

    getNodeInfo(nodeId, callback = null, onError = null) {
        const msg = new DSDL.uavcan_protocol_GetNodeInfo_Request();
        return this.request({
            req: msg, destNodeId: nodeId, onError,
            callback: (transfer) => {
                this.updateNodeMonitorFromResponse(transfer);
                this.emit('nodeList', this.nodeMonitors);
                callback?.(transfer);
            }
        });
    }

    restartNode(nodeId, callback = null, onError = null) {
        const msg = new DSDL.uavcan_protocol_RestartNode_Request();
        msg.fields.magic_number.value = 0xACCE551B1E;
        return this.request({ req: msg, destNodeId: nodeId, callback, onError });
    }

    requestUavcanProtocolParamExecuteOpcode(nodeId, opcode, argument, callback = null, onError = null) {
        const msg = new DSDL.uavcan_protocol_param_ExecuteOpcode_Request();
        msg.fields.opcode.value = opcode;
        msg.fields.argument.value = argument;
        return this.request({ req: msg, destNodeId: nodeId, callback, onError });
    }

    sendUavcanProtocolDynamicNodeIdAllocation(first_part_of_unique_id, nodeId, unique_id, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_protocol_dynamic_node_id_Allocation();
        msg.fields.first_part_of_unique_id.value = first_part_of_unique_id;
        msg.fields.node_id.value = nodeId;
        msg.fields.unique_id.items = Array.from(unique_id, (value) => new PrimitiveType(value, PrimitiveType.KIND_UNSIGNED_INT, 8));
        return this.request({req: msg, destNodeId: 0, requestNotResponse: false, serviceNotMessage: false, priority: priority});
    }

    sendUavcanEquipmentEscRawCommand(nodeId, cmd, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_equipment_esc_RawCommand();
        if ((!Array.isArray(cmd) && !(ArrayBuffer.isView(cmd) && Number.isInteger(cmd.length))) || cmd.length > msg.fields.cmd.max_size) {
            throw new RangeError('ESC raw command must contain at most 20 channels');
        }
        const { min, max } = msg.fields.cmd.value_type.value_range;
        msg.fields.cmd.items = Array.from(cmd, (value) => {
            if (!Number.isInteger(value) || value < min || value > max) {
                throw new RangeError('ESC raw command value must be an integer between -8192 and 8191');
            }
            return new PrimitiveType(value, PrimitiveType.KIND_SIGNED_INT, 14);
        });
        return this.request({ req: msg, destNodeId: nodeId, serviceNotMessage: false, priority });
    }

    sendUavcanEquipmentActuatorArrayCommand(nodeId, commands, priority=REQUEST_PRIORITY) {
        const msg = new DSDL.uavcan_equipment_actuator_ArrayCommand();
        const actuatorTypes = Object.values(DSDL.uavcan_equipment_actuator_Command.CONSTANTS.command_type);
        if (!Array.isArray(commands) || commands.length > msg.fields.commands.max_size) {
            throw new RangeError('Actuator array command must contain at most 15 actuators');
        }
        msg.fields.commands.items = Array.from(commands, (command) => {
            if (!Number.isInteger(command?.id) || command.id < 0 || command.id > 255) {
                throw new RangeError('Actuator ID must be an integer between 0 and 255');
            }
            if (!actuatorTypes.includes(command.type)) {
                throw new RangeError('Unknown actuator command type');
            }
            const limit = command.type === 0 ? 1 : 65504;
            if (!Number.isFinite(command.value) || Math.abs(command.value) > limit) {
                throw new RangeError(`Command value must be between -${limit} and ${limit}`);
            }
            const cmd = new DSDL.uavcan_equipment_actuator_Command();
            cmd.fields.actuator_id.value = command.id;
            cmd.fields.command_type.value = command.type;
            cmd.fields.command_value.value = command.value;
            return cmd;
        });
        return this.request({ req: msg, destNodeId: nodeId, serviceNotMessage: false, priority });
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

    beginFirmwareUpdate(nodeId, filePath, callback = null, onError = null) {
        const msg = new DSDL.uavcan_protocol_file_BeginFirmwareUpdate_Request();
        msg.fields.source_node_id.value = this.nodeId;
        msg.fields.image_file_remote_path.fields.path.fromString(filePath);
        return this.request({ req: msg, destNodeId: nodeId, callback, onError });
    }

    responseUavcanProtocolFileRead(transfer, error, _path, data) {
        const msg = new DSDL.uavcan_protocol_file_Read_Response();
        msg.fields.error.msg.fields.value.value = error;
        for (let i = 0; i < data.length; i++) {
            msg.fields.data.push(new PrimitiveType(data[i], PrimitiveType.KIND_UNSIGNED_INT, 8));
        }
        return this.response({ res: msg, transfer });
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

    setNodeParam(sourceNodeId, index, value, onError = null) {
        sourceNodeId = normalizeNodeId(sourceNodeId);
        const params = this.nodeParams[sourceNodeId];
        const responseMsg = params?.[index];
        if (responseMsg === undefined) {
            console.error('Response message is undefined');
            return null;
        }
        const order = ++this.nextParamWrite;
        const currentValue = responseMsg.fields.value.msg;
        const fieldIndex = currentValue.unionFieldIndex.value;
        const fieldName = currentValue.unionFields[fieldIndex];
        if (!currentValue.unionField || fieldName === 'empty') return null;

        const msg = new DSDL.uavcan_protocol_param_GetSet_Request();
        msg.fields.index.value = index;
        const paramName = responseMsg.fields.name.toString();
        msg.fields.name.fromString(paramName);
        const newValue = msg.fields.value.msg;
        newValue.unionFieldIndex.value = fieldIndex;
        if (fieldName === 'string_value') {
            if (typeof value === 'string') newValue.unionField.fromString(value);
            else newValue.unionField.fromBytes(value);
        } else {
            newValue.unionField.value = value;
        }
        return this.request({
            req: msg, destNodeId: sourceNodeId, onError,
            callback: (transfer) => {
                if (this.nodeParams[sourceNodeId] !== params) return;
                // A refetch or a later confirmed write takes precedence over this reply.
                const current = params[index];
                if (current !== responseMsg) {
                    const confirmedOrder = this.paramWriteOrder.get(current);
                    if (confirmedOrder === undefined || confirmedOrder > order) return;
                }
                const confirmedName = transfer.payload.fields.name.toString();
                const confirmedValue = transfer.payload.fields.value.msg;
                if (!confirmedName || confirmedValue.unionFields[confirmedValue.unionFieldIndex.value] === 'empty') {
                    this.notifyRequestFailure(transfer, onError, requestError('PARAM_NOT_FOUND',
                        `Node ${sourceNodeId} did not report parameter ${paramName}`));
                    return;
                }
                if (confirmedName !== paramName) {
                    this.notifyRequestFailure(transfer, onError, requestError('PARAM_NAME_MISMATCH',
                        `Expected parameter ${paramName} in the GetSet response`));
                    return;
                }
                this.paramWriteOrder.set(transfer.payload, order);
                this.updateNodeParamsFromResponse(transfer, index);
            }
        });
    }

    fetchNodeParam(sourceNodeId, index, name, callback = null, onError = null, timeoutMs = REQUEST_TIMEOUT_MS) {
        sourceNodeId = normalizeNodeId(sourceNodeId);
        this.nodeParamsRequestingNodeId = sourceNodeId;
        this.setNodeParamsRequestingIndex(sourceNodeId, index);
        const msg = new DSDL.uavcan_protocol_param_GetSet_Request();
        msg.fields.index.value = index;
        msg.fields.name.fromString(name);
        return this.request({ req: msg, destNodeId: sourceNodeId, callback, onError, timeoutMs });
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
