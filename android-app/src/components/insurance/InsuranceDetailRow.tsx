import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface InsuranceDetailRowProps {
  icon: string;
  label: string;
  value: string;
  accent?: string;
}

export const InsuranceDetailRow: React.FC<InsuranceDetailRowProps> = ({
  icon,
  label,
  value,
  accent,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.primaryLight }]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}>
        <Icon name={icon as never} size={16} color={accent || theme.colors.primary} />
      </View>
      <Text variant="caption" color={theme.colors.textSecondary} style={styles.label}>
        {label}
      </Text>
      <Text variant="label" numberOfLines={1} style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2.5'],
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2.5'],
    borderRadius: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
  value: { maxWidth: '42%', textAlign: 'right' },
});
