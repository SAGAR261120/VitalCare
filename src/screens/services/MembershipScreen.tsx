import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MEMBERSHIP_PLANS } from '../../constants';
import { MembershipCard } from '../../components/cards/MembershipCard';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../theme';

export const MembershipScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="h2">Membership Plans</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Choose the plan that fits your health goals
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {MEMBERSHIP_PLANS.map(plan => (
          <MembershipCard key={plan.id} plan={plan} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
