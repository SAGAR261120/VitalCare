import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem, Grid, List, ListItem, ListItemText, Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', body: '', type: 'push', targetRole: 'all' });

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data.data,
  });

  const sendMutation = useMutation({
    mutationFn: () => api.post('/notifications/send', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setForm({ title: '', body: '', type: 'push', targetRole: 'all' });
    },
  });

  const notifications = data?.notifications || [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Notification Management</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Send Notification</Typography>
              <TextField fullWidth label="Title" margin="dense" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <TextField fullWidth label="Message" margin="dense" multiline rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
              <TextField fullWidth select label="Type" margin="dense" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <MenuItem value="push">Push Notification</MenuItem>
                <MenuItem value="broadcast">Broadcast Message</MenuItem>
              </TextField>
              <TextField fullWidth select label="Target" margin="dense" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}>
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="user">Users Only</MenuItem>
                <MenuItem value="admin">Admins Only</MenuItem>
              </TextField>
              <Button fullWidth variant="contained" startIcon={<SendIcon />} sx={{ mt: 2 }}
                onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending || !form.title || !form.body}>
                {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Sent Notifications</Typography>
              <List>
                {notifications.map((n: { _id: string; title: string; body: string; type: string; targetRole: string; createdAt: string }) => (
                  <ListItem key={n._id} divider>
                    <ListItemText primary={n.title} secondary={`${n.body} — ${new Date(n.createdAt).toLocaleString()}`} />
                    <Chip label={n.type} size="small" sx={{ mr: 1 }} />
                    <Chip label={n.targetRole} size="small" color="primary" variant="outlined" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
