import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/buttons/Button';
import { useAuthStore } from '../../store/authStore';
import { useTheme, useThemeStore } from '../../theme';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile' },
      { icon: 'key-outline', label: 'Change Password' },
      { icon: 'card-outline', label: 'Payment Methods' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'moon-outline', label: 'theme', isThemeToggle: true },
      { icon: 'notifications-outline', label: 'Notifications' },
      { icon: 'language-outline', label: 'Language' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help Center' },
      { icon: 'document-text-outline', label: 'Privacy Policy' },
      { icon: 'shield-checkmark-outline', label: 'Terms of Service' },
    ],
  },
];

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { setMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const toggleTheme = () => {
    setMode(theme.isDark ? 'light' : 'dark');
  };

  return (
    <ScreenContainer scrollable safeBottom={false} fabSafeArea tabBarSafeArea style={styles.screen}>
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.profileCard, { backgroundColor: theme.colors.surface }, theme.shadows.md]}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.primary },
          ]}>
          <Text variant="h1" color={theme.colors.white}>
            {user?.firstName?.[0] ?? 'U'}
          </Text>
        </View>
        <Text variant="h3">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          {user?.email}
        </Text>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: theme.colors.primaryLight },
          ]}>
          <Text variant="caption" color={theme.colors.primary}>
            {user?.role?.replace('_', ' ').toUpperCase() ?? 'PATIENT'}
          </Text>
        </View>
      </Animated.View>

      {MENU_SECTIONS.map((section, sIndex) => (
        <Animated.View
          key={section.title}
          entering={FadeInDown.delay(sIndex * 100).duration(400)}
          style={styles.section}>
          <Text
            variant="overline"
            color={theme.colors.textTertiary}
            style={styles.sectionTitle}>
            {section.title}
          </Text>
          <View
            style={[
              styles.menuGroup,
              { backgroundColor: theme.colors.surface },
              theme.shadows.sm,
            ]}>
            {section.items.map((item, iIndex) => {
              const isThemeToggle = 'isThemeToggle' in item && item.isThemeToggle;
              const label = isThemeToggle
                ? theme.isDark
                  ? 'Dark Mode'
                  : 'Light Mode'
                : item.label;
              const icon = isThemeToggle
                ? theme.isDark
                  ? 'moon'
                  : 'sunny-outline'
                : item.icon;

              return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  iIndex < section.items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.divider,
                  },
                ]}
                onPress={isThemeToggle ? toggleTheme : undefined}
                accessibilityRole="button"
                accessibilityLabel={label}>
                <Icon
                  name={icon}
                  size={22}
                  color={theme.colors.primary}
                />
                <Text variant="body" style={styles.menuLabel}>
                  {label}
                </Text>
                {isThemeToggle ? (
                  <View
                    style={[
                      styles.toggle,
                      {
                        backgroundColor: theme.isDark
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}>
                    <View
                      style={[
                        styles.toggleKnob,
                        { backgroundColor: theme.colors.white },
                        theme.isDark && styles.toggleKnobActive,
                      ]}
                    />
                  </View>
                ) : (
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textTertiary}
                  />
                )}
              </TouchableOpacity>
            );})}
          </View>
        </Animated.View>
      ))}

      <Button
        title="Sign Out"
        variant="danger"
        onPress={logout}
        fullWidth
        icon="log-out-outline"
        style={styles.logoutBtn}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  profileCard: {
    margin: 20,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    marginLeft: 4,
  },
  menuGroup: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
});
