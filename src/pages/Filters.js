import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Switch,
    FormControlLabel,
    CircularProgress,
    Alert,
    Tooltip,
    IconButton,
    Chip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useChildrenList, useChildData, updateContentFilters } from '../hooks/useFirebase';

const filterDefinitions = [
    {
        key: 'nudity',
        label: 'Nudity Filter',
        icon: '🔞',
        description: 'Blocks inappropriate images, adult content, and explicit material',
        details:
            'Prevents access to websites and apps with nudity or sexually explicit content. Helps protect children from age-inappropriate material.',
    },
    {
        key: 'violence',
        label: 'Violence Filter',
        icon: '⚔️',
        description: 'Filters violent and graphic content',
        details:
            'Blocks access to violent imagery, graphic content, and age-inappropriate games or videos. Helps create a safer online environment.',
    },
    {
        key: 'harmfulText',
        label: 'Harmful Text Filter',
        icon: '⚠️',
        description: 'Blocks offensive language, hate speech, and cyberbullying',
        details:
            'Filters offensive language, slurs, cyberbullying, and harmful text content. Protects children from toxic online interactions.',
    },
];

const Filters = () => {
    const { user } = useAuth();
    const { colors } = useTheme();
    const { children, loading: loadingChildren } = useChildrenList(user?.email);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [applyToAll, setApplyToAll] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { data: childData, loading: loadingChild } = useChildData(selectedChildId);

    // Auto-select first child
    React.useEffect(() => {
        if (children && children.length > 0 && !selectedChildId) {
            setSelectedChildId(children[0].id);
        }
    }, [children, selectedChildId]);

    const filters = childData?.contentFilters || {
        nudity: false,
        violence: false,
        harmfulText: false,
    };

    const handleFilterToggle = async (filterKey, newValue) => {
        if (!selectedChildId) return;

        setSaveLoading(true);
        const updatedFilters = { ...filters, [filterKey]: newValue };

        if (applyToAll && children) {
            // Apply to all children
            let successCount = 0;
            for (const child of children) {
                const result = await updateContentFilters(child.id, updatedFilters);
                if (result.success) successCount++;
            }
            setSuccessMessage(`Filter updated for ${successCount} child(ren)`);
        } else {
            // Apply to selected child only
            const result = await updateContentFilters(selectedChildId, updatedFilters);
            if (result.success) {
                setSuccessMessage('Filter settings updated successfully');
            }
        }

        setTimeout(() => setSuccessMessage(''), 3000);
        setSaveLoading(false);
    };

    if (loadingChildren) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: colors.primary }} />
            </Box>
        );
    }

    const selectedChild = children?.find((c) => c.id === selectedChildId);
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: colors.background, color: colors.text }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: colors.text }}>
                        Content Filters
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                        Protect your children from harmful content online. Enable filters to block
                        inappropriate material, violence, and offensive language.
                    </Typography>
                    <Alert severity="info" sx={{ borderRadius: 2, bgcolor: 'rgba(33,150,243,0.08)', color: colors.text }}>
                        <Typography variant="body2">
                            <strong>How it works:</strong> Content filters work on the child's device to
                            monitor and block harmful content in real-time. Changes take effect
                            immediately on connected devices.
                        </Typography>
                    </Alert>
                </Box>

                {/* Success Message */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76,175,80,0.08)', color: colors.text }} onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                )}

                {/* Child Selector */}
                {children && children.length > 0 ? (
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth sx={{ mb: 2, maxWidth: 400 }}>
                            <InputLabel sx={{ color: colors.textSecondary }}>Select Child</InputLabel>
                            <Select
                                value={selectedChildId}
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                label="Select Child"
                                sx={{
                                    bgcolor: colors.inputBg,
                                    color: colors.text,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.divider,
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.primary,
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.primary,
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: colors.text,
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: colors.cardBg,
                                            color: colors.text,
                                        },
                                    },
                                }}
                            >
                                {children.map((child) => (
                                    <MenuItem key={child.id} value={child.id} sx={{ bgcolor: colors.cardBg, color: colors.text, '&:hover': { bgcolor: colors.hover } }}>
                                        {child.name} ({child.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={applyToAll}
                                    onChange={(e) => setApplyToAll(e.target.checked)}
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: colors.text }}>
                                        Apply changes to all children ({children.length})
                                    </Typography>
                                    <Tooltip title="When enabled, any filter you toggle will be applied to all your children, not just the selected one.">
                                        <InfoOutlinedIcon fontSize="small" sx={{ color: colors.textSecondary }} />
                                    </Tooltip>
                                </Box>
                            }
                            sx={{
                                alignItems: 'center',
                                m: 0,
                            }}
                        />
                    </Box>
                ) : (
                    <Alert severity="info" sx={{ mb: 3, bgcolor: 'rgba(33,150,243,0.08)', color: colors.text }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: colors.text }}>
                            No Children Connected
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Connect a child's device to enable content filtering and protection.
                        </Typography>
                    </Alert>
                )}

                {selectedChildId && selectedChild && (
                    <>
                        {loadingChild ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress sx={{ color: colors.primary }} />
                            </Box>
                        ) : (
                            <>
                                {/* Filter Stats */}
                                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: colors.primary, color: 'white' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Protection Status
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                {selectedChild.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                {activeFiltersCount}/3
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Filters Active
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                {/* Filter Controls */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filterDefinitions.map((filter) => (
                                        <Paper
                                            key={filter.key}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: 2,
                                                borderColor: filters[filter.key] ? '#4caf50' : colors.cardBorder,
                                                bgcolor: colors.cardBg,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(238,121,26,0.2)',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    gap: 2,
                                                }}
                                            >
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="h5">{filter.icon}</Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                                                            {filter.label}
                                                        </Typography>
                                                        {filters[filter.key] && (
                                                            <Chip
                                                                label="Active"
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor: 'rgba(76,175,80,0.2)',
                                                                    color: '#4caf50',
                                                                    border: '1px solid #4caf50',
                                                                }}
                                                            />
                                                        )}
                                                        <Tooltip title={filter.details} arrow>
                                                            <IconButton size="small" sx={{ color: colors.textSecondary }}>
                                                                <InfoOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>

                                                    <Typography variant="body2" sx={{ color: colors.textSecondary }} paragraph>
                                                        {filter.description}
                                                    </Typography>

                                                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                                        {filter.details}
                                                    </Typography>
                                                </Box>

                                                <Switch
                                                    checked={filters[filter.key] || false}
                                                    onChange={(e) => handleFilterToggle(filter.key, e.target.checked)}
                                                    disabled={saveLoading}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#4caf50',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            bgcolor: '#4caf50',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>

                                {/* Info Footer */}
                                <Paper sx={{ p: 3, mt: 3, bgcolor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary }} paragraph>
                                        <strong style={{ color: colors.text }}>Note:</strong> Content filters provide an additional layer of
                                        protection but may not catch all inappropriate content. We recommend
                                        combining filters with open communication and active monitoring.
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                        <strong style={{ color: colors.text }}>Privacy:</strong> Filter settings are stored securely and only
                                        accessible by you and the child's device. No content is monitored or
                                        logged by our servers.
                                    </Typography>
                                </Paper>
                            </>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Filters;
