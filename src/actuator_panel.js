import React from 'react';
import { createRoot } from 'react-dom/client';
import ActuatorPanelWindow from './ActuatorPanelWindow';

const root = createRoot(document.getElementById('sub-root'));
root.render(<ActuatorPanelWindow />); 