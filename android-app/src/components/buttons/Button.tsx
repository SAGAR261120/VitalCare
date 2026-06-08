import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.97);
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16, fontSize: 13 },
    md: { height: 52, paddingHorizontal: 24, fontSize: 15 },
    lg: { height: 56, paddingHorizontal: 32, fontSize: 16 },
  };

  const currentSize = sizeStyles[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: theme.colors.secondary,
          text: theme.colors.white,
          border: 'transparent',
        };
      case 'outline':
        return {
          background: 'transparent',
          text: theme.colors.primary,
          border: theme.colors.primary,
        };
      case 'ghost':
        return {
          background: theme.colors.primaryLight,
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'danger':
        return {
          background: theme.colors.error,
          text: theme.colors.white,
          border: 'transparent',
        };
      default:
        return {
          background: theme.colors.primary,
          text: theme.colors.white,
          border: 'transparent',
        };
    }
  };

  const variantStyles = getVariantStyles();

  const content = (
    <>
      {loading && (
        <ActivityIndicator
          color={variantStyles.text}
          size="small"
          style={styles.loadingIndicator}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <Icon
          name={icon}
          size={18}
          color={variantStyles.text}
          style={styles.iconLeft}
        />
      )}
      <Text
        variant="button"
        color={isDisabled ? theme.colors.textTertiary : variantStyles.text}
        style={{ fontSize: currentSize.fontSize, opacity: loading ? 0.85 : 1 }}>
        {title}
      </Text>
      {!loading && icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          size={18}
          color={variantStyles.text}
          style={styles.iconRight}
        />
      )}
    </>
  );

  const shadowStyle =
    variant !== 'outline' && variant !== 'ghost' && !isDisabled
      ? theme.shadows.sm
      : {};

  const buttonStyle = [
    styles.button,
    {
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      opacity: isDisabled ? 0.5 : 1,
      borderColor: variantStyles.border,
      borderWidth: variant === 'outline' ? 1.5 : 0,
      ...(fullWidth ? { alignSelf: 'stretch' as const } : {}),
    },
    style,
  ];

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <Animated.View
        onTouchStart={isDisabled ? undefined : onPressIn}
        onTouchEnd={isDisabled ? undefined : onPressOut}
        onTouchCancel={isDisabled ? undefined : onPressOut}
        onStartShouldSetResponder={() => !isDisabled}
        onResponderRelease={isDisabled ? undefined : onPress}
        style={buttonStyle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: isDisabled }}>
        {variant === 'primary' && !isDisabled ? (
          theme.isDark ? (
            <LinearGradient
              colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}>
              {content}
            </LinearGradient>
          ) : (
            <Animated.View
              style={[
                styles.inner,
                { backgroundColor: theme.colors.primary },
                shadowStyle,
              ]}>
              {content}
            </Animated.View>
          )
        ) : (
          <Animated.View
            style={[
              styles.inner,
              { backgroundColor: variantStyles.background },
              variant !== 'outline' && variant !== 'ghost' && !isDisabled ? shadowStyle : {},
            ]}>
            {content}
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginRight: 10,
  },
});
