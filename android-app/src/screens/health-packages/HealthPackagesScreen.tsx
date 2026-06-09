import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HealthPackageListCard } from '../../components/cards/HealthPackageListCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { HealthPackageCategoryTabs } from '../../components/health-packages/HealthPackageCategoryTabs';
import { HealthPackagePromoBanner } from '../../components/health-packages/HealthPackagePromoBanner';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { HealthPackage, HealthPackageCategory, HealthPackagesStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<HealthPackagesStackParamList, 'HealthPackagesList'>;

export const HealthPackagesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [categories, setCategories] = useState<HealthPackageCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [pkgRes, catRes] = await Promise.all([
        api.content.getHealthPackages({
          category: selectedCategory || undefined,
          limit: 50,
        }),
        api.content.getPackageCategories(),
      ]);
      setPackages(pkgRes.data.data.items || []);
      setCategories(catRes.data.data.items || []);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to load packages');
      setPackages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => { load(); }, [load]);

  const openDetail = (pkg: HealthPackage) => {
    navigation.navigate('HealthPackageDetail', { packageId: pkg.id || pkg._id! });
  };

  const openBooking = (pkg: HealthPackage) => {
    navigation.navigate('HealthPackageDetail', {
      packageId: pkg.id || pkg._id!,
      startBooking: true,
    });
  };

  const selectedCategoryName =
    categories.find(c => c._id === selectedCategory)?.name || 'All Packages';

  if (loading && !refreshing) {
    return <Loader fullScreen message="Loading health packages..." />;
  }

  if (error && packages.length === 0) {
    return (
      <ScreenContainer safeBottom>
        <View style={styles.header}>
          <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
          <Text variant="h3" style={styles.title}>Health Packages</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ErrorState title="Unable to load packages" description={error} onRetry={() => load()} />
      </ScreenContainer>
    );
  }

  const listHeader = (
    <>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
        <View style={styles.titleBlock}>
          <Text variant="h3">Health Packages</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Comprehensive checkups at great prices
          </Text>
        </View>
        <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
      </Animated.View>
      <HealthPackagePromoBanner />
      {categories.length > 0 && (
        <HealthPackageCategoryTabs
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}
      <View style={styles.listHeader}>
        <Text variant="h4">{selectedCategoryName}</Text>
        <View style={[styles.countBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text variant="caption" color={theme.colors.primary}>
            {packages.length} {packages.length === 1 ? 'package' : 'packages'}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <ScreenContainer safeBottom>
      <FlatList
        style={styles.list}
        data={packages}
        keyExtractor={item => item.id || item._id!}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />
        }
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState
            title="No packages found"
            description="Try another category or pull to refresh."
            icon="medkit-outline"
          />
        }
        renderItem={({ item, index }) => (
          <HealthPackageListCard
            package={{ ...item, id: item.id || item._id! }}
            index={index}
            onViewDetails={() => openDetail(item)}
            onBookNow={() => openBooking(item)}
          />
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    paddingBottom: spacing['3'],
    gap: spacing['2'],
  },
  titleBlock: { flex: 1, gap: 2 },
  title: { flex: 1, textAlign: 'center' },
  headerSpacer: { width: 40 },
  list: { flex: 1 },
  listContent: {
    paddingBottom: spacing['4'],
    flexGrow: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['3'],
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
