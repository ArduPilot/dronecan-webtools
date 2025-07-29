import React, { useState, useEffect } from 'react';
import { 
  Paper, Box, Typography, Card, CardContent, Slider, TextField, AppBar, 
  Toolbar, Button, IconButton, FormGroup, FormControlLabel, Checkbox, 
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl,
  InputLabel, Tab, Tabs, Divider, Grid
} from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SettingsIcon from '@mui/icons-material/Settings';

const MAX_ACTUATOR_IDS = 256;

const COMMAND_TYPES = {
  UNITLESS: 0,  // [-1, 1]
  POSITION: 1,  // meter or radian
  FORCE: 2,     // Newton or Newton metre
  SPEED: 3      // meter per second or radian per second
};

const COMMAND_TYPE_LABELS = {
  0: 'Unitless [-1, 1]',
  1: 'Position (m/rad)',
  2: 'Force (N/Nm)',
  3: 'Speed (m/s, rad/s)'
};

const DEFAULT_RANGES = {
  0: { min: -1, max: 1 },       // Unitless is fixed -1 to 1
  1: { min: -2, max: 2 },       // Position range (adjustable)
  2: { min: -10, max: 10 },     // Force range (adjustable)
  3: { min: -20, max: 20 }      // Speed range (adjustable)
};

const ActuatorPanel = () => {
    const [enabledActuatorIds, setEnabledActuatorIds] = useState(
      Array(MAX_ACTUATOR_IDS).fill(false).map((_, i) => i < 4)
    );
    const [actuatorData, setActuatorData] = useState([]);
    const [commandValues, setCommandValues] = useState({});
    
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    const [defaultRanges, setDefaultRanges] = useState({...DEFAULT_RANGES});
    
    const [broadcastRate, setBroadcastRate] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [showIdSelector, setShowIdSelector] = useState(false);
    
    const nodeId = 0;

    const activeActuatorIds = enabledActuatorIds
      .map((enabled, id) => enabled ? id : null)
      .filter(id => id !== null);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const handleBroadcastRateChange = (e) => {
        const newValue = parseInt(e.target.value) || 0;
        const safeValue = Math.max(1, Math.min(100, newValue));
        setBroadcastRate(safeValue);
    };

    const toggleActuatorId = (id) => {
        const newEnabledIds = [...enabledActuatorIds];
        newEnabledIds[id] = !newEnabledIds[id];
        setEnabledActuatorIds(newEnabledIds);
    };

    const handleDefaultRangeChange = (type, field, value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) return;
        
        if (field === 'min' && parsedValue >= defaultRanges[type].max) return;
        if (field === 'max' && parsedValue <= defaultRanges[type].min) return;
        
        setDefaultRanges(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: parsedValue
            }
        }));
    };
    
    const applyRangesToAllOfType = (type) => {
        if (type === COMMAND_TYPES.UNITLESS) return; // Don't change unitless ranges
        
        const newMin = defaultRanges[type].min;
        const newMax = defaultRanges[type].max;
        
        activeActuatorIds.forEach(id => {
            if ((commandTypes[id] || COMMAND_TYPES.UNITLESS) === type) {
                setSliderMins(prev => ({ ...prev, [id]: newMin }));
                setSliderMaxs(prev => ({ ...prev, [id]: newMax }));
            }
        });
    };
    
    const applyAllRanges = () => {
        activeActuatorIds.forEach(id => {
            const type = commandTypes[id] || COMMAND_TYPES.UNITLESS;
            if (type !== COMMAND_TYPES.UNITLESS) {
                setSliderMins(prev => ({ ...prev, [id]: defaultRanges[type].min }));
                setSliderMaxs(prev => ({ ...prev, [id]: defaultRanges[type].max }));
            }
        });
    };

    useEffect(() => {
        const activeIds = activeActuatorIds;
        
        const initialCommandValues = {};
        activeIds.forEach(id => {
            initialCommandValues[id] = commandValues[id] || 0;
        });
        setCommandValues(initialCommandValues);
        
        const initialActuatorData = activeIds.map(id => ({
            actuator_id: id,
            position: null,
            force: null,
            speed: null,
            power_rating_pct: null,
        }));
        setActuatorData(initialActuatorData);
    }, [enabledActuatorIds]);

    const handleCommandChange = (id, value) => {
        setCommandValues(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCommandInputChange = (id, event) => {
        let value = parseFloat(event.target.value);
        if (isNaN(value)) value = 0;
        value = Math.max(sliderMins[id] || -1, Math.min(sliderMaxs[id] || 1, value));
        handleCommandChange(id, value);
    };

    const handleZeroAll = () => {
        const newCommandValues = {};
        activeActuatorIds.forEach(id => {
            newCommandValues[id] = 0;
        });
        setCommandValues(newCommandValues);
    };
    
    const handleZeroOne = (id) => {
        setCommandValues(prev => ({
            ...prev,
            [id]: 0
        }));
    };

    useEffect(() => {
        const localNode = window.opener?.localNode;
        if (!localNode) return;

        const handleActuatorData = (transfer) => {
            const msg = transfer.payload;
            if (!msg) return;
            
            try {
                const msgObj = msg.toObj ? msg.toObj() : msg;
                if (!msgObj || typeof msgObj.actuator_id !== 'number') return;
                
                if (enabledActuatorIds[msgObj.actuator_id]) {
                    setActuatorData(prev => {
                        const existingIndex = prev.findIndex(a => a.actuator_id === msgObj.actuator_id);
                        const newData = [...prev];
                        
                        const updatedActuator = {
                            actuator_id: msgObj.actuator_id,
                            position: msgObj.position,
                            force: msgObj.force,
                            speed: msgObj.speed,
                            power_rating_pct: msgObj.power_rating_pct || null,
                            status_flags: msgObj.status_flags
                        };
                        
                        if (existingIndex !== -1) {
                            newData[existingIndex] = updatedActuator;
                        } else {
                            newData.push(updatedActuator);
                        }
                        
                        return newData;
                    });
                }
            } catch (error) {
                console.error('Error processing actuator status:', error);
            }
        };

        localNode.on('uavcan.equipment.actuator.Status', handleActuatorData);
        
        return () => {
            localNode.off('uavcan.equipment.actuator.Status', handleActuatorData);
        };
    }, [enabledActuatorIds]);

    useEffect(() => {
        // Create or retrieve the worker
        if (!window.ActuatorPanelWorker) {
            window.ActuatorPanelWorker = new Worker(new URL('./workers/actuator-command-worker.js', import.meta.url));
            console.log('Created actuator command worker');
        }

        window.ActuatorPanelWorker.onmessage = (event) => {
            const localNode = window.opener?.localNode;
            if (!localNode) return;
            if (event.data.type === 'requestActuatorCommand') {
                try {
                    const allCommands = [];
                    activeActuatorIds.forEach(id => {
                        const type = commandTypes[id] || COMMAND_TYPES.UNITLESS;
                        const value = commandValues[id] || 0;
                        if (value < (sliderMins[id] || -1) || value > (sliderMaxs[id] || 1)) {
                            // Value out of range, skipping
                        } else {
                            allCommands.push({ id, type, value });
                        }
                    });
                    
                    const MAX_COMMANDS_PER_BATCH = 15;
                    
                    if (allCommands.length > MAX_COMMANDS_PER_BATCH) {
                        const batchCount = Math.ceil(allCommands.length / MAX_COMMANDS_PER_BATCH);
                        
                        for (let i = 0; i < batchCount; i++) {
                            const startIdx = i * MAX_COMMANDS_PER_BATCH;
                            const endIdx = Math.min(startIdx + MAX_COMMANDS_PER_BATCH, allCommands.length);
                            const batchCommands = allCommands.slice(startIdx, endIdx);
                            
                            localNode.sendUavcanEquipmentActuatorArrayCommand(0, batchCommands);
                        }
                    } else if (allCommands.length > 0) {
                        localNode.sendUavcanEquipmentActuatorArrayCommand(0, allCommands);
                    }
                } catch (error) {
                    console.error('Error sending actuator commands:', error);
                }
            }
        }
        // Clean up
        return () => {
        };
    }, [activeActuatorIds, commandTypes, commandValues, sliderMins, sliderMaxs]);

    useEffect(() => {
        if (!window.ActuatorPanelWorker) return;

        if (!isPaused) {
            console.log(`Starting Actuator commands with rate: ${broadcastRate}Hz`);
            window.ActuatorPanelWorker.postMessage({
                type: 'actuator',
                command: 'start',
                rate: broadcastRate
            });
        } else {
            console.log('Pausing Actuator commands');
            window.ActuatorPanelWorker.postMessage({
                type: 'actuator',
                command: 'stop'
            });
        }
        
        return () => {
            window.ActuatorPanelWorker.postMessage({
                type: 'actuator',
                command: 'stop'
            });
        };
    }, [isPaused, broadcastRate]);

    const renderIdSelectorDialog = () => (
        <Dialog open={showIdSelector} onClose={() => setShowIdSelector(false)}>
            <DialogTitle>Select Actuator IDs</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Select Actuator IDs:</Typography>
                <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                    {Array(MAX_ACTUATOR_IDS).fill(0).map((_, id) => (
                        <FormControlLabel
                            key={id}
                            control={
                                <Checkbox 
                                    checked={enabledActuatorIds[id]} 
                                    onChange={() => toggleActuatorId(id)}
                                />
                            }
                            label={id}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowIdSelector(false)} color="primary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
    
    const renderRangeSettingsDialog = () => (
        <Dialog 
            open={showSettingsModal} 
            onClose={() => setShowSettingsModal(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Command Type Range Settings
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                    Configure default ranges for each command type. These settings can be applied to all actuators.
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {COMMAND_TYPE_LABELS[0]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Unitless command range is fixed at -1 to 1
                    </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {COMMAND_TYPE_LABELS[1]}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <TextField
                                label="Min"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[1].min}
                                onChange={(e) => handleDefaultRangeChange(1, 'min', e.target.value)}
                                InputProps={{ inputProps: { step: 0.1 } }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Max"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[1].max}
                                onChange={(e) => handleDefaultRangeChange(1, 'max', e.target.value)}
                                InputProps={{ inputProps: { step: 0.1 } }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => applyRangesToAllOfType(1)}
                                fullWidth
                            >
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {COMMAND_TYPE_LABELS[2]}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <TextField
                                label="Min"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[2].min}
                                onChange={(e) => handleDefaultRangeChange(2, 'min', e.target.value)}
                                InputProps={{ inputProps: { step: 0.5 } }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Max"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[2].max}
                                onChange={(e) => handleDefaultRangeChange(2, 'max', e.target.value)}
                                InputProps={{ inputProps: { step: 0.5 } }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => applyRangesToAllOfType(2)}
                                fullWidth
                            >
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {COMMAND_TYPE_LABELS[3]}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <TextField
                                label="Min"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[3].min}
                                onChange={(e) => handleDefaultRangeChange(3, 'min', e.target.value)}
                                InputProps={{ inputProps: { step: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Max"
                                type="number"
                                size="small"
                                fullWidth
                                value={defaultRanges[3].max}
                                onChange={(e) => handleDefaultRangeChange(3, 'max', e.target.value)}
                                InputProps={{ inputProps: { step: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => applyRangesToAllOfType(3)}
                                fullWidth
                            >
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={applyAllRanges} 
                    color="primary" 
                    variant="contained"
                >
                    Apply All Ranges
                </Button>
                <Button 
                    onClick={() => setShowSettingsModal(false)} 
                    color="primary"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );

    const [commandTypes, setCommandTypes] = useState({});
    const [sliderMins, setSliderMins] = useState({});
    const [sliderMaxs, setSliderMaxs] = useState({});

    const handleActuatorCommandTypeChange = (id, newType) => {
        setCommandTypes(prev => {
            const updated = { ...prev, [id]: newType };
            return updated;
        });
        
        if (newType === COMMAND_TYPES.UNITLESS) {
            setSliderMins(prev => ({ ...prev, [id]: -1 }));
            setSliderMaxs(prev => ({ ...prev, [id]: 1 }));
        } else {
            setSliderMins(prev => ({ ...prev, [id]: defaultRanges[newType].min }));
            setSliderMaxs(prev => ({ ...prev, [id]: defaultRanges[newType].max }));
        }
        
        setCommandValues(prev => ({ ...prev, [id]: 0 }));
    };

    useEffect(() => {
        const activeIds = activeActuatorIds;
        
        const initialCommandValues = {};
        const initialCommandTypes = {};
        const initialSliderMins = {};
        const initialSliderMaxs = {};
        
        activeIds.forEach(id => {
            initialCommandValues[id] = commandValues[id] || 0;
            initialCommandTypes[id] = commandTypes[id] || COMMAND_TYPES.UNITLESS;
            
            const type = commandTypes[id] || COMMAND_TYPES.UNITLESS;
            if (type === COMMAND_TYPES.UNITLESS) {
                initialSliderMins[id] = -1;
                initialSliderMaxs[id] = 1;
            } else {
                initialSliderMins[id] = sliderMins[id] || defaultRanges[type].min;
                initialSliderMaxs[id] = sliderMaxs[id] || defaultRanges[type].max;
            }
        });
        
        setCommandValues(initialCommandValues);
        setCommandTypes(initialCommandTypes);
        setSliderMins(initialSliderMins);
        setSliderMaxs(initialSliderMaxs);
        
        const initialActuatorData = activeIds.map(id => ({
            actuator_id: id,
            position: null,
            force: null,
            speed: null,
            power_rating_pct: null,
        }));
        setActuatorData(initialActuatorData);
    }, [enabledActuatorIds]);

    return (
        <Box
            sx={{ 
                flexGrow: 1, 
                bgcolor: 'background.paper', 
                height: '100%', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }} 
            component={Paper}
            p={1}
        >
            <AppBar position="static" color="primary" sx={{ mb: 2 }}>
                <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button 
                                variant="outlined" 
                                size="small"
                                color="inherit"
                                startIcon={<CheckBoxIcon />}
                                onClick={() => setShowIdSelector(true)}
                                sx={{ textTransform: 'none' }}
                            >
                                Actuator IDs ({activeActuatorIds.length})
                            </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <Button 
                                variant="outlined" 
                                size="small"
                                color="inherit"
                                startIcon={<SettingsIcon />}
                                onClick={() => setShowSettingsModal(true)}
                                sx={{ textTransform: 'none' }}
                            >
                                Range Settings
                            </Button>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>Broadcast Rate:</Typography>
                            <TextField
                                type="number"
                                size="small"
                                value={broadcastRate}
                                sx={{ width: '60px' }}
                                InputProps={{ 
                                    inputProps: { 
                                        min: 1, 
                                        max: 100,
                                        style: { 
                                            textAlign: 'center',
                                            padding: '2px 4px'
                                        }
                                    }
                                }}
                                onChange={handleBroadcastRateChange}
                            />
                            <IconButton 
                                size="small" 
                                onClick={togglePause}
                                sx={{ ml: 1 }}
                                color={isPaused ? "default" : "primary"}
                            >
                                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {renderIdSelectorDialog()}
            {renderRangeSettingsDialog()}

            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5,
                justifyContent: 'center',
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: '150px',
                maxHeight: 'calc(100% - 140px)'
            }}>
                {actuatorData.map((actuator) => (
                    <Box 
                        key={actuator.actuator_id} 
                        sx={{ 
                            width: '180px',
                            height: '250px',
                        }}
                    >
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    p: 1.5,
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1,
                                    width: '50%'
                                }}>
                                    <Box sx={{flexGrow: 1}}>
                                        <Typography variant="body2" color="textSecondary">ID: {actuator.actuator_id}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Pos: {actuator.position !== null ? actuator.position.toFixed(3) : "NC"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Force: {actuator.force !== null ? `${actuator.force.toFixed(2)} N` : "NC"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Speed: {actuator.speed !== null ? `${actuator.speed.toFixed(2)} rad/s` : "NC"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            RAT: {actuator.power_rating_pct !== null 
                                                ? actuator.power_rating_pct === 127 
                                                    ? "unknown" 
                                                    : `${actuator.power_rating_pct.toFixed(1)} %` 
                                                : "NC"}
                                        </Typography>
                                    </Box>
                                    
                                    <FormControl size="small" fullWidth sx={{ mt: 1, mb: 1 }}>
                                        <Select
                                            value={commandTypes[actuator.actuator_id] || COMMAND_TYPES.UNITLESS}
                                            onChange={(e) => handleActuatorCommandTypeChange(actuator.actuator_id, e.target.value)}
                                            variant="outlined"
                                            sx={{ height: '30px', fontSize: '0.8rem' }}
                                        >
                                            <MenuItem value={COMMAND_TYPES.UNITLESS}>Unitless</MenuItem>
                                            <MenuItem value={COMMAND_TYPES.POSITION}>Position</MenuItem>
                                            <MenuItem value={COMMAND_TYPES.FORCE}>Force</MenuItem>
                                            <MenuItem value={COMMAND_TYPES.SPEED}>Speed</MenuItem>
                                        </Select>
                                    </FormControl>
                                    
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={(commandValues[actuator.actuator_id] || 0).toFixed(3)}
                                            fullWidth
                                            InputProps={{ 
                                                inputProps: { 
                                                    min: sliderMins[actuator.actuator_id] || -1, 
                                                    max: sliderMaxs[actuator.actuator_id] || 1,
                                                    step: 0.001, 
                                                    style: { 
                                                        padding: '2px 4px'
                                                    } 
                                                } 
                                            }}
                                            onChange={(e) => handleCommandInputChange(actuator.actuator_id, e)}
                                        />
                                        <Button 
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleZeroOne(actuator.actuator_id)}
                                            fullWidth
                                            size="small"
                                        >
                                            Zero
                                        </Button>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: '100%',
                                    paddingTop: '5px',
                                    width: '30%',
                                }}>
                                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}>
                                        <Slider
                                            sx={{ height: '100%' }}
                                            orientation="vertical"
                                            value={commandValues[actuator.actuator_id] || 0}
                                            valueLabelDisplay="auto"
                                            step={0.01}
                                            marks={[
                                                { value: sliderMaxs[actuator.actuator_id] || 1, label: '' },
                                                { value: 0, label: '' },
                                                { value: sliderMins[actuator.actuator_id] || -1, label: '' }
                                            ]}
                                            min={sliderMins[actuator.actuator_id] || -1}
                                            max={sliderMaxs[actuator.actuator_id] || 1}
                                            onChange={(e, value) => handleCommandChange(actuator.actuator_id, value)}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box sx={{ 
                mt: 1,
                width: '100%',
                p: 0.5,
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>
                <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1}}>
                    <Typography variant="body2" color="textSecondary">
                        cmd: [{
                            activeActuatorIds
                                .map(id => {
                                    const type = commandTypes[id] || COMMAND_TYPES.UNITLESS;
                                    const typeLabel = Object.keys(COMMAND_TYPES).find(key => COMMAND_TYPES[key] === type).toLowerCase();
                                    return `${id}:${(commandValues[id] || 0).toFixed(3)}[${typeLabel}]`;
                                })
                                .join(', ')
                        }]
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<PanToolIcon />}
                    onClick={handleZeroAll}
                >
                    Zero All
                </Button>
            </Box>
        </Box>
    );
};

export default ActuatorPanel;