import type { NavigatorScreenParams } from '@react-navigation/native';

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

export interface HealthPackageCategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

export interface HealthPackage {
  _id?: string;
  id: string;
  name: string;
  code?: string;
  testCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  description?: string;
  badge?: string;
  image?: string;
  category?: HealthPackageCategory | string;
  includedTests?: string[];
  excludedTests?: string[];
  benefits?: string[];
  preparationInstructions?: string;
  recommendedFor?: string[];
  packageDuration?: string;
  reportDeliveryTime?: string;
  isFeatured?: boolean;
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
  _id?: string;
  id: string;
  provider: string;
  name: string;
  description?: string;
  coverage: number;
  premium: number;
  tenure?: string;
  image?: string;
  pdfUrl?: string;
  cashlessHospitals?: string;
  sumInsured?: number;
  subLimits?: string;
  noClaimBonus?: string;
  waitingPeriod?: string;
  claimSettlementRatio?: string;
  coPayment?: string;
  recommended?: boolean;
  sortOrder?: number;
}

export type CycleStackParamList = {
  CycleDashboard: undefined;
  CycleProfileSetup: undefined;
};

export type InsuranceStackParamList = {
  InsuranceList: { openSubmit?: boolean } | undefined;
  InsuranceDetail: { planId: string };
  ViewRequirements: undefined;
  UploadInsurance: undefined;
};

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

export type HealthPackagesStackParamList = {
  HealthPackagesList: undefined;
  HealthPackageDetail: { packageId: string; startBooking?: boolean };
  HealthPackageBooking: { packageId: string; packageName?: string; date: string; time: string };
};

export interface PackageBookingForm {
  fullName: string;
  age: string;
  gender: string;
  relationship: string;
  address: string;
  city: string;
  landmark: string;
  pincode: string;
  state: string;
  district: string;
}

export type DrawerParamList = {
  MainTabs: undefined;
  Membership: undefined;
  HealthPackages: NavigatorScreenParams<HealthPackagesStackParamList> | undefined;
  Insurance: NavigatorScreenParams<InsuranceStackParamList> | undefined;
  Cycle: NavigatorScreenParams<CycleStackParamList> | undefined;
  MedicalRecords: undefined;
  Settings: undefined;
};
