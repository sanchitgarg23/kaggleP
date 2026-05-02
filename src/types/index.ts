export interface PatientInput {
  age: number;
  ageUnit: 'years' | 'months';
  sex: 'Male' | 'Female';
  weight?: number;
  pregnant: boolean;
  chiefComplaint: string;
  duration: number;
  durationUnit: 'days' | 'weeks';
  hasFever: boolean;
  temperature?: number;
  additionalSymptoms: string[];
  notes?: string;
  malariaEndemic: boolean;
  hivStatus: 'Positive' | 'Negative' | 'Unknown';
  allergies?: string;
  recentAntibiotics: boolean;
}

export type Verdict =
  | 'ANTIBIOTIC_RECOMMENDED'
  | 'NO_ANTIBIOTIC_VIRAL'
  | 'NO_ANTIBIOTIC_MONITOR'
  | 'REFER_IMMEDIATELY';

export interface GemmaResponse {
  verdict: Verdict;
  confidence: 'high' | 'moderate' | 'low';
  likely_diagnosis: string;
  likely_cause: 'bacterial' | 'viral' | 'parasitic' | 'unclear';
  reasoning: string;
  treatment: {
    drug_name: string;
    aware_category: 'ACCESS' | 'WATCH' | 'RESERVE';
    dose: string;
    frequency: string;
    duration: string;
    route: string;
    weight_based_note?: string;
    why_not_stronger: string;
  } | null;
  patient_instructions: string[];
  red_flags: string[];
  refer_reason?: string;
}

export interface AssessmentRecord {
  id: string;
  timestamp: number;
  patient: PatientInput;
  result: GemmaResponse;
}

export type RootStackParamList = {
  Home: undefined;
  Assessment: undefined;
  Analysis: { patient: PatientInput };
  Result: { patient: PatientInput; result: GemmaResponse; readOnly?: boolean };
  History: undefined;
};
