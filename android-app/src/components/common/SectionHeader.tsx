import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SCREEN_GUTTER } from '../../constants/layout';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h4">{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}>
          <Text variant="label" color={theme.colors.primary}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing['2'],
    marginBottom: spacing['4'],
    paddingHorizontal: SCREEN_GUTTER,
  },
});
