# Experiment #3 — AI Persona Selection

## Goal
Let users choose an AI persona (e.g., Aggressive, Logical Scholar, Emotional) to change how the AI debates.

## Hypothesis
If users can select a persona, debates will feel:
- More engaging  
- More realistic  
- Better aligned with the user’s practice goals  

## Implementation
- Added a persona dropdown (e.g., Neutral, Aggressive, Logical Scholar, Emotional Advocate)
- Injected the selected persona into the system prompt / model instructions
- Ensured the persona is logged with the debate (for history/feedback)

## Test Cases

### Test 1 — Aggressive Persona
**Persona:** Aggressive  
**Observation:** AI uses sharper language, pushes back strongly, challenges claims directly.

### Test 2 — Logical Scholar Persona
**Persona:** Logical Scholar  
**Observation:** AI structures responses with clear reasoning, sometimes referencing evidence or frameworks, calmer tone.

### Test 3 — Emotional Persona
**Persona:** Emotional Advocate  
**Observation:** AI leans into narrative, values, and emotional appeal more than pure logic.

## Outcome
Persona meaningfully changes tone and style, making practice more varied and customizable.

## Decision
✅ Merged `experiment/ai-persona-feature` into `main`.
