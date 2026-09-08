---
name: asset-inventory
description: Inventory every plugin, companion app, skill, command, MCP server, agent, and host capability on this machine's OpenCode/OpenChamber setup, with provenance for each item. Use when the user asks "列一下我有什么插件/Skill/命令/MCP/Agent"、"哪个被禁用了"、"谁带进来的", or wants a migration/onboarding checklist. Outputs 7 tables plus a machine-readable JSON file. Never invent assets, versions, or model names — verify everything on this machine.
license: MIT
metadata:
  audience: opencode-users
  workflow: inventory
---

# Asset Inventory

Inventory what this machine can **actually invoke** — not what files exist on disk. Every row answers: **是什么、谁带来的、怎么用**.

## Output

Every run produces **three files** from the same evidence (no double collection):

1. **`inventory.md`** — the 7-table inventory: 7 tables (below), what each asset is.
2. **`usage-guide.md`** — the how-to-use guide: reorganizes the same inventory by **user scenarios and frequency**, in plain language, telling the user **when to reach for each command/skill and why**. Format reference: `references/usage-guide.md`. This is a second *view* of the same facts — never re-collect or invent new ones.
3. **`asset-inventory.json`** — standalone machine-readable JSON, one element per row (PK: `table`+`name`). For diff / migration / onboarding.

The Rule below describes the `inventory.md` tables; the Usage Guide section describes how to derive `usage-guide.md` from them.

## Targeting（参数路由）

`asset-inventory` 也接受斜杠命令参数——`/asset-inventory <target>` 只盘用户关心的子集，更快、产物更聚焦。斜杠后的内容即 `$ARGUMENTS`：

| 输入 | 行为 | 产物 |
|---|---|---|
| `/asset-inventory`（无参数） | 全量 7 表 | `output/` 三份文件 |
| `/asset-inventory mcp` | 只盘 MCP | `output/inventory.md`（仅表5）+ `output/asset-inventory.json`（仅表5行） |
| `/asset-inventory agents` | 只盘 Agent | 仅表6 + 对应 JSON |
| `/asset-inventory hosts` | 只盘外层应用能力 | 仅表7 + 对应 JSON |
| `/asset-inventory skills` | 只盘 Skill 与命令 | 表2+表3+表4 + 对应 JSON |
| `/asset-inventory diff` | 差异模式 | 只输出按 PK 增减的项（请用户贴上次 JSON） |
| `/asset-inventory usage` | 全量扫描后只生成使用指南 | 仅 `output/usage-guide.md` |

规则：
- 带 target 时**跳过无关的证据收集步骤**（例：`mcp` 不扫插件 dist、`agents` 不读外层应用包），但**语言跟随用户**、单元格规范、来源三段式、掩码规则、`output/` 写入位置全部照旧。
- `diff` 与自然语言的差异模式等价：请用户贴上次的 JSON，只输出按 PK 新增/移除的项，绝不重贴全表。
- `usage` 仍先做全量扫描（使用指南必须从同一批行派生），但只写 `usage-guide.md`，不写 `inventory.md` 与 JSON。
- 未匹配的 target → 回退全量扫描，并在结尾注明"未知目标，已回退全量"。

## The Rule

Produce **7 tables**. Tables 1-5 and 7 have **5 columns** (`名称｜来源｜怎么叫｜何时用｜干什么`); **表6 Agent has 6 columns** (`名称｜来源｜怎么叫｜何时用｜干什么｜模型链`).

1. **表1 插件与配套软件** — the software/plugins themselves (host, plugins, companion apps). One row per software. **名称 must be the software's real name** (e.g. `OpenChamber`、`@rezamonangg/opencode-rtk@0.4.0`) — never a placeholder like `外层桌面应用`; 从安装路径/配置命名反查实名.
2. **表2 各软件/插件带来的 Skill 与命令** — grouped by owning software: **one row per skill/command, NO summary rows** (软件本体已在表1, 汇总行冗余). A command belongs to whoever provides its *function* (调谁的工具归谁) — `/rtk-gain` → `@rezamonangg/opencode-rtk`, file location as a detail. 插件通过 hook 注册的斜杠命令也列于此（如 `/loop`，源码在插件 dist `hooks/loop-command`），来源写 `<插件名> 注册命令（dist hooks/…）`. **分组呈现方式固定**：允许在每个软件的行块前加一行粗体分组行（名称列只写软件名，其余列为空）；分组行不是数据行——JSON 不含分组行，行数统计也不计。要么全程用分组行，要么全程不用，同一次运行内不得混用。表4 的「本地自建 / 用户命令 / 外层应用注入」分组行同理。
3. **表3 原生命令与原生 Skill** — **ALL built-in TUI commands** (verify against `opencode.ai/docs/tui`: `/connect /compact /details /editor /exit /export /help /init /models /new /redo /sessions /share /unshare /themes /thinking /undo` + docs list) and built-in skills. If none, empty-table declaration.
4. **表4 自定义 Skill、命令与外层应用注入命令** — user-created skills (upstream + deps), user commands, **and outer-app-injected commands** (source `外层应用注入`). Each expanded, never merged. **This skill itself MUST appear here.**
5. **表5 MCP** — every MCP server (global + project), local/remote, enabled state, auth-masking state. User-built MCPs with source. Related skills only when verified — else `未知`, never fabricate. 若 MCP 有已知别名/工具名前缀（如 grep_app → 别名 `gh_grep`），在 `来源` 或 `怎么叫` 中写明.
6. **表6 Agent** — selectable/invocable agents (native primary `build`/`plan`, native subagents, plugin-provided, custom; disabled ones `❌已禁用` + config line). **Hidden system agents** (`compaction`/`title`/`summary`) go in a table note only. **模型链 column is mandatory**: default model chain from the current preset, looked up fresh (`a→b→c`), + backup preset names. **行序强制：核心自带 primary → 插件包 primary → 核心自带 subagent → 插件包 subagent；组内按名称字母序。**
7. **表7 外层应用** — outer-app-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser, managed processes, prompt optimization, skill marketplace). No duplication with 表1/表2. **行名从固定能力类别清单取，跨运行保持稳定**（名称可按输出语言翻译，但类别构成固定）：① 全局行为规则 ② 模型偏好管理 ③ 会话与定时任务动作 ④ 页内浏览器 ⑤ 托管进程管理 ⑥ 提示优化 ⑦ Skill 市场目录。机器上不存在的类别不列行，禁止自造新类别名（新能力先归入最近类别，`干什么` 里说明）。

## Source Classification

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

### 3. Empty tables

No content after verification → **do not invent, do not omit**: output `表中无可用行（现查日期）`; JSON = `[]`.

### 4. ~~Disposal note~~ (removed)

删除后果（"随插件删除/删了会怎样"）**不写**——表格里不输出"怎么删、删了会怎样"；那是运维手册的活，盘点只负责「是什么、谁带来的、怎么用」。若某依赖缺失确实影响可用性（如依赖 CLI 未装），只在 `干什么` 里如实说明，不写删除建议。

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
- Cell conventions:
  - **名称**: one consistent shape per asset type — NO suffix words, NO redundancy:
    - Command → `/command`（裸斜杠命令，不加"命令"二字；别名只在 `怎么叫` 里写）。
    - Skill → `skill-name`（技能名，不加斜杠；斜杠调用属于 `怎么叫`）。
    - Plugin/software → real product name（`OpenChamber`、`@rezamonangg/opencode-rtk@0.4.0`）。
    - Agent → `agent-name`；MCP → `mcp-name`；host capability → capability name。
    - 表2 名称 = 子项本身的名字（`/loop`、`clonedeps`、`/rtk-gain`），**不带插件名前缀**（归属已由 `来源` 列和分组体现）。
  - **来源**: three-part shape.
  - **怎么叫**: how the user can actually reach it — **list ALL real invocation paths, never one only**:
    - Command → the literal `/command` (aliases in parens). Never `看话自动干`.
    - Skill → both paths: `看话自动干，或 /skill名` (skills auto-trigger on description match AND are slash-invocable). Never bare `看话自动干` when a slash name exists.
    - Agent → `Tab 切换` / `自动接管` / `@agent名`.
    - MCP → `Agent 自调` (+ known tool-name prefix/alias, e.g. `grep_app_* / gh_grep_*`).
    - Software/host capability → `装完自动生效` / `不用叫，开机自带` / `Agent 调时`.
  - **何时用**: concrete scenario with conditions (`需 git`, `很贵`, `Win 专用`). No bare `按需`.
  - **干什么**: **detailed, never one-liners** — shape `简单：一句话。详细：<2-4 句>`.
    The 详细 part MUST be expanded from the source's actual description
    (`SKILL.md` frontmatter `description`, `command/*.md` frontmatter + body,
    official doc wording, `magicPrompts` usage text), paraphrased into readable
    Chinese, covering: what it actually does, how it is typically invoked,
    and key caveats (`需 git`, `很贵`, `依赖某 CLI 且已装/未装`, `走什么模型链`).
    **Never** write deletion consequences ("随插件删除/删了会怎样").
    - ❌ Bad: `简单：看结果。详细：打出本会话数据。`
    - ✅ Good: `简单：看本会话省了多少 token。详细：它立即执行 rtk_gain 工具，把白名单命令经 RTK 改写后省下的 token 量打成账单展示，不问问题、不改配置；适合每次长会话结束时看一眼省了多少。`
   - **模型链 (表6 only)**: current preset's chain `a→b→c`, + backup presets. **豁免**：无独立模型配置的核心自带 agent（如 `build`/`plan`）没有链式回退——写宿主当前实际生效的模型（现查，写实值）并注明「单模型，无链式回退」；禁止写"跟随主会话"这类占位话术充当链。
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
  
   ## 按需 (on-demand frequency group, not a 何时用 cell value)
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
- **JSON** (`output/asset-inventory.json`): standalone file, one element per row: `table, name, source, state, confidence, invoke`. PK = `table`+`name`. Empty table ⇒ `[]`.
  - **`table` 字段固定为数字 `1`-`7`**（对应表1-表7），**不随输出语言变化**——这是 diff 模式跨运行可比的前提；Markdown 里的「表N」标题负责人读，JSON 的数字负责机器。禁止写成 `表1`/`Table 1` 等本地化字符串。
  - 分组行、表注、隐藏 agent 不入 JSON；JSON 行集合 = Markdown 数据行集合。
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only on explicit request + Provenance line.
- **Diff mode**: user asks "跟上次比变了啥" → ask them to paste previous JSON/Markdown, output only added/removed, keyed by PK. Never re-dump full tables.

## Quality Bar

1. Exactly 7 tables; 表1-5/7 five columns, 表6 six (含模型链); headers consistent.
2. Every 来源 names the specific bringer, with confidence suffix.
3. 表3 lists **all** built-in commands from docs, not a handful.
4. 表4 includes outer-app-injected commands (source `外层应用注入`).
5. No absolute paths, plaintext keys/tokens, or real project names (unless real-name mode + 4th Provenance line).
6. Versions/models/counts looked up fresh.
7. `📦仅货架未装` never mixed with `✅可用`.
8. This skill appears in 表4.
9. Every `干什么` is detailed (简单一句话 + 详细 2-4 句，基于源 description 展开，含典型用法与关键注意事项；一句话/标签式算不达标).
10. *(reserved — removed duplicate; see Anti-patterns)*
11. Every 表6 row has a concrete 模型链 (`a→b→c`) **或**（无配置链的核心 agent）宿主当前实际模型写实值 + 「单模型，无链式回退」标注；不收占位话术.
12. 表1/2/4/5/7 rows do NOT carry deletion consequences; 干什么 focuses on 是什么/谁带来/怎么用/注意事项.
13. JSON PKs match Markdown data rows, no duplicates; `table` field is the fixed numeric `1`-`7` (never localized strings).
14. Empty tables have declaration line + `[]`.
15. Commands sit in the right table (原生→表3, 插件→表2, 自建→表4, 外层应用注入命令→表4); outer-app capabilities (non-command) → 表7.
16. **`usage-guide.md` derived from the same rows** — no re-collection, no invented facts; grouped by scenario/frequency; only `✅可用` items; plain-language "when and why".
17. Every `怎么叫` lists ALL real invocation paths (命令→`/命令`+别名；技能→`看话自动干，或 /技能名`；MCP→`Agent 自调`+工具前缀/别名). No bare `看话自动干`.
18. 表1 software names are real names (e.g. `OpenChamber`), never placeholders.
20. 表6 row order: 核心自带 primary → 插件包 primary → 核心自带 subagent → 插件包 subagent, alphabetical within group.
21. 表5 MCP rows carry known aliases/tool-name prefixes (e.g. grep_app → `gh_grep`).
22. 名称 column is uniform per asset type: commands are bare `/command` (no `命令` suffix), skills bare `skill-name` (no `/`), 表2 rows bare child name (no plugin prefix), software real names. No mixed styles.

## Anti-patterns

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
- Writing `干什么` as a one-liner or a vague label (e.g. `简单：看结果。详细：打出本会话数据。`).
- Writing deletion consequences in `干什么` ("随插件删除/删了会怎样") — the inventory reports what/who/how, not removal guidance.
- Writing a single invocation path in `怎么叫` (e.g. bare `看话自动干` when the skill is also slash-invocable).
- Adding summary rows to 表2 that duplicate 表1 software entries.
- Writing a placeholder software name in 表1 (e.g. `外层桌面应用`) instead of the real name.
- Scrambling 表6 order (core primary should precede plugin primary, primary precede subagent).
- Mixing 名称 column styles (e.g. `/undo 命令` vs `/catch-up` vs `插件名 / 子项名`) — commands are bare `/command`, skills bare `skill-name`, 表2 bare child name.
- Omitting a known MCP alias/tool-name prefix from 表5.
- Missing plugin-registered slash commands (`/loop`) because the scan stopped at `command/` and never read the plugin dist `hooks/`.
- Writing run output anywhere outside `output/` (baselines or state files onto the machine being inventoried).
- Re-collecting or inventing facts for `usage-guide.md` — it must derive from the same 7-table rows.