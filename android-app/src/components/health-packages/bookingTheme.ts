import { Theme } from '../../theme';
import { palette } from '../../theme/colors';

/** Premium booking palette — violet trust + amber action + emerald success */
export const getBookingTheme = (theme: Theme) => ({
  /** Primary trust gradient (headers, date bar) */
  trustGradient: theme.isDark
    ? [palette.violet800, palette.indigo950]
    : [palette.violet700, palette.violet500],
  /** Gold CTA gradient (Book Now, Confirm) */
  ctaGradient: ['#B45309', '#F59E0B'],
  ctaShadow: 'rgba(245, 158, 11, 0.35)',
  /** Soft summary card */
  summaryBg: theme.isDark ? palette.slate800 : palette.violet50,
  summaryBorder: theme.isDark ? palette.slate700 : palette.violet200,
  summaryAccent: theme.colors.primary,
  /** Form shell */
  formShell: theme.isDark
    ? [palette.slate900, palette.slate800]
    : [palette.white, palette.slate50],
  formBorder: theme.isDark ? palette.slate700 : palette.slate200,
  /** Chips & slots */
  chipActiveBg: theme.colors.primary,
  chipActiveText: palette.white,
  chipIdleBg: theme.isDark ? palette.slate800 : palette.slate100,
  chipIdleText: theme.colors.textSecondary,
  slotActiveBg: '#F59E0B',
  slotActiveText: palette.white,
  slotIdleBg: theme.isDark ? palette.slate800 : palette.slate100,
  slotIdleText: theme.colors.text,
  slotIdleBorder: theme.isDark ? palette.slate700 : palette.slate200,
  periodActiveBg: theme.colors.primary,
  periodActiveText: palette.white,
  periodIdleBg: theme.isDark ? palette.slate800 : palette.violet50,
  periodIdleText: theme.colors.primary,
  /** Accents */
  stepActive: theme.colors.primary,
  stepInactive: theme.isDark ? palette.slate700 : palette.slate200,
  iconGold: '#F59E0B',
  cancelBg: theme.isDark ? palette.slate800 : palette.rose50,
  cancelText: theme.colors.error,
  cancelBorder: theme.isDark ? palette.slate700 : '#FECDD3',
});
