import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
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
import { createMonitorBuffer } from './monitor_buffer';

const MAX_TRANSFERS = 1000;
const TIME_FORMAT = new Intl.DateTimeFormat('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
});

const formatHex = (bytes) => bytes
    ? Array.from(bytes, byte => byte.toString(16).padStart(2, '0').toUpperCase()).join(' ')
    : '';

const getPayloadObject = (item) => item.txPayload ?? item.rxPayload?.toObj();

const TransferRow = memo(({ item, onSelect }) => (
    <TableRow
        onClick={() => onSelect(item)}
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
        <TableCell>{TIME_FORMAT.format(item.timestampMs)}</TableCell>
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
            {formatHex(item.payloadBytes)}
        </TableCell>
        <TableCell>{item.sourceNodeId}</TableCell>
        <TableCell>{item.destNodeId || ''}</TableCell>
        <TableCell>{item.dataType}</TableCell>
    </TableRow>
));

const BusMonitor = () => {
    const [transfers, setTransfers] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [messageYaml, setMessageYaml] = useState('');
    const tableContainerRef = useRef(null);
    const nextId = useRef(0);
    const paused = useRef(false);
    const [buffer] = useState(() => createMonitorBuffer(MAX_TRANSFERS, setTransfers));

    // Handle row click to show details
    const handleRowClick = useCallback((transfer) => {
        setSelectedTransfer(transfer);
        
        // Convert the message to YAML format if it has payload
        let yamlText = '';
        const msgObj = getPayloadObject(transfer);
        if (msgObj) {
            yamlText = `### Message details\n`;
            yamlText += `Direction: ${transfer.direction}\n`;
            yamlText += `Time: ${TIME_FORMAT.format(transfer.timestampMs)}\n`;
            yamlText += `CAN ID: ${transfer.frameId}\n`;
            yamlText += `Source Node: ${transfer.sourceNodeId}\n`;
            yamlText += `Destination Node: ${transfer.destNodeId || 'Broadcast'}\n`;
            yamlText += `Data Type: ${transfer.dataType}\n\n`;
            yamlText += `### Message Payload\n`;
            yamlText += toYaml(msgObj);
        } else {
            yamlText = `No detailed payload data available for this transfer.\n\n`;
            yamlText += `Direction: ${transfer.direction}\n`;
            yamlText += `Time: ${TIME_FORMAT.format(transfer.timestampMs)}\n`;
            yamlText += `CAN ID: ${transfer.frameId}\n`;
            yamlText += `Hex Data: ${formatHex(transfer.payloadBytes)}\n`;
            yamlText += `Source Node: ${transfer.sourceNodeId}\n`;
            yamlText += `Destination Node: ${transfer.destNodeId || 'Broadcast'}\n`;
        }
        
        setMessageYaml(yamlText);
        setDetailsOpen(true);
    }, []);

    // Close the details dialog
    const handleCloseDetails = () => {
        setDetailsOpen(false);
    };

    useEffect(() => {
        const localNode = window.opener?.localNode;
        if (!localNode) return;

        const handleTransfer = (transfer, direction) => {
            if (paused.current) return;
            const { payload } = transfer;
            buffer.push({
                id: nextId.current++,
                timestampMs: Date.now(),
                dataType: payload?.name ?? 'Unknown',
                sourceNodeId: transfer.sourceNodeId,
                destNodeId: transfer.destNodeId,
                frameId: `0x${transfer.messageId.toString(16).toUpperCase()}`,
                payloadBytes: transfer._payloadBytes,
                // The local node can reuse and mutate TX messages such as NodeStatus.
                txPayload: direction === 'TX' ? payload?.toObj() : null,
                rxPayload: direction === 'RX' ? payload : null,
                direction
            });
        };

        const handleTransferRx = (transfer) => handleTransfer(transfer, 'RX');
        const handleTransferTx = (transfer) => handleTransfer(transfer, 'TX');
        localNode.on('transfer-rx', handleTransferRx);
        localNode.on('transfer-tx', handleTransferTx);

        return () => {
            localNode.off('transfer-rx', handleTransferRx);
            localNode.off('transfer-tx', handleTransferTx);
            buffer.clear();
        };
    }, [buffer]);

    useEffect(() => {
        if (autoScroll && tableContainerRef.current && !isPaused) {
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
        }
    }, [transfers, autoScroll, isPaused]);

    const handleClearTransfers = () => {
        buffer.clear();
        setTransfers([]);
    };

    const togglePause = () => {
        paused.current = !paused.current;
        if (paused.current) buffer.flush();
        setIsPaused(paused.current);
    };

    const toggleAutoScroll = () => {
        setAutoScroll(!autoScroll);
    };

    const exportToCSV = () => {
        const headers = ['Direction', 'Timestamp', 'CAN ID (Hex)', 'Hex Data', 'Src Node ID', 'Dst Node ID', 'Data Type', 'Raw Data'];
        const csvRows = [
            headers.join(','),
            ...buffer.snapshot().map(transfer => {
                const rawData = JSON.stringify(getPayloadObject(transfer) ?? {},
                    (_, value) => typeof value === 'bigint' ? value.toString() : value);
                return [
                    transfer.direction,
                    TIME_FORMAT.format(transfer.timestampMs),
                    transfer.frameId,
                    `"${formatHex(transfer.payloadBytes)}"`,
                    transfer.sourceNodeId,
                    transfer.destNodeId,
                    transfer.dataType,
                    `"${rawData.replace(/"/g, '""')}"`
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
        setTimeout(() => URL.revokeObjectURL(url), 1000);
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
                            aria-label={isPaused ? 'Resume bus monitor' : 'Pause bus monitor'}
                            onClick={togglePause}
                            size="small"
                        >
                            {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                        </IconButton>
                        <IconButton 
                            color="inherit" 
                            aria-label="Clear bus monitor"
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
                            <TransferRow key={item.id} item={item} onSelect={handleRowClick} />
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
                    Showing {transfers.length} of max {MAX_TRANSFERS} transfers
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
