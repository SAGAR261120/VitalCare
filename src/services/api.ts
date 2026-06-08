import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import { secureStorage } from './storage';

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
    (error: AxiosError<{ message?: string; code?: string }>) => {
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
    sendOtp: (phone: string) =>
      apiClient.post('/auth/otp/send', { phone }),
    verifyOtp: (phone: string, otp: string) =>
      apiClient.post('/auth/otp/verify', { phone, otp }),
    login: (phone: string, password: string) =>
      apiClient.post('/auth/login', { phone, password }),
    register: (data: Record<string, unknown>) =>
      apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
  },
  user: {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data: Record<string, unknown>) =>
      apiClient.put('/user/profile', data),
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
