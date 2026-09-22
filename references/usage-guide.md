# Usage-guide format reference (not facts — replace values with what you look up)

A second view derived from the 7-table inventory — same facts, by scenario/frequency, plain language. Only `✅available` items; never re-collects or invents.

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
- Skills can also be picked from `/skills` (or typed as `/skill-name`, e.g. `/codemap`, `/simplify`), and auto-trigger on intent.
- Expensive commands (deepwork, codemap, oracle) are only for when clearly needed; don't reach for them on everyday changes.

---

## Organization rules

1. Grouping: **daily → main tools → on-demand → periodic**, ordered by the user's real usage frequency.
2. Each entry: `**/command** — <when to use>. It <what it does>, so you <what you get>.` Plain language, with concrete effect.
3. Flag pitfalls: `needs git`, `expensive`, `Windows-only`, `first thing on return`.
4. Include only `✅available` items; `❌disabled`, `📦shelf-only`, and `🚫absent` never appear.
5. Derived from the 7 tables — never re-collect or invent. Same facts, different view.

## Two modes — empty project vs. non-empty project

The guide has two shapes. Decide which one applies **before** writing anything, by looking at the current project (does it already contain real work — source files, commits, docs, a stack?).

### Mode A — the project is empty (or brand new)

Write the guide exactly as the sample above: **generic, machine-level**. Describe each tool by what it is and when anyone would reach for it, in plain language. No project-specific references, because there is nothing to reference yet.

### Mode B — the project is non-empty

The user reads this while working in their project — keep it familiar but loosely coupled. The rule:

> **Adapt the framing, not the facts.**

- **Anchor the "when to use" to the project's shape, in general terms** — e.g. "this repo is a TypeScript monorepo" rather than a pinpoint path. A general anchor helps recognition; a pinpoint path goes stale.
- **Use the project's vocabulary** for the *scenario*, not the tool description. Tool facts (name, source, invocation, caveats) come from the 7 tables unchanged.
- **Do not invent project facts.** Read manifest/README/layout to learn the stack; if unsure, stay at Mode A.
- **Do not rename or re-scope the tools.** Choose better examples and familiar ordering — never changing what a tool does.
- **Keep it recognizable to a newcomer**; project flavor is seasoning, not the meal.

What changes between modes, concretely:

| | Mode A (empty project) | Mode B (non-empty project) |
|---|---|---|
| Opening line | machine-level preset/environment | same, plus one line naming the project's general shape (language / kind of repo) |
| "When to use" | general scenario | the same scenario, anchored to *this kind* of project ("when you add a cross-package dependency in this monorepo…") |
| Examples | neutral ("build the project skeleton") | drawn from the project's domain, kept generic enough to stay true ("add a new subcommand to this CLI") |
| Ordering | by universal frequency | by this project's likely frequency (e.g. a docs repo leads with writing tools, a library repo with test/refactor tools) |
| Tool facts | unchanged | **unchanged** — name, source, invoke path, caveats never change |

**Never** in Mode B: paste real paths/lines, quote private code, imply a tool is project-specific, or reorder so much it no longer matches the 7 tables.

