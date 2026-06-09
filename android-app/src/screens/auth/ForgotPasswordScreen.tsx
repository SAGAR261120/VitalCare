import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/buttons/Button';
import { GradientBackground } from '../../components/common/GradientBackground';
import { GlassCard } from '../../components/common/GlassCard';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { IconButton } from '../../components/common/IconButton';
import { useAuthStore } from '../../store/authStore';
import { AuthStackParamList } from '../../types';
import { useTheme } from '../../theme';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const forgotPassword = useAuthStore(state => state.forgotPassword);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await forgotPassword(data.email);
      Alert.alert(
        'Check your email',
        result.message + (result.resetToken ? `\n\nDev token: ${result.resetToken}` : ''),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Request failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="auth">
      <View style={styles.container}>
        <IconButton
          name="arrow-back"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          style={styles.backBtn}
        />
        <Animated.View entering={FadeInDown.duration(500)}>
          <GlassCard style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="lock-open-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text variant="h3" align="center" style={styles.title}>
              Forgot Password
            </Text>
            <Text variant="body" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
              Enter your email and we'll send you instructions to reset your password.
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  leftIcon="mail-outline"
                />
              )}
            />
            <Button
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitBtn}
            />
          </GlassCard>
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 48, left: 16, zIndex: 1 },
  card: { padding: 24 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 24 },
  submitBtn: { marginTop: 16 },
});
