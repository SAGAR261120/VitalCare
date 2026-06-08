import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  const sizes = { small: 24, medium: 40, large: 56 };
  const loaderSize = sizes[size];

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const content = (
    <View style={styles.content} accessibilityRole="progressbar">
      <Animated.View
        style={[
          styles.spinner,
          animatedStyle,
          {
            width: loaderSize,
            height: loaderSize,
            borderRadius: loaderSize / 2,
            borderColor: theme.colors.primaryLight,
            borderTopColor: theme.colors.primary,
          },
        ]}
      />
      {message && (
        <Text
          variant="bodySmall"
          color={theme.colors.textSecondary}
          style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreen, { backgroundColor: theme.colors.overlay }]}>
        <View
          style={[
            styles.fullScreenCard,
            { backgroundColor: theme.colors.surface },
            theme.shadows.xl,
          ]}>
          {content}
        </View>
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  spinner: {
    borderWidth: 3,
  },
  message: {
    marginTop: 4,
  },
  fullScreen: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  fullScreenCard: {
    padding: 32,
    borderRadius: 20,
    minWidth: 140,
  },
});
