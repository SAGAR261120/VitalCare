import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CommonActions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useNetworkStore } from '../services/network';
import { useTheme } from '../theme';
import {
  AuthStackParamList,
  RootStackParamList,
} from '../types';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { VerifyOtpScreen } from '../screens/auth/VerifyOtpScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { LocationPickerScreen } from '../screens/auth/LocationPickerScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { DrawerNavigator } from './DrawerNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

/** Leaf route from nested stacks (e.g. Login); use root stack name for auth gating. */
const getRootRouteName = (
  ref: NavigationContainerRef<RootStackParamList>,
): string | undefined => {
  const state = ref.getRootState();
  if (!state?.routes.length) return undefined;
  return state.routes[state.index ?? 0]?.name;
};

const AuthNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
    </AuthStack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [navReady, setNavReady] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const initializeNetwork = useNetworkStore(state => state.initialize);

  useEffect(() => {
    return initializeNetwork();
  }, [initializeNetwork]);

  const syncAuthRoute = useCallback(() => {
    if (isLoading || !navReady) return;

    const ref = navigationRef.current;
    if (!ref) return;

    const rootRoute = getRootRouteName(ref);
    const preAuthRoutes = new Set(['Splash', 'Onboarding', 'Auth']);

    if (isAuthenticated) {
      if (rootRoute !== 'Main') {
        ref.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          }),
        );
      }
      return;
    }

    if (rootRoute && !preAuthRoutes.has(rootRoute)) {
      ref.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        }),
      );
    }
  }, [isAuthenticated, isLoading, navReady]);

  useEffect(() => {
    syncAuthRoute();
  }, [syncAuthRoute]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setNavReady(true);
        syncAuthRoute();
      }}
      onStateChange={syncAuthRoute}
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.accentWarm,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
        <RootStack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ animation: 'fade' }}
        />
        <RootStack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ animation: 'fade' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
