import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { isOnline as isOnlineHelper, formatTimestamp } from '../utils/constants';

const ChildCard = ({ child, onViewDetails, onViewApps, onViewLocation }) => {
  const isOnline = isOnlineHelper(child.lastUpdated);
  const lastUpdatedTime = child.lastUpdated ? formatTimestamp(child.lastUpdated) : 'Never';

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{child.name || 'Unknown Child'}</Typography>
            <Chip
              label={isOnline ? 'Online' : 'Offline'}
              color={isOnline ? 'success' : 'default'}
              size="small"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1} sx={{ wordBreak: 'break-all' }}>
          📧 {child.email || 'N/A'}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          ⏱️ Last updated: {lastUpdatedTime}
        </Typography>

        {/* App deleted indicator removed per user request */}
      </CardContent>

      <CardActions sx={{ flexDirection: 'column', gap: 1, pt: 0 }}>
        <Stack direction="row" spacing={1} width="100%">
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={onViewDetails}
            sx={{ fontWeight: 600 }}
          >
            Details
          </Button>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={onViewApps}
          >
            Apps
          </Button>
        </Stack>
        {/* Block / Unblock controls removed as requested */}
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={onViewLocation}
        >
          Location
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChildCard;
