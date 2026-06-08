import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { USER_ROLES } from '../../constants';
import { useTheme } from '../../theme';
import { UserRole } from '../../types';
import { Text } from '../common/Text';

interface RoleSelectorProps {
  selected: UserRole;
  onSelect: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="overline" color={theme.colors.textSecondary}>
        Select Your Role
      </Text>
      <View style={styles.grid}>
        {USER_ROLES.map((role, index) => {
          const isSelected = selected === role.id;
          return (
            <Animated.View
              key={role.id}
              entering={FadeInDown.delay(index * 60).duration(400)}
              style={styles.itemWrapper}>
              <TouchableOpacity
                onPress={() => onSelect(role.id as UserRole)}
                style={[
                  styles.item,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                  isSelected ? theme.shadows.md : theme.shadows.sm,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={role.label}>
                <Icon
                  name={role.icon}
                  size={22}
                  color={isSelected ? theme.colors.white : theme.colors.primary}
                />
                <Text
                  variant="label"
                  color={isSelected ? theme.colors.white : theme.colors.text}
                  align="center">
                  {role.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemWrapper: {
    width: '48%',
    flexGrow: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 88,
  },
});
