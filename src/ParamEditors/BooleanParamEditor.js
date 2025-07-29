import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Box, Typography, Switch, FormControlLabel
} from '@mui/material';
import { renderParamNameField, renderInfoField, getParamValues } from './ParamEditorUtils';

const BooleanParamEditor = ({ open, onClose, nodeId, paramIndex, paramName }) => {
    const [value, setValue] = useState(null);
    
    // Load initial value
    useEffect(() => {
        const localNode = window.localNode;
        if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return;
        
        const param = localNode.nodeParams[nodeId][paramIndex];
        const paramValueField = param.fields.value.msg.unionField;
        
        setValue(Boolean(paramValueField.value));
    }, [nodeId, paramIndex, paramName]);

    const handleValueChange = (event) => {
        setValue(event.target.checked);
    };

    const handleSave = () => {
        const localNode = window.localNode;
        localNode.setNodeParam(nodeId, paramIndex, value ? 1 : 0);
        onClose();
    };

    if (value === null) return null;

    const localNode = window.localNode;
    const param = localNode?.nodeParams?.[nodeId]?.[paramIndex];
    if (!param || !param.fields) return null;
    
    const { paramValueField, paramDefaultValue } = getParamValues(param);

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            sx={{ '& .MuiDialog-paper': { minWidth: '400px' } }}
        >
            <DialogTitle>Edit Boolean Parameter</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 2}}>
                        {renderParamNameField(paramName)}
                        
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', my: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={value}
                                        onChange={handleValueChange}
                                        color="primary"
                                    />
                                }
                                label={value ? "Enabled" : "Disabled"}
                            />
                        </Box>
                    </Box>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: 2,
                        bgcolor: 'action.hover', 
                        p: 1.5, 
                        borderRadius: 1
                    }}>
                        {renderInfoField("Current Value", paramValueField.value ? "Enabled" : "Disabled")}
                        {paramDefaultValue !== "" && renderInfoField("Default Value", Boolean(paramDefaultValue) ? "Enabled" : "Disabled")}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BooleanParamEditor;