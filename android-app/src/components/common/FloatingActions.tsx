import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useTheme } from '../../theme';

interface FabProps {
  icon: string;
  color: string;
  onPress: () => void;
  label: string;
}

const Fab: React.FC<FabProps> = ({ icon, color, onPress, label }) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.9);

  return (
    <Animated.View style={animatedStyle}>
      <View
        onTouchStart={onPressIn}
        onTouchEnd={onPressOut}
        onTouchCancel={onPressOut}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onPress}
        style={[styles.fab, { backgroundColor: color }, theme.shadows.md]}
        accessibilityRole="button"
        accessibilityLabel={label}>
        <Icon name={icon} size={22} color={theme.colors.white} />
      </View>
    </Animated.View>
  );
};

export const FloatingActions: React.FC = () => {
  const theme = useTheme();

  const handleCall = () => Linking.openURL('tel:+911800123456');
  const handleWhatsApp = () =>
    Linking.openURL('whatsapp://send?phone=911800123456');

  return (
    <Animated.View
      entering={FadeInRight.delay(500).duration(400)}
      style={styles.container}>
      <Fab
        icon="call"
        color={theme.colors.fabCall}
        onPress={handleCall}
        label="Call support"
      />
      <Fab
        icon="logo-whatsapp"
        color={theme.colors.fabWhatsApp}
        onPress={handleWhatsApp}
        label="WhatsApp support"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    gap: 12,
    zIndex: 100,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
