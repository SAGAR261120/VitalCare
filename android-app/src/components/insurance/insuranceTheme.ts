import { Theme } from '../../theme';
import { palette } from '../../theme/colors';

/** Insurance UI tokens — aligned with Health Packages (primary + surface palette) */
export const getInsuranceTheme = (theme: Theme) => ({
  cardBg: theme.colors.surface,
  cardBorder: theme.colors.border,
  headerBg: theme.isDark ? theme.colors.primary : theme.colors.primaryLight,
  accentBlue: theme.colors.primary,
  accentSky: theme.colors.secondary,
  detailRowBg: theme.isDark ? palette.slate800 : theme.colors.primaryLight,
  iconCircleBg: theme.isDark ? 'rgba(255,255,255,0.12)' : theme.colors.inputBackground,
  promoGradient: [theme.colors.heroGradientStart, theme.colors.heroGradientEnd],
  promoInfoBg: 'rgba(255,255,255,0.12)',
  ctaGradient: [theme.colors.primary, theme.colors.secondary],
  ctaShadow: 'rgba(0,0,0,0.15)',
  actionPrimaryBg: theme.colors.surface,
  uploadActionBg: theme.colors.primary,
});
