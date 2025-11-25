# Experiment #4 — Popular Debate Topics Module

## Goal
Help users start debates quickly by providing pre-made popular topics.

## Hypothesis
A “Popular Topics” section will:
- Reduce friction in starting a debate  
- Increase number of debates per session  
- Help uncertain users pick a topic faster  

## Implementation
- Added a “Popular Topics” section (e.g., AI in schools, climate policy, social media bans)
- Clicking a topic auto-fills the debate prompt input
- Hooked up the “Start Debate” flow to use the selected topic

## Test Cases

### Test 1 — Click-to-Fill
1. Click a popular topic  
2. Check the debate input field  

**Expected:** Input auto-fills with that topic.  
**Result:** ✅ Works as expected.

### Test 2 — Flow to Debate
1. Click a topic  
2. Click “Start Debate”  

**Expected:** Debate launches using that topic.  
**Result:** ✅ Smooth transition to debate.

## Outcome
Users are able to start debates faster, with less hesitation about topic selection.

## Decision
✅ Merged `experiment/popular-topics-module` into `main`.
