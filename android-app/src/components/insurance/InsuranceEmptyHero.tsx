import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface InsuranceEmptyHeroProps {
  title?: string;
  description?: string;
}

export const InsuranceEmptyHero: React.FC<InsuranceEmptyHeroProps> = ({
  title = 'No Data Found',
  description = 'Your records will appear here once available.',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.illustration, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.border }]}>
        <View style={[styles.docCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="document-text-outline" size={28} color={theme.colors.textTertiary} />
          <View style={[styles.badge, { backgroundColor: theme.colors.accentWarm }]}>
            <Icon name="close" size={12} color={theme.colors.white} />
          </View>
        </View>
        <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
          <Icon name="cloud-upload-outline" size={28} color={theme.colors.primary} />
        </View>
      </View>
      <Text variant="h4" color={theme.colors.primary} style={styles.title}>{title}</Text>
      <Text variant="bodySmall" color={theme.colors.textSecondary} align="center">
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing['8'],
    paddingHorizontal: spacing['6'],
    gap: spacing['3'],
  },
  illustration: {
    width: 180,
    height: 120,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['3'],
    marginBottom: spacing['1'],
  },
  docCard: {
    width: 64,
    height: 84,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: spacing['1'] },
});
