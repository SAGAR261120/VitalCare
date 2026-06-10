import React, { useEffect, useMemo } from 'react';
import { Alert, ImageBackground, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { HealthPackageCard } from '../../components/cards/HealthPackageCard';
import { InsuranceHomeCard } from '../../components/cards/InsuranceHomeCard';
import { SpecialistCard } from '../../components/cards/SpecialistCard';
import { PeriodPregnancyHomeBanner } from '../../components/cycle/PeriodPregnancyHomeBanner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { HomeScreenSkeleton } from '../../components/common/HomeScreenSkeleton';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Text } from '../../components/common/Text';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useHomeFeed } from '../../hooks/useApi';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { screen } from '../../utils/responsive';
import { resolveMediaUrl } from '../../utils/mediaUrl';

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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { location, searchQuery, setSearchQuery, fetchLocation, setAppSettings } = useAppStore();
  const { data, loading, refreshing, error, refetch } = useHomeFeed();

  const quickCardWidth = useMemo(() => {
    const gap = spacing['3'];
    return (screen.width - SCREEN_GUTTER * 2 - gap) / 2;
  }, []);

  useEffect(() => { fetchLocation(); }, [fetchLocation]);
  useEffect(() => {
    if (data?.settings) setAppSettings(data.settings as Record<string, unknown>);
  }, [data?.settings, setAppSettings]);

  const banner = data?.banners?.[0];
  const packages = data?.packages ?? [];
  const insurancePlans = data?.insurance ?? [];
  const cycleBanner = data?.cycleBanner;
  const specialists = data?.specialists ?? [];
  const appName = (data?.settings?.app_name as string) || 'VitalCare';

  const bannerImageUrl = resolveMediaUrl(banner?.image);
  /** Rich violet→sky gradient (same as insurance banner) when no banner image */
  const heroGradient = [theme.colors.heroGradientStart, theme.colors.heroGradientEnd];

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const renderHeroContent = () => (
    <>
      <View style={styles.heroContent}>
        <Text variant="overline" color="rgba(255,255,255,0.85)">{appName}</Text>
        <Text variant="h3" color={theme.colors.white}>{banner?.title}</Text>
        {banner?.subtitle && (
          <Text variant="bodySmall" color="rgba(255,255,255,0.9)" style={styles.heroSubtitle}>
            {banner.subtitle}
          </Text>
        )}
        <TouchableOpacity style={styles.heroCta} accessibilityRole="button" accessibilityLabel="Book now">
          <Text variant="label" color={theme.colors.white}>Book Now</Text>
          <Icon name="arrow-forward" size={16} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      {!bannerImageUrl && (
        <Icon name="medkit" size={48} color="rgba(255,255,255,0.35)" />
      )}
    </>
  );

  if (loading && !data) {
    return (
      <ScreenContainer scrollable safeBottom={false} fabSafeArea tabBarSafeArea>
        <HomeScreenSkeleton />
      </ScreenContainer>
    );
  }

  if (error && !data) {
    return (
      <ScreenContainer safeBottom={false} fabSafeArea tabBarSafeArea>
        <ErrorState
          title="Unable to load home"
          description={error ?? 'Please try again.'}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scrollable
      safeBottom={false}
      fabSafeArea
      tabBarSafeArea
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refetch}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }>
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
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {banner && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          {bannerImageUrl ? (
            <ImageBackground
              source={{ uri: bannerImageUrl }}
              style={[styles.heroBanner, theme.shadows.md]}
              imageStyle={styles.heroImage}>
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.72)', 'rgba(15, 23, 42, 0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroOverlay}>
                {renderHeroContent()}
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroBanner, styles.heroOverlay, theme.shadows.md]}>
              {renderHeroContent()}
            </LinearGradient>
          )}
        </Animated.View>
      )}

      <SectionHeader title="Health Packages" actionLabel="View All" onAction={() => navigation.navigate('HealthPackages')} />
      {packages.length === 0 ? (
        <EmptyState
          title="No packages yet"
          description="Health packages will appear here once available."
          icon="medkit-outline"
        />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.horizontalList}>
          {packages.map((item, index) => (
            <HealthPackageCard
              key={item._id}
              package={{ ...item, id: item._id }}
              index={index}
              onPress={() =>
                navigation.navigate('HealthPackages', {
                  screen: 'HealthPackageDetail',
                  params: { packageId: item._id },
                })
              }
            />
          ))}
        </ScrollView>
      )}

      <SectionHeader title="Insurance Plans" actionLabel="View All" onAction={() => navigation.navigate('Insurance')} />
      {insurancePlans.length === 0 ? (
        <EmptyState
          title="No insurance plans yet"
          description="Insurance plans will appear here once available."
          icon="shield-outline"
        />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.horizontalList}>
          {insurancePlans.map((item, index) => (
            <InsuranceHomeCard
              key={item._id}
              plan={{ ...item, id: item._id }}
              index={index}
              onPress={() =>
                navigation.navigate('Insurance', {
                  screen: 'InsuranceDetail',
                  params: { planId: item._id },
                })
              }
            />
          ))}
        </ScrollView>
      )}

      <SectionHeader
        title="Period & Pregnancy"
        actionLabel="Open Tracker"
        onAction={() => {
          if (!isAuthenticated) {
            Alert.alert('Sign in required', 'Please log in to use the cycle tracker.');
            return;
          }
          navigation.navigate('Cycle');
        }}
      />
      <PeriodPregnancyHomeBanner
        title={cycleBanner?.title}
        subtitle={cycleBanner?.subtitle}
        image={cycleBanner?.image}
        gradient={cycleBanner?.gradient}
      />

      <SectionHeader title="Care Team" actionLabel="See All" onAction={() => navigation.navigate('SearchTab')} />
      {specialists.length === 0 ? (
        <EmptyState
          title="No specialists listed"
          description="Our care team will be shown here soon."
          icon="people-outline"
        />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.horizontalList}>
          {specialists.map((specialist, index) => (
            <SpecialistCard key={specialist._id} specialist={{ ...specialist, id: specialist._id }} index={index} />
          ))}
        </ScrollView>
      )}

      <SectionHeader title="Quick Actions" />
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.label}
            onPress={() => navigation.navigate(action.route)}
            style={[
              styles.quickCard,
              {
                width: quickCardWidth,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              theme.shadows.sm,
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}>
            <View style={[styles.quickIcon, { backgroundColor: `${theme.colors[action.colorKey]}18` }]}>
              <Icon name={action.icon} size={24} color={theme.colors[action.colorKey]} />
            </View>
            <Text variant="label" numberOfLines={1}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    gap: spacing['3'],
  },
  locationWrap: { flex: 1, alignItems: 'center', minWidth: 0 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['1'] },
  greeting: {
    paddingHorizontal: SCREEN_GUTTER,
    marginTop: spacing['5'],
    marginBottom: spacing['4'],
  },
  heroBanner: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing['7'],
    minHeight: 160,
  },
  heroImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    flexDirection: 'row',
    padding: spacing['6'],
    minHeight: 160,
    alignItems: 'center',
  },
  heroContent: { flex: 1, gap: spacing['2'] },
  heroSubtitle: { marginBottom: spacing['2'] },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 20,
  },
  horizontalList: { paddingLeft: SCREEN_GUTTER, paddingBottom: spacing['2'] },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['3'],
    marginBottom: spacing['2'],
  },
  quickCard: {
    padding: spacing['4'],
    borderRadius: 20,
    gap: spacing['2.5'],
    borderWidth: 1,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineEmpty: {
    minHeight: 160,
  },
});