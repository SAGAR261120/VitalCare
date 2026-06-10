import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../../components/buttons/Button';
import { IconButton } from '../../components/common/IconButton';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Text } from '../../components/common/Text';
import { TextInput } from '../../components/forms/TextInput';
import { PillSelector } from '../../components/cycle/PillSelector';
import { ProfileSetupStepper } from '../../components/cycle/ProfileSetupStepper';
import { SCREEN_GUTTER } from '../../constants/layout';
import { api } from '../../services/api';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { CycleStackParamList } from '../../types';
import { getCycleTheme } from '../../components/cycle/cycleTheme';

type Nav = NativeStackNavigationProp<CycleStackParamList, 'CycleProfileSetup'>;

const SYMPTOMS = ['Cramps', 'Mood swings', 'Headache', 'Acne', 'Back pain', 'Bloating', 'Breast tenderness', 'Fatigue', 'Nausea', 'Irritability'];

export const CycleProfileSetupScreen: React.FC = () => {
  const theme = useTheme();
  const cycle = getCycleTheme(theme);
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState('');
  const [mode, setMode] = useState('Period');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [regularity, setRegularity] = useState('Regular');
  const [flowType, setFlowType] = useState('Medium');
  const [symptoms, setSymptoms] = useState<string[]>(['Cramps']);

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const save = async () => {
    setLoading(true);
    try {
      await api.cycle.updateProfile({
        name,
        height: Number(height) || undefined,
        heightUnit: 'cm',
        weight: Number(weight) || undefined,
        dateOfBirth: dob || undefined,
        mode: mode.toLowerCase() === 'both' ? 'both' : mode.toLowerCase(),
        lastPeriodStart: lastPeriod || undefined,
        cycleLength: Number(cycleLength) || 28,
        periodLength: Number(periodLength) || 5,
        regularity: regularity.toLowerCase().replace(/\s+/g, '_'),
        flowType: flowType.toLowerCase(),
        symptoms: symptoms.map(s => s.toLowerCase()),
        setupComplete: true,
      });
      navigation.replace('CycleDashboard');
    } catch (err: unknown) {
      Alert.alert('Error', (err as { message?: string })?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step < 2) setStep(step + 1);
    else save();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <ScreenContainer scrollable safeBottom>
      <View style={styles.headerRow}>
        <IconButton name="arrow-back" onPress={back} accessibilityLabel="Go back" />
        <Text variant="h3" style={styles.headerTitle}>Profile Setup</Text>
        <IconButton name="notifications-outline" onPress={() => {}} accessibilityLabel="Notifications" />
      </View>

      <ProfileSetupStepper current={step} />

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, theme.shadows.md]}>
        {step === 0 && (
          <>
            <Text variant="label" color={cycle.pink}>👩 Personal Info</Text>
            <TextInput label="Your Name" value={name} onChangeText={setName} placeholder="Enter your name" />
            <TextInput label="Height" value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="cm" leftIcon="resize-outline" />
            <TextInput label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" leftIcon="barbell-outline" />
            <TextInput label="Date of Birth" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" leftIcon="calendar-outline" />
          </>
        )}

        {step === 1 && (
          <>
            <Text variant="label" color={cycle.pink}>🌸 Select Mode</Text>
            <PillSelector options={['Period', 'Pregnancy', 'Both']} selected={mode} onSelect={setMode} columns={3} />
          </>
        )}

        {step === 2 && (
          <>
            <Text variant="label" color={cycle.pink}>💖 Period Details</Text>
            <TextInput label="First Day of Last Period" value={lastPeriod} onChangeText={setLastPeriod} placeholder="YYYY-MM-DD" leftIcon="calendar-outline" />
            <TextInput label="Avg Cycle Length" value={cycleLength} onChangeText={setCycleLength} keyboardType="numeric" />
            <TextInput label="Avg Period Duration" value={periodLength} onChangeText={setPeriodLength} keyboardType="numeric" />
            <Text variant="label">Is Your Cycle Regular?</Text>
            <PillSelector options={['Regular', 'Irregular', 'Not Sure']} selected={regularity} onSelect={setRegularity} />
            <Text variant="label">Period Flow Type</Text>
            <PillSelector options={['Light', 'Medium', 'Heavy']} selected={flowType} onSelect={setFlowType} />
            <Text variant="label">Symptoms</Text>
            <View style={styles.symptomGrid}>
              {SYMPTOMS.map(s => {
                const active = symptoms.includes(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.symptomPill, { backgroundColor: active ? cycle.pink : theme.colors.surface, borderColor: active ? cycle.pink : theme.colors.border }]}
                    onPress={() => toggleSymptom(s)}>
                    <Text variant="caption" color={active ? theme.colors.white : theme.colors.text}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <Button title="Back" variant="outline" onPress={back} style={styles.footerBtn} />
        )}
        <Button
          title={step === 2 ? 'Save' : 'Next'}
          onPress={next}
          loading={loading}
          style={[styles.footerBtn, step === 0 && styles.footerFull]}
          fullWidth={step === 0}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: spacing['2'],
    gap: spacing['2'],
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  card: {
    marginHorizontal: SCREEN_GUTTER,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing['5'],
    gap: spacing['4'],
    marginBottom: spacing['4'],
  },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  symptomPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  footer: { flexDirection: 'row', paddingHorizontal: SCREEN_GUTTER, gap: spacing['3'], marginBottom: spacing['6'] },
  footerBtn: { flex: 1 },
  footerFull: { flex: undefined, width: '100%' },
});
