import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { InsuranceEmptyHero } from '../../components/insurance/InsuranceEmptyHero';
import { IconButton } from '../../components/common/IconButton';
import { InsuranceStatsBar } from '../../components/insurance/InsuranceStatsBar';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/format';

export const ViewRequirementsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.insurance.getSubmissions('requirement');
      setItems(res.data.data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
  }), [items]);

  const statusColor = (status: string) => {
    if (status === 'approved') return theme.colors.success;
    if (status === 'rejected') return theme.colors.error;
    if (status === 'reviewed') return theme.colors.info;
    return theme.colors.warning;
  };

  if (loading && !refreshing) return <Loader fullScreen message="Loading requirements..." />;

  return (
      <ScreenContainer safeBottom>
        <View style={styles.headerRow}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.headerTitle}>View Requirements</Text>
          <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
        </View>
        <Text variant="caption" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
          Track your submitted insurance requests
        </Text>

        <InsuranceStatsBar
          total={stats.total}
          pending={stats.pending}
          approved={stats.approved}
        />

        <FlatList
          data={items}
          keyExtractor={item => item._id}
          contentContainerStyle={items.length === 0 ? styles.empty : styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />
          }
          ListEmptyComponent={
            <InsuranceEmptyHero
              title="No Data Found"
              description="You have not submitted any insurance requirements yet."
            />
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
              <View style={styles.cardHeader}>
                <View style={[styles.companyIcon, { backgroundColor: theme.colors.primaryLight }]}>
                  <Icon name="business-outline" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.cardTitle}>
                  <Text variant="label">{item.insuranceCompany}</Text>
                  <Text variant="caption" color={theme.colors.textTertiary}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${statusColor(item.status)}20` }]}>
                  <Text variant="caption" color={statusColor(item.status)}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Icon name="call-outline" size={14} color={theme.colors.textSecondary} />
                  <Text variant="caption" color={theme.colors.textSecondary}>{item.mobileNumber}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="people-outline" size={14} color={theme.colors.textSecondary} />
                  <Text variant="caption" color={theme.colors.textSecondary}>{item.numberOfPeople} people</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="calendar-outline" size={14} color={theme.colors.textSecondary} />
                  <Text variant="caption" color={theme.colors.textSecondary}>{item.policyTenure} years</Text>
                </View>
                {item.preferredAmount ? (
                  <View style={styles.metaItem}>
                    <Icon name="wallet-outline" size={14} color={theme.colors.primary} />
                    <Text variant="caption" color={theme.colors.primary}>{formatCurrency(item.preferredAmount)}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}
        />
      </ScreenContainer>
  );
};

const ICON_BTN = 44;
const HEADER_GAP = spacing['2'];

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    gap: HEADER_GAP,
  },
  headerTitle: { flex: 1 },
  headerSubtitle: {
    paddingHorizontal: SCREEN_GUTTER,
    marginTop: spacing['1'],
    marginBottom: spacing['4'],
    marginLeft: ICON_BTN + HEADER_GAP,
    marginRight: ICON_BTN + HEADER_GAP,
  },
  list: { paddingHorizontal: SCREEN_GUTTER, paddingBottom: spacing['6'] },
  empty: { flexGrow: 1, justifyContent: 'center' },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    gap: spacing['3'],
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing['2.5'] },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { flex: 1, gap: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['3'] },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
