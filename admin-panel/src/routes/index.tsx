import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UsersPage } from '../pages/UsersPage';
import { AdminsPage } from '../pages/AdminsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SettingsPage } from '../pages/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="admins" element={<AdminsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
