import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { AddPeriodModal } from '../../components/cycle/AddPeriodModal';
import { CycleModeToggle } from '../../components/cycle/CycleModeToggle';
import { getCycleTheme } from '../../components/cycle/cycleTheme';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { CycleStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<CycleStackParamList, 'CycleDashboard'>;

const formatDisplayDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const CycleDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'period' | 'pregnancy'>('period');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [addVisible, setAddVisible] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.cycle.getDashboard();
      const payload = res.data.data;
      if (payload.setupRequired) {
        navigation.replace('CycleProfileSetup');
        return;
      }
      setData(payload);
      setActiveTab(payload.profile?.activeTab || 'period');
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => { load(); }, [load]);

  const handleAddPeriod = async (form: { startDate: string; flow: string }) => {
    await api.cycle.createLog({ type: 'period', startDate: form.startDate, flow: form.flow });
    load(true);
  };

  const handleTabChange = async (tab: 'period' | 'pregnancy') => {
    setActiveTab(tab);
    try {
      await api.cycle.updateProfile({ activeTab: tab });
    } catch { /* ignore */ }
  };

  if (loading && !refreshing) return <Loader fullScreen message="Loading cycle dashboard..." />;

  const profile = data?.profile;
  const insights = data?.insights || {};
  const logs = data?.logs || [];
  const tip = data?.wellnessTip;

  const filteredLogs = historyFilter === 'all'
    ? logs
    : logs.filter((l: any) => l.type === historyFilter);

  const phases = [
    { label: 'Next Period', date: formatDisplayDate(insights.nextPeriodDate), colors: cycle.phaseRed, icon: 'water' },
    { label: 'Fertile Window', date: `${formatDisplayDate(insights.fertileStart)} - ${formatDisplayDate(insights.fertileEnd)}`, colors: cycle.phaseBlue, icon: 'leaf' },
    { label: 'Ovulation', date: formatDisplayDate(insights.ovulationDate), colors: cycle.phaseYellow, icon: 'flower' },
    { label: 'Average Cycle', date: String(insights.cycleLength || 28), colors: cycle.phasePurple, icon: 'heart' },
  ];

  return (
    <ScreenContainer safeBottom>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />}>
        <View style={styles.headerRow}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.headerTitle}>Cycle Dashboard</Text>
          <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
        </View>

        <CycleModeToggle active={activeTab} onChange={handleTabChange} />

        {/* Profile summary */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: cycle.pinkLight }]}>
              <Icon name="person" size={28} color={cycle.pink} />
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h4">{profile?.name || 'User'}</Text>
              <Text variant="caption" color={cycle.pink}>{activeTab.toUpperCase()}</Text>
              <View style={styles.metaRow}>
                <Icon name="calendar-outline" size={12} color={theme.colors.textSecondary} />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {profile?.dateOfBirth ? formatDisplayDate(profile.dateOfBirth) : '—'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Icon name="fitness-outline" size={12} color={theme.colors.textSecondary} />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {profile?.height ? `${profile.height} cm` : '—'} • {profile?.weight ? `${profile.weight} kg` : '—'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: cycle.pink }]}
              onPress={() => navigation.navigate('CycleProfileSetup')}>
              <Icon name="create-outline" size={14} color={theme.colors.white} />
              <Text variant="caption" color={theme.colors.white}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status hero */}
        <LinearGradient colors={cycle.heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, theme.shadows.md]}>
          <View style={styles.drops}>
            <Icon name="water" size={20} color="rgba(255,255,255,0.9)" />
            <Icon name="water" size={16} color="rgba(255,255,255,0.6)" />
            <Icon name="water" size={12} color="rgba(255,255,255,0.35)" />
          </View>
          <Text variant="label" color="rgba(255,255,255,0.9)">Period</Text>
          <Text variant="h2" color={theme.colors.white}>{insights.daysLeft ?? '—'} DAYS LEFT</Text>
          <Text variant="caption" color="rgba(255,255,255,0.85)">
            {formatDisplayDate(insights.nextPeriodDate)} — Next Period
          </Text>
          <TouchableOpacity style={[styles.addPeriodBtn, { backgroundColor: theme.colors.white }]} onPress={() => setAddVisible(true)}>
            <Text variant="label" color={cycle.pink}>Add Period</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Cycle day progress */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
          <View style={styles.sectionHead}>
            <View style={[styles.accentBar, { backgroundColor: cycle.accentBar }]} />
            <View>
              <Text variant="label">Cycle Day {insights.cycleDay || 1}</Text>
              <Text variant="caption" color={theme.colors.textTertiary}>
                {profile?.lastPeriodStart ? formatDisplayDate(profile.lastPeriodStart) : 'Log your period to start tracking'}
              </Text>
            </View>
            <View style={[styles.periodTag, { backgroundColor: cycle.pinkLight }]}>
              <Icon name="heart" size={12} color={cycle.pink} />
              <Text variant="caption" color={cycle.pink}>Period</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient colors={['#FF758C', '#60A5FA', '#FBBF24', '#A78BFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressBar} />
            <View style={[styles.progressDot, { left: `${Math.min(95, ((insights.cycleDay || 1) / (insights.cycleLength || 28)) * 100)}%` }]}>
              <Text variant="caption" color={theme.colors.white}>Day {insights.cycleDay || 1}</Text>
            </View>
          </View>
        </View>

        {/* Cycle phases */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
          <View style={styles.sectionHead}>
            <View style={[styles.accentBar, { backgroundColor: cycle.accentBar }]} />
            <Text variant="label">Cycle Phases</Text>
          </View>
          <View style={styles.phaseGrid}>
            {phases.map(phase => (
              <LinearGradient key={phase.label} colors={phase.colors} style={styles.phaseCard}>
                <Icon name={phase.icon as never} size={18} color={theme.colors.white} />
                <Text variant="caption" color={theme.colors.white}>{phase.label}</Text>
                <Text variant="label" color={theme.colors.white} numberOfLines={2}>{phase.date}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Wellness tip */}
        {tip && (
          <View style={[styles.tipCard, theme.shadows.sm]}>
            <LinearGradient colors={cycle.tipGradient} style={styles.tipHeader}>
              <Icon name="bulb-outline" size={18} color={theme.colors.white} />
              <Text variant="label" color={theme.colors.white}>{tip.title || 'Daily Wellness Tip'}</Text>
            </LinearGradient>
            <View style={[styles.tipBody, { backgroundColor: theme.colors.surface }]}>
              <Text variant="bodySmall" color={theme.colors.textSecondary}>{tip.message}</Text>
            </View>
          </View>
        )}

        {/* Symptoms */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
          <View style={styles.sectionHead}>
            <View style={[styles.accentBar, { backgroundColor: cycle.accentBar }]} />
            <Text variant="label">Symptoms</Text>
          </View>
          {[
            { label: 'Symptoms', value: profile?.symptoms?.[0] || '—', icon: 'medkit-outline', color: theme.colors.primary },
            { label: 'Regularity', value: (profile?.regularity || 'regular').toUpperCase(), icon: 'sync-outline', color: theme.colors.success },
            { label: 'Flow', value: (profile?.flowType || 'medium').toUpperCase(), icon: 'water-outline', color: theme.colors.error },
          ].map(row => (
            <View key={row.label} style={[styles.symptomRow, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name={row.icon as never} size={20} color={row.color} />
              <View style={styles.symptomText}>
                <View style={[styles.symptomTag, { backgroundColor: cycle.pink }]}>
                  <Text variant="caption" color={theme.colors.white}>{row.label}</Text>
                </View>
                <Text variant="label">{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* My cycles / history */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
          <View style={styles.sectionHead}>
            <View style={[styles.accentBar, { backgroundColor: cycle.accentBar }]} />
            <Text variant="label">My Cycles</Text>
          </View>
          <LinearGradient colors={cycle.phaseBlue} style={styles.avgCard}>
            <Icon name="calendar" size={24} color={theme.colors.white} />
            <Text variant="caption" color="rgba(255,255,255,0.85)">Average Period</Text>
            <Text variant="h3" color={theme.colors.white}>{insights.averagePeriod || insights.periodLength || 5} Days</Text>
          </LinearGradient>

          <Text variant="label" style={styles.historyTitle}>History</Text>
          <View style={styles.filterRow}>
            {['all', 'period', 'ovulation', 'fertile'].map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, { backgroundColor: historyFilter === f ? cycle.pink : theme.colors.surface, borderColor: historyFilter === f ? cycle.pink : theme.colors.border }]}
                onPress={() => setHistoryFilter(f)}>
                <Text variant="caption" color={historyFilter === f ? theme.colors.white : theme.colors.text}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredLogs.length === 0 ? (
            <Text variant="bodySmall" color={theme.colors.textTertiary} align="center" style={styles.noLogs}>
              No cycle logs yet. Tap Add Period to get started.
            </Text>
          ) : (
            filteredLogs.map((log: any) => (
              <View key={log._id} style={[styles.logCard, { borderColor: theme.colors.border }]}>
                <View style={styles.logHeader}>
                  <Text variant="label">
                    {formatDisplayDate(log.startDate)}{log.endDate ? ` — ${formatDisplayDate(log.endDate)}` : ''}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Delete log?', 'Remove this cycle entry?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: async () => { await api.cycle.deleteLog(log._id); load(true); } },
                    ])}>
                    <Icon name="create-outline" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.logBar, { backgroundColor: cycle.pink, width: `${Math.min(100, ((insights.periodLength || 5) / 10) * 100)}%` }]} />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {log.endDate ? `${Math.round((new Date(log.endDate).getTime() - new Date(log.startDate).getTime()) / 86400000) + 1} Days Period` : 'Period'}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: spacing['6'] }} />
      </ScrollView>

      <AddPeriodModal visible={addVisible} onClose={() => setAddVisible(false)} onSubmit={handleAddPeriod} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['2'],
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  card: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    gap: spacing['3'],
  },
  profileRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing['3'] },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1, gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  hero: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    padding: spacing['5'],
    alignItems: 'center',
    gap: spacing['1'],
    marginBottom: spacing['3'],
  },
  drops: { flexDirection: 'row', gap: 6, marginBottom: spacing['1'] },
  addPeriodBtn: { marginTop: spacing['3'], paddingHorizontal: spacing['5'], paddingVertical: spacing['2.5'], borderRadius: 24 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  accentBar: { width: 4, height: 28, borderRadius: 2 },
  periodTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 'auto' },
  progressTrack: { height: 12, borderRadius: 6, backgroundColor: '#E5E7EB', marginTop: spacing['2'], position: 'relative' },
  progressBar: { height: 12, borderRadius: 6, width: '100%' },
  progressDot: { position: 'absolute', top: -18, transform: [{ translateX: -20 }], backgroundColor: '#7C3AED', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  phaseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2.5'] },
  phaseCard: { width: '47%', borderRadius: 16, padding: spacing['3'], gap: spacing['1'], minHeight: 90 },
  tipCard: { marginHorizontal: SCREEN_GUTTER, borderRadius: 16, overflow: 'hidden', marginBottom: spacing['3'] },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3.5'] },
  tipBody: { padding: spacing['4'] },
  symptomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'], padding: spacing['3'], borderRadius: 14 },
  symptomText: { gap: 4 },
  symptomTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  avgCard: { borderRadius: 16, padding: spacing['4'], alignItems: 'center', gap: spacing['1'] },
  historyTitle: { marginTop: spacing['2'] },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  noLogs: { paddingVertical: spacing['4'] },
  logCard: { borderWidth: 1, borderRadius: 14, padding: spacing['3'], gap: spacing['2'] },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logBar: { height: 8, borderRadius: 4 },
});
