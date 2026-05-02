import AsyncStorage from '@react-native-async-storage/async-storage';

import { AssessmentRecord } from '../types';

const HISTORY_KEY = '@rxright/history';

export async function getHistory(): Promise<AssessmentRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as AssessmentRecord[];
  } catch {
    return [];
  }
}

export async function saveAssessment(record: AssessmentRecord): Promise<AssessmentRecord[]> {
  const existing = await getHistory();
  const updated = [record, ...existing];
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
