import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import { useTheme, typography } from '../../theme';

type TextVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  accessibilityRole,
  ...props
}) => {
  const theme = useTheme();

  return (
    <RNText
      accessibilityRole={accessibilityRole ?? 'text'}
      style={[
        typography[variant],
        { color: color ?? theme.colors.text, textAlign: align },
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};
