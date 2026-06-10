import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { getCycleTheme } from './cycleTheme';

interface CycleModeToggleProps {
  active: 'period' | 'pregnancy';
  onChange: (mode: 'period' | 'pregnancy') => void;
}

export const CycleModeToggle: React.FC<CycleModeToggleProps> = ({ active, onChange }) => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);

  const tabs = [
    { key: 'period' as const, label: 'Period', icon: 'calendar' },
    { key: 'pregnancy' as const, label: 'Pregnancy', icon: 'happy-outline' },
  ];

  return (
    <View style={styles.row}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? cycle.pink : theme.colors.surface,
                borderColor: isActive ? cycle.pink : theme.colors.border,
              },
              theme.shadows.sm,
            ]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}>
            <Icon name={tab.icon as never} size={18} color={isActive ? theme.colors.white : cycle.pink} />
            <Text variant="label" color={isActive ? theme.colors.white : theme.colors.text}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3.5'],
    borderRadius: 28,
    borderWidth: 1.5,
  },
});
