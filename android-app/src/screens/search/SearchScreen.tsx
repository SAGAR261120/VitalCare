import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SearchBar } from '../../components/common/SearchBar';
import { Text } from '../../components/common/Text';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import { SCREEN_GUTTER, getScrollBottomPadding } from '../../constants/layout';
import { useTheme } from '../../theme';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
}

export const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { searchQuery, setSearchQuery } = useAppStore();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await api.content.search(q);
      const d = res.data.data;
      const mapped: SearchResult[] = [
        ...(d.packages || []).map((p: { _id: string; name: string; description?: string }) => ({
          id: p._id, title: p.name, subtitle: p.description || 'Health Package', type: 'package', icon: 'medkit-outline',
        })),
        ...(d.specialists || []).map((s: { _id: string; name: string; specialty: string }) => ({
          id: s._id, title: s.name, subtitle: s.specialty, type: 'specialist', icon: 'person-outline',
        })),
        ...(d.cities || []).map((c: { _id: string; name: string; state: string }) => ({
          id: c._id, title: c.name, subtitle: c.state, type: 'city', icon: 'location-outline',
        })),
        ...(d.insurance || []).map((i: { _id: string; name: string; provider: string }) => ({
          id: i._id, title: i.name, subtitle: i.provider, type: 'insurance', icon: 'shield-outline',
        })),
      ];
      setResults(mapped);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  return (
    <ScreenContainer safeBottom={false} fabSafeArea tabBarSafeArea>
      <View style={styles.header}>
        <Text variant="h2">Search</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search packages, doctors, cities..." />
      </View>
      {loading && <Loader message="Searching..." />}
      {!loading && results.length === 0 && searchQuery.length >= 2 && (
        <EmptyState title="No results found" description={`Nothing matched "${searchQuery}"`} />
      )}
      {!loading && searchQuery.length < 2 && (
        <EmptyState title="Start typing" description="Search for health packages, specialists, cities, or insurance plans." />
      )}
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => {
              if (item.type === 'package') {
                navigation.navigate('HealthPackages', {
                  screen: 'HealthPackageDetail',
                  params: { packageId: item.id },
                });
              }
            }}
            accessibilityRole="button">
            <View style={[styles.resultIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
              <Icon name={item.icon} size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.resultContent}>
              <Text variant="label">{item.title}</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>{item.subtitle}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: SCREEN_GUTTER, paddingTop: 8, gap: 16, marginBottom: 8 },
  list: { paddingHorizontal: SCREEN_GUTTER, paddingBottom: getScrollBottomPadding({ hasTabBar: true, hasFab: true, safeBottom: 0 }) },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 12 },
  resultIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultContent: { flex: 1, gap: 2 },
});
