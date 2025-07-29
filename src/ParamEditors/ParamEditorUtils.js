import React from 'react';
import { TextField, Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

// Export properly with named exports
export const renderParamNameField = (name) => (
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

// Export properly with named exports
export const renderInfoField = (label, value, isRtttl = false, handlePlayCallback = null, isPlaying = false) => (
    <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        {isRtttl ? (
            <Box sx={{ position: 'relative' }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
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
                {handlePlayCallback && value && value !== "Error parsing melody data" && (
                    <Tooltip title={isPlaying ? "Stop tune" : "Play tune"}>
                        <IconButton 
                            size="small" 
                            color={isPlaying ? "secondary" : "primary"} 
                            onClick={() => handlePlayCallback(value)}
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
                )}
            </Box>
        ) : (
            <Typography variant="body2">
                {value !== undefined && value !== "" && value !== null ? value : "Unknown"}
            </Typography>
        )}
    </Box>
);

// Export properly with named exports
export const getParamValues = (param) => {
    const paramValueField = param.fields.value.msg.unionField;
    
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
    
    return {
        paramValueField,
        paramMinValue,
        paramMaxValue,
        paramDefaultValue
    };
};