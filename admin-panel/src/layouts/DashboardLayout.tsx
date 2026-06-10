import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/themeSlice';

const DRAWER_WIDTH = 260;

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/users', label: 'Users', icon: <PeopleIcon /> },
  { path: '/admins', label: 'Admins', icon: <AdminPanelSettingsIcon />, superAdminOnly: true },
  { path: '/content/banners', label: 'Banners', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/packages', label: 'Health Packages', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/specialists', label: 'Specialists', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/membership', label: 'Membership', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/insurance', label: 'Insurance Plans', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/insurance-submissions', label: 'Insurance Submissions', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/cycle-tips', label: 'Cycle Wellness Tips', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/categories', label: 'Categories', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/onboarding', label: 'Onboarding', icon: <DashboardIcon />, group: 'content' },
  { path: '/content/rewards', label: 'Rewards', icon: <DashboardIcon />, group: 'content' },
  { path: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const themeMode = useAppSelector(s => s.theme.mode);

  const drawer = (
    <Box sx={{ py: 2 }}>
      <Box px={3} py={2}>
        <Typography variant="h6" fontWeight={800} color="primary">
          VitalCare
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Admin Panel
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, mt: 1 }}>
        {navItems
          .filter(item => !item.superAdminOnly || user?.role === 'super_admin')
          .map(item => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
          </Typography>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { dispatch(logout()); navigate('/login'); }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' },
          }}>
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
