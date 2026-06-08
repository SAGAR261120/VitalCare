import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { INDIAN_STATES } from '../../constants';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { useTheme } from '../../theme';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPicker'>;

const DISTRICTS: Record<string, string[]> = {
  Maharashtra: ['Nagpur', 'Mumbai', 'Pune', 'Thane'],
  Karnataka: ['Bangalore', 'Mysore', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
};

const CITIES: Record<string, string[]> = {
  Nagpur: ['Civil Lines', 'Dharampeth', 'Sadar', 'Badil Kheda'],
  Mumbai: ['Andheri', 'Bandra', 'Colaba'],
  Pune: ['Koregaon Park', 'Hinjewadi', 'Kothrud'],
};

export const LocationPickerScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const { field } = route.params;

  const items = useMemo(() => {
    if (field === 'state') return INDIAN_STATES;
    if (field === 'district') return Object.values(DISTRICTS).flat();
    return Object.values(CITIES).flat();
  }, [field]);

  const filtered = items.filter(item =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  const title =
    field === 'state'
      ? 'Select State'
      : field === 'district'
        ? 'Select District'
        : 'Select City';

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <IconButton
          name="close"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close"
        />
        <Text variant="h4">{title}</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.search}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={`Search ${field}...`}
          leftIcon="search-outline"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.item,
              { borderBottomColor: theme.colors.divider },
            ]}
            accessibilityRole="button"
            accessibilityLabel={item}>
            <Text variant="body">{item}</Text>
            <IconButton
              name="chevron-forward"
              onPress={() => navigation.goBack()}
              accessibilityLabel={`Select ${item}`}
              size={18}
              style={styles.chevron}
            />
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  spacer: {
    width: 44,
  },
  search: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  chevron: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
});
