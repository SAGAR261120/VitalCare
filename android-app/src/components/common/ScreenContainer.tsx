import React from 'react';
import {
  RefreshControl,
  RefreshControlProps,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getScrollBottomPadding, SCREEN_GUTTER } from '../../constants/layout';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme';
import { OfflineBanner } from './OfflineBanner';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  safeTop?: boolean;
  safeBottom?: boolean;
  backgroundColor?: string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /** Reserve space for FAB + tab bar in scroll content */
  fabSafeArea?: boolean;
  /** Reserve space for tab bar only */
  tabBarSafeArea?: boolean;
  horizontalPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentStyle,
  safeTop = true,
  safeBottom = true,
  backgroundColor,
  refreshControl,
  fabSafeArea = false,
  tabBarSafeArea = false,
  horizontalPadding = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bg = backgroundColor ?? theme.colors.background;

  const bottomInset = getScrollBottomPadding({
    hasTabBar: tabBarSafeArea,
    hasFab: fabSafeArea,
    safeBottom: safeBottom ? insets.bottom : 0,
  });

  const paddingStyle = {
    paddingTop: safeTop ? insets.top : 0,
  };

  const scrollPadding = {
    paddingBottom: bottomInset,
    ...(horizontalPadding ? { paddingHorizontal: SCREEN_GUTTER } : null),
  };

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, scrollPadding, contentStyle]}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        { paddingBottom: bottomInset },
        horizontalPadding ? { paddingHorizontal: SCREEN_GUTTER } : null,
        contentStyle,
      ]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }, paddingStyle, style]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
      />
      <OfflineBanner />
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
