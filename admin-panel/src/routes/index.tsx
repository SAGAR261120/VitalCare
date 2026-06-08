import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UsersPage } from '../pages/UsersPage';
import { AdminsPage } from '../pages/AdminsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SettingsPage } from '../pages/SettingsPage';
import {
  BannersPage, HealthPackagesPage, SpecialistsPage, MembershipPlansPage,
  InsurancePlansPage, CategoriesPage, OnboardingPage, RewardsManagePage,
} from '../pages/content';

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
      <Route path="content/banners" element={<BannersPage />} />
      <Route path="content/packages" element={<HealthPackagesPage />} />
      <Route path="content/specialists" element={<SpecialistsPage />} />
      <Route path="content/membership" element={<MembershipPlansPage />} />
      <Route path="content/insurance" element={<InsurancePlansPage />} />
      <Route path="content/categories" element={<CategoriesPage />} />
      <Route path="content/onboarding" element={<OnboardingPage />} />
      <Route path="content/rewards" element={<RewardsManagePage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
