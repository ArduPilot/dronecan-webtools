/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const Transfer = require('./transfer');
class TransferManager {
    static MaskStdID = 0x000007FF;
    static MaskExtID = 0x1FFFFFFF;
    static FlagEFF = 1 << 31; // Extended frame format
    static FlagRTR = 1 << 30; // Remote transmission request
    static FlagERR = 1 << 29; // Error frame
    constructor() {
        this.activeTransfers = {};
        this.activeTransferTimestamps = {};
        this.rxQueue = [];
        this.txQueue = [];
        this.transferId = 0;
    }

    getNextTransferId() {
        const transferId = this.transferId;
        this.transferId = (this.transferId + 1) % 32; // Transfer ID is a 5-bit value (0-31)
        return transferId;
    }

    addFrame(frame) {
        const transferKey = frame.transferKey;
        if (transferKey in this.activeTransfers || frame.startOfTransfer) {
            // If the first frame was received, restart this transfer from scratch
            if (frame.startOfTransfer) {
                // console.log("Start of transfer received");
                this.activeTransfers[transferKey] = [];
            }

            this.activeTransfers[transferKey].push(frame);
            this.activeTransferTimestamps[transferKey] = performance.now();

            // If the last frame of a transfer was received, return its frames
            if (frame.endOfTransfer) {
                // console.log("End of transfer received");
                let transfer = null;
                // transfer = new Transfer();
                // transfer.fromFrames(this.activeTransfers[transferKey]);
                try {
                    transfer = new Transfer();
                    transfer.fromFrames(this.activeTransfers[transferKey]);
                } catch (error) {
                    // console.error(error);
                }
                delete this.activeTransfers[transferKey];
                delete this.activeTransferTimestamps[transferKey];
                return transfer
            }
        }
        return null;
    }
}

module.exports = TransferManager;