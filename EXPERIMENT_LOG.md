Experiment #1: Gemini API Integration for Higher-Quality Responses

Git Branch: experiment/gemini-api-integration

Hypothesis:
Integrating Gemini as our primary model would significantly improve the accuracy, depth, and persona-consistency of debate responses.

Method:
We added the Gemini API key to environment variables, rewrote the backend handler to call the Gemini model, updated token formatting, and refactored the frontend debate flow to use the new route.

Evaluation:

Before: Responses were short, generic, occasionally off-topic, and often ignored persona instructions.

After: Gemini produced structured arguments, followed persona tone consistently, and generated clearer rebuttals and improved feedback.

Example:

Old model: “I disagree, but here’s why…”

Gemini: Multi-paragraph, persona-matching arguments with clear structure and rhetorical strategy.

Decision:
✅ Merged into main due to noticeable improvement in debate quality and reliability.

---
Experiment #2: Debate History Logging & Retrieval

Git Branch: experiment/debate-history-feature

Hypothesis:
A persistent debate history page would help users track their progress, revisit past debates, and improve overall learning outcomes.

Method:
We created a standalone History page/component, implemented a localStorage-based logging system, and ensured every completed debate session stored the prompt, persona, transcript, and feedback.

Evaluation:

Before: No persistence; debates disappeared after a refresh.

After: Users could view all past debates, scroll through transcripts, and review feedback at any time.

Testing:

Completed 3 debates → all appeared with accurate metadata.

Refreshed the page → history remained intact.

Decision:
✅ Merged into main because it improved user retention, usability, and educational value.

---
Experiment #3: Persona Selection for AI Debater

Git Branch: experiment/ai-persona-feature

Hypothesis:
Allowing users to select an AI persona (Aggressive, Logical Scholar, Emotional Advocate, etc.) would make debates more engaging, realistic, and personalized.

Method:
We added a persona dropdown UI, injected persona-specific instructions into the system prompt, and updated the debate logic to store the selected persona in history and display it in results.

Evaluation:
Persona testing demonstrated significant behavioral differences:

Aggressive: Confrontational, sharp counterpoints

Logical Scholar: Structured reasoning, clear logic chain

Emotional Advocate: Value-driven, narrative-heavy

Neutral: Calm, balanced tone

Before: All responses had a uniform tone.
After: Tone, structure, and rhetorical strategy varied strongly by persona.

Decision:
✅ Merged into main due to major enhancements in engagement and realism.

---
Experiment #4: Popular Debate Topics Module

Git Branch: experiment/popular-topics-module

Hypothesis:
Providing a set of popular, pre-written debate topics would reduce user friction, increase the number of debates started, and help users unfamiliar with debate topics.

Method:
We added a “Popular Topics” section with clickable prompts that automatically fill the debate input form and launch a debate session.

Evaluation:

Clicking a topic instantly filled the argument input.

Users started debates faster, especially first-time users.

The feature made the app feel more polished and beginner-friendly.

Before: Some users hesitated because they couldn’t think of a topic.
After: Debates launched smoothly within seconds.

Decision:
✅ Merged into main because it improved usability and onboarding dramatically.

---
Experiment #5: API-Based Feedback System (Advanced Feature – Basic Agent)

Git Branch: experiment/improved-feedback-system

Hypothesis:
Integrating an external evaluation API as a “tool” would create more objective, structured, and actionable debate feedback compared to pure LLM prompting. This would effectively give the system basic agent-like capabilities.

Method:

Integrated an external API that specializes in evaluating argument structure and reasoning.

Sent debate transcripts and user arguments to the API.

Parsed returned JSON into categories:

Strengths

Weaknesses

Logical issues

Suggestions for improvement

Refactored the backend to support asynchronous API calls.

Stored feedback results in Debate History.

Evaluation:
Before:

LLM-generated feedback was vague, repetitive, or overly general.

Example: “Try adding more detail to your argument.”

After:

API returned consistent, structured feedback.

Example:

“Your economic claim lacks causal evidence.”

“You did not address the opponent’s point regarding public safety.”

“Your introduction was strong, but the middle lacked support.”

Feedback became more objective and much clearer for users to learn from.

Decision:
✅ Merged into main.
This qualifies as our Advanced Feature under “Basic Agent with external tool use.”

Advanced Feature Declaration (A-Level Requirement)
✔ Advanced Feature Implemented:

Basic Agent Using an External API for Structured Feedback

Experiment #5 demonstrates that the system can intelligently call an external tool and incorporate its output into the app’s functionality. This satisfies the “Agent with Tools” category for the exemplary grade.

Summary

Across five controlled experiments, we significantly improved the AI Debate Partner by:

Integrating a stronger LLM (Gemini)

Adding persistent debate history

Introducing customizable debate personas

Reducing user friction with popular topics

Implementing a tool-using, API-driven feedback system (Advanced Feature)

These experiments collectively enhanced user experience, debate quality, app robustness, and educational value.
