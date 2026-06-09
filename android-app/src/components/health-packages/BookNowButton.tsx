import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';
import { getBookingTheme } from './bookingTheme';

interface BookNowButtonProps {
  title?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export const BookNowButton: React.FC<BookNowButtonProps> = ({
  title = 'Book Now',
  onPress,
  loading = false,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon = 'calendar-outline',
  style,
}) => {
  const theme = useTheme();
  const booking = getBookingTheme(theme);
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.97);
  const isDisabled = disabled || loading;
  const height = size === 'lg' ? 56 : 48;

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth, style]}>
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={isDisabled ? undefined : onPressIn}
        onPressOut={isDisabled ? undefined : onPressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={[
          styles.wrapper,
          { height, opacity: isDisabled ? 0.6 : 1, shadowColor: booking.ctaShadow },
          theme.shadows.md,
        ]}>
        <LinearGradient
          colors={booking.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          {loading ? (
            <ActivityIndicator color={theme.colors.white} size="small" />
          ) : (
            <>
              {icon && <Icon name={icon} size={18} color={theme.colors.white} />}
              <Text variant="label" color={theme.colors.white} style={styles.label}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  label: { letterSpacing: 0.3 },
});
