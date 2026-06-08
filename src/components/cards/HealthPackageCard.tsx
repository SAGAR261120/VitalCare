import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { HealthPackage } from '../../types';
import { formatCurrency, formatDiscount } from '../../utils/format';
import { Text } from '../common/Text';

interface HealthPackageCardProps {
  package: HealthPackage;
  index?: number;
  onPress?: () => void;
}

export const HealthPackageCard: React.FC<HealthPackageCardProps> = ({
  package: pkg,
  index = 0,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      onTouchEnd={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        theme.shadows.md,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${pkg.name}, ${pkg.testCount} tests, ${formatCurrency(pkg.price)}`}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.isDark
              ? theme.colors.primary
              : theme.colors.primaryLight,
            borderBottomColor: theme.colors.border,
          },
        ]}>
        {pkg.badge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(255,255,255,0.2)'
                  : theme.colors.primary,
              },
            ]}>
            <Text variant="caption" color={theme.colors.white}>
              {pkg.badge}
            </Text>
          </View>
        )}
        <Text
          variant="caption"
          color={theme.isDark ? 'rgba(255,255,255,0.85)' : theme.colors.primary}>
          {pkg.testCount}+ Tests
        </Text>
        <Text
          variant="h4"
          color={theme.isDark ? theme.colors.white : theme.colors.text}>
          {pkg.name}
        </Text>
      </View>
      <View style={styles.body}>
        <Text
          variant="bodySmall"
          color={theme.colors.textSecondary}
          numberOfLines={2}>
          {pkg.description}
        </Text>
        <View style={styles.footer}>
          <View>
            <View style={styles.discountRow}>
              <View
                style={[
                  styles.discountBadge,
                  { backgroundColor: theme.colors.accentWarm },
                ]}>
                <Text variant="caption" color={theme.colors.white}>
                  {formatDiscount(pkg.discount)}
                </Text>
              </View>
              <Text
                variant="caption"
                color={theme.colors.textTertiary}
                style={styles.strike}>
                {formatCurrency(pkg.originalPrice)}
              </Text>
            </View>
            <Text variant="h3" color={theme.colors.secondary}>
              {formatCurrency(pkg.price)}
            </Text>
          </View>
          <View
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primaryLight },
            ]}>
            <Icon name="arrow-forward" size={20} color={theme.colors.primary} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 260,
    marginRight: 16,
    borderWidth: 1,
  },
  header: {
    padding: 16,
    minHeight: 96,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
