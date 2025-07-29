import React from 'react';
import { ThemeProvider } from '@mui/material';
import ActuatorPanel from './ActuatorPanel';
import theme from './theme';
import './css/panel.css';

const ActuatorPanelWindow = () => {
    return (
        <ThemeProvider theme={theme}>
            <ActuatorPanel />
        </ThemeProvider>
    );
};

export default ActuatorPanelWindow;