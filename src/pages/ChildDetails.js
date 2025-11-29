import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Stack,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useChildData, updateChildName } from '../hooks/useFirebase';
import { useTheme } from '../contexts/ThemeContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChildDetails = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [loadingAction, setLoadingAction] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { data: child, loading, error } = useChildData(childId);

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
      <Box sx={{ minHeight: '100vh', bgcolor: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (error || !child) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: colors.background, py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ bgcolor: 'rgba(255,0,0,0.08)', color: colors.text, mb: 3 }}>
            Error loading child data
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: colors.text,
              borderColor: colors.divider,
              '&:hover': {
                bgcolor: colors.hover,
                borderColor: colors.primary,
              }
            }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.background, py: 4 }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              textTransform: 'none',
              color: colors.primary,
              '&:hover': {
                bgcolor: colors.hover,
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3, bgcolor: 'rgba(76,175,80,0.08)', color: colors.text }}
            onClose={() => setSuccessMessage('')}
          >
            {successMessage}
          </Alert>
        )}

        <Card sx={{ mb: 3, bgcolor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: colors.inputBg, borderRadius: 1, border: `1px solid ${colors.divider}` }}>
                <Typography variant="body2" sx={{ mb: 0.5, color: colors.textSecondary }}>
                  Child Name
                </Typography>
                {editingName ? (
                  <Stack direction="row" gap={1} alignItems="center">
                    <TextField
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      size="small"
                      fullWidth
                      disabled={loadingAction}
                      variant="filled"
                      sx={{
                        '& .MuiFilledInput-root': {
                          bgcolor: colors.background,
                          borderRadius: 1,
                          '&:before, &:after': {
                            display: 'none',
                          },
                        },
                        '& input': {
                          color: colors.text,
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveName}
                      disabled={loadingAction}
                      sx={{
                        bgcolor: colors.primary,
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#c05905ff',
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancelEdit}
                      disabled={loadingAction}
                      sx={{
                        borderColor: colors.divider,
                        color: colors.text,
                        '&:hover': {
                          borderColor: colors.primary,
                          bgcolor: colors.hover,
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                      {child.name}
                    </Typography>
                    <Button
                      size="small"
                      onClick={handleEditName}
                      disabled={loadingAction}
                      sx={{
                        color: colors.primary,
                        '&:hover': {
                          bgcolor: colors.hover,
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </Stack>
                )}
              </Box>

              <Box sx={{ p: 2, bgcolor: colors.inputBg, borderRadius: 1, border: `1px solid ${colors.divider}` }}>
                <Typography variant="body2" sx={{ mb: 0.5, color: colors.textSecondary }}>
                  Child Email
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, wordBreak: 'break-all', color: colors.text }}>
                  {child.email}
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: colors.inputBg, borderRadius: 1, border: `1px solid ${colors.divider}` }}>
                <Typography variant="body2" sx={{ mb: 0.5, color: colors.textSecondary }}>
                  Linked Parent Account
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, wordBreak: 'break-all', color: colors.text }}>
                  {child.parentEmail}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ChildDetails;
