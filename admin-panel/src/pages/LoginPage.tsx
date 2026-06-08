import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, InputAdornment, IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCredentials } from '../store/authSlice';
import api from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token, refreshToken } = data.data;
      if (!['admin', 'super_admin'].includes(user.role)) {
        setError('Access denied. Admin credentials required.');
        return;
      }
      dispatch(setCredentials({ user, token, refreshToken }));
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center"
      sx={{ background: 'linear-gradient(135deg, #EDE9FE 0%, #E0F2FE 50%, #ECFDF5 100%)' }}>
      <Card sx={{ width: 420, maxWidth: '90%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <LocalHospitalIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={800}>VitalCare Admin</Typography>
            <Typography color="text.secondary">Sign in to your dashboard</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" value={email}
              onChange={e => setEmail(e.target.value)} margin="normal" required />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)} margin="normal" required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
            <Button fullWidth type="submit" variant="contained" size="large"
              disabled={loading} sx={{ mt: 3, py: 1.5 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
