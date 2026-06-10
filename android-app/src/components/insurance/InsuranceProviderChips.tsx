import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface InsuranceProviderChipsProps {
  providers: string[];
  selected: string | null;
  onSelect: (provider: string | null) => void;
}

const shortenProvider = (name: string) => {
  if (name.length <= 14) return name;
  const words = name.split(' ');
  if (words.length > 1) return words[0];
  return `${name.slice(0, 12)}…`;
};

export const InsuranceProviderChips: React.FC<InsuranceProviderChipsProps> = ({
  providers,
  selected,
  onSelect,
}) => {
  const theme = useTheme();
  const items = ['All', ...providers];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map(chip => {
          const isAll = chip === 'All';
          const active = isAll ? !selected : selected === chip;
          const label = isAll ? chip : shortenProvider(chip);

          return (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.colors.primaryLight : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                },
                active && theme.shadows.sm,
              ]}
              onPress={() => onSelect(isAll ? null : chip)}
              accessibilityRole="button"
              accessibilityLabel={chip}
              accessibilityState={{ selected: active }}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: active ? theme.colors.primary : theme.colors.inputBackground },
                ]}>
                <Icon
                  name={isAll ? 'grid-outline' : 'business-outline'}
                  size={20}
                  color={active ? theme.colors.white : theme.colors.primary}
                />
              </View>
              <Text
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textSecondary}
                numberOfLines={2}
                style={styles.label}>
                {label}
              </Text>
              {active && <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing['3'] },
  row: {
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['2.5'],
    paddingBottom: spacing['1'],
  },
  chip: {
    width: 80,
    alignItems: 'center',
    paddingTop: spacing['2.5'],
    paddingBottom: spacing['2'],
    paddingHorizontal: spacing['1.5'],
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing['1.5'],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
