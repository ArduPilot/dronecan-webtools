import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, Typography
} from '@mui/material';
import { renderParamNameField, renderInfoField, getParamValues } from './ParamEditorUtils';

const NumberParamEditor = ({ open, onClose, nodeId, paramIndex, paramName }) => {
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
    }, [nodeId, paramIndex, paramName]);

    const handleValueChange = (newValue) => {
        setValue(newValue);
        
        const localNode = window.localNode;
        const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
        if (!param) {
            setIsValid(true);
            setErrorMessage('');
            return;
        }
        
        // Skip validation for empty strings or non-numeric values during typing
        if (newValue === '' || isNaN(parseFloat(newValue))) {
            setIsValid(false);
            setErrorMessage('Value must be a number');
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
    };

    const handleSave = () => {
        const localNode = window.localNode;
        localNode.setNodeParam(nodeId, paramIndex, parseFloat(value));
        onClose();
    };

    if (value === null) return null;

    const localNode = window.localNode;
    const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
    if (!param || !param.fields) return null;
    
    const { paramValueField, paramMinValue, paramMaxValue, paramDefaultValue } = getParamValues(param);
    
    // Determine step value based on parameter type
    let step;
    if (param.fields.value.msg.fields.integer_value !== undefined) {
        step = 1;
    } else if (param.fields.value.msg.fields.real_value !== undefined) {
        step = 0.01;
    } else {
        step = 1;
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { minWidth: '400px' } }}
        >
            <DialogTitle>Edit Number Parameter</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {renderParamNameField(paramName)}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <TextField
                            label="New Value"
                            value={value}
                            type="number"
                            inputProps={{ step: step }}
                            onChange={(e) => handleValueChange(e.target.value)}
                            fullWidth
                            margin="dense"
                            error={!isValid}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        {renderInfoField("Current Value", paramValueField.value)}
                        {paramMinValue !== "" && renderInfoField("Min Value", paramMinValue)}
                        {paramMaxValue !== "" && renderInfoField("Max Value", paramMaxValue)}
                        {paramDefaultValue !== "" && renderInfoField("Default Value", paramDefaultValue)}
                    </Box>
                    
                    {errorMessage && (
                        <Typography color="error" variant="caption">
                            {errorMessage}
                        </Typography>
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

export default NumberParamEditor;