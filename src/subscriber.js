import React from 'react';
import { createRoot } from 'react-dom/client';
import SubscriberWindow from './SubscriberWindow';

const root = createRoot(document.getElementById('sub-root'));
root.render(<SubscriberWindow />); 