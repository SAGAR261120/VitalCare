import { useQuery } from '@tanstack/react-query';
import { Grid, Card, CardContent, Typography, Box, Skeleton, List, ListItem, ListItemText, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '../components/StatCard';
import api from '../services/api';

const COLORS = ['#7C3AED', '#10B981', '#06B6D4', '#F97316'];

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
  });

  const stats = data?.stats;
  const charts = data?.charts;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Dashboard Overview</Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<PeopleIcon />} color="#7C3AED" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Users" value={stats?.activeUsers ?? 0} icon={<CheckCircleIcon />} color="#10B981" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="New Registrations" value={stats?.newRegistrations ?? 0} icon={<PersonAddIcon />} color="#06B6D4" loading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue" value={`₹${(stats?.revenue ?? 0).toLocaleString()}`} icon={<AttachMoneyIcon />} color="#F97316" loading={isLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Registration Trend</Typography>
              {isLoading ? <Skeleton height={300} /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts?.registrationTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>User Activity</Typography>
              {isLoading ? <Skeleton height={300} /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={charts?.userActivity || []} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                      {(charts?.userActivity || []).map((_: unknown, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Recent Activities</Typography>
              {isLoading ? <Skeleton height={200} /> : (
                <List>
                  {(data?.recentActivities || []).map((activity: { id: string; action: string; description: string; createdAt: string }) => (
                    <ListItem key={activity.id} divider>
                      <ListItemText
                        primary={activity.description}
                        secondary={new Date(activity.createdAt).toLocaleString()}
                      />
                      <Chip label={activity.action} size="small" color="primary" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
