import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../buttons/Button';
import { Text } from './Text';
import { useTheme } from '../../theme';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${theme.colors.error}15` }]}>
        <Icon name="cloud-offline-outline" size={44} color={theme.colors.error} />
      </View>
      <Text variant="h4" align="center">
        {title}
      </Text>
      <Text variant="body" color={theme.colors.textSecondary} align="center">
        {description}
      </Text>
      {onRetry && (
        <Button title={retryLabel} onPress={onRetry} variant="outline" style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    minWidth: 140,
  },
});
