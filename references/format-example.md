# Format examples (not facts — replace with values you look up at output time)

These rows define the **format only** — replace every value with observed results; never copy them. `What it does` must reach the level of detail shown here: a one-sentence Simple plus a 2-4 sentence Detailed (including how it works, typical usage, and key caveats). One-liners do not pass. Consult this file only when you are unsure how a cell should read.

## Table 1 — Plugins & companion software (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example outer app (real name, e.g. OpenChamber) | outer app official, install bundle `resources/` + config `$HOST_CONFIG/` | nothing to call, on from launch | every time you open the workspace | Simple: the desktop workspace. Detailed: it manages projects, sessions, scheduled tasks, model preferences, and the in-page browser, and is the entry point to every host capability; it also injects a batch of `/` commands plus session and browser tools into opencode. When inventorying, treat the opencode process it hosts as ground truth. |

## Table 2 — Skills & commands each software/plugin brings (5 columns, no summary rows)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| example-skill | example plugin package `src/skills/example` | auto-triggers on intent, or `/example:skill` | when you need a particular kind of flow | Simple: one-line purpose. Detailed: expand 2-4 sentences from the real SKILL.md description, explaining what it does once it takes over and what its inputs/outputs are; it auto-triggers on matching situations in normal conversation, and can also be invoked by name. |
| /loop | example plugin registers command (dist `hooks/loop-command`) | `/loop` | when repeatedly trying until it passes | Simple: an automatic "run–verify–iterate" loop. Detailed: it first asks for the goal, success criteria, success type, and max attempts, then dispatches an executor agent to do the work and a verifier agent to check it; on failure it retries with history until it passes or attempts run out. Loop state is written to disk. |
| /example | example plugin provides the tool; command file `$OPENCODE_CONFIG/command/example.md` | `/example` | when you want to see a particular result | Simple: see some bill data for this session. Detailed: it immediately runs the background tool the plugin provides and prints the result as a table; it asks nothing and changes no config. Best glanced at when a long session ends. |

## Table 3 — Built-in commands & built-in skills (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| /undo | built-in, official TUI docs | `/undo` | when you want to take back a mistake; needs git | Simple: undo. Detailed: it reverts the last message and rolls back the file changes that message produced via Git; `/redo` restores it afterward. It is unavailable when the project is not a git repo — the most common pitfall. |
| Example builtin skill | core builtin | automatic | when you say "change the tool itself" | Simple: it only touches itself. Detailed: it follows a safety flow for changes to the tool itself, confirming in two steps before acting; everyday business-code changes do not trigger it. |

## Table 4 — Custom skills, commands, and host-injected commands (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example user-built skill | local, upstream `<repo>` `<license>`, depends on `<CLI>` | automatic, or `/example:skill` | when you need a particular kind of processing | Simple: one-line purpose. Detailed: expand 2-4 sentences from the real SKILL.md description, explaining the trigger scenario and how it works; the CLI it depends on must be installed first, or it errors at the call site. |
| /status | global custom, `$OPENCODE_CONFIG/command/status.md` | `/status` | when you want a quick status check on return | Simple: locate everything in one screen. Detailed: it collects the current branch, cleanliness, and the last 8 commits, and reads any living doc if present, then prints three sections: branch / phase / next step. It does not dig into diffs or read design docs — just a fast orientation. |
| /catch-up | host-injected, found by binary scan of `<app.asar>` | `/catch-up` | the first thing to run whenever you come back and have lost context | Simple: catch up. Detailed: it summarizes current-branch commits, PR status, and uncommitted changes into branch-aware context and gives a skimmable summary plus next steps; it is the highest-frequency command when hopping between sessions. |

## Table 5 — MCP (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| ExampleMCP | remote MCP, `mcp.example.com`, global config `opencode.jsonc:mcp`, alias `gh_example` | Agent calls it (tools `example_*` / `gh_example_*`) | when you need to look up official docs online | Simple: look things up online. Detailed: humans don't call it; the Agent invokes it automatically when it needs current docs and gets live results. The auth header contains a key, already masked. Related skill unknown. |

## Table 6 — Agents (6 columns, including Model chain)

| Name | Source | How to call | When to use | What it does | Model chain |
|---|---|---|---|---|---|
| build | built-in (primary) ✅verified | default Tab | when executing changes | Simple: the workhorse. Detailed: it is the default primary with all tools enabled, responsible for implementing requirements, editing files, and running commands; all everyday changes go through it, except planning tasks. | `<host defaultModel, look up the real value>` (single model, no chain fallback) |
| plan | built-in (primary) ✅verified | Tab switch | when you want a plan before acting | Simple: plan first. Detailed: it researches the code and gives an approach plus steps, and by default does not edit files; good for "plan before you act". | `<host defaultModel, look up the real value>` (single model, no chain fallback) |
| Example orchestrator agent | example plugin (plugin package, primary) ✅verified | auto-takeover | on any multi-step job | Simple: the foreman. Detailed: it splits work, dispatches it, and reassembles results; it only coordinates and does not write code, and stitches sub-task results into the final answer. It auto-takes-over on matching multi-step tasks and can be invoked by name. | `opencode-go/modelA → longcat/modelB → opencode/modelC` (current preset, look up); backup presets: preset2, preset3 |
| Example subagent | example plugin (plugin package, subagent) ✅verified | auto-takeover | on a particular specialized sub-task | Simple: the specialist. Detailed: it takes the specialized work the orchestrator dispatches (research / code / images, etc.), does only its part, and hands results back. | `opencode-go/modelA → longcat/modelB` (current preset, look up); backup presets: preset2, preset3 |

> Note: hidden system agents (compaction/title/summary) exist and run automatically, but are not selectable in the UI and are not listed as available rows.

## Table 7 — Host capabilities (5 columns: Name | Source | How to call | When to use | What it does)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Global behavior rules | host settings `$HOST_CONFIG/` global behavior | auto-triggers on intent | all sessions | Simple: house rules. Detailed: it sets rules for every session, e.g. verify before consulting docs, and plan-and-confirm before irreversible operations; it takes effect before every reply, with no invocation needed. |
| In-page browser | host tool | when the Agent calls it | when you need to see a logged-in page | Simple: see through your browser. Detailed: the Agent calls it as needed to open pages, read content, click, and screenshot, all carrying the user's real login state; humans don't call it. |

## Table-note style (write only when there is a risk; omit otherwise)

`Note: ExampleMCP liveness probe failed (missing command / tools/list unreachable); the auth header contains a plaintext key, already masked.`
