import React from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useChildrenList } from '../hooks/useFirebase';
import ChildCard from '../components/ChildCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { children, loading, error } = useChildrenList(user?.email);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome Back, Parent!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage and monitor your children's devices below
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading children: {error.message}
        </Alert>
      )}

      {children.length === 0 ? (
        <Alert severity="info">
          No children connected yet. Add a child device in the mobile app to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {children.map((child) => (
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
      )}
    </Container>
  );
};

export default Dashboard;
