import React from 'react';
import { ThemeProvider } from '@mui/material';
import EscPanel from './EscPanel';
import theme from './theme';
import './css/panel.css';

const EscPanelWindow = () => {
    return (
        <ThemeProvider theme={theme}>
            <EscPanel />
        </ThemeProvider>
    );
};

export default EscPanelWindow;