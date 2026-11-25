import React, { useSyncExternalStore } from 'react';
import { Typography } from '@mui/material';

export default function ControlPanelSession({ panel: Panel }) {
    const opener = window.opener;
    const node = opener?.localNode;
    const link = opener?.mavlinkSession;

    const subscribe = notify => {
        node?.on('session-change', notify);
        link?.on('connection-change', notify);
        return () => {
            node?.off('session-change', notify);
            link?.off('connection-change', notify);
        };
    };
    const sessionId = useSyncExternalStore(subscribe, () =>
        node && link?.isConnected() ? node.sessionId : null
    );
    if (sessionId === null) {
        return <Typography sx={{ p: 2 }}>{node && !opener.closed
            ? 'Connect an adapter in the main DroneCAN Web Tools window to use this panel.'
            : 'Open this panel from the main DroneCAN Web Tools window.'}</Typography>;
    }
    // A queued worker tick can arrive before React unmounts the old panel.
    const isCurrentSession = () => !opener.closed && opener.localNode === node &&
        opener.mavlinkSession === link && link.isConnected() && node.sessionId === sessionId;
    return <Panel key={sessionId} localNode={node} isCurrentSession={isCurrentSession} />;
}
