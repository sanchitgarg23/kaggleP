import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { TreatmentCard } from '../components/TreatmentCard';
import { VerdictBanner } from '../components/VerdictBanner';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme';
import { AssessmentRecord, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation, route }: Props) {
  const { patient, result, readOnly } = route.params;
  const addAssessment = useAppStore((state) => state.addAssessment);
  const [saved, setSaved] = useState(Boolean(readOnly));
  const [snackbar, setSnackbar] = useState('');

  async function saveToHistory() {
    const record: AssessmentRecord = {
      id: `${Date.now()}`,
      timestamp: Date.now(),
      patient,
      result,
    };
    await addAssessment(record);
    setSaved(true);
    setSnackbar('Assessment saved');
  }

  function sharePdf() {
    setSnackbar('PDF export coming soon');
  }

  function newAssessment() {
    if (!saved && !readOnly) {
      Alert.alert('Unsaved assessment', 'Start a new assessment without saving this result?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start new', style: 'destructive', onPress: () => navigation.popToTop() },
      ]);
      return;
    }
    navigation.popToTop();
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <VerdictBanner verdict={result.verdict} />

        <Card title="Clinical reasoning">
          <Text style={styles.body}>{result.reasoning}</Text>
          <Text style={styles.meta}>Likely diagnosis: {result.likely_diagnosis}</Text>
          <Text style={styles.meta}>Confidence: {result.confidence}</Text>
          {!!result.refer_reason && <Text style={styles.refer}>{result.refer_reason}</Text>}
        </Card>

        {result.treatment && <TreatmentCard treatment={result.treatment} />}

        <Card title="Tell the patient">
          <BulletList items={result.patient_instructions} />
        </Card>

        <Card title="Return immediately if:">
          <BulletList items={result.red_flags} danger />
        </Card>

        <View style={styles.actions}>
          {!readOnly && (
            <Button mode="contained" disabled={saved} onPress={saveToHistory} style={styles.actionButton}>
              {saved ? 'Saved to History' : 'Save to History'}
            </Button>
          )}
          <Button mode="outlined" onPress={newAssessment} style={styles.actionButton}>
            New Assessment
          </Button>
          <Button mode="text" onPress={sharePdf}>
            Share as PDF
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={snackbar.length > 0} onDismiss={() => setSnackbar('')} duration={2200}>
        {snackbar}
      </Snackbar>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletList({ items, danger = false }: { items: string[]; danger?: boolean }) {
  if (items.length === 0) {
    return <Text style={styles.body}>No specific warning signs returned.</Text>;
  }

  return (
    <View style={styles.bullets}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={[styles.bullet, danger && styles.dangerText]}>•</Text>
          <Text style={[styles.body, danger && styles.dangerText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 1,
    gap: 10,
    marginHorizontal: 16,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  body: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  refer: {
    color: colors.darkRed,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  bullets: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 22,
  },
  dangerText: {
    color: colors.danger,
  },
  actions: {
    gap: 10,
    marginHorizontal: 16,
  },
  actionButton: {
    borderRadius: 10,
  },
});
