import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { InsuranceDetailRow } from '../../components/insurance/InsuranceDetailRow';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { InsuranceStackParamList } from '../../types';
import { formatCoverage, formatCurrency } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/mediaUrl';

type Route = RouteProp<InsuranceStackParamList, 'InsuranceDetail'>;
type Nav = NativeStackNavigationProp<InsuranceStackParamList, 'InsuranceDetail'>;

const DETAIL_FIELDS: { key: string; label: string; icon: string; format?: (v: unknown) => string }[] = [
  { key: 'coverage', label: 'Coverage', icon: 'shield-outline', format: v => formatCoverage(v as number) },
  { key: 'tenure', label: 'Tenure', icon: 'calendar-outline' },
  { key: 'premium', label: 'Premium', icon: 'wallet-outline', format: v => `${formatCurrency(v as number)}/year` },
  { key: 'cashlessHospitals', label: 'Cashless', icon: 'people-outline' },
  { key: 'sumInsured', label: 'Sum Insured', icon: 'card-outline', format: v => formatCoverage(v as number) },
  { key: 'subLimits', label: 'Sub Limits', icon: 'bar-chart-outline' },
  { key: 'noClaimBonus', label: 'No Claim Bonus', icon: 'gift-outline' },
  { key: 'waitingPeriod', label: 'Waiting Period', icon: 'hourglass-outline' },
  { key: 'claimSettlementRatio', label: 'Claim Settlement Ratio', icon: 'checkmark-circle-outline' },
  { key: 'coPayment', label: 'Co-Payment', icon: 'cash-outline' },
];

export const InsuranceDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.content.getInsurancePlan(params.planId);
      setPlan(res.data.data);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, [params.planId]);

  useEffect(() => { load(); }, [load]);

  const openPdf = () => {
    if (!plan?.pdfUrl) return;
    Linking.openURL(resolveMediaUrl(plan.pdfUrl) || plan.pdfUrl).catch(() => {});
  };

  const header = (
    <View style={styles.header}>
      <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
      <View style={styles.titleBlock}>
        <Text variant="h3">Plan Details</Text>
        {plan?.name ? (
          <Text variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
            {plan.name}
          </Text>
        ) : null}
      </View>
      <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
    </View>
  );

  if (loading) return <Loader fullScreen message="Loading plan details..." />;

  if (error || !plan) {
    return (
      <ScreenContainer safeBottom>
        {header}
        <ErrorState title="Plan not found" description={error || ''} onRetry={load} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable safeBottom>
      {header}

      <LinearGradient
        colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, theme.shadows.md]}>
        <View style={[styles.heroIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Icon name="shield-checkmark" size={30} color={theme.colors.white} />
        </View>
        <View style={styles.heroText}>
          <Text variant="h4" color={theme.colors.white}>{plan.provider}</Text>
          <Text variant="bodySmall" color="rgba(255,255,255,0.9)">{plan.name}</Text>
          {plan.recommended && (
            <View style={[styles.recTag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Icon name="star" size={12} color={theme.colors.white} />
              <Text variant="caption" color={theme.colors.white}>Recommended</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {plan.description ? (
        <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.desc}>
          {plan.description}
        </Text>
      ) : null}

      <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text variant="label" color={theme.colors.primary} style={styles.detailsTitle}>Plan Highlights</Text>
        {DETAIL_FIELDS.map(field => {
          const value = plan[field.key];
          if (value === undefined || value === null || value === '') return null;
          const display = field.format ? field.format(value) : String(value);
          return (
            <InsuranceDetailRow
              key={field.key}
              icon={field.icon}
              label={field.label}
              value={display}
            />
          );
        })}
      </View>

      {plan.pdfUrl ? (
        <TouchableOpacity activeOpacity={0.9} onPress={openPdf} style={styles.pdfWrap}>
          <View style={[styles.pdfBtn, { backgroundColor: theme.colors.primary }]}>
            <Icon name="document-text-outline" size={18} color={theme.colors.white} />
            <Text variant="label" color={theme.colors.white}>View PDF</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['2'],
  },
  titleBlock: { flex: 1, gap: 2 },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SCREEN_GUTTER,
    padding: spacing['5'],
    borderRadius: 24,
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1, gap: 6 },
  recTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  desc: {
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['4'],
    lineHeight: 22,
  },
  detailsCard: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['4'],
    gap: spacing['2'],
  },
  detailsTitle: { marginBottom: spacing['1'] },
  pdfWrap: { marginHorizontal: SCREEN_GUTTER, marginBottom: spacing['8'] },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3.5'],
    borderRadius: 16,
  },
});
