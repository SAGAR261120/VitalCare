import { spacing } from '../theme/spacing';

/** Standard horizontal screen gutter */
export const SCREEN_GUTTER = spacing['5'];

/** Bottom tab bar height (excluding safe area) */
export const TAB_BAR_HEIGHT = 72;

/** Floating action button dimensions */
export const FAB_SIZE = 52;
export const FAB_GAP = 12;
export const FAB_STACK_HEIGHT = FAB_SIZE * 2 + FAB_GAP;

/** Space reserved above tab bar for FAB stack */
export const FAB_BOTTOM_MARGIN = spacing['4'];

/** Total tab bar height including device safe area inset */
export const getTabBarTotalHeight = (safeBottom = 0): number =>
  TAB_BAR_HEIGHT + Math.max(safeBottom, 8) - 8;

/**
 * Bottom padding for scroll content when FAB + tab bar are visible.
 */
export const getScrollBottomPadding = (options?: {
  hasTabBar?: boolean;
  hasFab?: boolean;
  safeBottom?: number;
}): number => {
  const { hasTabBar = true, hasFab = true, safeBottom = 0 } = options ?? {};
  const tabBar = hasTabBar ? getTabBarTotalHeight(safeBottom) : 0;
  const fab = hasFab ? FAB_STACK_HEIGHT + FAB_BOTTOM_MARGIN : 0;
  return tabBar + fab + spacing['6'];
};

/**
 * Absolute bottom offset for floating action buttons.
 */
export const getFabBottomOffset = (options?: {
  hasTabBar?: boolean;
  safeBottom?: number;
}): number => {
  const { hasTabBar = true, safeBottom = 0 } = options ?? {};
  const tabBar = hasTabBar ? getTabBarTotalHeight(safeBottom) : 0;
  return tabBar + FAB_BOTTOM_MARGIN;
};
