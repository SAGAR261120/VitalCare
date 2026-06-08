import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { InsurancePlan } from '../../types';
import { formatCoverage, formatCurrency } from '../../utils/format';
import { Text } from '../common/Text';

interface InsuranceCardProps {
  plan: InsurancePlan;
  onPress?: () => void;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  plan,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <View
      onTouchEnd={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        theme.shadows.lg,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${plan.provider} ${plan.name}`}>
      {plan.recommended && (
        <View style={styles.recommendedRow}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.recommendedBadge}>
            <Icon name="checkmark-circle" size={14} color={theme.colors.white} />
            <Text variant="caption" color={theme.colors.white}>
              Recommended
            </Text>
          </LinearGradient>
        </View>
      )}
      <Text variant="h4">{plan.provider}</Text>
      <Text variant="bodySmall" color={theme.colors.primary}>
        {plan.name}
      </Text>
      <Text
        variant="bodySmall"
        color={theme.colors.textSecondary}
        style={styles.description}
        numberOfLines={3}>
        {plan.description}
      </Text>
      <View style={styles.details}>
        <View
          style={[
            styles.detailPill,
            { backgroundColor: theme.colors.primaryLight },
          ]}>
          <Icon name="shield-outline" size={16} color={theme.colors.primary} />
          <Text variant="caption" color={theme.colors.primary}>
            {formatCoverage(plan.coverage)}
          </Text>
        </View>
        <View
          style={[
            styles.detailPill,
            { backgroundColor: theme.colors.primaryLight },
          ]}>
          <Icon name="card-outline" size={16} color={theme.colors.primary} />
          <Text variant="caption" color={theme.colors.primary}>
            {formatCurrency(plan.premium)}/yr
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  recommendedRow: {
    marginBottom: 12,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    gap: 10,
  },
  detailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
