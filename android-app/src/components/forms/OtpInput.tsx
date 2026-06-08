import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  error = false,
}) => {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    onChange(cleaned);
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        accessibilityLabel="OTP input"
        autoFocus
      />
      <View style={styles.boxes}>
        {digits.map((digit, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.delay(index * 80).duration(300)}
            style={[
              styles.box,
              {
                backgroundColor: theme.colors.inputBackground,
                borderColor: error
                  ? theme.colors.error
                  : digit.trim()
                    ? theme.colors.primary
                    : theme.colors.inputBorder,
              },
              digit.trim() ? theme.shadows.sm : {},
            ]}
            onTouchEnd={() => inputRef.current?.focus()}>
            <Animated.Text
              style={[styles.digit, { color: theme.colors.text }]}>
              {digit.trim() || ''}
            </Animated.Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxes: {
    flexDirection: 'row',
    gap: 12,
  },
  box: {
    width: 56,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 24,
    fontWeight: '700',
  },
});
