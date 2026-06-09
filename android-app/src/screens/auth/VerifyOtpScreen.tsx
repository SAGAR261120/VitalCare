import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/buttons/Button';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { IconButton } from '../../components/common/IconButton';
import { Text } from '../../components/common/Text';
import { OtpInput } from '../../components/forms/OtpInput';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import { useTheme } from '../../theme';
import { formatPhone } from '../../utils/format';
import { resetToMain } from '../../utils/navigation';
import { OtpFormData, otpSchema } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

export const VerifyOtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { phone } = route.params;
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const verifyOtp = useAuthStore(state => state.verifyOtp);
  const sendOtp = useAuthStore(state => state.sendOtp);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: OtpFormData) => {
    setLoading(true);
    try {
      await verifyOtp(phone, data.otp);
      resetToMain(navigation);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    await sendOtp(phone);
    setTimer(300);
  };

  return (
    <GradientBackground variant="auth">
      <View style={styles.container}>
        <IconButton
          name="arrow-back"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          backgroundColor={theme.colors.surface}
          color={theme.colors.text}
        />

        <Animated.View entering={FadeInDown.duration(500)}>
          <GlassCard style={styles.card} elevated>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.colors.primaryLight },
              ]}>
              <Icon
                name="shield-checkmark-outline"
                size={40}
                color={theme.colors.primary}
              />
            </View>

            <Text variant="h2" align="center">
              Verify OTP
            </Text>
            <Text
              variant="bodySmall"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.subtitle}>
              Sent to {formatPhone(phone)}
            </Text>

            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, value } }) => (
                <OtpInput
                  value={value}
                  onChange={onChange}
                  length={6}
                  error={!!errors.otp}
                />
              )}
            />
            {errors.otp && (
              <Text variant="caption" color={theme.colors.error} align="center">
                {errors.otp.message}
              </Text>
            )}

            <Text variant="bodySmall" color={theme.colors.textSecondary} align="center">
              Time left: {formatTimer(timer)}
            </Text>

            <TouchableOpacity
              onPress={handleResend}
              disabled={timer > 0}
              accessibilityRole="button"
              accessibilityState={{ disabled: timer > 0 }}>
              <Text
                variant="label"
                color={timer > 0 ? theme.colors.textTertiary : theme.colors.primary}
                align="center">
                Resend OTP
              </Text>
            </TouchableOpacity>

            <Button
              title="Verify"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
            />
          </GlassCard>
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  card: {
    padding: 28,
    gap: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: 8,
  },
});
