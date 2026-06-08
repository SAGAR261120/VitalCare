import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  loading?: boolean;
}

export const StatCard = ({ title, value, icon, color, loading }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      {loading ? (
        <Skeleton variant="rectangular" height={80} />
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}20`,
              color,
            }}>
            {icon}
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);
