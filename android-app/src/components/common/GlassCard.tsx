import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { usePressAnimation } from '../../hooks/usePressAnimation';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  elevated = false,
}) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.isDark
        ? theme.colors.surfaceGlass
        : theme.colors.surface,
      borderColor: theme.isDark
        ? 'rgba(255,255,255,0.08)'
        : theme.colors.border,
      ...(elevated ? theme.shadows.lg : theme.shadows.sm),
    },
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Animated.View
          onTouchStart={onPressIn}
          onTouchEnd={onPressOut}
          onTouchCancel={onPressOut}
          onStartShouldSetResponder={() => true}
          onResponderRelease={onPress}
          style={cardStyle}
          accessibilityRole="button">
          {children}
        </Animated.View>
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
  },
});
