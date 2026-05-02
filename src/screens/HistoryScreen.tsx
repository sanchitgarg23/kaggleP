import { useCallback, useLayoutEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme';
import { AssessmentRecord, RootStackParamList, Verdict } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const history = useAppStore((state) => state.history);
  const loadHistory = useAppStore((state) => state.loadHistory);
  const clearAssessmentHistory = useAppStore((state) => state.clearAssessmentHistory);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          compact
          mode="text"
          onPress={() => {
            Alert.alert('Clear history', 'Delete all saved assessments?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => void clearAssessmentHistory() },
            ]);
          }}
        >
          Clear
        </Button>
      ),
    });
  }, [clearAssessmentHistory, navigation]);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={history}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No assessments saved yet</Text>
          <Text style={styles.emptyText}>Saved recommendations will appear here for offline review.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <HistoryItem
          item={item}
          onPress={() => navigation.navigate('Result', { patient: item.patient, result: item.result, readOnly: true })}
        />
      )}
    />
  );
}

function HistoryItem({ item, onPress }: { item: AssessmentRecord; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <View style={styles.itemTop}>
        <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        <VerdictBadge verdict={item.result.verdict} />
      </View>
      <Text style={styles.complaint}>{item.patient.chiefComplaint}</Text>
      <Text style={styles.patient}>
        {item.patient.age} {item.patient.ageUnit} · {item.patient.sex}
      </Text>
    </Pressable>
  );
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const backgroundColor =
    verdict === 'ANTIBIOTIC_RECOMMENDED'
      ? colors.primary
      : verdict === 'NO_ANTIBIOTIC_MONITOR'
        ? colors.warning
        : verdict === 'NO_ANTIBIOTIC_VIRAL'
          ? colors.danger
          : colors.darkRed;

  const label =
    verdict === 'ANTIBIOTIC_RECOMMENDED'
      ? 'Antibiotic'
      : verdict === 'NO_ANTIBIOTIC_MONITOR'
        ? 'Monitor'
        : verdict === 'NO_ANTIBIOTIC_VIRAL'
          ? 'Viral'
          : 'Refer';

  return (
    <View style={[styles.verdictBadge, { backgroundColor }]}>
      <Text style={styles.verdictText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 16,
  },
  item: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 1,
    gap: 8,
    padding: 16,
  },
  itemTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  date: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
  },
  complaint: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  patient: {
    color: colors.muted,
    fontSize: 14,
  },
  verdictBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verdictText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 96,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 22,
    maxWidth: 280,
    textAlign: 'center',
  },
});
