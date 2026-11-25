/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

// Above eight bytes, CAN FD encodes only these payload lengths in the DLC.
const FD_LENGTHS = [12, 16, 20, 24, 32, 48, 64];

class Frame {
    static roundFDLength(length) {
        if (!Number.isInteger(length) || length < 0 || length > 64) {
            throw new RangeError('CAN FD frame length must be between 0 and 64');
        }
        return length <= 8 ? length : FD_LENGTHS.find(size => size >= length);
    }

    static isValidTransferFrame(frame) {
        if (!frame || frame.extended === false || !Number.isInteger(frame.id) ||
            frame.id < 0 || frame.id > 0x1FFFFFFF) return false;
        const size = frame.data?.length;
        if (!Number.isInteger(size) || size < 1 ||
            (size > 8 && !(frame.canfd && FD_LENGTHS.includes(size)))) return false;
        // Anonymous sources can publish only single-frame messages, never services.
        if ((frame.id & 0x7F) === 0) {
            return !(frame.id & 0x80) && (frame.data[size - 1] & 0xC0) === 0xC0;
        }
        return true;
    }

    constructor(can_id, data, extended = true, canfd = false) {
        this.id = can_id;
        this.data = data instanceof Array ? new Uint8Array(data) : data;
        this.extended = extended;
        this.tsMonotonic = performance.now() / 1000; // Use performance.now() for monotonic time
        this.tsReal = Date.now() / 1000; // Use Date.now() for real time
        this.canfd = canfd;
        this.MAX_DATA_LENGTH = canfd ? 64 : 8;
    };

    get transferKey() {
        // The transfer is uniquely identified by the message ID and the 5-bit Transfer ID contained in the last byte of the frame payload.
        return [this.id, this.data.length > 0 ? (this.data[this.data.length - 1] & 0x1F) : null];
    }

    get startOfTransfer() {
        return this.data.length > 0 ? Boolean(this.data[this.data.length - 1] & 0x80) : false;
    }

    get endOfTransfer() {
        return this.data.length > 0 ? Boolean(this.data[this.data.length - 1] & 0x40) : false;
    }

    get dataTypeId() {
        if (this.isService()) return this.serviceTypeId;
        return (this.id >> 8) & (this.sourceNodeId === 0 ? 0x3 : 0xFFFF);
    }

    get sourceNodeId() {
        return this.id & 0x7F;
    };

    get destNodeId() {
        return this.isService() ? (this.id >> 8) & 0x7F : null;
    }

    get priority() {
        return (this.id >> 24) & 0x1F;
    }

    get serviceTypeId() {
        return (this.id >> 16) & 0xFF;
    }

    isService() {
        return (this.id >> 7) & 0x1;
    }

    isExtended() {
        return this.extended;
    };

    isFD() {
        return this.canfd;
    };
}

module.exports = Frame;