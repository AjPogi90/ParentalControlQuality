import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Fade,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '../contexts/ThemeContext';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
});

const ConfirmationModal = ({
    open = false,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    onConfirm = () => { },
    onCancel = () => { },
    danger = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    icon = null, // Allow custom icon
}) => {
    const { colors } = useTheme();

    // Determine icon based on props
    const getIcon = () => {
        if (icon) return icon;
        if (title.toLowerCase().includes('logout')) return <LogoutIcon sx={{ fontSize: 32, color: colors.primary }} />;
        if (danger) return <ErrorOutlineIcon sx={{ fontSize: 32, color: colors.error }} />;
        return <WarningAmberIcon sx={{ fontSize: 32, color: colors.warning }} />;
    };

    const getIconBgColor = () => {
        if (title.toLowerCase().includes('logout')) return `${colors.primary}22`; // 22 is approx 13% opacity
        if (danger) return `${colors.error}22`;
        return `${colors.warning}22`;
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            TransitionComponent={Transition}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: colors.cardBg,
                    backgroundImage: 'none',
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                    p: 2,
                }
            }}
            aria-labelledby="confirmation-dialog-title"
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                        bgcolor: getIconBgColor(),
                        mb: 2,
                    }}
                >
                    {getIcon()}
                </Avatar>
            </Box>

            <DialogTitle
                id="confirmation-dialog-title"
                sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: colors.text,
                    p: 0,
                    mb: 1,
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', p: 0, px: 2, mb: 3 }}>
                <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 0, px: 1, gap: 1.5, justifyContent: 'center' }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderColor: colors.divider,
                        color: colors.text,
                        '&:hover': {
                            borderColor: colors.textSecondary,
                            bgcolor: 'transparent',
                        },
                        flex: 1,
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        bgcolor: danger ? colors.error : colors.primary,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: danger ? colors.error : colors.primary, // You might want a darker shade here, but for now keep consistent
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            opacity: 0.9,
                        },
                        flex: 1,
                    }}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
