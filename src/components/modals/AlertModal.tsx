import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';
import { Button } from '../buttons/Button';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'error' | 'success' | 'warning';
  confirmText?: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  onConfirm,
  onDismiss,
}) => {
  const theme = useTheme();

  const iconMap = {
    info: 'information-circle',
    error: 'alert-circle',
    success: 'checkmark-circle',
    warning: 'warning',
  };

  const colorMap = {
    info: theme.colors.info,
    error: theme.colors.error,
    success: theme.colors.success,
    warning: theme.colors.warning,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss ?? onConfirm}
      statusBarTranslucent>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Animated.View
          entering={ZoomIn.duration(300).springify()}
          style={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
            theme.shadows['2xl'],
          ]}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: `${colorMap[type]}20` },
            ]}>
            <Icon
              name={iconMap[type]}
              size={32}
              color={colorMap[type]}
            />
          </View>
          <Text variant="h3" align="center" style={styles.title}>
            {title}
          </Text>
          <Text
            variant="body"
            color={theme.colors.textSecondary}
            align="center"
            style={styles.message}>
            {message}
          </Text>
          <Button title={confirmText} onPress={onConfirm} fullWidth />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    lineHeight: 22,
  },
});
