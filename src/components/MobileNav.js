import React, { useState } from 'react';
import {
    IconButton,
    AppBar,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { useTheme } from '../contexts/ThemeContext';

const MobileNav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { colors } = useTheme();

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
                    bgcolor: colors.cardBg,
                    color: colors.text,
                    boxShadow: 1,
                    borderBottom: `1px solid ${colors.divider}`,
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
                            color: colors.text,
                            '&:active': {
                                bgcolor: colors.hover, // Visual tap feedback
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
                            color: colors.primary, // Solid color for WCAG compliance
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
        </>
    );
};

export default MobileNav;
