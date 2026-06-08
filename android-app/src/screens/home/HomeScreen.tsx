import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { HealthPackageCard } from '../../components/cards/HealthPackageCard';
import { SpecialistCard } from '../../components/cards/SpecialistCard';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Text } from '../../components/common/Text';
import { FloatingActions } from '../../components/common/FloatingActions';
import { useHomeFeed } from '../../hooks/useApi';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';

const QUICK_ACTIONS = [
  { icon: 'fitness-outline', label: 'Wellness', colorKey: 'actionWellness' as const, route: 'Membership' },
  { icon: 'heart-outline', label: 'Insurance', colorKey: 'actionInsurance' as const, route: 'Insurance' },
  { icon: 'water-outline', label: 'Blood Bank', colorKey: 'actionBlood' as const, route: 'Home' },
  { icon: 'leaf-outline', label: 'Yoga', colorKey: 'actionYoga' as const, route: 'Home' },
];

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const { location, searchQuery, setSearchQuery, fetchLocation, setAppSettings } = useAppStore();
  const { data, loading, refreshing, refetch } = useHomeFeed();

  useEffect(() => { fetchLocation(); }, [fetchLocation]);
  useEffect(() => {
    if (data?.settings) setAppSettings(data.settings as Record<string, unknown>);
  }, [data?.settings, setAppSettings]);

  const banner = data?.banners?.[0];
  const packages = data?.packages ?? [];
  const specialists = data?.specialists ?? [];
  const appName = (data?.settings?.app_name as string) || 'VitalCare';

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  if (loading && !data) return <Loader fullScreen message="Loading dashboard..." />;

  return (
    <ScreenContainer scrollable safeBottom={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={theme.colors.primary} />}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <IconButton name="menu-outline" onPress={openDrawer} accessibilityLabel="Open menu" />
        <TouchableOpacity style={styles.locationWrap} onPress={fetchLocation}>
          <View style={styles.locationRow}>
            <Icon name="location" size={16} color={theme.colors.primary} />
            <Text variant="caption" color={theme.colors.primary}>Your Location</Text>
            <Icon name="refresh" size={14} color={theme.colors.primary} />
          </View>
          <Text variant="label" numberOfLines={1}>
            {location.isLoading ? 'Updating...' : location.address}
          </Text>
        </TouchableOpacity>
        <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Text variant="h3" style={styles.greeting}>Hello, {user?.firstName ?? 'there'} 👋</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery}
          onSubmit={() => navigation.navigate('SearchTab', { query: searchQuery })} />
      </Animated.View>

      {banner && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <LinearGradient
            colors={banner.gradient?.length === 2 ? banner.gradient : [theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.heroBanner, theme.shadows.md]}>
            <View style={styles.heroContent}>
              <Text variant="overline" color="rgba(255,255,255,0.85)">{appName}</Text>
              <Text variant="h3" color={theme.colors.white}>{banner.title}</Text>
              {banner.subtitle && (
                <Text variant="bodySmall" color="rgba(255,255,255,0.9)" style={styles.heroSubtitle}>{banner.subtitle}</Text>
              )}
              <TouchableOpacity style={styles.heroCta}>
                <Text variant="label" color={theme.colors.white}>Book Now</Text>
                <Icon name="arrow-forward" size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            <Icon name="medkit" size={48} color="rgba(255,255,255,0.35)" />
          </LinearGradient>
        </Animated.View>
      )}

      <SectionHeader title="Health Packages" actionLabel="View All" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.horizontalList}>
        {packages.map((item, index) => (
          <HealthPackageCard key={item._id} package={{ ...item, id: item._id }} index={index} />
        ))}
      </ScrollView>

      <SectionHeader title="Care Team" actionLabel="See All" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.horizontalList}>
        {specialists.map((specialist, index) => (
          <SpecialistCard key={specialist._id} specialist={{ ...specialist, id: specialist._id }} index={index} />
        ))}
      </ScrollView>

      <SectionHeader title="Quick Actions" />
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((action, i) => (
          <TouchableOpacity key={action.label}
            onPress={() => navigation.navigate(action.route)}
            style={[styles.quickCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
            <View style={[styles.quickIcon, { backgroundColor: `${theme.colors[action.colorKey]}18` }]}>
              <Icon name={action.icon} size={24} color={theme.colors[action.colorKey]} />
            </View>
            <Text variant="label">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.bottomSpacer} />
      <FloatingActions />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  locationWrap: { flex: 1, alignItems: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greeting: { paddingHorizontal: 20, marginBottom: 16 },
  heroBanner: { marginHorizontal: 20, borderRadius: 24, padding: 24, flexDirection: 'row', marginBottom: 28, overflow: 'hidden' },
  heroContent: { flex: 1, gap: 8 },
  heroSubtitle: { marginBottom: 8 },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.22)', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  horizontalList: { paddingLeft: 20, paddingBottom: 8 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  quickCard: { width: '47%', padding: 16, borderRadius: 20, gap: 10, borderWidth: 1 },
  quickIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bottomSpacer: { height: 100 },
});
