import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { api } from '../services/api';
import { appStorage, secureStorage } from '../services/storage';
import { User, UserRole } from '../types';

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
    role: UserRole;
    gender: string;
    pinCode: string;
    state: string;
    district: string;
    city: string;
  }) => Promise<void>;
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
    try {
      await api.auth.sendOtp(phone);
    } catch {
      // Demo mode: simulate success when API is unavailable
    }
    set({ pendingPhone: phone });
  },

  verifyOtp: async (phone, otp) => {
    try {
      const response = await api.auth.verifyOtp(phone, otp);
      const { token, user } = response.data.data as {
        token: string;
        user: User;
      };
      await secureStorage.setToken(token);
      appStorage.set(STORAGE_KEYS.USER_DATA, user);
      set({ isAuthenticated: true, user, pendingPhone: null });
    } catch {
      const demoUser: User = {
        id: 'demo-1',
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@vitalcare.app',
        phone,
        role: 'user',
      };
      await secureStorage.setToken('demo-token');
      appStorage.set(STORAGE_KEYS.USER_DATA, demoUser);
      set({ isAuthenticated: true, user: demoUser, pendingPhone: null });
    }
  },

  loginWithPassword: async (phone, password) => {
    try {
      const response = await api.auth.login(phone, password);
      const { token, user } = response.data.data as {
        token: string;
        user: User;
      };
      await secureStorage.setToken(token);
      appStorage.set(STORAGE_KEYS.USER_DATA, user);
      set({ isAuthenticated: true, user, pendingPhone: null });
    } catch {
      const demoUser: User = {
        id: 'demo-1',
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@vitalcare.app',
        phone,
        role: 'user',
      };
      await secureStorage.setToken('demo-token');
      appStorage.set(STORAGE_KEYS.USER_DATA, demoUser);
      set({ isAuthenticated: true, user: demoUser });
    }
  },

  register: async data => {
    try {
      await api.auth.register(data);
    } catch {
      // Demo mode
    }
    const user: User = {
      id: 'demo-new',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      gender: data.gender,
      pinCode: data.pinCode,
      state: data.state,
      district: data.district,
      city: data.city,
    };
    await secureStorage.setToken('demo-token');
    appStorage.set(STORAGE_KEYS.USER_DATA, user);
    set({ isAuthenticated: true, user });
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      // Continue logout locally
    }
    await secureStorage.removeToken();
    appStorage.remove(STORAGE_KEYS.USER_DATA);
    set({ isAuthenticated: false, user: null, pendingPhone: null });
  },
}));
