import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, Chip, Switch, FormControlLabel, Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean' | 'textarea';
  multiline?: boolean;
}

interface ContentManagePageProps {
  title: string;
  resource: string;
  fields: FieldConfig[];
  columns: { key: string; label: string }[];
}

export const ContentManagePage = ({ title, resource, fields, columns }: ContentManagePageProps) => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cms', resource],
    queryFn: async () => (await api.get(`/cms/${resource}`)).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: () => editItem
      ? api.put(`/cms/${resource}/${editItem._id}`, form)
      : api.post(`/cms/${resource}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', resource] });
      setDialogOpen(false);
      setForm({});
      setEditItem(null);
    },
    onError: (err: unknown) => setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cms/${resource}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', resource] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/cms/${resource}/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', resource] }),
  });

  const items = data?.items || [];

  const openCreate = () => {
    setEditItem(null);
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: f.type === 'boolean' ? true : '' }), {}));
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditItem(item);
    setForm({ ...item });
    setError('');
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>{title}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add New</Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={columns.length + 2}><Skeleton /></TableCell></TableRow>
              )) : items.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 2}><EmptyState actionLabel="Add New" onAction={openCreate} /></TableCell></TableRow>
              ) : items.map((item: Record<string, unknown>) => (
                <TableRow key={item._id as string} hover>
                  {columns.map(c => <TableCell key={c.key}>{String(item[c.key] ?? '-')}</TableCell>)}
                  <TableCell>
                    <Chip label={item.isActive ? 'Active' : 'Inactive'} color={item.isActive ? 'success' : 'default'} size="small"
                      onClick={() => toggleMutation.mutate(item._id as string)} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(item)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(item._id as string)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'Create'} {title.slice(0, -1)}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {fields.map(f => f.type === 'boolean' ? (
            <FormControlLabel key={f.key} control={
              <Switch checked={!!form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.checked })} />
            } label={f.label} sx={{ display: 'block', my: 1 }} />
          ) : (
            <TextField key={f.key} fullWidth label={f.label} type={f.type === 'number' ? 'number' : 'text'}
              multiline={f.multiline} rows={f.multiline ? 3 : 1} margin="dense"
              value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? +e.target.value : e.target.value })} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
