import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, MenuItem, TextField, Skeleton,
} from '@mui/material';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

interface Submission {
  _id: string;
  type: 'requirement' | 'upload';
  status: string;
  insuranceCompany?: string;
  mobileNumber?: string;
  numberOfPeople?: number;
  policyTenure?: string;
  preferredAmount?: number;
  policyName?: string;
  documentUrl?: string;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string };
}

export const InsuranceSubmissionsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cms', 'insurance-submissions', page, rowsPerPage, typeFilter],
    queryFn: async () => {
      const res = await api.get('/cms/insurance-submissions', {
        params: { page: page + 1, limit: rowsPerPage, type: typeFilter || undefined },
      });
      return res.data.data;
    },
  });

  const items: Submission[] = data?.items || [];
  const total = data?.pagination?.total || 0;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/cms/insurance-submissions/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cms', 'insurance-submissions'] }),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Insurance Submissions</Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <TextField select size="small" label="Type" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(0); }} sx={{ minWidth: 200 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="requirement">Requirements</MenuItem>
          <MenuItem value="upload">Uploads</MenuItem>
        </TextField>
      </Card>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>
              )) : items.length === 0 ? (
                <TableRow><TableCell colSpan={5}><EmptyState title="No submissions" description="User submissions will appear here." /></TableCell></TableRow>
              ) : items.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item.user ? `${item.user.firstName} ${item.user.lastName}` : '—'}</TableCell>
                  <TableCell><Chip size="small" label={item.type} /></TableCell>
                  <TableCell>
                    {item.type === 'requirement'
                      ? `${item.insuranceCompany} • ${item.mobileNumber} • ${item.numberOfPeople} people`
                      : item.policyName || item.documentUrl || '—'}
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={item.status}
                      onChange={e => statusMutation.mutate({ id: item._id, status: e.target.value })}
                    >
                      {['pending', 'reviewed', 'approved', 'rejected'].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
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
    </Box>
  );
};
