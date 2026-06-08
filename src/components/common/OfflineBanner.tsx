import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNetworkStore } from '../../services/network';
import { useTheme } from '../../theme';
import { Text } from './Text';

export const OfflineBanner: React.FC = () => {
  const theme = useTheme();
  const isConnected = useNetworkStore(state => state.isConnected);
  const isInternetReachable = useNetworkStore(
    state => state.isInternetReachable,
  );

  const isOffline = !isConnected || isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={[styles.banner, { backgroundColor: theme.colors.error }]}
      accessibilityRole="alert"
      accessibilityLabel="You are currently offline">
      <Icon name="cloud-offline-outline" size={18} color={theme.colors.white} />
      <Text variant="bodySmall" color={theme.colors.white}>
        You're offline. Some features may be unavailable.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
