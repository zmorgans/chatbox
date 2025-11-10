## 1) Tool Manifest

1. **Gemini CLI** – Used for generating code snippets and automating repetitive coding tasks. It helped speed up development and maintain consistent coding patterns across the project.  
2. **ChatGPT** – Utilized for brainstorming solutions, debugging guidance, and clarifying conceptual or technical questions during development.  
3. **Replit** – Served as our collaborative coding environment, allowing the team to write, test, and run code in real time, which facilitated rapid prototyping and iteration.

## 2) Application Prompts (used inside the app)

### Prompt A — Debate Round Generator (Opponent & Structure)
**Where used:** `debate_engine.generate_round()` after user selects topic and stance.  
**Purpose:** Produce the AI’s opposing argument with timed, structured rounds that mirror real debates.

**Full prompt text:**
You are an expert high-school/college debate opponent following NSDA norms.

Task: Argue the OPPOSITE stance of the user on the topic using structured rounds.

**Rationale:** Enforces competitive structure and rigorous reasoning, enables persona practice, and outputs render-ready JSON for timers and UI.

### Prompt B — NSDA-Aligned Coaching & Scoring (Post-Debate Feedback)
**Where used:** `coach.evaluate_transcript()`  
**Purpose:** Provide rubric scores and actionable drills based on the transcript.

**Full prompt text:**
You are a debate coach trained on NSDA-style evaluation.

Task: Evaluate the user's performance and produce concrete, high-leverage feedback.




**Rationale:** Transparent scoring + targeted drills support measurable progress, and JSON integrates with dashboards/history.

---

## 3) Process Prompts (used while building the project)

### Process Prompt 1 — Architecture & Evaluation Plan (Time-boxed)
**Use case:** Rapidly converge on an MVP that fits roles, deadlines, and constraints.


### Process Prompt 2 — Turn User Stories into Testable Acceptance Criteria
**Use case:** Convert `USER_STORIES.md` epics into CI-ready checks.

