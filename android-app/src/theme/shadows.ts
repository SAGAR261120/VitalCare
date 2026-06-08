import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  shadowColor: string,
  elevation: number,
  opacity: number,
  radius: number,
  offsetY: number,
): ShadowStyle => ({
  shadowColor,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: Platform.OS === 'android' ? elevation : 0,
});

export const getShadows = (isDark: boolean) => {
  const shadowColor = isDark ? '#000000' : '#94A3B8';

  return {
    none: createShadow(shadowColor, 0, 0, 0, 0),
    sm: createShadow(shadowColor, 2, isDark ? 0.08 : 0.05, 4, 1),
    md: createShadow(shadowColor, 4, isDark ? 0.12 : 0.07, 8, 2),
    lg: createShadow(shadowColor, 6, isDark ? 0.16 : 0.08, 12, 4),
    xl: createShadow(shadowColor, 8, isDark ? 0.2 : 0.1, 16, 6),
    '2xl': createShadow(shadowColor, 10, isDark ? 0.24 : 0.12, 20, 8),
    glow: {
      ...createShadow(isDark ? '#7C3AED' : '#A78BFA', 6, isDark ? 0.25 : 0.15, 12, 2),
    },
  } as const;
};

export type ThemeShadows = ReturnType<typeof getShadows>;

// Backward-compatible default (light)
export const shadows = getShadows(false);
