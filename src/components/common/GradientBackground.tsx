import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  variant?: 'default' | 'hero' | 'auth';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  colors,
  variant = 'default',
}) => {
  const theme = useTheme();

  const resolvedColors =
    colors ??
    (variant === 'hero'
      ? [theme.colors.heroGradientStart, theme.colors.heroGradientEnd]
      : variant === 'auth'
        ? theme.isDark
          ? [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]
          : [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]
        : theme.isDark
          ? [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]
          : [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
      <LinearGradient
        colors={resolvedColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
