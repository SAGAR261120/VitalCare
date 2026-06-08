import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { ApiError } from '../types';
import { appStorage, secureStorage } from './storage';

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('[VitalCare] API base URL:', API_CONFIG.BASE_URL);
}

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError<{ message?: string; code?: string }>) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;
        const refreshToken = appStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, { refreshToken });
            await secureStorage.setToken(data.data.token);
            appStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
            if (original.headers) original.headers.Authorization = `Bearer ${data.data.token}`;
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
          (error.message === 'Network Error'
            ? `Cannot reach server at ${API_CONFIG.BASE_URL}. Ensure the backend is running and your device is on the same Wi‑Fi network.`
            : error.message) ||
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
    verifyOtp: (phone: string, otp: string) => apiClient.post('/auth/otp/verify', { phone, otp }),
    login: (phone: string, password: string) => apiClient.post('/auth/login', { phone, password }),
    register: (data: Record<string, unknown>) => apiClient.post('/auth/register', data),
    logout: (refreshToken?: string) => apiClient.post('/auth/logout', { refreshToken }),
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) => apiClient.post('/auth/reset-password', { token, password }),
    changePassword: (currentPassword: string, newPassword: string) =>
      apiClient.post('/auth/change-password', { currentPassword, newPassword }),
    getMe: () => apiClient.get('/auth/me'),
  },
  user: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: Record<string, unknown>) => apiClient.put('/users/profile', data),
  },
  content: {
    getHome: () => apiClient.get('/content/home'),
    getConfig: () => apiClient.get('/content/config'),
    search: (q: string) => apiClient.get('/content/search', { params: { q } }),
    getMembershipPlans: () => apiClient.get('/content/membership-plans'),
    getInsurancePlans: () => apiClient.get('/content/insurance-plans'),
    getCities: (search?: string) => apiClient.get('/content/cities', { params: { search, limit: 20 } }),
    getRewards: () => apiClient.get('/content/rewards'),
    getPage: (slug: string) => apiClient.get(`/content/pages/slug/${slug}`),
    getFaqs: () => apiClient.get('/content/faqs'),
  },
  appointments: {
    list: (status?: string) => apiClient.get('/content/appointments', { params: { status } }),
    book: (data: Record<string, unknown>) => apiClient.post('/content/appointments', data),
  },
  rewards: {
    get: () => apiClient.get('/content/rewards'),
    withdraw: (points: number) => apiClient.post('/content/rewards/withdraw', { points }),
    connectWallet: (address: string) => apiClient.post('/content/rewards/wallet', { address }),
  },
  activity: {
    list: (type?: string, page = 1) => apiClient.get('/content/activity', { params: { type, page } }),
  },
  notifications: {
    list: (page = 1) => apiClient.get('/notifications', { params: { page } }),
    markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  },
  settings: {
    getAll: () => apiClient.get('/settings'),
  },
};
