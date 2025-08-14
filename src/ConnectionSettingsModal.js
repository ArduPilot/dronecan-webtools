import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, 
    Button, FormControl, InputLabel, Select, MenuItem,
    Typography, Box, Divider, Chip,
    TextField, Paper, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import UsbIcon from '@mui/icons-material/Usb';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WebSerial from './web_serial';

// Add this constant at the top of your file, outside the component
const USB_DEVICE_NAMES = {
    // Ardupilot/PX4/Flight Controllers
    '1209:5738': 'MAVCAN USB',
    '1209:5740': 'ArduPilot',
    '1209:5741': 'ArduPilot',
    '0483:5740': 'STM32 Virtual COMPort',
    
    // FTDI Adapters
    '0403:6001': 'FTDI FT232R USB-Serial',
    '0403:6010': 'FTDI FT2232 Dual USB-Serial',
    '0403:6011': 'FTDI FT4232 Quad USB-Serial',
    '0403:6014': 'FTDI FT232H Single USB-Serial',
    
    // Silicon Labs Chips
    '10c4:ea60': 'Silicon Labs CP210x USB-Serial',
    '10c4:ea63': 'Silicon Labs CP2103 USB-Serial',
    
    // CH340 Chips
    '1a86:7523': 'CH340 USB-Serial',
    '1a86:5523': 'CH341 USB-Serial',
};

// Add these constants at the top of your file
const BAUD_RATES = [
    9600,
    19200,
    38400,
    57600,
    74880,
    115200,
    230400,
    460800,
    500000,
    921600,
    1000000,
    1500000,
    2000000
];

const DEFAULT_BAUD_RATE = 115200;

// Add default WebSocket settings
const DEFAULT_WS_HOST = '127.0.0.1';
const DEFAULT_WS_PORT = '5555';

// Connection types enum
const CONNECTION_TYPES = {
    SERIAL: 'serial',
    WEBSOCKET: 'websocket'
};

// Add this constant inside the ConnectionSettingsModal.js file, outside the component
const INTERFACE_BUS_LIST = [0, 1]; //BUS 1, BUS 2 

// Update the state management for connection tracking
const ConnectionSettingsModal = ({ 
    open, 
    onClose,
    onConnectionStatusChange,
    showMessage, // Use this prop for error messages
    selectedBus,  // New prop
    onBusChange   // New prop
}) => {
    // State for showing/hiding mavlink signing
    const [showMavlinkSigning, setShowMavlinkSigning] = useState(false);
    const handleToggleMavlinkSigning = () => {
        setShowMavlinkSigning((show) => !show);
    };
    // Port and connection management
    const [ports, setPorts] = useState([]);
    const [selectedPort, setSelectedPort] = useState(null);
    const [baudRate, setBaudRate] = useState(DEFAULT_BAUD_RATE);
    const [wsHost, setWsHost] = useState(DEFAULT_WS_HOST);
    const [wsPort, setWsPort] = useState(DEFAULT_WS_PORT);
    
    // Move bus state management into this component
    // const [selectedBus, setSelectedBus] = useState(0);
    
    // Track active connection
    const [activeConnection, setActiveConnection] = useState(null); // null, 'serial', or 'websocket'

    // Add these state variables after your other state declarations
    const [hostError, setHostError] = useState('');
    const [portError, setPortError] = useState('');

    // Add nodeId state to use the prop value
    const [nodeId, setNodeId] = useState(127);
    // Add mavlink signing state
    const [mavlinkSigning, setMavlinkSigning] = useState('');

    // Add state for the forwarding interval
    const [forwardingInterval, setForwardingInterval] = useState(null);

    // Add this state variable to track connection attempts in progress
    const [connectionInProgress, setConnectionInProgress] = useState(false);

    // Create a function to identify and index duplicate devices
    const getPortDisplayName = (port, allPorts) => {
        if (!port) return "No port selected";
        
        // Try to extract the most user-friendly name possible
        if (port.info && port.info.product) {
            return port.info.product;
        }
        
        if (port.info && port.info.manufacturer) {
            return `${port.info.manufacturer} device`;
        }
        
        if (port.info && port.info.serialNumber) {
            return `Device (S/N: ${port.info.serialNumber})`;
        }
        
        if (port.getInfo) {
            try {
                const info = port.getInfo();
                // Format vendor/product IDs as hex with leading zeros
                const vendorId = info.usbVendorId ? info.usbVendorId.toString(16).padStart(4, '0') : '';
                const productId = info.usbProductId ? info.usbProductId.toString(16).padStart(4, '0') : '';
                
                // Look up device by VID:PID
                if (vendorId && productId) {
                    const deviceKey = `${vendorId}:${productId}`;
                    const deviceName = USB_DEVICE_NAMES[deviceKey] || `USB Device ${vendorId ? '0x'+vendorId : 'N/A'}:${productId ? '0x'+productId : 'N/A'}`;
                    
                    // Check if there are multiple devices with the same VID:PID
                    if (allPorts) {
                        // Create a list of all ports with this VID:PID
                        const sameDevicePorts = allPorts.filter(p => {
                            try {
                                const pInfo = p.getInfo && p.getInfo();
                                if (pInfo && pInfo.usbVendorId && pInfo.usbProductId) {
                                    const pVendorId = pInfo.usbVendorId.toString(16).padStart(4, '0');
                                    const pProductId = pInfo.usbProductId.toString(16).padStart(4, '0');
                                    return pVendorId === vendorId && pProductId === productId;
                                }
                                return false;
                            } catch (e) {
                                return false;
                            }
                        });
                        
                        // If there are multiple devices with the same VID:PID, add an index
                        if (sameDevicePorts.length > 1) {
                            const index = sameDevicePorts.indexOf(port) + 1;
                            return `${deviceName} (#${index})`;
                        }
                    }
                    
                    return deviceName;
                }
                
                return `USB Device ${vendorId ? '0x'+vendorId : 'N/A'}:${productId ? '0x'+productId : 'N/A'}`;
            } catch (e) {
                // getInfo() might fail
            }
        }
        
        // Rest of the function remains the same...
        // Last resort: try to get some kind of identifier from the port object
        try {
            if (typeof port === 'object') {
                // Try to find any identifying property
                const keys = Object.keys(port);
                for (const key of ['id', 'deviceId', 'path', 'name']) {
                    if (port[key]) {
                        return `Port ${key}: ${port[key]}`;
                    }
                }
                return `Port ${keys.length > 0 ? keys[0] + ': ' + String(port[keys[0]]).substring(0, 30) : 'object'}`;
            }
        } catch (e) {
            // Object inspection might fail
        }
        
        // Fallback for ports without specific info
        return "Serial Port";
    };

    // Moved from App.js - Lists available ports
    const listPorts = async () => {
        try {
            const availablePorts = await WebSerial.listPorts();
            window.availablePorts = availablePorts;
            if (availablePorts.length > 0) {
                setPorts(availablePorts);
                if (!selectedPort) {
                    setSelectedPort(availablePorts[0]);
                }
            }
        } catch (error) {
            console.error('Error listing ports:', error);
        }
    };

    // Moved from App.js - Requests a port from the browser
    const handleRequestPort = async () => {
        try {
            const port = await navigator.serial.requestPort();
            
            if (!ports.some(p => p === port)) {
                setSelectedPort(port);
                setPorts(prevPorts => [...prevPorts, port]);
            } else {
                setSelectedPort(port);
            }
            
            return true;
        } catch (err) {
            if (err.name === 'NotFoundError') {
                console.log('User canceled port selection');
            } else {
                console.error('Error requesting port:', err);
            }
            return false;
        }
    };

    // Handle Serial connection - update to show error messages
    const handleSerialConnect = async () => {
        try {
            if (activeConnection === 'serial') {
                // Disconnect using close()
                window.mavlinkSession.close();
                
                // Update the UI regardless of connection state
                setActiveConnection(null);
                onConnectionStatusChange(false);
                showMessage('Serial connection closed', 'info');
                
                // Clear the forwarding interval
                if (forwardingInterval) {
                    clearInterval(forwardingInterval);
                    setForwardingInterval(null);
                }
            } else {
                // Connect via serial - set in progress state
                setConnectionInProgress(true);
                
                const port = ports.find(p => p === selectedPort);
                if (port) {
                    try {
                        // Disconnect any existing connection first
                        if (activeConnection) {
                            window.mavlinkSession.close();
                            // Clear any existing interval
                            if (forwardingInterval) {
                                clearInterval(forwardingInterval);
                            }
                        }
                        
                        window.mavlinkSession.initWebSerialConnection(port, baudRate);
                        window.mavlinkSession.addWebSerialOpenHandler(() => {
                            // Set Node ID and Bus for the local node
                            window.localNode.setNodeId(parseInt(nodeId, 10));
                            window.localNode.setBus(selectedBus); 

                        
                            // Start the mavlinkCanForward interval
                            const intervalId = setInterval(() => {
                                if (window.mavlinkSession) {
                                    window.mavlinkSession.enableMavlinkCanForward(window.localNode.bus);
                                }
                            }, 1000);
                        
                            setForwardingInterval(intervalId);
                            setActiveConnection('serial');
                            setConnectionInProgress(false);
                            onConnectionStatusChange(true);
                            showMessage('Serial connection established', 'success');
                        })

                        window.mavlinkSession.addWebSerialErrorHandler((error) => {
                            console.error('Serial connection error:', error);
                            showMessage(`Serial connection failed: ${error.message || 'Could not connect to port'}`, 'error');
                            // Reset in-progress state on error
                            setConnectionInProgress(false);
                        });

                        window.mavlinkSession.webSerialConnect();
                    } catch (error) {
                        console.error('Serial connection error:', error);
                        showMessage(`Serial connection failed: ${error.message || 'Could not connect to port'}`, 'error');
                        // Reset in-progress state on error
                        setConnectionInProgress(false);
                    }
                } else {
                    // Reset in-progress state if no port selected
                    setConnectionInProgress(false);
                }
            }
        } catch (error) {
            console.error('Error with serial connection:', error);
            showMessage(`Serial error: ${error.message || 'Unknown error'}`, 'error');
            // Reset in-progress state on any error
            setConnectionInProgress(false);
        }
    };

    // Add this validation function
    const validateIpAddress = (input) => {
        // Check if empty
        if (!input) {
            return 'IP address is required';
        }
        
        // Allow "localhost"
        if (input === 'localhost') {
            return '';
        }
        
        // If input matches IPv4 pattern, validate as IPv4, else treat as hostname/domain
        const ipv4Pattern = /^\d{1,3}(\.\d{1,3}){3}$/;
        if (ipv4Pattern.test(input)) {
            const octets = input.split('.');
            for (const octet of octets) {
                const num = parseInt(octet, 10);
                if (isNaN(num) || num < 0 || num > 255 || octet !== num.toString()) {
                    return 'Each part must be a number between 0-255';
                }
            }
            return '';
        }
        
        // Check for hostname or domain (including subdomains)
        // Allow domains like 'support.ardupilot.org', 'foo.local', etc.
        const hostnamePattern = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/;

        if (hostnamePattern.test(input)) {
            return '';
        }

        return 'Invalid IP address or hostname';
    };

    const validatePort = (input) => {
        if (!input) {
            return 'Port is required';
        }
        
        const port = parseInt(input, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            return 'Port must be between 1-65535';
        }
        
        return '';
    };

    // Add validation for nodeId
    const validateNodeId = (value) => {
        const id = parseInt(value, 10);
        return (isNaN(id) || id < 1 || id > 127) ? 'Node ID must be between 1-127' : '';
    };

    // Update handler to propagate changes to parent
    const handleNodeIdChange = (e) => {
        const value = e.target.value;
        // Only allow numeric values
        if (/^\d*$/.test(value)) {
            setNodeId(value);
            if (setNodeId) {
                setNodeId(parseInt(value, 10));
            }
        }
    };

    // Handler for Mavlink Signing input
    const handleMavlinkSigningChange = (e) => {
        setMavlinkSigning(e.target.value);
    };

    // Update the ws host/port change handlers
    const handleWsHostChange = (e) => {
        const value = e.target.value;
        setWsHost(value);
        setHostError(validateIpAddress(value));
    };

    const handleWsPortChange = (e) => {
        const value = e.target.value;
        setWsPort(value);
        setPortError(validatePort(value));
    };

    // Update the WebSocket connection handler
    const handleWebSocketConnect = async () => {
        try {
            if (activeConnection === 'websocket') {
                // Force close the connection
                window.mavlinkSession.close();
                setActiveConnection(null);
                onConnectionStatusChange(false);
                showMessage('WebSocket connection closed', 'info');
                if (forwardingInterval) {
                    clearInterval(forwardingInterval);
                    setForwardingInterval(null);
                }
            } else {
                setConnectionInProgress(true);
                const hostErr = validateIpAddress(wsHost);
                const portErr = validatePort(wsPort);
                setHostError(hostErr);
                setPortError(portErr);
                if (!hostErr && !portErr) {
                    if (activeConnection) {
                        window.mavlinkSession.close();
                        if (forwardingInterval) {
                            clearInterval(forwardingInterval);
                        }
                    }

                    // Use wss if signing is present, else ws
                    const wsProtocol = mavlinkSigning ? 'wss' : 'ws';
                    // Compose the full URL for the websocket
                    const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}`;
                    if (window.mavlinkSession.initWebSocketConnection.length === 1) {
                        // If the function expects a URL
                        window.mavlinkSession.initWebSocketConnection(wsUrl);
                    } else {
                        // Fallback to old signature (host, port)
                        window.mavlinkSession.initWebSocketConnection(wsHost, parseInt(wsPort, 10), mavlinkSigning);
                    }

                    window.mavlinkSession.addWebSocketOpenHandler(() => {
                        console.log('WebSocket connection open');
                        window.localNode.setNodeId(parseInt(nodeId, 10));
                        window.localNode.setBus(selectedBus);
                        const intervalId = setInterval(() => {
                            if (window.mavlinkSession) {
                                window.mavlinkSession.enableMavlinkCanForward(window.localNode.bus);
                            }
                        }, 1000);
                        setForwardingInterval(intervalId);
                        setActiveConnection('websocket');
                        onConnectionStatusChange(true);
                        setConnectionInProgress(false);
                        showMessage('WebSocket connection established', 'success');
                    });

                    window.mavlinkSession.addWebSocketErrorHandler((error) => {
                        console.error('WebSocket error:', error);
                        if (forwardingInterval) {
                            clearInterval(forwardingInterval);
                            setForwardingInterval(null);
                        }
                        setActiveConnection(null);
                        onConnectionStatusChange(false);
                        setConnectionInProgress(false);
                        let errorMsg = 'Connection failed';
                        if (error && error.message) {
                            errorMsg = `Connection failed: ${error.message}`;
                        } else if (typeof error === 'string') {
                            errorMsg = `Connection failed: ${error}`;
                        }
                        showMessage(errorMsg, 'error');
                    });

                    window.mavlinkSession.webSocketConnect();
                } else {
                    setConnectionInProgress(false);
                }
            }
        } catch (error) {
            console.error('Error with WebSocket connection:', error);
            showMessage(`WebSocket error: ${error.message || 'Unknown error'}`, 'error');
            setConnectionInProgress(false);
        }
    };

    // Load ports on component mount
    useEffect(() => {
        if (open) {
            listPorts();
        }
    }, [open]);

    // Add cleanup effect to clear the interval when component unmounts
    useEffect(() => {
        return () => {
            if (forwardingInterval) {
                clearInterval(forwardingInterval);
            }
        };
    }, [forwardingInterval]);

    // Update the layout to column direction for connection options
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Adapter Settings</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        {activeConnection && (
                            <Chip 
                                label={`Connected via ${activeConnection}`}
                                color="success" 
                                size="small" 
                                variant="outlined"
                            />
                        )}
                        <IconButton 
                            aria-label="close" 
                            onClick={onClose}
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
                    {/* Connection Options - Column layout */}
                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* Serial Connection Panel */}
                        <Paper sx={{ 
                            p: 1.5, // Reduce padding
                            width: '100%',
                            bgcolor: activeConnection === 'serial' ? 'rgba(0, 200, 83, 0.1)' : 'inherit'
                        }}>
                            <Typography variant="subtitle1" gutterBottom>Serial Connection</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}> {/* Reduce gap */}
                                {/* Port and Baud Selection in same row */}
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    {/* Port Selection - takes more space */}
                                    <Box sx={{ flex: 3 }}>
                                        <FormControl fullWidth size="small" disabled={activeConnection !== null}>
                                            <InputLabel>Port</InputLabel>
                                            <Select
                                                value={selectedPort || ''}
                                                onChange={(e) => setSelectedPort(e.target.value)}
                                                label="Port"
                                            >
                                                {ports.length === 0 ? (
                                                    <MenuItem value="" disabled>No ports available</MenuItem>
                                                ) : (
                                                    ports.map((port, index) => (
                                                        <MenuItem key={index} value={port}>
                                                            {getPortDisplayName(port, ports)}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    
                                    {/* Baud Rate Selection - takes less space */}
                                    <Box sx={{ flex: 1 }}>
                                        <FormControl fullWidth size="small" disabled={activeConnection !== null}>
                                            <InputLabel>Baud Rate</InputLabel>
                                            <Select
                                                value={baudRate}
                                                onChange={(e) => setBaudRate(e.target.value)}
                                                label="Baud Rate"
                                            >
                                                {BAUD_RATES.map((rate) => (
                                                    <MenuItem key={rate} value={rate}>
                                                        {rate}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                
                                {/* Port action buttons */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<RefreshIcon />} 
                                        onClick={listPorts}
                                        disabled={activeConnection !== null}
                                        size="small"
                                    >
                                        Refresh
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<UsbIcon />} 
                                        onClick={handleRequestPort}
                                        disabled={activeConnection !== null}
                                        size="small"
                                    >
                                        Request
                                    </Button>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Button 
                                        onClick={handleSerialConnect}
                                        color={activeConnection === 'serial' ? "error" : "primary"}
                                        variant="contained"
                                        disabled={
                                            connectionInProgress || // Disable when connection attempt is in progress
                                            !selectedPort || 
                                            (activeConnection !== null && activeConnection !== 'serial')
                                        }
                                        size="small"
                                    >
                                        {activeConnection === 'serial' ? 'Disconnect' : 
                                         connectionInProgress && !activeConnection ? 'Connecting...' : 'Connect'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                        
                        {/* WebSocket Connection Panel */}
                        <Paper sx={{ 
                            p: 1.5, // Reduce padding
                            width: '100%',
                            bgcolor: activeConnection === 'websocket' ? 'rgba(0, 200, 83, 0.1)' : 'inherit'
                        }}>
                            <Typography variant="subtitle1" gutterBottom>WebSocket Connection</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}> {/* Reduce gap */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="Host/IP Address"
                                        value={wsHost}
                                        onChange={handleWsHostChange}
                                        disabled={activeConnection !== null}
                                        size="small"
                                        sx={{ flex: 3 }}
                                        error={!!hostError}
                                        helperText={hostError}
                                    />
                                    <TextField
                                        label="Port"
                                        value={wsPort}
                                        onChange={handleWsPortChange}
                                        type="number"
                                        disabled={activeConnection !== null}
                                        size="small"
                                        sx={{ flex: 1 }}
                                        error={!!portError}
                                        helperText={portError}
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button 
                                    onClick={handleWebSocketConnect}
                                    color={activeConnection === 'websocket' ? "error" : "primary"}
                                    variant="contained"
                                    disabled={
                                        connectionInProgress || // Disable when connection attempt is in progress
                                        !!hostError || 
                                        !!portError || 
                                        !wsHost || 
                                        !wsPort || 
                                        (activeConnection !== null && activeConnection !== 'websocket')
                                    }
                                    size="small"
                                >
                                    {activeConnection === 'websocket' ? 'Disconnect' : 
                                     connectionInProgress && !activeConnection ? 'Connecting...' : 'Connect'}
                                </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                    
                    <Divider />
                    
                    {/* Bus Selection and Mavlink Signing */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                label="Node ID"
                                value={nodeId}
                                onChange={handleNodeIdChange}
                                disabled={activeConnection !== null}
                                size="small"
                                type="number"
                                InputProps={{ 
                                    inputProps: { min: 1, max: 127 }
                                }}
                                sx={{ width: 100 }}
                                error={validateNodeId(nodeId) !== ''}
                                helperText={validateNodeId(nodeId)}
                            />
                            <TextField
                                label="Mavlink Signing"
                                value={mavlinkSigning}
                                onChange={handleMavlinkSigningChange}
                                disabled={activeConnection !== null}
                                size="small"
                                placeholder="Secret Key"
                                type={showMavlinkSigning ? 'text' : 'password'}
                                sx={{ flex: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            aria-label={showMavlinkSigning ? 'Hide secret' : 'Show secret'}
                                            onClick={handleToggleMavlinkSigning}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                        >
                                            {showMavlinkSigning ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConnectionSettingsModal;