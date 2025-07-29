import React from 'react';
import NumberParamEditor from './NumericParamEditor';
import BooleanParamEditor from './BooleanParamEditor';
import StringParamEditor from './StringParamEditor';

const ParamEditorSelector = ({ open, onClose, nodeId, paramIndex }) => {
    if (!open || paramIndex === null) return null;
    
    const localNode = window.localNode;
    if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return null;
    
    const param = localNode.nodeParams[nodeId][paramIndex];
    const paramName = param.fields.name.toString();
    
    // Determine parameter type
    const isBoolean = param.fields.value.msg.fields.boolean_value !== undefined;
    const isString = param.fields.value.msg.fields.string_value !== undefined;
    const isNumeric = !isBoolean && !isString;
    
    if (isBoolean) {
        return <BooleanParamEditor 
                 open={open} 
                 onClose={onClose} 
                 nodeId={nodeId} 
                 paramIndex={paramIndex} 
                 paramName={paramName} 
               />;
    }
    
    if (isString) {
        return <StringParamEditor 
                 open={open} 
                 onClose={onClose} 
                 nodeId={nodeId} 
                 paramIndex={paramIndex} 
                 paramName={paramName} 
               />;
    }
    
    return <NumberParamEditor 
             open={open} 
             onClose={onClose} 
             nodeId={nodeId} 
             paramIndex={paramIndex} 
             paramName={paramName} 
           />;
};

export default ParamEditorSelector;