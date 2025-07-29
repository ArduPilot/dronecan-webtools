import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Divider } from '@mui/material';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const PanelsMenu = ({openWindow}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEscPanelClick = () => {
        openWindow(
            "ESC Panel",
            "esc_panel.html",
            "width=800,height=430",
        );
        handleClose();
    };

    const handleActuatorPanelClick = () => {
        openWindow(
            "Actuator Panel",
            "actuator_panel.html",
            "width=800,height=430",
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
                startIcon={<VideogameAssetIcon />} 
            >
                Panels 
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
                <MenuItem onClick={handleEscPanelClick} disableRipple>
                    ESC
                </MenuItem>
                <MenuItem onClick={handleActuatorPanelClick} disableRipple>
                    Actuator
                </MenuItem>
            </Menu>
        </Box>
    );
}
export default PanelsMenu;