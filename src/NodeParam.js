import React, { useState } from 'react';
import { 
    Box, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Typography, Paper, Tooltip, Chip
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import ParamEditorSelector from './ParamEditors/ParamEditorSelector';
import AM32_Rtttl from './am32_rtttl';

const OPCODE_SAVE = 0;
const OPCODE_ERASE = 1;

const NodeParam = ({ nodeId, nodes }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editParamIndex, setEditParamIndex] = useState(null);

    if (!nodeId) return null;
    const node = nodes[nodeId];
    if (!node) return null;

    const handleFetchParams = () => {
        const localNode = window.localNode;
        let currentParamIndex = 0; 
        const callback = (transfer) => {
            const msg = transfer.payload;
            if (msg && msg.fields.name.items.length > 0) {
                if (msg && transfer.destNodeId === localNode.nodeId) {
                    localNode.updateNodeParamsFromResponse(transfer, currentParamIndex);
                    currentParamIndex += 1;
                    localNode.fetchNodeParam(nodeId, currentParamIndex, '', callback); 
                }
            }
        };

        localNode.fetchNodeParam(nodeId, 0, '', callback); 
    };

    const handleEraseParams = () => {
        const localNode = window.localNode;
        localNode.requestUavcanProtocolParamExecuteOpcode(nodeId, OPCODE_ERASE, 0, (transfer) => {
            console.log('Erase response:', transfer);
        });
    }

    const handleSaveParams = () => {
        const localNode = window.localNode;
        localNode.requestUavcanProtocolParamExecuteOpcode(nodeId, OPCODE_SAVE, 0, (transfer) => {
            console.log('Save response:', transfer);
        });
    }

    const handleEditClick = (index) => {
        setEditParamIndex(Number(index))
        setModalOpen(true);
    };

    // Function to get color for parameter type chip
    const getTypeChipColor = (paramType) => {
        switch (paramType) {
            case 'integer': return 'primary';
            case 'real': return 'secondary';
            case 'boolean': return 'success';
            case 'string': return 'info';
            default: return 'default';
        }
    };

    // Function to format boolean values visually
    const formatBooleanValue = (value) => {
        if (value === 'True') {
            return <Chip size="small" label="True" color="success" />;
        } else if (value === 'False') {
            return <Chip size="small" label="False" color="error" />;
        }
        return value;
    };

    const handleDownloadParams = () => {
        const localNode = window.localNode;
        const params = localNode.nodeParams[nodeId];
        
        if (!params) {
            console.error('No parameters to download');
            return;
        }
    
        // Create simple format content (NAME VALUE)
        let content = '';
        
        Object.keys(params).forEach(key => {
            try {
                const param = params[key];
                if (!param || !param.fields) return;
                
                const paramName = param.fields.name.toString();
                let paramValue;
                
                // Determine parameter value based on type
                if (param.fields.value.msg.fields.integer_value !== undefined) {
                    paramValue = param.fields.value.msg.fields.integer_value.value;
                } else if (param.fields.value.msg.fields.real_value !== undefined) {
                    paramValue = param.fields.value.msg.fields.real_value.value;
                } else if (param.fields.value.msg.fields.boolean_value !== undefined) {
                    paramValue = param.fields.value.msg.fields.boolean_value.value === 1 ? 'True' : 'False';
                } else if (param.fields.value.msg.fields.string_value !== undefined) {
                    // Don't quote string values in this format
                    paramValue = param.fields.value.msg.fields.string_value.value.toString();
                } else {
                    paramValue = '';
                }
                
                // Append to content in NAME VALUE format
                content += `${paramName} ${paramValue}\n`;
                
            } catch (err) {
                console.error(`Error formatting parameter at index ${key}:`, err);
            }
        });
    
        // Create a downloadable file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate a filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `dronecan-params-node${nodeId}-${timestamp}.txt`;
        
        // Trigger download and cleanup
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    };

    const renderNodeParamItems = () => {
        const localNode = window.localNode;
        if (!localNode.nodeParams[nodeId]) return null;
        return (
            Object.keys(localNode.nodeParams[nodeId]).map((key) => {
                let param = localNode.nodeParams[nodeId][key];
                if (!param) return null;
                if (!param.fields) return null;
                let paramName = param.fields.name.toString();
                let paramValueDisplay;
                let paramTypeDisplay;
                let paramMinValue = "";
                let paramMinValueDisplay = "";
                if (param.fields.min_value.msg && param.fields.min_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
                    paramMinValue = typeof param.fields.min_value.msg.unionField.value === 'object' ? 
                        JSON.stringify(param.fields.min_value.msg.unionField.value) : 
                        param.fields.min_value.msg.unionField.value;
                }
                let paramMaxValue = "";
                let paramMaxValueDisplay = "";
                if (param.fields.max_value.msg && param.fields.max_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
                    paramMaxValue = typeof param.fields.max_value.msg.unionField.value === 'object' ? 
                        JSON.stringify(param.fields.max_value.msg.unionField.value) : 
                        param.fields.max_value.msg.unionField.value;
                }
                let paramDefaultValue = "";
                let paramDefaultValueDisplay = "";
                if (param.fields.default_value.msg && param.fields.default_value.msg.unionField.name !== 'uavcan.protocol.param.Empty') {
                    paramDefaultValue = typeof param.fields.default_value.msg.unionField.value === 'object' ? 
                        JSON.stringify(param.fields.default_value.msg.unionField.value) : 
                        param.fields.default_value.msg.unionField.value;
                }
                
                // Determine parameter type by checking which field exists
                if (param.fields.value.msg.fields.integer_value !== undefined) {
                    paramTypeDisplay = 'integer';
                    paramValueDisplay = param.fields.value.msg.fields.integer_value.value;
                    paramMinValueDisplay = paramMinValue;
                    paramMaxValueDisplay = paramMaxValue;
                    paramDefaultValueDisplay = paramDefaultValue;
                } else if (param.fields.value.msg.fields.real_value !== undefined) {
                    paramTypeDisplay = 'real';
                    paramValueDisplay = param.fields.value.msg.fields.real_value.value;
                    paramMinValueDisplay = paramMinValue;
                    paramMaxValueDisplay = paramMaxValue;
                    paramDefaultValueDisplay = paramDefaultValue;
                } else if (param.fields.value.msg.fields.boolean_value !== undefined) {
                    paramTypeDisplay = 'boolean';
                    if (param.fields.value.msg.fields.boolean_value.value === 0) {
                        paramValueDisplay = 'Disabled';
                    } else if (param.fields.value.msg.fields.boolean_value.value === 1) {
                        paramValueDisplay = 'Enabled';
                    }

                    if (paramDefaultValue === 0) {
                        paramDefaultValueDisplay = 'Disabled';
                    } else {
                        paramDefaultValueDisplay = 'Enabled';
                    }
                    paramMinValueDisplay = "";
                    paramMaxValueDisplay = "";

                } else if (param.fields.value.msg.fields.string_value !== undefined) {
                    paramTypeDisplay = 'string';
                    let stringValue = param.fields.value.msg.fields.string_value.toString();
                    
                    // Special handling for STARTUP_TUNE parameter
                    if (paramName === "STARTUP_TUNE") {
                        try {
                            // Convert binary string to Uint8Array
                            const binaryData = new Uint8Array(stringValue.length);
                            for (let i = 0; i < stringValue.length; i++) {
                                binaryData[i] = stringValue.charCodeAt(i);
                            }
                            
                            // Convert to RTTTL format
                            const rtttlString = AM32_Rtttl.from_am32_startup_melody(binaryData, "Tune");
                            paramValueDisplay = rtttlString;
                        } catch (err) {
                            console.error("Error converting STARTUP_TUNE to RTTTL:", err);
                            paramValueDisplay = stringValue;
                        }
                    } else {
                        paramValueDisplay = stringValue;
                    }
                } else {
                    paramTypeDisplay = 'empty';
                    paramValueDisplay = '';
                }

                
                return (
                    <TableRow
                        key={key}
                        sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            cursor: 'pointer'
                        }}
                        onClick={() => handleEditClick(key)}
                    >
                        <TableCell>{key}</TableCell>
                        <TableCell>
                            <Tooltip title={paramName} placement="top-start">
                                <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {paramName}
                                </Typography>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Chip 
                                size="small" 
                                label={paramTypeDisplay} 
                                color={getTypeChipColor(paramTypeDisplay)}
                                sx={{ minWidth: 60 }}
                            />
                        </TableCell>
                        <TableCell>
                            <Tooltip title={paramValueDisplay} placement="top">
                                <Box sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {paramValueDisplay}
                                </Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title={String(paramDefaultValue)} placement="top">
                                <Typography noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {paramDefaultValueDisplay === "" ? "-" : String(paramDefaultValueDisplay)}
                                </Typography>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Typography noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {paramMinValueDisplay === "" ? "-" : String(paramMinValueDisplay)}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {paramMaxValueDisplay === "" ? "-" : String(paramMaxValueDisplay)}
                            </Typography>
                        </TableCell>
                        <TableCell padding="none" align="center">
                            <Tooltip title="Edit Parameter">
                                <EditIcon fontSize="small" color="primary" />
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                );
            })
        );
    };

    const renderNodeParams = () => {
        return (
            <TableContainer sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto', flexGrow: 1 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{width: '5%'}}>Idx</TableCell>
                            <TableCell sx={{width: '28%'}}>Name</TableCell>
                            <TableCell sx={{width: '10%'}}>Type</TableCell>
                            <TableCell sx={{width: '17%'}}>Value</TableCell>
                            <TableCell sx={{width: '10%'}}>Default</TableCell>
                            <TableCell sx={{width: '10%'}}>Min</TableCell>
                            <TableCell sx={{width: '10%'}}>Max</TableCell>
                            <TableCell sx={{width: '10%'}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderNodeParamItems()}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            component={Paper}
            p={0.5}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Typography
                    sx={{ width: 80, mr: 2, ml: 0.5 }}
                    variant="caption"
                >
                    Parameters
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'space-between', flexDirection: 'row', border: 1, borderColor: 'grey.500', borderRadius: 1, p: 0.5, mr: 2 }}>
                    <Button
                        onClick={handleFetchParams}
                        variant="contained"
                        sx={{ mr: 1 }}
                        startIcon={<SyncIcon />}
                    >
                        Fetch All
                    </Button>
                    <Button
                        onClick={handleSaveParams}
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        startIcon={<SaveIcon />}
                        disabled={!localNode.nodeParams[nodeId] || Object.keys(localNode.nodeParams[nodeId]).length === 0}
                    >
                        Store All
                    </Button>
                    <Button
                        onClick={handleEraseParams}
                        variant="contained"
                        color="warning"
                        startIcon={<AutoFixNormalIcon />}
                    >
                        Erase All
                    </Button>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', border: 1, borderColor: 'grey.500', borderRadius: 1, p: 0.5 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownloadParams}
                        disabled={!localNode.nodeParams[nodeId] || Object.keys(localNode.nodeParams[nodeId]).length === 0}
                    >
                        Download
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileUploadIcon />}
                        disabled={!nodeId} // Disable Load button if no node is selected
                    >
                        Load
                    </Button>
                </Box>
            </Box>
            {renderNodeParams()}
            <ParamEditorSelector 
                open={modalOpen} 
                onClose={() => setModalOpen(false)}
                nodeId={nodeId}
                paramIndex={editParamIndex}
            />
        </Box>
    );
};

export default NodeParam;