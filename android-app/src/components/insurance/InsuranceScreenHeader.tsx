import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '../common/IconButton';
import { Text } from '../common/Text';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

interface InsuranceScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  centered?: boolean;
}

export const InsuranceScreenHeader: React.FC<InsuranceScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  centered = true,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <IconButton
        name="arrow-back"
        onPress={onBack}
        accessibilityLabel="Go back"
        backgroundColor={theme.colors.surface}
      />
      <View style={[styles.titleBlock, centered && styles.titleCentered]}>
        <Text variant="h3" align={centered ? 'center' : 'left'}>{title}</Text>
        {subtitle ? (
          <Text variant="caption" color={theme.colors.textSecondary} align={centered ? 'center' : 'left'}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <IconButton
        name="notifications-outline"
        onPress={() => {}}
        accessibilityLabel="Notifications"
        backgroundColor={theme.colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['2'],
  },
  titleBlock: { flex: 1, gap: 2 },
  titleCentered: { alignItems: 'center' },
});
