import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainShell } from '../components/common/MainShell';
import { CycleDashboardScreen } from '../screens/cycle/CycleDashboardScreen';
import { CycleProfileSetupScreen } from '../screens/cycle/CycleProfileSetupScreen';
import { CycleStackParamList } from '../types';

const Stack = createNativeStackNavigator<CycleStackParamList>();

export const CycleNavigator: React.FC = () => (
  <MainShell hasTabBar={false} showFab={false}>
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="CycleDashboard">
      <Stack.Screen name="CycleDashboard" component={CycleDashboardScreen} />
      <Stack.Screen name="CycleProfileSetup" component={CycleProfileSetupScreen} />
    </Stack.Navigator>
  </MainShell>
);
