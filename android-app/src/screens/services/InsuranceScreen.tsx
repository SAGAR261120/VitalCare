import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { InsuranceCard } from '../../components/cards/InsuranceCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import type { InsurancePlan } from '../../hooks/useApi';

export const InsuranceScreen: React.FC = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.content.getInsurancePlans();
      setPlans(res.data.data.items || []);
    } catch { setPlans([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader fullScreen message="Loading insurance plans..." />;

  return (
    <ScreenContainer scrollable refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}>
      <View style={styles.header}>
        <Text variant="h2">Insurance Plans</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>Compare and choose the best coverage</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {plans.length === 0 ? (
          <EmptyState title="No insurance plans" description="Insurance plans will appear here once added by admin." />
        ) : plans.map(plan => (
          <InsuranceCard key={plan._id} plan={{ ...plan, id: plan._id }} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
});
