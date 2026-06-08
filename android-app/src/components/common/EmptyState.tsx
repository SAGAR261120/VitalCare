import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from './Text';
import { useTheme } from '../../theme';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  description = 'There is nothing to show here yet.',
}) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${theme.colors.primary}10` }]}>
        <Icon name="file-tray-outline" size={48} color={theme.colors.textSecondary} />
      </View>
      <Text variant="h4" align="center" style={styles.title}>{title}</Text>
      <Text variant="body" color={theme.colors.textSecondary} align="center">{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  iconWrap: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { marginBottom: 4 },
});
