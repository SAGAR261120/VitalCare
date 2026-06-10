import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { InsurancePlan } from '../../types';
import { formatCoverage, formatCurrency } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Text } from '../common/Text';
import { InsuranceDetailRow } from '../insurance/InsuranceDetailRow';

interface InsuranceCardProps {
  plan: InsurancePlan;
  variant?: 'default' | 'list';
  index?: number;
  onPress?: () => void;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  plan,
  variant = 'default',
  index = 0,
  onPress,
}) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);
  const [expanded, setExpanded] = useState(false);
  const isList = variant === 'list';

  const openPdf = () => {
    if (plan.pdfUrl) {
      Linking.openURL(resolveMediaUrl(plan.pdfUrl) || plan.pdfUrl).catch(() => {});
    }
  };

  const card = (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${plan.provider} ${plan.name}`}>
      {isList && (
        <View style={styles.topRow}>
          <View style={[styles.compareBadge, { backgroundColor: theme.colors.primary }]}>
            <Icon name="git-compare-outline" size={12} color={theme.colors.white} />
            <Text variant="caption" color={theme.colors.white}>Compare</Text>
          </View>
          <View style={styles.priceCol}>
            {plan.recommended && (
              <Text variant="caption" color={theme.colors.accentWarm}>Recommended</Text>
            )}
            <Text variant="h3">{formatCurrency(plan.premium)}</Text>
            <Text variant="caption" color={theme.colors.textTertiary}>/year</Text>
          </View>
        </View>
      )}

      <View style={styles.mainRow}>
        <LinearGradient
          colors={[theme.colors.primaryLight, theme.colors.cardGradientEnd]}
          style={styles.thumb}>
          <Icon name="shield-checkmark" size={26} color={theme.colors.primary} />
        </LinearGradient>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text variant="label" numberOfLines={2} style={styles.title}>
              {plan.provider}
            </Text>
            {plan.recommended && !isList && (
              <Icon name="star" size={14} color={theme.colors.warning} />
            )}
          </View>
          <View style={[styles.coveragePill, { backgroundColor: theme.colors.primaryLight }]}>
            <Icon name="shield-outline" size={12} color={theme.colors.primary} />
            <Text variant="caption" color={theme.colors.primary}>
              {formatCoverage(plan.coverage)}
            </Text>
          </View>
          <Text variant="caption" color={theme.colors.primary} numberOfLines={1}>
            {plan.name}
          </Text>
          {plan.description ? (
            <Text variant="caption" color={theme.colors.textTertiary} numberOfLines={isList ? 2 : 3}>
              {plan.description}
              {!isList && plan.description.length > 90 && (
                <Text variant="caption" color={theme.colors.primary} onPress={() => setExpanded(!expanded)}>
                  {expanded ? ' less' : ' more'}
                </Text>
              )}
            </Text>
          ) : null}
        </View>
      </View>

      {!isList && (
        <View style={styles.details}>
          <InsuranceDetailRow icon="wallet-outline" label="Premium" value={`${formatCurrency(plan.premium)}/year`} accent={theme.colors.secondary} />
          {plan.tenure ? (
            <InsuranceDetailRow icon="calendar-outline" label="Tenure" value={plan.tenure} accent={theme.colors.accentWarm} />
          ) : null}
        </View>
      )}

      {isList ? (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${plan.provider}`}>
            <Text variant="label" color={theme.colors.white}>View Details</Text>
          </Pressable>
          {plan.pdfUrl ? (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }]}
              onPress={openPdf}
              accessibilityRole="button"
              accessibilityLabel="View PDF">
              <Text variant="label" color={theme.colors.primary}>View PDF</Text>
            </Pressable>
          ) : null}
        </View>
      ) : plan.pdfUrl ? (
        <TouchableOpacity activeOpacity={0.9} onPress={openPdf}>
          <View style={[styles.pdfBtn, { backgroundColor: theme.colors.primary }]}>
            <Icon name="document-text-outline" size={16} color={theme.colors.white} />
            <Text variant="label" color={theme.colors.white}>View PDF</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </Pressable>
  );

  if (isList) {
    return (
      <Animated.View entering={FadeInUp.delay(index * 60).duration(350)} style={theme.shadows.md}>
        <Animated.View style={animatedStyle}>{card}</Animated.View>
      </Animated.View>
    );
  }

  return <Animated.View style={[animatedStyle, theme.shadows.md]}>{card}</Animated.View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    gap: spacing['3'],
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
  coveragePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  details: { gap: spacing['1.5'] },
  actions: { flexDirection: 'row', gap: spacing['2.5'], alignItems: 'center' },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3'],
    borderRadius: 14,
  },
});
