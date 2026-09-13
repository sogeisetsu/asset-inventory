# Inventory example (desensitized, for format reference)

> This file is an output example for the asset-inventory skill, showing the 7-table structure and the "three-part source" style.
> Example values are desensitized placeholders and do not represent any real machine; every row must be replaced with values you look up fresh per the skill rules.
> `What it does` must reach the level of detail shown here: a one-sentence Simple plus a 2-4 sentence Detailed. One-liners do not pass.

## Table 1 — Plugins & companion software

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example outer app (real name, e.g. OpenChamber) | outer app official, install bundle `resources/` + config `$HOST_CONFIG/` | nothing to call, on from launch | every time you open the workspace | Simple: the desktop workspace. Detailed: it manages projects, sessions, scheduled tasks, model preferences, and the in-page browser, and is the entry point to every host capability; it also injects a batch of `/` commands plus session and browser tools into opencode. When inventorying, treat the opencode process it hosts as ground truth. |
| example-plugin@1.0.0 | third-party plugin, `opencode.jsonc:plugin[]`, source `<repo>` MIT | nothing to call, active automatically | when switching models or roles | Simple: a foreman's team. Detailed: it brings N skills, M agents, and model presets, and auto-splits/dispatches multi-step tasks; reach for it when changing roles or model chains. |

## Table 2 — Skills & commands each software/plugin brings

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| example-skill | example plugin package `src/skills/example` | auto-triggers on intent, or `/example:skill` | when you need a particular kind of flow | Simple: one-line purpose. Detailed: expand 2-4 sentences from the real SKILL.md description, explaining what it does once it takes over and what its inputs/outputs are; it auto-triggers on matching situations, and can also be invoked by name. |
| /loop | example plugin registers command (dist `hooks/loop-command`) | `/loop` | when repeatedly trying until it passes | Simple: an automatic "run–verify–iterate" loop. Detailed: it first asks for the goal, success criteria, success type, and max attempts, then dispatches an executor agent and a verifier agent; on failure it retries with history until it passes or attempts run out. Loop state is written to disk. |
| /example | example plugin provides the tool; command file `$OPENCODE_CONFIG/command/example.md` | `/example` | when you want to see a particular result | Simple: see some bill data for this session. Detailed: it immediately runs the background tool the plugin provides and prints the result as a table; it asks nothing and changes no config. Best glanced at when a long session ends. |

## Table 3 — Built-in commands & built-in skills

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| /undo | built-in, official TUI docs | `/undo` | when you want to take back a mistake; needs git | Simple: undo. Detailed: it reverts the last message and rolls back the file changes that message produced via Git; `/redo` restores it afterward. It is unavailable when the project is not a git repo — the most common pitfall. |
| /new | built-in, official TUI docs | `/new` | when one task is done and you don't want pollution; needs git | Simple: a fresh start. Detailed: it opens a clean session, aliased `/clear`, so old context doesn't pollute the next task; the old session is kept and can be switched back to anytime. |
| Example builtin skill | core builtin | automatic | when you say "change the tool itself" | Simple: it only touches itself. Detailed: it follows a safety flow for changes to the tool itself, confirming in two steps before acting; everyday business-code changes do not trigger it. |

## Table 4 — Custom skills, custom commands, and host-injected commands

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example user-built skill | local, upstream `<repo>` `<license>`, depends on `<CLI>` | automatic, or `/example:skill` | when you need a particular kind of processing | Simple: one-line purpose. Detailed: expand 2-4 sentences from the real SKILL.md description, explaining the trigger scenario and how it works; the CLI it depends on must be installed first, or it errors at the call site. |
| /status | global custom, `$OPENCODE_CONFIG/command/status.md` | `/status` | when you want a quick status check on return | Simple: locate everything in one screen. Detailed: it collects the current branch, cleanliness, and the last 8 commits, and reads any living doc if present, then prints three sections: branch / phase / next step. It does not dig into diffs or read design docs — just a fast orientation. |
| /catch-up | host-injected, found by binary scan of `<app.asar>` | `/catch-up` | the first thing when you come back and have lost context | Simple: catch up. Detailed: it summarizes branch commits, PR status, and uncommitted changes into branch-aware context and gives a skimmable summary plus next steps; highest frequency when hopping between sessions. |
| /plan-feature | host-injected, found by binary scan of `<app.asar>` | `/plan-feature` | before you start coding a new feature | Simple: draw the map first. Detailed: it guides you to explore the codebase, clarifies requirements in batches, then outputs an implementation plan; it writes no code throughout, and you act after the plan is confirmed. |
| /craft-goal | host-injected, found by binary scan of `<app.asar>` | `/craft-goal` | when the goal is vague | Simple: sharpen the goal. Detailed: it turns vague ideas and tasks into a clear, verifiable Goal through multiple rounds of guidance, ready to hand to an executor. |
| /workspace-review | host-injected, found by binary scan of `<app.asar>` | `/workspace-review` | after changes, before committing | Simple: review the changes. Detailed: it reviews whether the workspace diff meets the bar, is correct, and is reasonable, and outputs by severity; good for a self-check before committing. |
| /weigh | host-injected, found by binary scan of `<app.asar>` | `/weigh` | when two options are deadlocked | Simple: lay out the trade-offs. Detailed: it checks the code first, then gives 2-3 options with trade-offs and a recommendation; conclusions only — no plan, no code. |
| /debug | host-injected, found by binary scan of `<app.asar>` | `/debug` | when tests are red and won't fix | Simple: find the root cause. Detailed: it does guided root-cause analysis and fixes only after locating the cause, forbidding blind trial-and-error; use it when a fix fails repeatedly. |
| /summary | host-injected, found by binary scan of `<app.asar>` | `/summary` | when you need a handoff | Simple: write a handoff. Detailed: it outputs a non-destructive session summary without compressing history, for handing off to a person or a new session; the original session is unaffected. |
| /explore | host-injected, found by binary scan of `<app.asar>` | `/explore` | when entering an unfamiliar directory | Simple: a tour. Detailed: it explains the repo's layout, main modules, and module relationships, and points out where to start reading; the first thing to run in an unfamiliar project. |

## Table 5 — MCP

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| ExampleMCP | remote MCP, `mcp.example.com`, global config `opencode.jsonc:mcp` | Agent calls it | when you need to look up official docs online | Simple: look things up online. Detailed: humans don't call it; the Agent invokes it automatically when it needs current docs. The auth header contains a key, already masked. Related skill unknown. |
| Example local MCP | local MCP, `example-mcp` command | Agent calls it | when you need local capabilities | Simple: a local tool. Detailed: it wraps local commands as tools the Agent can call, triggered automatically when that local capability is needed; a missing command makes the call fail. Related skill unknown. |

## Table 6 — Agents

| Name | Source | How to call | When to use | What it does | Model chain |
|---|---|---|---|---|---|
| build | built-in (primary) ✅verified | default Tab | when executing changes | Simple: the workhorse. Detailed: it is the default primary with all tools enabled, responsible for implementing requirements, editing files, and running commands; all everyday changes go through it, except planning tasks. | `<host defaultModel, look up the real value>` (single model, no chain fallback) |
| Example agent | example plugin (plugin package) ✅verified | auto-takeover | on any multi-step job | Simple: the foreman. Detailed: it splits work, dispatches it, and reassembles results; it only coordinates and does not write code, and stitches sub-task results into the final answer. It auto-takes-over on matching multi-step tasks and can be invoked by name. | `opencode-go/modelA → longcat/modelB → opencode/modelC` (current preset, look up); backup presets: preset2, preset3 |

> Note: hidden system agents (compaction/title/summary) exist and run automatically, but are not selectable in the UI and are not listed as available rows.

## Table 7 — Host capabilities

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Global behavior rules | host settings `$HOST_CONFIG/` global behavior | auto-triggers on intent | all sessions | Simple: house rules. Detailed: it sets rules for every session, e.g. verify before consulting docs, and plan-and-confirm before irreversible operations; it takes effect before every reply, with no invocation needed. |
| In-page browser | host tool | when the Agent calls it | when you need to see a logged-in page | Simple: see through your browser. Detailed: the Agent calls it as needed to open pages, read content, click, and screenshot, all carrying the user's real login state; humans don't call it. |

---

**Mnemonic: the three inventory questions — what it is, who brought it, how to use it; always name the specific bringer, and a command belongs to whoever owns the tool it invokes.**
