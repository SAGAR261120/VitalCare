import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { getInsuranceTheme } from './insuranceTheme';

interface QuickAction {
  key: string;
  icon: string;
  label: string;
}

interface InsuranceHomeSectionProps {
  onViewAll: () => void;
  onQuickAction: (key: string) => void;
  children: React.ReactNode;
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'submit', icon: 'create-outline', label: 'Submit' },
  { key: 'view', icon: 'eye-outline', label: 'View' },
  { key: 'upload', icon: 'cloud-upload-outline', label: 'Upload' },
];

export const InsuranceHomeSection: React.FC<InsuranceHomeSectionProps> = ({
  onViewAll,
  onQuickAction,
  children,
}) => {
  const theme = useTheme();
  const ins = getInsuranceTheme(theme);

  return (
    <View style={[styles.panel, { backgroundColor: ins.cardBg, borderColor: ins.cardBorder }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBadge, { backgroundColor: ins.iconCircleBg }]}>
            <Icon name="shield-checkmark" size={18} color={ins.accentBlue} />
          </View>
          <Text variant="h4">Top Insurance Plans</Text>
        </View>
        <TouchableOpacity onPress={onViewAll} accessibilityRole="button" accessibilityLabel="View all insurance">
          <Text variant="label" color={ins.accentBlue}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.key}
            style={[styles.chip, { backgroundColor: theme.colors.surface, borderColor: ins.cardBorder }]}
            onPress={() => onQuickAction(action.key)}
            accessibilityRole="button">
            <Icon name={action.icon as never} size={15} color={ins.accentBlue} />
            <Text variant="caption">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: spacing['4'],
    paddingBottom: spacing['2'],
    marginBottom: spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['3'],
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    paddingHorizontal: spacing['4'],
    gap: spacing['2'],
    marginBottom: spacing['3'],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing['2'],
  },
});
