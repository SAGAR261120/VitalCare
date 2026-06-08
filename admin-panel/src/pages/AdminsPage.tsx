import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
}

export const AdminsPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', permissions: [] as string[] });
  const [error, setError] = useState('');

  const { data: adminsData } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => (await api.get('/admins')).data.data,
  });

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await api.get('/admins/permissions')).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editAdmin) return api.put(`/admins/${editAdmin.id}`, form);
      return api.post('/admins', form);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admins'] }); setDialogOpen(false); },
    onError: (err: unknown) => setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] }),
  });

  const admins: Admin[] = adminsData?.admins || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>Admin Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditAdmin(null); setForm({ firstName: '', lastName: '', email: '', password: '', permissions: [] }); setDialogOpen(true); }}>
          Create Admin
        </Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.firstName} {admin.lastName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell><Chip label={admin.role} size="small" color="primary" /></TableCell>
                  <TableCell>{admin.permissions?.length || 0} permissions</TableCell>
                  <TableCell align="right">
                    {admin.role !== 'super_admin' && (
                      <>
                        <IconButton size="small" onClick={() => { setEditAdmin(admin); setForm({ firstName: admin.firstName, lastName: admin.lastName, email: admin.email, password: '', permissions: admin.permissions }); setDialogOpen(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(admin.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editAdmin ? 'Edit Admin' : 'Create Admin'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="First Name" margin="dense" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <TextField fullWidth label="Last Name" margin="dense" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {!editAdmin && <TextField fullWidth label="Password" type="password" margin="dense" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />}
          <FormControl fullWidth margin="dense">
            <InputLabel>Permissions</InputLabel>
            <Select multiple value={form.permissions} onChange={e => setForm({ ...form, permissions: e.target.value as string[] })}
              input={<OutlinedInput label="Permissions" />} renderValue={s => s.join(', ')}>
              {(permissions || []).map((p: string) => (
                <MenuItem key={p} value={p}><Checkbox checked={form.permissions.includes(p)} /><ListItemText primary={p} /></MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
