import { uavcan_protocol_file_Error } from './dronecan/dsdl';

const FILE_ERROR = uavcan_protocol_file_Error.CONSTANTS.value;
const READ_CHUNK_SIZE = 256;
const PATH_COUNT = 36 ** 6;

export class FileServer {
    constructor() {
        this.transfers = new Map();
        this.nextPathId = crypto.getRandomValues(new Uint32Array(1))[0] % PATH_COUNT;
    }

    parseIntelHex(hexContent) {
        const lines = hexContent.split(/\r?\n/);
        let minAddress = Infinity;
        let maxAddress = 0;
        let addressMap = {};
        let baseAddress = 0; // For extended address records
        
        for (let line of lines) {
            line = line.trim();
            if (!line || !line.startsWith(':')) continue;
            
            // Parse Intel HEX record
            const byteCount = parseInt(line.substring(1, 3), 16);
            const address = parseInt(line.substring(3, 7), 16);
            const recordType = parseInt(line.substring(7, 9), 16);
            const data = line.substring(9, 9 + (byteCount * 2));
            const checksum = parseInt(line.substring(9 + (byteCount * 2), 9 + (byteCount * 2) + 2), 16);
            
            // Verify checksum
            let sum = byteCount + ((address >> 8) & 0xFF) + (address & 0xFF) + recordType;
            for (let i = 0; i < data.length; i += 2) {
                sum += parseInt(data.substring(i, i + 2), 16);
            }
            sum = (~sum + 1) & 0xFF;
            if (sum !== checksum) {
                throw new Error(`Checksum mismatch in line: ${line}`);
            }
            
            if (recordType === 0x00) { // Data record
                const bytes = [];
                for (let i = 0; i < data.length; i += 2) {
                    bytes.push(parseInt(data.substring(i, i + 2), 16));
                }
                
                // Store data at address (with base address offset)
                for (let i = 0; i < bytes.length; i++) {
                    const addr = baseAddress + address + i;
                    addressMap[addr] = bytes[i];
                    minAddress = Math.min(minAddress, addr);
                    maxAddress = Math.max(maxAddress, addr);
                }
            } else if (recordType === 0x04) { // Extended Linear Address
                // Upper 16 bits of address
                const upperAddress = parseInt(data, 16);
                baseAddress = upperAddress * 0x10000;
            } else if (recordType === 0x02) { // Extended Segment Address
                // Segment address (multiply by 16)
                const segmentAddress = parseInt(data, 16);
                baseAddress = segmentAddress << 4;
            } else if (recordType === 0x01) { // End of file
                break;
            }
        }
        
        if (minAddress === Infinity) {
            throw new Error('No data found in Intel HEX file');
        }
        
        // Convert to contiguous binary array
        const size = maxAddress - minAddress + 1;
        const buffer = new ArrayBuffer(size);
        const view = new Uint8Array(buffer);
        
        // Fill with 0xFF (typical for flash memory)
        view.fill(0xFF);
        
        // Copy data
        for (let addr = minAddress; addr <= maxAddress; addr++) {
            if (addressMap[addr] !== undefined) {
                view[addr - minAddress] = addressMap[addr];
            }
        }
        
        return buffer;
    }

    async loadFile(file) {
        const name = file.name.toLowerCase();
        if (!name.endsWith('.bin') && !name.endsWith('.hex')) {
            throw new Error('Select a .bin or .hex firmware file.');
        }

        const data = name.endsWith('.hex')
            ? this.parseIntelHex(await file.text())
            : await file.arrayBuffer();
        if (data.byteLength === 0) {
            throw new Error('The firmware file is empty.');
        }
        return { name: file.name, data };
    }

    startTransfer(file, localNode, targetNodeId, onProgress) {
        // A six-byte path keeps the File.Read request within two classic CAN frames.
        let path;
        do {
            path = this.nextPathId.toString(36).padStart(6, '0');
            this.nextPathId = (this.nextPathId + 1) % PATH_COUNT;
        } while (this.transfers.has(path));

        this.transfers.set(path, {
            data: new Uint8Array(file.data),
            localNode,
            targetNodeId,
            sessionId: localNode.sessionId,
            onProgress,
            ranges: [],
            eofServed: false
        });
        return path;
    }

    stopTransfer(path) {
        this.transfers.delete(path);
    }

    handleReadRequest(transfer, localNode) {
        const fields = transfer.payload?.fields;
        if (!fields?.path || transfer.destNodeId !== localNode.nodeId ||
            transfer.sessionId !== localNode.sessionId) return;

        try {
            const requestPath = fields.path.msg.fields.path.toString();
            const active = this.transfers.get(requestPath);
            if (!active || active.localNode !== localNode || active.sessionId !== localNode.sessionId ||
                active.targetNodeId !== transfer.sourceNodeId) {
                localNode.responseUavcanProtocolFileRead(transfer, FILE_ERROR.NOT_FOUND, fields.path, []);
                return;
            }

            const rawOffset = fields.offset?.value;
            const offset = Number(rawOffset);
            if (rawOffset == null || !Number.isInteger(offset) || offset < 0 || offset > active.data.length) {
                localNode.responseUavcanProtocolFileRead(transfer, FILE_ERROR.INVALID_VALUE, fields.path, []);
                return;
            }

            const chunk = active.data.subarray(offset, offset + READ_CHUNK_SIZE);
            const response = localNode.responseUavcanProtocolFileRead(transfer, FILE_ERROR.OK, fields.path, chunk);
            if (!response) return;

            if (chunk.length > 0) this.recordRange(active, offset, offset + chunk.length);
            // A full-size final block is followed by a separate empty EOF response.
            active.eofServed ||= chunk.length < READ_CHUNK_SIZE;
            const coveredBytes = active.ranges.reduce((total, [start, end]) => total + end - start, 0);
            const totalBytes = active.data.length;
            active.onProgress({ coveredBytes, totalBytes, complete: active.eofServed && coveredBytes === totalBytes });
        } catch (error) {
            console.error('Error handling firmware file read:', error);
        }
    }

    recordRange({ ranges }, start, end) {
        let first = 0;
        while (first < ranges.length && ranges[first][1] < start) {
            first++;
        }
        let next = first;
        while (next < ranges.length && ranges[next][0] <= end) {
            start = Math.min(start, ranges[next][0]);
            end = Math.max(end, ranges[next][1]);
            next++;
        }
        ranges.splice(first, next - first, [start, end]);
    }
}

export default new FileServer();
