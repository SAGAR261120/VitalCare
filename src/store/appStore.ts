import { create } from 'zustand';
import { LocationData } from '../types';

interface AppStore {
  location: LocationData;
  searchQuery: string;
  notifications: number;
  setSearchQuery: (query: string) => void;
  updateLocation: (location: Partial<LocationData>) => void;
  fetchLocation: () => Promise<void>;
}

const defaultLocation: LocationData = {
  latitude: 21.1458,
  longitude: 79.0882,
  address: 'Civil Lines, Nagpur',
  city: 'Nagpur',
  state: 'Maharashtra',
  isLoading: false,
};

export const useAppStore = create<AppStore>((set, get) => ({
  location: defaultLocation,
  searchQuery: '',
  notifications: 3,

  setSearchQuery: query => set({ searchQuery: query }),

  updateLocation: location =>
    set(state => ({
      location: { ...state.location, ...location },
    })),

  fetchLocation: async () => {
    set(state => ({
      location: { ...state.location, isLoading: true },
    }));

    await new Promise<void>(resolve => setTimeout(() => resolve(), 1200));

    set({
      location: {
        ...defaultLocation,
        isLoading: false,
      },
    });
  },
}));
