# Usage guide: when to use these commands/skills

> Updated 2026-09-22, based on this machine's opencode environment and active plugins (preset: jibei-factory).
> This is a second view of the 7-table inventory — the same facts, regrouped by how often you reach for them, listing only ✅available items.

## Daily (highest frequency)

**`/catch-up`** — the first thing to run every time you return to a project. It silently checks the git state (in-progress diffs, PR review status, recent commits) and tells you where you left off and how to resume. If you hop between sessions a lot, this is your highest-frequency command.

**`/compact`** — use it when a session gets long and context is about to overflow. It compresses the session history with AI so you can keep working, instead of being forced to start a fresh session and lose context.

**`/undo`** — when you misspoke or edited the wrong file, revert the last message (file changes roll back too). Use `/redo` to reverse it. Note: the project must be a git repo.

**`/new`** — when one task is done, open a clean session so old context does not pollute the next one.

## Main tools

| Command | When to use |
|---|---|
| `/deepwork` | Complex multi-phase tasks (e.g. "scaffold the project"). A deep workflow with review gates; **expensive** |
| `orchestrator` (agent) | Any multi-step task that needs splitting; it auto-takes-over, splits, dispatches, and reassembles |
| `fixer` (agent) | Executes changes once a clear spec is given; dispatched by the orchestrator |

## On demand

| Command | When to use |
|---|---|
| `/debug` | Tests are red and repeated fixes fail; do root-cause investigation before fixing |
| `/weigh` | Several options are unclear; compare trade-offs |
| `/explore` | Entering an unfamiliar codebase; a structured tour |
| `/codemap` | Wanting a hierarchical map of an unfamiliar repo; expensive |
| `/clonedeps` | Needing to read a dependency library's source internals |
| `simplify` | Behavior is settled and you only want cleaner code (no behavior change) |
| `oracle` (agent) | Needing architecture advice, complex debugging, or code review |
| `librarian` (agent) | Needing official docs or real code examples |
| `explorer` (agent) | Locating "where is X" fast |

## Periodic

| Command | When to use |
|---|---|
| `/reflect` | Once a week, to distill reusable improvements |
| `/rtk-gain` | At the end of a long session, to see how many tokens these rewrites actually saved |

## Notes

- `/new`, `/sessions`, `/undo`, and `/redo` manage file changes through git internally — the project must be a git repo.
- Skills can also be called by name (e.g. `/codemap`, `/simplify`), and they auto-trigger on intent as well.
- Expensive tools (deepwork, codemap, oracle) are only for when they are clearly needed; do not reach for them on small everyday changes.
- **MCP (websearch / context7 / grep_app / PaddleOCR-VL-1.6 / pdf-mcp) can be called by name** (e.g. "use context7"), and the Agent also invokes them when needed — that is why they are not listed under "Daily".
