import React, { memo, useEffect, useRef, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box, Typography, IconButton } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { createMonitorBuffer } from './monitor_buffer';

const MAX_LOGS = 1000;
const LOG_TOPIC = 'uavcan.protocol.debug.LogMessage';
const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
});

const levelColors = {
    DEBUG: 'secondary.main',
    INFO: '',
    WARNING: 'warning.main',
    ERROR: 'error.main'
};

const LogRow = memo(({ log }) => {
    const msg = log.transfer.payload.toObj();
    const level = msg.level.getConstant('value');
    return (
        <TableRow>
            <TableCell>{log.transfer.sourceNodeId}</TableCell>
            <TableCell>{TIME_FORMAT.format(log.timestampMs)}</TableCell>
            <TableCell sx={{ bgcolor: levelColors[level] ?? 'primary.main' }}>{level}</TableCell>
            <TableCell>{String.fromCharCode(...msg.source)}</TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{msg.text}</TableCell>
        </TableRow>
    );
});

const NodeLogs = memo(() => {
    const [logs, setLogs] = useState([]);
    const [paused, setPaused] = useState(false);
    const isPaused = useRef(false);
    const nextId = useRef(0);
    const [buffer] = useState(() => createMonitorBuffer(MAX_LOGS, setLogs));

    useEffect(() => {
        const localNode = window.localNode;
        if (!localNode) return;
        const handleLog = (transfer) => {
            if (isPaused.current) return;
            buffer.push({ id: nextId.current++, timestampMs: Date.now(), transfer });
        };
        localNode.on(LOG_TOPIC, handleLog);
        return () => {
            localNode.off(LOG_TOPIC, handleLog);
            buffer.clear();
        };
    }, [buffer]);

    const togglePause = () => {
        isPaused.current = !isPaused.current;
        if (isPaused.current) buffer.flush();
        setPaused(isPaused.current);
    };

    const handleClear = () => {
        buffer.clear();
        setLogs([]);
    };

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
                        aria-label={paused ? 'Resume logs' : 'Pause logs'}
                        onClick={togglePause}
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
                        aria-label="Clear logs"
                        onClick={handleClear}
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
                        {logs.map(log => <LogRow key={log.id} log={log} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
});

export default NodeLogs;
