# AI usage

## Summary

I used Cursor with a coding agent for this exercise: turning the brief into a
plan, resolving ambiguities, generating the React/TypeScript implementation,
tests, styles, and drafts of `README.md` / this file. I treated AI output as a
draft — I reviewed domain rules, validation, and docs before keeping them.

Main uses:

- Extract requirements and separate core behaviour from optional extras.
- Propose architecture (Vite + React + TypeScript, pure `src/domain`, reducer,
  Vitest + RTL) and ask for ambiguities before coding.
- Generate implementation, tests, and documentation.
- Iterate on UI (including the finished-matches table) and run verification
  (`npm test`, `npm run lint`, `npm run build`).

## Prompt history (honest notes)

These are reconstructed notes of the main prompts, not a full chat export.

**1. Brief as context**

Paste the full coding exercise. Ask for ambiguities only — no implementation yet.
Required: four operations, tests, responsive/accessible UI, README + AI.md.
Also note the brief’s optional extras (additional operation / larger feature).

**2. Planning answers**

- Plan first, then implement.
- Architecture: Vite + React + TS, pure domain, reducer, domain/reducer/RTL tests.
- Call out assumptions where the brief is silent; accept no backend/persistence.

**3. Ambiguities**

Ask the agent to recommend:

- How to interpret “most recently started” (`Date.now()` vs deterministic order).
- Same team in two live matches?
- Can a score decrease?
- Delete finished matches from state, or only filter them from the summary?

**4. Accepted recommendations**

- Monotonic `startedOrder` instead of `Date.now()`.
- Unique teams across live matches (case-insensitive).
- Scores may decrease (operator correction).
- Finished matches stay in state; only filtered from the live summary.

**5. Implement**

Implement the plan; do not edit the plan file after it is saved. Put larger
feature work in a separate commit when that was still in scope
(`feat: add score change history`).

**6. Verify against the brief**

Check the four operations, the five-match ordering example, domain tests beyond
the happy path, and basic accessibility (labels, roles, focus). Fix gaps.

**7. Finished matches + UI**

Add the read-only finished table (brief: “you may show finished matches
elsewhere if you like”). Keep it visually secondary to the live board. Review
semantics and mobile layout; fix only real issues.

**8. Docs**

Write README with assumptions, reasoning, and trade-offs. Write AI.md with a
short usage summary and this prompt/process history.
