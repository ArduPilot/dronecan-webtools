import React from 'react';
import { createRoot } from 'react-dom/client';

export default function mountPanel(Component) {
    const container = document.getElementById('sub-root');
    let root;
    const mount = () => {
        root = createRoot(container);
        root.render(<Component />);
    };
    mount();
    // Release listeners on the opener, including when the popup enters the back/forward cache.
    window.addEventListener('pagehide', () => root.unmount());
    window.addEventListener('pageshow', event => {
        if (event.persisted) mount();
    });
}
