import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import type { Appointment } from '../../hooks/useApi';

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#7C3AED', completed: '#10B981', cancelled: '#EF4444', pending: '#F59E0B',
};

export const AppointmentsScreen: React.FC = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.appointments.list();
      setAppointments(res.data.data.items || []);
    } catch { setAppointments([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader fullScreen message="Loading appointments..." />;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h2">Appointments</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>Manage your health checkups</Text>
      </View>
      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />}
        contentContainerStyle={appointments.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<EmptyState title="No appointments yet" description="Book a health package to schedule your first checkup." />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80).duration(350)}
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
            <View style={styles.cardHeader}>
              <Text variant="h4">{item.doctorName || 'Health Checkup'}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[item.status] || '#7C3AED'}20` }]}>
                <Text variant="caption" color={STATUS_COLORS[item.status] || theme.colors.primary}>{item.status}</Text>
              </View>
            </View>
            {item.specialty && <Text variant="bodySmall" color={theme.colors.textSecondary}>{item.specialty}</Text>}
            <View style={styles.metaRow}>
              <Icon name="calendar-outline" size={14} color={theme.colors.textSecondary} />
              <Text variant="caption" color={theme.colors.textSecondary}>
                {new Date(item.date).toLocaleDateString()} • {item.time}
              </Text>
            </View>
            {item.hospital && (
              <View style={styles.metaRow}>
                <Icon name="business-outline" size={14} color={theme.colors.textSecondary} />
                <Text variant="caption" color={theme.colors.textSecondary}>{item.hospital}</Text>
              </View>
            )}
          </Animated.View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 8, marginBottom: 20, gap: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  card: { borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, gap: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
