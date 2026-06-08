import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_NAME, APP_TAGLINE } from '../../constants';
import { GradientBackground } from '../../components/common/GradientBackground';
import { Text } from '../../components/common/Text';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isLoading, hasCompletedOnboarding, isAuthenticated, initialize } =
    useAuthStore();
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 200 }),
    );
    ringOpacity.value = withDelay(300, withTiming(0.6, { duration: 800 }));
    ringScale.value = withDelay(
      300,
      withTiming(1.5, { duration: 1200, easing: Easing.out(Easing.cubic) }),
    );
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, [logoOpacity, logoScale, ringOpacity, ringScale, textOpacity]);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        navigation.replace('Onboarding');
      } else if (!isAuthenticated) {
        navigation.replace('Auth');
      } else {
        navigation.replace('Main');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, hasCompletedOnboarding, isAuthenticated, navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <GradientBackground variant="hero">
      <Animated.View style={[styles.ring, ringStyle, { borderColor: `${theme.colors.white}55` }]} />
      <Animated.View style={[styles.content, logoStyle]}>
        <Animated.View
          style={[
            styles.logoMark,
            {
              backgroundColor: 'rgba(255,255,255,0.22)',
              borderColor: 'rgba(255,255,255,0.35)',
            },
          ]}>
          <Text variant="display" color={theme.colors.white} style={styles.logoText}>
            V
          </Text>
        </Animated.View>
        <Animated.View style={textStyle}>
          <Text variant="h1" color={theme.colors.white} align="center">
            {APP_NAME}
          </Text>
          <Text
            variant="body"
            color="rgba(255,255,255,0.88)"
            align="center"
            style={styles.tagline}>
            {APP_TAGLINE}
          </Text>
        </Animated.View>
      </Animated.View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignSelf: 'center',
    top: '35%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoText: {
    fontSize: 42,
  },
  tagline: {
    marginTop: 8,
  },
});
