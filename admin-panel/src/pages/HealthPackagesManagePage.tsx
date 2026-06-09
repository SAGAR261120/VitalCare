import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, MenuItem, Alert, Skeleton, Switch, FormControlLabel,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import { EmptyState } from '../components/EmptyState';
import { ImageUploadField } from '../components/ImageUploadField';
import { ArrayFieldInput } from '../components/ArrayFieldInput';
import { resolveMediaUrl } from '../utils/mediaUrl';
import api from '../services/api';

interface PackageCategory {
  _id: string;
  name: string;
}

interface HealthPackageItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
  category?: PackageCategory | string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  includedTests?: string[];
  excludedTests?: string[];
  benefits?: string[];
  preparationInstructions?: string;
  recommendedFor?: string[];
  packageDuration?: string;
  reportDeliveryTime?: string;
  testCount?: number;
  badge?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder?: number;
}

const emptyForm = {
  name: '',
  code: '',
  description: '',
  category: '',
  price: 0,
  originalPrice: 0,
  discount: 0,
  image: '',
  includedTests: [''],
  excludedTests: [''],
  benefits: [''],
  preparationInstructions: '',
  recommendedFor: [''],
  packageDuration: '',
  reportDeliveryTime: '',
  badge: '',
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

const cleanArray = (items: string[]) => items.map(s => s.trim()).filter(Boolean);

export const HealthPackagesManagePage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewItem, setViewItem] = useState<HealthPackageItem | null>(null);
  const [editItem, setEditItem] = useState<HealthPackageItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['cms', 'categories', 'health-package'],
    queryFn: async () => (await api.get('/cms/categories', { params: { scope: 'health-package', limit: 50 } })).data.data,
  });

  const categories: PackageCategory[] = categoriesData?.items || [];

  const { data, isLoading } = useQuery({
    queryKey: ['cms', 'health-packages', page, rowsPerPage, search, filterActive, filterFeatured, filterCategory],
    queryFn: async () => {
      const res = await api.get('/cms/health-packages', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: search || undefined,
          isActive: filterActive || undefined,
          isFeatured: filterFeatured || undefined,
          category: filterCategory || undefined,
        },
      });
      return res.data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        includedTests: cleanArray(form.includedTests),
        excludedTests: cleanArray(form.excludedTests),
        benefits: cleanArray(form.benefits),
        recommendedFor: cleanArray(form.recommendedFor),
        category: form.category || undefined,
      };
      if (editItem) return api.put(`/cms/health-packages/${editItem._id}`, payload);
      return api.post('/cms/health-packages', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'health-packages'] });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditItem(null);
    },
    onError: (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/cms/health-packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'health-packages'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/cms/health-packages/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'health-packages'] }),
  });

  const items: HealthPackageItem[] = data?.items || [];
  const total = data?.pagination?.total || 0;

  const categoryName = useMemo(() => {
    const map = new Map(categories.map(c => [c._id, c.name]));
    return (pkg: HealthPackageItem) => {
      if (!pkg.category) return '-';
      if (typeof pkg.category === 'object') return pkg.category.name;
      return map.get(pkg.category) || '-';
    };
  }, [categories]);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (item: HealthPackageItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      code: item.code,
      description: item.description || '',
      category: typeof item.category === 'object' ? item.category._id : (item.category as string) || '',
      price: item.price,
      originalPrice: item.originalPrice || 0,
      discount: item.discount || 0,
      image: item.image || '',
      includedTests: item.includedTests?.length ? item.includedTests : [''],
      excludedTests: item.excludedTests?.length ? item.excludedTests : [''],
      benefits: item.benefits?.length ? item.benefits : [''],
      preparationInstructions: item.preparationInstructions || '',
      recommendedFor: item.recommendedFor?.length ? item.recommendedFor : [''],
      packageDuration: item.packageDuration || '',
      reportDeliveryTime: item.reportDeliveryTime || '',
      badge: item.badge || '',
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder || 0,
    });
    setError('');
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Health Package Master</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Package</Button>
      </Box>

      <Card sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search packages..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ minWidth: 260 }}
          />
          <TextField select size="small" label="Status" value={filterActive} onChange={e => { setFilterActive(e.target.value); setPage(0); }} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
          <TextField select size="small" label="Featured" value={filterFeatured} onChange={e => { setFilterFeatured(e.target.value); setPage(0); }} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Featured</MenuItem>
            <MenuItem value="false">Not Featured</MenuItem>
          </TextField>
          <TextField select size="small" label="Category" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(0); }} sx={{ minWidth: 180 }}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Package</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Tests</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={8}><Skeleton /></TableCell></TableRow>
              )) : items.length === 0 ? (
                <TableRow><TableCell colSpan={8}><EmptyState actionLabel="Add Package" onAction={openCreate} /></TableCell></TableRow>
              ) : items.map(item => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      {item.image && (
                        <Box component="img" src={resolveMediaUrl(item.image)} alt="" sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                        {item.isFeatured && <Chip icon={<StarIcon />} label="Featured" size="small" color="warning" sx={{ mt: 0.5 }} />}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{categoryName(item)}</TableCell>
                  <TableCell>₹{item.price}{item.discount ? ` (${item.discount}% off)` : ''}</TableCell>
                  <TableCell>{item.testCount || item.includedTests?.length || 0}</TableCell>
                  <TableCell>{item.sortOrder ?? 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.isActive ? 'Active' : 'Inactive'}
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                      onClick={() => toggleMutation.mutate(item._id)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setViewItem(item)}><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => openEdit(item)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(item._id)}><DeleteIcon fontSize="small" /></IconButton>
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
        <DialogTitle>{editItem ? 'Edit' : 'Add'} Health Package</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Package Name" margin="dense" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Package Code" margin="dense" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" margin="dense" multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Package Category" margin="dense" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Badge" margin="dense" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Package Price (MRP)" type="number" margin="dense" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: +e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Discount Price" type="number" margin="dense" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Display Order" type="number" margin="dense" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: +e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Package Duration" margin="dense" value={form.packageDuration} onChange={e => setForm({ ...form, packageDuration: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Report Delivery Time" margin="dense" value={form.reportDeliveryTime} onChange={e => setForm({ ...form, reportDeliveryTime: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <ImageUploadField label="Package Image/Icon" value={form.image} onChange={url => setForm({ ...form, image: url })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Preparation Instructions" margin="dense" multiline rows={3} value={form.preparationInstructions} onChange={e => setForm({ ...form, preparationInstructions: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArrayFieldInput label="Included Tests" value={form.includedTests} onChange={items => setForm({ ...form, includedTests: items })} placeholder="Test name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArrayFieldInput label="Excluded Tests" value={form.excludedTests} onChange={items => setForm({ ...form, excludedTests: items })} placeholder="Excluded test" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArrayFieldInput label="Benefits" value={form.benefits} onChange={items => setForm({ ...form, benefits: items })} placeholder="Benefit" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArrayFieldInput label="Recommended For" value={form.recommendedFor} onChange={items => setForm({ ...form, recommendedFor: items })} placeholder="Audience" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Switch checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />} label="Package Status (Active)" />
              <FormControlLabel control={<Switch checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />} label="Featured Package" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Package Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {viewItem.image && <Box component="img" src={resolveMediaUrl(viewItem.image)} alt="" sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 2 }} />}
              <Typography variant="h6">{viewItem.name}</Typography>
              <Typography variant="body2" color="text.secondary">Code: {viewItem.code}</Typography>
              <Typography variant="body2">{viewItem.description}</Typography>
              <Typography variant="body2"><strong>Price:</strong> ₹{viewItem.price} {viewItem.originalPrice ? `(MRP ₹${viewItem.originalPrice})` : ''}</Typography>
              <Typography variant="body2"><strong>Tests:</strong> {viewItem.includedTests?.join(', ') || '-'}</Typography>
              <Typography variant="body2"><strong>Benefits:</strong> {viewItem.benefits?.join(', ') || '-'}</Typography>
              <Typography variant="body2"><strong>Preparation:</strong> {viewItem.preparationInstructions || '-'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
