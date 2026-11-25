import React, { useEffect, useReducer, useState } from 'react';
import { 
    Box, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Typography, Paper, Chip
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import ParamEditorSelector from './ParamEditors/ParamEditorSelector';
import { getParamType, getParamValue } from './ParamEditors/param_value';

const OPCODE_SAVE = 0;
const OPCODE_ERASE = 1;

const NodeParam = ({ nodeId, nodes }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editParamIndex, setEditParamIndex] = useState(null);
    const [, refreshParams] = useReducer(revision => revision + 1, 0);
    const localNode = window.localNode;

    useEffect(() => {
        if (!localNode || !nodeId) return;
        const handleNodeParams = (sourceNodeId) => {
            if (sourceNodeId === Number(nodeId)) refreshParams();
        };
        localNode.on('node-params', handleNodeParams);
        return () => localNode.off('node-params', handleNodeParams);
    }, [localNode, nodeId]);

    if (!localNode || !nodeId || !nodes[nodeId]) return null;

    const parameters = Object.entries(localNode.nodeParams[nodeId] ?? {});
    const count = parameters.length;
    const countLabel = `${count} ${count === 1 ? 'parameter' : 'parameters'}`;
    const fetchStatus = localNode.paramFetchStatus?.[nodeId];
    let fetchMessage;
    if (fetchStatus?.phase === 'loading') {
        fetchMessage = `Fetching parameters… ${count} received.`;
    } else if (fetchStatus?.phase === 'retrying') {
        fetchMessage = `Retrying parameter index ${fetchStatus.index} (attempt ${fetchStatus.attempt} of ${fetchStatus.maxAttempts}). ${count} received.`;
    } else if (fetchStatus?.phase === 'complete') {
        fetchMessage = count ? `Fetch complete. Received ${countLabel}.` : 'Fetch complete. No parameters reported.';
    } else if (fetchStatus?.phase === 'failed') {
        fetchMessage = `Fetch failed. Received ${countLabel} before the failure.`;
        if (fetchStatus.attempt > 1) fetchMessage += ` Index ${fetchStatus.index}, ${fetchStatus.attempt} attempts.`;
        if (fetchStatus.error) fetchMessage += ` ${fetchStatus.error}`;
    }

    const handleFetchParams = () => {
        setModalOpen(false);
        setEditParamIndex(null);
        localNode.fetchAllNodeParams(nodeId);
    };

    const handleEraseParams = () => {
        localNode.requestUavcanProtocolParamExecuteOpcode(nodeId, OPCODE_ERASE, 0, (transfer) => {
            console.log('Erase response:', transfer);
        });
    }

    const handleSaveParams = () => {
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

    const handleDownloadParams = () => {
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
                const value = getParamValue(param.fields.value, paramName);
                const paramValue = getParamType(param.fields.value) === 'boolean'
                    ? (value ? 'True' : 'False') : value ?? '';

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
        return (
            parameters.map(([key, param]) => {
                if (!param) return null;
                if (!param.fields) return null;
                const paramName = param.fields.name.toString();
                const paramTypeDisplay = getParamType(param.fields.value);
                const displayValue = compound => {
                    const value = getParamValue(compound, paramName);
                    if (value === null) return '';
                    if (getParamType(compound) === 'boolean') return value ? 'Enabled' : 'Disabled';
                    return String(value);
                };
                const paramValueDisplay = displayValue(param.fields.value);
                const paramMinValueDisplay = displayValue(param.fields.min_value);
                const paramMaxValueDisplay = displayValue(param.fields.max_value);
                const paramDefaultValueDisplay = displayValue(param.fields.default_value);

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
                            <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {paramName}
                            </Typography>
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
                            <Box sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {paramValueDisplay}
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Typography noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {paramDefaultValueDisplay === "" ? "-" : String(paramDefaultValueDisplay)}
                            </Typography>
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
                        <TableCell padding="none" align="center" aria-label="Edit Parameter">
                            <EditIcon fontSize="small" color="primary" />
                        </TableCell>
                    </TableRow>
                );
            })
        );
    };

    const renderNodeParams = () => {
        return (
            <TableContainer sx={{ height: '5rem', flexGrow: 1, flexShrink: 0, overflow: 'auto' }}>
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
                flex: '1 0 auto',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
            }}
            component={Paper}
            p={0.5}
        >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 0.5, justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                        disabled={count === 0}
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
                        disabled={count === 0}
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
            {fetchMessage && (
                <Typography
                    variant="caption"
                    role="status"
                    color={fetchStatus.phase === 'failed' ? 'error.main' : 'text.secondary'}
                    sx={{ px: 0.5, pt: 0.5, flexShrink: 0, overflowWrap: 'anywhere' }}
                >
                    {fetchMessage}
                </Typography>
            )}
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
