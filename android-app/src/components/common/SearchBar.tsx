import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_GUTTER } from '../../constants/layout';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { TextInput } from '../forms/TextInput';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search hospitals, doctors, packages...',
  onFilterPress,
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
      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterBtn,
          {
            backgroundColor: theme.colors.primaryLight,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Search filters">
        <Icon name="options-outline" size={20} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2.5'],
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['5'],
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
  },
});
