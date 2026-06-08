import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { getScrollBottomPadding, SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import type { RewardData, RewardTask } from '../../hooks/useApi';

export const RewardsScreen: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<RewardData | null>(null);
  const [tasks, setTasks] = useState<RewardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [rewardRes, tasksRes] = await Promise.all([
        api.rewards.get(),
        api.content.getRewards(),
      ]);
      setData(rewardRes.data.data);
      setTasks(tasksRes.data.data.items || []);
    } catch {
      /* handled by empty state */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const gkcmPrice = 169.1;
  const gkcmAmount = data ? (data.points * 0.0058).toFixed(2) : '0.00';

  const listHeader = (
    <>
      <View style={styles.header}>
        <Text variant="h2">Rewards</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Earn points for healthy habits
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pointsCard, theme.shadows.lg]}>
          <View style={styles.pointsContent}>
            <Text variant="overline" color="rgba(255,255,255,0.7)">
              Your Points
            </Text>
            <Text variant="display" color={theme.colors.white}>
              {(data?.points ?? 0).toLocaleString()}
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              {data?.tier ?? 'Bronze'} Member • ≈ {gkcmAmount} GKCM
            </Text>
          </View>
          <Icon name="trophy" size={48} color="rgba(255,255,255,0.4)" />
        </LinearGradient>
      </Animated.View>

      <View
        style={[
          styles.statsRow,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}>
        <View style={styles.statItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            GKCM Price
          </Text>
          <Text variant="h4">₹{gkcmPrice}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.statItem}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Wallet
          </Text>
          <Text variant="label">{data?.walletConnected ? 'Connected' : 'Not Connected'}</Text>
        </View>
      </View>

      <Text variant="h4" style={styles.sectionTitle}>
        Earn More Points
      </Text>
    </>
  );

  const renderTask: ListRenderItem<RewardTask> = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(300)}
      style={[
        styles.taskCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}>
      <View style={[styles.taskIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Icon name={item.icon || 'star-outline'} size={22} color={theme.colors.primary} />
      </View>
      <View style={styles.taskContent}>
        <Text variant="label">{item.title}</Text>
        {item.description && (
          <Text variant="caption" color={theme.colors.textSecondary}>
            {item.description}
          </Text>
        )}
      </View>
      <Text variant="label" color={theme.colors.secondary}>
        +{item.points}
      </Text>
    </Animated.View>
  );

  if (loading) return <Loader fullScreen message="Loading rewards..." />;

  return (
    <ScreenContainer safeBottom={false} style={styles.screen}>
      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={renderTask}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState
            title="No reward tasks"
            description="Check back later for new ways to earn points."
            icon="ribbon-outline"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
    </ScreenContainer>
  );
};

const BOTTOM_PADDING = getScrollBottomPadding({ hasTabBar: true, hasFab: true, safeBottom: 0 });

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: BOTTOM_PADDING,
  },
  header: {
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    marginBottom: spacing['5'],
    gap: spacing['1'],
  },
  pointsCard: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    padding: spacing['6'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  pointsContent: {
    flex: 1,
    gap: spacing['1'],
    paddingRight: spacing['3'],
  },
  statsRow: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 16,
    padding: spacing['4'],
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: spacing['6'],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing['1'],
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  sectionTitle: {
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['3'],
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['2.5'],
    padding: spacing['4'],
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing['3'],
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
});
