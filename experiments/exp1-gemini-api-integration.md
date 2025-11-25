# Experiment #1 — Gemini API Integration

## Goal
Integrate the Gemini API into the AI Debate Partner to improve answer quality, consistency, and persona-following behavior.

## Hypothesis
Switching to Gemini as the primary model will:
- Produce more coherent, detailed responses  
- Follow persona instructions more reliably  
- Improve feedback quality on arguments  

## Implementation
- Added a Gemini API key to environment variables
- Updated the backend route to call Gemini instead of the previous model
- Passed persona + debate context into the Gemini prompt
- Wired the frontend debate flow to use the new backend endpoint

## Test Cases

### Test 1 — Complex Debate Prompt
**Prompt:** “Should governments ban TikTok due to data privacy concerns?”  
- Old model: Short, generic answer; weak structure  
- Gemini: Multi-paragraph response, clear structure, addresses both sides, follows chosen persona tone

### Test 2 — Persona Compliance
**Persona:** “Aggressive Debater”  
- Old model: Tone doesn’t really change  
- Gemini: More confrontational language, strong claims, clearly argumentative

## Outcome
Gemini produced more structured, relevant, and persona-aware responses across multiple tests.

## Decision
✅ Merged `experiment/gemini-api-integration` into `main`.
