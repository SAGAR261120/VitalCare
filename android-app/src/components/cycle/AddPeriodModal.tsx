import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Button } from '../buttons/Button';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { TextInput } from '../forms/TextInput';
import { PillSelector } from './PillSelector';

interface AddPeriodModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { startDate: string; flow: string }) => Promise<void>;
}

export const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [flow, setFlow] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ startDate, flow: flow.toLowerCase() });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable style={styles.dismiss} onPress={onClose} />
        <Animated.View entering={SlideInDown.duration(300)} style={[styles.sheet, { backgroundColor: theme.colors.surface }, theme.shadows.lg]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          <Text variant="h4" style={styles.title}>Add Period</Text>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.subtitle}>
            Log the first day of your period
          </Text>
          <View style={styles.form}>
            <TextInput
              label="Start Date"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              leftIcon="calendar-outline"
            />
            <Text variant="label" style={styles.label}>Flow Type</Text>
            <PillSelector options={['Light', 'Medium', 'Heavy']} selected={flow} onSelect={setFlow} />
            <Button title="Save Period" onPress={handleSubmit} loading={loading} fullWidth size="lg" />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  dismiss: { flex: 1 },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing['5'], paddingBottom: spacing['8'] },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: spacing['4'] },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: spacing['4'] },
  form: { gap: spacing['4'] },
  label: { marginBottom: -spacing['2'] },
});
