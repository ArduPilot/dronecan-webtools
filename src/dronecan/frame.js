/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

class Frame {
    constructor(can_id, data, extended, canfd) {
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
        return (this.id >> 8) & 0xFFFF;
    }

    get sourceNodeId() {
        return this.id & 0x7F;
    };

    get destNodeId() {
        return (this.id >> 8) & 0x7F;
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