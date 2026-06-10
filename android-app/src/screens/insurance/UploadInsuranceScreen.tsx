import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { InsuranceEmptyHero } from '../../components/insurance/InsuranceEmptyHero';
import { InsuranceFilterTabs } from '../../components/insurance/InsuranceFilterTabs';
import { Button } from '../../components/buttons/Button';
import { IconButton } from '../../components/common/IconButton';
import { Loader } from '../../components/common/Loader';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

const ICON_BTN = 44;
const HEADER_GAP = spacing['2'];

export const UploadInsuranceScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await api.insurance.getSubmissions('upload');
      setUploads(res.data.data.items || []);
    } catch {
      setUploads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = uploads.filter(u =>
    !search || (u.policyName || '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpload = async () => {
    if (!policyName.trim()) {
      Alert.alert('Required', 'Please enter a policy name.');
      return;
    }
    setSubmitting(true);
    try {
      await api.insurance.submitRequirement({
        type: 'upload',
        policyName: policyName.trim(),
      });
      setPolicyName('');
      Alert.alert('Uploaded', 'Your insurance policy has been submitted for review.');
      setActiveTab('all');
      load(true);
    } catch (err: unknown) {
      Alert.alert('Error', (err as { message?: string })?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'approved') return theme.colors.success;
    if (status === 'rejected') return theme.colors.error;
    return theme.colors.warning;
  };

  if (loading && !refreshing) return <Loader fullScreen message="Loading uploads..." />;

  return (
    <ScreenContainer safeBottom>
      <View style={styles.headerRow}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
        <Text variant="h3" style={styles.headerTitle}>Upload Insurance</Text>
        <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
      </View>
      <Text variant="caption" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
        Save and manage your policy documents
      </Text>

      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search policy name"
          leftIcon="search-outline"
          rightIcon={search ? 'close-circle' : undefined}
          onRightIconPress={() => setSearch('')}
        />
      </View>

      <InsuranceFilterTabs
        tabs={[
          { id: 'all', label: 'All', active: activeTab === 'all' },
          { id: 'upload', label: 'Upload New', active: activeTab === 'upload' },
        ]}
        onSelect={setActiveTab}
      />

      {activeTab === 'upload' && (
        <View style={[styles.uploadForm, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.formIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Icon name="cloud-upload-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text variant="label">Add New Policy</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Enter your policy name to submit for review
          </Text>
          <TextInput
            value={policyName}
            onChangeText={setPolicyName}
            placeholder="Enter policy name"
            leftIcon="document-text-outline"
          />
          <Button title="Upload Insurance" onPress={handleUpload} loading={submitting} fullWidth />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        contentContainerStyle={filtered.length === 0 ? styles.empty : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={
          <InsuranceEmptyHero
            title="No Data Found"
            description={
              activeTab === 'upload'
                ? 'Fill in the form above to upload your first policy.'
                : 'Your uploaded policies will appear here.'
            }
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.sm]}>
            <View style={styles.cardRow}>
              <View style={[styles.docIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <Icon name="document-text" size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text variant="label">{item.policyName || 'Insurance Policy'}</Text>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor(item.status)}18` }]}>
                <Text variant="caption" color={statusColor(item.status)}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    gap: HEADER_GAP,
  },
  headerTitle: { flex: 1 },
  headerSubtitle: {
    paddingHorizontal: SCREEN_GUTTER,
    marginTop: spacing['1'],
    marginBottom: spacing['4'],
    marginLeft: ICON_BTN + HEADER_GAP,
    marginRight: ICON_BTN + HEADER_GAP,
  },
  searchWrap: {
    paddingHorizontal: SCREEN_GUTTER,
    marginBottom: spacing['3'],
  },
  uploadForm: {
    marginHorizontal: SCREEN_GUTTER,
    padding: spacing['4'],
    gap: spacing['3'],
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing['4'],
  },
  formIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  list: { paddingHorizontal: SCREEN_GUTTER, paddingBottom: spacing['6'] },
  empty: { flexGrow: 1 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing['4'],
    marginBottom: spacing['3'],
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'] },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
});
