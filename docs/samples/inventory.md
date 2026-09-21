# Asset inventory (sample output)

> This is a **sample output** from the asset-inventory skill, showing what the final 7 tables look like.
> The data comes from one real machine (macOS/Linux paths masked), but **every row was verified**; your own machine will differ.
> The table structure is fixed: Tables 1–5 and 7 have five columns; Table 6 has six.

## Table 1 — Plugins & companion software

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| OpenChamber | outer app official, install bundle `resources/` + config `$HOST_CONFIG/` ✅verified | nothing to call, on from launch | every time you open a workspace | It is the desktop workspace you are always in — resident, no invocation needed. It manages projects, sessions, scheduled tasks, model preferences, and the built-in browser, and injects a batch of `/` commands plus session and browser tools into opencode. Use its capabilities when you want to work inside the app rather than a bare terminal. For inventory purposes, defer to the opencode process it hosts. |
| @rezamonangg/opencode-rtk | third-party plugin, `opencode.jsonc:plugin[]` ✅verified | nothing to call, active automatically | when a session grows long and you want to save tokens | As soon as it is listed in `opencode.jsonc:plugin[]` it takes effect — no command to run. It rewrites allow-listed commands through RTK, saving tokens and keeping a bill. You notice it most when switching models or roles. |
| oh-my-opencode-slim@2.2.18 | third-party plugin, `opencode.jsonc:plugin[]` ✅verified | nothing to call, active automatically | when you want to switch model chains by role | It activates once declared in the config; it brings 8 managed skills, 7 agents, and several model presets, and automatically splits and dispatches multi-step tasks. Use it when switching by role or model chain. |

## Table 2 — Skills & commands each software/plugin brings

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| simplify | oh-my-opencode-slim manages skill (skills-manifest.json, status managed, v2.2.18) ✅verified | auto-triggers on intent, or `/simplify` | when you want to simplify code without changing behavior | It triggers automatically when a request matches its description, or you call it by name with `/simplify`; once triggered it trims redundancy and improves readability without **changing behavior**. Best when the behavior is already settled and you only want cleaner code. |
| codemap | oh-my-opencode-slim manages skill (skills-manifest.json, status managed, v2.2.18) ✅verified | auto-triggers on intent, or `/codemap` | when you need a tour of an unfamiliar repo | Auto-triggers or is called by name; it builds a hierarchical map of an unfamiliar repo, marking the main modules, entry files, and module relationships. Run it first when meeting a new project — but it is expensive, so only when you genuinely need it. |
| clonedeps | oh-my-opencode-slim manages skill (skills-manifest.json, status managed, v2.2.18) ✅verified | auto-triggers on intent, or `/clonedeps` | when you need to read a dependency's source | Auto-triggers or is called by name; it clones the source of important dependencies into ignored local workspaces so you can read SDK/framework internals directly. Use it to debug library behavior or understand the underlying mechanics. |
| deepwork | oh-my-opencode-slim manages skill (skills-manifest.json, status managed, v2.2.18) ✅verified | auto-triggers on intent, or `/deepwork` | for complex multi-phase work that needs review gates | Auto-triggers or is called by name; it is a high-cost orchestrator that splits, dispatches, and reassembles work with review gates — good for large refactors or new features. **Expensive**, so use it only when clearly needed. |
| /rtk-gain | @rezamonangg/opencode-rtk registers command (dist hooks/) ✅verified | `/rtk-gain` | at the end of a long session, to see how many tokens you saved | You type `/rtk-gain`; it immediately runs the rtk_gain tool and prints a bill of the tokens saved after allow-listed commands were rewritten through RTK. It asks nothing and changes no config. Glance at it at the end of each long session. |

## Table 3 — Built-in commands & built-in skills

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| /compact | built-in, official TUI docs ✅docs | `/compact` | when a session is long and context is about to overflow | You type `/compact`; it compresses the session history with AI so you can keep working instead of being forced to start a new session and lose context. Best mid-session when context gets tight. |
| /undo | built-in, official TUI docs ✅docs | `/undo` | when you misspoke or edited the wrong file and want to revert; needs git | You type `/undo`; it reverts the last message and rolls back the file changes that message produced via Git; `/redo` reverses it. Unavailable when the project is not a git repo — the most common pitfall. |
| /new | built-in, official TUI docs ✅docs | `/new` | when one task is done and you do not want to pollute the next; needs git | You type `/new` (alias `/clear`); it opens a clean session while the old one stays available. Good when a task is finished and you want a fresh start. |

## Table 4 — Custom skills, commands, and host-injected commands

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| asset-inventory | local, upstream `github.com/sogeisetsu/asset-inventory` MIT ✅verified | auto-triggers on intent, or `/asset-inventory` | when you need to inventory this machine's opencode setup | Auto-triggers or is called by name; it scans every invocable plugin, skill, command, MCP, agent, and host capability on the machine and outputs 7 tables + JSON + a usage guide. Useful when changing machines, handing off, or when the setup is unclear. |
| /catch-up | host-injected, found by binary scan of `<app.asar>` ✅verified | `/catch-up` | the first thing to run every time you return to a project and lost context | Injected by the outer app; type `/catch-up` to run it. It summarizes the current branch's commits, PR status, and uncommitted changes into a scannable digest with a next step. When you hop between sessions, this is the highest-frequency command. |
| /debug | host-injected, found by binary scan of `<app.asar>` ✅verified | `/debug` | when tests are red and repeated fixes fail | Type `/debug` to run it; it does guided root-cause analysis and only acts once the cause is found, forbidding blind trial and error. Best when a bug resists a quick fix and you need the root cause. |

## Table 5 — MCP

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| websearch | remote MCP, `mcp.exa.ai`, global config `opencode.jsonc:mcp.websearch` ✅verified | ask by name ("use websearch"), or Agent calls it (tools `websearch_*`) | when you need live web results | Ask for it by name, and the Agent also invokes it automatically when it needs current information, returning clean text; reach for it for docs, news, or technical lookups. |
| context7 | remote MCP, `mcp.context7.com`, global config `opencode.jsonc:mcp.context7` ✅verified | ask by name ("use context7"), or Agent calls it (tools `context7_*`) | when you need up-to-date library/framework docs | Ask for it by name, and the Agent also uses it to pull current library docs instead of relying on memory; its auth header contains a key, already masked. |
| grep_app | remote MCP, `mcp.grep.app`, global config `opencode.jsonc:mcp.grep_app` ✅verified | ask by name ("use gh_grep"), or Agent calls it (tools `grep_app_*` / `gh_grep_*`) | when you want real usage in open-source code | Ask for it by name, and the Agent also searches over a million public repos for real code; good for finding how a library is actually used in production. |
| PaddleOCR-VL-1.6 | local MCP, `paddleocr_mcp.exe`, global config `opencode.jsonc:mcp.PaddleOCR-VL-1.6` ✅verified | ask by name ("use PaddleOCR-VL-1.6"), or Agent calls it (tools `PaddleOCR_VL_*`) | when you need OCR on image-based / scanned PDFs | Ask for it by name, and the Agent also uses it for OCR; PDFs with a text layer should go through text extraction first, and only text-less ones through it. |
| pdf-mcp | local MCP, `pdf-mcp` command, global config `opencode.jsonc:mcp.pdf-mcp` ✅verified | ask by name ("use pdf-mcp"), or Agent calls it (tools `pdf_*`) | when you need to read, search, or extract PDF content | Ask for it by name, and the Agent also uses it to extract text, search, and pull tables and TOCs, with a SQLite cache; read-only, no form filling or signatures. |

## Table 6 — Agents

| Name | Source | How to call | When to use | What it does | Model chain |
|---|---|---|---|---|---|
| build | built-in (primary) ✅verified | default Tab | when editing code or running commands | It is the default primary, the agent you land on with Tab, with all tools enabled; it implements requirements, edits files, and runs commands, so all everyday changes go through it except planning tasks. | `opencode-go/mimo-v2.5` (single model, no chain fallback) |
| plan | built-in (primary) ✅verified | Tab switch | when you want a plan before acting | Switch to it with Tab; it researches the code and returns an approach plus steps, and by default does not edit files — right for "plan before you act". | `opencode-go/mimo-v2.5` (single model, no chain fallback) |
| orchestrator | oh-my-opencode-slim (plugin package, primary) ✅verified | auto-takeover | any multi-step task | It auto-takes-over on matching multi-step tasks and can be invoked by name; it splits work, dispatches it, and reassembles results, coordinating only and never writing code itself, stitching sub-task results into the final answer. | `opencode-go/deepseek-v4-flash → longcat/LongCat-2.0 → opencode/big-pickle → opencode/hy3-free` (current preset jibei-factory); backup presets: openai, opencode-go |
| oracle | oh-my-opencode-slim (plugin package, subagent) ✅verified | auto-takeover | when you need architecture advice, complex debugging, or code review | Dispatched by the orchestrator on matching sub-tasks; it makes strategic technical calls, advising on architecture, debugging, and simplification, and returns conclusions only, no code. | `opencode-go/mimo-v2.5 → opencode-go/deepseek-v4-flash → opencode-go/hy3`; backup presets: openai, opencode-go |
| explorer | oh-my-opencode-slim (plugin package, subagent) ✅verified | auto-takeover | when you need to locate code fast | Dispatched by the orchestrator; it does fast code search and pattern matching to answer "where is X", read-only. | `opencode-go/hy3 → opencode/big-pickle`; backup presets: openai, opencode-go |
| librarian | oh-my-opencode-slim (plugin package, subagent) ✅verified | auto-takeover | when you need official docs or real code examples | Dispatched by the orchestrator; it looks up official docs, GitHub examples, and library internals, and brings external material back. | `longcat/LongCat-2.0 → opencode-go/hy3 → opencode/big-pickle`; backup presets: openai, opencode-go |
| fixer | oh-my-opencode-slim (plugin package, subagent) ✅verified | auto-takeover | when you need changes executed to a clear spec | Dispatched by the orchestrator; it receives full context and a task spec and executes code changes efficiently. | `longcat/LongCat-2.0 → opencode-go/mimo-v2.5 → opencode-go/deepseek-v4-flash`; backup presets: openai, opencode-go |

> Note: hidden system agents (compaction/title/summary) run automatically but cannot be selected in the UI, so they are not listed as available rows.

## Table 7 — Host capabilities

| Name | Source | How to call | When to use | What it does |
|---|---|---|---|---|
| Global behavior rules | host settings `$HOST_CONFIG/` global behavior ✅verified | auto-triggers on intent | all sessions | It applies before every reply with no invocation needed; it sets the house rules for every session, such as verify before consulting docs and plan-and-confirm before irreversible operations. Nothing to call — it is simply in effect. |
| Model-preference management | host settings `$HOST_CONFIG/` model preferences ✅verified | switch inside the app | when you want to change the default model or preset | It manages model preferences in the app UI; the change applies to later sessions. Change the default model or preset here without touching config files. |
| In-page browser | host tool ✅verified | when the Agent calls it | when you need to see a logged-in page | The Agent uses it as needed to open pages, read content, click, and screenshot, all carrying your real login state; use it when a task depends on a page only your logged-in browser can see. |

---

**Mnemonic: the three inventory questions — what it is, who brought it in, how to use it; the source must name the bringer, and a command belongs to the tool it invokes.**

Inventory time: 2026-09-22 | Preset: jibei-factory | Commands: `opencode agent list` + `opencode --pure agent list` run
Unresolved: none
Generated by asset-inventory (self-contained)
