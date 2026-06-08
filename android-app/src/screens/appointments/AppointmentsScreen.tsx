import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../theme';
import { Appointment } from '../../types';

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sharma',
    specialty: 'Cardiologist',
    date: 'Jun 12, 2026',
    time: '10:30 AM',
    status: 'upcoming',
    hospital: 'VitalCare Medical Center',
  },
  {
    id: '2',
    doctorName: 'Dr. Patel',
    specialty: 'Dermatologist',
    date: 'May 28, 2026',
    time: '2:00 PM',
    status: 'completed',
    hospital: 'City Health Clinic',
  },
  {
    id: '3',
    doctorName: 'Dr. Kumar',
    specialty: 'Neurologist',
    date: 'May 15, 2026',
    time: '11:00 AM',
    status: 'cancelled',
    hospital: 'Apollo Diagnostics',
  },
];

const statusColors = {
  upcoming: '#7C3AED',
  completed: '#10B981',
  cancelled: '#F43F5E',
};

export const AppointmentsScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h2">Appointments</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Manage your upcoming visits
        </Text>
      </View>

      <FlatList
        data={MOCK_APPOINTMENTS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 80).duration(400)}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface },
              theme.shadows.md,
            ]}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primaryLight },
                ]}>
                <Icon
                  name="medical"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text variant="h4">{item.doctorName}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {item.specialty}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusColors[item.status]}20` },
                ]}>
                <Text
                  variant="caption"
                  color={statusColors[item.status]}
                  style={styles.statusText}>
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Icon
                  name="calendar-outline"
                  size={16}
                  color={theme.colors.textTertiary}
                />
                <Text variant="bodySmall">{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon
                  name="time-outline"
                  size={16}
                  color={theme.colors.textTertiary}
                />
                <Text variant="bodySmall">{item.time}</Text>
              </View>
            </View>
            <Text variant="caption" color={theme.colors.textTertiary}>
              {item.hospital}
            </Text>
          </Animated.View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
