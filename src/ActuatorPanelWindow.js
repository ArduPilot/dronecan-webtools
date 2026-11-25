import React from 'react';
import { ThemeProvider } from '@mui/material';
import ActuatorPanel from './ActuatorPanel';
import ControlPanelSession from './ControlPanelSession';
import theme from './theme';
import './css/panel.css';

const ActuatorPanelWindow = () => {
    return (
        <ThemeProvider theme={theme}>
            <ControlPanelSession panel={ActuatorPanel} />
        </ThemeProvider>
    );
};

export default ActuatorPanelWindow;