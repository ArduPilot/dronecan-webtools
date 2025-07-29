/**
 * DynamicNodeIdServer - A JavaScript implementation of the UAVCAN/DroneCAN dynamic node ID allocation server
 */
class DynamicNodeIdServer {
    // Constants
    static QUERY_TIMEOUT_MS = 1000; // Timeout for query follow-ups
    static DEFAULT_NODE_ID_RANGE = [1, 125];
    static STORAGE_KEY = 'dna_server_allocations';
    
    constructor(localNode, options = {}) {
        this.localNode = localNode;
        this.nodeIdRange = options.nodeIdRange || DynamicNodeIdServer.DEFAULT_NODE_ID_RANGE;
        this.persistAllocations = options.persistAllocations !== false;
        
        // Server state
        this.isActive = false;
        this.currentQuery = null; // Current in-progress allocation query
        this.lastQueryTimestamp = 0;
        
        // Load saved allocations if persistence is enabled
        this.allocationTable = {};
        if (this.persistAllocations) {
            this.loadAllocations();
        }
        
        // Bound methods to use as event handlers
        this.handleAllocationMessage = this.handleAllocationMessage.bind(this);

        // Add event handling support
        this.eventListeners = {
            'allocationUpdated': []
        };
    }
    
    /**
     * Start the allocation server
     */
    start(minNodeId, maxNodeId) {
        if (this.isActive) {
            console.warn('[DynamicNodeIdServer] Server already active');
            return;
        }
        
        if (typeof minNodeId === 'number' && typeof maxNodeId === 'number') {
            if (minNodeId >= 1 && maxNodeId <= 125 && minNodeId < maxNodeId) {
                this.nodeIdRange = [minNodeId, maxNodeId];
                console.log(`[DynamicNodeIdServer] Using node ID range: [${minNodeId}, ${maxNodeId}]`);
            } else {
                console.warn('[DynamicNodeIdServer] Invalid node ID range, using defaults');
            }
        }
        
        // Reset state
        this.currentQuery = null;
        this.lastQueryTimestamp = 0;
        
        // Register event handlers
        if (this.localNode) {
            this.localNode.on('uavcan.protocol.dynamic_node_id.Allocation', this.handleAllocationMessage);
            
            // Register our own node ID in the allocation table
            if (this.localNode.nodeInfo && this.localNode.nodeInfo.hardwareVersion) {
                const uniqueId = this.localNode.nodeInfo.hardwareVersion.uniqueId;
                if (uniqueId && this.localNode.nodeId) {
                    this.allocationTable[this.arrayToHexString(uniqueId)] = {
                        nodeId: this.localNode.nodeId,
                        lastSeen: new Date().toISOString()
                    };
                    this.saveAllocations();
                }
            }
            
            this.isActive = true;
            console.log('[DynamicNodeIdServer] Started');
            return true;
        } else {
            console.error('[DynamicNodeIdServer] Cannot start server - no local node available');
            return false;
        }
    }
    
    /**
     * Stop the allocation server
     */
    stop() {
        if (!this.isActive) {
            return;
        }
        
        if (this.localNode) {
            this.localNode.off('uavcan.protocol.dynamic_node_id.Allocation', this.handleAllocationMessage);
        }
        
        this.isActive = false;
        console.log('[DynamicNodeIdServer] Stopped');
    }
    
    /**
     * Handle incoming allocation messages
     */
    handleAllocationMessage(transfer) {
        if (!this.isActive) return;
        
        // Centralized allocator cannot co-exist with other allocators
        if (transfer.sourceNodeId !== 0) {
            console.warn('[DynamicNodeIdServer] Message from another allocator ignored:', transfer);
            return;
        }
        
        const now = Date.now();
        const msg = transfer.payload;
        const msgObj = msg.toObj ? msg.toObj() : msg;
        
        // Reset query if timeout expired
        if (this.currentQuery && (now - this.lastQueryTimestamp > DynamicNodeIdServer.QUERY_TIMEOUT_MS)) {
            console.log('[DynamicNodeIdServer] Query timeout, resetting');
            this.currentQuery = null;
        }
        
        // First stage of allocation protocol
        if (msgObj.first_part_of_unique_id === 1) {
            this.handleFirstStageRequest(msgObj, transfer);
        } 
        // Second stage (we check unique_id length)
        else if (msgObj.unique_id && msgObj.unique_id.length === 6 && this.currentQuery && this.currentQuery.length === 6) {
            this.handleSecondStageRequest(msgObj, transfer);
        } 
        // Third stage
        else if (msgObj.unique_id && msgObj.unique_id.length === 4 && this.currentQuery && this.currentQuery.length === 12) {
            this.handleThirdStageRequest(msgObj, transfer);
        } else {
            console.warn('[DynamicNodeIdServer] Received invalid allocation message stage');
        }
    }
    
    /**
     * Handle first stage request (first 6 bytes of unique ID)
     */
    handleFirstStageRequest(msgObj, transfer) {
        // Store the first part of the unique ID
        this.currentQuery = Array.from(msgObj.unique_id);
        this.lastQueryTimestamp = Date.now();
        
        console.log(`[DynamicNodeIdServer] Got first-stage request: ${this.arrayToHexString(this.currentQuery)}`);
        
        // Send response to request second part
        this.sendAllocationResponse(this.currentQuery, 0);
    }
    
    /**
     * Handle second stage request (middle 6 bytes of unique ID)
     */
    handleSecondStageRequest(msgObj, transfer) {
        // Append second part to the unique ID
        this.currentQuery = this.currentQuery.concat(Array.from(msgObj.unique_id));
        this.lastQueryTimestamp = Date.now();
        
        console.log(`[DynamicNodeIdServer] Got second-stage request: ${this.arrayToHexString(this.currentQuery)}`);
        
        // Send response to request third part
        this.sendAllocationResponse(this.currentQuery, 0);
    }
    
    /**
     * Handle third stage request (last 4 bytes of unique ID plus optional requested ID)
     */
    handleThirdStageRequest(msgObj, transfer) {
        // Complete the unique ID
        this.currentQuery = this.currentQuery.concat(Array.from(msgObj.unique_id));
        this.lastQueryTimestamp = Date.now();
        
        const uniqueIdStr = this.arrayToHexString(this.currentQuery);
        console.log(`[DynamicNodeIdServer] Got third-stage request: ${uniqueIdStr}`);
        
        // Check if this unique ID already has an allocation
        let allocatedNodeId = this.getAllocatedNodeId(uniqueIdStr);
        const nodeRequestedId = msgObj.node_id || 0;
        
        // If an ID was requested but not allocated yet, try to allocate that or higher
        if (nodeRequestedId > 0 && !allocatedNodeId) {
            for (let nodeId = nodeRequestedId; nodeId <= this.nodeIdRange[1]; nodeId++) {
                if (!this.isNodeIdTaken(nodeId)) {
                    allocatedNodeId = nodeId;
                    break;
                }
            }
        }
        
        // If no ID was allocated above, allocate the highest available ID
        if (!allocatedNodeId) {
            for (let nodeId = this.nodeIdRange[1]; nodeId >= this.nodeIdRange[0]; nodeId--) {
                if (!this.isNodeIdTaken(nodeId)) {
                    allocatedNodeId = nodeId;
                    break;
                }
            }
        }
        
        if (allocatedNodeId) {
            // Save the allocation (simplified without name and lastSeen)
            this.allocationTable[uniqueIdStr] = {
                nodeId: allocatedNodeId
            };
            
            if (this.persistAllocations) {
                this.saveAllocations();
            }
            
            console.log(`[DynamicNodeIdServer] Allocated node ID ${allocatedNodeId} to node with unique ID ${uniqueIdStr}`);
            
            // Send the allocation response
            this.sendAllocationResponse(this.currentQuery, allocatedNodeId);
            
            // Notify listeners about the allocation
            this.triggerEvent('allocationUpdated', {
                uniqueId: uniqueIdStr,
                nodeId: allocatedNodeId
            });
            
            // Reset query state
            this.currentQuery = null;
        } else {
            console.error('[DynamicNodeIdServer] Could not allocate a node ID - all IDs taken!');
        }
    }
    
    /**
     * Send allocation response message
     */
    sendAllocationResponse(uniqueId, nodeId) {
        if (!this.localNode) return;
        
        try {
            this.localNode.sendUavcanProtocolDynamicNodeIdAllocation(0, nodeId, uniqueId);
        } catch (error) {
            console.error('[DynamicNodeIdServer] Error sending allocation response:', error);
        }
    }
    
    /**
     * Check if a node ID is already allocated
     */
    isNodeIdTaken(nodeId) {
        for (const uniqueId in this.allocationTable) {
            if (this.allocationTable[uniqueId].nodeId === nodeId) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get the allocated node ID for a unique ID
     */
    getAllocatedNodeId(uniqueIdStr) {
        return this.allocationTable[uniqueIdStr]?.nodeId || null;
    }
    
    /**
     * Get all current allocations
     */
    getAllocations() {
        const allocations = [];
        for (const uniqueId in this.allocationTable) {
            allocations.push({
                uniqueId: uniqueId,
                nodeId: this.allocationTable[uniqueId].nodeId
            });
        }
        return allocations;
    }
    
    /**
     * Delete an allocation
     */
    deleteAllocation(nodeId) {
        let deletedKey = null;
        for (const uniqueId in this.allocationTable) {
            if (this.allocationTable[uniqueId].nodeId === nodeId) {
                deletedKey = uniqueId;
                break;
            }
        }
        
        if (deletedKey) {
            delete this.allocationTable[deletedKey];
            if (this.persistAllocations) {
                this.saveAllocations();
            }
            return true;
        }
        
        return false;
    }
    
    /**
     * Update node name
     */
    updateNodeName(nodeId, name) {
        for (const uniqueId in this.allocationTable) {
            if (this.allocationTable[uniqueId].nodeId === nodeId) {
                this.allocationTable[uniqueId].name = name;
                if (this.persistAllocations) {
                    this.saveAllocations();
                }
                return true;
            }
        }
        return false;
    }
    
    /**
     * Update last seen timestamp
     */
    updateLastSeen(nodeId) {
        for (const uniqueId in this.allocationTable) {
            if (this.allocationTable[uniqueId].nodeId === nodeId) {
                this.allocationTable[uniqueId].lastSeen = new Date().toISOString();
                if (this.persistAllocations) {
                    this.saveAllocations();
                }
                return true;
            }
        }
        return false;
    }
    
    /**
     * Save allocations to localStorage
     */
    saveAllocations() {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(DynamicNodeIdServer.STORAGE_KEY, JSON.stringify(this.allocationTable));
            } catch (error) {
                console.error('[DynamicNodeIdServer] Error saving allocations to localStorage:', error);
            }
        }
    }
    
    /**
     * Load allocations from localStorage
     */
    loadAllocations() {
        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem(DynamicNodeIdServer.STORAGE_KEY);
                if (saved) {
                    this.allocationTable = JSON.parse(saved);
                    console.log(`[DynamicNodeIdServer] Loaded ${Object.keys(this.allocationTable).length} allocations from storage`);
                }
            } catch (error) {
                console.error('[DynamicNodeIdServer] Error loading allocations from localStorage:', error);
            }
        }
    }
    
    /**
     * Convert byte array to hex string representation
     */
    arrayToHexString(arr) {
        if (!arr) return '';
        return Array.from(arr).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * Get server status information
     */
    getStatus() {
        return {
            isActive: this.isActive,
            nodeIdRange: this.nodeIdRange,
            persistAllocations: this.persistAllocations,
            allocationCount: Object.keys(this.allocationTable).length,
            hasActiveQuery: this.currentQuery !== null
        };
    }

    // Add event listener methods
    addEventListener(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].push(callback);
            return true;
        }
        return false;
    }

    removeEventListener(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
            return true;
        }
        return false;
    }

    // Method to trigger events
    triggerEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in ${event} event handler:`, e);
                }
            });
        }
    }

    /**
     * Get pending allocation requests
     */
    getPendingRequests() {
        // In a real implementation, this would track requests that haven't been allocated yet
        const pendingRequests = [];
        
        if (this.currentQuery) {
            const now = Date.now();
            
            // Only include if within timeout window
            if (now - this.lastQueryTimestamp < DynamicNodeIdServer.QUERY_TIMEOUT_MS) {
                pendingRequests.push({
                    uniqueId: this.arrayToHexString(this.currentQuery)
                });
            }
        }
        
        return pendingRequests;
    }
}

export default DynamicNodeIdServer;