import React, { useState } from 'react';
import { Container, TextField, Button, Alert, Box, Paper, Typography, Link } from '@mui/material';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    const result = await signup(email, password, name);
    setLoading(false);
    if (result.success) {
      setRegistered(true);
      setVerificationSent(Boolean(result.verificationSent));
      setInfoMessage(result.verificationSent ? 'Verification email sent. Please check your inbox.' : 'Account created. Verification email could not be sent automatically.');
    } else {
      setError(result.error?.message || 'Registration failed');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setInfoMessage('');
    try {
      const current = auth.currentUser;
      if (!current) throw new Error('No authenticated user found to send verification. Please login and resend.');
      await sendEmailVerification(current);
      setVerificationSent(true);
      setInfoMessage('Verification email resent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" py={4}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 'bold' }}>
            Create Parent Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!registered ? (
            <>
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Full name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required />
                <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} required />
                <TextField fullWidth label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} sx={{ mb: 3 }} required />
                <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
              </form>

              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </>
          ) : (
            <Box>
              {infoMessage && <Alert severity="success" sx={{ mb: 2 }}>{infoMessage}</Alert>}
              <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Button variant="contained" onClick={handleResend} disabled={resendLoading}>
                  {resendLoading ? 'Resending...' : (verificationSent ? 'Resend verification email' : 'Send verification email')}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/login')}>Go to Login</Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
