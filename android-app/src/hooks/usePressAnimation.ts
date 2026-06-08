import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springConfig } from '../animations/config';

export const usePressAnimation = (scaleTo = 0.96) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleTo, springConfig);
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, springConfig);
  }, [scale]);

  return { animatedStyle, onPressIn, onPressOut };
};
