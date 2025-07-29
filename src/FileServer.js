import { off } from 'process';
import dronecan from './dronecan';
/**
 * DroneCAN FileServer class for handling firmware and file transfers
 */
class FileServer {
    constructor() {
        this.files = {};  // Map to store loaded files by path
        this.chunks = {}; // Map to store chunked file data
        this.reader = new FileReader();
        this.maxChunkSize = 256; // Maximum UAVCAN file chunk size
        
        // Add tracking for current transfers
        this.activeTransfers = {}; // Map of active transfers by path
        this.progressCallbacks = {}; // Map of progress callbacks by path
    }

    /**
     * Generate a key used in file read requests for a path
     * This is kept to 7 bytes to keep the read request in 2 frames
     * @param {string} path - The file path
     * @returns {string} - A 7-character key representing the path
     */
    pathKey(path) {
        // Create a CRC32 hash of the path converted to UTF-8
        const pathBuffer = new TextEncoder().encode(path);
        
        // Calculate CRC32
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < pathBuffer.length; i++) {
            crc ^= pathBuffer[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
            }
        }
        crc = (~crc >>> 0); // Convert to unsigned 32-bit integer
        
        // Pack as 4 bytes (equivalent to Python struct.pack("<I", crc))
        const crcBuffer = new ArrayBuffer(4);
        const dataView = new DataView(crcBuffer);
        dataView.setUint32(0, crc, true); // true means little-endian
        
        // Convert to Base64
        const base64String = btoa(
            String.fromCharCode.apply(null, new Uint8Array(crcBuffer))
        );
        
        // Take first 7 characters and replace path separators
        let result = base64String.slice(0, 7);
        result = result.replace(/\//g, '_').replace(/\\/g, '_');
        
        return result;
    }

    /**
     * Load a file into the file server
     * @param {File} file - The file object to load
     * @param {string} path - The virtual path to register the file under
     * @return {Promise} - Resolves when file is loaded
     */
    loadFile(file, path = null) {
        return new Promise((resolve, reject) => {
            // Use the file name as the path if no path is provided
            const filePath = path || file.name;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target.result;
                this.files[filePath] = {
                    name: file.name,
                    size: buffer.byteLength,
                    data: buffer,
                    path: filePath,
                    key: this.pathKey(filePath)
                };
                
                console.log(`File loaded: ${filePath}, size: ${buffer.byteLength} bytes`);
                resolve(this.files[filePath]);
            };
            reader.onerror = (error) => {
                console.error('Error loading file:', error);
                reject(error);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Get a chunk of file data at a specific offset
     * @param {string} path - The file path
     * @param {number} offset - The offset into the file
     * @param {number} maxSize - Maximum size of chunk to return
     * @returns {Object} - { data: Uint8Array, eof: boolean }
     */
    getFileChunk(path, offset, maxSize = this.maxChunkSize) {
        const fileInfo = this.files[path];
        if (!fileInfo) {
            console.warn(`File not found: ${path}`);
            return { data: new Uint8Array(0), eof: true };
        }
        
        const dataView = new DataView(fileInfo.data);
        const fileSize = fileInfo.size;
        
        // Check if we're at or past the end of file
        if (offset >= fileSize) {
            return { data: new Uint8Array(0), eof: true };
        }
        
        // Calculate chunk size (might be less than maxSize if near EOF)
        const chunkSize = Math.min(maxSize, fileSize - offset);
        const chunk = new Uint8Array(chunkSize);
        
        // Copy data from the file buffer to our chunk
        for (let i = 0; i < chunkSize; i++) {
            chunk[i] = dataView.getUint8(offset + i);
        }
        
        // Return the chunk and EOF status
        return { 
            data: chunk, 
            eof: (offset + chunkSize >= fileSize)
        };
    }

    /**
     * Register a progress callback for a specific file path
     * @param {string} path - File path to track
     * @param {function} callback - Callback function(progress, offset, total)
     */
    registerProgressCallback(path, callback) {
        this.progressCallbacks[path] = callback;
    }

    /**
     * Unregister a progress callback for a path
     * @param {string} path - File path to stop tracking
     */
    unregisterProgressCallback(path) {
        delete this.progressCallbacks[path];
    }

    /**
     * Update progress tracking for a file
     * @param {string} path - File path
     * @param {number} offset - Current offset
     * @param {boolean} eof - Whether end of file was reached
     */
    updateTransferProgress(path, offset, eof) {
        const fileInfo = this.files[path];
        if (!fileInfo) return;

        // Store in active transfers
        this.activeTransfers[path] = {
            offset,
            total: fileInfo.size,
            percentage: fileInfo.size > 0 ? (offset / fileInfo.size) * 100 : 0,
            eof: eof,
            lastUpdated: Date.now()
        };

        // Call progress callback if registered
        if (this.progressCallbacks[path]) {
            const progress = fileInfo.size > 0 ? (offset / fileInfo.size) : 0;
            this.progressCallbacks[path](progress, offset, fileInfo.size, eof);
        }
        
        // If EOF, clean up after a short delay
        if (eof) {
            setTimeout(() => {
                delete this.activeTransfers[path];
            }, 5000);
        }
    }

    /**
     * Get current transfer progress for a path
     * @param {string} path - File path to check
     * @returns {Object|null} - Progress object or null if not active
     */
    getTransferProgress(path) {
        return this.activeTransfers[path] || null;
    }

    /**
     * Handle a File.Read request from DroneCAN
     * @param {Object} transfer - The DroneCAN transfer object
     * @param {Object} localNode - The DroneCAN local node
     */
    handleReadRequest(transfer, localNode) {
        if (!transfer || !transfer.payload) {
            console.error('Invalid file read request, missing transfer or payload');
            return;
        }

        try {
            if (transfer.destNodeId !== localNode.nodeId) {
                console.error('File read request not for this node');
                return;
            }
            const request = transfer.payload;
            // Extract path with fallbacks
            let filePath = '';
            
            if (request.fields && request.fields.path) {
                // console.log('Path field:', request.fields.path);
                
                if (request.fields.path.msg && request.fields.path.msg.fields && request.fields.path.msg.fields.path) {
                    filePath = request.fields.path.msg.fields.path.toString();
                } else if (typeof request.fields.path.toString === 'function') {
                    filePath = request.fields.path.toString();
                } else if (request.fields.path.value) {
                    filePath = request.fields.path.value.toString();
                } else {
                    filePath = String(request.fields.path);
                }
            }
            
            if (!filePath && request.path) {
                filePath = request.path.toString();
            }
            
            // console.log(`Requested file path: ${filePath}`);
            
            // Extract offset
            let offset = 0;
            if (request.fields && request.fields.offset) {
                if (typeof request.fields.offset.value !== 'undefined') {
                    offset = request.fields.offset.value;
                }
            }
            
            // Check if file exists after possible path remapping
            if (!this.files[filePath]) {
                return;
            }
            
            // Get the requested chunk
            const { data, eof } = this.getFileChunk(filePath, offset);
            
            // Update progress tracking
            this.updateTransferProgress(filePath, offset, eof);
            
            let error = 0; //#OK
            localNode.responseUavcanProtocolFileRead(transfer, error, request.fields.path, data);
            // console.log(`File chunk sent: ${filePath}, offset: ${offset}, size: ${data.length}, eof: ${eof}`);
        } catch (error) {
            console.error('Error handling file read request:', error);
        }
    }
}

// Export as a global object and as a module
window.FileServer = new FileServer();
export default window.FileServer;