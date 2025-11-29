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
    <Box sx={{ width: '100%', minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Box sx={{ p: { xs: 3, sm: 4 }, width: 520, maxWidth: '94%', borderRadius: 2, boxShadow: '0 12px 40px rgba(0,0,0,0.6)', bgcolor: '#0b0b0b', border: '1px solid rgba(255,255,255,0.04)', color: '#fff' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box component="img" src="/HeaderLogoImage.png" alt="logo" onError={(e) => { e.target.onerror = null; e.target.src = '/HeaderLogo.png'; }} sx={{ width: 140, mx: 'auto', display: 'block' }} />
        </Box>

        <Typography variant="h5" align="center" mb={1} sx={{ fontWeight: '800', color: '#fff' }}>Create AegistNet Account</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!registered ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} variant="filled" InputProps={{ sx: { bgcolor: '#0f0f0f', color: '#fff', borderRadius: 1 } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} />
            <TextField fullWidth label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required variant="filled" InputProps={{ sx: { bgcolor: '#0f0f0f', color: '#fff', borderRadius: 1 } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} />
            <TextField fullWidth label="Password *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} required variant="filled" InputProps={{ sx: { bgcolor: '#0f0f0f', color: '#fff', borderRadius: 1 } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} />
            <TextField fullWidth label="Confirm password *" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} sx={{ mb: 3 }} required variant="filled" InputProps={{ sx: { bgcolor: '#0f0f0f', color: '#fff', borderRadius: 1 } }} InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }} />

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ backgroundColor: '#EE791A', '&:hover': { backgroundColor: '#c05905ff' }, mb: 2 }}>{loading ? 'Creating...' : 'Create account'}</Button>

            <Box mt={1} textAlign="center">
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Already have an account?{' '}
                <Link component="button" variant="body2" onClick={() => navigate('/login')} sx={{ color: '#EE791A' }}>Sign in</Link>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            {infoMessage && <Alert severity="success" sx={{ mb: 2 }}>{infoMessage}</Alert>}
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Button variant="contained" onClick={handleResend} disabled={resendLoading} sx={{ backgroundColor: '#EE791A', '&:hover': { backgroundColor: '#c05905ff' } }}>{resendLoading ? 'Resending...' : (verificationSent ? 'Resend verification email' : 'Send verification email')}</Button>
              <Button variant="outlined" onClick={() => navigate('/login')} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.12)' }}>Go to Login</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Register;
