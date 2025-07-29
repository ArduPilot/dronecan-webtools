import React from 'react';
import { createRoot } from 'react-dom/client';
import BusMonitorWindow from './BusMonitorWindow';

const root = createRoot(document.getElementById('sub-root'));
root.render(<BusMonitorWindow />); 