import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Ionicons';
import { GENDER_OPTIONS } from '../../constants';
import { Button } from '../../components/buttons/Button';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { RoleSelector } from '../../components/forms/RoleSelector';
import { SelectField } from '../../components/forms/SelectField';
import { TextInput } from '../../components/forms/TextInput';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList, UserRole } from '../../types';
import { RegisterFormData, registerSchema } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore(state => state.register);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      pinCode: '',
      state: '',
      district: '',
      city: '',
      termsAccepted: false,
    },
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await register({ ...data, role });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <IconButton
          name="arrow-back"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        />
      </View>

      <Animated.View entering={FadeInDown.duration(400)} style={styles.roleSection}>
        <RoleSelector selected={role} onSelect={setRole} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.form}>
        <Text variant="h3" align="center" style={styles.formTitle}>
          Personal Details
        </Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="First Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter first name"
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Last Name"
              value={value}
              onChangeText={onChange}
              placeholder="Enter last name"
              error={errors.lastName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { value } }) => (
            <SelectField
              label="Gender"
              value={value}
              placeholder="Select gender"
              onPress={() => {
                const current = GENDER_OPTIONS.indexOf(value);
                const next = GENDER_OPTIONS[(current + 1) % GENDER_OPTIONS.length];
                setValue('gender', next, { shouldValidate: true });
              }}
              error={errors.gender?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter email address"
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Phone"
              value={value}
              onChangeText={onChange}
              placeholder="Enter 10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="pinCode"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="PIN Code"
              value={value}
              onChangeText={onChange}
              placeholder="Enter PIN code"
              keyboardType="numeric"
              maxLength={6}
              error={errors.pinCode?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field: { value } }) => (
            <SelectField
              label="State"
              value={value}
              placeholder="Select state"
              onPress={() =>
                navigation.navigate('LocationPicker', { field: 'state' })
              }
              error={errors.state?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="district"
          render={({ field: { value } }) => (
            <SelectField
              label="District"
              value={value}
              placeholder="Select district"
              onPress={() =>
                navigation.navigate('LocationPicker', { field: 'district' })
              }
              error={errors.district?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { value } }) => (
            <SelectField
              label="City"
              value={value}
              placeholder="Select city"
              onPress={() =>
                navigation.navigate('LocationPicker', { field: 'city' })
              }
              error={errors.city?.message}
            />
          )}
        />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() =>
            setValue('termsAccepted', !termsAccepted, {
              shouldValidate: true,
            })
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!termsAccepted }}>
          <Icon
            name={termsAccepted ? 'checkbox' : 'square-outline'}
            size={22}
            color={termsAccepted ? '#7C3AED' : '#94A3B8'}
          />
          <Text variant="bodySmall" color="#64748B" style={styles.termsText}>
            I agree to the{' '}
            <Text variant="label" color="#7C3AED">
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>
        {errors.termsAccepted && (
          <Text variant="caption" color="#F43F5E">
            {errors.termsAccepted.message}
          </Text>
        )}

        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isValid}
          fullWidth
          style={styles.submitBtn}
        />
      </Animated.View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  roleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formTitle: {
    marginBottom: 24,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  termsText: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 16,
  },
});
