import React from 'react';
import { ThemeProvider } from '@mui/material';
import BusMonitor from './BusMonitor';
import theme from './theme';
import './css/panel.css';

const BusMonitorWindow = () => {
    return (
        <ThemeProvider theme={theme}>
            <BusMonitor />
        </ThemeProvider>
    );
};

export default BusMonitorWindow;