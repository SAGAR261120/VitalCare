import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface HealthPackagePromoBannerProps {
  onPress?: () => void;
}

export const HealthPackagePromoBanner: React.FC<HealthPackagePromoBannerProps> = ({
  onPress,
}) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.heroGradientStart, theme.colors.heroGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.banner, theme.shadows.md]}>
      <View style={styles.content}>
        <Text variant="overline" color="rgba(255,255,255,0.85)">Wellness</Text>
        <Text variant="h4" color={theme.colors.white}>
          Healthy Family, Healthy Life!
        </Text>
        <Text variant="bodySmall" color="rgba(255,255,255,0.9)">
          Book your comprehensive health checkup today.
        </Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Book health checkup">
          <Text variant="label" color={theme.colors.primary}>BOOK NOW</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconWrap}>
        <Icon name="fitness" size={48} color="rgba(255,255,255,0.35)" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    padding: spacing['5'],
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['5'],
    overflow: 'hidden',
  },
  content: { flex: 1, gap: spacing['1.5'] },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 20,
    marginTop: spacing['1'],
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
