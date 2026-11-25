import React from 'react';
import { getParamType } from './param_value';
import NumberParamEditor from './NumericParamEditor';
import BooleanParamEditor from './BooleanParamEditor';
import StringParamEditor from './StringParamEditor';

const ParamEditorSelector = ({ open, onClose, nodeId, paramIndex }) => {
    if (!open || paramIndex === null) return null;
    
    const localNode = window.localNode;
    if (!localNode?.nodeParams?.[nodeId] || !localNode.nodeParams[nodeId][paramIndex]) return null;
    
    const param = localNode.nodeParams[nodeId][paramIndex];
    const paramName = param.fields.name.toString();
    
    const type = getParamType(param.fields.value);
    if (type === 'empty') return null;
    if (type === 'boolean') {
        return <BooleanParamEditor 
                 open={open} 
                 onClose={onClose} 
                 nodeId={nodeId} 
                 paramIndex={paramIndex} 
                 paramName={paramName} 
               />;
    }
    
    if (type === 'string') {
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