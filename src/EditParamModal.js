import React, { useEffect, useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Checkbox, Typography,
    Select, MenuItem, FormControl, InputLabel, Divider,
    IconButton, Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';  // Add this import for the stop button
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AM32_Rtttl from './am32_rtttl'; // Updated import to match class name

const EditParamModal = ({ open, onClose, nodeId, paramIndex }) => {
    // Add a new state for tracking whether a tune is currently playing
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Add to your existing state variables
    const [value, setValue] = useState(null);
    const [previewTune, setPreviewTune] = useState(''); // For tune preview
    const [selectedPreset, setSelectedPreset] = useState(""); // Move this here from renderRTTLEditor
    const [errorMessage, setErrorMessage] = useState(''); // For validation error messages
    const [isValid, setIsValid] = useState(true); // Add a new state variable to track validation status
    const [paramName, setParamName] = useState(""); // Add paramName to the component state
    
    useEffect(() => {
        const localNode = window.localNode;
        if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return;
        
        const param = localNode.nodeParams[nodeId][paramIndex];
        const currentParamName = param.fields.name.toString();
        
        // Set the param name in state so it's available to the whole component
        setParamName(currentParamName);
        
        const paramValueField = param.fields.value.msg.unionField;
        
        // Different handling based on value type
        let paramValue;
        if (param.fields.value.msg.fields.string_value !== undefined) {
            // For string values, use toString() directly
            paramValue = paramValueField.toString();
        } else {
            // For other types (int, float, bool), use .value
            paramValue = paramValueField.value;
        }
        
        // Special handling for STARTUP_TUNE parameter
        if (currentParamName === "STARTUP_TUNE" && param.fields.value.msg.fields.string_value !== undefined) {
            try {
                // Get the binary string value
                const binaryString = paramValue;
                
                // Convert binary string to Uint8Array
                const binaryData = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    binaryData[i] = binaryString.charCodeAt(i);
                }
                
                // Convert to RTTTL format
                const rtttlString = AM32_Rtttl.from_am32_startup_melody(binaryData, "Tune");
                setValue(rtttlString);
            } catch (err) {
                console.error("Error converting binary data to RTTTL:", err);
                setValue(""); // Set empty string on error
            }
        } else {
            setValue(paramValue);
        }
    }, [nodeId, paramIndex]); // Add nodeId to dependencies

    const handleSave = () => {
        const localNode = window.localNode;
        let valueToSave = value;
        
        // If this is the STARTUP_TUNE parameter, convert RTTTL string to byte array
        if (paramName === "STARTUP_TUNE") {
            console.log("Converting RTTTL tune:", value);
            try {
                // Validate RTTTL string format
                const rtttlValue = value || "";
                const isValidFormat = rtttlValue && rtttlValue.includes(':') && rtttlValue.split(':').length === 3;
                
                let result; // Declare result variable outside the if/else blocks
                
                if (!isValidFormat) {
                    // Warn user but continue with a default tune
                    setErrorMessage('Warning: Invalid RTTTL format! Using a default empty tune instead.');
                    // Continue with a minimal valid RTTTL string
                    const tuneToParse = "Empty:d=4,o=5,b=120:";
                    result = AM32_Rtttl.to_am32_startup_melody(tuneToParse);
                } else {
                    // Format is valid, proceed normally
                    setErrorMessage(''); // Clear any previous errors
                    result = AM32_Rtttl.to_am32_startup_melody(rtttlValue);
                }
                
                // Convert to binary string after we have the result
                const binaryString = String.fromCharCode.apply(null, result.data);
                valueToSave = binaryString;
                
                // For debug purposes, show numeric values
                console.log("Binary array values:", Array.from(result.data).slice(0, 30));
            } catch (err) {
                console.error("Error converting RTTTL to binary:", err);
                setErrorMessage(`Error saving tune: ${err.message || 'Unknown error'}`);
                // Provide an empty binary string (all zeros) as fallback
                const emptyArray = new Uint8Array(128);
                valueToSave = String.fromCharCode.apply(null, emptyArray);
            }
        }

        localNode.setNodeParam(nodeId, paramIndex, valueToSave);
        onClose();
    };

    // Modify handlePlayTune function to toggle play/stop
    const handlePlayTune = () => {
        // If already playing, stop the melody
        if (isPlaying) {
            AM32_Rtttl.stopMelody();
            setIsPlaying(false);
            return;
        }

        const tuneToPlay = value || '';
        try {
            // First validate that the tune has the basic RTTTL format (name:defaults:notes)
            if (!tuneToPlay || !tuneToPlay.includes(':') || tuneToPlay.split(':').length !== 3) {
                setErrorMessage('Invalid RTTTL format! Format should be: name:defaults:notes');
                return;
            }
            
            // Clear any previous error when successful
            setErrorMessage('');
            
            // Stop any currently playing tune before starting a new one
            AM32_Rtttl.stopMelody();
            
            // Play the new tune
            AM32_Rtttl.playMelody(tuneToPlay);
            setPreviewTune(tuneToPlay);
            setIsPlaying(true);
            
            // Set up an event listener to detect when audio context is closed or ends
            const estimatedDuration = estimateTuneDuration(tuneToPlay);
            setTimeout(() => {
                setIsPlaying(false);
            }, estimatedDuration + 500); // Add a small buffer
            
        } catch (err) {
            console.error("Error playing tune:", err);
            setErrorMessage(`Error playing tune: ${err.message || 'Unknown error'}`);
            setIsPlaying(false);
        }
    };
    
    // Add a helper function to estimate tune duration
    const estimateTuneDuration = (rtttlString) => {
        try {
            if (!rtttlString) return 2000; // Default duration if no tune
            
            const parts = rtttlString.split(':');
            if (parts.length !== 3) return 5000; // Default if format is wrong
            
            const defaults = parts[1];
            // Extract BPM from defaults
            const bpmMatch = /b=(\d+)/i.exec(defaults);
            const bpm = bpmMatch ? parseInt(bpmMatch[1], 10) : 120;  
            
            // Count notes in the tune
            const notes = parts[2].split(',');
            const noteCount = notes.length;
            
            // Rough calculation: (60000 / bpm) gives ms per beat, multiply by estimated beats
            return Math.min((60000 / bpm) * noteCount * 1.5, 30000); // Cap at 30 seconds
        } catch (e) {
            console.warn('Error estimating tune duration:', e);
            return 5000; // Default fallback
        }
    };

    const handleSelectPreset = (presetValue) => {
        setValue(presetValue);
    };
    
    // Handle apply preset - moved from renderRTTTLEditor
    const handleApplyPreset = () => {
        if (selectedPreset) {
            setValue(selectedPreset);
            setSelectedPreset(""); // Reset selection after applying
        }
    };

    // Common RTTTL tunes
    const rtttlPresets = {
        "BlueJay": "bluejay:b=570,o=4,d=32:4b,p,4e5,p,4b,p,4f#5,2p,4e5,2b5,8b5",
        "Nokia Tune": "Nokia:d=4,o=5,b=63:e6,d6,f#,g#,c#6,b,d,e,b,a,c#,e,a",
        "Mario": "Mario:d=4,o=5,b=125:a,a,a,a,a#,c6,a,g,e,c,d,a#4,c",
        "Star Wars": "StarWars:d=4,o=5,b=112:8f,8f,8f,2a#.,2f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8c6,2a#.6,f.6,8d#6,8d6,8d#6,2c6",
        "Pacman": "Pacman:d=16,o=6,b=140:b5,b,f#,d#,8b,8d#,c,c7,g,f,8c7,8e,b5,b,f#,d#,8b,8d#,c,g,c7,g,8f,8c7",
        "Indiana": "Indiana:d=4,o=5,b=250:e,8p,8f,8g,8p,1c6,8p.,d,8p,8e,1f,p.,g,8p,8a,8b,8p,1f6,p,a,8p,8b,2c6,2d6,2e6,e,8p,8f,8g,8p,1c6",
        "Mission": "Mission:d=16,o=6,b=95:32d,32d#,32d,32d#,32d,32d#,32d,32d#,32d,32d,32d#,32e,32f,32f#,32g,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,g,8p,g,8p,a#,p,c7,p,g,8p,g,8p,f,p,f#,p,a#,g,2d"
    };

    // Fix the validateRtttl function to handle non-string values
    const validateRtttl = (rtttlString) => {
        console.log("Validating RTTTL:", rtttlString);
        
        // If we're not editing STARTUP_TUNE, don't validate with RTTTL
        if (paramName !== "STARTUP_TUNE") {
            return true;
        }
        
        // Convert to string if it's a number or other type
        const stringValue = String(rtttlString || '');
        
        // Empty strings are valid (to allow clearing the tune)
        if (!stringValue) {
            setErrorMessage('');
            return true;
        }
        
        // Check for basic RTTTL format
        const isValidFormat = stringValue.includes(':') && stringValue.split(':').length === 3;
        
        if (!isValidFormat) {
            setErrorMessage('Invalid RTTTL format! Format should be: name:defaults:notes');
            return false;
        }
        
        // Additional validation could be added here
        
        setErrorMessage(''); // Clear error if valid
        return true;
    };

    // Similarly, update the handleValueChange function to ensure we're dealing with strings
    const handleValueChange = (newValue) => {
        // For RTTTL special handling - check if it's specifically "STARTUP_TUNE"
        if (paramName === "STARTUP_TUNE") {
            setValue(newValue);
            // Convert to string before validation
            setIsValid(validateRtttl(String(newValue)));
            return;
        }
        
        // For all other parameters, don't try to validate with RTTTL
        const localNode = window.localNode;
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        if (!param) {
            setValue(newValue);
            return;
        }
        
        // Rest of your existing numeric validation...
        if (param && (
            param.fields.value.msg.fields.integer_value !== undefined || 
            param.fields.value.msg.fields.real_value !== undefined
        )) {
            // Skip validation for empty strings or non-numeric values during typing
            if (newValue === '' || isNaN(parseFloat(newValue))) {
                setValue(newValue);
                return;
            }
            
            const numericValue = parseFloat(newValue);
            const min = param.fields.min_value.msg && 
                        param.fields.min_value.msg.unionField.name !== 'uavcan.protocol.param.Empty' ? 
                        param.fields.min_value.msg.unionField.value : null;
                        
            const max = param.fields.max_value.msg && 
                        param.fields.max_value.msg.unionField.name !== 'uavcan.protocol.param.Empty' ? 
                        param.fields.max_value.msg.unionField.value : null;
            
            // Validate against min/max if they exist
            if ((min !== null && numericValue < min) || (max !== null && numericValue > max)) {
                setIsValid(false);
                setErrorMessage(`Value must be between ${min !== null ? min : '-∞'} and ${max !== null ? max : '∞'}`);
            } else {
                setIsValid(true);
                setErrorMessage('');
            }
        }
        
        setValue(newValue);
    };

    // Add useEffect to validate parameter changes
    useEffect(() => {
        // Skip validation if value is null or undefined or paramName isn't set yet
        if (value === null || value === undefined || !paramName) return;
        
        const localNode = window.localNode;
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        if (!param) return;
        
        // For RTTTL validation
        if (paramName === "STARTUP_TUNE") {
            setIsValid(validateRtttl(value));
            return;
        }
        
        // For numeric validation
        if (param.fields.value.msg.fields.integer_value !== undefined || 
            param.fields.value.msg.fields.real_value !== undefined) {
            
            // Skip validation for empty strings or non-numeric values
            if (value === '' || isNaN(parseFloat(value))) {
                setIsValid(false);
                return;
            }
            
            const numericValue = parseFloat(value);
            const min = param.fields.min_value.msg && 
                        param.fields.min_value.msg.unionField.name !== 'uavcan.protocol.param.Empty' ? 
                        param.fields.min_value.msg.unionField.value : null;
                        
            const max = param.fields.max_value.msg && 
                        param.fields.max_value.msg.unionField.name !== 'uavcan.protocol.param.Empty' ? 
                        param.fields.max_value.msg.unionField.value : null;
            
            // Validate against min/max if they exist
            if ((min !== null && numericValue < min) || (max !== null && numericValue > max)) {
                setIsValid(false);
                setErrorMessage(`Value must be between ${min !== null ? min : '-∞'} and ${max !== null ? max : '∞'}`);
            } else {
                setIsValid(true);
                setErrorMessage('');
            }
        } else {
            // For boolean and string types, always valid
            setIsValid(true);
            setErrorMessage('');
        }
    }, [value, nodeId, paramIndex, paramName, localNode]);

    // Update the RTTTL editor to remove the problematic helperText
    const renderRTTTLEditor = () => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-end' }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="rtttl-preset-label">Select Preset Tune</InputLabel>
                        <Select
                            labelId="rtttl-preset-label"
                            value={selectedPreset}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                <em>Choose a preset tune</em>
                            </MenuItem>
                            {Object.entries(rtttlPresets).map(([name, tune]) => (
                                <MenuItem key={name} value={tune}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleApplyPreset}
                        disabled={!selectedPreset}
                        sx={{ mb: 1 }}
                    >
                        Apply
                    </Button>
                </Box>
                
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        label="RTTTL Tune"
                        value={value || ""}
                        onChange={(e) => handleValueChange(e.target.value)}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                        placeholder="Format: name:d=duration,o=octave,b=bpm:notes"
                        error={!isValid && value !== ''}
                        // Remove helperText to avoid layout issues
                    />
                    <Tooltip title={isPlaying ? "Stop tune" : "Play tune"}>
                        <IconButton 
                            size="small" 
                            color={isPlaying ? "secondary" : "primary"} 
                            onClick={handlePlayTune}
                            disabled={!value}
                            sx={{ 
                                position: 'absolute', 
                                bottom: '10px', 
                                right: '10px',
                                width: '32px',
                                height: '32px'
                            }}
                        >
                            {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
                
                {/* Add a simple instruction text below the field */}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    Enter RTTTL format tune or select a preset
                </Typography>
                
                <Divider />
                
                <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        RTTTL Format Guide
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" display="block">• d=duration (1=whole, 2=half, 4=quarter, 8=eighth, 16=16th note)</Typography>
                        <Typography variant="caption" display="block">• o=octave (4-7 where 5 is default)</Typography>
                        <Typography variant="caption" display="block">• b=tempo (beats per minute)</Typography>
                        <Typography variant="caption" display="block">• Notes are: c, c#, d, d#, e, f, f#, g, g#, a, a#, b or h</Typography>
                        <Typography variant="caption" display="block">• Example: Beep:d=4,o=5,b=120:c</Typography>
                    </Box>
                </Box>
            </Box>
        );
    };

    // Update the renderValueEditField function to fix layout issues and improve validation
    const renderValueEditField = (min, max) => {
        const param = localNode.nodeParams[nodeId][paramIndex];
        let step;

        // For boolean type
        if (param.fields.value.msg.fields.boolean_value) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Typography variant="body2" sx={{ mr: 2 }}>Enable/Disable:</Typography>
                    <Checkbox 
                        checked={value === 1 || value === true} 
                        onChange={(e) => setValue(e.target.checked ? 1 : 0)} 
                    />
                </Box>
            );
        }
        
        // For string type - return null for normal strings, STARTUP_TUNE is handled separately
        if (param.fields.value.msg.fields.string_value) {
            return null;
        }
        
        // For numeric types
        if (param.fields.value.msg.fields.integer_value) {
            step = 1;
        } else if (param.fields.value.msg.fields.real_value) {
            step = 0.01;
        } else {
            console.error('Unknown value kind');
        }

        // Check if value is outside limits for the error state
        const numericValue = parseFloat(value);
        const isOutOfBounds = 
            (min !== "" && !isNaN(min) && numericValue < min) || 
            (max !== "" && !isNaN(max) && numericValue > max);

        return (
            <TextField
                label="New Value"
                value={value}
                type="number"
                inputProps={{
                    step: step
                }}
                error={isOutOfBounds}
                onChange={(e) => handleValueChange(e.target.value)}
                fullWidth
                margin="dense"
                helperText={isOutOfBounds ? 
                    `Value must be between ${min !== "" ? min : '-∞'} and ${max !== "" ? max : '∞'}` : 
                    null
                }
            />
        );
    };

    if (value === null) return null;

    const localNode = window.localNode;
    let param = localNode.nodeParams[nodeId][paramIndex];
    if (!param) return null;
    if (!param.fields) return null;
    let paramValueField = param.fields.value.msg.unionField;
    let paramMinValue = "";
    if (param.fields.min_value.msg && param.fields.min_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
        paramMinValue = param.fields.min_value.msg.unionField.value;
    }
    let paramMaxValue = "";
    if (param.fields.max_value.msg && param.fields.max_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
        paramMaxValue = param.fields.max_value.msg.unionField.value;
    }
    let paramDefaultValue = "";
    if (param.fields.default_value.msg && param.fields.default_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
        paramDefaultValue = param.fields.default_value.msg.unionField.value;
    }

    const isBoolean = param.fields.value.msg.fields.boolean_value !== undefined;
    const isString = param.fields.value.msg.fields.string_value !== undefined;
    const isRTTTLEditor = paramName === "STARTUP_TUNE";

    const renderParamNameField = (name) => (
        <TextField
            label="Parameter Name"
            value={name || "Unknown"}
            InputProps={{
                readOnly: true,
            }}
            size="small"
            fullWidth
            variant="outlined"
            margin="dense"
        />
    );

    // Replace the renderInfoField function with this enhanced version that handles RTTTL differently
    const renderInfoField = (label, value, isRtttl = false) => (
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            {isRtttl ? (
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={value || ""}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ 
                        mt: 0.5,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                />
            ) : (
                <Typography variant="body2">
                    {value !== undefined && value !== "" && value !== null ? value : "Unknown"}
                </Typography>
            )}
        </Box>
    );

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { minWidth: isRTTTLEditor ? '600px' : '400px' } }}
        >
            <DialogTitle>Edit Parameter</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-end' }}>
                        {renderParamNameField(paramName)}
                        {!isString && !isRTTTLEditor && renderValueEditField(paramMinValue, paramMaxValue)}
                    </Box>
                    
                    {isString && !isRTTTLEditor && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                            <TextField
                                label="String Value"
                                value={value || ""}
                                onChange={(e) => setValue(e.target.value)}
                                fullWidth
                                margin="dense"
                                multiline={Boolean(value && typeof value === 'string' && value.length > 30)}
                                rows={(value && typeof value === 'string' && value.length > 30) ? 3 : 1}
                            />
                        </Box>
                    )}
                    
                    {isRTTTLEditor && renderRTTTLEditor()}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        {paramName === "STARTUP_TUNE" && isString ? (
                            renderInfoField("Current RTTTL", (() => {
                                try {
                                    // Get the binary string value
                                    const binaryString = paramValueField.toString();
                                    
                                    // Convert binary string to Uint8Array
                                    const binaryData = new Uint8Array(binaryString.length);
                                    for (let i = 0; i < binaryString.length; i++) {
                                        binaryData[i] = binaryString.charCodeAt(i);
                                    }
                                    
                                    // Convert to RTTTL format
                                    return AM32_Rtttl.from_am32_startup_melody(binaryData, "Tune");
                                } catch (err) {
                                    console.error("Error converting binary data to RTTTL:", err);
                                    return "Error parsing melody data";
                                }
                            })(), true) // Pass true to indicate this is an RTTTL value
                        ) : (
                            renderInfoField(
                                "Current Value", 
                                isBoolean 
                                    ? (paramValueField.value ? "True" : "False") 
                                    : isString 
                                        ? paramValueField.toString() 
                                        : paramValueField.value
                            )
                        )}
                        {/* Only show default value when not STARTUP_TUNE */}
                        {paramName !== "STARTUP_TUNE" && renderInfoField("Default Value", isBoolean ? (paramDefaultValue ? "True" : "False") : paramDefaultValue)}
                    </Box>
                    
                    {!isBoolean && !isString && !isRTTTLEditor && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            {renderInfoField("Min Value", paramMinValue)}
                            {renderInfoField("Max Value", paramMaxValue)}
                        </Box>
                    )}
                    {errorMessage && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    color="primary" 
                    disabled={!isValid}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditParamModal;