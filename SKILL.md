---
name: asset-inventory
description: Inventory every plugin, companion app, skill, command, MCP server, agent, and host capability on this machine's OpenCode/OpenChamber setup, with provenance for each item. Use when the user asks "列一下我有什么插件/Skill/命令/MCP/Agent"、"哪个被禁用了"、"谁带进来的"、"能不能删/删了会怎样", or wants a migration/onboarding checklist. Outputs 7 tables plus a machine-readable JSON file. Never invent assets, versions, or model names — verify everything on this machine.
license: MIT
metadata:
  audience: opencode-users
  workflow: inventory
---

# Asset Inventory

Inventory what this machine can actually invoke — not what files exist on disk. Every row answers three questions: **what is it, where did it come from, who can remove it**.

## The Rule

Your job is to produce **7 tables, 5 columns each**: `名称｜来源｜怎么叫｜何时用｜干什么`.

Fixed table order:

1. **表1 插件与配套软件** — the software/plugins themselves (host, plugins, companion apps). Do not list their skills here.
2. **表2 各软件/插件带来的 Skill** — grouped by owning software: one summary row per software, then one row per skill it brings (`软件名 / Skill 名`, source per skill). Plugin-provided commands go here too, suffixed `命令`.
3. **表3 原生命令与原生 Skill** — built-in commands (suffixed `命令`) and built-in skills, per official docs.
4. **表4 自定义 Skill 或命令** — user-created skills (must note upstream + external deps) and user commands, each expanded, never merged. **This skill itself MUST appear here.**
5. **表5 MCP** — every MCP server (global + project additions), local/remote, enabled state, whether auth headers were masked. User-built MCPs must appear with source. Related skills: only if you verified an actual call/dependency — otherwise write `未知`, never fabricate.
6. **表6 Agent** — built-in (primary/subagent/hidden) + plugin-provided + custom. Models: current preset's chain, looked up fresh (`a→b→c`); note backup preset names; never hardcode model names.
7. **表7 宿主** — host-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser actions, managed processes, prompt optimization, skill marketplace). If a capability is already owned by a software row in 表1/表2, do not duplicate it here.

## Source Classification

For every row, decide **state first**, then **source**. The source dictionary has only these values:

| 来源 | 用于 |
|---|---|
| 核心 | built-in / core |
| 全局配置 / 项目配置 | declared in that layer |
| 插件包 / 技能包 | brought by a plugin or skill package |
| 本地自建 | user-created |
| 远端MCP / 本地MCP | MCP transport |
| 宿主 | injected by the host app |

Suffix every source with confidence: `✅实测` / `✅文档` / `⚠️推断`. Append state:

- `✅可用` — actually invokable (TUI autocomplete, `agent list`, config enabled).
- `❌已禁用` — explicitly disabled in config; **quote the config line**.
- `📦仅货架未装` — appears in marketplace/cache/docs only, not registered, not invokable. Typical: marketplace listings, plugin-cache source without registration.
- `🚫不存在` — absent from both lists and disk. Never pad the tables to fill them.

When an item has multiple sources, record the **direct bringer** (插件包/技能包/宿主 wins over its own origin), and push indirect provenance into `干什么`.

**Distinguish resolution from disk:** a file on disk but unregistered/unenabled = unavailable, say so explicitly, do not count as usable. A registered config that fails to resolve (missing command / missing env / probe failure) = broken reference: mark `⚠️推断` and put the failure class in a table note.

## Procedure

### 1. Discover (evidence sources, remap only this section on a new host/CLI)

Gather from five sources (default OpenCode + OpenChamber mapping):

1. **Declared config**: `$OPENCODE_CONFIG/opencode.jsonc`, `package.json:dependencies`, `$PROJECT_DIR/tui.json`.
2. **User directory**: `$OPENCODE_CONFIG/command/`, first 15 lines of each `$OPENCODE_CONFIG/skills/*/SKILL.md`.
3. **Project overlay**: `$PROJECT_DIR/.opencode/`, project-level MCP additions.
4. **Host injection**: `$HOST_CONFIG/` settings, `$HOST_CONFIG/agent-tool/*.js`.
5. **Runtime listing**: `opencode agent list` vs `opencode --pure agent list`, TUI `/` autocomplete.

Use path variables only — never absolute paths in output. `$OPENCODE_CONFIG`, `$PROJECT_DIR`, `$HOST_CONFIG`, `$PACKAGE_CACHE` are the four allowed placeholders.

### 2. Verify

Evidence order, cheapest first:

1. **Direct**: TUI `/` autocomplete; host browser on the host's local port; read-only listing of the five sources above; run the two `agent list` commands and compare.
2. **Official docs**: `opencode.ai/docs/tui#commands`, `opencode.ai/docs/agents` (primary/subagent/hidden), Context7 for plugin docs. Docs may be ahead of the local version — local ground truth wins.
3. **Source, last resort**: plugin cache registration tables (e.g. `CUSTOM_SKILLS`), command registration; source without registration = `📦仅货架未装`; host `agent-tool/*.js` for tool actions; app bundles (asar/web-dist) only to fill gaps.

Version numbers, model names, counts: always look them up fresh, in this order — manifest → install-path segment → lockfile/marketplace → `未知（现查无结果）`. Never from memory.

### 3. Empty tables

If a table has no content after verification, **do not invent rows and do not omit the table**. Output one declaration line: `表中无可用行（现查日期）`; the JSON array for that table is `[]`.

### 4. Disposal note

In 表1, 表2, 表4, 表5, 表7 — end every `干什么` cell with a disposal sentence: who brought this in, and what breaks/vanishes if the owning software or config is removed. In 表3 and 表6 (native capabilities) it is optional.

### 5. Output

- Chinese compact tables, one blank line between tables; fixed headers; rows alphabetical by name (表2 grouped by software first); one entry per cell, never cram multiple commands into one.
- End with a one-line mnemonic + a **Provenance** block (3 lines):
  ```
  盘点时间：现查填写｜预设：现查填写｜命令：`opencode agent list` + `opencode --pure agent list` 已跑
  未解析：如实列（如某插件缓存读不到），无则写“无”
  本表由 asset-inventory 生成（自包含）
  ```
  In real-name mode add a 4th line: `本输出含用户要求的真实项目名，请勿外发。`
- **JSON**: emit a standalone JSON file alongside the Markdown, one element per row with at least `table`, `name`, `source`, `state`, `confidence`, `invoke`. Primary key = `table` + `name` (unique within a table). Empty table ⇒ `[]`.
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only when the user explicitly asks — and then the Provenance note above is mandatory.
- **Diff mode**: when the user asks "跟上次比变了啥", ask them to paste the previous JSON (or Markdown), and output only the added/removed sections, keyed by `table` + `name` primary key. Never re-dump the full tables.

## Quality Bar

Before you call this done, pass all of these:

1. Exactly 7 tables, 5 columns each, headers consistent.
2. Every source is from the dictionary, with confidence suffix, per the arbitration rules.
3. No absolute paths, no plaintext keys/tokens, no real project names (unless real-name mode, which then has the 4th Provenance line).
4. Versions/models/counts looked up fresh.
5. `📦仅货架未装` never mixed with `✅可用`.
6. This skill appears in 表4.
7. No `按需` in any `何时用` cell.
8. 表1/2/4/5/7 rows end `干什么` with a disposal sentence.
9. JSON primary keys match Markdown rows, no duplicates.
10. Empty tables have their declaration line and `[]` in JSON.
11. Command rows carry the `命令` suffix and sit in the right table (原生→表3, 插件→表2, 自建→表4).

## Anti-patterns

- Inventing a version, model chain, count, or a `📦仅货架未装` item to fill a table — same as inventing an asset.
- Writing an inference as `✅实测`; writing "unknown" as a fact.
- Cramming multiple commands into one cell, or merging distinct user commands into one row.
- Fabricating an MCP "related skill" you never verified.
- Treating a user's casually-named software as fact — verify it exists first, then classify it (`📦`/`🚫` if absent).
- Copying the example rows in this file as literal output — they set the *format*, not the facts.
- Editing any skill/command/agent/MCP/config during the inventory. This skill is read-only.
- Writing baselines or state files onto the machine being inventoried; the JSON is for the user to save.

## Format Example

These rows set the *format* only — replace every value with looked-up facts:

```
### 表1 插件与配套软件
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例软件 | 宿主✅实测 | 装完自动生效，无需手敲 | 需要某类重写/编排能力时 | 一句话用途（版本现查）。细节1-2句。删该软件，它带的 Skill 一并消失。 |

### 表2 各软件/插件带来的 Skill
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例软件 / 示例 Skill | 插件包✅实测 | 看话自动干，或 /示例:skill | 需要某类流程化处理时 | 一句话用途。细节1-2句。随示例软件删除。 |

### 表5 MCP
| 名称 | 来源 | 怎么叫 | 何时用 | 干什么 |
|---|---|---|---|---|
| 示例MCP | 本地自建✅实测 | Agent 按需调用，不手敲 | 需要联网查官方文档时 | 一句话用途。相关 Skill 未知。认证头已脱敏。删配置即断。 |
```

Table-note style (only when there is a real risk): `注：示例MCP 探活失败（缺命令 tools/list 不可达）；认证头含明文 key，已打码。`