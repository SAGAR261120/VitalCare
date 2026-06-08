import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN_GUTTER } from '../../constants/layout';
import { spacing } from '../../theme/spacing';
import { Shimmer } from './Shimmer';

export const HomeScreenSkeleton: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Shimmer width={44} height={44} borderRadius={14} />
      <Shimmer width="50%" height={36} borderRadius={12} />
      <Shimmer width={44} height={44} borderRadius={14} />
    </View>
    <Shimmer width="70%" height={28} borderRadius={10} style={styles.greeting} />
    <Shimmer height={52} borderRadius={16} style={styles.search} />
    <Shimmer height={160} borderRadius={24} style={styles.banner} />
    <Shimmer width="45%" height={22} borderRadius={8} style={styles.sectionTitle} />
    <View style={styles.row}>
      <Shimmer width={260} height={180} borderRadius={20} />
      <Shimmer width={260} height={180} borderRadius={20} />
    </View>
    <Shimmer width="40%" height={22} borderRadius={8} style={styles.sectionTitle} />
    <View style={styles.row}>
      <Shimmer width={140} height={170} borderRadius={20} />
      <Shimmer width={140} height={170} borderRadius={20} />
      <Shimmer width={140} height={170} borderRadius={20} />
    </View>
    <Shimmer width="45%" height={22} borderRadius={8} style={styles.sectionTitle} />
    <View style={styles.grid}>
      <Shimmer height={100} borderRadius={20} style={styles.gridItem} />
      <Shimmer height={100} borderRadius={20} style={styles.gridItem} />
      <Shimmer height={100} borderRadius={20} style={styles.gridItem} />
      <Shimmer height={100} borderRadius={20} style={styles.gridItem} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing['2'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['4'],
    gap: spacing['3'],
  },
  greeting: {
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['4'],
  },
  search: {
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['6'],
  },
  banner: {
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['7'],
  },
  sectionTitle: {
    marginHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['4'],
  },
  row: {
    flexDirection: 'row',
    paddingLeft: SCREEN_GUTTER,
    gap: spacing['3'],
    marginBottom: spacing['7'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SCREEN_GUTTER,
    gap: spacing['3'],
  },
  gridItem: {
    width: '47%',
  },
});
