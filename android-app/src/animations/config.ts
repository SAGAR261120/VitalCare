import { Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const springConfig: WithSpringConfig = {
  damping: 18,
  stiffness: 180,
  mass: 0.8,
};

export const gentleSpring: WithSpringConfig = {
  damping: 22,
  stiffness: 120,
  mass: 1,
};

export const bouncySpring: WithSpringConfig = {
  damping: 12,
  stiffness: 200,
  mass: 0.6,
};

export const timingConfig: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const fastTiming: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

export const slowTiming: WithTimingConfig = {
  duration: 500,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

export const staggerDelay = 80;
