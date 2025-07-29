import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Typography, Slider, InputAdornment
} from '@mui/material';
import { renderParamNameField, renderInfoField, getParamValues } from './ParamEditorUtils';

const NumericParamEditor = ({ open, onClose, nodeId, paramIndex, paramName }) => {
    const [value, setValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isValid, setIsValid] = useState(true);
    
    // Load initial value
    useEffect(() => {
        const localNode = window.localNode;
        if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return;
        
        const param = localNode.nodeParams[nodeId][paramIndex];
        const paramValueField = param.fields.value.msg.unionField;
        setValue(paramValueField.value);
    }, [nodeId, paramIndex]);

    // Handle value change with validation
    const handleValueChange = (newValue) => {
        const localNode = window.localNode;
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        
        if (!param) {
            setValue(newValue);
            return;
        }
        
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
        
        setValue(newValue);
    };

    // Handle slider change
    const handleSliderChange = (event, newValue) => {
        handleValueChange(newValue);
    };

    // Validation effect
    useEffect(() => {
        if (value === null || value === undefined) return;
        
        const localNode = window.localNode;
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        if (!param) return;
            
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
    }, [value, nodeId, paramIndex]);

    // Handle save
    const handleSave = () => {
        const localNode = window.localNode;
        
        // Ensure value is properly parsed as a number before saving
        const numericValue = parseFloat(value);
        
        // For integer parameters, ensure we save an integer
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        const isInteger = param?.fields.value.msg.fields.integer_value !== undefined;
        
        const valueToSave = isInteger ? Math.round(numericValue) : numericValue;
        localNode.setNodeParam(nodeId, paramIndex, valueToSave);
        onClose();
    };

    // Render the edit field with validation
    const renderValueEditField = (min, max) => {
        const localNode = window.localNode;
        if (!localNode?.nodeParams?.[nodeId]?.[paramIndex]) return null;
        
        const param = localNode.nodeParams[nodeId][paramIndex];
        const isInteger = param.fields.value.msg.fields.integer_value !== undefined;
        const step = isInteger ? 1 : 0.01;

        // Check if value is outside limits for the error state
        const numericValue = parseFloat(value);
        const isOutOfBounds = 
            (min !== "" && !isNaN(min) && numericValue < min) || 
            (max !== "" && !isNaN(max) && numericValue > max);
            
        // Determine if we should show a slider (only for integers with defined min and max)
        const showSlider = isInteger && 
                          min !== "" && !isNaN(parseFloat(min)) && 
                          max !== "" && !isNaN(parseFloat(max))

        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                    label="New Value"
                    value={value}
                    type="number"
                    inputProps={{ step }}
                    error={isOutOfBounds}
                    onChange={(e) => handleValueChange(e.target.value)}
                    fullWidth
                    margin="dense"
                    helperText={isOutOfBounds ? 
                        `Value must be between ${min !== "" ? min : '-∞'} and ${max !== "" ? max : '∞'}` : 
                        null
                    }
                />
                
                {showSlider && (
                    <Box sx={{ px: 1, mt: 1 }}>
                        <Slider
                            value={parseFloat(value) || parseFloat(min) || 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            min={parseFloat(min)}
                            max={parseFloat(max)}
                            step={1}
                            marks={generateSliderMarks(min, max)}
                            valueLabelDisplay="auto"
                            sx={{ 
                                color: isOutOfBounds ? 'error.main' : 'primary.main',
                                '& .MuiSlider-thumb': {
                                    height: 24,
                                    width: 24,
                                },
                                '& .MuiSlider-valueLabel': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>
        );
    };

    // Generate marks for the slider
    const generateSliderMarks = (min, max) => {
        const minVal = parseFloat(min);
        const maxVal = parseFloat(max);
        
        // If the range is too large, just show min, middle, and max
        if (maxVal - minVal > 10) {
            return [
                { value: minVal, label: minVal.toString() },
                { value: Math.round((minVal + maxVal) / 2), label: Math.round((minVal + maxVal) / 2).toString() },
                { value: maxVal, label: maxVal.toString() }
            ];
        }
        
        // Otherwise show all integer values
        const marks = [];
        for (let i = minVal; i <= maxVal; i++) {
            marks.push({ value: i, label: i.toString() });
        }
        return marks;
    };

    if (value === null) return null;

    const localNode = window.localNode;
    const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
    if (!param || !param.fields) return null;
    
    const { paramValueField, paramMinValue, paramMaxValue, paramDefaultValue } = getParamValues(param);

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { minWidth: '450px' } }}>
            <DialogTitle>Edit Numeric Parameter</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {/* Parameter name in its own row */}
                    {renderParamNameField(paramName)}
                    
                    {/* Value editor with potential slider in its own row */}
                    {renderValueEditField(paramMinValue, paramMaxValue)}
                    
                    {/* Current & Default values in their own row */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: 2,
                        bgcolor: 'action.hover', 
                        p: 1.5, 
                        borderRadius: 1
                    }}>
                        {renderInfoField("Current Value", paramValueField.value)}
                        {renderInfoField("Default Value", paramDefaultValue)}
                    </Box>
                    
                    {/* Min & Max values in their own row */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: 2,
                        bgcolor: 'action.hover', 
                        p: 1.5, 
                        borderRadius: 1
                    }}>
                        {renderInfoField("Min Value", paramMinValue)}
                        {renderInfoField("Max Value", paramMaxValue)}
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

export default NumericParamEditor;