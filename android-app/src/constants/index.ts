import { Platform } from 'react-native';
import { HealthPackage, InsurancePlan, MembershipPlan, Specialist } from '../types';

export const APP_NAME = 'VitalCare';
export const APP_TAGLINE = 'Your Health, Elevated';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_MODE: 'theme_mode',
  REFRESH_TOKEN: 'refresh_token',
} as const;

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? `http://${DEV_HOST}:5000/api/v1`
    : 'https://api.vitalcare.app/v1',
  TIMEOUT: 30000,
} as const;

export const USER_ROLES = [
  { id: 'user', label: 'Patient', icon: 'person-outline' },
  { id: 'doctor', label: 'Doctor', icon: 'medical-outline' },
  { id: 'hospital', label: 'Hospital', icon: 'business-outline' },
  { id: 'yoga_teacher', label: 'Yoga Teacher', icon: 'leaf-outline' },
  { id: 'blood_bank', label: 'Blood Bank', icon: 'water-outline' },
] as const;

export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Healthcare Reimagined',
    subtitle:
      'Experience premium healthcare services with cutting-edge technology and personalized care.',
    icon: 'heart-circle-outline',
    gradient: ['#EDE9FE', '#E0F2FE'],
  },
  {
    id: '2',
    title: 'Book With Confidence',
    subtitle:
      'Schedule appointments, health checkups, and consultations in just a few taps.',
    icon: 'calendar-outline',
    gradient: ['#ECFDF5', '#E0F2FE'],
  },
  {
    id: '3',
    title: 'Your Wellness Journey',
    subtitle:
      'Track health metrics, access medical records, and earn rewards for staying healthy.',
    icon: 'trophy-outline',
    gradient: ['#FFF7ED', '#FFF1F2'],
  },
] as const;

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: '1',
    name: 'Essential Wellness',
    testCount: 18,
    price: 499,
    originalPrice: 1499,
    discount: 67,
    description: 'Core health markers for routine wellness monitoring',
    badge: 'Popular',
  },
  {
    id: '2',
    name: 'Complete Health Panel',
    testCount: 46,
    price: 999,
    originalPrice: 2999,
    discount: 67,
    description: 'Comprehensive diagnostics for complete health insight',
    badge: 'Best Value',
  },
  {
    id: '3',
    name: 'Executive Checkup',
    testCount: 72,
    price: 2499,
    originalPrice: 5999,
    discount: 58,
    description: 'Premium full-body assessment for professionals',
    badge: 'Premium',
  },
];

export const SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sharma',
    specialty: 'Cardiologist',
    rating: 4.9,
    experience: '15+ years',
    imageColor: '#A78BFA',
  },
  {
    id: '2',
    name: 'Dr. Patel',
    specialty: 'Dermatologist',
    rating: 4.8,
    experience: '12+ years',
    imageColor: '#34D399',
  },
  {
    id: '3',
    name: 'Dr. Kumar',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '18+ years',
    imageColor: '#38BDF8',
  },
  {
    id: '4',
    name: 'Dr. Singh',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '10+ years',
    imageColor: '#FB923C',
  },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: '1',
    name: 'Essential Care',
    tier: 'NATIONAL',
    validity: '1 Year',
    price: 1999,
    originalPrice: 3999,
    badge: 'Popular',
    features: [
      { label: 'Yoga & Wellness Webinars', included: true },
      { label: 'Health Insurance Consultation', included: true },
      { label: 'Priority Appointment Booking', included: true },
      { label: '24/7 Premium Support', included: false },
      { label: 'Medical Tourism Facility', included: false },
    ],
  },
  {
    id: '2',
    name: 'Premium Care',
    tier: 'GLOBAL',
    validity: '1 Year',
    price: 4999,
    originalPrice: 9999,
    badge: 'Recommended',
    features: [
      { label: 'All Essential Features', included: true },
      { label: '24/7 Premium Support', included: true },
      { label: 'Medical Tourism Facility', included: true },
      { label: 'Dedicated Health Manager', included: true },
      { label: 'Annual Executive Checkup', included: true },
    ],
  },
];

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: '1',
    provider: 'Axis Max Life',
    name: 'Smart Term Plan Plus',
    description:
      'Comprehensive term insurance with flexible coverage options and tax benefits under Section 80C.',
    coverage: 5000000,
    premium: 12659,
    recommended: true,
  },
  {
    id: '2',
    provider: 'HDFC Life',
    name: 'Click 2 Protect',
    description:
      'Affordable life insurance with critical illness rider and accidental death benefit.',
    coverage: 3000000,
    premium: 8999,
  },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
