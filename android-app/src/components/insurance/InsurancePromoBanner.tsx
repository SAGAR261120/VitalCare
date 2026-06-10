import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { resolveMediaUrl } from '../../utils/mediaUrl';

interface InsurancePromoBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  gradient?: string[];
  compact?: boolean;
  embedded?: boolean;
  onPress?: () => void;
}

export const InsurancePromoBanner: React.FC<InsurancePromoBannerProps> = ({
  title = 'Protect Your Family, Secure Your Future!',
  subtitle = 'Compare top plans and manage your policies in one place.',
  image,
  gradient,
  compact = false,
  embedded = false,
  onPress,
}) => {
  const theme = useTheme();
  const imageUrl = resolveMediaUrl(image);
  const colors = gradient?.length === 2 ? gradient : [theme.colors.heroGradientStart, theme.colors.heroGradientEnd];
  const horizontal = embedded ? spacing['4'] : SCREEN_GUTTER;

  if (compact) {
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bannerCompact, { marginHorizontal: embedded ? 0 : horizontal }, theme.shadows.sm]}>
        <View style={styles.compactContent}>
          <Text variant="overline" color="rgba(255,255,255,0.85)">Insurance</Text>
          <Text variant="label" color={theme.colors.white}>{title}</Text>
        </View>
        <View style={styles.compactIcon}>
          <Icon name="shield-checkmark" size={28} color="rgba(255,255,255,0.4)" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.banner, { marginHorizontal: horizontal }, theme.shadows.md]}>
      <View style={styles.iconBadge}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <Icon name="shield-checkmark" size={36} color="rgba(255,255,255,0.4)" />
        )}
      </View>

      <View style={styles.content}>
        <Text variant="overline" color="rgba(255,255,255,0.85)">Insurance</Text>
        <Text variant="h4" color={theme.colors.white}>{title}</Text>
        <Text variant="bodySmall" color="rgba(255,255,255,0.9)">{subtitle}</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Explore insurance plans">
          <Text variant="label" color={theme.colors.primary}>EXPLORE PLANS</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 24,
    padding: spacing['5'],
    marginBottom: spacing['4'],
    overflow: 'hidden',
    minHeight: 168,
  },
  bannerCompact: {
    borderRadius: 20,
    padding: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3'],
    overflow: 'hidden',
  },
  iconBadge: {
    position: 'absolute',
    top: spacing['4'],
    right: spacing['4'],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    gap: spacing['2'],
    paddingRight: 72,
  },
  compactContent: { flex: 1, gap: spacing['1'] },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 20,
    marginTop: spacing['1'],
  },
  compactIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: { width: 64, height: 64, borderRadius: 32 },
});
