import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../../components/buttons/Button';
import { BookDateTimeModal } from '../../components/health-packages/BookDateTimeModal';
import { BookNowButton } from '../../components/health-packages/BookNowButton';
import { getBookingTheme } from '../../components/health-packages/bookingTheme';
import { ErrorState } from '../../components/common/ErrorState';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { HealthPackage, HealthPackagesStackParamList } from '../../types';
import { formatCurrency, formatDiscount } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/mediaUrl';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Route = RouteProp<HealthPackagesStackParamList, 'HealthPackageDetail'>;
type Nav = NativeStackNavigationProp<HealthPackagesStackParamList, 'HealthPackageDetail'>;

interface SectionCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, children, delay = 0 }) => {
  const theme = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[
        styles.sectionCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        theme.shadows.sm,
      ]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primaryLight }]}>
          <Icon name={icon as never} size={18} color={theme.colors.primary} />
        </View>
        <Text variant="h4">{title}</Text>
      </View>
      {children}
    </Animated.View>
  );
};

const QuickStat: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.quickStat, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Icon name={icon as never} size={18} color={theme.colors.primary} />
      <Text variant="caption" color={theme.colors.textSecondary}>{label}</Text>
      <Text variant="label" numberOfLines={1}>{value}</Text>
    </View>
  );
};

export const HealthPackageDetailScreen: React.FC = () => {
  const theme = useTheme();
  const booking = getBookingTheme(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [pkg, setPkg] = useState<HealthPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTests, setExpandedTests] = useState<Record<number, boolean>>({});
  const [showAllTests, setShowAllTests] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const bottomBarHeight = 88 + Math.max(insets.bottom, spacing['3']);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await api.content.getHealthPackage(params.packageId);
      setPkg({ ...res.data.data, id: res.data.data._id });
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to load package');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.packageId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (params.startBooking && pkg) {
      if (!isAuthenticated) {
        Alert.alert('Sign in required', 'Please log in to book a health package.');
        return;
      }
      setBookingModalVisible(true);
    }
  }, [params.startBooking, pkg, isAuthenticated]);

  const openBooking = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please log in to book a health package.');
      return;
    }
    setBookingModalVisible(true);
  };

  const handleBookingConfirm = (date: string, time: string) => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please log in to book a health package.');
      return;
    }
    setBookingModalVisible(false);
    navigation.navigate('HealthPackageBooking', {
      packageId: params.packageId,
      packageName: pkg?.name,
      date,
      time,
    });
  };

  const toggleTest = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTests(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading && !refreshing) {
    return <Loader fullScreen message="Loading package details..." />;
  }

  if (error || !pkg) {
    return (
      <ScreenContainer safeBottom>
        <View style={styles.header}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.title}>Package Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ErrorState
          title="Package not found"
          description={error || 'This package may no longer be available.'}
          onRetry={() => load()}
        />
      </ScreenContainer>
    );
  }

  const imageUrl = resolveMediaUrl(pkg.image);
  const tests = pkg.includedTests || [];
  const visibleTests = showAllTests ? tests : tests.slice(0, 5);
  const testCount = pkg.testCount || tests.length;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScreenContainer
        scrollable
        safeBottom={false}
        contentStyle={{ paddingBottom: bottomBarHeight }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />
        }>
        <View style={styles.header}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.title}>Package Details</Text>
          <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
        </View>

        <Animated.View entering={FadeInDown.duration(350)} style={styles.heroWrap}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
              style={styles.heroImage}
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.55)']}
            style={styles.heroOverlay}
          />
          {pkg.badge && (
            <View style={[styles.heroBadge, { backgroundColor: theme.colors.accentWarm }]}>
              <Text variant="caption" color={theme.colors.white}>{pkg.badge}</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          style={[styles.titleCard, { backgroundColor: theme.colors.primary }, theme.shadows.md]}>
          <Text variant="h3" color={theme.colors.white}>{pkg.name}</Text>
          {pkg.code && (
            <Text variant="caption" color="rgba(255,255,255,0.75)">Code: {pkg.code}</Text>
          )}
          {pkg.reportDeliveryTime && (
            <View style={styles.reportRow}>
              <View style={styles.reportIcon}>
                <Icon name="document-text" size={14} color={theme.colors.accentWarm} />
              </View>
              <Text variant="bodySmall" color="rgba(255,255,255,0.9)">
                Reports within{' '}
                <Text variant="label" color={theme.colors.accentWarm}>{pkg.reportDeliveryTime}</Text>
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.quickStats}>
          <QuickStat icon="flask-outline" label="Tests" value={`${testCount}+`} />
          <QuickStat icon="time-outline" label="Duration" value={pkg.packageDuration || 'Flexible'} />
          <QuickStat icon="flash-outline" label="Delivery" value={pkg.reportDeliveryTime || 'Fast'} />
        </Animated.View>

        {pkg.description && (
          <SectionCard icon="information-circle-outline" title="About This Package" delay={160}>
            <Text variant="bodySmall" color={theme.colors.textSecondary}>{pkg.description}</Text>
          </SectionCard>
        )}

        {tests.length > 0 && (
          <SectionCard icon="list-outline" title={`${testCount}+ Tests Included`} delay={200}>
            {visibleTests.map((test, index) => (
              <View key={`${test}-${index}`}>
                <TouchableOpacity
                  style={[styles.accordionItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => toggleTest(index)}
                  accessibilityRole="button">
                  <View style={styles.testRow}>
                    <View style={[styles.testDot, { backgroundColor: theme.colors.secondary }]} />
                    <Text variant="body" style={styles.testName}>{test}</Text>
                  </View>
                  <Icon
                    name={expandedTests[index] ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                {expandedTests[index] && (
                  <Text variant="caption" color={theme.colors.textSecondary} style={styles.testDetail}>
                    Included in this package screening panel.
                  </Text>
                )}
              </View>
            ))}
            {tests.length > 5 && !showAllTests && (
              <Button title="View All Tests" variant="ghost" onPress={() => setShowAllTests(true)} fullWidth />
            )}
          </SectionCard>
        )}

        <SectionCard icon="water-outline" title="Sample Collection" delay={240}>
          <View style={styles.sampleRow}>
            <View style={[styles.sampleIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name="beaker-outline" size={20} color={theme.colors.primary} />
            </View>
            <Text variant="body">Blood & Urine (as applicable)</Text>
          </View>
        </SectionCard>

        {pkg.benefits && pkg.benefits.length > 0 && (
          <SectionCard icon="gift-outline" title="Benefits" delay={280}>
            {pkg.benefits.map(benefit => (
              <View key={benefit} style={styles.bulletRow}>
                <Icon name="checkmark-circle" size={18} color={theme.colors.secondary} />
                <Text variant="bodySmall" style={styles.bulletText}>{benefit}</Text>
              </View>
            ))}
          </SectionCard>
        )}

        {pkg.preparationInstructions && (
          <SectionCard icon="alert-circle-outline" title="Preparation Instructions" delay={320}>
            <View style={[styles.prepBox, { backgroundColor: theme.colors.primaryLight }]}>
              <Text variant="bodySmall" color={theme.colors.text}>{pkg.preparationInstructions}</Text>
            </View>
          </SectionCard>
        )}

        {pkg.recommendedFor && pkg.recommendedFor.length > 0 && (
          <SectionCard icon="people-outline" title="Recommended For" delay={360}>
            <View style={styles.tagRow}>
              {pkg.recommendedFor.map(item => (
                <View key={item} style={[styles.tag, { backgroundColor: theme.colors.primaryLight }]}>
                  <Text variant="caption" color={theme.colors.primary}>{item}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {pkg.excludedTests && pkg.excludedTests.length > 0 && (
          <SectionCard icon="close-circle-outline" title="Excluded Tests" delay={400}>
            {pkg.excludedTests.map(test => (
              <View key={test} style={styles.bulletRow}>
                <Icon name="remove-circle-outline" size={16} color={theme.colors.textTertiary} />
                <Text variant="bodySmall" color={theme.colors.textSecondary}>{test}</Text>
              </View>
            ))}
          </SectionCard>
        )}
      </ScreenContainer>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: booking.formBorder,
            paddingBottom: Math.max(insets.bottom, spacing['3']),
          },
          theme.shadows.lg,
        ]}>
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text variant="h2" color={theme.colors.primary}>{formatCurrency(pkg.price)}</Text>
            {!!pkg.discount && (
              <View style={[styles.discountPill, { backgroundColor: `${booking.iconGold}22` }]}>
                <Text variant="caption" color={booking.iconGold}>{formatDiscount(pkg.discount)}</Text>
              </View>
            )}
          </View>
          {!!pkg.originalPrice && pkg.originalPrice > pkg.price && (
            <Text variant="caption" color={theme.colors.textTertiary} style={styles.strike}>
              MRP {formatCurrency(pkg.originalPrice)}
            </Text>
          )}
          <Text variant="caption" color={theme.colors.textSecondary}>{testCount}+ Tests Included</Text>
        </View>
        <BookNowButton
          onPress={openBooking}
          style={styles.bookBtn}
        />
      </View>

      <BookDateTimeModal
        visible={bookingModalVisible}
        packageName={pkg.name}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={handleBookingConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['2'],
  },
  title: { flex: 1, textAlign: 'center' },
  headerSpacer: { width: 40 },
  heroWrap: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing['3'],
    height: 200,
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroBadge: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  titleCard: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 20,
    padding: spacing['5'],
    marginBottom: spacing['3'],
    gap: spacing['2'],
  },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], marginTop: spacing['1'] },
  reportIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['2.5'],
    marginBottom: spacing['4'],
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['2'],
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing['1'],
  },
  sectionCard: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3.5'],
    gap: spacing['3'],
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing['2.5'] },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderBottomWidth: 1,
  },
  testRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], flex: 1 },
  testDot: { width: 6, height: 6, borderRadius: 3 },
  testName: { flex: 1 },
  testDetail: { paddingBottom: spacing['2'], paddingLeft: spacing['3.5'] },
  sampleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'] },
  sampleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing['2'] },
  bulletText: { flex: 1 },
  prepBox: { padding: spacing['3'], borderRadius: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['3.5'],
    borderTopWidth: 1,
  },
  priceInfo: { flex: 1, gap: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  discountPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  strike: { textDecorationLine: 'line-through' },
  bookBtn: { minWidth: 140 },
});
