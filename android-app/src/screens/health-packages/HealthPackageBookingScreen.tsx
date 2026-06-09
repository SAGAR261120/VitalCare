import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { BookNowButton } from '../../components/health-packages/BookNowButton';
import { getBookingTheme } from '../../components/health-packages/bookingTheme';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { AlertModal } from '../../components/modals/AlertModal';
import { GENDER_OPTIONS } from '../../constants';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { HealthPackagesStackParamList, PackageBookingForm } from '../../types';

type Route = RouteProp<HealthPackagesStackParamList, 'HealthPackageBooking'>;
type Nav = NativeStackNavigationProp<HealthPackagesStackParamList, 'HealthPackageBooking'>;

const RELATIONSHIPS = ['Self', 'Spouse', 'Parent', 'Child', 'Sibling', 'Other'];

export const HealthPackageBookingScreen: React.FC = () => {
  const theme = useTheme();
  const booking = getBookingTheme(theme);
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const user = useAuthStore(state => state.user);

  const [form, setForm] = useState<PackageBookingForm>({
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
    age: '',
    gender: user?.gender || '',
    relationship: 'Self',
    address: '',
    city: user?.city || '',
    landmark: '',
    pincode: user?.pinCode || '',
    state: user?.state || '',
    district: user?.district || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PackageBookingForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key: keyof PackageBookingForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof PackageBookingForm, string>> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.age.trim()) next.age = 'Age is required';
    if (!form.gender) next.gender = 'Gender is required';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.pincode.trim()) next.pincode = 'Pincode is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await api.appointments.book({
        healthPackage: params.packageId,
        date: params.date,
        time: params.time,
        doctorName: params.packageName,
        specialty: 'Health Package',
        notes: 'Home sample collection requested',
        patientDetails: {
          fullName: form.fullName.trim(),
          age: Number(form.age),
          gender: form.gender,
          relationship: form.relationship,
          address: form.address.trim(),
          city: form.city.trim(),
          landmark: form.landmark.trim(),
          pincode: form.pincode.trim(),
          state: form.state.trim(),
          district: form.district.trim(),
        },
      });
      setSuccessVisible(true);
    } catch (err: unknown) {
      setErrorMsg((err as { message?: string })?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToAppointments = () => {
    setSuccessVisible(false);
    const drawer = navigation.getParent();
    drawer?.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: { screen: 'Appointments' },
      }),
    );
  };

  const renderChip = (
    label: string,
    active: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.chip,
        {
          backgroundColor: active ? booking.chipActiveBg : booking.chipIdleBg,
          borderColor: active ? booking.chipActiveBg : booking.formBorder,
        },
      ]}
      onPress={onPress}>
      <Text variant="caption" color={active ? booking.chipActiveText : booking.chipIdleText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer scrollable safeBottom>
      <View style={styles.header}>
        <IconButton name="arrow-back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
        <View style={styles.titleBlock}>
          <Text variant="h3">Complete Booking</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>Step 2 of 2 — Patient details</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.stepRow}>
        <View style={[styles.stepDot, { backgroundColor: booking.stepActive }]} />
        <View style={[styles.stepLine, { backgroundColor: booking.stepActive }]} />
        <View style={[styles.stepDot, { backgroundColor: booking.stepActive }]} />
      </View>

      <LinearGradient
        colors={booking.trustGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.summaryCard, theme.shadows.md]}>
        <View style={styles.summaryIcon}>
          <Icon name="calendar" size={22} color={booking.iconGold} />
        </View>
        <View style={styles.summaryText}>
          <Text variant="label" color={theme.colors.white} numberOfLines={2}>
            {params.packageName || 'Health Package'}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.85)">
            {params.date}  •  {params.time}
          </Text>
        </View>
        <View style={styles.confirmedBadge}>
          <Icon name="checkmark-circle" size={16} color={theme.colors.secondary} />
        </View>
      </LinearGradient>

      <View style={[styles.formCard, { backgroundColor: theme.colors.surface, borderColor: booking.formBorder }, theme.shadows.sm]}>
        <Text variant="h4" style={styles.formTitle}>Patient Information</Text>
        <Text variant="caption" color={theme.colors.textSecondary} style={styles.formSubtitle}>
          Details for sample collection at your address
        </Text>

        <TextInput
          label="Full Name"
          value={form.fullName}
          onChangeText={v => update('fullName', v)}
          placeholder="Enter full name"
          leftIcon="person-outline"
          error={errors.fullName}
        />
        <TextInput
          label="Age"
          value={form.age}
          onChangeText={v => update('age', v)}
          placeholder="Age"
          keyboardType="numeric"
          leftIcon="calendar-outline"
          error={errors.age}
        />

        <Text variant="label" color={theme.colors.textSecondary} style={styles.fieldLabel}>Gender</Text>
        <View style={styles.chipRow}>
          {GENDER_OPTIONS.slice(0, 3).map(g => renderChip(g, form.gender === g, () => update('gender', g)))}
        </View>
        {errors.gender && <Text variant="caption" color={theme.colors.error}>{errors.gender}</Text>}

        <Text variant="label" color={theme.colors.textSecondary} style={styles.fieldLabel}>Relationship</Text>
        <View style={styles.chipRow}>
          {RELATIONSHIPS.map(r => renderChip(r, form.relationship === r, () => update('relationship', r)))}
        </View>

        <TextInput
          label="Address"
          value={form.address}
          onChangeText={v => update('address', v)}
          placeholder="Flat/House No./Building/Apartment"
          leftIcon="home-outline"
          error={errors.address}
        />
        <TextInput
          label="City"
          value={form.city}
          onChangeText={v => update('city', v)}
          placeholder="City"
          leftIcon="navigate-outline"
          error={errors.city}
        />
        <TextInput
          label="Landmark"
          value={form.landmark}
          onChangeText={v => update('landmark', v)}
          placeholder="Landmark (optional)"
          leftIcon="flag-outline"
        />
        <TextInput
          label="Pincode"
          value={form.pincode}
          onChangeText={v => update('pincode', v)}
          placeholder="Pincode"
          keyboardType="numeric"
          leftIcon="location-outline"
          error={errors.pincode}
        />
        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <TextInput
              label="State"
              value={form.state}
              onChangeText={v => update('state', v)}
              placeholder="State"
              leftIcon="map-outline"
            />
          </View>
          <View style={styles.halfInput}>
            <TextInput
              label="District"
              value={form.district}
              onChangeText={v => update('district', v)}
              placeholder="District"
              leftIcon="map-outline"
            />
          </View>
        </View>

        {errorMsg ? (
          <View style={[styles.errorBox, { backgroundColor: booking.cancelBg, borderColor: booking.cancelBorder }]}>
            <Icon name="alert-circle" size={16} color={theme.colors.error} />
            <Text variant="caption" color={theme.colors.error}>{errorMsg}</Text>
          </View>
        ) : null}

        <BookNowButton
          title="Confirm Booking"
          icon="shield-checkmark-outline"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
          style={styles.submitBtn}
        />

        <View style={styles.secureRow}>
          <Icon name="lock-closed-outline" size={14} color={theme.colors.textTertiary} />
          <Text variant="caption" color={theme.colors.textTertiary}>
            Your information is securely encrypted
          </Text>
        </View>
      </View>

      <AlertModal
        visible={successVisible}
        type="success"
        title="Booking Confirmed!"
        message="Your health package appointment has been scheduled successfully."
        confirmText="View Appointments"
        onConfirm={goToAppointments}
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
    paddingBottom: spacing['2'],
    gap: spacing['2'],
  },
  titleBlock: { flex: 1, gap: 2 },
  headerSpacer: { width: 40 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1'],
    marginBottom: spacing['4'],
  },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepLine: { width: 40, height: 2, borderRadius: 1 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SCREEN_GUTTER,
    padding: spacing['4'],
    borderRadius: 20,
    marginBottom: spacing['4'],
    gap: spacing['3'],
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: { flex: 1, gap: 4 },
  confirmedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing['5'],
    marginBottom: spacing['8'],
    gap: spacing['1'],
  },
  formTitle: { marginBottom: spacing['0.5'] },
  formSubtitle: { marginBottom: spacing['4'] },
  fieldLabel: { marginTop: spacing['2'], marginBottom: spacing['1.5'] },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'], marginBottom: spacing['2'] },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowInputs: { flexDirection: 'row', gap: spacing['3'] },
  halfInput: { flex: 1 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    padding: spacing['3'],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing['2'],
  },
  submitBtn: { marginTop: spacing['4'] },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1.5'],
    marginTop: spacing['3'],
  },
});
