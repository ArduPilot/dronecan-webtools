class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.messageHandlers = [];
        this.openHandlers = [];
        this.errorHandlers = [];
        this.closeHandlers = [];
        this.connected = false; // Add connected property
    }

    connect() {
        // Reset connected status before attempting a new connection
        this.connected = false;
        console.log(`Connecting to WebSocket at ${this.url}`);
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', (event) => {
            this.handleOpen(event);
        });

        this.socket.addEventListener('message', (event) => {
            this.handleMessage(event);
        });

        this.socket.addEventListener('error', (event) => {
            this.handleError(event);
        });

        this.socket.addEventListener('close', (event) => {
            this.handleClose(event);
        });
    }

    // Updated to set connected status
    handleOpen(event) {
        console.log('WebSocket is open now.');
        this.connected = true;
        this.openHandlers.forEach(handler => handler());
    }

    addOpenHandler(handler) {
        this.openHandlers.push(handler);
    }

    handleMessage(event) {
        if (event.data instanceof Blob) {
            this.handleBlobMessage(event);
        } else {
            console.log('Message from server:', event.data);
        }
    }

    handleBlobMessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const buffer = new Uint8Array(arrayBuffer);
            this.messageHandlers.forEach(handler => handler(buffer));
        };
        reader.readAsArrayBuffer(event.data);
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    handleError(event) {
        console.error('WebSocket error observed:', event);
        this.connected = false; // Update connected status on error
        this.errorHandlers.forEach(handler => handler(event));
    }

    addErrorHandler(handler) {
        this.errorHandlers.push(handler);
    }

    // Updated to set connected status
    handleClose(event) {
        console.log('WebSocket is closed now.');
        this.connected = false;
        this.closeHandlers.forEach(handler => handler());
    }

    addCloseHandler(handler) {
        this.closeHandlers.push(handler);
    }

    write(buffer) {
        if (this.isConnected() && this.socket) {
            const binaryData = new Blob([new Uint8Array(buffer)]);
            this.socket.send(binaryData);
            return true;
        } else {
            console.error('WebSocket is not open. Ready state:', this.socket?.readyState);
            return false;
        }
    }

    // Add a method to check if connected
    isConnected() {
        return this.connected && this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}

export default WebSocketClient;