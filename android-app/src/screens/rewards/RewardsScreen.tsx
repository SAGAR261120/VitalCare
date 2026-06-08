import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import type { RewardData, RewardTask } from '../../hooks/useApi';

export const RewardsScreen: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<RewardData | null>(null);
  const [tasks, setTasks] = useState<RewardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [rewardRes, tasksRes] = await Promise.all([
        api.rewards.get(),
        api.content.getRewards(),
      ]);
      setData(rewardRes.data.data);
      setTasks(tasksRes.data.data.items || []);
    } catch { /* handled by empty state */ }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader fullScreen message="Loading rewards..." />;

  const gkcmPrice = 169.1;
  const gkcmAmount = data ? ((data.points * 0.0058)).toFixed(2) : '0.00';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h2">Rewards</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>Earn points for healthy habits</Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.pointsCard, theme.shadows.lg]}>
          <View>
            <Text variant="overline" color="rgba(255,255,255,0.7)">Your Points</Text>
            <Text variant="display" color={theme.colors.white}>{(data?.points ?? 0).toLocaleString()}</Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              {data?.tier ?? 'Bronze'} Member • ≈ {gkcmAmount} GKCM
            </Text>
          </View>
          <Icon name="trophy" size={48} color="rgba(255,255,255,0.4)" />
        </LinearGradient>
      </Animated.View>

      <View style={[styles.statsRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.statItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>GKCM Price</Text>
          <Text variant="h4">₹{gkcmPrice}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.statItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>Wallet</Text>
          <Text variant="label">{data?.walletConnected ? 'Connected' : 'Not Connected'}</Text>
        </View>
      </View>

      <Text variant="h4" style={styles.sectionTitle}>Earn More Points</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListEmptyComponent={<EmptyState title="No reward tasks" description="Check back later for new ways to earn points." />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}
            style={[styles.taskCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.taskIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Icon name={item.icon || 'star-outline'} size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.taskContent}>
              <Text variant="label">{item.title}</Text>
              {item.description && <Text variant="caption" color={theme.colors.textSecondary}>{item.description}</Text>}
            </View>
            <Text variant="label" color={theme.colors.secondary}>+{item.points}</Text>
          </Animated.View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, marginBottom: 20, gap: 4 },
  pointsCard: { marginHorizontal: 20, borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statsRow: { marginHorizontal: 20, borderRadius: 16, padding: 16, flexDirection: 'row', borderWidth: 1, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: '100%' },
  sectionTitle: { paddingHorizontal: 20, marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  taskIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  taskContent: { flex: 1, gap: 2 },
});
