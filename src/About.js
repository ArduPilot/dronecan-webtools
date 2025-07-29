import React from 'react';
import { Typography, Box, Paper, Divider, Link, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Stack, Chip, Button } from '@mui/material';
import packageInfo from '../package.json';
import vimdronesLogo from './image/vimdrones_logo.png';
import discordLogo from './image/discord_logo.png'; // Import Discord logo
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UsbIcon from '@mui/icons-material/Usb';
import WifiIcon from '@mui/icons-material/Wifi';
import ComputerIcon from '@mui/icons-material/Computer';

// Remove the DiscordIcon import since we're now using a custom image

const About = () => {
    return (
        <Box sx={{ mx: 'auto', p: 2, width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }} component={Paper} elevation={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        DroneCAN Web Tools
                    </Typography>
                    <Chip 
                        label={`v${packageInfo.version}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 2 }} 
                    />
                </Box>
            </Box>

            <Card variant="outlined">
                <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500, color: 'primary.main' }}>Key Features</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <List dense disablePadding>
                                {['Web Serial API connection', 'WebSocket remote access', 'Parameter editing', 'Node discovery', 'Frame Monitor'].map((item, index) => (
                                    <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <CheckCircleOutlineIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <List dense disablePadding>
                                {['Firmware updates', 'Data visualization', 'ESC Control', 'Actuator Control', 'Bus Monitor'].map((item, index) => (
                                    <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <CheckCircleOutlineIcon color="success" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WifiIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>WebSocket via MAVProxy</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1, fontFamily: 'monospace' }}>
                            mavproxy.py --master /dev/tty.usbmodem111401,115200 --out wsserver:127.0.0.1:5555
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Connect to <Box component="span" sx={{ fontWeight: 'bold' }}>ws://127.0.0.1:5555</Box> in the Adapter Settings 
                        </Typography>
                        
                        <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ComputerIcon color="info" sx={{ mr: 1, fontSize: '1rem' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Or try without hardware using Ardupilot SITL
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                ./Tools/autotest/sim_vehicle.py -v ArduPlane --can-peripherals --out wsserver:127.0.0.1:5555
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ flex: 1 }}>
                    <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <UsbIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Direct Serial Connection</Typography>
                        </Box>
                        <Typography variant="body2">
                            Use the Web Serial API to connect directly to your device through the browser
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}>
                            Supported Devices:
                        </Typography>
                        <List dense disablePadding>
                            <ListItem disablePadding sx={{ py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Flight Controller with MAVCAN passthrough (ie Ardupilot)" />
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    <CheckCircleOutlineIcon color="success" fontSize="small" /> {/* Changed from info to success */}
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Standalone MAVCAN USB Adaptor" 
                                    secondary={
                                        <Box component="span">
                                            <Link 
                                                href="https://github.com/VimDrones/MAVCAN_Bridge"
                                                target="_blank" 
                                                rel="noopener"
                                                sx={{ fontSize: '0.75rem' }}
                                            >
                                                MAVCAN Bridge
                                            </Link>
                                            <Typography 
                                                component="span" 
                                                variant="caption" 
                                                sx={{ ml: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                                            >
                                                from Vimdrones
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Stack>
            
            {/* Footer */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 1, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' } 
                }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mr: 5, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Author: <Link href="https://github.com/huibean" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>Huibean Luo</Link>
                        </Typography>
                        
                        <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            href="https://discord.gg/xxCKsZXU4K"
                            target="_blank"
                            rel="noopener"
                            sx={{ 
                                borderRadius: 4,
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                height: 28,
                                px: 1.5,
                                bgcolor: 'rgba(88, 101, 242, 0.08)',
                                borderColor: '#5865F2',
                                color: '#5865F2',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(88, 101, 242, 0.12)',
                                    borderColor: '#5865F2',
                                }
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 20,
                                    width: 20,
                                    mr: 0.5,
                                    '& img': {
                                        height: '100%',
                                        width: '100%',
                                    }
                                }}
                            >
                                <img 
                                    style={{borderRadius: '50%'}}
                                    src={discordLogo} 
                                    alt="Discord" 
                                />
                            </Box>
                            Vimdrones
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            href="https://discord.gg/vz7a499KXN"
                            target="_blank"
                            rel="noopener"
                            sx={{ 
                                borderRadius: 4,
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                height: 28,
                                px: 1.5,
                                bgcolor: 'rgba(88, 101, 242, 0.08)',
                                borderColor: '#5865F2',
                                color: '#5865F2',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': {
                                    bgcolor: 'rgba(88, 101, 242, 0.12)',
                                    borderColor: '#5865F2',
                                }
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 20,
                                    width: 20,
                                    mr: 0.5,
                                    '& img': {
                                        height: '100%',
                                        width: '100%',
                                    }
                                }}
                            >
                                <img 
                                    style={{borderRadius: '50%'}}
                                    src={discordLogo} 
                                    alt="Discord" 
                                />
                            </Box>
                            DroneCAN
                        </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            Sponsored by
                        </Typography>
                        <Link href="https://dev.vimdrones.com" target="_blank" rel="noopener">
                            <img 
                                src={vimdronesLogo} 
                                alt="Vimdrones" 
                                style={{ height: '30px' }}
                            />
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default About;