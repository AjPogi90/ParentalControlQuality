import React, { useState } from 'react';
import {
    IconButton,
    AppBar,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

const MobileNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            {/* Mobile App Bar - Only visible on mobile */}
            <AppBar
                position="fixed"
                sx={{
                    display: { xs: 'block', md: 'none' },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        size="large" // Ensures 48px+ touch target
                        sx={{
                            mr: 2,
                            '&:active': {
                                bgcolor: 'action.selected', // Visual tap feedback
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main', // Solid color for WCAG compliance
                        }}
                    >
                        AegistNet
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Sidebar
                isMobile={true}
                open={mobileOpen}
                onClose={handleDrawerToggle}
            />

            {/* Spacer for fixed AppBar on mobile */}
            <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        </>
    );
};

export default MobileNav;
