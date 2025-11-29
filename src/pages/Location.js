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
    Button,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useChildrenList, useChildData, requestLocationRefresh } from '../hooks/useFirebase';
import useReverseGeocode from '../hooks/useReverseGeocode';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { formatDistanceToNow } from 'date-fns';

// Fix Leaflet marker icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const Location = () => {
    const { user } = useAuth();
    const { colors } = useTheme();
    const { children, loading: loadingChildren } = useChildrenList(user?.email);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [fullscreenOpen, setFullscreenOpen] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);

    const { data: childData, loading: loadingChild } = useChildData(selectedChildId);

    // Auto-select first child
    React.useEffect(() => {
        if (children && children.length > 0 && !selectedChildId) {
            setSelectedChildId(children[0].id);
        }
    }, [children, selectedChildId]);

    const location = childData?.location;
    const { address, loading: loadingAddress } = useReverseGeocode(
        location?.latitude,
        location?.longitude
    );

    const handleRefreshLocation = async () => {
        if (!selectedChildId) return;
        setRefreshLoading(true);
        await requestLocationRefresh(selectedChildId);
        setTimeout(() => setRefreshLoading(false), 2000);
    };

    if (loadingChildren) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: colors.primary }} />
            </Box>
        );
    }

    const selectedChild = children?.find((c) => c.id === selectedChildId);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: colors.background, color: colors.text }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: colors.text }}>
                        Child Locations
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                        Track where your children are in real-time
                    </Typography>
                </Box>

                {/* Child Selector */}
                {children && children.length > 0 ? (
                    <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
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
                ) : (
                    <Alert severity="info" sx={{ mb: 3, bgcolor: 'rgba(33,150,243,0.08)', color: colors.text }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: colors.text }}>
                            No Children Connected
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Connect a child's device to start tracking their location in real-time.
                        </Typography>
                    </Alert>
                )}

                {selectedChildId && selectedChild && (
                    <>
                        {loadingChild ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress sx={{ color: colors.primary }} />
                            </Box>
                        ) : location ? (
                            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                                {/* Address Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <LocationOnIcon sx={{ color: colors.primary }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                                            Current Location
                                        </Typography>
                                    </Box>

                                    {loadingAddress ? (
                                        <CircularProgress size={20} sx={{ color: colors.primary }} />
                                    ) : (
                                        <Typography variant="body1" sx={{ mb: 1, color: colors.text }}>
                                            📍 {address}
                                        </Typography>
                                    )}

                                    <Typography
                                        variant="caption"
                                        sx={{ fontFamily: 'monospace', color: colors.textSecondary }}
                                    >
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </Typography>

                                    {/* Metadata */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                        {location.timestamp && (
                                            <Chip
                                                size="small"
                                                label={`Updated ${formatDistanceToNow(new Date(location.timestamp), {
                                                    addSuffix: true,
                                                })}`}
                                                sx={{
                                                    bgcolor: 'rgba(238,121,26,0.2)',
                                                    color: '#EE791A',
                                                    border: '1px solid #EE791A',
                                                }}
                                            />
                                        )}
                                        {location.accuracy && (
                                            <Chip
                                                size="small"
                                                label={`Accuracy: ±${Math.round(location.accuracy)}m`}
                                                sx={{
                                                    bgcolor: colors.divider,
                                                    color: colors.text,
                                                    border: `1px solid ${colors.divider}`,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                {/* Map Preview */}
                                <Box
                                    sx={{
                                        height: 400,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: 2,
                                        borderColor: colors.primary,
                                        mb: 2,
                                    }}
                                >
                                    <MapContainer
                                        center={[location.latitude, location.longitude]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[location.latitude, location.longitude]}>
                                            <Popup>
                                                <strong>📍 {selectedChild.name}'s Location</strong>
                                                <br />
                                                {address || 'Loading address...'}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FullscreenIcon />}
                                        onClick={() => setFullscreenOpen(true)}
                                        sx={{
                                            borderColor: colors.divider,
                                            color: colors.text,
                                            '&:hover': {
                                                borderColor: colors.primary,
                                                bgcolor: colors.hover,
                                            }
                                        }}
                                    >
                                        View Fullscreen
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<RefreshIcon />}
                                        onClick={handleRefreshLocation}
                                        disabled={refreshLoading}
                                        sx={{
                                            bgcolor: colors.primary,
                                            color: '#fff',
                                            '&:hover': {
                                                bgcolor: '#c05905ff',
                                            }
                                        }}
                                    >
                                        {refreshLoading ? 'Refreshing...' : 'Refresh Location'}
                                    </Button>
                                </Box>
                            </Paper>
                        ) : (
                            <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255,152,0,0.08)', color: colors.text }}>
                                <Typography variant="body1" sx={{ color: colors.text, mb: 1 }}>
                                    Location data not available for {selectedChild.name}. Request a location
                                    refresh from the device.
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<RefreshIcon />}
                                        onClick={handleRefreshLocation}
                                        disabled={refreshLoading}
                                        sx={{
                                            bgcolor: colors.primary,
                                            color: '#fff',
                                            '&:hover': {
                                                bgcolor: '#c05905ff',
                                            }
                                        }}
                                    >
                                        {refreshLoading ? 'Requesting...' : 'Request Location'}
                                    </Button>
                                </Box>
                            </Alert>
                        )}
                    </>
                )}

                {/* Fullscreen Map Dialog */}
                <Dialog
                    open={fullscreenOpen}
                    onClose={() => setFullscreenOpen(false)}
                    maxWidth="xl"
                    fullWidth
                    fullScreen
                    PaperProps={{
                        sx: {
                            bgcolor: colors.cardBg,
                            color: colors.text,
                        },
                    }}
                >
                    <DialogTitle sx={{ bgcolor: colors.cardBg, borderBottom: `1px solid ${colors.divider}` }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" sx={{ color: colors.text }}>
                                {selectedChild?.name}'s Location - Fullscreen
                            </Typography>
                            <IconButton onClick={() => setFullscreenOpen(false)} sx={{ color: colors.text }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0, height: '100%' }}>
                        {location && (
                            <MapContainer
                                center={[location.latitude, location.longitude]}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[location.latitude, location.longitude]}>
                                    <Popup>
                                        <strong>📍 {selectedChild?.name}'s Location</strong>
                                        <br />
                                        {address || 'Loading address...'}
                                        <br />
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                        </Typography>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Location;
