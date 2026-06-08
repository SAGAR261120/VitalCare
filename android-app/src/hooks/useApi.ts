import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../services/api';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  fetcher: () => Promise<{ data: { data: T } }>,
  options: UseApiOptions = { immediate: true },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate !== false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data.data);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (options.immediate !== false) fetch();
  }, [fetch, options.immediate]);

  return { data, loading, error, refreshing, refetch: () => fetch(true), fetch };
}

export function useHomeFeed() {
  return useApi<{
    banners: Banner[];
    packages: HealthPackage[];
    specialists: Specialist[];
    insurance: InsurancePlan[];
    settings: Record<string, unknown>;
  }>(() => apiClient.get('/content/home'));
}

export function useAppConfig() {
  return useApi<{
    slides: OnboardingSlide[];
    menuItems: MenuItem[];
    settings: Record<string, unknown>;
  }>(() => apiClient.get('/content/config'));
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  gradient?: string[];
  image?: string;
}

export interface HealthPackage {
  _id: string;
  name: string;
  testCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  description?: string;
}

export interface Specialist {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  experience?: string;
  imageColor?: string;
}

export interface InsurancePlan {
  _id: string;
  provider: string;
  name: string;
  description?: string;
  coverage: number;
  premium: number;
  recommended?: boolean;
  tenure?: string;
}

export interface OnboardingSlide {
  _id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  gradient?: string[];
}

export interface MenuItem {
  _id: string;
  label: string;
  icon: string;
  route: string;
  section: string;
}

export interface MembershipPlan {
  _id: string;
  name: string;
  tier: string;
  validity: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  features: { label: string; included: boolean }[];
}

export interface Appointment {
  _id: string;
  doctorName?: string;
  specialty?: string;
  date: string;
  time: string;
  status: string;
  hospital?: string;
}

export interface RewardTask {
  _id: string;
  title: string;
  description?: string;
  points: number;
  icon?: string;
}

export interface RewardData {
  points: number;
  tier: string;
  walletConnected: boolean;
  walletAddress?: string;
  transactions: { _id: string; type: string; points: number; description: string; createdAt: string }[];
}

export interface City {
  _id: string;
  name: string;
  state: string;
  district?: string;
  type?: string;
}

export interface ActivityItem {
  _id: string;
  action: string;
  description: string;
  createdAt: string;
}
