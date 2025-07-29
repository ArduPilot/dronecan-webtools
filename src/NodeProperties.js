import React, { useEffect, useState } from 'react';
import dronecan from './dronecan';
import { Paper, Box, Typography, TextField, Button, Stack, Switch, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { secondsToTime } from './common';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CableIcon from '@mui/icons-material/Cable';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import FirmwareUpdateModal from './FirmwareUpdateModal';
import ConfirmRestartModal from './ConfirmRestartModal';

const VendorSpecificCodeDisplay = (code) => {
    code = Math.max(0, Math.floor(code) & 0xFFFF);
    let decimal = code.toString();
    let hex = `0x${code.toString(16).padStart(4, '0')}`;
    let binary = `0b${(code >>> 8).toString(2).padStart(8, '0')}_${(code & 255).toString(2).padStart(8, '0')}`;
    return `${decimal}    |    ${hex}    |    ${binary}`;
};

const NodeProperties = ({ nodeId, nodes, multiNodeEditorEnable, setMultiNodeEditorEnable }) => {
    const [firmwareModalOpen, setFirmwareModalOpen] = useState(false);
    const [restartModalOpen, setRestartModalOpen] = useState(false);

    useEffect(() => {
        const localNode = window.localNode;
        const handleNodeParam = (transfer) => {
            if (transfer.sourceNodeId !== nodeId) return;
        };
        localNode.on('uavcan.protocol.param.GetSet.Response', handleNodeParam);
        return () => {
            localNode.off('uavcan.protocol.param.GetSet.Response', handleNodeParam);
        };
    }, [nodeId]);

    if (!nodeId) return null;

    const node = nodes[nodeId];
    if (!node) return null;

    const handleNodeRestart = (nodeId) => {
        const localNode = window.localNode;
        localNode.restartNode(nodeId, (transfer) => {
            console.log('Restart response:', transfer);
        });
    };

    const handleConfirmRestart = () => {
        handleNodeRestart(nodeId);
        setRestartModalOpen(false);
    };

    const status = nodes[nodeId]?.status;
    const name = node.name ? node.name : '';
    const health = status ? `${status.getConstant('health')} (${status.health})` : '';
    const mode = status ? `${status.getConstant('mode')} (${status.mode})` : '';
    const uptime = status ? secondsToTime(status.uptime_sec) : 0;
    const vendor_specific_status_code = status ? VendorSpecificCodeDisplay(status.vendor_specific_status_code) : 0;

    const softwareVersion = node.software_version ? `${node.software_version.major}.${node.software_version.minor}` : '';
    const softwareCrc64 = node.software_version ? `0x${node.software_version.image_crc.toString(16).padStart(8, '0')}` : '';
    const softwareVcsCommit = node.software_version ? `0x${node.software_version.vcs_commit.toString(16).padStart(4, '0')}` : '';

    const hardwareVersion = node.hardware_version ? `${node.hardware_version.major}.${node.hardware_version.minor}` : '';
    const hardwareUID = node.hardware_version ? node.hardware_version.unique_id.map((item) => { return item.toString(16).padStart(2, '0') }).join(' ') : '';
    const certificateOfAuthenticity = node.certificate_of_authenticity ? node.certificate_of_authenticity : ' ';

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', height: 340}}
            component={Paper}
            p={1}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption">
                    Node Properties
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption">Multi Node Editor</Typography>
                    <Switch checked={multiNodeEditorEnable} onChange={(e) => { setMultiNodeEditorEnable(e.target.checked) }} />
                </Stack>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Node ID"
                    value={nodeId}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="Name"
                    value={name}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Mode"
                    value={mode}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="Health"
                    value={health}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="Uptime"
                    value={uptime}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Vendor Specific Status Code"
                    fullWidth
                    value={vendor_specific_status_code}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Software Version"
                    fullWidth
                    value={softwareVersion}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="CRC64"
                    fullWidth
                    value={softwareCrc64}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="VCS Commit"
                    fullWidth
                    value={softwareVcsCommit}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Hardware Version"
                    value={hardwareVersion}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mr: 0.5 }}
                />
                <TextField
                    label="UID"
                    fullWidth
                    value={hardwareUID}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1 }}>
                <TextField
                    label="Cert. of authenticity"
                    fullWidth
                    value={certificateOfAuthenticity}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    sx={{ width: 80, mr: 2 }}
                    variant="caption"
                >
                    Node Controls
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, border: 1, borderColor: 'grey.500', borderRadius: 1, p: 0.5 }}>
                    <Button
                        sx={{ mr: 1 }}
                        color="error"
                        variant="contained"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={() => setRestartModalOpen(true)}
                    >
                        Restart
                    </Button>
                    <Button
                        sx={{ mr: 1 }}
                        variant="outlined"
                        startIcon={<CableIcon />}
                    >
                        Get Transport Stats
                    </Button>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Button
                        variant="outlined"
                        startIcon={<SystemUpdateAltIcon />}
                        onClick={() => setFirmwareModalOpen(true)}
                    >
                        Update Firmware
                    </Button>
                </Box>
            </Box>
            <FirmwareUpdateModal 
                open={firmwareModalOpen} 
                onClose={() => setFirmwareModalOpen(false)} 
                targetNodeId={nodeId} 
            />
            <ConfirmRestartModal
                open={restartModalOpen}
                onClose={() => setRestartModalOpen(false)}
                onConfirm={handleConfirmRestart}
            />
        </Box>
    );
};

export default NodeProperties;