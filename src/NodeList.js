import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { secondsToTime } from './common';

const NodeList = ({ nodes, selectedNodeId, setSelectedNodeId }) => {
    const handleRowClick = (key) => {
        if (key === selectedNodeId) {
            setSelectedNodeId(null);
            return;
        }
        setSelectedNodeId(Number(key));
    };

    const getModeColor = (mode) => {
        switch (mode) {
            case 'OPERATIONAL':
                return '';
            case 'INITIALIZATION':
                return 'warning.main';
            case 'MAINTENANCE':
                return 'secondary.main';
            case 'SOFTWARE_UPDATE':
                return 'success.main';
            case 'OFFLINE':
                return 'error.main';
            default:
                return 'error.main';
        }
    };

    const renderNodeRow = (key) => {
        let node = nodes[key];
        let status = node.status;
        let health = status.getConstant('health');
        let mode = status.getConstant('mode');
        return (
            <TableRow key={key} onClick={() => handleRowClick((Number(key)))} style={{ cursor: 'pointer' }}>
                <TableCell>{key}</TableCell>
                <TableCell>{node.name}</TableCell>
                <TableCell>{health}</TableCell>
                <TableCell sx={{bgcolor: getModeColor(mode)}}>{mode}</TableCell>
                <TableCell>{secondsToTime(status.uptime_sec)}</TableCell>
                <TableCell>{node.status.vendor_specific_status_code}</TableCell>
            </TableRow>
        );
    };

    return (
        <Box
            component={Paper}
            sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, height: '50%'}}
        >
            <Box margin={1} sx={{height: 20}}>
                <Typography variant="caption">Online Nodes</Typography>
            </Box>
            <TableContainer
                sx={{ overflow: 'auto' }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>NID</TableCell>
                            <TableCell
                                sx={{
                                    width: 150,
                                }}
                            >
                                Name
                            </TableCell>
                            <TableCell>Health</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Uptime</TableCell>
                            <TableCell>VSSC</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(nodes).map((key) => (
                            renderNodeRow(key)
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default NodeList;