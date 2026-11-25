import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Slider
} from '@mui/material';
import { getParamType, parseNumericParam } from './param_value';
import { renderParamNameField, renderInfoField, getParamValues } from './ParamEditorUtils';

const NumericParamEditor = ({ open, onClose, nodeId, paramIndex, paramName }) => {
    const [value, setValue] = useState(null);
    const localNode = window.localNode;
    const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];

    useEffect(() => {
        if (param) setValue(String(param.fields.value.msg.unionField.value));
    }, [nodeId, paramIndex]);

    if (value === null || !param) return null;
    const { paramValueField, paramMinValue, paramMaxValue, paramDefaultValue } = getParamValues(param);
    const isInteger = getParamType(param.fields.value) === 'integer';
    const parsed = parseNumericParam(value, param);
    const handleSave = () => {
        if (parsed.error) return;
        localNode.setNodeParam(nodeId, paramIndex, parsed.value);
        onClose();
    };

    const renderValueEditField = (min, max) => {
        const showSlider = isInteger && Number.isSafeInteger(min) && Number.isSafeInteger(max) && min < max
            && Number.isSafeInteger(max - min);

        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                    label="New Value"
                    value={value}
                    type={isInteger ? "text" : "number"}
                    inputProps={isInteger ? { inputMode: "numeric" } : { step: "any" }}
                    error={!!parsed.error}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    margin="dense"
                    helperText={parsed.error}
                />
                
                {showSlider && (
                    <Box sx={{ px: 1, mt: 1 }}>
                        <Slider
                            value={parsed.error ? min : Number(parsed.value)}
                            onChange={(_, next) => setValue(String(next))}
                            aria-labelledby="input-slider"
                            min={min}
                            max={max}
                            step={1}
                            marks={generateSliderMarks(min, max)}
                            valueLabelDisplay="auto"
                            sx={{ 
                                color: parsed.error ? 'error.main' : 'primary.main',
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
        
        // If the range is too large, just show min, middle, and max
        if (max - min > 10) {
            const middle = min + Math.round((max - min) / 2);
            return [min, middle, max].map(value => ({ value, label: String(value) }));
        }
        
        // Otherwise show all integer values
        const marks = [];
        for (let i = min; i <= max; i++) {
            marks.push({ value: i, label: i.toString() });
        }
        return marks;
    };

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
                    disabled={!!parsed.error}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NumericParamEditor;