export type UserRole =
  | 'user'
  | 'doctor'
  | 'hospital'
  | 'yoga_teacher'
  | 'blood_bank';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  gender?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  city?: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  hasCompletedOnboarding: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  isLoading: boolean;
}

export interface HealthPackage {
  id: string;
  name: string;
  testCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  badge?: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  imageColor: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: string;
  validity: string;
  price: number;
  originalPrice: number;
  features: { label: string; included: boolean }[];
  badge?: string;
}

export interface InsurancePlan {
  id: string;
  provider: string;
  name: string;
  description: string;
  coverage: number;
  premium: number;
  recommended?: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hospital: string;
}

export interface Reward {
  id: string;
  title: string;
  points: number;
  description: string;
  icon: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  VerifyOtp: { phone: string };
  Register: undefined;
  ForgotPassword: undefined;
  LocationPicker: { field: 'state' | 'district' | 'city' };
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  SearchTab: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Membership: undefined;
  Insurance: undefined;
  MedicalRecords: undefined;
  Settings: undefined;
};
