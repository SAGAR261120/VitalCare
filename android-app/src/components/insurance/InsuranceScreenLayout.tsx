import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme';
import { getInsuranceTheme } from './insuranceTheme';

interface InsuranceScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Soft sky gradient backdrop for insurance flows */
export const InsuranceScreenLayout: React.FC<InsuranceScreenLayoutProps> = ({
  children,
  style,
}) => {
  const theme = useTheme();
  const ins = getInsuranceTheme(theme);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }, style]}>
      <LinearGradient
        colors={[ins.cardBg, theme.colors.background]}
        style={styles.topGlow}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  topGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 220,
  },
});
