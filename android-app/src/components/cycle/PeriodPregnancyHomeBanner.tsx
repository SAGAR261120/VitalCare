import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { getCycleTheme } from './cycleTheme';

interface PeriodPregnancyHomeBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  gradient?: string[];
}

export const PeriodPregnancyHomeBanner: React.FC<PeriodPregnancyHomeBannerProps> = ({
  title = 'Your Health Partner',
  subtitle = 'Period & Pregnancy Tracking Tool',
  image,
  gradient,
}) => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);
  const colors = gradient?.length === 2 ? gradient : [cycle.pinkSoft, cycle.pinkLight];
  const imageUrl = resolveMediaUrl(image);

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.banner, theme.shadows.md]}>
      <View style={styles.content}>
        <Text variant="overline" color={cycle.pink}>GKC Klinica</Text>
        <Text variant="h4">{title}</Text>
        <Text variant="bodySmall" color={theme.colors.primary}>{subtitle}</Text>
      </View>
      <View style={styles.visual}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: `${cycle.pink}18` }]}>
            <Icon name="female-outline" size={40} color={cycle.pink} />
            <Icon name="heart" size={18} color={theme.colors.primary} style={styles.heart} />
          </View>
        )}
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
    marginBottom: spacing['3'],
    overflow: 'hidden',
    minHeight: 120,
  },
  content: { flex: 1, gap: spacing['1.5'] },
  visual: { marginLeft: spacing['2'] },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { position: 'absolute', bottom: 8, right: 8 },
  image: { width: 72, height: 72, borderRadius: 36 },
});
