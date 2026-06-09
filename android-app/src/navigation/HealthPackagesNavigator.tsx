import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainShell } from '../components/common/MainShell';
import { HealthPackageBookingScreen } from '../screens/health-packages/HealthPackageBookingScreen';
import { HealthPackageDetailScreen } from '../screens/health-packages/HealthPackageDetailScreen';
import { HealthPackagesScreen } from '../screens/health-packages/HealthPackagesScreen';
import { useTheme } from '../theme';
import { HealthPackagesStackParamList } from '../types';

const Stack = createNativeStackNavigator<HealthPackagesStackParamList>();

export const HealthPackagesNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <MainShell hasTabBar={false} showFab={false}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen name="HealthPackagesList" component={HealthPackagesScreen} />
        <Stack.Screen name="HealthPackageDetail" component={HealthPackageDetailScreen} />
        <Stack.Screen name="HealthPackageBooking" component={HealthPackageBookingScreen} />
      </Stack.Navigator>
    </MainShell>
  );
};
