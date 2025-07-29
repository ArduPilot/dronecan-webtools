import React, { useState, useEffect } from 'react';
import { 
    Modal, Box, Typography, Button, Switch, FormControlLabel, TextField,
    Paper, 
    IconButton, Divider, Tooltip, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import DynamicNodeIdServer from './services/DynamicNodeIdServer';

const DNAServerModal = ({ open, onClose, showMessage }) => {
    const [serverEnabled, setServerEnabled] = useState(false);
    const [minNodeId, setMinNodeId] = useState(1);
    const [maxNodeId, setMaxNodeId] = useState(125);
    const [persistAllocations, setPersistAllocations] = useState(true);
    const [allocatedNodes, setAllocatedNodes] = useState([]);
    const [server, setServer] = useState(null);
    const [operationInProgress, setOperationInProgress] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(null);

    const handleAllocationUpdate = () => {
        console.log("Allocation update detected, refreshing list");
        fetchCurrentAllocations();
    };

    useEffect(() => {
        if (!window.dnaServer && window.localNode) {
            window.dnaServer = new DynamicNodeIdServer(window.localNode);
        }
        setServer(window.dnaServer);
        
        // Check if server is already running
        if (window.dnaServer?.getStatus().isActive) {
            setServerEnabled(true);
        }
        
        // Add event listener for allocation updates
        if (window.dnaServer) {
            window.dnaServer.addEventListener('allocationUpdated', handleAllocationUpdate);
        }
        
        return () => {
            // Remove event listener when component unmounts
            if (window.dnaServer) {
                window.dnaServer.removeEventListener('allocationUpdated', handleAllocationUpdate);
            }
        };
    }, []);

    const fetchCurrentAllocations = () => {
        if (!server) return;
        
        const allocations = server.getAllocations();
        setAllocatedNodes(allocations.map(allocation => ({
            nodeId: allocation.nodeId,
            uniqueId: allocation.uniqueId
        })));
    };

    const handleToggleServer = () => {
        if (!server || operationInProgress) return;
        
        setOperationInProgress(true);
        
        try {
            if (!serverEnabled) {
                // Start the server
                const success = server.start(minNodeId, maxNodeId);
                if (success) {
                    setServerEnabled(true);
                    fetchCurrentAllocations(); // Refresh the list
                    
                    // Set up refresh interval when server is active
                    const interval = setInterval(() => {
                        if (server.getStatus().isActive) {
                            fetchCurrentAllocations();
                        }
                    }, 1000); // Check every 5 seconds
                    setRefreshInterval(interval);
                    
                    showMessage("DNA server started successfully", "success");
                } else {
                    showMessage("Failed to start DNA server", "error");
                }
            } else {
                // Stop the server
                server.stop();
                setServerEnabled(false);
                
                // Clear refresh interval when server is stopped
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    setRefreshInterval(null);
                }
                
                showMessage("DNA server stopped", "info");
            }
        } catch (error) {
            console.error("Error toggling DNA server:", error);
            showMessage(`Error: ${error.message}`, "error");
        } finally {
            setOperationInProgress(false);
        }
    };

    const handleMinNodeIdChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 125) {
            setMinNodeId(value);
        }
    };

    const handleMaxNodeIdChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 125) {
            setMaxNodeId(value);
        }
    };

    const validateNodeIdRange = () => {
        return minNodeId >= maxNodeId ? "Min ID must be less than Max ID" : "";
    };

    const handleDeleteAllocation = (nodeId) => {
        if (!server) return;
        
        const success = server.deleteAllocation(nodeId);
        if (success) {
            fetchCurrentAllocations();
            showMessage(`Node ID ${nodeId} allocation revoked`, "info");
        } else {
            showMessage(`Failed to revoke allocation for node ID ${nodeId}`, "error");
        }
    };

    const handleRefreshAllocations = () => {
        fetchCurrentAllocations();
        showMessage("Allocations refreshed", "info");
    };

    // Modify the modal close handler to not stop the server
    const handleClose = () => {
        // Don't stop the server when modal is closed, just pass the status back
        onClose(serverEnabled);
    };

    useEffect(() => {
        if (open && server) {
            fetchCurrentAllocations();
        }
    }, [open, server]);

    // Add a useEffect hook to properly initialize the component when reopened
    useEffect(() => {
        if (open && server) {
            // If opening the modal and server is already available
            // Check if it's running and update the UI accordingly
            const status = server.getStatus();
            setServerEnabled(status.isActive);
            
            // If server is active, refresh the allocation list
            if (status.isActive) {
                fetchCurrentAllocations();
                
                // Set up refresh interval if not already set
                if (!refreshInterval) {
                    const interval = setInterval(() => {
                        if (server.getStatus().isActive) {
                            fetchCurrentAllocations();
                        }
                    }, 1000);
                    setRefreshInterval(interval);
                }
            }
        }
    }, [open, server]);

    // Add cleanup only for component unmount, not modal close
    useEffect(() => {
        return () => {
            // Only clean up on component unmount, not on modal close
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []);

    // Add this helper function just before the return statement in your component
    const formatUniqueId = (uniqueId) => {
        if (!uniqueId) return '';
        
        // Add a space after every 4 characters (16 bits/2 bytes)
        return uniqueId.match(/.{1,2}/g)?.join(' ') || uniqueId;
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"  // Changed from "md" to "sm" for smaller width
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Dynamic Node ID Allocation Server</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        {serverEnabled && (
                            <Chip 
                                label="Server Active"
                                color="success" 
                                size="small" 
                                variant="outlined"
                            />
                        )}
                        <IconButton 
                            aria-label="close" 
                            onClick={handleClose}
                            size="small"
                            sx={{
                                ml: 1,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Server Control Panel */}
                    <Paper sx={{ 
                        p: 1.5,
                        width: '100%',
                        bgcolor: serverEnabled ? 'rgba(0, 200, 83, 0.1)' : 'inherit'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">Server Control</Typography>
                            <Button
                                variant="contained"
                                startIcon={serverEnabled ? <StopIcon /> : <PlayArrowIcon />}
                                onClick={handleToggleServer}
                                color={serverEnabled ? "error" : "success"}
                                disabled={operationInProgress}
                                size="small"
                            >
                                {operationInProgress ? "Processing..." :
                                 serverEnabled ? "Stop" : "Start"}
                            </Button>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            {/* Min Node ID */}
                            <Box sx={{ width: { xs: '100%', sm: '22%' }, minWidth: '100px' }}>
                                <TextField
                                    label="Min Node ID"
                                    type="number"
                                    value={minNodeId}
                                    onChange={handleMinNodeIdChange}
                                    fullWidth
                                    disabled={serverEnabled}
                                    InputProps={{
                                        inputProps: { min: 1, max: 125 }
                                    }}
                                    size="small"
                                    error={minNodeId >= maxNodeId}
                                    helperText={minNodeId >= maxNodeId ? "Must be < Max" : ""}
                                />
                            </Box>
                            
                            {/* Max Node ID */}
                            <Box sx={{ width: { xs: '100%', sm: '22%' }, minWidth: '100px' }}>
                                <TextField
                                    label="Max Node ID"
                                    type="number"
                                    value={maxNodeId}
                                    onChange={handleMaxNodeIdChange}
                                    fullWidth
                                    disabled={serverEnabled}
                                    InputProps={{
                                        inputProps: { min: 1, max: 125 }
                                    }}
                                    size="small"
                                    error={minNodeId >= maxNodeId}
                                    helperText={minNodeId >= maxNodeId ? "Must be > Min" : ""}
                                />
                            </Box>
                            
                            {/* Persist Allocations */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: { xs: '100%', sm: 'auto' },
                                flexGrow: 1
                            }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={persistAllocations}
                                            onChange={(e) => setPersistAllocations(e.target.checked)}
                                            color="primary"
                                            disabled={serverEnabled}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ mr: 0.5 }}>Persist Allocations</Typography>
                                            <Tooltip title="When enabled, node ID allocations are stored and restored when the server restarts">
                                                <HelpOutlineIcon fontSize="small" />
                                            </Tooltip>
                                        </Box>
                                    }
                                />
                            </Box>
                        </Box>
                    </Paper>

                    {/* Allocated Nodes Section - without the title now */}
                    <Paper sx={{ p: 1.5, width: '100%' }}>  {/* Removed mt: -1 as it's not needed anymore */}
                        {/* Add the title back inside the Paper */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Typography 
                                variant="body1"  // Using body1 for smaller font size instead of subtitle1 
                                sx={{ fontWeight: 500 }}  // Adding some weight to make it still look like a title
                            >
                                Allocated Node IDs ({allocatedNodes.length})
                            </Typography>
                            <Tooltip title="Refresh allocation list">
                                <IconButton 
                                    onClick={handleRefreshAllocations}
                                    size="small"
                                    color="primary"
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Rest of the Paper content remains the same */}
                        {allocatedNodes.length === 0 ? (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No node IDs allocated
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer sx={{ 
                                maxHeight: '120px', 
                                overflow: 'auto',
                                position: 'relative',
                                '& .MuiTableHead-root': {
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                    backgroundColor: theme => theme.palette.background.paper
                                }
                            }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>NID</TableCell>
                                            <TableCell>UUID</TableCell>
                                            <TableCell align="right" width="60px">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allocatedNodes.map((node) => (
                                            <TableRow key={node.nodeId} hover>
                                                <TableCell component="th" scope="row">
                                                    {node.nodeId}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            fontFamily: 'monospace',
                                                            wordBreak: 'break-all'
                                                        }}
                                                    >
                                                        {formatUniqueId(node.uniqueId)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" padding="none" sx={{ pr: 1 }}>
                                                    <IconButton 
                                                        onClick={() => handleDeleteAllocation(node.nodeId)} 
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DNAServerModal;