import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../buttons/Button';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { Text } from '../common/Text';
import { TextInput } from '../forms/TextInput';

interface SubmitRequirementModalProps {
  visible: boolean;
  companies: string[];
  onClose: () => void;
  onSubmit: (data: {
    insuranceCompany: string;
    mobileNumber: string;
    numberOfPeople: string;
    policyTenure: string;
    preferredAmount: string;
  }) => Promise<void>;
};

export const SubmitRequirementModal: React.FC<SubmitRequirementModalProps> = ({
  visible,
  companies,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [company, setCompany] = useState('');
  const [mobile, setMobile] = useState('');
  const [people, setPeople] = useState('');
  const [tenure, setTenure] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCompany('');
      setMobile('');
      setPeople('');
      setTenure('');
      setAmount('');
      setShowCompanies(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        insuranceCompany: company,
        mobileNumber: mobile,
        numberOfPeople: people,
        policyTenure: tenure,
        preferredAmount: amount,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(200)} style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable style={styles.dismiss} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={[styles.sheet, { backgroundColor: theme.colors.surface }, theme.shadows.lg]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />

          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.colors.inputBackground }]}
              accessibilityLabel="Close">
              <Icon name="close" size={20} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={[styles.iconBadge, { backgroundColor: theme.colors.primaryLight }]}>
              <Icon name="create-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text variant="h4" style={styles.title}>Submit Requirement</Text>
            <Text variant="bodySmall" color={theme.colors.textSecondary} align="center" style={styles.subtitle}>
              Tell us your insurance needs and we will find the best plan
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.field}>
              <Text variant="label" color={theme.colors.text}>
                Insurance Company <Text variant="label" color={theme.colors.error}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.select,
                  {
                    borderColor: showCompanies ? theme.colors.primary : theme.colors.inputBorder,
                    backgroundColor: theme.colors.inputBackground,
                  },
                ]}
                onPress={() => setShowCompanies(!showCompanies)}>
                <Icon name="business-outline" size={18} color={theme.colors.primary} style={styles.selectIcon} />
                <Text
                  variant="body"
                  color={company ? theme.colors.text : theme.colors.textTertiary}
                  style={styles.selectText}>
                  {company || 'Select insurance company'}
                </Text>
                <Icon name={showCompanies ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {showCompanies && (
                <View style={[styles.dropdown, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                  {companies.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.dropdownItem,
                        company === c && { backgroundColor: theme.colors.primaryLight },
                      ]}
                      onPress={() => { setCompany(c); setShowCompanies(false); }}>
                      <Text variant="body" color={company === c ? theme.colors.primary : theme.colors.text}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TextInput
              label="Mobile Number *"
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />
            <TextInput
              label="Number of People to be Insured *"
              value={people}
              onChangeText={setPeople}
              keyboardType="numeric"
              placeholder="e.g. 4"
              leftIcon="people-outline"
            />
            <TextInput
              label="Policy Tenure (in years) *"
              value={tenure}
              onChangeText={setTenure}
              keyboardType="numeric"
              placeholder="e.g. 1"
              leftIcon="calendar-outline"
            />
            <TextInput
              label="Preferred Policy Amount *"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              leftIcon="cash-outline"
            />

            <Button
              title={loading ? 'Submitting...' : 'Submit'}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.submitBtn}
            />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  dismiss: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing['3'],
    marginBottom: spacing['2'],
  },
  modalHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['4'],
    gap: spacing['2'],
  },
  closeBtn: {
    position: 'absolute',
    right: spacing['5'],
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['1'],
  },
  title: { textAlign: 'center' },
  subtitle: { lineHeight: 20, paddingHorizontal: spacing['4'] },
  form: {
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['8'],
    gap: spacing['4'],
  },
  field: { gap: spacing['2'] },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3.5'],
    minHeight: 52,
  },
  selectIcon: { marginRight: spacing['2'] },
  selectText: { flex: 1 },
  dropdown: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: spacing['1'],
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3.5'],
  },
  submitBtn: { marginTop: spacing['2'] },
});
