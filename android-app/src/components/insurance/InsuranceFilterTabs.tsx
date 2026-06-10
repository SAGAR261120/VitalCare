import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface Tab {
  id: string;
  label: string;
  active?: boolean;
}

interface InsuranceFilterTabsProps {
  tabs: Tab[];
  onSelect: (id: string) => void;
}

export const InsuranceFilterTabs: React.FC<InsuranceFilterTabsProps> = ({
  tabs,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}>
      {tabs.map(tab => {
        const active = tab.active;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              active && { backgroundColor: theme.colors.surface },
              active && theme.shadows.sm,
            ]}
            onPress={() => onSelect(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <Text
              variant="label"
              color={active ? theme.colors.primary : theme.colors.textSecondary}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['4'],
    padding: spacing['1'],
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing['1'],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2.5'],
    borderRadius: 10,
    minHeight: 40,
  },
});
