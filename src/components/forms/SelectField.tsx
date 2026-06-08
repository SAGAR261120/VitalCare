import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

interface SelectFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder = 'Select an option',
  onPress,
  error,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="label"
          color={theme.colors.textSecondary}
          style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: error ? theme.colors.error : theme.colors.inputBorder,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Select'}: ${value ?? placeholder}`}>
        <Text
          variant="body"
          color={value ? theme.colors.text : theme.colors.textTertiary}>
          {value || placeholder}
        </Text>
        <Icon
          name="chevron-down"
          size={20}
          color={theme.colors.textTertiary}
        />
      </TouchableOpacity>
      {error && (
        <Text variant="caption" color={theme.colors.error} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  error: {
    marginTop: 6,
    marginLeft: 4,
  },
});
