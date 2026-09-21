# Format examples (not facts — replace with values you look up at output time)

These rows define the **format only** — replace every value with observed results; never copy them. Example values are desensitized placeholders and do not represent any real machine. `What it does` must be **one detailed paragraph** — never a `Simple: … Detailed: …` split, never a one-liner — answering: how it is invoked, when to use it, and what happens after (with caveats). Consult this file only when you are unsure how a cell should read.

> This single file is both the format reference and the desensitized output example. Row counts are illustrative — a real run has as many rows as the machine actually has.

## Table 1 — Plugins & companion software (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example outer app (real name, e.g. OpenChamber) | outer app official, install bundle `resources/` + config `$HOST_CONFIG/` | nothing to call, on from launch | every time you open the workspace | It is the desktop workspace you already have open — it runs the whole time, so there is nothing to invoke; it manages projects, sessions, scheduled tasks, model preferences, and the in-page browser, and it injects a batch of `/` commands plus session and browser tools into opencode. Reach for its features whenever you are working in the app rather than the raw terminal. When inventorying, treat the opencode process it hosts as ground truth. |
| example-plugin@1.0.0 | third-party plugin, `opencode.jsonc:plugin[]`, source `<repo>` MIT | nothing to call, active automatically | when switching models or roles | It activates automatically once listed in `opencode.jsonc:plugin[]` — there is no command to run; it brings N skills, M agents, and model presets, and auto-splits and dispatches multi-step tasks. Reach for it when you change roles or model chains. |

## Table 2 — Skills & commands each software/plugin brings (5 columns, no summary rows)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| example-skill | example plugin package `src/skills/example` | auto-triggers on intent, or `/example:skill` | when you need a particular kind of flow | It triggers automatically when your request matches its description, and can also be invoked by name as `/example:skill`; once it takes over it runs the flow it describes and produces its own outputs. Reach for it when you need that particular kind of flow rather than doing it by hand. |
| /loop | example plugin registers command (dist `hooks/loop-command`) | `/loop` | when repeatedly trying until it passes | You type `/loop`; it first asks for the goal, success criteria, success type, and max attempts, then dispatches an executor agent to do the work and a verifier agent to check it, retrying with history on failure until it passes or attempts run out. Loop state is written to disk, so use it when you want a run–verify–iterate cycle rather than a single attempt. |
| /example | example plugin provides the tool; command file `$OPENCODE_CONFIG/command/example.md` | `/example` | when you want to see a particular result | You type `/example`; it immediately runs the background tool the plugin provides and prints the result as a table, asking nothing and changing no config. Best glanced at when a long session ends and you want to confirm the tool did what you expected. |

## Table 3 — Built-in commands & built-in skills (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| /undo | built-in, official TUI docs | `/undo` | when you want to take back a mistake; needs git | You type `/undo`; it reverts the last message and rolls back the file changes that message produced via Git, and `/redo` restores it afterward. Use it the moment you sent a bad message or edited the wrong file — it is unavailable when the project is not a git repo, which is the most common pitfall. |
| /new | built-in, official TUI docs | `/new` | when one task is done and you don't want pollution; needs git | You type `/new` (aliased `/clear`); it opens a clean session so old context does not pollute the next task, while the old session is kept and can be switched back to anytime. Use it when one task is finished and you want a fresh start. |
| Example builtin skill | core builtin | automatic | when you say "change the tool itself" | It runs automatically only when you are changing the tool itself; it then follows a safety flow that confirms in two steps before acting. Everyday business-code changes do not trigger it. |

## Table 4 — Custom skills, commands, and host-injected commands (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Example user-built skill | local, upstream `<repo>` `<license>`, depends on `<CLI>` | automatic, or `/example:skill` | when you need a particular kind of processing | It triggers automatically on matching requests and can also be invoked by name; it performs the processing it describes and returns its result. The CLI it depends on must be installed first, or it errors at the call site. |
| /status | global custom, `$OPENCODE_CONFIG/command/status.md` | `/status` | when you want a quick status check on return | You type `/status`; it collects the current branch, cleanliness, and the last 8 commits, reads any living doc if present, then prints three sections — branch, phase, and next step. Use it when you come back to a project and want a fast orientation: it does not dig into diffs or read design docs. |
| /catch-up | host-injected, found by binary scan of `<app.asar>` | `/catch-up` | the first thing to run whenever you come back and have lost context | It is injected by the host app and runs on `/catch-up`; it summarizes current-branch commits, PR status, and uncommitted changes into branch-aware context and gives a skimmable summary plus next steps. It is the highest-frequency command when you hop between sessions and have lost the thread. |
| /plan-feature | host-injected, found by binary scan of `<app.asar>` | `/plan-feature` | before you start coding a new feature | It runs on `/plan-feature`; it guides you to explore the codebase, clarifies requirements in batches, then outputs an implementation plan, writing no code throughout. Use it before you start building so you act only after the plan is confirmed. |
| /craft-goal | host-injected, found by binary scan of `<app.asar>` | `/craft-goal` | when the goal is vague | It runs on `/craft-goal`; through multiple rounds of guidance it turns vague ideas and tasks into a clear, verifiable Goal ready to hand to an executor. Use it when you know roughly what you want but cannot state it precisely. |
| /workspace-review | host-injected, found by binary scan of `<app.asar>` | `/workspace-review` | after changes, before committing | It runs on `/workspace-review`; it reviews whether the workspace diff meets the bar, is correct, and is reasonable, and outputs findings by severity. Use it as a self-check after making changes and before you commit. |
| /weigh | host-injected, found by binary scan of `<app.asar>` | `/weigh` | when two options are deadlocked | It runs on `/weigh`; it checks the code first, then gives 2-3 options with trade-offs and a recommendation, offering conclusions only — no plan and no code. Use it when you are stuck between approaches and want the trade-offs laid out. |
| /debug | host-injected, found by binary scan of `<app.asar>` | `/debug` | when tests are red and won't fix | It runs on `/debug`; it performs guided root-cause analysis and fixes only after locating the cause, forbidding blind trial-and-error. Use it when a fix fails repeatedly and you need the root cause rather than another guess. |
| /summary | host-injected, found by binary scan of `<app.asar>` | `/summary` | when you need a handoff | It runs on `/summary`; it outputs a non-destructive session summary without compressing history, so the original session is unaffected. Use it when handing off to a person or starting a new session that needs the context. |
| /explore | host-injected, found by binary scan of `<app.asar>` | `/explore` | when entering an unfamiliar directory | It runs on `/explore`; it explains the repo's layout, main modules, and module relationships, and points out where to start reading. Use it as the first thing to run in an unfamiliar project. |

## Table 5 — MCP (5 columns)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| ExampleMCP | remote MCP, `mcp.example.com`, global config `opencode.jsonc:mcp`, alias `gh_example` | ask by name (`` `use ExampleMCP` ``) or Agent calls it (tools `example_*` / `gh_example_*`) | when you need to look up official docs online | Ask for it by name, or let the Agent invoke it when it needs current docs and live results, exposed under the tool names `example_*` / `gh_example_*`; its auth header contains a key, already masked. Related skill unknown. |
| Example local MCP | local MCP, `example-mcp` command | ask by name (`` `use example-mcp` ``) or Agent calls it (tools `example_*`) | when you need local capabilities | Ask for it by name, or let the Agent invoke it when a local capability is needed; it wraps local commands as tools and a missing command makes the call fail. Related skill unknown. |

## Table 6 — Agents (6 columns, including Model chain)

| Name | Source | How to call | When to use | What it does | Model chain |
|---|---|---|---|---|---|
| build | built-in (primary) ✅verified | default Tab | when executing changes | It is the default primary agent you land on with the Tab switch, and it has all tools enabled; it implements requirements, edits files, and runs commands, so all everyday changes go through it except planning tasks. | `<host defaultModel, look up the real value>` (single model, no chain fallback) |
| plan | built-in (primary) ✅verified | Tab switch | when you want a plan before acting | You reach it by switching with Tab; it researches the code and returns an approach plus steps, and by default does not edit files, which makes it right for "plan before you act". | `<host defaultModel, look up the real value>` (single model, no chain fallback) |
| Example orchestrator agent | example plugin (plugin package, primary) ✅verified | auto-takeover | on any multi-step job | It auto-takes-over on matching multi-step tasks and can be invoked by name; it splits work, dispatches it, and reassembles results, coordinating only and never writing code itself, and stitches sub-task results into the final answer. | `opencode-go/modelA → longcat/modelB → opencode/modelC` (current preset, look up); backup presets: preset2, preset3 |
| Example subagent | example plugin (plugin package, subagent) ✅verified | auto-takeover | on a particular specialized sub-task | It is dispatched automatically by the orchestrator on matching sub-tasks; it takes the specialized work (research / code / images, etc.), does only its part, and hands results back. | `opencode-go/modelA → longcat/modelB` (current preset, look up); backup presets: preset2, preset3 |

> Note: hidden system agents (compaction/title/summary) exist and run automatically, but are not selectable in the UI and are not listed as available rows.

## Table 7 — Host capabilities (5 columns: Name | Source | How to call | When to use | What it does)

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Global behavior rules | host settings `$HOST_CONFIG/` global behavior | auto-triggers on intent | all sessions | It applies before every reply with no invocation needed; it sets the house rules for every session, such as verify before consulting docs and plan-and-confirm before irreversible operations. Nothing to call — it is simply in effect. |
| In-page browser | host tool | when the Agent calls it | when you need to see a logged-in page | The Agent uses it as needed to open pages, read content, click, and screenshot, all carrying the user's real login state. Reach for it when a task depends on a page that only your logged-in browser can see. |

## Table-note style (write only when there is a risk; omit otherwise)

`Note: ExampleMCP liveness probe failed (missing command / tools/list unreachable); the auth header contains a plaintext key, already masked.`

---

**Mnemonic: the three inventory questions — what it is, who brought it, how to use it; always name the specific bringer, and a command belongs to whoever owns the tool it invokes.**
