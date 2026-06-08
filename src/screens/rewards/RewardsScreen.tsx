import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../theme';

const REWARDS = [
  { id: '1', title: 'First Checkup', points: 500, icon: 'medkit-outline', done: true },
  { id: '2', title: 'Refer a Friend', points: 1000, icon: 'people-outline', done: false },
  { id: '3', title: 'Complete Profile', points: 200, icon: 'person-outline', done: true },
  { id: '4', title: 'Book 3 Appointments', points: 750, icon: 'calendar-outline', done: false },
  { id: '5', title: 'Wellness Streak (7 days)', points: 300, icon: 'fitness-outline', done: false },
];

export const RewardsScreen: React.FC = () => {
  const theme = useTheme();
  const totalPoints = 1250;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h2">Rewards</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Earn points for healthy habits
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pointsCard, theme.shadows.lg]}>
          <View>
            <Text variant="overline" color="rgba(255,255,255,0.7)">
              Your Points
            </Text>
            <Text variant="display" color={theme.colors.white}>
              {totalPoints.toLocaleString()}
            </Text>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Gold Member • 2,500 to Platinum
            </Text>
          </View>
          <View style={styles.trophyWrap}>
            <Icon name="trophy" size={48} color="rgba(255,255,255,0.4)" />
          </View>
        </LinearGradient>
      </Animated.View>

      <Text variant="h4" style={styles.sectionTitle}>
        Earn More Points
      </Text>

      <FlatList
        data={REWARDS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 60).duration(400)}
            style={[
              styles.rewardCard,
              { backgroundColor: theme.colors.surface },
              theme.shadows.sm,
            ]}>
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: item.done
                    ? `${theme.colors.success}20`
                    : theme.colors.primaryLight,
                },
              ]}>
              <Icon
                name={item.done ? 'checkmark-circle' : item.icon}
                size={24}
                color={item.done ? theme.colors.success : theme.colors.primary}
              />
            </View>
            <View style={styles.rewardInfo}>
              <Text
                variant="label"
                color={item.done ? theme.colors.textTertiary : theme.colors.text}
                style={item.done ? styles.doneText : undefined}>
                {item.title}
              </Text>
              <Text variant="caption" color={theme.colors.accentWarm}>
                +{item.points} pts
              </Text>
            </View>
            {!item.done && (
              <Icon
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            )}
          </Animated.View>
        )}
      />
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
  pointsCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  trophyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: {
    flex: 1,
    gap: 2,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
});
