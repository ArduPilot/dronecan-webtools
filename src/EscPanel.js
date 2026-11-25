import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Paper, Box, Typography, Card, CardContent, Slider, TextField, AppBar, Toolbar, Button, IconButton, Chip, Checkbox } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { TELEMETRY_REFRESH_MS, sampleTelemetryRate, expireTelemetryRates } from './telemetry_rate';

const getScaledCommands = (values, { min, max }) =>
    values.map(value => Math.round(value / 100 * (value < 0 ? Math.abs(min) : max)));

const RAW_COMMAND = 'uavcan.equipment.esc.RawCommand';
const EXTERNAL_TIMEOUT_MS = 2000;

const EscPanel = ({ localNode, isCurrentSession }) => {
    const spec = localNode.escCommandSpec;
    const worker = useRef(null);
    const [escData, setEscData] = useState([]);
    const [thrustValues, setThrustValues] = useState([]);
    const [localInstances, setLocalInstances] = useState(4);
    const [mode, setMode] = useState('read-only');
    const readOnly = mode === 'read-only';
    const isPaused = readOnly || mode === 'paused';
    const [sendArming, setSendArming] = useState(false);
    const readOnlyGate = useRef(true);
    const [observed, setObserved] = useState(null);
    const [externalActive, setExternalActive] = useState(false);
    const externalTimer = useRef(null);
    const [broadcastRate, setBroadcastRate] = useState(10);

    const stopOutput = () => {
        if (readOnlyGate.current || !isCurrentSession()) return;
        if (!isPaused) localNode.sendUavcanEquipmentEscRawCommand(0, Array(localInstances).fill(0));
        if (sendArming) localNode.sendUavcanEquipmentSafetyArmingStatus(0, spec.arming.STATUS_DISARMED);
    };

    const changeReadOnly = (_, checked) => {
        if (externalTimer.current !== null || !isCurrentSession() || checked === readOnlyGate.current) return;
        if (checked) stopOutput();
        readOnlyGate.current = checked;
        setMode(checked ? 'read-only' : 'paused');
        setSendArming(false);
        setThrustValues(Array(localInstances).fill(0));
        setObserved(null);
    };

    const togglePause = () => {
        if (readOnlyGate.current || !isCurrentSession()) return;
        setMode(isPaused ? 'broadcasting' : 'paused');
    };

    useLayoutEffect(() => {
        const sessionId = localNode.sessionId;
        let displayTimer = null;
        let latest = null;
        const publish = () => {
            displayTimer = null;
            if (!latest) return;
            setObserved({ source: latest.sourceNodeId, commands: latest.payload.toObj().cmd });
            latest = null;
            displayTimer = setTimeout(publish, 100);
        };
        const handleCommand = transfer => {
            if (transfer.sourceNodeId === localNode.nodeId || localNode.sessionId !== sessionId) return;
            // Close the gate before React renders or a queued worker tick can run.
            if (!readOnlyGate.current) {
                readOnlyGate.current = true;
                setMode('read-only');
                setSendArming(false);
                setThrustValues(values => values.map(() => 0));
            }
            if (externalTimer.current === null) setExternalActive(true);
            clearTimeout(externalTimer.current);
            externalTimer.current = setTimeout(() => {
                externalTimer.current = null;
                setExternalActive(false);
            }, EXTERNAL_TIMEOUT_MS);
            latest = transfer;
            if (displayTimer === null) publish();
        };
        localNode.on(RAW_COMMAND, handleCommand);
        return () => {
            localNode.off(RAW_COMMAND, handleCommand);
            clearTimeout(displayTimer);
            clearTimeout(externalTimer.current);
            externalTimer.current = null;
        };
    }, [localNode]);

    // Add handler function for broadcast rate
    const handleBroadcastRateChange = (e) => {
        const newValue = parseInt(e.target.value) || 0;
        // Reasonable limits for broadcast rate
        const safeValue = Math.max(1, Math.min(1000, newValue));
        setBroadcastRate(safeValue);
        console.log('Broadcast rate changed to:', safeValue);
    };

    useEffect(() => {
        const handleEscData = (transfer) => {
            const msg = transfer.payload;
            const msgObj = msg.toObj();
            // console.log('ESC data:', msgObj);
            const src = transfer.sourceNodeId;
            if (msgObj && typeof msgObj.esc_index === 'number' && msgObj.esc_index < localInstances) {
                const status = {
                    esc_index: msgObj.esc_index,
                    node_id: src,
                    error_count: msgObj.error_count,
                    temperature: msgObj.temperature,
                    voltage: msgObj.voltage,
                    current: msgObj.current,
                    rpm: msgObj.rpm,
                    power_rating_pct: msgObj.power_rating_pct
                };
                const receivedAt = performance.now();
                setEscData(previous => {
                    const updated = [...previous];
                    const prior = previous[msgObj.esc_index];
                    const rate = sampleTelemetryRate(prior && prior.node_id === src ? prior.rate : null, receivedAt);
                    updated[msgObj.esc_index] = { ...status, rate };
                    return updated;
                });
            }
        };
        const timer = setInterval(() => {
            const now = performance.now();
            setEscData(previous => expireTelemetryRates(previous, now));
        }, TELEMETRY_REFRESH_MS);
        localNode.on('uavcan.equipment.esc.Status', handleEscData);
        return () => {
            localNode.off('uavcan.equipment.esc.Status', handleEscData);
            clearInterval(timer);
        };
    }, [localNode, localInstances]);

    // Changing the channel count resets local setpoints and retains visible telemetry.
    useEffect(() => {
        setThrustValues(Array(localInstances).fill(0));
        setEscData(previous => Array.from({ length: localInstances }, (_, index) => previous[index] ?? {
            esc_index: index,
            node_id: null,
            error_count: null,
            temperature: null,
            voltage: null,
            current: null,
            rpm: null,
            power_rating_pct: null
        }));
    }, [localInstances]);

    const handleThrustChange = (index, value) => {
        const newThrustValues = [...thrustValues];
        newThrustValues[index] = value;
        setThrustValues(newThrustValues);
    };

    const handleThrustInputChange = (index, event) => {
        let value = parseInt(event.target.value);
        // Check bounds
        if (isNaN(value)) value = 0;
        value = Math.max(-100, Math.min(100, value));
        handleThrustChange(index, value);
    };

    const handleInstanceChange = (e) => {
        // Ensure we have a valid positive integer
        const newValue = parseInt(e.target.value) || 8;
        const newInstances = Math.max(1, Math.min(spec.channels, newValue));
        setLocalInstances(newInstances);
        console.log('ESC instances changed to:', newInstances);
    };

    // Define the stop all function
    const handleStopAll = () => {
        const newThrustValues = Array(thrustValues.length).fill(0);
        setThrustValues(newThrustValues);
        console.log('Stopping all ESCs');
    };
    
    // Define the stop one function
    const handleStopOne = (index) => {
        const newThrustValues = [...thrustValues];
        newThrustValues[index] = 0;
        setThrustValues(newThrustValues);
        console.log(`Stopping ESC ${index + 1}`);
    };

    useLayoutEffect(() => {
        if (readOnly) return;
        const instance = new Worker(new URL('./workers/esc-command-worker.js', import.meta.url));
        worker.current = instance;
        return () => {
            instance.onmessage = null;
            instance.terminate();
            worker.current = null;
        };
    }, [readOnly]);

    const release = useRef(null);
    useLayoutEffect(() => { release.current = stopOutput; });
    useLayoutEffect(() => {
        if (readOnly) return;
        const stop = () => release.current();
        localNode.on('before-bus-change', stop);
        localNode.on('before-disconnect', stop);
        return () => {
            localNode.off('before-bus-change', stop);
            localNode.off('before-disconnect', stop);
            stop();
        };
    }, [localNode, readOnly]);

    useLayoutEffect(() => {
        const instance = worker.current;
        if (!instance) return;
        instance.onmessage = (event) => {
            if (readOnlyGate.current || worker.current !== instance || !isCurrentSession()) return;
            try {
                if (event.data.type === 'requestEscCommand' && !isPaused && thrustValues.length) {
                    localNode.sendUavcanEquipmentEscRawCommand(0, getScaledCommands(thrustValues, spec));
                } else if (event.data.type === 'requestArmingCommand' && sendArming) {
                    localNode.sendUavcanEquipmentSafetyArmingStatus(0, spec.arming.STATUS_FULLY_ARMED);
                }
            } catch (error) {
                console.error('Error sending ESC panel message:', error);
            }
        };

        return () => { instance.onmessage = null; };
    }, [thrustValues, sendArming, readOnly, isPaused, isCurrentSession, localNode, spec]);

    useEffect(() => {
        const command = isPaused ? 'stop' : 'start';
        worker.current?.postMessage({ type: 'esc', command, rate: broadcastRate });
    }, [readOnly, isPaused, broadcastRate]);

    useEffect(() => {
        worker.current?.postMessage({ type: 'arming', command: sendArming ? 'start' : 'stop' });
    }, [readOnly, sendArming]);

    return (
        <Box component={Paper} sx={{
            height: '100%', p: 1, display: 'grid', gap: 2,
            gridTemplateRows: 'auto minmax(0, 1fr) auto',
            gridTemplateColumns: 'minmax(0, 1fr)', colorScheme: 'dark',
        }}>
            <AppBar position="static" color="primary">
                <Toolbar variant="dense" disableGutters sx={{
                    minHeight: 48, px: 1, py: 0.5, gap: 0.75,
                    flexWrap: 'wrap', justifyContent: 'space-between',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="label" htmlFor="esc-channels" variant="body2">Channels:</Typography>
                        <TextField id="esc-channels" type="number" value={localInstances}
                            onChange={handleInstanceChange} sx={{ width: 60 }}
                            inputProps={{ min: 1, max: spec.channels }} />
                        <Box component="label" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox size="small" sx={{ p: 0.5 }} color="default" checked={readOnly} disabled={externalActive}
                                onChange={changeReadOnly} inputProps={{ 'aria-label': 'View Mode' }} />
                            <Typography variant="body2" noWrap>View Mode</Typography>
                        </Box>
                    </Box>
                    <Typography variant="caption" noWrap sx={{ fontSize: '0.6rem', color: 'error.main', fontWeight: 'bold' }}>
                        ⚠️ REMOVE PROPELLERS!
                    </Typography>
                    <Box component="label" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" noWrap>Send Arming</Typography>
                        <Checkbox size="small" sx={{ p: 0.5 }} checked={sendArming} disabled={readOnly}
                            onChange={(_, checked) => setSendArming(checked)} inputProps={{ 'aria-label': 'Send Arming' }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography component="label" htmlFor="esc-rate" variant="body2" noWrap>Broadcast Rate:</Typography>
                        <TextField id="esc-rate" type="number" value={broadcastRate} disabled={readOnly}
                            onChange={handleBroadcastRateChange} sx={{ width: 60 }}
                            inputProps={{ min: 1, max: 1000 }} />
                        <IconButton onClick={togglePause} disabled={readOnly}
                            aria-label={isPaused ? 'Start broadcasting' : 'Pause broadcasting'}
                            color={isPaused ? 'default' : 'primary'}>
                            {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{
                minHeight: 0, overflowY: 'auto', display: 'grid', gap: 0.5, alignContent: 'start',
                width: '100%', maxWidth: localInstances * 184 - 4, mx: 'auto',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))',
                gridAutoRows: 'minmax(250px, auto)',
            }}>
                {escData.map((esc, index) => {
                    const raw = observed?.commands[index];
                    const percent = readOnly
                        ? (raw == null ? '' : Math.trunc(raw * 100 / (raw < 0 ? -spec.min : spec.max)))
                        : (thrustValues[index] ?? 0);
                    return (
                        <Card key={index} variant="outlined" sx={{ display: 'flex' }}>
                            <CardContent sx={{
                                display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 0.5,
                                width: '100%', p: 2, '&:last-child': { pb: 2 },
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 0.5 }}>
                                    <Box sx={{ overflowWrap: 'anywhere', '& .MuiTypography-body2': { lineHeight: 1.3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mb: 0.25 }}>
                                            <Typography variant="body2" noWrap>Index: {esc.esc_index}</Typography>
                                            {esc.node_id != null && (
                                                <Chip label={`Node ${esc.node_id}`} size="small"
                                                    sx={{ height: 18, '& .MuiChip-label': { px: 0.75, fontSize: '0.625rem' } }} />
                                            )}
                                        </Box>
                                        <Typography variant="body2">Err: {esc.error_count ?? 'NC'}</Typography>
                                        <Typography variant="body2">Temp: {esc.temperature !== null ? `${(esc.temperature - 273.15).toFixed(1)} °C` : 'NC'}</Typography>
                                        <Typography variant="body2">Volt: {esc.voltage !== null ? `${esc.voltage.toFixed(2)} V` : 'NC'}</Typography>
                                        <Typography variant="body2">Curr: {esc.current !== null ? `${esc.current.toFixed(2)} A` : 'NC'}</Typography>
                                        <Typography variant="body2">RPM: {esc.rpm !== null ? Math.round(esc.rpm) : 'NC'}</Typography>
                                        <Typography variant="body2">RAT: {esc.power_rating_pct !== null ? `${esc.power_rating_pct.toFixed(1)} %` : 'NC'}</Typography>
                                        <Typography variant="body2">FPS: {(esc.rate?.hz ?? 0).toFixed(1)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'grid', gap: 0.5, width: 'min(100%, 94px)' }}>
                                        <TextField type="number" value={percent} placeholder="—" disabled={readOnly}
                                            inputProps={{ min: -100, max: 100, 'aria-label': `ESC ${index} throttle (%)` }}
                                            onChange={event => handleThrustInputChange(index, event)} />
                                        <Button color="error" variant="contained" onClick={() => handleStopOne(index)} disabled={readOnly}>
                                            Stop
                                        </Button>
                                    </Box>
                                </Box>
                                <Slider orientation="vertical" sx={{ height: 'auto', my: 1.25 }}
                                    value={percent === '' ? 0 : percent} disabled={readOnly}
                                    aria-label={`ESC ${index} throttle`} valueLabelDisplay="auto"
                                    step={1} marks={[{ value: -100 }, { value: 0 }, { value: 100 }]}
                                    min={-100} max={100} onChange={(event, value) => handleThrustChange(index, value)} />
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            <Box sx={{ display: 'grid', gap: 1, p: 0.5 }}>
                <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, overflowWrap: 'anywhere' }}>
                    <Typography variant="body2" color="textSecondary">
                        {readOnly
                            ? observed
                                ? `${externalActive ? 'External source' : 'Last external source'}: node ${observed.source} · cmd: [${observed.commands.join(', ')}]`
                                : 'Waiting for external ESC commands'
                            : `cmd: [${getScaledCommands(thrustValues, spec).join(', ')}]`}
                    </Typography>
                </Box>
                <Button fullWidth variant="contained" color="error" startIcon={<PanToolIcon />}
                    onClick={handleStopAll} disabled={readOnly}>
                    Stop All
                </Button>
            </Box>
        </Box>
    );
};

export default EscPanel;
