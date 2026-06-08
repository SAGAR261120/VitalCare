import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { ApiError } from '../types';
import { appStorage, secureStorage } from './storage';

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await secureStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError<{ message?: string; code?: string }>) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;
        const refreshToken = appStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
              refreshToken,
            });
            const newToken = data.data.token;
            const newRefresh = data.data.refreshToken;
            await secureStorage.setToken(newToken);
            appStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, newRefresh);
            if (original.headers) {
              original.headers.Authorization = `Bearer ${newToken}`;
            }
            return client(original);
          } catch {
            await secureStorage.removeToken();
            appStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
            appStorage.remove(STORAGE_KEYS.USER_DATA);
          }
        }
      }

      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred',
        code: error.response?.data?.code,
        status: error.response?.status,
      };
      return Promise.reject(apiError);
    },
  );

  return client;
};

export const apiClient = createApiClient();

export const api = {
  auth: {
    sendOtp: (phone: string) => apiClient.post('/auth/otp/send', { phone }),
    verifyOtp: (phone: string, otp: string) =>
      apiClient.post('/auth/otp/verify', { phone, otp }),
    login: (phone: string, password: string) =>
      apiClient.post('/auth/login', { phone, password }),
    loginWithEmail: (email: string, password: string) =>
      apiClient.post('/auth/login', { email, password }),
    register: (data: Record<string, unknown>) =>
      apiClient.post('/auth/register', data),
    logout: (refreshToken?: string) =>
      apiClient.post('/auth/logout', { refreshToken }),
    forgotPassword: (email: string) =>
      apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      apiClient.post('/auth/reset-password', { token, password }),
    changePassword: (currentPassword: string, newPassword: string) =>
      apiClient.post('/auth/change-password', { currentPassword, newPassword }),
    getMe: () => apiClient.get('/auth/me'),
  },
  user: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: Record<string, unknown>) =>
      apiClient.put('/users/profile', data),
  },
  notifications: {
    list: (page = 1) => apiClient.get('/notifications', { params: { page } }),
    markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  },
  health: {
    getPackages: () => apiClient.get('/health/packages'),
    getSpecialists: () => apiClient.get('/health/specialists'),
    bookAppointment: (data: Record<string, unknown>) =>
      apiClient.post('/health/appointments', data),
  },
  membership: {
    getPlans: () => apiClient.get('/membership/plans'),
  },
  insurance: {
    getPlans: () => apiClient.get('/insurance/plans'),
  },
};
