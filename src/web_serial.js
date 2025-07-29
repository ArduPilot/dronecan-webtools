class WebSerial {
    constructor(port, baudRate) {
        this.port = port;
        this.baudRate = baudRate;
        this.reader = null;
        this.writer = null;
        this.messageHandlers = [];
        this.openHandlers = [];
        this.errorHandlers = [];
        this.closeHandlers = [];
        this.isClosed = false;
        this.readLoopActive = false; // Track if read loop is running
        this.connected = false; // Track if the connection is established
        this.connectionStatusHandlers = []; // Handlers for connection status changes
    }

    // Add getter for connection status
    isConnected() {
        return this.connected;
    }

    // Add method to register connection status change handlers
    addConnectionStatusHandler(handler) {
        this.connectionStatusHandlers.push(handler);
    }

    // Update connection status and notify handlers
    updateConnectionStatus(status) {
        const previousStatus = this.connected;
        this.connected = status;
        
        // Only notify if there was a change
        if (previousStatus !== status) {
            // console.log(`Connection status changed: ${status ? 'Connected' : 'Disconnected'}`);
            this.connectionStatusHandlers.forEach(handler => handler(status));
        }
    }

    static async requestPort() {
        try {
            const port = await navigator.serial.requestPort();
            return port;
        } catch (error) {
            console.error('Error selecting port:', error);
            throw error;
        }
    }

    static async listPorts() {
        const ports = await navigator.serial.getPorts();
        // console.log('Serial ports:', ports);
        return ports;
    }

    async connect() {
        try {
            if (!this.port) {
                console.error('No port available to connect.');
                return;
            }
            // console.log('Port selected:', this.port);
            const baudRate = this.baudRate;

            await this.port.open({ baudRate });
            // console.log('Port opened:', this.port);
            this.handleOpen();
            this.isClosed = false;
            
            if (this.port.writable) {
                this.writer = this.port.writable.getWriter();
            }  

            if (this.port.readable) {
                // Store reader as instance property so we can access it during close
                this.reader = this.port.readable.getReader();
                const messageHandlers = this.messageHandlers;
                
                // Set flag to indicate read loop is active
                this.readLoopActive = true;
                
                // Update connection status
                this.updateConnectionStatus(true);
                
                const readLoop = async () => {
                    try {
                        while (this.readLoopActive && this.reader) {
                            const { value, done } = await this.reader.read();
                            if (done) {
                                break;
                            }
                            
                            messageHandlers.forEach(handler => handler(value));
                        }
                    } catch (error) {
                        if (error.name === 'BreakError') {
                            // console.log('BreakError received - this is expected during certain operations');
                            
                            if (this.readLoopActive && !this.isClosed) {
                                // Release the current reader
                                try {
                                    if (this.reader) {
                                        this.reader.releaseLock();
                                    }
                                } catch (releaseError) {
                                    console.warn('Error releasing reader after BreakError:', releaseError);
                                }
                                
                                // Wait a moment before attempting to restart
                                await new Promise(resolve => setTimeout(resolve, 150));
                                
                                // Only try to restart if we're still supposed to be reading
                                if (this.readLoopActive && !this.isClosed && this.port && this.port.readable) {
                                    // console.log('Restarting read loop after BreakError...');
                                    try {
                                        // Get a new reader
                                        this.reader = this.port.readable.getReader();
                                        // Restart the read loop with the new reader
                                        readLoop(); // Recursively call readLoop to continue reading
                                    } catch (restartError) {
                                        console.error('Failed to restart reader after BreakError:', restartError);
                                        this.handleError(restartError);
                                        
                                        // If we can't restart, mark as disconnected
                                        if (!this.isClosed) {
                                            this.updateConnectionStatus(false);
                                        }
                                    }
                                }
                            }
                        } else {
                            console.error('Error reading from serial port:', error);
                            this.handleError(error);
                            
                            // Update connection status if there's a critical error
                            if (!['BreakError', 'NetworkError'].includes(error.name)) {
                                this.updateConnectionStatus(false);
                            }
                        }
                    }
                };

                readLoop();

            } else {
                console.error('Port is not readable or writable.');
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            this.handleError(error);
            this.updateConnectionStatus(false);
        }
    }

    handleOpen() {
        this.openHandlers.forEach(handler => handler());
    }

    addOpenHandler(handler) {
        this.openHandlers.push(handler);
    }

    handleMessage(data) {
        if (this.messageHandlers && this.messageHandlers.length > 0) {
            this.messageHandlers.forEach(handler => handler(data));
        } else {
            console.error('Message handlers are not initialized or empty.');
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    handleError(error) {
        if (error.name === 'BreakError') {
            // console.error('BreakError: Break received');
        } else {
            console.error('Serial port error observed:', error);
            this.errorHandlers.forEach(handler => handler(error));
        }
    }

    addErrorHandler(handler) {
        this.errorHandlers.push(handler);
    }

    handleClose() {
        if (!this.isClosed) { // Check if the port is already closed
            console.log('Serial port is closed now.');
            this.isClosed = true; // Set the flag to true
            this.updateConnectionStatus(false); // Update connection status
            this.closeHandlers.forEach(handler => handler());
        }
    }

    addCloseHandler(handler) {
        this.closeHandlers.push(handler);
    }

    async write(data) {
        try {
            if (!this.connected) {
                console.error('Cannot write: not connected to serial port');
                return;
            }
            
            if (!(data instanceof ArrayBuffer || ArrayBuffer.isView(data))) {
                // Convert data to ArrayBuffer if it's not already an ArrayBuffer or ArrayBufferView
                if (typeof data === 'string') {
                    data = new TextEncoder().encode(data);
                } else if (data instanceof Blob) {
                    data = await data.arrayBuffer();
                } else if (Array.isArray(data)) {
                    data = new Uint8Array(data);
                } else {
                    throw new TypeError('The provided value is not of type (ArrayBuffer or ArrayBufferView)');
                }
            }
            await this.writer.write(data);
        } catch (error) {
            this.handleError(error);
            
            // Update connection status if write fails
            if (error.message && error.message.includes('locked') === false) {
                this.updateConnectionStatus(false);
            }
        }
    }

    async close() {
        try {
            // First, set the flag to prevent multiple close attempts
            if (this.isClosed) {
                console.log('Port already closed');
                return;
            }
            
            this.isClosed = true;
            
            // Signal read loop to stop
            this.readLoopActive = false;
            
            // Update connection status
            this.updateConnectionStatus(false);
            
            // Cancel and release reader if it exists
            if (this.reader) {
                try {
                    await this.reader.cancel();
                    this.reader.releaseLock();
                    this.reader = null;
                } catch (readerError) {
                    console.warn('Error while closing reader:', readerError);
                    // Even if cancel failed, try to release the lock
                    try {
                        this.reader.releaseLock();
                    } catch (e) {
                        console.warn('Failed to release reader lock:', e);
                    }
                    this.reader = null;
                }
            }
            
            // Close and release writer if it exists
            if (this.writer) {
                try {
                    await this.writer.close();
                    this.writer.releaseLock();
                    this.writer = null;
                } catch (writerError) {
                    console.warn('Error while closing writer:', writerError);
                    // Even if close failed, try to release the lock
                    try {
                        this.writer.releaseLock();
                    } catch (e) {
                        console.warn('Failed to release writer lock:', e);
                    }
                    this.writer = null;
                }
            }
            
            // Wait a bit for locks to be fully released
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Close the port last
            if (this.port) {
                try {
                    console.log('Closing port...');
                    await this.port.close();
                    console.log('Port closed successfully');
                } catch (portError) {
                    console.error('Error while closing port:', portError);
                }
                this.port = null;
            }
            
            this.handleClose();
        } catch (error) {
            console.error('Error in close method:', error);
            this.handleError(error);
        }
    }
}

export default WebSerial;