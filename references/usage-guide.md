# Usage-guide format reference (not facts — replace values with what you look up)

`usage-guide.md` is a **second view derived from** the 7-table inventory — the same facts, reorganized by user scenario/frequency, in plain language: "when to use it, and why". It includes only `✅available` items and never re-collects or invents. Below is a format sample.

---

# Usage guide: when to use these commands/skills

> Updated <lookup date>, based on this machine's opencode environment and currently active plugins (preset name: <look up>).

## Daily (highest frequency)

**`/catch-up`** — the first thing to run every time you return to a project. It silently checks the git state (in-progress diffs, PR review status, recent commits) and tells you "where you left off and how to resume". If you hop between sessions a lot, this is your highest-frequency command.

**`/compact`** — use it when a session gets long and context is about to overflow. It compresses the session history with AI so you can keep working, instead of being forced to start a fresh session and lose context.

**`/undo`** — take back the last message when you said the wrong thing or edited the wrong file (file changes roll back too). Use `/redo` to redo. Note: requires the project to be a git repo.

**`/new`** — start a clean session once one task is done, so old context doesn't pollute the next task.

## Main tools

| Command | When to use |
| --- | --- |
| `/deepwork` | Complex multi-phase tasks (e.g. "build the project skeleton"). A deep workflow with review gates; expensive |
| `/loop` | Repeatedly trying until it passes ("fix until the tests are all green, max 3 attempts"). Auto-dispatches a fixer to iterate |

## On demand

| Command | When to use |
| --- | --- |
| `/plan-feature` | Plan before building a new feature; guides exploration of the codebase, then produces an approach |
| `/debug` | When a bug won't fix; do root-cause investigation before fixing |
| `/weigh` | When several options are unclear; compare trade-offs |
| `/explore` | When unfamiliar with a codebase; a structured tour |
| `/craft-goal` | When the goal is vague; sharpen it into a clear, verifiable Goal |

## Periodic

| Command | When to use |
| --- | --- |
| `/reflect` | Review once a week and distill reusable improvements |

## Notes

- `/new`, `/sessions`, `/undo`, and `/redo` manage file changes via git internally, so the project must be a git repo.
- Skills can also be invoked as `/skill-name` (e.g. `/codemap`, `/simplify`), and auto-trigger on intent.
- Expensive commands (deepwork, codemap, oracle) are only for when clearly needed; don't reach for them on everyday changes.

---

## Organization rules

1. Grouping: **daily → main tools → on-demand → periodic**, ordered by the user's real usage frequency.
2. Each entry: `**/command** — <when to use>. It <what it does>, so you <what you get>.` Plain language, with concrete effect.
3. Flag pitfalls: `needs git`, `expensive`, `Windows-only`, `first thing on return`.
4. Include only `✅available` items; `❌disabled`, `📦shelf-only`, and `🚫absent` never appear.
5. It may be derived from the 7 tables, but **never re-collect evidence and never invent** — the same facts, a different view.
