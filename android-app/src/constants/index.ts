import { getDevApiHost } from '../utils/devHost';

const DEV_HOST = getDevApiHost();

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_MODE: 'theme_mode',
  REFRESH_TOKEN: 'refresh_token',
  APP_CONFIG: 'app_config',
} as const;

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? `http://${DEV_HOST}:5000/api/v1`
    : 'https://api.vitalcare.app/v1',
  TIMEOUT: 30000,
} as const;

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const ACTIVITY_FILTERS = ['All', 'Like', 'Comment', 'Feedback', 'Queries'] as const;

export const USER_ROLES = [
  { id: 'user', label: 'Patient', icon: 'person-outline' },
  { id: 'doctor', label: 'Doctor', icon: 'medical-outline' },
  { id: 'hospital', label: 'Hospital', icon: 'business-outline' },
  { id: 'yoga_teacher', label: 'Yoga Teacher', icon: 'leaf-outline' },
  { id: 'blood_bank', label: 'Blood Bank', icon: 'water-outline' },
] as const;
