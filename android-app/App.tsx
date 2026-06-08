import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useThemeStore } from './src/theme';

function App() {
  const initializeTheme = useThemeStore(state => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
