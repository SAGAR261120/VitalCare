import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { appStorage } from '../services/storage';
import { darkColors, lightColors, ThemeColors } from './colors';
import { borderRadius, hitSlop, spacing } from './spacing';
import { getShadows, ThemeShadows } from './shadows';
import { fontSize, fontWeight, typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: ThemeShadows;
  typography: typeof typography;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  hitSlop: typeof hitSlop;
}

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
  mode: 'light',
  setMode: mode => {
    appStorage.setString(STORAGE_KEYS.THEME_MODE, mode);
    set({ mode });
  },
  initializeTheme: () => {
    const saved = appStorage.getString(STORAGE_KEYS.THEME_MODE) as ThemeMode | undefined;
    const mode = saved === 'dark' || saved === 'light' ? saved : 'light';
    set({ mode });
  },
}));

export const useTheme = (): Theme => {
  const mode = useThemeStore(state => state.mode);
  const isDark = mode === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    mode,
    spacing,
    borderRadius,
    shadows: getShadows(isDark),
    typography,
    fontSize,
    fontWeight,
    hitSlop,
  };
};

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
