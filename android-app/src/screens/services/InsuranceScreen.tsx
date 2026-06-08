import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { INSURANCE_PLANS } from '../../constants';
import { InsuranceCard } from '../../components/cards/InsuranceCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../theme';

export const InsuranceScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="h2">Insurance Plans</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Protect what matters most
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.banner, theme.shadows.md]}>
          <Text variant="h4" color={theme.colors.white}>
            Compare Top Plans
          </Text>
          <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
            Upload, store, and compare insurance policies in one place
          </Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {INSURANCE_PLANS.map(plan => (
          <InsuranceCard key={plan.id} plan={plan} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 4,
  },
  banner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    gap: 6,
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
