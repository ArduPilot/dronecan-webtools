import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Typography, Select, MenuItem,
    FormControl, InputLabel, Divider, IconButton, Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { renderParamNameField, renderInfoField, getParamValues } from './ParamEditorUtils';
import AM32_Rtttl from '../am32_rtttl';

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

const StringParamEditor = ({ open, onClose, nodeId, paramIndex, paramName }) => {
    const [value, setValue] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCurrentTunePlaying, setIsCurrentTunePlaying] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [previewTune, setPreviewTune] = useState('');
    
    const isRTTLEditor = paramName === "STARTUP_TUNE";
    
    // Load initial value
    useEffect(() => {
        const localNode = window.localNode;
        if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return;
        
        const param = localNode.nodeParams[nodeId][paramIndex];
        const paramValueField = param.fields.value.msg.unionField;
        
        // Special handling for STARTUP_TUNE parameter
        if (paramName === "STARTUP_TUNE") {
            try {
                // Get the binary string value
                const binaryString = paramValueField.toString();
                
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
            setValue(paramValueField.toString());
        }
    }, [nodeId, paramIndex, paramName]);

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            if (isPlaying) {
                AM32_Rtttl.stopMelody();
            }
        };
    }, [isPlaying]);

    // Use effect to register melody end listener
    useEffect(() => {
        const melodyEndListener = () => {
            setIsPlaying(false);
            setIsCurrentTunePlaying(false);
        };
        
        AM32_Rtttl.addMelodyEndListener(melodyEndListener);
        
        // Clean up on unmount
        return () => {
            AM32_Rtttl.removeMelodyEndListener(melodyEndListener);
            AM32_Rtttl.stopMelody();
        };
    }, []);

    const validateRtttl = (rtttlString) => {
        console.log("Validating RTTTL:", rtttlString);
        
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
        
        setErrorMessage(''); // Clear error if valid
        return true;
    };

    const handleValueChange = (newValue) => {
        setValue(newValue);
        
        if (isRTTLEditor) {
            setIsValid(validateRtttl(String(newValue)));
        } else {
            setIsValid(true);
        }
    };

    const handlePlayTune = () => {
        // If already playing, stop the melody
        if (isPlaying) {
            AM32_Rtttl.stopMelody();
            return; // The melody end listener will reset the state
        }

        const tuneToPlay = value || '';
        try {
            // First validate that the tune has the basic RTTTL format
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
            
            // Set up a timeout to detect when tune ends
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

    // Handle playing the current tune from the "Current RTTTL" field
    const handlePlayCurrentTune = (tune) => {
        if (isCurrentTunePlaying) {
            AM32_Rtttl.stopMelody();
            setIsCurrentTunePlaying(false);
            return;
        }

        try {
            // Validate that the tune has the basic RTTTL format
            if (!tune || !tune.includes(':') || tune.split(':').length !== 3) {
                setErrorMessage('Invalid RTTTL format in current tune');
                return;
            }
            
            // Stop any playing tune
            AM32_Rtttl.stopMelody();
            
            // Reset other playing state
            setIsPlaying(false);
            
            // Play the current tune
            AM32_Rtttl.playMelody(tune);
            setIsCurrentTunePlaying(true);
        } catch (err) {
            console.error("Error playing current tune:", err);
            setErrorMessage(`Error playing current tune: ${err.message || 'Unknown error'}`);
        }
    };

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
    
    const handleApplyPreset = () => {
        if (selectedPreset) {
            setValue(selectedPreset);
            setSelectedPreset(""); // Reset selection after applying
            setIsValid(true);
            setErrorMessage('');
        }
    };

    const renderRTTLEditor = () => {
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
                        helperText={!isValid && errorMessage ? errorMessage : "Enter RTTTL format tune or select a preset"}
                        InputProps={{
                            // Add some right padding to ensure text doesn't go under the button
                            sx: { pr: 5 }
                        }}
                    />
                    {value && (
                        <Tooltip title={isPlaying ? "Stop tune" : "Play tune"}>
                            <IconButton 
                                size="small" 
                                color={isPlaying ? "secondary" : "primary"} 
                                onClick={handlePlayTune}
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: '50%', // Center vertically in the input area
                                    transform: 'translateY(50%)', // Adjust for perfect centering
                                    right: '12px', // Position from right edge
                                    width: '32px',
                                    height: '32px',
                                    zIndex: 1 // Ensure button is above text
                                }}
                            >
                                {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                
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

    const handleSave = () => {
        const localNode = window.localNode;
        let valueToSave = value;
        let conversionSuccessful = true;
        
        // If this is the STARTUP_TUNE parameter, convert RTTTL string to byte array
        if (isRTTLEditor) {
            try {
                // Validate RTTTL string format
                const rtttlValue = value || "";
                const isValidFormat = rtttlValue && rtttlValue.includes(':') && rtttlValue.split(':').length === 3;
                
                let result; // Declare result variable outside the if/else blocks
                
                if (!isValidFormat) {
                    // Warn user but continue with a default tune
                    setErrorMessage('Warning: Invalid RTTTL format! Using a default empty tune instead.');
                    setIsValid(false);
                    conversionSuccessful = false;
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
                setIsValid(false);
                conversionSuccessful = false;
                
                // Provide an empty binary string (all zeros) as fallback
                const emptyArray = new Uint8Array(128);
                valueToSave = String.fromCharCode.apply(null, emptyArray);
            }
        }

        // Only close and save if conversion was successful
        if (conversionSuccessful) {
            localNode.setNodeParam(nodeId, paramIndex, valueToSave);
            onClose();
        }
    };

    if (value === null) return null;

    const localNode = window.localNode;
    const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
    if (!param || !param.fields) return null;
    
    const { paramValueField } = getParamValues(param);

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { minWidth: isRTTLEditor ? '600px' : '400px' } }}
        >
            <DialogTitle>{isRTTLEditor ? "Edit Tune Parameter" : "Edit String Parameter"}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {renderParamNameField(paramName)}
                    
                    {!isRTTLEditor && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                            <TextField
                                label="String Value"
                                value={value || ""}
                                onChange={(e) => handleValueChange(e.target.value)}
                                fullWidth
                                margin="dense"
                                multiline={Boolean(value && typeof value === 'string' && value.length > 30)}
                                rows={(value && typeof value === 'string' && value.length > 30) ? 3 : 1}
                                error={!isValid}
                                helperText={!isValid && errorMessage ? errorMessage : null}
                            />
                        </Box>
                    )}
                    
                    {isRTTLEditor && renderRTTLEditor()}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        {isRTTLEditor ? (
                            renderInfoField(
                                "Current RTTTL", 
                                (() => {
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
                                })(), 
                                true,
                                handlePlayCurrentTune,
                                isCurrentTunePlaying
                            )
                        ) : (
                            renderInfoField("Current Value", paramValueField.toString())
                        )}
                    </Box>
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

export default StringParamEditor;