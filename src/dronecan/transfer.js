/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Frame = require('./frame');
const DSDL = require('./dsdl');
const { crc16FromBytes, packBigInt64LE } = require('./common');

class Transfer {
    static DEFAULT_TRANSFER_PRIORITY = 31;

    constructor({
        transferId = 0,
        sourceNodeId = 0,
        destNodeId = null,
        payload = null,
        transferPriority = 20,
        requestNotResponse = false,
        serviceNotMessage = false,
        discriminator = null,
        canfd = false,
    } = {}) {
        this.transferId = transferId;
        this.sourceNodeId = sourceNodeId;
        this.destNodeId = destNodeId;
        this.payload = payload;
        this.transferPriority = transferPriority;
        this.requestNotResponse = requestNotResponse;
        this.serviceNotMessage = serviceNotMessage;
        this.discriminator = discriminator;
        this.canfd = canfd;
        if (this.payload) {
            this.dataTypeId = this.payload.dataTypeId;
        } else {
            this.dataTypeId = null;
        }
    }

    get messageId() {
        let id;
        id |= (this.transferPriority & 0x1F) << 24;
        id |= Number(this.serviceNotMessage) << 7;
        id |= this.sourceNodeId;

        if (this.serviceNotMessage) {
            id |= this.dataTypeId << 16;
            id |= Number(this.requestNotResponse) << 15;
            id |= this.destNodeId << 8;
        } else if (this.sourceNodeId === 0) {
            id |= this.discriminator << 10;
            id |= (this.dataTypeId & 0x3) << 8;
        } else {
            id |= this.dataTypeId << 8;
        }
        return id;
    }

    set messageId(value) {
        this.transferPriority = (value >> 24) & 0x1F;
        this.serviceNotMessage = Boolean((value >> 7) & 0x1);
        this.sourceNodeId = value & 0x7F;
        if (this.serviceNotMessage) {
            this.dataTypeId = (value >> 16) & 0xFF;
            this.requestNotResponse = Boolean(value & 0x8000);
            this.destNodeId = (value >> 8) & 0x7F;
        } else if (this.sourceNodeId === 0) {
            this.discriminator = (value >> 10) & 0x3FFF;
            this.dataTypeId = (value >> 8) & 0x3;
        } else {
            this.dataTypeId = (value >> 8) & 0xFFFF;
        }
    }

    toFrames(req, tao=true) {
        const outFrames = [];
        let payloadBits = this.payload.pack(tao);
        let payload = this.bitsToBuffer(payloadBits);

        const frameMax = this.canfd ? 64 : 8;

        if (this.canfd && payload.length > 7) {
            let totalLen = payload.length + 1;
            if (totalLen > frameMax) {
                totalLen += 2;
            }
            const modLen = totalLen % (frameMax - 1);
            const roundedLength = Math.ceil(modLen / 8) * 8;
            const padlen = roundedLength - modLen;
            payload = Buffer.concat([payload, Buffer.alloc(padlen)]);
        }

        let remainingPayload = payload;

        if (remainingPayload.length > frameMax - 1) {
            const baseCrc = crc16FromBytes(packBigInt64LE(req.getDataTypeSignature()));
            const crc = crc16FromBytes(payload, baseCrc);
            remainingPayload = Buffer.concat([Buffer.from([crc & 0xFF, crc >> 8]), remainingPayload]);
        }

        let tail = 0x20;
        while (true) {
            tail = ((outFrames.length === 0 ? 0x80 : 0) | // Start of transfer
                    (remainingPayload.length <= (frameMax - 1) ? 0x40 : 0) | // End of transfer
                    ((tail ^ 0x20) & 0x20) | // Toggle bit
                    (this.transferId & 0x1F));

            let remainingPayloadLength = remainingPayload.length;
            let frameBuffer = remainingPayload.slice(0, frameMax - 1);
            frameBuffer = Buffer.concat([frameBuffer, Buffer.from([tail])]);
            outFrames.push(new Frame(this.messageId, frameBuffer, true, this.canfd));
            remainingPayload = remainingPayload.slice(frameMax - 1, remainingPayloadLength);
            if (remainingPayload.length === 0) {
                break;
            }
        }

        return outFrames;
    }

    padToByteBoundary(bits) {
        const padLength = (8 - (bits.length % 8)) % 8;
        return bits + '0'.repeat(padLength);
    }

    fromFrames(frames) {
        this.tsMonotonic = frames[0].tsMonotonic;
        this.tsReal = frames[0].tsReal;

        let expectedToggle = 0;
        const expectedTransferId = frames[0].data[frames[0].data.length - 1] & 0x1F;
        for (let idx = 0; idx < frames.length; idx++) {
            const tail = frames[idx].data[frames[idx].data.length - 1];
            if ((tail & 0x1F) !== expectedTransferId) {
                throw new Error(`Transfer ID ${tail & 0x1F} incorrect, expected ${expectedTransferId}`);
            } else if (idx === 0 && !(tail & 0x80)) {
                throw new Error("Start of transmission not set on frame 0");
            } else if (idx > 0 && (tail & 0x80)) {
                throw new Error(`Start of transmission set unexpectedly on frame ${idx}`);
            } else if (idx === frames.length - 1 && !(tail & 0x40)) {
                throw new Error("End of transmission not set on last frame");
            } else if (idx < frames.length - 1 && (tail & 0x40)) {
                throw new Error(`End of transmission set unexpectedly on frame ${idx}`);
            } else if ((tail & 0x20) !== expectedToggle) {
                throw new Error(`Toggle bit value ${tail & 0x20} incorrect on frame ${idx}`);
            }
            expectedToggle ^= 0x20;
        }

        this.transferId = expectedTransferId;
        this.messageId = frames[0].id;
        let payloadBytes = Buffer.concat(frames.map(f => f.data.slice(0, -1)));

        let payloadClass;
        if (this.serviceNotMessage) {
            let serviceGroup = DSDL.services[this.dataTypeId]
            if (!serviceGroup) {
                throw new Error(`Unknown service type ID: ${this.dataTypeId}`);
            }
            if (this.requestNotResponse) {
                payloadClass = serviceGroup['request'];
            } else {
                payloadClass = serviceGroup['response'];
            }
        } else {
            payloadClass = DSDL.messages[this.dataTypeId];
        }

        if (frames.length > 1) {
            const transferCrc = payloadBytes[0] + (payloadBytes[1] << 8);
            payloadBytes = payloadBytes.slice(2, payloadBytes.length);
            const baseCrc = crc16FromBytes(packBigInt64LE(payloadClass.getDataTypeSignature()));
            const crc = crc16FromBytes(payloadBytes, baseCrc);
            if (crc !== transferCrc) {
                throw new Error(`CRC mismatch: expected ${crc}, got ${transferCrc}`);
            }
        }
        let tao = !this.canfd;

        if (!payloadClass) {
            throw new Error(`Unknown data type ID: ${this.dataTypeId}`);
        }

        this.payload = payloadClass.unpack(payloadBytes, tao);
        this._payloadBytes = payloadBytes;
    }

    get key() {
        return [this.messageId, this.transferId];
    }

    isResponseTo(transfer) {
        return (transfer.serviceNotMessage &&
                this.serviceNotMessage &&
                transfer.requestNotResponse &&
                !this.requestNotResponse &&
                transfer.destNodeId === this.sourceNodeId &&
                transfer.sourceNodeId === this.destNodeId &&
                transfer.dataTypeId === this.dataTypeId &&
                transfer.transferId === this.transferId);
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

module.exports = Transfer;