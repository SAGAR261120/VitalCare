import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { InsurancePlan } from '../../types';
import { formatCoverage, formatCurrency } from '../../utils/format';
import { Text } from '../common/Text';

interface InsuranceHomeCardProps {
  plan: InsurancePlan;
  index?: number;
  onPress?: () => void;
}

export const InsuranceHomeCard: React.FC<InsuranceHomeCardProps> = ({
  plan,
  index = 0,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Animated.View
        entering={FadeInRight.delay(index * 100).duration(400)}
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          theme.shadows.md,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${plan.provider} ${plan.name}`}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.isDark ? theme.colors.primary : theme.colors.primaryLight,
              borderBottomColor: theme.colors.border,
            },
          ]}>
          {plan.recommended && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255,255,255,0.2)'
                    : theme.colors.primary,
                },
              ]}>
              <Text variant="caption" color={theme.colors.white}>Recommended</Text>
            </View>
          )}
          <Text
            variant="caption"
            color={theme.isDark ? 'rgba(255,255,255,0.85)' : theme.colors.primary}>
            {plan.tenure ? `${plan.tenure} Tenure` : formatCoverage(plan.coverage)}
          </Text>
          <Text
            variant="h4"
            color={theme.isDark ? theme.colors.white : theme.colors.text}
            numberOfLines={2}>
            {plan.provider}
          </Text>
        </View>

        <View style={styles.body}>
          <Text variant="bodySmall" color={theme.colors.primary} numberOfLines={1}>
            {plan.name}
          </Text>
          {plan.description ? (
            <Text variant="bodySmall" color={theme.colors.textSecondary} numberOfLines={2}>
              {plan.description}
            </Text>
          ) : null}
          <View style={styles.footer}>
            <View>
              <Text variant="caption" color={theme.colors.textTertiary}>Premium</Text>
              <Text variant="h3" color={theme.colors.secondary}>
                {formatCurrency(plan.premium)}
                <Text variant="caption" color={theme.colors.textTertiary}>/yr</Text>
              </Text>
            </View>
            <View style={[styles.actionBtn, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name="arrow-forward" size={20} color={theme.colors.primary} />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
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
  body: { padding: 16, gap: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
