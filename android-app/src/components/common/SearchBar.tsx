import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { TextInput } from '../forms/TextInput';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search hospitals, doctors, packages...',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon="search-outline"
        rightIcon={value ? 'close-circle' : undefined}
        onRightIconPress={() => onChangeText('')}
        style={styles.input}
        accessibilityLabel="Search"
      />
      <View
        style={[
          styles.filterBtn,
          { backgroundColor: theme.colors.primaryLight },
        ]}>
        <Icon name="options-outline" size={20} color={theme.colors.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
});
