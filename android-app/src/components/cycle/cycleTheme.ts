import { Theme } from '../../theme';
import { palette } from '../../theme/colors';

/** Soft rose palette for Period & Pregnancy section */
export const getCycleTheme = (theme: Theme) => ({
  pink: theme.isDark ? palette.rose400 : '#E91E8C',
  pinkLight: theme.isDark ? 'rgba(233,30,140,0.15)' : '#FCE7F3',
  pinkSoft: theme.isDark ? palette.slate800 : '#FFF1F2',
  heroGradient: theme.isDark
    ? [palette.rose500, palette.violet700]
    : ['#FF758C', '#7158E2'],
  cardBg: theme.colors.surface,
  cardBorder: theme.colors.border,
  phaseRed: ['#FF758C', '#F43F5E'],
  phaseBlue: ['#60A5FA', '#3B82F6'],
  phaseYellow: ['#FBBF24', '#F59E0B'],
  phasePurple: ['#A78BFA', '#7C3AED'],
  tipGradient: [theme.colors.primary, theme.colors.secondary],
  accentBar: theme.colors.primary,
});
