import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: '#ffffff', // Set the primary text color to white
        },
    },
    // Add typography settings to make all fonts smaller
    typography: {
        fontSize: 12, // Default font size in px (reduced from the default 14px)
        htmlFontSize: 14, // Base HTML font-size (was 16px by default)
        // Customize specific variants
        h1: {
            fontSize: '2rem', // 24px
        },
        h2: {
            fontSize: '1.75rem', // 21px
        },
        h3: {
            fontSize: '1.5rem', // 18px
        },
        h4: {
            fontSize: '1.25rem', // 15px
        },
        h5: {
            fontSize: '1.1rem', // 13.2px
        },
        h6: {
            fontSize: '1rem', // 12px
        },
        body1: {
            fontSize: '0.875rem', // 10.5px
        },
        body2: {
            fontSize: '0.825rem', // 9.9px
        },
        button: {
            fontSize: '0.825rem', // 9.9px
        },
        caption: {
            fontSize: '0.75rem', // 9px
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        // Add table cell specific overrides
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                },
                head: {
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        fontSize: '0.8rem',
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '0.8rem',
                        transform: 'translate(14px, 9px) scale(1)',
                    },
                    '& .MuiInputLabel-shrink': {
                        transform: 'translate(14px, -6px) scale(0.75)',
                    },
                    '& .MuiOutlinedInput-root': {
                        padding: '4px 8px',
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '4px',
                    },
                },
            },
        },
        MuiTable: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiSelect: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiFormControl: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiInputLabel: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiFab: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiRadio: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiSwitch: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem', // Set your desired font size here
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // Set the default text color to white
                },
            },
        },
        AppBar: {
            styleOverrides: {
                defaultProps: {
                    size: 'small',
                },
            }
        }
    },
});

export default theme;