/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Frame = require('./frame');
const Transfer = require('./transfer');

const TRANSFER_TIMEOUT_MS = 2000;
const TID_COUNT = 32;

class TransferManager {
    static TRANSFER_TIMEOUT_MS = TRANSFER_TIMEOUT_MS;
    static MaskStdID = 0x000007FF;
    static MaskExtID = 0x1FFFFFFF;
    static FlagEFF = 1 << 31;
    static FlagRTR = 1 << 30;
    static FlagERR = 1 << 29;

    constructor() {
        this.nextTransferIds = new Map();
        this.resetReceiveState();
    }

    getNextTransferId(descriptor = '', isInUse = null) {
        const key = JSON.stringify(descriptor);
        const tid = this.nextTransferIds.get(key) ?? 0;
        if (isInUse?.(tid)) {
            throw new RangeError('The next transfer ID is still reserved for this descriptor');
        }
        this.nextTransferIds.set(key, (tid + 1) % TID_COUNT);
        return tid;
    }

    resetReceiveState() {
        this.rxStates = new Map();
        this.lastCompleted = new Map();
        this.lastPruneAt = 0;
    }

    resetSourceReceiveState(heartbeat) {
        const nodeId = heartbeat.sourceNodeId;
        for (const [key, state] of this.rxStates) {
            if ((state.frames[0].id & 0x7f) === nodeId) this.rxStates.delete(key);
        }
        // Keep the heartbeat we just accepted so a duplicate cannot start another session.
        const heartbeatDescriptor = heartbeat.messageId & 0x00ffffff;
        for (const descriptor of this.lastCompleted.keys()) {
            if ((descriptor & 0x7f) === nodeId && descriptor !== heartbeatDescriptor) {
                this.lastCompleted.delete(descriptor);
            }
        }
    }

    removeInactiveTransfers(now = performance.now()) {
        for (const states of [this.rxStates, this.lastCompleted]) {
            for (const [key, state] of states) {
                if (now - state.lastSeen >= TRANSFER_TIMEOUT_MS) states.delete(key);
            }
        }
        this.lastPruneAt = now;
    }

    addFrame(frame, now = performance.now()) {
        if (now - this.lastPruneAt >= TRANSFER_TIMEOUT_MS) this.removeInactiveTransfers(now);
        if (!Frame.isValidTransferFrame(frame)) return null;

        // Frames in one transfer use the same CAN ID, priority and link format.
        const key = frame.id * 2 + Number(Boolean(frame.canfd));
        const tail = frame.data[frame.data.length - 1];
        const tid = tail & 31;
        const toggle = Boolean(tail & 0x20);
        // The transfer-ID sequence belongs to the descriptor, independent of
        // priority (bits 24..28) and Classic CAN vs CAN FD.
        const descriptor = frame.id & 0x00ffffff;
        const completed = this.lastCompleted.get(descriptor);
        if (completed?.tid === tid && now - completed.lastSeen < TRANSFER_TIMEOUT_MS) return null;

        let state = this.rxStates.get(key);
        if (state && now - state.lastSeen >= TRANSFER_TIMEOUT_MS) {
            this.rxStates.delete(key);
            state = undefined;
        }

        if (frame.startOfTransfer) {
            if (toggle) return null;
            // A new start supersedes an incomplete transfer on this CAN ID.
            state = { tid, frames: [], lastSeen: now };
            this.rxStates.set(key, state);
        } else if (state?.tid !== tid || toggle !== Boolean(state.frames.length % 2)) {
            return null;
        }

        state.frames.push(frame);
        state.lastSeen = now;
        if (!frame.endOfTransfer) return null;
        this.rxStates.delete(key);

        try {
            const transfer = new Transfer();
            transfer.fromFrames(state.frames);
            // Responses can complete out of order: after TX wraps, two distinct
            // requests can receive the same TID consecutively on this receive stream.
            if (transfer.sourceNodeId !== 0 && (!transfer.serviceNotMessage || transfer.requestNotResponse)) {
                this.lastCompleted.set(descriptor, { tid, lastSeen: now });
                // Another priority or link format may already have assembled part
                // of the same transfer. Its tail can arrive after the next TID.
                for (const [otherKey, pending] of this.rxStates) {
                    if (pending.tid === tid && (pending.frames[0].id & 0x00ffffff) === descriptor) {
                        this.rxStates.delete(otherKey);
                    }
                }
            }
            return transfer;
        } catch {
            return null;
        }
    }
}

module.exports = TransferManager;
