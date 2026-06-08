import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { MembershipCard } from '../../components/cards/MembershipCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import type { MembershipPlan } from '../../hooks/useApi';

export const MembershipScreen: React.FC = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.content.getMembershipPlans();
      setPlans(res.data.data.items || []);
    } catch { setPlans([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader fullScreen message="Loading plans..." />;

  return (
    <ScreenContainer scrollable safeBottom={false} fabSafeArea refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />}>
      <View style={styles.header}>
        <Text variant="h2">Membership Plans</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>Choose the plan that fits your health goals</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {plans.length === 0 ? (
          <EmptyState title="No plans available" description="Membership plans will appear here once added by admin." />
        ) : plans.map(plan => (
          <MembershipCard key={plan._id} plan={{ ...plan, id: plan._id, features: plan.features || [] }} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: SCREEN_GUTTER, paddingTop: 16, paddingBottom: 20, gap: 4 },
  content: { paddingHorizontal: SCREEN_GUTTER },
});
