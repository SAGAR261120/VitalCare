import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { TAB_BAR_HEIGHT } from '../constants/layout';
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
  { name: 'Home' as const, label: 'Home', icon: 'home', iconOutline: 'home-outline', component: HomeScreen },
  { name: 'Appointments' as const, label: 'Visits', icon: 'calendar', iconOutline: 'calendar-outline', component: AppointmentsScreen },
  { name: 'SearchTab' as const, label: 'Search', icon: 'search', iconOutline: 'search-outline', component: SearchScreen, isCenter: true },
  { name: 'Rewards' as const, label: 'Rewards', icon: 'ribbon', iconOutline: 'ribbon-outline', component: RewardsScreen },
  { name: 'Profile' as const, label: 'Profile', icon: 'person', iconOutline: 'person-outline', component: ProfileScreen },
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
      { scale: withSpring(isFocused ? 1.08 : 1, springConfig) },
    ],
  }));

  const label = config?.label ?? route.name;
  const iconName = isFocused ? config?.icon : config?.iconOutline;

  if (isCenter) {
    return (
      <Animated.View key={route.key} style={[styles.centerTab, animatedStyle]}>
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
        <Text
          variant="caption"
          numberOfLines={1}
          color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
          style={styles.centerLabel}>
          {label}
        </Text>
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
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          color={
            isFocused ? theme.colors.primary : theme.colors.textTertiary
          }
          style={styles.tabLabel}>
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
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          paddingBottom: bottomPad,
          height: TAB_BAR_HEIGHT + bottomPad - 8,
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
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  tabInner: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    width: '100%',
  },
  tabLabel: {
    textAlign: 'center',
    maxWidth: '100%',
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
  },
  centerLabel: {
    marginTop: 4,
    textAlign: 'center',
  },
});
