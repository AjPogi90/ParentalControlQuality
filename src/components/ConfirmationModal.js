import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ConfirmationModal = ({
    open = false,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    onConfirm = () => { },
    onCancel = () => { },
    danger = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="sm"
            fullWidth
            aria-labelledby="confirmation-dialog-title"
        >
            <DialogTitle
                id="confirmation-dialog-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: danger ? 'error.main' : 'warning.main',
                }}
            >
                {danger ? <ErrorOutlineIcon /> : <WarningAmberIcon />}
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} color="inherit">
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={danger ? 'error' : 'primary'}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
