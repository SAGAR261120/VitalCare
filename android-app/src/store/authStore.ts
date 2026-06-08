import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { api } from '../services/api';
import { appStorage, secureStorage } from '../services/storage';
import { User, UserRole } from '../types';

interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  profileRole?: string;
  gender?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  city?: string;
  avatar?: string;
}

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
};

const mapUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  email: apiUser.email,
  phone: apiUser.phone || '',
  role: (apiUser.profileRole || 'user') as UserRole,
  gender: apiUser.gender,
  pinCode: apiUser.pinCode,
  state: apiUser.state,
  district: apiUser.district,
  city: apiUser.city,
  avatar: apiUser.avatar,
});

const persistSession = async (
  token: string,
  refreshToken: string,
  user: User,
) => {
  await secureStorage.setToken(token);
  appStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  appStorage.set(STORAGE_KEYS.USER_DATA, user);
};

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  hasCompletedOnboarding: boolean;
  pendingPhone: string | null;
  initialize: () => Promise<void>;
  completeOnboarding: () => void;
  setPendingPhone: (phone: string) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    gender: string;
    pinCode: string;
    state: string;
    district: string;
    city: string;
  }) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; resetToken?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  hasCompletedOnboarding: false,
  pendingPhone: null,

  initialize: async () => {
    try {
      const onboardingComplete = appStorage.get<boolean>(
        STORAGE_KEYS.ONBOARDING_COMPLETE,
      );
      const user = appStorage.get<User>(STORAGE_KEYS.USER_DATA);
      const token = await secureStorage.getToken();

      set({
        hasCompletedOnboarding: onboardingComplete ?? false,
        isAuthenticated: !!token && !!user,
        user: user ?? null,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  completeOnboarding: () => {
    appStorage.set(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    set({ hasCompletedOnboarding: true });
  },

  setPendingPhone: phone => set({ pendingPhone: phone }),

  sendOtp: async phone => {
    const normalized = normalizePhone(phone);
    await api.auth.sendOtp(normalized);
    set({ pendingPhone: normalized });
  },

  verifyOtp: async (phone, otp) => {
    const response = await api.auth.verifyOtp(normalizePhone(phone), otp);
    const { token, refreshToken, user } = response.data.data as {
      token: string;
      refreshToken: string;
      user: ApiUser;
    };
    const mapped = mapUser(user);
    await persistSession(token, refreshToken, mapped);
    set({ isAuthenticated: true, user: mapped, pendingPhone: null });
  },

  loginWithPassword: async (phone, password) => {
    const response = await api.auth.login(normalizePhone(phone), password);
    const { token, refreshToken, user } = response.data.data as {
      token: string;
      refreshToken: string;
      user: ApiUser;
    };
    const mapped = mapUser(user);
    await persistSession(token, refreshToken, mapped);
    set({ isAuthenticated: true, user: mapped, pendingPhone: null });
  },

  register: async data => {
    const response = await api.auth.register({
      ...data,
      profileRole: data.role,
      password: data.password || 'User@123',
    });
    const { token, refreshToken, user } = response.data.data as {
      token: string;
      refreshToken: string;
      user: ApiUser;
    };
    const mapped = mapUser(user);
    await persistSession(token, refreshToken, mapped);
    set({ isAuthenticated: true, user: mapped });
  },

  forgotPassword: async email => {
    const response = await api.auth.forgotPassword(email);
    return response.data;
  },

  logout: async () => {
    const refreshToken = appStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      await api.auth.logout(refreshToken);
    } catch {
      // Continue logout locally
    }
    await secureStorage.removeToken();
    appStorage.remove(STORAGE_KEYS.USER_DATA);
    appStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    set({ isAuthenticated: false, user: null, pendingPhone: null });
  },
}));
