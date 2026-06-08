import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { Specialist } from '../../types';
import { Text } from '../common/Text';

interface SpecialistCardProps {
  specialist: Specialist;
  index?: number;
  onPress?: () => void;
}

export const SpecialistCard: React.FC<SpecialistCardProps> = ({
  specialist,
  index = 0,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(400)}
      onTouchEnd={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        theme.shadows.sm,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${specialist.name}, ${specialist.specialty}`}>
      <View
        style={[styles.avatar, { backgroundColor: specialist.imageColor }]}>
        <Icon name="medical" size={28} color={theme.colors.white} />
      </View>
      <Text variant="label" numberOfLines={1}>
        {specialist.name}
      </Text>
      <Text variant="caption" color={theme.colors.textSecondary}>
        {specialist.specialty}
      </Text>
      <View style={styles.meta}>
        <Icon name="star" size={12} color={theme.colors.warning} />
        <Text variant="caption" color={theme.colors.textSecondary}>
          {specialist.rating}
        </Text>
        <Text variant="caption" color={theme.colors.textTertiary}>
          • {specialist.experience}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});
