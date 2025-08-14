import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Typography, LinearProgress, Box, Alert
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileServer from './FileServer';

const FirmwareUpdateModal = ({ open, onClose, targetNodeId }) => {
    const [firmwareFile, setFirmwareFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateStatus, setUpdateStatus] = useState(null); // 'idle', 'updating', 'success', 'error'
    const [statusMessage, setStatusMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file extension is .bin or .hex
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'bin' && fileExtension !== 'hex') {
            setUpdateStatus('error');
            setStatusMessage('Invalid file type. Please select a .bin or .hex firmware file.');
            return;
        }
        
        setFirmwareFile(file);
        setUpdateStatus('idle');
        setStatusMessage('');
        
        // Generate a unique path for this firmware file
        const firmwarePath = FileServer.pathKey(file.name);
        console.log(`Generated firmware path key: ${firmwarePath}`);
        
        // Load the file into the FileServer using the generated path
        FileServer.loadFile(file, firmwarePath)
            .then(fileInfo => {
                console.log(`Firmware loaded: ${fileInfo.name}, size: ${fileInfo.size} bytes, path: ${fileInfo.path}`);
                setFileContent(fileInfo);
            })
            .catch(error => {
                console.error('Error loading firmware:', error);
                setUpdateStatus('error');
                setStatusMessage('Failed to load firmware file');
            });
    };

    // Function to read data at a specific offset
    const readDataAtOffset = (offset, length) => {
        if (!fileContent || !fileContent.data) return null;
        
        try {
            const dataView = new DataView(fileContent.data);
            if (offset + length > fileContent.size) {
                console.error('Requested offset+length exceeds file size');
                return null;
            }
            
            // Read bytes and return as hex string
            let hexString = '';
            for (let i = 0; i < length; i++) {
                const byte = dataView.getUint8(offset + i);
                hexString += byte.toString(16).padStart(2, '0');
            }
            return hexString;
        } catch (error) {
            console.error('Error reading data at offset:', error);
            return null;
        }
    };

    const handleUpdate = () => {
        if (!firmwareFile || !fileContent) return;
        
        try {
            // Get the local node reference
            const localNode = window.localNode;
            
            if (!localNode) {
                setUpdateStatus('error');
                setStatusMessage('Local node not available');
                return;
            }
            
            // Update UI state
            setUpdateStatus('updating');
            setStatusMessage('Starting firmware update...');
            setUpdateProgress(0);
            
            // Register a progress callback with the FileServer
            const firmwarePath = fileContent.path;
            FileServer.registerProgressCallback(firmwarePath, (progress, offset, total, eof) => {
                // Update progress in state (0-100%)
                setUpdateProgress(progress * 100);
                
                // Update status message
                setStatusMessage(`Updating firmware: ${Math.round(progress * 100)}% (${offset}/${total} bytes)`);
                
                // When complete
                if (eof) {
                    setUpdateStatus('success');
                    setStatusMessage('Firmware update completed successfully!');
                    
                    // Clean up progress tracking
                    setTimeout(() => {
                        FileServer.unregisterProgressCallback(firmwarePath);
                    }, 2000);
                }
            });
            
            // Begin the firmware update process
            console.log(`Starting firmware update for node ${targetNodeId} with file ${firmwareFile.name}`);
            
            // Call the beginFirmwareUpdate method on the local node
            localNode.beginFirmwareUpdate(
                targetNodeId, 
                firmwarePath,
                (transfer) => {
                    console.log("Firmware update result:", transfer);
                    const msg = transfer.payload;
                    
                    if (!msg || msg.fields.error.value > 0) {
                        // Handle update failure
                        setUpdateStatus('error');
                        setStatusMessage(`Update failed: code: ${msg.fields.error.value} ${msg.fields.optional_error_message.toString() || 'Unknown error'}`);
                        FileServer.unregisterProgressCallback(firmwarePath);
                    } else {
                        setUpdateStatus('updating');
                    }
                }
            );
            
        } catch (error) {
            console.error('Error initiating firmware update:', error);
            setUpdateStatus('error');
            setStatusMessage(`Failed to start update: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <Dialog open={open} onClose={updateStatus === 'updating' ? null : onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Firmware Update</DialogTitle>
            <DialogContent>
                <Typography variant="body2" gutterBottom>
                    Please select the firmware file (.bin|.hex) to upload to node {targetNodeId}.
                </Typography>
                
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                    disabled={updateStatus === 'updating'}
                >
                    Select Firmware File
                    <input
                        type="file"
                        hidden
                        accept=".bin,.hex"
                        onChange={handleFileChange}
                    />
                </Button>
                
                {firmwareFile && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Selected File: {firmwareFile.name}
                        {fileContent && ` (${fileContent.size} bytes)`}
                    </Typography>
                )}
                
                {updateStatus === 'updating' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            {statusMessage || 'Updating firmware...'}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={updateProgress} 
                            sx={{ mt: 1, mb: 2 }} 
                        />
                    </Box>
                )}
                
                {updateStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {statusMessage || 'An error occurred during the update.'}
                    </Alert>
                )}
                
                {updateStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {statusMessage || 'Firmware update completed successfully!'}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                {updateStatus !== 'updating' ? (
                    <>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdate}
                            color="primary" 
                            disabled={!firmwareFile || updateStatus === 'updating'}
                        >
                            Update
                        </Button>
                    </>
                ) : (
                    <Button 
                        color="secondary" 
                        disabled={updateProgress < 100}
                        onClick={onClose}
                    >
                        {updateProgress < 100 ? 'Updating...' : 'Close'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default FirmwareUpdateModal;