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

type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const AUTH_NO_REFRESH_PATHS = [
  '/auth/logout',
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/otp/send',
  '/auth/otp/verify',
];

const shouldSkipAuthRefresh = (config?: ApiRequestConfig) => {
  if (config?.skipAuthRefresh) return true;
  const path = config?.url ?? '';
  return AUTH_NO_REFRESH_PATHS.some(route => path.includes(route));
};

let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredHandler = (handler: () => void) => {
  onSessionExpired = handler;
};

export const clearAuthStorage = async () => {
  try {
    await secureStorage.removeToken();
  } catch {
    // ignore keychain errors
  }
  appStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  appStorage.remove(STORAGE_KEYS.USER_DATA);
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = appStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return false;

  try {
    const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, { refreshToken });
    await secureStorage.setToken(data.data.token);
    appStorage.setString(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
    return true;
  } catch {
    await clearAuthStorage();
    onSessionExpired?.();
    return false;
  }
};

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError<{ message?: string; code?: string }>) => {
      const original = error.config as ApiRequestConfig | undefined;

      if (
        error.response?.status === 401 &&
        original &&
        !original._retry &&
        !shouldSkipAuthRefresh(original)
      ) {
        original._retry = true;
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const token = await secureStorage.getToken();
          if (token && original.headers) {
            original.headers.Authorization = `Bearer ${token}`;
          }
          return client(original);
        }
      }

      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          (error.message === 'Network Error'
            ? `Cannot reach server at ${API_CONFIG.BASE_URL}. Ensure backend is running. On a physical device, update DEV_API_HOST_OVERRIDE in src/config/dev.config.ts with your PC IP (run ipconfig), or run: adb reverse tcp:5000 tcp:5000`
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
    logout: (refreshToken?: string) =>
      apiClient.post('/auth/logout', { refreshToken }, {
        skipAuthRefresh: true,
      } as ApiRequestConfig),
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
    getHealthPackages: (params?: Record<string, unknown>) =>
      apiClient.get('/content/health-packages', { params }),
    getHealthPackage: (id: string) => apiClient.get(`/content/health-packages/${id}`),
    getPackageCategories: () =>
      apiClient.get('/content/categories', { params: { scope: 'health-package', limit: 20 } }),
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
