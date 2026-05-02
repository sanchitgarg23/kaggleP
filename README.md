# RxRight — AI Antibiotic Advisor

Built for the Gemma 4 Good Hackathon (Kaggle × Google DeepMind)

## The problem
50% of antibiotics prescribed globally are inappropriate, driving antibiotic
resistance that kills 1.3M people today and is projected to kill 10M/year by 2050.
Rural health workers have no offline tool to guide prescribing decisions.

## The solution
RxRight uses Gemma 4 E4B (google/gemma-4-e4b-it on HuggingFace) to reason through
patient symptoms and recommend the correct antibiotic — or clearly say no antibiotic
is needed. It runs entirely offline on a mobile device.

## Model
- HuggingFace: https://huggingface.co/google/gemma-4-E4B-it
- HuggingFace model id from the brief: `google/gemma-4-e4b-it`
- Running locally via Ollama during development with `gemma3n:e4b` (Gemma edge 4B)
- Production target: `llama.rn` with a locally packaged Hugging Face/GGUF build for true on-device inference

The app does not call any cloud AI API. During development it talks only to the
local Ollama REST server at `http://localhost:11434`. The model service is isolated
in `src/services/gemma.ts` so the transport can be swapped to on-device inference.

## Hugging Face local model path
For a production/offline build, download the Gemma 4 E4B model from Hugging Face
on a development machine, convert or package it for the mobile inference runtime,
and ship the local artifact with the app:

```bash
hf download google/gemma-4-E4B-it --local-dir models/gemma-4-e4b-it
```

The current Expo development build keeps the same local-first architecture but
uses Ollama as the local inference server because it is faster to run and debug.

## Setup
1. Install Ollama: https://ollama.ai
2. Pull the local edge model: `ollama pull gemma3n:e4b`
3. Start Ollama: `ollama serve`
4. `npm install`
5. `npx expo start`

## Hackathon
- Competition: https://www.kaggle.com/competitions/gemma-4-good-hackathon
- Track: Health
- Deadline: May 18, 2026
# kaggleP
