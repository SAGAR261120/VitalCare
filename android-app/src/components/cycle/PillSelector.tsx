import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { getCycleTheme } from './cycleTheme';

interface PillSelectorProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  columns?: number;
}

export const PillSelector: React.FC<PillSelectorProps> = ({
  options,
  selected,
  onSelect,
  columns = 3,
}) => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);

  return (
    <View style={[styles.row, columns === 2 && styles.rowTwo]}>
      {options.map(opt => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pill,
              columns === 2 && styles.pillHalf,
              {
                backgroundColor: active ? cycle.pink : theme.colors.surface,
                borderColor: active ? cycle.pink : theme.colors.border,
              },
            ]}
            onPress={() => onSelect(opt)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <Text variant="label" color={active ? theme.colors.white : theme.colors.text}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  rowTwo: { gap: spacing['2.5'] },
  pill: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2.5'],
    borderRadius: 24,
    borderWidth: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  pillHalf: { flex: 1, minWidth: '45%' },
});
