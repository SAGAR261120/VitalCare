import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface InsuranceStatsBarProps {
  total: number;
  pending: number;
  approved: number;
}

export const InsuranceStatsBar: React.FC<InsuranceStatsBarProps> = ({
  total,
  pending,
  approved,
}) => {
  const theme = useTheme();
  const stats = [
    { label: 'Total', value: total, color: theme.colors.primary },
    { label: 'Pending', value: pending, color: theme.colors.warning },
    { label: 'Approved', value: approved, color: theme.colors.success },
  ];

  return (
    <View style={styles.row}>
      {stats.map(stat => (
        <View
          key={stat.label}
          style={[styles.stat, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text variant="h4" color={stat.color}>{stat.value}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['2.5'],
    marginBottom: spacing['4'],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
});
