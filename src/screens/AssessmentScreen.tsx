import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, SegmentedButtons, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SymptomChip } from '../components/SymptomChip';
import { colors } from '../theme';
import { PatientInput, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Assessment'>;

const symptoms = [
  'Cough',
  'Runny nose',
  'Sore throat',
  'Ear pain',
  'Difficulty breathing',
  'Painful urination',
  'Abdominal pain',
  'Diarrhoea',
  'Vomiting',
  'Skin rash',
  'Headache',
  'Neck stiffness',
  'Confusion',
];

export function AssessmentScreen({ navigation }: Props) {
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState<PatientInput['ageUnit']>('years');
  const [sex, setSex] = useState<PatientInput['sex']>('Female');
  const [weight, setWeight] = useState('');
  const [pregnant, setPregnant] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState<PatientInput['durationUnit']>('days');
  const [hasFever, setHasFever] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [malariaEndemic, setMalariaEndemic] = useState(true);
  const [hivStatus, setHivStatus] = useState<PatientInput['hivStatus']>('Unknown');
  const [allergies, setAllergies] = useState('');
  const [recentAntibiotics, setRecentAntibiotics] = useState(false);

  const numericAge = Number(age);
  const showPregnancy = sex === 'Female' && ageUnit === 'years' && numericAge > 10;
  const canAnalyse = chiefComplaint.trim().length > 0;

  const feverTemperatureError = useMemo(() => {
    if (!hasFever || !temperature.trim()) {
      return false;
    }
    const value = Number(temperature);
    return Number.isNaN(value) || value < 34 || value > 42;
  }, [hasFever, temperature]);

  function toggleSymptom(symptom: string) {
    setAdditionalSymptoms((current) =>
      current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom],
    );
  }

  function submit() {
    const parsedAge = Number(age);
    const parsedDuration = Number(duration || '0');
    const parsedWeight = weight.trim() ? Number(weight) : undefined;
    const parsedTemperature = temperature.trim() ? Number(temperature) : undefined;

    if (!parsedAge || parsedAge <= 0) {
      Alert.alert('Check age', 'Age must be greater than 0.');
      return;
    }
    if (!parsedDuration || parsedDuration <= 0) {
      Alert.alert('Check duration', 'Symptom duration must be greater than 0.');
      return;
    }
    if (hasFever && (parsedTemperature === undefined || parsedTemperature < 34 || parsedTemperature > 42)) {
      Alert.alert('Check temperature', 'Temperature must be between 34 and 42°C.');
      return;
    }

    navigation.navigate('Analysis', {
      patient: {
        age: parsedAge,
        ageUnit,
        sex,
        weight: parsedWeight,
        pregnant: showPregnancy ? pregnant : false,
        chiefComplaint: chiefComplaint.trim(),
        duration: parsedDuration,
        durationUnit,
        hasFever,
        temperature: hasFever ? parsedTemperature : undefined,
        additionalSymptoms,
        notes: notes.trim() || undefined,
        malariaEndemic,
        hivStatus,
        allergies: allergies.trim() || undefined,
        recentAntibiotics,
      },
    });
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Section title="Patient">
        <View style={styles.row}>
          <TextInput label="Age" keyboardType="numeric" value={age} onChangeText={setAge} style={styles.flex} />
          <SegmentedButtons
            value={ageUnit}
            onValueChange={(value) => setAgeUnit(value as PatientInput['ageUnit'])}
            buttons={[
              { value: 'years', label: 'Years' },
              { value: 'months', label: 'Months' },
            ]}
            style={styles.segmentFlex}
          />
        </View>
        <SegmentedButtons
          value={sex}
          onValueChange={(value) => setSex(value as PatientInput['sex'])}
          buttons={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]}
        />
        <TextInput label="Weight in kg (optional)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
        {showPregnancy && (
          <Checkbox.Item
            label="Pregnant?"
            status={pregnant ? 'checked' : 'unchecked'}
            onPress={() => setPregnant((value) => !value)}
            position="leading"
            labelStyle={styles.checkboxLabel}
            style={styles.checkbox}
          />
        )}
      </Section>

      <Section title="Symptoms">
        <TextInput
          label="Chief complaint"
          placeholder="Describe the main symptom in your own words"
          value={chiefComplaint}
          onChangeText={setChiefComplaint}
        />
        <View style={styles.row}>
          <TextInput label="Duration" keyboardType="numeric" value={duration} onChangeText={setDuration} style={styles.flex} />
          <SegmentedButtons
            value={durationUnit}
            onValueChange={(value) => setDurationUnit(value as PatientInput['durationUnit'])}
            buttons={[
              { value: 'days', label: 'Days' },
              { value: 'weeks', label: 'Weeks' },
            ]}
            style={styles.segmentFlex}
          />
        </View>
        <Toggle label="Fever?" value={hasFever} onChange={setHasFever} />
        {hasFever && (
          <TextInput
            label="Temperature (°C)"
            keyboardType="numeric"
            value={temperature}
            error={feverTemperatureError}
            onChangeText={setTemperature}
          />
        )}
        <View style={styles.chips}>
          {symptoms.map((symptom) => (
            <SymptomChip
              key={symptom}
              label={symptom}
              selected={additionalSymptoms.includes(symptom)}
              onPress={() => toggleSymptom(symptom)}
            />
          ))}
        </View>
        <TextInput
          label="Free text notes"
          placeholder="Any other observations"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </Section>

      <Section title="Context">
        <Toggle label="Malaria endemic area?" value={malariaEndemic} onChange={setMalariaEndemic} />
        <Text style={styles.inputLabel}>HIV positive?</Text>
        <SegmentedButtons
          value={hivStatus}
          onValueChange={(value) => setHivStatus(value as PatientInput['hivStatus'])}
          buttons={[
            { value: 'Positive', label: 'Yes' },
            { value: 'Negative', label: 'No' },
            { value: 'Unknown', label: 'Unknown' },
          ]}
        />
        <TextInput label="Any allergies?" placeholder="e.g. penicillin" value={allergies} onChangeText={setAllergies} />
        <Toggle label="Any antibiotics taken in last 30 days?" value={recentAntibiotics} onChange={setRecentAntibiotics} />
      </Section>

      <Button mode="contained" disabled={!canAnalyse} onPress={submit} style={styles.submit} contentStyle={styles.submitContent}>
        Analyse with Gemma 4
      </Button>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <Text style={styles.inputLabel}>{label}</Text>
      <SegmentedButtons
        value={value ? 'yes' : 'no'}
        onValueChange={(next) => onChange(next === 'yes')}
        buttons={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        style={styles.toggleButtons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 1,
    gap: 14,
    padding: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  segmentFlex: {
    flex: 1.25,
  },
  checkbox: {
    paddingHorizontal: 0,
  },
  checkboxLabel: {
    color: colors.text,
    textAlign: 'left',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inputLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  toggle: {
    gap: 8,
  },
  toggleButtons: {
    maxWidth: 260,
  },
  submit: {
    borderRadius: 10,
  },
  submitContent: {
    minHeight: 56,
  },
});
