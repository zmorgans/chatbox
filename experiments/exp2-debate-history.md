# Experiment #2 — Debate History Feature

## Goal
Allow users to view past debates so they can track progress and revisit feedback.

## Hypothesis
Adding a debate history view will:
- Help users learn from previous debates  
- Increase engagement by making progress visible  
- Make the app feel more “complete” and educational  

## Implementation
- Added a Debate History page/component
- Stored completed debates (topic, side, AI persona, transcript, feedback) in localStorage (or DB if available)
- Added a UI entry point to navigate to Debate History

## Test Cases

### Test 1 — Persistence
1. Run a full debate  
2. Refresh the page  
3. Open Debate History  

**Expected:** Debate appears with correct topic, side, persona, and feedback.  
**Result:** ✅ History persisted as expected.

### Test 2 — Multiple Debates
1. Complete 3 different debates  
2. Check History  

**Expected:** All 3 entries appear, in order.  
**Result:** ✅ All debates listed, selectable, and readable.

## Outcome
Users can now revisit prior debates, see how their arguments evolve, and re-read feedback.

## Decision
✅ Merged `experiment/debate-history-feature` into `main`.
