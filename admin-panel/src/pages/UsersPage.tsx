import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, MenuItem, Alert, Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = { firstName: '', lastName: '', email: '', password: '', phone: '' };

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, rowsPerPage, search, filterActive],
    queryFn: async () => {
      const res = await api.get('/users/manage', {
        params: { page: page + 1, limit: rowsPerPage, search, isActive: filterActive || undefined, role: 'user' },
      });
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editUser) {
        return api.put(`/users/manage/${editUser.id}`, form);
      }
      return api.post('/users/manage', { ...form, role: 'user' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditUser(null);
    },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/manage/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/manage/${id}/toggle-status`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const openCreate = () => { setEditUser(null); setForm(emptyForm); setError(''); setDialogOpen(true); };
  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: '', phone: user.phone || '' });
    setError('');
    setDialogOpen(true);
  };

  const users: User[] = data?.users || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Create User</Button>
      </Box>

      <Card sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField size="small" placeholder="Search users..." value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ minWidth: 280 }} />
          <TextField size="small" select label="Status" value={filterActive}
            onChange={e => setFilterActive(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
        </Box>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton /></TableCell></TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={6}><EmptyState actionLabel="Create User" onAction={openCreate} /></TableCell></TableRow>
              ) : users.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(user)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => toggleMutation.mutate(user.id)}>
                      {user.isActive ? <ToggleOffIcon fontSize="small" /> : <ToggleOnIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(user.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={data?.pagination?.total || 0}
          page={page} onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="First Name" margin="dense" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <TextField fullWidth label="Last Name" margin="dense" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Phone" margin="dense" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {!editUser && <TextField fullWidth label="Password" type="password" margin="dense" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
