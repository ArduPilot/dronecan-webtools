import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const ConnectionIndicators = ({ isConnected, mavlinkSession, localNode }) => {
    const [txActive, setTxActive] = useState(false);
    const [rxActive, setRxActive] = useState(false);
    const txTimeout = useRef(null);
    const rxTimeout = useRef(null);
    
    useEffect(() => {
        const handleFrameSend = () => {
            setTxActive(true);
            clearTimeout(txTimeout.current);
            txTimeout.current = setTimeout(() => {
                setTxActive(false);
            }, 100); // Blink for 200ms
        };
        
        const handleFrameReceive = () => {
            setRxActive(true);
            clearTimeout(rxTimeout.current);
            rxTimeout.current = setTimeout(() => {
                setRxActive(false);
            }, 100); // Blink for 200ms
        };
        
        if (mavlinkSession) {
            mavlinkSession.on('mav-tx', handleFrameSend);
            mavlinkSession.on('mav-rx', handleFrameReceive);
        }
        
        return () => {
            if (mavlinkSession) {
                mavlinkSession.removeListener('mav-tx', handleFrameSend);
                mavlinkSession.removeListener('mav-rx', handleFrameReceive);
            }
            clearTimeout(txTimeout.current);
            clearTimeout(rxTimeout.current);
        };
    }, [localNode, mavlinkSession]);
    
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', opacity: isConnected ? 1 : 0.3 }}>
                <CircleIcon 
                    fontSize="small" 
                    sx={{ 
                        color: txActive && isConnected ? '#4caf50' : '#7e7e7e',
                        width: '12px',
                        height: '12px',
                        transition: 'color 0.1s ease'
                    }}
                />
                <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>TX</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', opacity: isConnected ? 1 : 0.3 }}>
                <CircleIcon 
                    fontSize="small"
                    sx={{ 
                        color: rxActive && isConnected ? '#2196f3' : '#7e7e7e',
                        width: '12px',
                        height: '12px',
                        transition: 'color 0.1s ease'
                    }}
                />
                <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>RX</Typography>
            </Box>
        </Box>
    );
};

export default ConnectionIndicators;