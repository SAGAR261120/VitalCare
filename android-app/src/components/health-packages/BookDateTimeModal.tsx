import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { BookNowButton } from './BookNowButton';
import { getBookingTheme } from './bookingTheme';

type TimePeriod = 'Morning' | 'Afternoon' | 'Evening';

const TIME_SLOTS: Record<TimePeriod, string[]> = {
  Morning: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
  Afternoon: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
  Evening: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
};

const PERIOD_ICONS: Record<TimePeriod, string> = {
  Morning: 'sunny-outline',
  Afternoon: 'partly-sunny-outline',
  Evening: 'moon-outline',
};

const formatDateLabel = (date: Date) => {
  const iso = date.toISOString().split('T')[0];
  const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const pretty = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return { iso, day, display: pretty };
};

const addDays = (base: Date, days: number) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

interface BookDateTimeModalProps {
  visible: boolean;
  packageName: string;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

export const BookDateTimeModal: React.FC<BookDateTimeModalProps> = ({
  visible,
  packageName,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  const booking = getBookingTheme(theme);
  const today = useMemo(() => new Date(), []);
  const [dayOffset, setDayOffset] = useState(1);
  const [period, setPeriod] = useState<TimePeriod>('Evening');
  const [selectedTime, setSelectedTime] = useState('5:00 PM');

  const selectedDate = addDays(today, dayOffset);
  const { iso, day, display } = formatDateLabel(selectedDate);
  const slots = TIME_SLOTS[period];

  const handlePeriodChange = (next: TimePeriod) => {
    setPeriod(next);
    setSelectedTime(TIME_SLOTS[next][0]);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(320)}
          style={[styles.sheet, { backgroundColor: theme.colors.surface }, theme.shadows.lg]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          <View style={styles.modalHeader}>
            <View style={[styles.stepRow]}>
              <View style={[styles.stepDot, { backgroundColor: booking.stepActive }]} />
              <View style={[styles.stepLine, { backgroundColor: booking.stepInactive }]} />
              <View style={[styles.stepDot, { backgroundColor: booking.stepInactive }]} />
            </View>
            <Text variant="h4" style={styles.title}>Select Date & Time</Text>
            <View style={[styles.packagePill, { backgroundColor: booking.summaryBg, borderColor: booking.summaryBorder }]}>
              <Icon name="medkit-outline" size={14} color={booking.summaryAccent} />
              <Text variant="caption" color={theme.colors.text} numberOfLines={1} style={styles.packageName}>
                {packageName}
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={booking.trustGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.datePicker, theme.shadows.sm]}>
            <TouchableOpacity
              onPress={() => setDayOffset(Math.max(1, dayOffset - 1))}
              style={[styles.arrowBtn, styles.arrowCircle]}
              accessibilityLabel="Previous day">
              <Icon name="chevron-back" size={20} color={booking.iconGold} />
            </TouchableOpacity>
            <View style={[styles.dateBox, { backgroundColor: theme.colors.white }]}>
              <Text variant="label" color={theme.colors.text}>{display}</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>{day}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setDayOffset(Math.min(30, dayOffset + 1))}
              style={[styles.arrowBtn, styles.arrowCircle]}
              accessibilityLabel="Next day">
              <Icon name="chevron-forward" size={20} color={booking.iconGold} />
            </TouchableOpacity>
          </LinearGradient>

          <Text variant="overline" color={theme.colors.textSecondary} style={styles.sectionLabel}>
            Time Period
          </Text>
          <View style={styles.periodRow}>
            {(Object.keys(TIME_SLOTS) as TimePeriod[]).map(p => {
              const active = period === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodBtn,
                    {
                      backgroundColor: active ? booking.periodActiveBg : booking.periodIdleBg,
                      borderColor: active ? booking.periodActiveBg : booking.summaryBorder,
                    },
                  ]}
                  onPress={() => handlePeriodChange(p)}>
                  <Icon
                    name={PERIOD_ICONS[p] as never}
                    size={16}
                    color={active ? booking.periodActiveText : booking.periodIdleText}
                  />
                  <Text
                    variant="caption"
                    color={active ? booking.periodActiveText : booking.periodIdleText}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text variant="overline" color={theme.colors.textSecondary} style={styles.sectionLabel}>
            Available Slots
          </Text>
          <ScrollView contentContainerStyle={styles.slotGrid} showsVerticalScrollIndicator={false}>
            {slots.map(slot => {
              const active = selectedTime === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotBtn,
                    {
                      backgroundColor: active ? booking.slotActiveBg : booking.slotIdleBg,
                      borderColor: active ? booking.slotActiveBg : booking.slotIdleBorder,
                    },
                    active && theme.shadows.sm,
                  ]}
                  onPress={() => setSelectedTime(slot)}>
                  <Text
                    variant="label"
                    color={active ? booking.slotActiveText : booking.slotIdleText}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: booking.cancelBg, borderColor: booking.cancelBorder }]}
              onPress={onClose}
              accessibilityRole="button">
              <Icon name="close" size={18} color={booking.cancelText} />
              <Text variant="label" color={booking.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <BookNowButton
              title="Continue"
              icon="arrow-forward"
              onPress={() => onConfirm(iso, selectedTime)}
              style={styles.continueBtn}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['6'],
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing['3'],
    marginBottom: spacing['4'],
  },
  modalHeader: { alignItems: 'center', marginBottom: spacing['4'], gap: spacing['2'] },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['1'] },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepLine: { width: 32, height: 2, borderRadius: 1 },
  title: { textAlign: 'center' },
  packagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1.5'],
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1.5'],
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: '100%',
  },
  packageName: { flexShrink: 1 },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: spacing['3'],
    marginBottom: spacing['4'],
    gap: spacing['2'],
  },
  arrowBtn: { padding: spacing['1'] },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['3.5'],
    borderRadius: 14,
  },
  sectionLabel: { marginBottom: spacing['2'], letterSpacing: 1 },
  periodRow: { flexDirection: 'row', gap: spacing['2'], marginBottom: spacing['4'] },
  periodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['2.5'],
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2.5'],
    paddingBottom: spacing['4'],
  },
  slotBtn: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderRadius: 14,
    borderWidth: 1.5,
  },
  actions: { flexDirection: 'row', gap: spacing['3'], alignItems: 'center' },
  cancelBtn: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1.5'],
    borderRadius: 14,
    borderWidth: 1,
  },
  continueBtn: { flex: 1.2 },
});
