import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, Alert, Skeleton, Switch, FormControlLabel, Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { EmptyState } from '../components/EmptyState';
import { ImageUploadField } from '../components/ImageUploadField';
import api from '../services/api';

interface InsurancePlanItem {
  _id: string;
  provider: string;
  name: string;
  description?: string;
  coverage: number;
  premium: number;
  tenure?: string;
  image?: string;
  pdfUrl?: string;
  cashlessHospitals?: string;
  sumInsured?: number;
  subLimits?: string;
  noClaimBonus?: string;
  waitingPeriod?: string;
  claimSettlementRatio?: string;
  coPayment?: string;
  recommended: boolean;
  isActive: boolean;
  sortOrder?: number;
}

const emptyForm = {
  provider: '',
  name: '',
  description: '',
  coverage: 0,
  premium: 0,
  tenure: '1 Year',
  image: '',
  pdfUrl: '',
  cashlessHospitals: '',
  sumInsured: 0,
  subLimits: '',
  noClaimBonus: '',
  waitingPeriod: '',
  claimSettlementRatio: '',
  coPayment: '',
  recommended: false,
  isActive: true,
  sortOrder: 0,
};

export const InsurancePlansManagePage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<InsurancePlanItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cms', 'insurance-plans', page, rowsPerPage, search],
    queryFn: async () => {
      const res = await api.get('/cms/insurance-plans', {
        params: { page: page + 1, limit: rowsPerPage, search: search || undefined },
      });
      return res.data.data;
    },
  });

  const items: InsurancePlanItem[] = data?.items || [];
  const total = data?.pagination?.total || 0;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        coverage: Number(form.coverage),
        premium: Number(form.premium),
        sumInsured: form.sumInsured ? Number(form.sumInsured) : undefined,
        sortOrder: Number(form.sortOrder),
      };
      if (editItem) return api.put(`/cms/insurance-plans/${editItem._id}`, payload);
      return api.post('/cms/insurance-plans', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'insurance-plans'] });
      setDialogOpen(false);
      setEditItem(null);
      setForm(emptyForm);
      setError('');
    },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Save failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cms/insurance-plans/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'insurance-plans'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/cms/insurance-plans/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'insurance-plans'] }),
  });

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (item: InsurancePlanItem) => {
    setEditItem(item);
    setForm({
      provider: item.provider,
      name: item.name,
      description: item.description || '',
      coverage: item.coverage,
      premium: item.premium,
      tenure: item.tenure || '1 Year',
      image: item.image || '',
      pdfUrl: item.pdfUrl || '',
      cashlessHospitals: item.cashlessHospitals || '',
      sumInsured: item.sumInsured || 0,
      subLimits: item.subLimits || '',
      noClaimBonus: item.noClaimBonus || '',
      waitingPeriod: item.waitingPeriod || '',
      claimSettlementRatio: item.claimSettlementRatio || '',
      coPayment: item.coPayment || '',
      recommended: item.recommended,
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0,
    });
    setError('');
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Insurance Plans</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Plan</Button>
      </Box>

      <Card sx={{ mb: 2, p: 2 }}>
        <TextField
          size="small"
          placeholder="Search provider or plan..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ minWidth: 280 }}
        />
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Tenure</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton /></TableCell></TableRow>
              )) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7}><EmptyState title="No insurance plans" description="Add your first plan." /></TableCell></TableRow>
              ) : items.map(item => (
                <TableRow key={item._id} hover>
                  <TableCell>{item.provider}</TableCell>
                  <TableCell>
                    {item.name}
                    {item.recommended && <Chip size="small" icon={<StarIcon />} label="Recommended" color="primary" sx={{ ml: 1 }} />}
                  </TableCell>
                  <TableCell>₹{item.coverage?.toLocaleString('en-IN')}</TableCell>
                  <TableCell>₹{item.premium?.toLocaleString('en-IN')}/yr</TableCell>
                  <TableCell>{item.tenure}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={item.isActive ? 'Active' : 'Inactive'}
                      color={item.isActive ? 'success' : 'default'}
                      onClick={() => toggleMutation.mutate(item._id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(item)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(item._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editItem ? 'Edit Insurance Plan' : 'Add Insurance Plan'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Provider" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Plan Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Grid>
            <Grid size={12}><TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Coverage (₹)" value={form.coverage} onChange={e => setForm({ ...form, coverage: +e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Premium (₹/year)" value={form.premium} onChange={e => setForm({ ...form, premium: +e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Tenure" value={form.tenure} onChange={e => setForm({ ...form, tenure: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><ImageUploadField label="Plan Image" value={form.image} onChange={url => setForm({ ...form, image: url })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><ImageUploadField label="Plan PDF" value={form.pdfUrl} onChange={url => setForm({ ...form, pdfUrl: url })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Sum Insured" value={form.sumInsured} onChange={e => setForm({ ...form, sumInsured: +e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Cashless Hospitals" value={form.cashlessHospitals} onChange={e => setForm({ ...form, cashlessHospitals: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Claim Settlement Ratio" value={form.claimSettlementRatio} onChange={e => setForm({ ...form, claimSettlementRatio: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Sub Limits" value={form.subLimits} onChange={e => setForm({ ...form, subLimits: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="No Claim Bonus" value={form.noClaimBonus} onChange={e => setForm({ ...form, noClaimBonus: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Waiting Period" value={form.waitingPeriod} onChange={e => setForm({ ...form, waitingPeriod: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Co-Payment" value={form.coPayment} onChange={e => setForm({ ...form, coPayment: e.target.value })} /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Sort Order" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: +e.target.value })} /></Grid>
            <Grid size={12}>
              <FormControlLabel control={<Switch checked={form.recommended} onChange={e => setForm({ ...form, recommended: e.target.checked })} />} label="Recommended (show on home)" />
              <FormControlLabel control={<Switch checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />} label="Active" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {editItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
