import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, ThemeProvider, IconButton, Snackbar, Alert, Tooltip, FormControl, Select, MenuItem, InputLabel, Chip } from '@mui/material';
import MavlinkSession from './mavlink_session';
import dronecan from './dronecan';
import theme from './theme';
import NodeList from './NodeList';
import NodeLogs from './NodeLogs';
import NodeProperties from './NodeProperties';
import NodeParam from './NodeParam';
import About from './About';
import ToolsMenu from './ToolsMenu';
import PanelsMenu from './PanelsMenu';
import ConnectionSettingsModal from './ConnectionSettingsModal';
import DronecanLogo from './image/dronecan_logo.png';
import FileServer from './FileServer';
import './css/index.css';
import ConnectionIndicators from './ConnectionIndicators';
import DnsIcon from '@mui/icons-material/Dns';
import LanIcon from '@mui/icons-material/Lan';
import CompactSidebar from './CompactSidebar';
import DNAServerModal from './DNAServerModal';

window.localNode = new dronecan.Node({name: "com.vimdrones.web_gui"});
window.mavlinkSession = new MavlinkSession(window.localNode);
window.addEventListener('pagehide', () => window.mavlinkSession.close());

localNode.on('uavcan.protocol.file.Read.Request', (transfer) => {
    FileServer.handleReadRequest(transfer, localNode);
});

const App = () => {
    const [nodes, setNodes] = useState({});
    const [, setNodesRevision] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [multiNodeEditorEnable, setMultiNodeEditorEnable] = useState(false);
    const [subWindowRef, setSubWindowRef] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [selectedBus, setSelectedBus] = useState(0);
    const [dnaModalOpen, setDnaModalOpen] = useState(false);
    const [dnaServerActive, setDnaServerActive] = useState(false);

    const openWindow = (windowTitle, windowPath, windowSize) => {
        const existingWindow = subWindowRef[windowPath];
        if (existingWindow && !existingWindow.closed) {
            existingWindow.focus();
            return;
        }
        const newWindow = window.open(windowPath, windowTitle, windowSize);
        if (newWindow) {
            subWindowRef[windowPath] = newWindow;
            setSubWindowRef(subWindowRef);

            newWindow.addEventListener('beforeunload', () => {
                subWindowRef[windowPath] = null;
                setSubWindowRef(subWindowRef);
            });
        } else {
            console.error(`Main: Failed to open ${windowPath}`);
        }
    };

    const showMessage = (message, severity = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleBusChange = (event) => {
        const newBus = event.target.value;
        if (newBus === selectedBus) return;
        setSelectedBus(newBus);
        
        if (window.localNode) {
            window.localNode.changeBus(newBus);
            showMessage(`Switched to CAN bus ${newBus}`, 'info');
        }
    };

    const handleNodeList = (nodeList) => {
        setNodes(nodeList);
        setNodesRevision(revision => revision + 1);
    };

    useEffect(() => {
        const onSessionChange = () => {
            setSelectedNodeId(null);
            setMultiNodeEditorEnable(false);
        };
        const onConnectionChange = (kind, error) => {
            setIsConnected(Boolean(kind));
            const message = kind ? `Connected via ${kind}` : 'Adapter disconnected';
            showMessage(error?.message || message, error ? 'error' : (kind ? 'success' : 'info'));
        };
        localNode.on('nodeList', handleNodeList);
        localNode.on('session-change', onSessionChange);
        mavlinkSession.on('connection-change', onConnectionChange);
        return () => {
            localNode.off('nodeList', handleNodeList);
            localNode.off('session-change', onSessionChange);
            mavlinkSession.off('connection-change', onConnectionChange);
        };
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleOpenDnaModal = () => {
        setDnaModalOpen(true);
    };

    const handleCloseDnaModal = (serverRunning) => {
        setDnaModalOpen(false);
        setDnaServerActive(serverRunning);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{width: '30%', flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}> 
                        <ToolsMenu openWindow={openWindow.bind(this)} />
                        <PanelsMenu openWindow={openWindow.bind(this)} />
                    </Box>
                    <Box sx={{flexGrow: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} ml={0.5} mr={0.5}>
                            <a href="https://dev.vimdrones.com" target="_blank" rel="noreferrer" style={{height: 30}}>
                                <img src={DronecanLogo} alt="DroneCAN" style={{ height: 30}} />
                            </a>
                        </Box>
                        <Typography variant="caption">
                            DroneCAN Web Tools 
                        </Typography>
                    </Box>
                    <Box sx={{width: '30%', flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 1}}> 
                        <ConnectionIndicators 
                            isConnected={isConnected}
                            mavlinkSession={window.mavlinkSession}
                            localNode={window.localNode}
                        />
                        
                        <FormControl 
                            size="small" 
                            sx={{ 
                                minWidth: 80,
                                '& .MuiOutlinedInput-root': {
                                    height: 30,
                                },
                                '& .MuiSelect-select': {
                                    paddingTop: 0.5, 
                                    paddingBottom: 0.5,
                                    fontSize: '0.8rem'
                                }
                            }}
                        >
                            <Select
                                value={selectedBus}
                                onChange={handleBusChange}
                                displayEmpty
                                variant="outlined"
                                sx={{
                                    backgroundColor: 'background.paper',
                                }}
                            >
                                <MenuItem value={0}>Bus 1</MenuItem>
                                <MenuItem value={1}>Bus 2</MenuItem>
                                <MenuItem value={2}>Bus 3</MenuItem>
                                <MenuItem value={3}>Bus 4</MenuItem>
                            </Select>
                        </FormControl>

                        <Button 
                            variant="outlined" 
                            color={dnaServerActive ? "success" : "primary"}
                            startIcon={
                                dnaServerActive ? 
                                <DnsIcon sx={{
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 0.6 },
                                        '50%': { opacity: 1 },
                                        '100%': { opacity: 0.6 },
                                    }
                                }} /> : 
                                <DnsIcon />
                            }
                            onClick={handleOpenDnaModal}
                            sx={dnaServerActive ? {
                                borderColor: 'success.main',
                                '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                    borderColor: 'success.dark'
                                }
                            } : {}}
                        >
                            DNA
                        </Button>
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<LanIcon />}
                            onClick={handleOpenModal}
                        >
                            Adapter
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0, gap: 0.5, p: 1 }}>
                <CompactSidebar 
                    nodes={nodes}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                />
                
                <Box 
                    sx={{ 
                        minWidth: 550, 
                        display: { xs: 'none', md: 'flex' }, 
                        flexDirection: 'column', 
                        gap: 0.5, 
                    }}
                >
                    <NodeList
                        nodes={nodes}
                        selectedNodeId={selectedNodeId}
                        setSelectedNodeId={setSelectedNodeId.bind(this)}
                    />
                    <NodeLogs/> 
                </Box>
                
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    sx={{
                        gap: 0.5,
                        ml: { xs: 1, md: 0 },
                        flexGrow: 1,
                        minWidth: 0,
                        overflow: 'auto',
                    }}
                >
                    {selectedNodeId && (
                        <>
                            <NodeProperties key={`properties-${localNode.sessionId}-${selectedNodeId}`}
                                nodeId={selectedNodeId}
                                nodes={nodes}
                                multiNodeEditorEnable={multiNodeEditorEnable}
                                setMultiNodeEditorEnable={setMultiNodeEditorEnable.bind(this)}
                            />
                            <NodeParam key={`params-${localNode.sessionId}-${selectedNodeId}`}
                                nodeId={selectedNodeId}
                                nodes={nodes}
                                multiNodeEditorEnable={multiNodeEditorEnable}
                            />
                        </>
                    )}

                    {selectedNodeId === null && (
                        <About />
                    )}
                </Box>
            </Box>
            <ConnectionSettingsModal
                open={modalOpen}
                onClose={handleCloseModal}
                showMessage={showMessage.bind(this)}
            />
            <DNAServerModal
                open={dnaModalOpen}
                onClose={handleCloseDnaModal}
                showMessage={showMessage.bind(this)}
            />
            <Snackbar
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default App;
