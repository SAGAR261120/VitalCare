import React, { useEffect, useRef } from 'react';
import {
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
import { DrawerNavigator } from './DrawerNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const initializeNetwork = useNetworkStore(state => state.initialize);

  useEffect(() => {
    return initializeNetwork();
  }, [initializeNetwork]);

  useEffect(() => {
    if (isLoading || !navigationRef.current) return;

    if (isAuthenticated) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
      const currentRoute = navigationRef.current.getCurrentRoute()?.name;
      if (currentRoute === 'Main') {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <NavigationContainer
      ref={navigationRef}
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
