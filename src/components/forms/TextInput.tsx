import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { fastTiming } from '../../animations/config';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
  maxLength,
  editable = true,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderWidth = useSharedValue(1);

  const animatedBorder = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderWidth.value = withTiming(2, fastTiming);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderWidth.value = withTiming(1, fastTiming);
  };

  const borderColor = error
    ? theme.colors.error
    : isFocused
      ? theme.colors.inputFocus
      : theme.colors.inputBorder;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          variant="label"
          color={theme.colors.textSecondary}
          style={styles.label}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorder,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor,
          },
        ]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={theme.colors.textTertiary}
            style={styles.leftIcon}
          />
        )}
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { color: theme.colors.text },
            leftIcon ? styles.inputWithLeftIcon : undefined,
          ]}
          accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        />
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={20}
            color={theme.colors.textTertiary}
            onPress={onRightIconPress}
            style={styles.rightIcon}
            accessibilityRole="button"
          />
        )}
      </Animated.View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 4,
  },
  error: {
    marginTop: 6,
    marginLeft: 4,
  },
});
