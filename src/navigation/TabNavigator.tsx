import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { springConfig } from '../animations/config';
import { AppointmentsScreen } from '../screens/appointments/AppointmentsScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { RewardsScreen } from '../screens/rewards/RewardsScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { useTheme } from '../theme';
import { MainTabParamList } from '../types';
import { Text } from '../components/common/Text';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_CONFIG = [
  { name: 'Home' as const, icon: 'home', iconOutline: 'home-outline', component: HomeScreen },
  { name: 'Appointments' as const, icon: 'calendar', iconOutline: 'calendar-outline', component: AppointmentsScreen },
  { name: 'SearchTab' as const, icon: 'search', iconOutline: 'search-outline', component: SearchScreen, isCenter: true },
  { name: 'Rewards' as const, icon: 'ribbon', iconOutline: 'ribbon-outline', component: RewardsScreen },
  { name: 'Profile' as const, icon: 'person', iconOutline: 'person-outline', component: ProfileScreen },
];

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][number];
  index: number;
  isFocused: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  route,
  index,
  isFocused,
  onPress,
}) => {
  const theme = useTheme();
  const config = TAB_CONFIG[index];
  const isCenter = config?.isCenter;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isFocused ? 1.1 : 1, springConfig) },
    ],
  }));

  const label = config?.name === 'SearchTab' ? 'Search' : config?.name ?? route.name;
  const iconName = isFocused ? config?.icon : config?.iconOutline;

  if (isCenter) {
    return (
      <Animated.View key={route.key} style={animatedStyle}>
        <View
          onTouchEnd={onPress}
          style={[
            styles.centerButton,
            { backgroundColor: theme.colors.primary },
            theme.shadows.glow,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Search"
          accessibilityState={{ selected: isFocused }}>
          <Icon name="search" size={26} color={theme.colors.white} />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View key={route.key} style={[styles.tab, animatedStyle]}>
      <View
        onTouchEnd={onPress}
        style={styles.tabInner}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isFocused }}>
        <Icon
          name={iconName ?? 'ellipse'}
          size={22}
          color={
            isFocused ? theme.colors.primary : theme.colors.textTertiary
          }
        />
        <Text
          variant="caption"
          color={
            isFocused ? theme.colors.primary : theme.colors.textTertiary
          }>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
        },
        theme.shadows.sm,
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            index={index}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      {TAB_CONFIG.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    height: 72,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
});
