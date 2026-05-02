import { create } from 'zustand';

import { AssessmentRecord } from '../types';
import { clearHistory, getHistory, saveAssessment } from '../services/storage';

interface AppState {
  history: AssessmentRecord[];
  isOllamaOnline: boolean;
  setOllamaOnline: (online: boolean) => void;
  loadHistory: () => Promise<void>;
  addAssessment: (record: AssessmentRecord) => Promise<void>;
  clearAssessmentHistory: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  history: [],
  isOllamaOnline: false,
  setOllamaOnline: (online) => set({ isOllamaOnline: online }),
  loadHistory: async () => {
    const history = await getHistory();
    set({ history });
  },
  addAssessment: async (record) => {
    const history = await saveAssessment(record);
    set({ history });
  },
  clearAssessmentHistory: async () => {
    await clearHistory();
    set({ history: [] });
  },
}));
