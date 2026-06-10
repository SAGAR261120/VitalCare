import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InsuranceCard } from '../../components/cards/InsuranceCard';
import { EmptyState } from '../../components/common/EmptyState';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { InsuranceActionGrid } from '../../components/insurance/InsuranceActionGrid';
import { InsurancePromoBanner } from '../../components/insurance/InsurancePromoBanner';
import { InsuranceProviderChips } from '../../components/insurance/InsuranceProviderChips';
import { SubmitRequirementModal } from '../../components/insurance/SubmitRequirementModal';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { InsuranceStackParamList } from '../../types';
import type { Banner } from '../../hooks/useApi';

type Nav = NativeStackNavigationProp<InsuranceStackParamList, 'InsuranceList'>;
type Route = RouteProp<InsuranceStackParamList, 'InsuranceList'>;

const ICON_BTN = 44;
const HEADER_GAP = spacing['2'];

const ACTIONS = [
  { key: 'submit', icon: 'create-outline', label: 'Submit Requirements' },
  { key: 'view', icon: 'eye-outline', label: 'View Requirements' },
  { key: 'upload', icon: 'cloud-upload-outline', label: 'Upload Insurance', primary: true },
];

export const InsuranceListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [plans, setPlans] = useState<any[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [providerFilter, setProviderFilter] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [planRes, homeRes] = await Promise.all([
        api.content.getInsurancePlans({ limit: 50 }),
        api.content.getHome(),
      ]);
      setPlans(planRes.data.data.items || []);
      setBanner(homeRes.data.data.insuranceBanner || null);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (route.params?.openSubmit && isAuthenticated) {
      setSubmitVisible(true);
      navigation.setParams({ openSubmit: undefined });
    }
  }, [route.params?.openSubmit, isAuthenticated, navigation]);

  const companies = useMemo(
    () => [...new Set(plans.map(p => p.provider).filter(Boolean))],
    [plans],
  );

  const filteredPlans = useMemo(
    () => (providerFilter ? plans.filter(p => p.provider === providerFilter) : plans),
    [plans, providerFilter],
  );

  const selectedProviderName = providerFilter || 'All Plans';

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please log in to use this feature.');
      return;
    }
    action();
  };

  const handleAction = (key: string) => {
    if (key === 'submit') requireAuth(() => setSubmitVisible(true));
    if (key === 'view') requireAuth(() => navigation.navigate('ViewRequirements'));
    if (key === 'upload') requireAuth(() => navigation.navigate('UploadInsurance'));
  };

  const handleSubmit = async (data: Record<string, string>) => {
    await api.insurance.submitRequirement({
      type: 'requirement',
      insuranceCompany: data.insuranceCompany,
      mobileNumber: data.mobileNumber,
      numberOfPeople: Number(data.numberOfPeople),
      policyTenure: data.policyTenure,
      preferredAmount: Number(data.preferredAmount),
    });
    Alert.alert('Submitted', 'Your insurance requirement has been submitted successfully.');
  };

  if (loading && !refreshing) return <Loader fullScreen message="Loading insurance plans..." />;

  const listHeader = (
    <View style={styles.headerBlock}>
      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.headerRow}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.headerTitle}>Insurance Plans</Text>
          <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
        </View>
        <Text
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.headerSubtitle}>
          Compare plans and manage your policies
        </Text>
      </Animated.View>

      <InsurancePromoBanner
        title={banner?.title}
        subtitle={banner?.subtitle}
        image={banner?.image}
        gradient={banner?.gradient}
      />

      <InsuranceActionGrid actions={ACTIONS} onPress={handleAction} />

      {companies.length > 1 && (
        <InsuranceProviderChips
          providers={companies}
          selected={providerFilter}
          onSelect={setProviderFilter}
        />
      )}

      <View style={styles.listHeader}>
        <Text variant="h4">{selectedProviderName}</Text>
        <View style={[styles.countBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text variant="caption" color={theme.colors.primary}>
            {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer safeBottom>
      <FlatList
        style={styles.list}
        data={filteredPlans}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState
              title="No insurance plans"
              description="Insurance plans will appear here once added by admin."
              icon="shield-outline"
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardWrap}>
            <InsuranceCard
              plan={{ ...item, id: item._id }}
              variant="list"
              index={index}
              onPress={() => navigation.navigate('InsuranceDetail', { planId: item._id })}
            />
          </View>
        )}
      />
      <SubmitRequirementModal
        visible={submitVisible}
        companies={companies}
        onClose={() => setSubmitVisible(false)}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerBlock: {
    gap: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    gap: HEADER_GAP,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'left',
  },
  headerSubtitle: {
    paddingHorizontal: SCREEN_GUTTER,
    marginTop: spacing['1'],
    marginBottom: spacing['4'],
    marginLeft: ICON_BTN + HEADER_GAP,
    marginRight: ICON_BTN + HEADER_GAP,
  },
  list: { flex: 1 },
  listContent: {
    paddingBottom: spacing['4'],
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['3'],
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardWrap: {
    paddingHorizontal: SCREEN_GUTTER,
  },
  emptyWrap: {
    paddingHorizontal: SCREEN_GUTTER,
  },
});
