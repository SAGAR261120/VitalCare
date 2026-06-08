import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useTheme } from '../../theme';

interface IconButtonProps {
  name: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  onPress,
  size = 22,
  color,
  backgroundColor,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.9);

  return (
    <Animated.View style={animatedStyle}>
      <Animated.View
        onTouchStart={onPressIn}
        onTouchEnd={onPressOut}
        onTouchCancel={onPressOut}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onPress}
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor ?? theme.colors.surface,
            ...theme.shadows.sm,
          },
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        <Icon
          name={name}
          size={size}
          color={color ?? theme.colors.text}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
