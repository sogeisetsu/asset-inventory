---
name: asset-inventory
version: 1.3.0
description: Inventory every plugin, companion app, skill, command, MCP server, agent, and host capability on this machine's OpenCode/OpenChamber setup, with provenance for each item. Use when the user asks "列一下我有什么插件/Skill/命令/MCP/Agent"、"哪个被禁用了"、"谁带进来的", or wants a migration/onboarding checklist. Outputs 7 tables plus a machine-readable JSON file. Never invent assets, versions, or model names — verify everything on this machine.
license: MIT
metadata:
  audience: opencode-users
  workflow: inventory
---

# Asset Inventory

Inventory what this machine can **actually invoke** — not what files exist on disk. Every row answers: **是什么、谁带来的、怎么用**.

## Quick Reference

**一句话触发：** `/asset-inventory` 或自然语言 "列一下我有什么插件/Skill/命令/MCP/Agent"

**三份产物（同一批证据，不重复收集）：**

| 文件 | 内容 |
|---|---|
| `output/inventory.md` | 7 张表：插件 → 各软件带来的Skill/命令 → 原生命令 → 自定义/外层注入 → MCP → Agent → 外层应用 |
| `output/usage-guide.md` | 使用指南：按场景/频率（每天必用 / 干活主力 / 按需 / 周期性） |
| `output/asset-inventory.json` | 机器可读 JSON，PK = `table` + `name` |

**精扫模式：** `/asset-inventory mcp` | `agents` | `hosts` | `skills` | `diff` | `usage`

**每行必答三问：** 是什么（名称）· 谁带来的（来源三段式）· 怎么用（何时用 + 调用路径）

---

## Output

三份产物从**同一批证据**派生（不重复收集）。详细格式见各自 reference 文件：

- **`inventory.md`** — 7 张表。格式见 `references/format-example.md`。
- **`usage-guide.md`** — 从 7 表派生的使用指南。格式见 `references/usage-guide.md`。
- **`asset-inventory.json`** — 机器可读 JSON，PK = `table` + `name`。格式见下方 Output 段。

使用指南**绝不重新收集证据**——它只是同一批行按场景/频率的第二视图。

## Targeting

| Input | Behavior | Output |
|---|---|---|
| `/asset-inventory` (no args) | Full 7 tables | 3 files in `output/` |
| `/asset-inventory mcp` | MCP only | `inventory.md` (table 5 only) + JSON (table 5 rows) |
| `/asset-inventory agents` | Agents only | `inventory.md` (table 6 only) + JSON (table 6 rows) |
| `/asset-inventory hosts` | Outer-app capabilities only | `inventory.md` (table 7 only) + JSON (table 7 rows) |
| `/asset-inventory skills` | Skills & commands only | `inventory.md` (tables 2–4) + JSON (tables 2–4 rows) |
| `/asset-inventory diff` | Diff mode | Added/removed rows only (paste previous JSON) |
| `/asset-inventory usage` | Full scan, usage guide only | `usage-guide.md` only |

Rules:
- With a target, **skip unrelated evidence collection** (e.g. `mcp` skips plugin dist scan, `agents` skips outer-app bundle). Language, cell conventions, source classification, masking rules, and `output/` path all stay the same.
- `diff` is equivalent to natural-language diff mode: ask user to paste previous JSON, output only added/removed by PK. Never re-dump full tables.
- `usage` still does full scan (usage guide must derive from the same rows), but only writes `usage-guide.md`, not `inventory.md` or JSON.
- Unrecognized target → fall back to full scan, note "unknown target, fell back to full scan" at the end.

---

## The Rule

Produce **7 tables**. Tables 1-5 and 7 have **5 columns** (`名称｜来源｜怎么叫｜何时用｜干什么`); **表6 Agent has 6 columns** (`名称｜来源｜怎么叫｜何时用｜干什么｜模型链`).

### 表格概览

| 表 | 名称 | 覆盖什么 |
|---|---|---|
| 1 | 插件与配套软件 | 软件/插件本体（host、plugins、companion apps）。每行一个软件。**名称必须是软件的真名**（如 `OpenChamber`、`@rezamonangg/opencode-rtk@0.4.0`），不能用占位符（如 `外层桌面应用`）；从安装路径/配置命名反查实名。 |
| 2 | 各软件/插件带来的 Skill 与命令 | 按提供软件分组：**每行一个 skill/命令，不加汇总行**（软件本体已在表1，汇总行冗余）。命令归属看功能（调谁的工具归谁）——`/rtk-gain` → `@rezamonangg/opencode-rtk`。插件通过 hook 注册的斜杠命令也列于此（如 `/loop`，源码在插件 dist `hooks/loop-command`），来源写 `<插件名> 注册命令（dist hooks/…）`。**分组方式**：每个软件行块前可加粗体分组行（名称列只写软件名，其余列为空）；分组行不是数据行——JSON 不含分组行，行数统计不计。要么全程用分组行，要么全程不用，同一次运行内不得混用。表4 的「本地自建 / 用户命令 / 外层应用注入」分组行同理。 |
| 3 | 原生命令与原生 Skill | **ALL built-in TUI commands** (verify against `opencode.ai/docs/tui`: `/connect /compact /details /editor /exit /export /help /init /models /new /redo /sessions /share /unshare /themes /thinking /undo` + docs list) and built-in skills. If none, empty-table declaration. |
| 4 | 自定义 Skill、命令与外层应用注入命令 | user-created skills (upstream + deps), user commands, **and outer-app-injected commands** (source `外层应用注入`). Each expanded, never merged. **This skill itself MUST appear here.** |
| 5 | MCP | every MCP server (global + project), local/remote, enabled state, auth-masking state. User-built MCPs with source. Related skills only when verified — else `未知`, never fabricate. 若 MCP 有已知别名/工具名前缀（如 grep_app → 别名 `gh_grep`），在 `来源` 或 `怎么叫` 中写明. |
| 6 | Agent | selectable/invocable agents (native primary `build`/`plan`, native subagents, plugin-provided, custom; disabled ones `❌已禁用` + config line). **Hidden system agents** (`compaction`/`title`/`summary`) go in a table note only. **模型链 column is mandatory**: default model chain from the current preset, looked up fresh (`a→b→c`), + backup preset names. **行序强制：核心自带 primary → 插件包 primary → 核心自带 subagent → 插件包 subagent；组内按名称字母序。** |
| 7 | 外层应用 | outer-app-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser, managed processes, prompt optimization, skill marketplace). No duplication with 表1/表2. **行名从固定能力类别清单取，跨运行保持稳定**（名称可按输出语言翻译，但类别构成固定）：① 全局行为规则 ② 模型偏好管理 ③ 会话与定时任务动作 ④ 页内浏览器 ⑤ 托管进程管理 ⑥ 提示优化 ⑦ Skill 市场目录。机器上不存在的类别不列行，禁止自造新类别名（新能力先归入最近类别，`干什么` 里说明）。 |

### 单元格规范

- **名称**: one consistent shape per asset type — NO suffix words, NO redundancy:
  - Command → `/command`（裸斜杠命令，不加"命令"二字；别名只在 `怎么叫` 里写）。
  - Skill → `skill-name`（技能名，不加斜杠；斜杠调用属于 `怎么叫`）。
  - Plugin/software → real product name（`OpenChamber`、`@rezamonangg/opencode-rtk@0.4.0`）。
  - Agent → `agent-name`；MCP → `mcp-name`；host capability → capability name。
  - 表2 名称 = 子项本身的名字（`/loop`、`clonedeps`、`/rtk-gain`），**不带插件名前缀**（归属已由 `来源` 列和分组体现）。
- **来源**: three-part shape. 见下方 Source Classification。
- **怎么叫**: how the user can actually reach it — **list ALL real invocation paths, never one only**:
  - Command → the literal `/command` (aliases in parens). Never `看话自动干`.
  - Skill → both paths: `看话自动干，或 /skill名` (skills auto-trigger on description match AND are slash-invocable). Never bare `看话自动干` when a slash name exists.
  - Agent → `Tab 切换` / `自动接管` / `@agent名`.
  - MCP → `Agent 自调` (+ known tool-name prefix/alias, e.g. `grep_app_* / gh_grep_*`).
  - Software/host capability → `装完自动生效` / `不用叫，开机自带` / `Agent 调时`.
- **何时用**: concrete scenario with conditions (`需 git`, `很贵`, `Win 专用`). No bare `按需`.
- **干什么**: **detailed, never one-liners** — shape `简单：一句话。详细：<2-4 句>`.
  The 详细 part MUST be expanded from the source's actual description
  (`SKILL.md` frontmatter `description`, `command/*.md` frontposition + body,
  official doc wording, `magicPrompts` usage text), paraphrased into readable
  Chinese, covering: what it actually does, how it is typically invoked,
  and key caveats (`需 git`, `很贵`, `依赖某 CLI 且已装/未装`, `走什么模型链`).
  **Never** write deletion consequences ("随插件删除/删了会怎样").
  - ❌ Bad: `简单：看结果。详细：打出本会话数据。`
  - ✅ Good: `简单：看本会话省了多少 token。详细：它立即执行 rtk_gain 工具，把白名单命令经 RTK 改写后省下的 token 量打成账单展示，不问问题、不改配置；适合每次长会话结束时看一眼省了多少。`
- **模型链 (表6 only)**: current preset's chain `a→b→c`, + backup presets. **豁免**：无独立模型配置的核心自带 agent（如 `build`/`plan`）没有链式回退——写宿主当前实际生效的模型（现查，写实值）并注明「单模型，无链式回退」；禁止写"跟随主会话"这类占位话术充当链。

### 干什么格式要求（必读）

干什么是表格中最关键的单元格——它告诉用户"这个东西到底干什么"。格式必须是：

```
简单：一句话概括。详细：2-4 句展开，基于源 SKILL.md description / 命令文档 / magicPrompts 文本改写，覆盖：做什么、怎么触发、有什么坑。
```

**展开来源优先级：**
1. `SKILL.md` frontmatter `description`
2. `command/*.md` frontmatter + body
3. 官方文档 wording
4. `magicPrompts` usage text

**禁止：**
- ❌ 一句话/标签式（`简单：看结果。详细：打出本会话数据。`）
- ❌ 删除后果（"随插件删除/删了会怎样"）
- ❌ 占位符（`简单：TODO。详细：待补充。`）

### Source Classification

**来源 must name the specific bringer, never a bare category.** Shape: `带来者名称 + 注册位置 + 上游/协议`.

| 来源写法（示例） | 适用 |
|---|---|
| `核心自带，官方 TUI 文档` | built-in |
| `第三方插件，opencode.jsonc:plugin[]，源码 <repo> <协议>` | npm plugin |
| `外层应用官方，安装包 <dir> + 配置 $HOST_CONFIG/` | outer app (host) |
| `<插件名> 包 <src/skills/<name>>` | plugin-bundled skill |
| `本地自建，整合/上游 <repo> <协议>` | user-created skill |
| `全局配置 command/<name>.md` | user command |
| `外层应用注入，外层应用 magicPrompts（app.asar）` | outer-app-injected command |
| `<MCP名>（远端MCP，<url>）` / `<MCP名>（本地MCP，<cmd>）` | MCP server |

Suffix every source with confidence: `✅实测` / `✅文档` / `⚠️推断`. Append state:

| 中文标记 | English marker | 含义 |
|---|---|---|
| `✅可用` | `✅available` | actually invokable. |
| `❌已禁用` | `❌disabled` | explicitly disabled in config; **quote the config line**. |
| `📦仅货架未装` | `📦shelf-only` | marketplace/cache/docs only, not registered, not invokable. |
| `🚫不存在` | `🚫absent` | absent everywhere. Never pad tables. |

> **State markers follow the output language**: use the 中文 column when outputting in Chinese; use the English column when outputting in English (and likewise for other languages).

Multi-source items: record the **direct bringer**; push indirect provenance into `干什么`. **Resolution vs disk:** on-disk-but-unregistered = unavailable (say so); registered-but-broken (missing command/env/probe fail) = `⚠️推断` + failure class in a table note.

---

## Procedure

### 1. Discover (remap only this section on a new host/CLI)

1. **Declared config**: `$OPENCODE_CONFIG/opencode.jsonc`, `package.json:dependencies`, `tui.json`（用户目录或项目目录都可能出现，需现查）.
2. **User directory**: `$OPENCODE_CONFIG/command/`, first 15 lines of each `$OPENCODE_CONFIG/skills/*/SKILL.md`.
3. **Project overlay**: `$PROJECT_DIR/.opencode/`, project-level MCP/plugin additions.
4. **Plugin packages**: evidence sources are **remappable per host**. Try, in order:
   - **Installed plugin cache** (`$PACKAGE_CACHE/packages/*/`) — list `src/skills/` (packaged skills) AND scan `dist/*.js` for `registerCommand`/`COMMAND_NAME` hook registrations (plugin-registered `/` commands like `/loop` live there, not in `command/`).
   - **Plugin self-managed manifest** (e.g. `.oh-my-opencode-slim/skills-manifest.json`) — tells `✅可用` (synced to global skills) from `📦仅货架未装` (in package but not synced).
   - **`package.json:dependencies`** and the plugin's own dist/hooks referenced from `opencode.jsonc:plugin[]`.
   
   Use whichever sources exist on the host being inventoried; never assume a single fixed path.
5. **外层应用注入**: `$HOST_CONFIG/` settings, `agent-tool/*.js`, and **binary-safe scan of the outer app bundle** (`app.asar`/`web-dist`) for `/xxx` slash-command literals — plain grep misses binaries. See `references/host-commands.md` for the scan method and the confirmed command list.
   > **Note**: outer app settings may live in Electron internal storage (DIPS/SQLite) with no standalone JSON file. If `$HOST_CONFIG/settings.json` is absent, say so in a table note — don't fabricate. The app.asar scan still works regardless.
6. **Runtime listing**: `opencode agent list` vs `opencode --pure agent list`, TUI `/` autocomplete. **Run the outer app's own opencode binary**, not the system-wide one — they can differ.

Path variables (common defaults — **verify against the actual host**):

| Variable | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| `$OPENCODE_CONFIG` | `~/.config/opencode/` | `$env:USERPROFILE\.config\opencode\` |
| `$PROJECT_DIR` | current working directory | current working directory |
| `$HOST_CONFIG` | `~/.config/<OuterApp>/` | `$env:APPDATA\<OuterApp>\`（OpenChamber 实测为 `~/.config/openchamber/`，不在 `%APPDATA%`——以现查为准） |
| `$PACKAGE_CACHE` | host-specific plugin cache dir | host-specific plugin cache dir |

> These are typical values, not guarantees. Always confirm against the machine being inventoried.

### 2. Verify

Cheapest first: (1) direct — TUI autocomplete, host browser, read-only listing, the two `agent list` commands; (2) official docs — `opencode.ai/docs/tui#commands` (full command list), `opencode.ai/docs/agents`; (3) source, last resort — plugin cache registration tables, host `agent-tool/*.js`, app bundles. Docs may lead local version — local ground truth wins.

Versions/models/counts: look up fresh, order manifest → install-path → lockfile/marketplace → `未知`. Never from memory.

Agent name handling: if a config-disabled agent name (e.g. `explore`) doesn't match the actual `agent list` name (e.g. `explorer`), **the `agent list` ground truth wins**. Note the mismatch in a table footnote and don't invent a row for the stale config name.

### 3. Error Handling

| Scenario | Action |
|---|---|
| Plugin cache unreadable | `🚫不存在` + table note: `插件缓存读取失败（<error>）` |
| Outer app bundle scan fails | 表注说明失败原因；跳过该来源，不编造 |
| `opencode agent list` returns empty | 检查 `opencode --pure agent list`；仍空则写"未检测到可选 agent" |
| MCP server unreachable | `⚠️推断` + note: `探活失败（<error>）` |
| Config file missing or malformed | 表注说明缺失；不猜测默认值 |
| Version unknown after all sources exhausted | Write `未知` — never invent |
| Language mismatch (user asks in English, config is Chinese) | Follow user's language for output; use English for technical terms |

**Rule:** When in doubt, write what you observed — never fabricate. A `⚠️推断` with explanation is always better than a confident `✅实测` on unverified data.

### 4. Empty tables

No content after verification → **do not invent, do not omit**: output `表中无可用行（现查日期）`; JSON = `[]`.

### 5. Output

- Every run writes **three files** into the **`output/` directory of the project
  being inventoried** — the current working directory (`$PROJECT_DIR`), created if
  missing. Not the skill's install location: the skill may live in a global config
  dir, but the output must always land in the user's project root so it ships with
  that project. Never write anywhere else:
  - `output/inventory.md` — the 7-table inventory below.
  - `output/usage-guide.md` — the how-to-use guide derived from the same rows.
  - `output/asset-inventory.json` — standalone JSON, one element per row.
- **Language follows the user**: every table header, cell value, state marker, and the usage guide must be written in the same language the user asked in (中文→中文, English→English, 日本語→日本語, Deutsch→Deutsch, etc.). Never default to a fixed language. The 7-table *structure* and column *count* stay fixed (表1-5/7 five columns, 表6 six), but the headers themselves (e.g. 名称/来源/怎么叫/何时用/干什么 → Name/Source/How to call/When/What it does), all cell content, state markers (e.g. `✅可用`→`✅available`, `❌已禁用`→`❌disabled`, `📦仅货架未装`→`📦shelf-only`, `🚫不存在`→`🚫absent`), and prose are translated into the user's language. When in doubt, ask or mirror the last user message.
- Compact tables, blank line between tables, fixed headers, rows alphabetical (表2 grouped by software), one entry per cell.
- Format examples: see `references/format-example.md` (values there are placeholders — replace, never copy).
- **Usage Guide (`usage-guide.md`)**: after producing the 7 tables, derive a plain-language usage guide from the same rows. Do NOT re-collect evidence. Organize by user scenario, not by type. See `references/usage-guide.md` for format.
- End: one-line mnemonic + **Provenance** (3 lines, follows output language):
  - Chinese:
    ```
    盘点时间：现查填写｜预设：现查填写｜命令：`opencode agent list` + `opencode --pure agent list` 已跑
    未解析：如实列（如某插件缓存读不到），无则写"无"
    本表由 asset-inventory 生成（自包含）
    ```
  - English:
    ```
    Inventory time: fill after scan | Preset: fill after scan | Commands: `opencode agent list` + `opencode --pure agent list` run
    Unresolved: list honestly (e.g. plugin cache unreadable), or "none"
    Generated by asset-inventory (self-contained)
    ```
  Real-name mode adds a 4th line: `本输出含用户要求的真实项目名，请勿外发。` / `This output contains user-requested real project names — do not share externally.`
- **JSON** (`output/asset-inventory.json`): standalone file, one element per row: `table, name, source, state, confidence, invoke`. PK = `table`+`name`. Empty table ⇒ `[]`.
  - **`table` 字段固定为数字 `1`-`7`**（对应表1-表7），**不随输出语言变化**——这是 diff 模式跨运行可比的前提；Markdown 里的「表N」标题负责人读，JSON 的数字负责机器。禁止写成 `表1`/`Table 1` 等本地化字符串。
  - 分组行、表注、隐藏 agent 不入 JSON；JSON 行集合 = Markdown 数据行集合。
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only on explicit request + Provenance line.
- **Diff mode**: user asks "跟上次比变了啥" → ask them to paste previous JSON/Markdown, output only added/removed, keyed by PK. Never re-dump full tables.

---

## Quality Checklist

Run this checklist before outputting. Every item must pass.

### All Tables
- [ ] Exactly 7 tables; 表1-5/7 five columns, 表6 six (含模型链); headers consistent.
- [ ] Every 来源 names the specific bringer, with confidence suffix.
- [ ] No absolute paths, plaintext keys/tokens, or real project names (unless real-name mode + 4th Provenance line).
- [ ] Versions/models/counts looked up fresh.
- [ ] JSON PKs match Markdown data rows, no duplicates; `table` field is the fixed numeric `1`-`7` (never localized strings).
- [ ] Empty tables have declaration line + `[]`.
- [ ] 名称 column is uniform per asset type: commands are bare `/command` (no `命令` suffix), skills bare `skill-name` (no `/`), 表2 rows bare child name (no plugin prefix), software real names. No mixed styles.
- [ ] Every `怎么叫` lists ALL real invocation paths. No bare `看话自动干`.

### 表1 插件与配套软件
- [ ] Software names are real names (e.g. `OpenChamber`), never placeholders.

### 表2 各软件/插件带来的 Skill 与命令
- [ ] Commands sit in the right table (原生→表3, 插件→表2, 自建→表4, 外层应用注入命令→表4).
- [ ] No summary rows duplicating 表1 software entries.

### 表3 原生命令与原生 Skill
- [ ] Lists **all** built-in commands from docs, not a handful.

### 表4 自定义 Skill、命令与外层应用注入命令
- [ ] Includes outer-app-injected commands (source `外层应用注入`).
- [ ] This skill appears in 表4.

### 表5 MCP
- [ ] Rows carry known aliases/tool-name prefixes (e.g. grep_app → `gh_grep`).

### 表6 Agent
- [ ] Every row has a concrete 模型链 (`a→b→c`) **or**（无配置链的核心 agent）宿主当前实际模型写实值 + 「单模型，无链式回退」标注. 不收占位话术.
- [ ] Row order: 核心自带 primary → 插件包 primary → 核心自带 subagent → 插件包 subagent, alphabetical within group.

### 表7 外层应用
- [ ] No duplication with 表1/表2; outer-app capabilities (non-command) → 表7.

### 干什么 & 使用指南
- [ ] Every `干什么` is detailed: 简单一句话 + 详细 2-4 句，基于源 description 展开，含典型用法与关键注意事项. 一句话/标签式算不达标.
- [ ] 表1/2/4/5/7 rows do NOT carry deletion consequences; 干什么 focuses on 是什么/谁带来/怎么用/注意事项.
- [ ] `usage-guide.md` derived from the same rows — no re-collection, no invented facts; grouped by scenario/frequency; only `✅可用` items; plain-language "when and why".

---

## Anti-patterns

以下行为会导致盘点结果不可信。Quality Checklist 覆盖的项不重复列出。

- Inventing a version, model chain, count, or a `📦仅货架未装` item to fill a table.
- Writing an inference as `✅实测`; writing "unknown" as a fact.
- Stopping 表3 at one or two example commands instead of the full list.
- Cramming multiple commands into one cell, or merging distinct user commands into one row.
- Fabricating an MCP "related skill" you never verified.
- Treating a user's casually-named software as fact — verify first (`📦`/`🚫` if absent).
- Writing `插件包`/`本地自建` as a source without naming the actual plugin/software.
- Skipping the binary scan of the outer app bundle — silently drops the whole outer-app-injected class.
- Copying example rows from `references/format-example.md` as literal output.
- Editing any skill/command/agent/MCP/config during the inventory. Read-only.
- Scrambling 表6 order (core primary should precede plugin primary, primary precedes subagent).
- Omitting a known MCP alias/tool-name prefix from 表5.
- Missing plugin-registered slash commands (`/loop`) because the scan stopped at `command/` and never read the plugin dist `hooks/`.
- Writing run output anywhere outside `output/` (baselines or state files onto the machine being inventoried).
