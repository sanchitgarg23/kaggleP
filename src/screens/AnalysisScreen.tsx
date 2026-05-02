import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PulseLoader } from '../components/PulseLoader';
import { analysePatient } from '../services/gemma';
import { colors } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Analysis'>;

const steps = [
  'Checking symptom pattern...',
  'Assessing bacterial vs viral...',
  'Consulting WHO AWaRe guidelines...',
  'Calculating dose...',
];

export function AnalysisScreen({ navigation, route }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => (current + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runAnalysis() {
      const result = await analysePatient(route.params.patient);
      if (!cancelled) {
        navigation.replace('Result', { patient: route.params.patient, result });
      }
    }

    void runAnalysis();
    return () => {
      cancelled = true;
    };
  }, [navigation, route.params.patient]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <PulseLoader />
        <Text style={styles.title}>Gemma 4 is reasoning...</Text>
        <Text style={styles.subtitle}>{steps[stepIndex]}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'center',
  },
});
