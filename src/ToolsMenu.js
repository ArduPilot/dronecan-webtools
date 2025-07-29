import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Divider } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import MessageIcon from '@mui/icons-material/Message';
import SettingsInputCompositeIcon from '@mui/icons-material/SettingsInputComposite';

const ToolsMenu =({openWindow}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubscriberClick = () => {
        openWindow(
            "Subscriber",
            "subscriber.html",
            "width=800,height=400",
        );
        handleClose();
    };

    const handleBusMonitorClick = () => {
        openWindow(
            "Bus Monitor",
            "bus_monitor.html",
            "width=1000,height=400",
        );
        handleClose();
    };

    return (
        <Box mr={1}>
            <Button
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                onClick={handleClick}
                color="default"
                startIcon={<BuildIcon />} 
            >
                Tools
            </Button>
            <Menu
                elevation={0}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleSubscriberClick} disableRipple>
                    Subscriber
                </MenuItem>
                <MenuItem onClick={handleBusMonitorClick} disableRipple>
                    Bus Monitor
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default ToolsMenu;