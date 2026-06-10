import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { getCycleTheme } from './cycleTheme';

const STEPS = [
  { key: 'personal', label: 'Personal', icon: 'person-outline' },
  { key: 'mode', label: 'Mode', icon: 'flower-outline' },
  { key: 'cycle', label: 'Cycle', icon: 'calendar-outline' },
];

interface ProfileSetupStepperProps {
  current: number;
}

export const ProfileSetupStepper: React.FC<ProfileSetupStepperProps> = ({ current }) => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);

  return (
    <View style={styles.wrap}>
      {STEPS.map((step, idx) => {
        const active = idx <= current;
        return (
          <React.Fragment key={step.key}>
            <View style={styles.step}>
              <View style={[styles.dot, { backgroundColor: active ? cycle.pink : theme.colors.border }]}>
                <Icon name={step.icon as never} size={16} color={active ? theme.colors.white : theme.colors.textTertiary} />
              </View>
              <Text variant="caption" color={active ? cycle.pink : theme.colors.textTertiary}>{step.label}</Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[styles.line, { backgroundColor: idx < current ? cycle.pink : theme.colors.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing['4'] },
  step: { alignItems: 'center', gap: spacing['1'] },
  dot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  line: { width: 40, height: 2, marginHorizontal: spacing['1'], marginBottom: spacing['4'] },
});
