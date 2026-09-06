---
name: asset-inventory
description: Inventory every plugin, companion app, skill, command, MCP server, agent, and host capability on this machine's OpenCode/OpenChamber setup, with provenance for each item. Use when the user asks "列一下我有什么插件/Skill/命令/MCP/Agent"、"哪个被禁用了"、"谁带进来的"、"能不能删/删了会怎样", or wants a migration/onboarding checklist. Outputs 7 tables plus a machine-readable JSON file. Never invent assets, versions, or model names — verify everything on this machine.
license: MIT
metadata:
  audience: opencode-users
  workflow: inventory
---

# Asset Inventory

Inventory what this machine can **actually invoke** — not what files exist on disk. Every row answers three questions: **是什么、谁带来的、能不能删/删了会怎样**.

## Dual Output

Every run produces **two files** from the same evidence (no double collection):

1. **`inventory.md`** — the encyclopedia: 7 tables (below), what each asset is.
2. **`usage-guide.md`** — the how-to-use guide: reorganizes the same inventory by **user scenarios and frequency**, in plain language, telling the user **when to reach for each command/skill and why**. Format reference: `references/usage-guide.md`. This is a second *view* of the same facts — never re-collect or invent new ones.

The Rule below describes the `inventory.md` tables; the Usage Guide section describes how to derive `usage-guide.md` from them.

## The Rule

Produce **7 tables**. Tables 1-5 and 7 have **5 columns** (`名称｜来源｜怎么叫｜何时用｜干什么`); **表6 Agent has 6 columns** (`名称｜来源｜怎么叫｜何时用｜干什么｜模型链`).

1. **表1 插件与配套软件** — the software/plugins themselves (host, plugins, companion apps). One row per software.
2. **表2 各软件/插件带来的 Skill 与命令** — grouped by owning software: one summary row, then one row per skill/command. A command belongs to whoever provides its *function* (调谁的工具归谁) — `/rtk-gain` → `@rezamonangg/opencode-rtk`, file location as a detail.
3. **表3 原生命令与原生 Skill** — **ALL built-in TUI commands** (verify against `opencode.ai/docs/tui`: `/connect /compact /details /editor /exit /export /help /init /models /new /redo /sessions /share /unshare /themes /thinking /undo` + docs list) and built-in skills. If none, empty-table declaration.
4. **表4 自定义 Skill、命令与宿主注入命令** — user-created skills (upstream + deps), user commands, **and host-injected commands** (source `宿主平台注入`). Each expanded, never merged. **This skill itself MUST appear here.**
5. **表5 MCP** — every MCP server (global + project), local/remote, enabled state, auth-masking state. User-built MCPs with source. Related skills only when verified — else `未知`, never fabricate.
6. **表6 Agent** — selectable/invocable agents (native primary `build`/`plan`, native subagents, plugin-provided, custom; disabled ones `❌已禁用` + config line). **Hidden system agents** (`compaction`/`title`/`summary`) go in a table note only. **模型链 column is mandatory**: default model chain from the current preset, looked up fresh (`a→b→c`), + backup preset names.
7. **表7 宿主** — host-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser, managed processes, prompt optimization, skill marketplace). No duplication with 表1/表2.

## Source Classification

**来源 must name the specific bringer, never a bare category.** Shape: `带来者名称 + 注册位置 + 上游/协议`.

| 来源写法（示例） | 适用 |
|---|---|
| `核心自带，官方 TUI 文档` | built-in |
| `第三方插件，opencode.jsonc:plugin[]，源码 <repo> <协议>` | npm plugin |
| `宿主官方，安装包 <dir> + 配置 $HOST_CONFIG/` | host app |
| `<插件名> 包 <src/skills/<name>>` | plugin-bundled skill |
| `本地自建，整合/上游 <repo> <协议>` | user-created skill |
| `全局配置 command/<name>.md` | user command |
| `宿主平台注入，宿主应用 magicPrompts（app.asar）` | host-injected command |
| `<MCP名>（远端MCP，<url>）` / `<MCP名>（本地MCP，<cmd>）` | MCP server |

Suffix every source with confidence: `✅实测` / `✅文档` / `⚠️推断`. Append state:

- `✅可用` — actually invokable.
- `❌已禁用` — explicitly disabled in config; **quote the config line**.
- `📦仅货架未装` — marketplace/cache/docs only, not registered, not invokable.
- `🚫不存在` — absent everywhere. Never pad tables.

Multi-source items: record the **direct bringer**; push indirect provenance into `干什么`. **Resolution vs disk:** on-disk-but-unregistered = unavailable (say so); registered-but-broken (missing command/env/probe fail) = `⚠️推断` + failure class in a table note.

## Procedure

### 1. Discover (remap only this section on a new host/CLI)

1. **Declared config**: `$OPENCODE_CONFIG/opencode.jsonc`, `package.json:dependencies`, `$PROJECT_DIR/tui.json`.
2. **User directory**: `$OPENCODE_CONFIG/command/`, first 15 lines of each `$OPENCODE_CONFIG/skills/*/SKILL.md`.
3. **Project overlay**: `$PROJECT_DIR/.opencode/`, project-level MCP/plugin additions.
4. **Host injection**: `$HOST_CONFIG/` settings, `agent-tool/*.js`, and **binary-safe scan of the host app bundle** (`app.asar`/`web-dist`) for `/xxx` slash-command literals — plain grep misses binaries. See `references/host-commands.md` for the scan method and the confirmed command list.
5. **Runtime listing**: `opencode agent list` vs `opencode --pure agent list`, TUI `/` autocomplete. **Run the host's own opencode binary**, not the system-wide one — they can differ.

Path variables only: `$OPENCODE_CONFIG`, `$PROJECT_DIR`, `$HOST_CONFIG`, `$PACKAGE_CACHE`.

### 2. Verify

Cheapest first: (1) direct — TUI autocomplete, host browser, read-only listing, the two `agent list` commands; (2) official docs — `opencode.ai/docs/tui#commands` (full command list), `opencode.ai/docs/agents`; (3) source, last resort — plugin cache registration tables, host `agent-tool/*.js`, app bundles. Docs may lead local version — local ground truth wins.

Versions/models/counts: look up fresh, order manifest → install-path → lockfile/marketplace → `未知`. Never from memory.

### 3. Empty tables

No content after verification → **do not invent, do not omit**: output `表中无可用行（现查日期）`; JSON = `[]`.

### 4. Disposal note

In 表1/2/4/5/7, end every `干什么` with who brought it in and what breaks/vanishes if removed. Optional in 表3/表6.

### 5. Output

- Chinese compact tables, blank line between tables, fixed headers, rows alphabetical (表2 grouped by software), one entry per cell.
- Cell conventions:
  - **来源**: three-part shape.
  - **怎么叫**: `/命令`, `@agent`, `看话自动干`, `Agent 自调`, `装完自动生效`.
  - **何时用**: concrete scenario with conditions (`需 git`, `很贵`, `Win 专用`). No bare `按需`.
  - **干什么**: **substantial** — `简单：一句话。详细：<1-3 句，基于源文件实际 description（SKILL.md / command/*.md / 官方文档 / magicPrompts 模板），转述成看得懂的中文>` + disposal where required.
  - **模型链 (表6 only)**: current preset's chain `a→b→c`, + backup presets.
- Format examples: see `references/format-example.md` (values there are placeholders — replace, never copy).
- **Usage Guide (`usage-guide.md`)**: after producing the 7 tables, derive a plain-language usage guide from the same rows. Do NOT re-collect evidence. Organize by user scenario, not by type:

  ```
  # 使用指南：这些命令/技能什么时候用
  
  ## 每天必用（最高频）
  **`/catch-up`** — 每次回到项目第一件事。它静默检查 git 状态（进行中 diff、PR 状态、最近提交），告诉你"上次干到哪、从哪继续"。多会话来回切换时最高频。
  **`/review`** — 提交代码前跑它。默认评审未提交改动，也可指定 commit/分支/PR。新手提交前等于免费 code review。
  
  ## 干活主力
  | 命令 | 什么时候用 |
  |---|---|
  | `/deepwork` | 复杂多阶段任务，带审查关卡 |
  
  ## 按需
  | 命令 | 什么时候用 |
  |---|---|
  | `/plan-feature` | 做新功能前先规划 |
  
  ## 周期性
  | 命令 | 什么时候用 |
  |---|---|
  | `/reflect` | 每周回顾一次 |
  ```

  Rules: group by **frequency/scenario** (每天必用 / 干活主力 / 按需 / 周期性), write in plain Chinese telling *when and why* to use each, include practical caveats (需 git、很贵、Win 专用), keep it scannable. Only include `✅可用` items. Format reference: `references/usage-guide.md`.
- End: one-line mnemonic + **Provenance** (3 lines):
  ```
  盘点时间：现查填写｜预设：现查填写｜命令：`opencode agent list` + `opencode --pure agent list` 已跑
  未解析：如实列（如某插件缓存读不到），无则写"无"
  本表由 asset-inventory 生成（自包含）
  ```
  Real-name mode adds a 4th line: `本输出含用户要求的真实项目名，请勿外发。`
- **JSON**: standalone file, one element per row: `table, name, source, state, confidence, invoke`. PK = `table`+`name`. Empty table ⇒ `[]`.
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only on explicit request + Provenance line.
- **Diff mode**: user asks "跟上次比变了啥" → ask them to paste previous JSON/Markdown, output only added/removed, keyed by PK. Never re-dump full tables.

## Quality Bar

1. Exactly 7 tables; 表1-5/7 five columns, 表6 six (含模型链); headers consistent.
2. Every 来源 names the specific bringer, with confidence suffix.
3. 表3 lists **all** built-in commands from docs, not a handful.
4. 表4 includes host-injected commands (source `宿主平台注入`).
5. No absolute paths, plaintext keys/tokens, or real project names (unless real-name mode + 4th Provenance line).
6. Versions/models/counts looked up fresh.
7. `📦仅货架未装` never mixed with `✅可用`.
8. This skill appears in 表4.
9. No `按需` in any `何时用`.
10. Every `干什么` is substantial (based on source description, not a vague label).
11. Every 表6 row has a concrete 模型链 (`a→b→c`), not a placeholder.
12. 表1/2/4/5/7 rows end with disposal sentence.
13. JSON PKs match Markdown rows, no duplicates.
14. Empty tables have declaration line + `[]`.
15. Commands sit in the right table (原生→表3, 插件→表2, 自建→表4, 宿主注入→表4).
16. **`usage-guide.md` derived from the same rows** — no re-collection, no invented facts; grouped by scenario/frequency; only `✅可用` items; plain-language "when and why".

## Anti-patterns

- Inventing a version, model chain, count, or a `📦仅货架未装` item to fill a table.
- Writing an inference as `✅实测`; writing "unknown" as a fact.
- Stopping 表3 at one or two example commands instead of the full list.
- Cramming multiple commands into one cell, or merging distinct user commands into one row.
- Fabricating an MCP "related skill" you never verified.
- Treating a user's casually-named software as fact — verify first (`📦`/`🚫` if absent).
- Writing `插件包`/`本地自建` as a source without naming the actual plugin/software.
- Skipping the binary scan of the host app bundle — silently drops the whole host-injected class.
- Copying example rows from `references/format-example.md` as literal output.
- Editing any skill/command/agent/MCP/config during the inventory. Read-only.
- Writing baselines or state files onto the machine being inventoried.
- Re-collecting or inventing facts for `usage-guide.md` — it must derive from the same 7-table rows.