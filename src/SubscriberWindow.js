import React, { useState, useEffect } from "react";
import { ThemeProvider, Box, Select, MenuItem, IconButton, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DronecanLogo from './image/dronecan_logo.png';
import { toYaml } from './dronecan/message_format_utils';

import theme from './theme';
import './css/subscriber.css';

const SubscriberWindow = () => {
    const [messages, setMessages] = useState([]);
    const [messageRate, setMessageRate] = useState(0);
    const [totalRX, setTotalRX] = useState(0);
    const [maxMessageCount, setMaxMessageCount] = useState(5);
    const [rxTimestamp, setRxTimestamp] = useState(0);
    const [selectedMessageName, setSelectedMessageName] = useState("");
    const [recordingSet, setRecordingSet] = useState([]);
    const [displayRecordText, setDisplayRecordText] = useState("");
    const [recording, setRecording] = useState(true);

    if (window.opener === null) {
        return "Not Allowed To Open Directly";
    }

    useEffect(() => {
        const localNode = window.opener.localNode;
        const handleMessageUpdate = (transfer) => {
            if (transfer.payload.name === selectedMessageName && recording) {
                setTotalRX(totalRX + 1);
            }

            if (messages.indexOf(transfer.payload.name) === -1) {
                messages.push(transfer.payload.name);
                setMessages(messages);
                setRxTimestamp(Date.now());
            }

            if (recording && transfer.payload.name === selectedMessageName) {
                recordingSet.push(transfer);
                setRecordingSet(recordingSet.slice(-maxMessageCount));
            }
            if (transfer.payload.name === selectedMessageName) {
                setRxTimestamp(Date.now());
            }

            let recordingSetText = ""; 
            let rate = 0;
            let tsDiffs = 0; 
            let lastTransferTs;
            recordingSet.map((transfer, index) => { 
                if (index > 0) {
                    tsDiffs += transfer.tsMonotonic - lastTransferTs
                }
                lastTransferTs = transfer.tsMonotonic;

                if (index > 0 && index === recordingSet.length - 1) {
                    rate = 1 / (tsDiffs / (recordingSet.length - 1)) 
                    setMessageRate(rate);
                }
                const msg = transfer.payload;
                const msgObj = msg.toObj();
                let destNodeText = "All";
                if (transfer.destNodeId && transfer.destNodeId !== 0) {
                    destNodeText = `${transfer.destNodeId}`;
                }
                recordingSetText += `### Message from ${transfer.sourceNodeId} to ${destNodeText} ts_mono=${transfer.tsMonotonic.toFixed(15)}  ts_real=${transfer.tsReal.toFixed(15)} \n`;
                recordingSetText += toYaml(msgObj);
                recordingSetText += "\n";
            })
            setDisplayRecordText(recordingSetText);
        };
        localNode.on('message', handleMessageUpdate);

        return () => {
            localNode.off('message', handleMessageUpdate);
        };
    });

    const updateMaxMessageCount = (event) => {
        if (event.target.value < 1) {
            setMaxMessageCount(1);
        } else if (event.target.value > 100) {
            setMaxMessageCount(100);
        } else {
            setMaxMessageCount(event.target.value);
        }
    };

    const handleSelectChange = (event) => {
        if (event.target.value !== selectedMessageName) {
            handleClean();
        }
        setSelectedMessageName(event.target.value);
    };

    const handleClean = () => {
        setRecordingSet([]);
        setTotalRX(0);
        setMessageRate(0);
    };

    useEffect(() => {
        const availableMessages = messages;
        if (!selectedMessageName && availableMessages.length > 0) {
            setSelectedMessageName(availableMessages[0]);
        }
    }, [rxTimestamp]);

    const availableMessages = messages;
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
                            {availableMessages.map((messageName, index) => (
                                <MenuItem key={index} value={messageName}>{messageName}</MenuItem>
                            ))}
                        </Select>
                        <IconButton ml={5} size="small" onClick={() => setRecording(!recording)}>
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
                        <IconButton size="small" onClick={handleClean}>
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