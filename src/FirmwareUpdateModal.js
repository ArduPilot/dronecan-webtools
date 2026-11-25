import React, { useEffect, useRef, useState } from 'react';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    LinearProgress, Typography
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileServer from './FileServer';
import { uavcan_protocol_NodeStatus } from './dronecan/dsdl';

const MODE = uavcan_protocol_NodeStatus.CONSTANTS.mode;
const FILE_READ_TIMEOUT_MS = 15_000;
const VERSION_CHECK_TIMEOUT_MS = 30_000;

function stopAttempt(attemptRef) {
    const attempt = attemptRef.current;
    if (!attempt) return;
    attemptRef.current = null;
    clearTimeout(attempt.timer);
    FileServer.stopTransfer(attempt.path);
    attempt.node.off('uavcan.protocol.NodeStatus', attempt.onNodeStatus);
    if (attempt.beginRequest) attempt.node.cancelRequest(attempt.beginRequest);
    if (attempt.versionRequest) attempt.node.cancelRequest(attempt.versionRequest);
    return attempt;
}

const FirmwareUpdateModal = ({ open, onClose, targetNodeId }) => {
    const [selection, setSelection] = useState(null);
    const [update, setUpdate] = useState(null);
    const selectionGeneration = useRef(0);
    const attemptRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        setSelection(null);
        setUpdate(null);
        const localNode = window.localNode;
        const handleSessionChange = () => {
            selectionGeneration.current++;
            setSelection(null);
            const attempt = stopAttempt(attemptRef);
            if (!attempt) return;
            setUpdate(attempt.complete
                ? { phase: 'complete', message: `Upload complete. The connection changed before WebTools could read node ${targetNodeId}’s firmware version.` }
                : { phase: 'error', message: 'The connection or CAN bus changed during the firmware transfer.' });
        };
        localNode?.on('session-change', handleSessionChange);
        return () => {
            selectionGeneration.current++;
            stopAttempt(attemptRef);
            localNode?.off('session-change', handleSessionChange);
        };
    }, [open, targetNodeId]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || attemptRef.current) return;
        event.target.value = '';
        const generation = ++selectionGeneration.current;
        const sessionId = window.localNode?.sessionId;
        setSelection({ name: file.name, phase: 'loading' });
        setUpdate(null);

        try {
            const loaded = await FileServer.loadFile(file);
            if (generation === selectionGeneration.current) {
                setSelection({ ...loaded, phase: 'ready', generation, sessionId, targetNodeId });
            }
        } catch (error) {
            if (generation === selectionGeneration.current) {
                setSelection({ name: file.name, phase: 'error', message: error.message || 'Could not read the firmware file.' });
            }
        }
    };

    const handleUpdate = () => {
        const node = window.localNode;
        if (attemptRef.current || selection?.phase !== 'ready' ||
            selection.generation !== selectionGeneration.current || selection.targetNodeId !== targetNodeId) return;
        if (!node || node.sessionId !== selection.sessionId || !window.mavlinkSession?.isConnected()) {
            setUpdate({ phase: 'error', message: 'Connect to the target CAN bus before starting a firmware update.' });
            return;
        }

        const attempt = {
            node,
            coveredBytes: 0,
            complete: false,
            lastUptime: node.nodeMonitors[targetNodeId]?.status?.uptime_sec,
            sawUpdateMode: false,
            sawReboot: false
        };
        attemptRef.current = attempt;

        const finish = (phase, message) => {
            if (attemptRef.current !== attempt) return;
            stopAttempt(attemptRef);
            setUpdate({ phase, message });
        };
        const fail = (message) => finish('error', message);
        const waitForProgress = () => {
            clearTimeout(attempt.timer);
            attempt.timer = setTimeout(() => {
                const seconds = FILE_READ_TIMEOUT_MS / 1000;
                const detail = attempt.coveredBytes
                    ? `Firmware transfer to node ${targetNodeId} stalled for ${seconds} seconds after ${attempt.coveredBytes} of ${selection.data.byteLength} bytes.`
                    : `Firmware transfer to node ${targetNodeId} timed out after ${seconds} seconds. No firmware data was sent.`;
                const nextStep = node.nodeMonitors[targetNodeId]?.offline
                    ? 'The node is offline. Retry when it is back online.'
                    : 'Check the node’s CAN connection, then retry.';
                fail(`${detail} ${nextStep}`);
            }, FILE_READ_TIMEOUT_MS);
        };

        attempt.onNodeStatus = (transfer) => {
            if (attemptRef.current !== attempt || transfer.sourceNodeId !== targetNodeId ||
                transfer.sessionId !== selection.sessionId) return;
            const status = transfer.payload.toObj();
            attempt.sawUpdateMode ||= status.mode === MODE.SOFTWARE_UPDATE;
            if (attempt.complete && status.mode === MODE.OPERATIONAL &&
                (attempt.sawUpdateMode || status.uptime_sec < attempt.lastUptime)) {
                attempt.sawReboot = true;
            }
            attempt.lastUptime = status.uptime_sec;
            if (!attempt.sawReboot || status.mode !== MODE.OPERATIONAL || attempt.versionRequest) return;

            const request = node.getNodeInfo(targetNodeId, (response) => {
                if (attemptRef.current !== attempt) return;
                attempt.versionRequest = null;
                const version = response.payload?.toObj()?.software_version;
                if (version?.major == null || version?.minor == null) return;
                finish('observed', `Upload complete. Node ${targetNodeId} reports firmware version ${version.major}.${version.minor}.`);
            }, () => {
                attempt.versionRequest = null;
            });
            if (attemptRef.current === attempt) attempt.versionRequest = request;
            else if (request) node.cancelRequest(request);
        };

        try {
            attempt.path = FileServer.startTransfer(selection, node, targetNodeId, ({ coveredBytes, totalBytes, complete }) => {
                if (attemptRef.current !== attempt || attempt.complete) return;
                if (complete) {
                    attempt.complete = true;
                    clearTimeout(attempt.timer);
                    attempt.timer = setTimeout(() => finish('complete',
                        `Upload complete. Firmware version unavailable after ${VERSION_CHECK_TIMEOUT_MS / 1000} seconds. Check Node Properties for node ${targetNodeId}.`),
                    VERSION_CHECK_TIMEOUT_MS);
                    setUpdate({ phase: 'verifying', message: `Upload complete (100%). Waiting for node ${targetNodeId} to report its firmware version.` });
                    return;
                }
                if (coveredBytes > attempt.coveredBytes) waitForProgress();
                attempt.coveredBytes = coveredBytes;
                setUpdate({ phase: 'sending', coveredBytes, totalBytes });
            });
            node.on('uavcan.protocol.NodeStatus', attempt.onNodeStatus);
            setUpdate({ phase: 'starting', message: 'Requesting firmware update…' });
            waitForProgress();

            const request = node.beginFirmwareUpdate(targetNodeId, attempt.path, (transfer) => {
                if (attemptRef.current !== attempt) return;
                attempt.beginRequest = null;
                const fields = transfer.payload?.fields;
                const error = fields?.error?.value;
                if (error !== 0) {
                    const detail = fields?.optional_error_message?.toString();
                    fail(error == null ? 'Invalid firmware update response.' :
                        `The target rejected the firmware update (${error}).${detail ? ' ' + detail : ''}`);
                } else if (attempt.coveredBytes === 0 && !attempt.complete) {
                    setUpdate({ phase: 'starting', message: 'The target accepted the request. Waiting for its first file read…' });
                }
            }, (error) => {
                if (attemptRef.current !== attempt) return;
                attempt.beginRequest = null;
                // A bootloader can start reading even if the BeginFirmwareUpdate reply was lost.
                // The file-read timer already bounds the wait for the first request.
                if (error.code === 'REQUEST_TIMEOUT') return;
                fail(error.message || 'Could not start the firmware update.');
            });
            if (attemptRef.current === attempt) attempt.beginRequest = request;
            else if (request) node.cancelRequest(request);
        } catch (error) {
            fail(error.message || 'Could not start the firmware update.');
        }
    };

    const uploading = update?.phase === 'starting' || update?.phase === 'sending';
    const verifying = update?.phase === 'verifying';
    const uploadFinished = verifying || update?.phase === 'observed' || update?.phase === 'complete';
    const percentage = update?.totalBytes ? (update.coveredBytes / update.totalBytes) * 100 : 0;

    const handleClose = () => {
        selectionGeneration.current++;
        stopAttempt(attemptRef);
        onClose();
    };

    return (
        <Dialog open={open} onClose={uploading ? undefined : handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Firmware Update</DialogTitle>
            <DialogContent>
                {!uploadFinished && (
                    <>
                        <Typography variant="body2" gutterBottom>
                            Select a .bin or .hex firmware file for node {targetNodeId}.
                        </Typography>
                        <Button variant="contained" component="label" startIcon={<FileUploadIcon />} disabled={uploading}>
                            Select Firmware File
                            <input type="file" hidden accept=".bin,.hex" onChange={handleFileChange} disabled={uploading} />
                        </Button>
                    </>
                )}

                {selection && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {selection.name}
                        {selection.phase === 'loading' && ' (reading…)'}
                        {selection.phase === 'ready' && ` (${selection.data.byteLength} bytes)`}
                    </Typography>
                )}
                {selection?.phase === 'error' && <Alert severity="error" sx={{ mt: 2 }}>{selection.message}</Alert>}

                {uploading && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            {update.message || `Uploading firmware ${percentage.toFixed(1)}% (${update.coveredBytes} / ${update.totalBytes} bytes)`}
                        </Typography>
                        <LinearProgress variant={update.totalBytes ? 'determinate' : 'indeterminate'} value={percentage} />
                    </Box>
                )}
                {update?.message && !uploading && (
                    <Alert severity={update.phase === 'error' ? 'error' : 'info'} sx={{ mt: 2 }}>
                        {update.message}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant={uploadFinished ? 'contained' : 'text'} onClick={handleClose} disabled={uploading}>Close</Button>
                {!uploadFinished && (
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={selection?.phase !== 'ready' || uploading}
                    >
                        {update?.phase === 'error' ? 'Retry Update' : 'Update'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default FirmwareUpdateModal;
