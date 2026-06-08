import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/buttons/Button';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { useAppConfig, OnboardingSlide } from '../../hooks/useApi';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlideItem = OnboardingSlide & { id: string };
type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface SlideItemProps {
  item: OnboardingSlideItem;
  index: number;
  scrollX: SharedValue<number>;
}

const SlideItem: React.FC<SlideItemProps> = ({ item, index, scrollX }) => {
  const theme = useTheme();
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={styles.slide}>
      <LinearGradient
        colors={[...item.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}>
        <Animated.View style={animatedStyle}>
          <Icon name={item.icon} size={64} color={theme.colors.primary} />
        </Animated.View>
      </LinearGradient>
      <Text variant="h1" align="center" style={styles.title}>
        {item.title}
      </Text>
      <Text
        variant="body"
        color={theme.colors.textSecondary}
        align="center"
        style={styles.subtitle}>
        {item.subtitle}
      </Text>
    </View>
  );
};

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
}

const PaginationDot: React.FC<DotProps> = ({ index, scrollX }) => {
  const theme = useTheme();
  const dotStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [8, 24, 8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP,
    );
    return { width, opacity };
  });

  return (
    <Animated.View
      style={[styles.dot, dotStyle, { backgroundColor: theme.colors.primary }]}
    />
  );
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { data, loading } = useAppConfig();
  const slides: OnboardingSlideItem[] = (data?.slides ?? []).map(s => ({ ...s, id: s._id }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList<OnboardingSlideItem>>(null);
  const completeOnboarding = useAuthStore(state => state.completeOnboarding);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.replace('Auth');
  };

  if (loading) return <Loader fullScreen message="Loading..." />;
  if (slides.length === 0) {
    handleSkip();
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.skipRow}>
        <Button title="Skip" variant="ghost" size="sm" onPress={handleSkip} />
      </View>

      <FlatList<OnboardingSlideItem>
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler as any}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <PaginationDot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          fullWidth
          icon="arrow-forward"
          iconPosition="right"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
