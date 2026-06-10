import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import Animated from 'react-native-reanimated';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';

interface ActionItem {
  key: string;
  icon: string;
  label: string;
  primary?: boolean;
}

interface InsuranceActionGridProps {
  actions: ActionItem[];
  onPress: (key: string) => void;
}

const ActionCard: React.FC<{
  action: ActionItem;
  onPress: () => void;
  horizontal?: boolean;
}> = ({ action, onPress, horizontal = false }) => {
  const theme = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.97);
  const isPrimary = action.primary;

  return (
    <Animated.View style={[animatedStyle, horizontal ? styles.fullWrap : styles.halfWrap]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          horizontal ? styles.rowCard : styles.squareCard,
          {
            backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
            borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
          },
          theme.shadows.sm,
        ]}>
        <View
          style={[
            styles.iconCircle,
            horizontal && styles.iconCircleSm,
            {
              backgroundColor: isPrimary
                ? 'rgba(255,255,255,0.2)'
                : theme.colors.primaryLight,
            },
          ]}>
          <Icon
            name={action.icon as never}
            size={horizontal ? 20 : 22}
            color={isPrimary ? theme.colors.white : theme.colors.primary}
          />
        </View>
        <Text
          variant="label"
          color={isPrimary ? theme.colors.white : theme.colors.text}
          style={[styles.label, horizontal && styles.rowLabel]}
          numberOfLines={horizontal ? 1 : 2}>
          {action.label}
        </Text>
        {horizontal && (
          <Icon name="chevron-forward" size={18} color="rgba(255,255,255,0.85)" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const InsuranceActionGrid: React.FC<InsuranceActionGridProps> = ({
  actions,
  onPress,
}) => {
  const secondary = actions.filter(a => !a.primary);
  const primary = actions.filter(a => a.primary);

  return (
    <View style={styles.grid}>
      <View style={styles.topRow}>
        {secondary.map(action => (
          <ActionCard key={action.key} action={action} onPress={() => onPress(action.key)} />
        ))}
      </View>
      {primary.map(action => (
        <ActionCard
          key={action.key}
          action={action}
          onPress={() => onPress(action.key)}
          horizontal
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['2.5'],
    marginBottom: spacing['4'],
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing['2.5'],
  },
  halfWrap: { flex: 1 },
  fullWrap: { width: '100%' },
  squareCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3.5'],
    paddingHorizontal: spacing['2'],
    borderRadius: 16,
    gap: spacing['2'],
    borderWidth: 1,
    minHeight: 96,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderRadius: 16,
    gap: spacing['3'],
    borderWidth: 1,
    minHeight: 56,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  label: { textAlign: 'center', lineHeight: 18 },
  rowLabel: { flex: 1, textAlign: 'left' },
});
