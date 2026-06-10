import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_NAME } from '../constants';
import { Text } from '../components/common/Text';
import { MembershipScreen } from '../screens/services/MembershipScreen';
import { InsuranceNavigator } from './InsuranceNavigator';
import { HealthPackagesNavigator } from './HealthPackagesNavigator';
import { CycleNavigator } from './CycleNavigator';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme';
import { DrawerParamList } from '../types';
import { TabNavigator } from './TabNavigator';
import { MainShell } from '../components/common/MainShell';

const TabNavigatorShell = () => (
  <MainShell hasTabBar>
    <TabNavigator />
  </MainShell>
);

const MembershipWithFab = () => (
  <MainShell hasTabBar={false}>
    <MembershipScreen />
  </MainShell>
);

const InsuranceWithFab = () => <InsuranceNavigator />;

const HealthPackagesWithFab = () => <HealthPackagesNavigator />;

const CycleWithFab = () => <CycleNavigator />;

const Drawer = createDrawerNavigator<DrawerParamList>();

const DRAWER_SECTIONS = [
  {
    title: 'Dashboard',
    items: [{ icon: 'home-outline', label: 'Home', route: 'MainTabs' }],
  },
  {
    title: 'Services',
    items: [
      { icon: 'medkit-outline', label: 'Health Packages', route: 'HealthPackages' },
      { icon: 'shield-checkmark-outline', label: 'Membership Plans', route: 'Membership' },
      { icon: 'umbrella-outline', label: 'Insurance', route: 'Insurance' },
      { icon: 'flower-outline', label: 'Period & Pregnancy', route: 'Cycle' },
      { icon: 'fitness-outline', label: 'Yoga Sessions', route: 'MainTabs' },
      { icon: 'water-outline', label: 'Blood Donation', route: 'MainTabs' },
    ],
  },
  {
    title: 'Records',
    items: [
      { icon: 'folder-outline', label: 'Medical Records', route: 'MainTabs' },
      { icon: 'id-card-outline', label: 'Patient Details', route: 'MainTabs' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'settings-outline', label: 'Settings', route: 'MainTabs' },
      { icon: 'help-circle-outline', label: 'Help & FAQ', route: 'MainTabs' },
    ],
  },
];

const CustomDrawerContent = (props: any) => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      style={{ backgroundColor: theme.colors.background }}>
      <View
        style={[
          styles.drawerHeader,
          { backgroundColor: theme.colors.surface },
          theme.shadows.md,
        ]}>
        <View
          style={[
            styles.logoMark,
            { backgroundColor: theme.colors.primary },
          ]}>
          <Text variant="h3" color={theme.colors.white}>
            V
          </Text>
        </View>
        <View>
          <Text variant="h4">{APP_NAME}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
      </View>

      {DRAWER_SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text
            variant="overline"
            color={theme.colors.primary}
            style={styles.sectionTitle}>
            {section.title}
          </Text>
          {section.items.map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.drawerItem}
              onPress={() => props.navigation.navigate(item.route)}
              accessibilityRole="button"
              accessibilityLabel={item.label}>
              <Icon
                name={item.icon}
                size={22}
                color={theme.colors.text}
              />
              <Text variant="body">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.colors.error }]}
        onPress={() => {
          props.navigation.closeDrawer();
          void logout();
        }}
        accessibilityRole="button"
        accessibilityLabel="Logout">
        <Icon name="log-out-outline" size={20} color={theme.colors.white} />
        <Text variant="label" color={theme.colors.white}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export const DrawerNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: 300,
        },
        overlayColor: theme.colors.overlay,
        swipeEnabled: true,
      }}>
      <Drawer.Screen name="MainTabs" component={TabNavigatorShell} />
      <Drawer.Screen name="HealthPackages" component={HealthPackagesWithFab} />
      <Drawer.Screen name="Membership" component={MembershipWithFab} />
      <Drawer.Screen name="Insurance" component={InsuranceWithFab} />
      <Drawer.Screen name="Cycle" component={CycleWithFab} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
});
