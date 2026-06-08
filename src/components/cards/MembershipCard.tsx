import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { MembershipPlan } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Text } from '../common/Text';
import { Button } from '../buttons/Button';

interface MembershipCardProps {
  plan: MembershipPlan;
  onJoin?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  onJoin,
}) => {
  const theme = useTheme();
  const discount = Math.round(
    ((plan.originalPrice - plan.price) / plan.originalPrice) * 100,
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        theme.shadows.lg,
      ]}>
      {plan.badge && (
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}>
          <Text variant="caption" color={theme.colors.white}>
            {plan.badge}
          </Text>
        </LinearGradient>
      )}
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.primaryLight },
          ]}>
          <Icon name="shield-checkmark" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text variant="h4">{plan.name}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {plan.tier} • {plan.validity}
          </Text>
        </View>
      </View>
      <View style={styles.features}>
        {plan.features.slice(0, 4).map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <Icon
              name={feature.included ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={
                feature.included ? theme.colors.success : theme.colors.textTertiary
              }
            />
            <Text
              variant="bodySmall"
              color={
                feature.included
                  ? theme.colors.text
                  : theme.colors.textTertiary
              }>
              {feature.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.pricing}>
        <View>
          <Text variant="h2" color={theme.colors.secondary}>
            {formatCurrency(plan.price)}
          </Text>
          <Text
            variant="caption"
            color={theme.colors.textTertiary}
            style={styles.strike}>
            {formatCurrency(plan.originalPrice)}
          </Text>
        </View>
        <View
          style={[
            styles.saveBadge,
            { backgroundColor: theme.colors.accentWarm },
          ]}>
          <Text variant="caption" color={theme.colors.white}>
            Save {discount}%
          </Text>
        </View>
      </View>
      <Button title="Join Now" onPress={onJoin} fullWidth icon="arrow-forward" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: -20,
    paddingHorizontal: 32,
    paddingVertical: 6,
    transform: [{ rotate: '35deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  features: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pricing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
