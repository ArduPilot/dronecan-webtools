import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider, Box, Select, MenuItem, IconButton, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DronecanLogo from './image/dronecan_logo.png';
import { toYaml } from './dronecan/message_format_utils';
import { createMonitorBuffer } from './monitor_buffer';

import theme from './theme';
import './css/subscriber.css';

const DEFAULT_MESSAGE_COUNT = 5;
const EMPTY_CAPTURE = { totalRX: 0, messageRate: 0, displayRecordText: '' };

const formatMessage = (transfer) => {
    const destNodeText = transfer.destNodeId || 'All';
    return `### Message from ${transfer.sourceNodeId} to ${destNodeText} ts_mono=${transfer.tsMonotonic.toFixed(15)}  ts_real=${transfer.tsReal.toFixed(15)} \n`
        + toYaml(transfer.payload.toObj()) + '\n';
};

const SubscriberWindow = () => {
    const [availableMessages, setAvailableMessages] = useState([]);
    const [maxMessageCount, setMaxMessageCount] = useState(DEFAULT_MESSAGE_COUNT);
    const [selectedMessageName, setSelectedMessageName] = useState('');
    const [recording, setRecording] = useState(true);
    const [{ totalRX, messageRate, displayRecordText }, setCapture] = useState(EMPTY_CAPTURE);
    const capture = useRef({ selectedName: '', recording: true, totalRX: 0 });
    const [buffer] = useState(() => createMonitorBuffer(DEFAULT_MESSAGE_COUNT, records => {
        const first = records[0]?.transfer;
        const last = records[records.length - 1]?.transfer;
        const duration = last?.tsMonotonic - first?.tsMonotonic;
        setCapture({
            totalRX: capture.current.totalRX,
            messageRate: duration > 0 ? (records.length - 1) / duration : 0,
            displayRecordText: records.map(record => {
                record.text ??= formatMessage(record.transfer);
                return record.text;
            }).join('')
        });
    }));

    useEffect(() => {
        const localNode = window.opener?.localNode;
        if (!localNode) return;

        const seenMessageNames = new Set();
        const handleMessageUpdate = (transfer) => {
            const name = transfer.payload?.name;
            if (!name) return;

            if (!seenMessageNames.has(name)) {
                seenMessageNames.add(name);
                setAvailableMessages([...seenMessageNames]);
            }

            const current = capture.current;
            if (!current.selectedName) {
                current.selectedName = name;
                setSelectedMessageName(name);
            }
            if (!current.recording || name !== current.selectedName) return;

            current.totalRX++;
            buffer.push({ transfer });
        };

        localNode.on('message', handleMessageUpdate);
        return () => {
            localNode.off('message', handleMessageUpdate);
            buffer.clear();
        };
    }, [buffer]);

    const updateMaxMessageCount = (event) => {
        const count = Math.max(1, Math.min(100, Number.parseInt(event.target.value, 10) || 1));
        setMaxMessageCount(count);
        buffer.resize(count);
    };

    const handleClean = () => {
        buffer.clear();
        capture.current.totalRX = 0;
        setCapture(EMPTY_CAPTURE);
    };

    const handleSelectChange = (event) => {
        const name = event.target.value;
        if (name !== capture.current.selectedName) {
            handleClean();
            capture.current.selectedName = name;
            setSelectedMessageName(name);
        }
    };

    const toggleRecording = () => {
        capture.current.recording = !capture.current.recording;
        if (!capture.current.recording) buffer.flush();
        setRecording(capture.current.recording);
    };

    if (!window.opener) {
        return 'Not Allowed To Open Directly';
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
                    <Box sx={{display: 'flex', flexDirection: 'row', flexGrow: 1}} >
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} ml={0.5} mr={0.5}>
                            <IconButton
                                component="a"
                                href="https://dronecan.github.io/Specification/7._List_of_standard_data_types"
                                target="_blank"
                                rel="noreferrer"
                                size="small"
                                sx={{ 
                                    p: 0.5, 
                                    '&:hover': { 
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                                    } 
                                }}
                            >
                                <img src={DronecanLogo} alt="DroneCAN" style={{height: 30}} />
                            </IconButton>
                        </Box>
                        <Select
                            sx={{ minWidth: 250 }}
                            size="small"
                            value={selectedMessageName}
                            onChange={handleSelectChange}
                        >
                            {availableMessages.map(messageName => (
                                <MenuItem key={messageName} value={messageName}>{messageName}</MenuItem>
                            ))}
                        </Select>
                        <IconButton ml={5} size="small" aria-label={recording ? 'Pause subscriber' : 'Resume subscriber'} onClick={toggleRecording}>
                            {recording ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 0.5}}>
                        <Box sx={{minWidth: 200, display: 'flex', flexDirection: 'row'}}>
                            <Box sx={{flexGrow: 1}}></Box>
                            <Typography variant="caption" mr={0.5}>RX:</Typography>
                            <Typography variant="caption" mr={1} sx={{minWidth: 30}}>{totalRX}</Typography>
                            <Typography variant="caption" mr={0.5}>Rates(Hz):</Typography>
                            <Typography variant="caption" mr={1} sx={{minWidth: 30}}>{messageRate.toFixed(0)}</Typography>
                        </Box>
                        <Typography variant="caption" mr={1}> Max:</Typography>
                        <TextField size="small" sx={{width: 80}} type="number" min={1} max={100} value={maxMessageCount} onChange={updateMaxMessageCount} />
                        <IconButton size="small" aria-label="Clear subscriber" onClick={handleClean}>
                            <CleaningServicesIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, bgcolor: 'background.paper', height: '100%', width: '100%'}}>
                    <textarea className="subscriber-textarea" readOnly value={displayRecordText} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default SubscriberWindow;
