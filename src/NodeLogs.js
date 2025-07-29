import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, Typography, IconButton } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const NodeLogs = () => {
    const [logs, setLogs] = useState([]);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const localNode = window.localNode;
        const handleLog = (transfer) => {
            if (paused) {
                return;
            }
            // console.log(transfer);
            const msg = transfer.payload;
            const msgObj = msg.toObj();
            setLogs((logs) => [...logs, {
                id: transfer.sourceNodeId,
                localTime: new Date().toLocaleTimeString(),
                level: msgObj.level.getConstant('value'),
                source: '',
                text: msgObj.text 
            }]);
        };
        localNode.on('uavcan.protocol.debug.LogMessage', handleLog);
        return () => {
            localNode.off('uavcan.protocol.debug.LogMessage', handleLog);
        };
    });

    const getLevelColor = (level) => {
        switch (level) {
            case 'DEBUG':
                return 'secondary.main';
            case 'INFO':
                return '';
            case 'WARNING':
                return 'warning.main';
            case 'ERROR':
                return 'error.main';
            default:
                return 'primary.main';
        }
    }

    return (
        <Box
            component={Paper}
            sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, height: '50%'}}
        >
            <Box sx={{
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center', 
                height: 20
            }} margin={1}>
                <Typography variant="caption" flexGrow={1}>Logs</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                        sx={{ 
                            width: 20, 
                            height: 20,
                            padding: 0
                        }}
                        size='small'
                        onClick={() => setPaused(!paused)}
                    >
                        {paused ? <PlayArrowIcon sx={{ fontSize: 16 }} /> : <PauseIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                    <IconButton
                        sx={{ 
                            width: 20, 
                            height: 20,
                            padding: 0
                        }}
                        size='small'
                        color="warning"
                        onClick={() => setLogs([])}
                    >
                        <CleaningServicesIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </Box>
            <TableContainer
                sx={{ overflow: 'auto' }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '5%' }}>NID</TableCell>
                            <TableCell sx={{ width: '15%' }}>Time</TableCell>
                            <TableCell sx={{ width: '10%' }}>Level</TableCell>
                            <TableCell sx={{ width: '10%' }}>Source</TableCell>
                            <TableCell sx={{ width: '60%' }}>Text</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.id}</TableCell>
                                <TableCell>{log.localTime}</TableCell>
                                <TableCell sx={{bgcolor: getLevelColor(log.level)}}>
                                    {log.level}
                                </TableCell>
                                <TableCell>{log.source}</TableCell>
                                <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                    {log.text}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default NodeLogs;