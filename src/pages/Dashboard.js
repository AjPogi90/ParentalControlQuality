import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import VideocamIcon from '@mui/icons-material/Videocam';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { useAuth } from '../contexts/AuthContext';
import { useChildrenList, useParentProfile } from '../hooks/useFirebase';
import { requestLocationRefresh } from '../hooks/useFirebase';
import ChildCard from '../components/ChildCard';
import ChildMap from '../components/ChildMap';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { isOnline } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const { children, loading, error } = useChildrenList(user?.email);
  const { profile: parentProfile } = useParentProfile(user?.uid);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' | 'device' | 'location' | 'apps'

  const safeChildren = children || [];
  const total = safeChildren.length;
  const onlineCount = safeChildren.filter((c) => isOnline(c.lastUpdated)).length;
  const offlineCount = total - onlineCount;

  const filteredChildren = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return safeChildren;
    return safeChildren.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [safeChildren, searchTerm]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out failed', e);
    }
    navigate('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} sm={3} md={2}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
            <List>
              <ListItemButton selected={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')}>
                <ListItemIcon>
                  <DashboardIcon color={activeSection === 'dashboard' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'device'} onClick={() => setActiveSection('device')}>
                <ListItemIcon>
                  <DevicesIcon color={activeSection === 'device' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Device" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'location'} onClick={() => setActiveSection('location')}>
                <ListItemIcon>
                  <LocationOnIcon color={activeSection === 'location' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Location" />
              </ListItemButton>
              <ListItemButton selected={activeSection === 'apps'} onClick={() => setActiveSection('apps')}>
                <ListItemIcon>
                  <BarChartIcon color={activeSection === 'apps' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Apps" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon><BookmarkIcon /></ListItemIcon>
                <ListItemText primary="Filters" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon><BookmarkIcon /></ListItemIcon>
                <ListItemText primary="ChildDetails" />
              </ListItemButton>
              
              <Divider sx={{ my: 1 }} />
              <ListItemButton>
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
              <ListItemButton onClick={handleSignOut}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                <ListItemText primary="Help" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} sm={6} md={7}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'device' && 'Connected Devices'}
                {activeSection === 'location' && 'Locations'}
                {activeSection === 'apps' && 'Applications'}
              </Typography>
              <Typography variant="body2" color="text.secondary">Welcome, {parentProfile?.name || 'Parent'}!</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                size="small"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button variant="contained" startIcon={<AddIcon />} sx={{ background: 'linear-gradient(90deg,#57a1ff,#6a8bff)', color: '#fff' }}>Add Device</Button>
            </Box>
          </Box>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg,#6fb3ff,#3a7bd5)', color: '#fff' }}>
                <Typography variant="subtitle2">App Blocking</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>Activated</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>monitoring</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', color: '#fff' }}>
                <Typography variant="subtitle2">Internet</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>Active</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Stable Network</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg,#ffd36b,#ffb84d)', color: '#fff' }}>
                <Typography variant="subtitle2">Location</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>Turn On</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Tracking is Activated</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Stats panel removed per request */}

          {/* Child/device list depending on active section */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error loading children: {error.message}
            </Alert>
          )}

          {activeSection === 'location' ? (
            // Show a map for each child
            safeChildren.length === 0 ? (
              <Alert severity="info">No child devices found.</Alert>
            ) : (
              <Grid container spacing={2}>
                {safeChildren.map((child) => (
                  <Grid item xs={12} sm={6} md={6} key={child.id}>
                    <Paper sx={{ p: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{child.name || 'Unknown'}</Typography>
                      <ChildMap location={child.location} name={child.name} />
                      <Box mt={1} display="flex" gap={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => navigate(`/child/${child.id}?tab=location`)}>View</Button>
                        <Button size="small" variant="contained" onClick={() => requestLocationRefresh(child.id)}>Refresh</Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )
          ) : activeSection === 'device' ? (
            // Show only connected/online devices
            safeChildren.filter((c) => isOnline(c.lastUpdated)).length === 0 ? (
              <Alert severity="info">No connected devices currently online.</Alert>
            ) : (
              <Grid container spacing={2}>
                {safeChildren.filter((c) => isOnline(c.lastUpdated)).map((child) => (
                  <Grid item xs={12} sm={6} md={4} key={child.id}>
                    <ChildCard
                      child={child}
                      onViewDetails={() => navigate(`/child/${child.id}`)}
                      onViewApps={() => navigate(`/child/${child.id}?tab=apps`)}
                      onViewLocation={() => navigate(`/child/${child.id}?tab=location`)}
                    />
                  </Grid>
                ))}
              </Grid>
            )
          ) : activeSection === 'apps' ? (
            // Show all children with quick Apps action
            safeChildren.length === 0 ? (
              <Alert severity="info">No child devices found.</Alert>
            ) : (
              <Grid container spacing={2}>
                {safeChildren.map((child) => (
                  <Grid item xs={12} sm={6} md={4} key={child.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{child.name || 'Unknown'}</Typography>
                      <Typography variant="body2" color="text.secondary">{child.email}</Typography>
                      <Box mt={1} display="flex" gap={1}>
                        <Button variant="contained" size="small" onClick={() => navigate(`/child/${child.id}?tab=apps`)}>View Apps</Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )
          ) : (
            // Default dashboard child cards (search-filtered)
            filteredChildren.length === 0 ? (
              <Alert severity="info">No children match your search. Add a child device in the mobile app to get started.</Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredChildren.map((child) => (
                  <Grid item xs={12} sm={6} md={4} key={child.id}>
                    <ChildCard
                      child={child}
                      onViewDetails={() => navigate(`/child/${child.id}`)}
                      onViewApps={() => navigate(`/child/${child.id}?tab=apps`)}
                      onViewLocation={() => navigate(`/child/${child.id}?tab=location`)}
                    />
                  </Grid>
                ))}
              </Grid>
            )
          )}
        </Grid>

        {/* Right column */}
        <Grid item xs={12} sm={3} md={3}>
          <Box sx={{ position: 'sticky', top: 16 }}>
            <Paper sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg,#4facfe,#00f2fe)', color: '#fff', mb: 2 }}>
              <Typography variant="subtitle2">Monitoring</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Device</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Activated</Typography>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2">Quick Stats</Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{total}</Typography>
                <Typography variant="body2" color="text.secondary">Children</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>{onlineCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Online</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{offlineCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Offline</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
