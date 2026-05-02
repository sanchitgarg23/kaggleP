import axios from 'axios';

import { GemmaResponse, PatientInput } from '../types';

export const OLLAMA_BASE = 'http://localhost:11434';
const MODEL = 'gemma3n:e4b';

export const SYSTEM_PROMPT = `You are RxRight, an offline clinical decision support tool built for health workers in low-resource settings. You follow WHO Essential Medicines guidelines and the WHO AWaRe antibiotic classification framework strictly.

Your job is to reason through a patient presentation and recommend whether an antibiotic is needed, and if so, which one.

CRITICAL RULES:
1. Always determine first: is this likely BACTERIAL, VIRAL, or PARASITIC/OTHER?
2. Never recommend an antibiotic for a viral infection.
3. Always recommend an AWaRe ACCESS antibiotic as first choice. Only use WATCH antibiotics if there is a clear specific indication. Never recommend RESERVE antibiotics.
4. Always recommend the correct dose by weight if weight is provided. If not, use standard adult or paediatric dosing by age.
5. If the presentation has ANY red flag signs (difficulty breathing, altered consciousness, infant under 3 months with fever, meningism, severe dehydration), output REFER_IMMEDIATELY and do not recommend treatment.
6. Your reasoning must be in plain language understandable to a health worker with basic training, not a doctor.

RESPONSE FORMAT — you must respond in this exact JSON structure and nothing else:

{
  "verdict": "ANTIBIOTIC_RECOMMENDED" | "NO_ANTIBIOTIC_VIRAL" | "NO_ANTIBIOTIC_MONITOR" | "REFER_IMMEDIATELY",
  "confidence": "high" | "moderate" | "low",
  "likely_diagnosis": "brief description e.g. Uncomplicated urinary tract infection",
  "likely_cause": "bacterial" | "viral" | "parasitic" | "unclear",
  "reasoning": "2-4 sentence plain language explanation of why you reached this conclusion",
  "treatment": {
    "drug_name": "e.g. Amoxicillin",
    "aware_category": "ACCESS" | "WATCH" | "RESERVE",
    "dose": "e.g. 500mg",
    "frequency": "e.g. Three times daily",
    "duration": "e.g. 7 days",
    "route": "e.g. Oral",
    "weight_based_note": "e.g. Based on 20kg: 40mg/kg/day = 800mg/day, given as 250mg three times daily",
    "why_not_stronger": "brief explanation of AWaRe stewardship reasoning"
  },
  "patient_instructions": ["instruction 1", "instruction 2", "instruction 3"],
  "red_flags": ["flag 1", "flag 2"],
  "refer_reason": "only if verdict is REFER_IMMEDIATELY — explain why"
}

If verdict is NO_ANTIBIOTIC_VIRAL or NO_ANTIBIOTIC_MONITOR, the treatment object should be null.`;

export async function checkOllamaStatus(): Promise<boolean> {
  try {
    await axios.get(`${OLLAMA_BASE}/api/tags`, { timeout: 1500 });
    return true;
  } catch {
    return false;
  }
}

export async function analysePatient(patientData: PatientInput): Promise<GemmaResponse> {
  const userMessage = buildUserMessage(patientData);

  const response = await axios.post(`${OLLAMA_BASE}/api/chat`, {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    stream: false,
    options: {
      temperature: 0.1,
      top_p: 0.9,
      num_predict: 1200,
    },
  });

  const raw = response.data.message.content;
  return parseGemmaResponse(raw);
}

export function buildUserMessage(p: PatientInput): string {
  return `
Patient: ${p.age} ${p.ageUnit} old ${p.sex}${p.weight ? `, ${p.weight}kg` : ''}${p.pregnant ? ', pregnant' : ''}
Chief complaint: ${p.chiefComplaint}
Duration: ${p.duration} ${p.durationUnit}
Fever: ${p.hasFever ? `Yes, ${p.temperature}°C` : 'No'}
Additional symptoms: ${p.additionalSymptoms.length > 0 ? p.additionalSymptoms.join(', ') : 'None'}
Extra notes: ${p.notes || 'None'}
Malaria endemic area: ${p.malariaEndemic ? 'Yes' : 'No'}
HIV status: ${p.hivStatus}
Allergies: ${p.allergies || 'None known'}
Recent antibiotics (last 30 days): ${p.recentAntibiotics ? 'Yes' : 'No'}

Analyse this presentation and respond only in the JSON format specified.
  `.trim();
}

export function parseGemmaResponse(raw: string): GemmaResponse {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as GemmaResponse;
    if (!parsed.verdict || !parsed.reasoning) {
      return fallbackResponse();
    }
    return parsed;
  } catch {
    return fallbackResponse();
  }
}

function fallbackResponse(): GemmaResponse {
  return {
    verdict: 'REFER_IMMEDIATELY',
    confidence: 'low',
    likely_diagnosis: 'Unable to analyse — please consult a clinician',
    likely_cause: 'unclear',
    reasoning: 'The AI was unable to process this presentation reliably. Please refer to a trained clinician.',
    treatment: null,
    patient_instructions: ['Please see a doctor or trained nurse as soon as possible.'],
    red_flags: [],
    refer_reason: 'AI analysis failed — clinical safety default.',
  };
}
