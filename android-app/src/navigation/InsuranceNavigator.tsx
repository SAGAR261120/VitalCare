import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainShell } from '../components/common/MainShell';
import { InsuranceDetailScreen } from '../screens/insurance/InsuranceDetailScreen';
import { InsuranceListScreen } from '../screens/insurance/InsuranceListScreen';
import { UploadInsuranceScreen } from '../screens/insurance/UploadInsuranceScreen';
import { ViewRequirementsScreen } from '../screens/insurance/ViewRequirementsScreen';
import { InsuranceStackParamList } from '../types';

const Stack = createNativeStackNavigator<InsuranceStackParamList>();

export const InsuranceNavigator: React.FC = () => (
  <MainShell hasTabBar={false} showFab={false}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="InsuranceList" component={InsuranceListScreen} />
      <Stack.Screen name="InsuranceDetail" component={InsuranceDetailScreen} />
      <Stack.Screen name="ViewRequirements" component={ViewRequirementsScreen} />
      <Stack.Screen name="UploadInsurance" component={UploadInsuranceScreen} />
    </Stack.Navigator>
  </MainShell>
);
