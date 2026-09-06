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

## The Rule

Produce **7 tables, 5 columns each**: `名称｜来源｜怎么叫｜何时用｜干什么`.

1. **表1 插件与配套软件** — the software/plugins themselves (host, plugins, companion apps). One row per software. Do not list their skills here.
2. **表2 各软件/插件带来的 Skill 与命令** — grouped by owning software. One summary row per software, then one row per skill/command it brings. A command belongs to whoever provides its *function* (调谁的工具归谁) — e.g. `/rtk-gain` → `@rezamonangg/opencode-rtk`, with its file location (`command/rtk-gain.md`) as a detail.
3. **表3 原生命令与原生 Skill** — **ALL built-in TUI commands, never just a few.** Mandatory checklist to verify against `opencode.ai/docs/tui`: `/connect /compact /details /editor /exit /export /help /init /models /new /redo /sessions /share /unshare /themes /thinking /undo` (+ whatever the docs list). Plus built-in skills (e.g. `customize-opencode`). Native skills are rare — if none, use the empty-table declaration.
4. **表4 自定义 Skill、自定义命令与宿主注入命令** — user-created skills (must note upstream + external deps), user commands, **and host-injected commands** (e.g. `/catch-up /plan-feature /interview` — source `宿主平台注入，TUI / 可见`). Each expanded, never merged. **This skill itself MUST appear here.**
5. **表5 MCP** — every MCP server (global + project additions), local/remote, enabled state, whether auth headers were masked. User-built MCPs must appear with source. Related skills only when you verified an actual call/dependency — otherwise write `未知`, never fabricate.
6. **表6 Agent** — the agents this user can actually select or invoke: native primary (`build`, `plan`), native subagents (`explore`, `general`, `scout` — mark disabled ones `❌已禁用` with the config line), plugin-provided agents, and custom ones. **Hidden system agents** (`compaction`, `title`, `summary` — auto-run, not selectable in the UI) go in a table note as "存在但 UI 不可选、自动运行", never as usable rows. Model chains looked up fresh from the current preset (`a→b→c`), note backup preset names; never hardcode model names from memory.
7. **表7 宿主** — host-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser actions, managed processes, prompt optimization, skill marketplace). If a capability is already owned by a software row in 表1/表2, do not duplicate it here.

## Source Classification

**The 来源 column must name the specific bringer — never just a category.** Category words like "插件包" are worthless; the reader needs to know *which* plugin, *which* app, *which* file. Follow this three-part shape when the info exists:

`带来者名称 + 注册位置 + 上游/协议`

| 来源写法（示例） | 适用 |
|---|---|
| `核心自带，官方 TUI 文档` | built-in commands / skills / agents |
| `第三方插件，opencode.jsonc:plugin[]，源码 <repo> <协议>` | npm plugin |
| `宿主官方，安装包 <dir> + 配置 $HOST_CONFIG/` | host app |
| `<插件名> 包 <src/skills/<name>>` | skill bundled inside a plugin |
| `本地自建，整合/上游 <repo> <协议>` | user-created skill |
| `全局配置 command/<name>.md` | user command file |
| `宿主平台注入，TUI / 可见` | host-injected command |
| `<MCP名>（远端MCP，<url>）` / `<MCP名>（本地MCP，<cmd>）` | MCP server |

Suffix every source with confidence: `✅实测` / `✅文档` / `⚠️推断`. Append state:

- `✅可用` — actually invokable (TUI autocomplete, `agent list`, config enabled).
- `❌已禁用` — explicitly disabled in config; **quote the config line**.
- `📦仅货架未装` — appears in marketplace/cache/docs only, not registered, not invokable.
- `🚫不存在` — absent from both lists and disk. Never pad the tables to fill them.

When an item has multiple sources, record the **direct bringer** and push indirect provenance into `干什么`.

**Resolution vs disk:** a file on disk but unregistered/unenabled = unavailable, say so explicitly, do not count as usable. A registered config that fails to resolve (missing command / missing env / probe failure) = broken reference: mark `⚠️推断` and put the failure class in a table note.

## Procedure

### 1. Discover (evidence sources, remap only this section on a new host/CLI)

Gather from five sources (default OpenCode + OpenChamber mapping):

1. **Declared config**: `$OPENCODE_CONFIG/opencode.jsonc`, `package.json:dependencies`, `$PROJECT_DIR/tui.json`.
2. **User directory**: `$OPENCODE_CONFIG/command/`, first 15 lines of each `$OPENCODE_CONFIG/skills/*/SKILL.md`.
3. **Project overlay**: `$PROJECT_DIR/.opencode/`, project-level MCP additions and `tui.json:plugin[]`.
4. **Host injection**: `$HOST_CONFIG/` settings, `$HOST_CONFIG/agent-tool/*.js`, host-registered slash commands visible in TUI. **Host-injected slash commands often live INSIDE the host app binary** (e.g. OpenChamber's `app.asar` / `web-dist`, `settings.magicPrompts`), which plain-text grep cannot search. Scan the host app bundle with a binary-safe search (e.g. node `Buffer.indexOf`) for slash-command literals like `/catch-up`, `/plan-feature`, `/craft-goal`, `/workspace-review`, `/weigh`, `/debug`, `/summary`, `/explore`, `/todo`, `/implement` — and any other `/xxx` near `magicPrompts`. This is mandatory, not optional: without it, the inventory silently drops an entire class of assets.
5. **Runtime listing**: `opencode agent list` vs `opencode --pure agent list`, TUI `/` autocomplete. **Run the host's own opencode binary** (e.g. OpenChamber's bundled `opencode-cli/opencode.exe`), not the system-wide one — the two can differ.

Use path variables only — never absolute paths in output. `$OPENCODE_CONFIG`, `$PROJECT_DIR`, `$HOST_CONFIG`, `$PACKAGE_CACHE` are the four allowed placeholders.

### 2. Verify

Evidence order, cheapest first:

1. **Direct**: TUI `/` autocomplete; host browser on the host's local port; read-only listing of the five sources above; run the two `agent list` commands and compare.
2. **Official docs**: `opencode.ai/docs/tui#commands` (full command list — use it to catch commands you'd forget), `opencode.ai/docs/agents` (built-in primary/subagent/hidden), Context7 for plugin docs. Docs may be ahead of the local version — local ground truth wins.
3. **Source, last resort**: plugin cache registration tables (e.g. `CUSTOM_SKILLS`), command registration; source without registration = `📦仅货架未装`; host `agent-tool/*.js` for tool actions; app bundles (asar/web-dist) only to fill gaps.

Version numbers, model names, counts: always look them up fresh, in this order — manifest → install-path segment → lockfile/marketplace → `未知（现查无结果）`. Never from memory.

### 3. Empty tables

If a table has no content after verification, **do not invent rows and do not omit the table**. Output one declaration line: `表中无可用行（现查日期）`; the JSON array for that table is `[]`.

### 4. Disposal note

In 表1, 表2, 表4, 表5, 表7 — end every `干什么` cell with a disposal sentence: who brought this in, and what breaks/vanishes if the owning software or config is removed. In 表3 and 表6 (native capabilities) it is optional.

### 5. Output

- Chinese compact tables, one blank line between tables; fixed headers; rows alphabetical by name (表2 grouped by software first); one entry per cell, never cram multiple commands into one.
- Cell conventions:
  - **来源**: three-part shape from Source Classification.
  - **怎么叫**: how it is invoked — `/命令`, `@agent`, `看话自动干`, `Agent 自调`, `装完自动生效`.
  - **何时用**: a concrete scenario with any conditions (`需 git`, `很贵`, `Win 专用`, `没提交时`). No bare `按需`.
  - **干什么**: `简单：一句话。详细：1-2 句。` + disposal sentence where required.
- End with a one-line mnemonic + a **Provenance** block (3 lines):
  ```
  盘点时间：现查填写｜预设：现查填写｜命令：`opencode agent list` + `opencode --pure agent list` 已跑
  未解析：如实列（如某插件缓存读不到），无则写"无"
  本表由 asset-inventory 生成（自包含）
  ```
  In real-name mode add a 4th line: `本输出含用户要求的真实项目名，请勿外发。`
- **JSON**: emit a standalone JSON file alongside the Markdown, one element per row with at least `table`, `name`, `source`, `state`, `confidence`, `invoke`. Primary key = `table` + `name` (unique within a table). Empty table ⇒ `[]`.
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only when the user explicitly asks — and then the Provenance note above is mandatory.
- **Diff mode**: when the user asks "跟上次比变了啥", ask them to paste the previous JSON (or Markdown), and output only the added/removed sections, keyed by `table` + `name` primary key. Never re-dump the full tables.

## Quality Bar

Before you call this done, pass all of these:

1. Exactly 7 tables, 5 columns each, headers consistent.
2. Every 来源 names the specific bringer (never a bare category), with confidence suffix, per the arbitration rules.
3. 表3 lists **all** built-in commands from `opencode.ai/docs/tui` — not just a handful; cross-check the checklist in The Rule.
4. 表4 includes host-injected commands (source `宿主平台注入`), not only user-written ones.
5. No absolute paths, no plaintext keys/tokens, no real project names (unless real-name mode, which then has the 4th Provenance line).
6. Versions/models/counts looked up fresh.
7. `📦仅货架未装` never mixed with `✅可用`.
8. This skill appears in 表4.
9. No `按需` in any `何时用` cell.
10. 表1/2/4/5/7 rows end `干什么` with a disposal sentence.
11. JSON primary keys match Markdown rows, no duplicates.
12. Empty tables have their declaration line and `[]` in JSON.
13. Command rows sit in the right table (原生→表3, 插件提供功能→表2, 自建→表4, 宿主注入→表4 with source `宿主平台注入`).

## Anti-patterns

- Inventing a version, model chain, count, or a `📦仅货架未装` item to fill a table — same as inventing an asset.
- Writing an inference as `✅实测`; writing "unknown" as a fact.
- Stopping 表3 at one or two example commands instead of the full built-in list.
- Cramming multiple commands into one cell, or merging distinct user commands into one row.
- Fabricating an MCP "related skill" you never verified.
- Treating a user's casually-named software as fact — verify it exists first, then classify it (`📦`/`🚫` if absent).
- Writing `插件包`/`本地自建` as a source without naming the actual plugin or software.
- Copying the example rows in this file as literal output — they set the *format*, not the facts.
- Editing any skill/command/agent/MCP/config during the inventory. This skill is read-only.
- Writing baselines or state files onto the machine being inventoried; the JSON is for the user to save.

## Format Example

These rows set the *format* only — replace every value with looked-up facts:

```
### 表1 插件与配套软件
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例宿主应用 | 宿主官方，安装包 resources/ + 配置 $HOST_CONFIG/ | 不用叫，开机自带 | 每次打开工作台时 | 简单：桌面工作台。详细：管项目/会话/定时任务/模型偏好/页内浏览器。删掉它，宿主注入的会话/浏览器动作消失。 |

### 表2 各软件/插件带来的 Skill 与命令
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例插件 / 示例 Skill | 示例插件 包 src/skills/example | 看话自动干，或 /example:skill | 需要某类流程化处理时 | 简单：一句话用途。详细：1-2 句细节。随示例插件删除。 |

### 表3 原生命令与原生 Skill（片段）
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| /undo 命令 | 核心自带，官方 TUI 文档 | /undo | 改错反悔时，需 git | 简单：后悔药。详细：回滚上一条消息及文件改动。 |

### 表4 自定义 Skill、命令与宿主注入（片段）
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| /catch-up | 宿主平台注入，TUI / 可见 | /catch-up | 每次回来断片时，第一件事 | 简单：补课。详细：查进行中 diff、PR 状态、最近提交，告诉上次干到哪、从哪继续。 |

### 表5 MCP
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例MCP | 本地自建✅实测 | Agent 自调 | 需要联网查官方文档时 | 简单：一句话用途。详细：1-2 句。相关 Skill 未知。认证头已脱敏。删配置即断。 |

### 表6 Agent（片段）
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例Agent | 示例插件（插件包）✅实测 | 自动接管 | 任何多步活时 | 简单：包工头。详细：拆活派活整合。模型（当前预设现查）`a→b→c`。 |

### 表7 宿主（片段）
| 名称 | 来源 | 何时生效 | 干什么 |
|---|---|---|---|
| 示例行为规则 | 宿主设置 $HOST_CONFIG/ 全局行为 | 所有会话 | 家规：验证→文档→源码；不可逆先问；改规范双写。 |
```

Table-note style (only when there is a real risk): `注：示例MCP 探活失败（缺命令 tools/list 不可达）；认证头含明文 key，已打码。`