import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { SearchBar } from '../../components/common/SearchBar';
import { Text } from '../../components/common/Text';
import { useTheme } from '../../theme';

const SEARCH_RESULTS = [
  { id: '1', name: 'VitalCare Medical Center', type: 'Hospital', distance: '2.4 km' },
  { id: '2', name: 'Dr. Sharma - Cardiologist', type: 'Doctor', distance: '3.1 km' },
  { id: '3', name: 'Complete Health Panel', type: 'Package', distance: 'At home' },
  { id: '4', name: 'City Diagnostics Lab', type: 'Lab', distance: '1.8 km' },
  { id: '5', name: 'Wellness Yoga Center', type: 'Wellness', distance: '4.5 km' },
];

const typeIcons: Record<string, string> = {
  Hospital: 'business-outline',
  Doctor: 'medical-outline',
  Package: 'cube-outline',
  Lab: 'flask-outline',
  Wellness: 'leaf-outline',
};

export const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const filtered = SEARCH_RESULTS.filter(
    item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h2">Search</Text>
        <Text variant="bodySmall" color={theme.colors.textSecondary}>
          Find hospitals, doctors & packages
        </Text>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search anything..."
      />

      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name="search"
            size={48}
            color={theme.colors.textTertiary}
          />
          <Text variant="body" color={theme.colors.textSecondary} align="center">
            Search for hospitals, doctors,{'\n'}health packages and more
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeIn.delay(index * 50).duration(300)}
              style={[
                styles.result,
                { backgroundColor: theme.colors.surface },
                theme.shadows.sm,
              ]}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.colors.primaryLight },
                ]}>
                <Icon
                  name={typeIcons[item.type] ?? 'search-outline'}
                  size={22}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.resultInfo}>
                <Text variant="label">{item.name}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {item.type} • {item.distance}
                </Text>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            </Animated.View>
          )}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 100,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 10,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
});
