import React, { useEffect } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFabBottomOffset, FAB_GAP, FAB_SIZE, SCREEN_GUTTER } from '../../constants/layout';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme';

interface FabProps {
  icon: string;
  color: string;
  onPress: () => void;
  label: string;
  pulse?: boolean;
}

const Fab: React.FC<FabProps> = ({ icon, color, onPress, label, pulse = false }) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.92);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!pulse) return;
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1400 }),
        withTiming(1, { duration: 1400 }),
      ),
      -1,
      false,
    );
  }, [pulse, pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse ? pulseScale.value : 1 }],
  }));

  return (
    <Animated.View style={[animatedStyle, pulse && pulseStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: color, opacity: pressed ? 0.92 : 1 },
          theme.shadows.lg,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}>
        <Icon name={icon} size={22} color={theme.colors.white} />
      </Pressable>
    </Animated.View>
  );
};

interface FloatingActionsProps {
  hasTabBar?: boolean;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ hasTabBar = true }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const appSettings = useAppStore(s => s.appSettings);
  const phone = (appSettings.support_phone as string) || '+911800123456';
  const whatsapp = (appSettings.whatsapp_number as string) || phone;

  const bottom = getFabBottomOffset({ hasTabBar, safeBottom: insets.bottom });

  const handleCall = () => Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  const handleWhatsApp = () => {
    const digits = whatsapp.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${digits}`).catch(() => {
      Linking.openURL(`https://wa.me/${digits}`);
    });
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(400).duration(450)}
      pointerEvents="box-none"
      style={[styles.container, { bottom }]}>
      <Fab icon="call" color={theme.colors.fabCall} onPress={handleCall} label="Call support" />
      <Fab
        icon="logo-whatsapp"
        color={theme.colors.fabWhatsApp}
        onPress={handleWhatsApp}
        label="WhatsApp support"
        pulse
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SCREEN_GUTTER,
    gap: FAB_GAP,
    zIndex: 200,
    elevation: 12,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
