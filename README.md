# Live Football Scoreboard

React + TypeScript app for managing several live Football World Cup matches:
start matches, update scores, finish them, and view a ranked live summary.

## Getting started

Requires Node.js 20.19+ and npm 10+.

```bash
npm install
npm run dev
```

```bash
npm test
npm run lint
npm run build
```

## Behaviour

1. **Start a match** — home and away teams; starts at 0–0 and is immediately in progress.
2. **Update the score** — non-negative whole numbers; scores may decrease so an operator can correct a bad entry.
3. **Finish a match** — removed from the live summary. Finished matches stay in memory and are listed read-only in a table below the board (the brief allows showing finished matches elsewhere).
4. **Live summary** — in-progress matches ordered by total goals (highest first); ties broken by most recently started.

## Assumptions

- “Most recently started” means the highest monotonic `startedOrder` assigned on each successful start, not wall-clock time.
- A team may appear in only one in-progress match at a time. Name comparison is case-insensitive.
- Team names are trimmed, repeated whitespace is collapsed, and capped at 50 characters. Home and away must differ.
- Scores are non-negative safe integers with no football-specific maximum.
- Finishing is a status change, not deletion. Order in the finished table is most recently started first, because the brief does not define a separate finish order.
- All state is in-memory for the current tab. Refresh clears everything; there is no backend or persistence.

## Reasoning for non-obvious choices

- **Monotonic `startedOrder` instead of `Date.now()`.** Two starts in the same tick would tie on wall-clock time and break the brief’s ordering rule. An incrementing sequence is strict and keeps tests deterministic.
- **Reject a team already in an in-progress match.** The brief is silent here. Allowing the same team twice on the live board is not a meaningful operator state, so it fails validation instead.
- **Allow scores to decrease.** The brief only says the score can be changed. Blocking decreases would stop corrections after a mistaken entry.
- **Keep finished matches in state.** Deleting on finish would be irreversible just to hide a row from the summary. Keeping the record and filtering the live view made the optional finished table cheap to add.
- **Finished matches as a plain table.** A table reads as a historical record and stays clearly separate from the interactive live cards.
- **Pure domain + single reducer.** Sorting and lifecycle rules live in `src/domain` so the brief’s five-match example can be unit-tested without React. One reducer keeps start/update/finish transitions atomic with one feedback message.

## Trade-offs accepted

- **No persistence, auth, or multi-tab sync.** State lives in one browser tab. Accepted because the brief allows in-memory state and a backend is out of scope.
- **Finished view is read-only.** No reopen/delete actions in the UI, even though the model could support them later.
- **Session-local IDs** (`match-1`, `match-2`, …). Simple for a single-session exercise; production would issue IDs from a server.
- **Both scores update together.** A typo in one field blocks submitting a valid change to the other until it is fixed.
- **Scope kept to the four operations** plus the brief’s optional finished-matches view. Earlier extras (team filter, score-change history) were removed rather than left as dead code.

## Project structure

```text
src/
├── components/   Presentational UI
├── hooks/        Form and scoreboard wiring
├── domain/       Pure match and scoreboard rules
├── state/        Reducer
├── App.tsx
└── styles.css
```
