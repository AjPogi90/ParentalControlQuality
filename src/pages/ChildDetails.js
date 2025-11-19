import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Grid,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useChildData, toggleDeviceLock, updateBlockedApp, requestLocationRefresh, updateChildName } from '../hooks/useFirebase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ChildDetails = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(
    searchParams.get('tab') === 'apps' ? 1 : searchParams.get('tab') === 'location' ? 2 : 0
  );
  const [appSearch, setAppSearch] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { data: child, loading, error } = useChildData(childId);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeviceLockToggle = async (event) => {
    setLoadingAction(true);
    const result = await toggleDeviceLock(childId, event.target.checked);
    if (result.success) {
      setSuccessMessage(event.target.checked ? 'Device locked' : 'Device unlocked');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setLoadingAction(false);
  };

  const handleAppToggle = async (appIndex, newBlockedState) => {
    setLoadingAction(true);
    try {
      const result = await updateBlockedApp(childId, appIndex, newBlockedState);
      if (result.success) {
        setSuccessMessage(newBlockedState ? 'App blocked' : 'App unblocked');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setSuccessMessage(`Failed to update app: ${result.error?.message || 'Unknown error'}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('App toggle error:', error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setLoadingAction(false);
  };

  const handleLocationRefresh = async () => {
    setLoadingAction(true);
    const result = await requestLocationRefresh(childId);
    if (result.success) {
      setSuccessMessage('Location refresh requested');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setLoadingAction(false);
  };

  const handleEditName = () => {
    setEditingName(true);
    setTempName(child.name || '');
  };

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      setSuccessMessage('Name cannot be empty');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    setLoadingAction(true);
    const result = await updateChildName(childId, tempName.trim());
    setLoadingAction(false);
    if (result.success) {
      setEditingName(false);
      setSuccessMessage('Child name updated');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setSuccessMessage(`Failed to update name: ${result.error?.message || 'Unknown error'}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setTempName('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !child) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading child data</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Convert apps object/array to array format if needed
  const appsArray = child.apps 
    ? Array.isArray(child.apps) 
      ? child.apps 
      : Object.entries(child.apps).map(([key, value]) => ({ ...value, appId: key }))
    : [];

  const filteredApps = appsArray.filter((app) =>
    app.appName?.toLowerCase().includes(appSearch.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Device Info" />
          <Tab label="Apps" />
          <Tab label="Location" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Child Name</Typography>
                {editingName ? (
                  <Stack direction="row" gap={1} alignItems="center">
                    <TextField
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      size="small"
                      fullWidth
                      disabled={loadingAction}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveName}
                      disabled={loadingAction}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancelEdit}
                      disabled={loadingAction}
                    >
                      Cancel
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{child.name}</Typography>
                    <Button size="small" onClick={handleEditName} disabled={loadingAction}>Edit</Button>
                  </Stack>
                )}
              </Box>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Child Email</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>{child.email}</Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Linked Parent Account</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>{child.parentEmail}</Typography>
              </Box>

              {/* Removed the app deleted chip per user request; parent toggle remains */}
            </Stack>
          </CardContent>

          <CardActions sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={child.deviceLocked || false}
                  onChange={handleDeviceLockToggle}
                  disabled={loadingAction}
                />
              }
              label={<Typography sx={{ fontWeight: 500 }}>Device Active / Paused</Typography>}
            />
          </CardActions>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Emergency Lock Device</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              This will immediately lock the device. The child will need your approval to unlock it.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeviceLockToggle({ target: { checked: true } })}
              disabled={loadingAction || child.deviceLocked}
              sx={{ fontWeight: 600 }}
            >
              🔒 Emergency Lock
            </Button>
          </CardActions>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search apps..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              InputProps={{
                startAdornment: '🔍 ',
              }}
            />

            {filteredApps.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                {appSearch ? '❌ No apps match your search' : '📦 No apps found'}
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredApps.map((app, filteredIndex) => {
                  // Find the original index in the full appsArray
                  const originalIndex = appsArray.findIndex(a => 
                    a.appName === app.appName && a.packageName === app.packageName
                  );
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={app.appId || originalIndex}>
                      <Paper sx={{ 
                        p: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        }
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" gap={1}>
                          <Box flex={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {app.appName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {app.packageName}
                            </Typography>
                            <Box mt={1}>
                              <Chip
                                label={app.blocked ? '🚫 Blocked' : '✅ Allowed'}
                                color={app.blocked ? 'error' : 'success'}
                                size="small"
                                variant="filled"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </Box>
                          </Box>
                          <Switch
                            checked={app.blocked || false}
                            onChange={(e) => handleAppToggle(app.appId || originalIndex, e.target.checked)}
                            disabled={loadingAction}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>📍 Current Location</Typography>
                {child.location ? (
                  <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {child.location.latitude.toFixed(6)}, {child.location.longitude.toFixed(6)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">Location not available</Typography>
                )}
              </Box>

              {child.location && (
                <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', position: 'relative', boxShadow: 2, border: '2px solid', borderColor: 'primary.main' }}>
                  <MapContainer
                    center={[child.location.latitude, child.location.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[child.location.latitude, child.location.longitude]}>
                      <Popup>
                        <strong>📍 {child.name}'s Location</strong><br />
                        Latitude: {child.location.latitude.toFixed(6)}<br />
                        Longitude: {child.location.longitude.toFixed(6)}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              )}

              {!child.location && (
                <Alert severity="warning" sx={{ borderRadius: 1 }}>
                  ⚠️ Location data not available. Request a refresh from the device.
                </Alert>
              )}
            </Stack>
          </CardContent>

          <CardActions>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleLocationRefresh}
              disabled={loadingAction}
              sx={{ fontWeight: 600 }}
            >
              Refresh Location
            </Button>
          </CardActions>
        </Card>
      </TabPanel>
    </Container>
  );
};

export default ChildDetails;
