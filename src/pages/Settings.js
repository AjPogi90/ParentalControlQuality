import React from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Switch,
    FormControlLabel,
    Divider,
} from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Settings = () => {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: colors.background, py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: colors.text }}>
                        Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                        Customize your AegistNet experience
                    </Typography>
                </Box>

                {/* Appearance Section */}
                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text }}>
                        Appearance
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: colors.divider }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {theme === 'light' ? (
                                <LightModeIcon sx={{ fontSize: 32, color: colors.primary }} />
                            ) : (
                                <DarkModeIcon sx={{ fontSize: 32, color: colors.primary }} />
                            )}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text }}>
                                    Theme
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                </Typography>
                            </Box>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: colors.primary,
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            bgcolor: colors.primary,
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                    {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                                </Typography>
                            }
                        />
                    </Box>
                </Paper>

                {/* About Section */}
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: colors.cardBg,
                        border: `1px solid ${colors.cardBorder}`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.text }}>
                        About
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: colors.divider }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                Application
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                                AegistNet
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                Version
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                                1.0.0
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Settings;
