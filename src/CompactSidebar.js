import React, { useEffect, useState } from 'react';
import { Box, Badge, Tooltip, CircularProgress, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const CompactSidebar = ({ 
  nodes, 
  selectedNodeId, 
  setSelectedNodeId 
}) => {
  const [logCounts, setLogCounts] = useState({});
  
  useEffect(() => {
    // Function to get log counts from the window.localNode events
    const updateLogCounts = () => {
      const counts = {};
      
      // Initialize counts for all nodes to 0
      Object.keys(nodes).forEach(nodeId => {
        counts[nodeId] = 0;
      });
      
      try {
        // Access logs if they're stored somewhere else in the app
        // Option 1: If logs are stored in a global state/context
        if (window.dronecanLogs && Array.isArray(window.dronecanLogs)) {
          window.dronecanLogs.forEach(log => {
            if (log.id) {
              counts[log.id] = (counts[log.id] || 0) + 1;
            }
          });
        }
        // Option 2: Listen for log events and maintain our own count
        // This is already set up in the useEffect for event listening below
      } catch (error) {
        console.error("Error accessing logs:", error);
      }
      
      setLogCounts(counts);
    };
    
    // Create log listener and counter
    let lastLogCounts = {};
    
    const handleLog = (transfer) => {
      const sourceNodeId = transfer.sourceNodeId;
      if (sourceNodeId) {
        // Update count for this node
        lastLogCounts[sourceNodeId] = (lastLogCounts[sourceNodeId] || 0) + 1;
        setLogCounts({...lastLogCounts});
      }
    };
    
    // Listen for log messages
    const localNode = window.localNode;
    if (localNode) {
      localNode.on('uavcan.protocol.debug.LogMessage', handleLog);
    }
    
    // Initial update
    updateLogCounts();
    
    return () => {
      // Remove event listener on cleanup
      if (localNode) {
        localNode.off('uavcan.protocol.debug.LogMessage', handleLog);
      }
    };
  }, [nodes]);
  
  // Get color based on node mode (matching the same logic as NodeList)
  const getModeColor = (mode) => {
    switch (mode) {
      case 'OPERATIONAL':
        return '#f5f5f5'; // Light gray for operational (subtle)
      case 'INITIALIZATION':
        return '#ffb74d'; // Warning color
      case 'MAINTENANCE':
        return '#9c27b0'; // Secondary/purple
      case 'SOFTWARE_UPDATE':
        return '#4caf50'; // Success/green
      case 'OFFLINE':
        return '#f44336'; // Error/red
      default:
        return '#f44336'; // Default to error color
    }
  };
  
  // Handle click on a node
  const handleNodeClick = (nodeId) => {
    if (nodeId === selectedNodeId) {
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(Number(nodeId));
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none', alignItems: 'center' },
        flexDirection: 'column',
        width: '60px',
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 1,
        gap: 1,
        overflowY: 'auto',
        height: '100%'
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          textAlign: 'center',
          display: 'block',
          mb: 0.5,
          fontWeight: 'bold',
          fontSize: '0.5rem'
        }}
      >
        NODES
      </Typography>

      {Object.keys(nodes).length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        Object.keys(nodes).map((nodeId) => {
          const node = nodes[nodeId];
          const mode = node.status.getConstant('mode');
          const logCount = logCounts[nodeId] || 0;
          
          return (
            <Tooltip 
              key={nodeId}
              title={`${node.name || 'Unknown'} (${mode})`} 
              placement="right"
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  width: '30px',
                  height: '30px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: selectedNodeId === Number(nodeId) ? 'primary.main' : 'divider',
                  backgroundColor: 'background.paper',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
                onClick={() => handleNodeClick(Number(nodeId))}
              >
                {/* Make NID larger and more prominent */}
                <Typography 
                    variant='caption'
                    sx={{
                        color: getModeColor(mode),
                    }}
                >
                  {nodeId}
                </Typography>
                
                {logCount > 0 && (
                  <Badge
                    badgeContent={logCount > 99 ? '99+' : logCount}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -3,
                      right: -3
                    }}
                  >
                    <NotificationsIcon sx={{ fontSize: 14 }} />
                  </Badge>
                )}
              </Box>
            </Tooltip>
          );
        })
      )}
    </Box>
  );
};

export default CompactSidebar;