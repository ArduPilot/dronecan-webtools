/***
    Author: Huibean Luo <huibean.luo@vimdrones.com>
***/

const isDict = (obj) => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

export function toYaml(msgObj) {
    if (!msgObj) return '';
    
    let yamlText = '';
    // Process all properties that are not functions
    Object.keys(msgObj).forEach(key => {
        if (typeof msgObj[key] !== 'function') {
            yamlText += getMsgObjText(msgObj, key, "    ");
        }
    });
    
    return yamlText;

    function getMsgObjText(msgObj, key, tab) {
        let localText = ''; 
        
        if (typeof msgObj[key] !== 'function') {
            if (isDict(msgObj[key])) {
                localText += `${key}:\n`;
                Object.keys(msgObj[key]).forEach(subKey => {
                    if (typeof msgObj[key][subKey] !== 'function') {
                        localText += tab;
                        localText += getFieldItems(msgObj[key], subKey, tab + "    ");
                    }
                });
            } else {
                localText += getFieldItems(msgObj, key, tab);
            }
        } 
        return localText; 
    }

    function getFieldItems(msgObj, key, tab = "") {
        let constant = "";
        let text = '';
        
        // Get constant value if available
        if (msgObj.getConstant && typeof msgObj.getConstant === 'function') {
            try {
                const constValue = msgObj.getConstant(key);
                if (constValue) {
                    constant = `  # ${constValue}`;
                }
            } catch (e) {}
        }
        
        // Handle arrays
        if (Array.isArray(msgObj[key])) {
            if (msgObj[key].length > 0 && isDict(msgObj[key][0])) {
                text += `${key}:${constant}\n`;
                
                msgObj[key].forEach((item) => {
                    text += `${tab}    - `;
                    
                    if (item && typeof item === 'object') {
                        text += '\n';
                        
                        let objToProcess = item;
                        if (typeof item.toObj === 'function') {
                            objToProcess = item.toObj();
                        }
                        
                        for (const prop in objToProcess) {
                            if (typeof objToProcess[prop] !== 'function') {
                                let propConstant = "";
                                let value = objToProcess[prop];
                                
                                if (item.getConstant && typeof item.getConstant === 'function') {
                                    try {
                                        const constValue = item.getConstant(prop);
                                        if (constValue) {
                                            propConstant = `  # ${constValue}`;
                                        }
                                    } catch (e) {}
                                }
                                
                                if (!propConstant && item._parent && item._parent.getConstant) {
                                    try {
                                        const parentConstant = item._parent.getConstant(prop);
                                        if (parentConstant) {
                                            propConstant = `  # ${parentConstant}`;
                                        }
                                    } catch (e) {}
                                }
                                
                                if (typeof value === 'string') {
                                    value = `"${value}"`;
                                }
                                
                                text += `${tab}        ${prop}: ${value}${propConstant}\n`;
                            }
                        }
                    } else {
                        text += `${item}\n`;
                    }
                });
            } else {
                text += `${key}: [${msgObj[key].join(', ')}]${constant}\n`;
            }
        } else {
            // Format simple values
            let value = msgObj[key];
            if (typeof value === 'string') {
                value = `"${value}"`;
            }
            text += `${key}: ${value}${constant}\n`;
        }
        
        return text;
    }
}

export function toJson(msgObj, indent = 2) {
    if (!msgObj) return '';
    
    try {
        // First try to use toObj if available
        const objToConvert = typeof msgObj.toObj === 'function' 
            ? msgObj.toObj() 
            : msgObj;
        
        // Filter out functions since they can't be serialized
        const filtered = JSON.parse(JSON.stringify(objToConvert, (key, value) => {
            return typeof value === 'function' ? undefined : value;
        }));
        
        return JSON.stringify(filtered, null, indent);
    } catch (e) {
        console.error('Error converting message to JSON:', e);
        return `{"error": "Failed to convert to JSON: ${e.message}"}`;
    }
}