import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_NAME } from '../../constants';
import { Button } from '../../components/buttons/Button';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { LoginFormData, loginSchema } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type LoginMethod = 'otp' | 'password';

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [method, setMethod] = useState<LoginMethod>('otp');
  const [loading, setLoading] = useState(false);
  const sendOtp = useAuthStore(state => state.sendOtp);
  const loginWithPassword = useAuthStore(state => state.loginWithPassword);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      if (method === 'otp') {
        await sendOtp(data.phone);
        navigation.navigate('VerifyOtp', { phone: data.phone });
      } else if (data.password) {
        await loginWithPassword(data.phone, data.password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="auth">
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.logoRow}>
            <View
              style={[
                styles.logoMark,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255,255,255,0.2)'
                    : theme.colors.primaryLight,
                },
              ]}>
              <Icon name="heart" size={24} color={theme.colors.primary} />
            </View>
            <Text variant="h2" color={theme.colors.text}>
              {APP_NAME}
            </Text>
          </View>
          <Text variant="body" color={theme.colors.textSecondary} align="center">
            Sign in to access premium healthcare
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard style={styles.card} elevated>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primaryLight },
              ]}>
              <Icon name="person-outline" size={32} color={theme.colors.primary} />
            </View>

            <View
              style={[
                styles.methodToggle,
                { backgroundColor: theme.colors.inputBackground },
              ]}>
              {(['otp', 'password'] as LoginMethod[]).map(m => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMethod(m)}
                  style={[
                    styles.methodBtn,
                    method === m && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: method === m }}>
                  <Text
                    variant="label"
                    color={
                      method === m
                        ? theme.colors.white
                        : theme.colors.textSecondary
                    }>
                    {m === 'otp' ? 'Use OTP' : 'Use Password'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.phoneRow}>
              <View
                style={[
                  styles.countryCode,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.inputBorder,
                  },
                ]}>
                <Text variant="label">+91</Text>
              </View>
              <View style={styles.phoneInput}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter 10-digit number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </View>
            </View>

            {method === 'password' && (
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value ?? ''}
                    onChangeText={onChange}
                    placeholder="Enter password"
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />
            )}

            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
              style={styles.submitBtn}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}>
              <Text variant="bodySmall" color={theme.colors.textSecondary} align="center">
                New here?{' '}
                <Text variant="label" color={theme.colors.primary}>
                  Create an account
                </Text>
              </Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  methodToggle: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  countryCode: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInput: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 8,
  },
  registerLink: {
    marginTop: 20,
  },
});
