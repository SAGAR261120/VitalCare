import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, CardContent, TextField, Button, Grid, Tabs, Tab, Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { setTheme } from '../store/themeSlice';
import api from '../services/api';

export const SettingsPage = () => {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const themeMode = useAppSelector(s => s.theme.mode);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data.data,
  });

  const [appSettings, setAppSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName, lastName: user.lastName, phone: '' });
  }, [user]);

  const saveSettingsMutation = useMutation({
    mutationFn: (settingsArr: { key: string; value: unknown }[]) => api.put('/settings', { settings: settingsArr }),
    onSuccess: () => { setMsg('Settings saved'); queryClient.invalidateQueries({ queryKey: ['settings'] }); },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => api.post('/auth/change-password', passwords),
    onSuccess: () => { setMsg('Password changed'); setPasswords({ currentPassword: '', newPassword: '' }); },
    onError: () => setMsg('Failed to change password'),
  });

  const getSetting = (key: string) => settings?.find((s: { key: string }) => s.key === key)?.value ?? '';

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>
      {msg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Profile" />
        <Tab label="Application" />
        <Tab label="Theme" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" value={profile.firstName || user?.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value={profile.lastName || user?.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" value={user?.email} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Current Password" type="password" value={passwords.currentPassword}
                  onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="New Password" type="password" value={passwords.newPassword}
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={() => changePasswordMutation.mutate()}>Change Password</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="App Name" defaultValue={getSetting('app_name')}
                  onChange={e => setAppSettings({ ...appSettings, app_name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Support Email" defaultValue={getSetting('support_email')}
                  onChange={e => setAppSettings({ ...appSettings, support_email: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" startIcon={<SaveIcon />}
                  onClick={() => saveSettingsMutation.mutate(
                    Object.entries(appSettings).map(([key, value]) => ({ key, value })),
                  )}>
                  Save Application Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card>
          <CardContent>
            <Typography mb={2}>Current theme: <strong>{themeMode}</strong></Typography>
            <Button variant={themeMode === 'light' ? 'contained' : 'outlined'} sx={{ mr: 1 }}
              onClick={() => dispatch(setTheme('light'))}>Light Mode</Button>
            <Button variant={themeMode === 'dark' ? 'contained' : 'outlined'}
              onClick={() => dispatch(setTheme('dark'))}>Dark Mode</Button>
            <Box mt={3}>
              <TextField fullWidth label="Primary Color" defaultValue={getSetting('theme_primary_color')}
                onChange={e => setAppSettings({ ...appSettings, theme_primary_color: e.target.value })} />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
