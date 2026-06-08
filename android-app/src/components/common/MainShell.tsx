import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FloatingActions } from './FloatingActions';

interface MainShellProps {
  children: React.ReactNode;
  /** Whether a bottom tab bar sits beneath the FAB stack */
  hasTabBar?: boolean;
  /** Hide FABs on specific screens if needed */
  showFab?: boolean;
}

export const MainShell: React.FC<MainShellProps> = ({
  children,
  hasTabBar = false,
  showFab = true,
}) => (
  <View style={styles.shell}>
    {children}
    {showFab && <FloatingActions hasTabBar={hasTabBar} />}
  </View>
);

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
});
