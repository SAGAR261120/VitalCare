import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { HealthPackageCategory } from '../../types';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Text } from '../common/Text';

interface HealthPackageCategoryTabsProps {
  categories: HealthPackageCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const HealthPackageCategoryTabs: React.FC<HealthPackageCategoryTabsProps> = ({
  categories,
  selectedId,
  onSelect,
}) => {
  const theme = useTheme();

  const items = [{ _id: '', name: 'All', icon: 'grid-outline' }, ...categories];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {items.map(cat => {
          const active = selectedId === cat._id;
          const imageUrl = 'image' in cat ? resolveMediaUrl(cat.image) : undefined;

          return (
            <TouchableOpacity
              key={cat._id || 'all'}
              style={[
                styles.card,
                {
                  backgroundColor: active ? theme.colors.primaryLight : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                },
                active && theme.shadows.sm,
              ]}
              onPress={() => onSelect(cat._id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: active ? theme.colors.primary : theme.colors.inputBackground },
                ]}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.iconImage} />
                ) : (
                  <Icon
                    name={(cat.icon || 'medkit-outline') as never}
                    size={22}
                    color={active ? theme.colors.white : theme.colors.primary}
                  />
                )}
              </View>
              <Text
                variant="caption"
                color={active ? theme.colors.primary : theme.colors.textSecondary}
                numberOfLines={2}
                style={styles.label}>
                {cat.name}
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
  wrapper: { marginBottom: spacing['4'] },
  row: {
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['3'],
  },
  card: {
    width: 88,
    alignItems: 'center',
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['2'],
    borderRadius: 16,
    borderWidth: 1.5,
    gap: spacing['2'],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: { width: 48, height: 48 },
  label: { textAlign: 'center', minHeight: 32 },
  indicator: {
    width: 28,
    height: 4,
    borderRadius: 2,
    marginTop: spacing['0.5'],
  },
});
