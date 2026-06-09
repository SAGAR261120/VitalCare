import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { HealthPackage } from '../../types';
import { formatCurrency, formatDiscount } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Text } from '../common/Text';
import { BookNowButton } from '../health-packages/BookNowButton';

interface HealthPackageListCardProps {
  package: HealthPackage;
  index?: number;
  onViewDetails: () => void;
  onBookNow?: () => void;
}

export const HealthPackageListCard: React.FC<HealthPackageListCardProps> = ({
  package: pkg,
  index = 0,
  onViewDetails,
  onBookNow,
}) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);
  const imageUrl = resolveMediaUrl(pkg.image);
  const testCount = pkg.testCount || pkg.includedTests?.length || 0;

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).duration(350)} style={theme.shadows.md}>
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}>
          <View style={styles.topRow}>
            <View style={[styles.compareBadge, { backgroundColor: theme.colors.primary }]}>
              <Icon name="git-compare-outline" size={12} color={theme.colors.white} />
              <Text variant="caption" color={theme.colors.white}>Compare</Text>
            </View>
            <View style={styles.priceCol}>
              {!!pkg.discount && (
                <Text variant="caption" color={theme.colors.accentWarm}>
                  {formatDiscount(pkg.discount)}
                </Text>
              )}
              <Text variant="h3">{formatCurrency(pkg.price)}</Text>
              {!!pkg.originalPrice && pkg.originalPrice > pkg.price && (
                <Text variant="caption" color={theme.colors.textTertiary} style={styles.strike}>
                  {formatCurrency(pkg.originalPrice)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.mainRow}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.thumb} />
            ) : (
              <LinearGradient
                colors={[theme.colors.primaryLight, theme.colors.cardGradientEnd]}
                style={styles.thumb}>
                <Icon name="medkit" size={26} color={theme.colors.primary} />
              </LinearGradient>
            )}
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text variant="label" numberOfLines={2} style={styles.title}>
                  {pkg.name}
                </Text>
                {pkg.isFeatured && (
                  <Icon name="star" size={14} color={theme.colors.warning} />
                )}
              </View>
              <View style={[styles.testsPill, { backgroundColor: theme.colors.primaryLight }]}>
                <Icon name="flask-outline" size={12} color={theme.colors.primary} />
                <Text variant="caption" color={theme.colors.primary}>
                  {testCount}+ Tests
                </Text>
              </View>
              {pkg.badge && (
                <View style={[styles.featureBadge, { backgroundColor: `${theme.colors.secondary}18` }]}>
                  <Text variant="caption" color={theme.colors.secondary}>{pkg.badge}</Text>
                </View>
              )}
              {pkg.description ? (
                <Text variant="caption" color={theme.colors.textTertiary} numberOfLines={2}>
                  {pkg.description}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
              onPress={onViewDetails}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${pkg.name}`}>
              <Text variant="label" color={theme.colors.white}>View Details</Text>
            </Pressable>
            <BookNowButton
              onPress={onBookNow || onViewDetails}
              style={styles.bookBtn}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3.5'],
    gap: spacing['3.5'],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  compareBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceCol: { alignItems: 'flex-end', gap: 2 },
  strike: { textDecorationLine: 'line-through' },
  mainRow: { flexDirection: 'row', gap: spacing['3'], alignItems: 'flex-start' },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  info: { flex: 1, gap: spacing['1.5'] },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing['1.5'] },
  title: { flex: 1 },
  testsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  actions: { flexDirection: 'row', gap: spacing['2.5'], alignItems: 'center' },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bookBtn: { flex: 1 },
});
