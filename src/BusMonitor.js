import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, Toolbar, AppBar, Button,
    FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, 
    DialogActions
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import { toYaml } from './dronecan/message_format_utils';

const BusMonitor = () => {
    const [transfers, setTransfers] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [messageYaml, setMessageYaml] = useState('');
    const tableContainerRef = useRef(null);
    const maxTransfers = 1000; // Maximum number of transfers to store

    // Handle row click to show details
    const handleRowClick = (transfer) => {
        setSelectedTransfer(transfer);
        
        // Convert the message to YAML format if it has payload
        let yamlText = '';
        if (transfer.data && transfer.data.toObj) {
            const msgObj = transfer.data.toObj();
            yamlText = `### Message details\n`;
            yamlText += `Direction: ${transfer.direction}\n`;
            yamlText += `Time: ${transfer.timestamp}\n`;
            yamlText += `CAN ID: ${transfer.frameId}\n`;
            yamlText += `Source Node: ${transfer.sourceNodeId}\n`;
            yamlText += `Destination Node: ${transfer.destNodeId || 'Broadcast'}\n`;
            yamlText += `Data Type: ${transfer.dataType}\n\n`;
            yamlText += `### Message Payload\n`;
            yamlText += toYaml(msgObj);
        } else {
            yamlText = `No detailed payload data available for this transfer.\n\n`;
            yamlText += `Direction: ${transfer.direction}\n`;
            yamlText += `Time: ${transfer.timestamp}\n`;
            yamlText += `CAN ID: ${transfer.frameId}\n`;
            yamlText += `Hex Data: ${transfer.hexData}\n`;
            yamlText += `Source Node: ${transfer.sourceNodeId}\n`;
            yamlText += `Destination Node: ${transfer.destNodeId || 'Broadcast'}\n`;
        }
        
        setMessageYaml(yamlText);
        setDetailsOpen(true);
    };

    // Close the details dialog
    const handleCloseDetails = () => {
        setDetailsOpen(false);
    };

    useEffect(() => {
        const localNode = window.opener.localNode;
        if (!localNode) return;

        // Function to handle incoming transfers
        const handleTransfer = (transfer, direction) => {
            if (isPaused) return;
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                fractionalSecondDigits: 3
            });

            // Format payload bytes as hex
            let hexData = '';
            if (transfer._payloadBytes && transfer._payloadBytes.length > 0) {
                hexData = Array.from(transfer._payloadBytes)
                    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                    .join(' ');
            }

            setTransfers(prevTransfers => {
                const newTransfers = [...prevTransfers, {
                    timestamp: timeString,
                    timestampMs: now.getTime(),
                    transfer: transfer,
                    dataType: transfer.payload ? transfer.payload.name : 'Unknown',
                    sourceNodeId: transfer.sourceNodeId,
                    destNodeId: transfer.destNodeId,
                    frameId: `0x${transfer.messageId.toString(16).toUpperCase()}`,
                    data: transfer.payload,
                    _payloadBytes: transfer._payloadBytes,
                    hexData: hexData,
                    direction: direction,
                    rawData: transfer.payload ? JSON.stringify(transfer.payload.toObj()) : '{}',
                    id: now.getTime() + Math.random().toString(36).substring(2, 9)
                }];

                // Keep only the last maxTransfers items
                if (newTransfers.length > maxTransfers) {
                    return newTransfers.slice(newTransfers.length - maxTransfers);
                }
                return newTransfers;
            });
        };

        // Subscribe to both TX and RX transfers
        const handleTransferRx = (transfer) => handleTransfer(transfer, 'RX');
        const handleTransferTx = (transfer) => handleTransfer(transfer, 'TX');

        localNode.on('transfer-rx', handleTransferRx);
        localNode.on('transfer-tx', handleTransferTx);

        return () => {
            // Clean up subscriptions
            localNode.off('transfer-rx', handleTransferRx);
            localNode.off('transfer-tx', handleTransferTx);
        };
    }, [isPaused, maxTransfers]);

    useEffect(() => {
        if (autoScroll && tableContainerRef.current && !isPaused) {
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
        }
    }, [transfers, autoScroll, isPaused]);

    const handleClearTransfers = () => {
        setTransfers([]);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const toggleAutoScroll = () => {
        setAutoScroll(!autoScroll);
    };

    const exportToCSV = () => {
        const headers = ['Direction', 'Timestamp', 'CAN ID (Hex)', 'Hex Data', 'Src Node ID', 'Dst Node ID', 'Data Type', 'Raw Data'];
        const csvRows = [
            headers.join(','),
            ...transfers.map(transfer => {
                // Format payload bytes for CSV export
                let hexData = '';
                if (transfer._payloadBytes && transfer._payloadBytes.length > 0) {
                    hexData = Array.from(transfer._payloadBytes)
                        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                        .join(' ');
                }
                
                return [
                    transfer.direction,
                    transfer.timestamp,
                    transfer.frameId,
                    `"${hexData}"`,
                    transfer.sourceNodeId,
                    transfer.destNodeId,
                    transfer.dataType,
                    `"${transfer.rawData.replace(/"/g, '""')}"`
                ].join(',');
            })
        ];
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `bus-monitor-export-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" color="primary">
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Bus Monitor
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={autoScroll} 
                                    onChange={toggleAutoScroll} 
                                    size="small"
                                />
                            }
                            label={<Typography variant="body2">Auto Scroll</Typography>}
                            labelPlacement="start"
                        />
                        <IconButton 
                            color={isPaused ? "default" : "inherit"} 
                            onClick={togglePause}
                            size="small"
                        >
                            {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                        </IconButton>
                        <IconButton 
                            color="inherit" 
                            onClick={handleClearTransfers}
                            size="small"
                        >
                            <ClearIcon />
                        </IconButton>
                        <Button
                            startIcon={<SaveIcon />}
                            onClick={exportToCSV}
                            color="inherit"
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                        >
                            Export
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <TableContainer 
                component={Paper} 
                sx={{ flexGrow: 1, overflow: 'auto' }}
                ref={tableContainerRef}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Dir</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>CAN ID</TableCell>
                            <TableCell>Hex Data</TableCell>
                            <TableCell>Src</TableCell>
                            <TableCell>Dst</TableCell>
                            <TableCell>Data Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transfers.map((item) => (
                            <TableRow 
                                key={item.id}
                                onClick={() => handleRowClick(item)}
                                sx={{
                                    backgroundColor: item.direction === 'TX' ? 'rgba(200, 250, 200, 0.05)' : 'rgba(200, 200, 255, 0.05)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: item.direction === 'TX' ? 'rgba(200, 250, 200, 0.2)' : 'rgba(200, 200, 255, 0.2)',
                                    }
                                }}
                            >
                                <TableCell 
                                    sx={{ 
                                        color: item.direction === 'TX' ? '#2e7d32' : '#1565c0',
                                        fontWeight: 'bold',
                                        width: '40px',
                                        padding: '2px 8px'
                                    }}
                                >
                                    {item.direction}
                                </TableCell>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{item.frameId}</TableCell>
                                <TableCell 
                                    sx={{ 
                                        maxWidth: '200px',
                                        overflowX: 'auto',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {item.hexData}
                                </TableCell>
                                <TableCell>{item.sourceNodeId}</TableCell>
                                <TableCell>{item.destNodeId || ''}</TableCell>
                                <TableCell>{item.dataType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box 
                sx={{ 
                    p: 1, 
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#0b0202',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    Showing {transfers.length} of max {maxTransfers} transfers
                </Typography>
                {isPaused && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#d32f2f',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <PauseIcon fontSize="small" /> PAUSED
                    </Typography>
                )}
            </Box>

            <Dialog
                open={detailsOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Message Details
                    {selectedTransfer && (
                        <Typography variant="subtitle2" color="textSecondary">
                            {selectedTransfer.dataType} - {selectedTransfer.frameId}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    <textarea
                        readOnly
                        value={messageYaml}
                        style={{
                            width: '100%',
                            height: '60vh',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            resize: 'none'
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusMonitor;