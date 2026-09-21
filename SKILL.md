---
name: asset-inventory
description: Inventory every plugin, companion app, skill, command, MCP server, agent, and host capability on this machine's OpenCode/OpenChamber setup, with provenance for each item. Use when the user asks to list their plugins, skills, commands, MCP servers, or agents; asks which one is disabled; asks who brought a given asset in; or wants a migration/onboarding checklist. Outputs 7 tables plus a machine-readable JSON file. Never invent assets, versions, or model names — verify everything on this machine.
license: MIT
metadata:
  audience: opencode-users
  workflow: inventory
  version: 1.7.4
---

# Asset Inventory

Inventory what this machine can **actually invoke** — not what files exist on disk. Every row answers three questions: **what it is, who brought it in, how to use it**.

> **Language rule — read this first: output follows the user's language.** A request in Chinese produces a fully Chinese deliverable; a request in English produces English. The skill's own instructions stay English. Fixed strings (table headers, state markers, confidence suffixes) must come from `references/glossary.json` for the chosen language. Details in [Output Language](#output-language).

## Output Language

This skill's instructions are written in English, but **output must follow the user's language**.

- If the user writes in Chinese, or asks for a Chinese result, produce the whole deliverable in Chinese — every table header, cell value, state marker, provenance line, and the usage guide.
- If the user writes in English, produce it in English.
- **Fixed-string languages:** `references/glossary.json` currently ships fixed strings for **English (`en`), Chinese (`zh`), and Japanese (`ja`)**. Use the matching entry verbatim.
- **Any other language still works**, but has no fixed-string entry: translate the same structure into that language and **derive the header/marker strings from the `en` block**, keeping the shape (same number of columns, same marker set). Note in Provenance that the fixed strings were derived, not from the glossary. Do not silently output English strings for a non-English request.
- Keep technical terms, paths, command names, asset names, and field names in their original form.
- When in doubt, mirror the language of the user's last message, or ask.
- **Use the fixed strings from `references/glossary.json`** for the chosen language: `columns` / `columnsAgent` (headers), `state` markers, `confidence` suffixes, `tableTitles`, `emptyTable`, `unknown`, and `provenance`. Do not improvise these strings; they must stay identical across runs so diff mode stays comparable.

## Quick Reference

**One-line trigger:** `/asset-inventory`, or natural language such as "list my plugins / skills / commands / MCP / agents".

**Three deliverables (one body of evidence, never re-collected):**

| File | Content |
|---|---|
| `output/inventory.md` | 7 tables: plugins → skills/commands each brings → built-ins → custom/host-injected → MCP → agents → host capabilities |
| `output/usage-guide.md` | Usage guide by scenario/frequency (daily / main tools / on-demand / periodic) |
| `output/asset-inventory.json` | Machine-readable JSON, PK = `table` + `name` |

**Targeted modes:** `/asset-inventory mcp` | `agents` | `hosts` | `skills` | `diff` | `usage`

**Three questions per row:** what it is (name) · who brought it in (three-part source) · how to use it (when to use + invocation path)

---

## Output

The three deliverables are derived from **the same body of evidence** (never re-collected). Detailed formats live in the reference files:

- **`inventory.md`** — the 7 tables. Format: `references/format-example.md`.
- **`usage-guide.md`** — a usage guide derived from the 7 tables. Format: `references/usage-guide.md`.
- **`asset-inventory.json`** — machine-readable JSON, PK = `table` + `name`. Format: see the Output step under Procedure.

The usage guide **never re-collects evidence** — it is a second view of the same rows by scenario/frequency.

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
- With a target, **skip unrelated evidence collection** (e.g. `mcp` skips the plugin dist scan, `agents` skips the outer-app bundle). Language, cell conventions, source classification, masking rules, and the `output/` path all stay the same.
- `diff` is equivalent to natural-language diff mode: ask the user to paste the previous JSON, output only added/removed by PK. Never re-dump full tables.
- `usage` still does a full scan (the usage guide must derive from the same rows), but only writes `usage-guide.md`, not `inventory.md` or JSON.
- Unrecognized target → fall back to full scan and note "unknown target, fell back to full scan" at the end.

---

## The Rule

Produce **7 tables**. Tables 1-5 and 7 have **5 columns** (`Name | Source | How to call | When to use | What it does`); **Table 6 (Agents) has 6 columns** (`… | Model chain`). Localize the header text to the output language using `references/glossary.json` (`columns` / `columnsAgent`).

### Table Overview

| # | Table | Covers |
|---|---|---|
| 1 | Plugins & companion software | The software/plugins themselves (hosts, plugins, companion apps). One row per software. **The name must be the software's real name** (e.g. `OpenChamber`, `@rezamonangg/opencode-rtk@0.4.0`), never a placeholder (e.g. "outer desktop app"); reverse-look-up real names from install paths or config names. |
| 2 | Skills & commands each software/plugin brings | Grouped by providing software: **one row per skill/command, no summary rows** (the software itself is already in Table 1; summary rows are redundant). Command ownership follows the tool it invokes (`/rtk-gain` → `@rezamonangg/opencode-rtk`). Slash commands a plugin registers via hooks also go here (e.g. `/loop`, source in the plugin dist `hooks/loop-command`); source = `<plugin> registers command (dist hooks/…)`. **Grouping:** you may prefix each software's block with a bold group row (name column holds only the software name, other columns empty); a group row is not a data row — JSON excludes group rows and row counts ignore them. Either use group rows throughout or not at all; never mix them within one run. The "local / user-command / host-injected" group rows in Table 4 follow the same rule. |
| 3 | Built-in commands & built-in skills | **ALL built-in TUI commands** (verify against `opencode.ai/docs/tui`: `/connect /compact /details /editor /exit /export /help /init /models /new /redo /sessions /share /unshare /themes /thinking /undo` + the docs list) and built-in skills. If none, write an empty-table declaration. |
| 4 | Custom skills, commands, and host-injected commands | user-created skills (upstream + deps), user commands, **and outer-app-injected commands** (source `host-injected`). Each expanded, never merged. **This skill itself MUST appear here.** |
| 5 | MCP | **every** MCP server (global + project), local/remote, enabled state, auth-masking state. **A single-row table is almost always wrong** — re-read the config's `mcp` keys and match the count. User-built MCPs with source. Related skills only when verified — else `unknown`, never fabricate. If an MCP has a known alias/tool-name prefix (e.g. grep_app → alias `gh_grep`), state it in the `Source` or `How to call` cell. Record how a human reaches it too (ask-by-name, an MCP Prompt if it exposes one, or its own CLI/HTTP endpoint) — never only "the Agent calls it". |
| 6 | Agents | selectable/invocable agents (native primary `build`/`plan`, native subagents, plugin-provided, custom; disabled ones `❌disabled` + config line). **Hidden system agents** (`compaction`/`title`/`summary`) go in a table note only. **The Model-chain column is mandatory**: read the active preset in the plugin's preset file — its `<agent>.model` may be a string or an array, and an **array is the chain**. Plus backup preset names. **A preset full of arrays must never render as "single model" for every agent.** **Row order is enforced: core primary → plugin primary → core subagent → plugin subagent; alphabetical within each group.** |
| 7 | Host capabilities | outer-app-injected capabilities (behavior rules, model prefs, session/task actions, in-page browser, managed processes, prompt optimization, skill marketplace). No duplication with Table 1/Table 2. **Row names come from a fixed capability-category list and stay stable across runs** (names may be translated into the output language, but the category set is fixed): ① global behavior rules ② model-preference management ③ session & scheduled-task actions ④ in-page browser ⑤ managed-process management ⑥ prompt optimization ⑦ skill marketplace catalog. Do not list a category that does not exist on the machine, and never invent new category names (fold a new capability into the nearest category and explain it in `What it does`). |

### Cell Conventions

- **Name**: one consistent shape per asset type — NO suffix words, NO redundancy:
  - Command → `/command` (bare slash command; do not append the word "command"; aliases go only in `How to call`).
  - Skill → `skill-name` (skill name, no slash; slash invocation belongs in `How to call`).
  - Plugin/software → real product name (`OpenChamber`, `@rezamonangg/opencode-rtk@0.4.0`).
  - Agent → `agent-name`; MCP → `mcp-name`; host capability → capability name.
  - Table 2 name = the child's own name (`/loop`, `clonedeps`, `/rtk-gain`), **without a plugin prefix** (ownership is already shown by the `Source` column and grouping).
- **Source**: three-part shape. See Source Classification below.
- **How to call**: how the user can actually reach it — **list ALL real invocation paths, never just one**:
  - Command → the literal `/command` (aliases in parens). Never "auto-runs on intent".
  - Skill → both paths: `auto-triggers on intent, or /skill-name` (skills auto-trigger on description match AND are slash-invocable). Never bare "auto-triggers" when a slash name exists.
  - Agent → `Tab switch` / `auto-takeover` / `@agent-name`.
  - MCP → **list every real invocation path, never just one** — a prompt reaches any MCP tool by name:
    - **ask by name** — the documented way a human reaches it: `use context7`, or `use the gh_grep tool`; the Agent then calls the tool.
    - **Agent calls it** — the tool is exposed to the model as `<server>_<tool>` (e.g. `grep_app_*` / `gh_grep_*`).
    - **MCP Prompt** — if the server exposes Prompts, OpenCode registers them as slash commands `/prompt-name` (a genuinely human-direct entry point); state it only when verified.
    - **standalone CLI/HTTP** — some servers also ship their own command or endpoint (e.g. a local `pdf-mcp` command, the remote `mcp.context7.com` URL) reachable outside OpenCode; mention it only when verified.
    - **Never** write "the human doesn't call it" or any "Agent-only" claim on an MCP row.
  - Software/host capability → `active once installed` / `nothing to call, on from launch` / `when the Agent calls it`.
- **When to use**: concrete scenario with conditions (e.g. `needs git`, `expensive`, `Windows-only`). Never a bare "on demand".
- **What it does**: **one detailed paragraph, never a one-liner and never split into "Simple / Detailed"**. Full rules in [What-it-does format](#what-it-does-format-mandatory) below.
- **Model chain (Table 6 only)**: the chain comes from the **active preset** in the plugin's preset file (e.g. `.oh-my-opencode-slim/oh-my-opencode-slim.json` → `preset` names the active one, `presets.<name>.<agent>.model` holds it). **That value may be a string OR an array** — an array *is* the chain, in order (`["a","b","c"]` → `a → b → c`). Never flatten an array to a single model, and never report "single model" for a plugin agent whose preset lists an array.
  **Exemption — core-bundled agents only**: agents that ship with the host and have no preset entry (e.g. `build`/`plan`) have no chain fallback — write the host's currently effective model (looked up fresh, real value) and annotate "single model, no chain fallback". This exemption **does not apply to plugin agents**; if a plugin agent's chain cannot be read, write `unknown ⚠️inferred`, never "single model".
  Also record the backup preset names (the other keys under `presets`).

### What-it-does format (mandatory)

`What it does` is the most critical cell in a table — it tells the user what the thing actually does. Write it as **one detailed, readable paragraph** — never a one-liner, never a label, and **never split into "Simple / Detailed" parts**.

Every paragraph MUST answer these three things, in flowing prose (not a numbered list inside the cell):

1. **How it is invoked** — what the user or Agent actually does to trigger it.
2. **When to use it** — the concrete situation where it earns its keep.
3. **What happens after** — the observable effect once it runs, plus caveats (`needs git`, `expensive`, `depends on a CLI that is/isn't installed`, `which model chain it uses`).

Expand from the source's actual description (`SKILL.md` frontmatter `description`, `command/*.md` frontmatter + body, official doc wording, `magicPrompts` usage text), paraphrased into readable prose in the output language. Aim for 2-5 sentences — enough to be genuinely useful, not padding.

**Expansion source priority:**
1. `SKILL.md` frontmatter `description`
2. `command/*.md` frontmatter + body
3. official documentation wording
4. `magicPrompts` usage text

**Forbidden:**
- ❌ one-liner / label-style (`see results` / `prints this session's data`)
- ❌ a `Simple: … Detailed: …` split — the cell is one paragraph
- ❌ deletion consequences (`goes away when the plugin is removed`)
- ❌ placeholders (`TODO` / `TBD`)

✅ Good (EN): `You reach it at the end of a long session; it immediately runs the rtk_gain tool and prints a bill of the tokens saved after whitelisted commands were rewritten through RTK. It asks nothing and changes no config — glance at it when you want to confirm the rewrites actually paid off.`

For a Chinese deliverable the same content is written in Chinese, in the same one-paragraph shape — never as a `Simple / Detailed` pair.

### Source Classification

**Source must name the specific bringer, never a bare category.** Shape: `bringer name + registration location + upstream/license`.

| Source form (examples) | Applies to |
|---|---|
| `built-in, official TUI docs` | built-in |
| `third-party plugin, opencode.jsonc:plugin[], source <repo> <license>` | npm plugin |
| `outer app official, install bundle <dir> + config $HOST_CONFIG/` | outer app (host) |
| `<plugin> package <src/skills/<name>>` | plugin-bundled skill |
| `<plugin> manages skill (skills-manifest.json, status <managed/customized>, v<version>)` | plugin-managed skill installed into the global skills dir |
| `local, upstream <repo> <license>` — **only with a verified repo URL** | genuinely user-authored skill |
| `global config command/<name>.md` | user command |
| `host-injected, found by binary scan of <bundle>` | outer-app-injected command |
| `<mcp-name> (remote MCP, <url>)` / `<mcp-name> (local MCP, <cmd>)` | MCP server |

> **A skill in the global skills dir is NOT automatically "local".** Many arrive from a plugin that installs and manages them. Before writing `local`, check the plugin self-managed manifest (e.g. `.oh-my-opencode-slim/skills-manifest.json`): a `status` of `managed`/`customized` with a `packageVersion` means the **plugin is the bringer**, not the user.
>
> **Never infer a repo URL from a skill's folder name.** A directory called `clonedeps` does not imply `github.com/<user>/clonedeps`. The `local, upstream <repo>` form requires a URL you actually saw (in the skill content, a manifest, or the plugin's config). If you cannot verify it, write the real bringer, or `local (repo unverified) ⚠️inferred` — never a fabricated URL.

Suffix every source with confidence: `✅verified` / `✅docs` / `⚠️inferred`. Append state:

| Marker | Meaning |
|---|---|
| `✅available` | actually invokable. |
| `❌disabled` | explicitly disabled in config; **quote the config line**. |
| `📦shelf-only` | marketplace/cache/docs only, not registered, not invokable. |
| `🚫absent` | absent everywhere. Never pad tables. |

> **State markers follow the output language**: use the exact marker strings from `references/glossary.json` for the target language (English: `✅available` / `❌disabled` / `📦shelf-only` / `🚫absent`).

Multi-source items: record the **direct bringer**; push indirect provenance into `What it does`. **Resolution vs disk:** on-disk-but-unregistered = unavailable (say so); registered-but-broken (missing command/env/probe fail) = `⚠️inferred` + failure class in a table note.

---

## Procedure

### 1. Discover (remap only this section on a new host/CLI)

1. **Declared config**: `$OPENCODE_CONFIG/opencode.jsonc`, `package.json:dependencies`, `tui.json` (may appear in either the user directory or the project directory — look them up fresh).
2. **User directory**: `$OPENCODE_CONFIG/command/`, first 15 lines of each `$OPENCODE_CONFIG/skills/*/SKILL.md`.
3. **Project overlay**: `$PROJECT_DIR/.opencode/`, project-level MCP/plugin additions.
4. **Plugin packages**: evidence sources are **remappable per host**. Try, in order:
   - **Installed plugin cache** (`$PACKAGE_CACHE/packages/*/`) — list `src/skills/` (packaged skills) AND scan `dist/*.js` for `registerCommand`/`COMMAND_NAME` hook registrations (plugin-registered `/` commands like `/loop` live there, not in `command/`).
   - **Plugin self-managed manifest** (e.g. `.oh-my-opencode-slim/skills-manifest.json`) — **read this before calling any global skill "local"**. It maps each managed skill to its `status` (`managed` / `customized`) and `packageVersion`, which names the plugin as the bringer and distinguishes `✅available` (synced to global skills) from `📦shelf-only` (in package but not synced).
   - **`package.json:dependencies`** and the plugin's own dist/hooks referenced from `opencode.jsonc:plugin[]`.

   Use whichever sources exist on the host being inventoried; never assume a single fixed path.
   > **Attribution rule:** for each skill found in the global skills dir, first ask "did a plugin install this?" — if a manifest lists it, or the skill's directory matches a plugin the config declares, the **plugin is the bringer** and the source is `<plugin> manages skill (skills-manifest.json, status …, v…)`, not `local`.
5. **Host-injected**: `$HOST_CONFIG/` settings, and a **binary-safe scan of the outer app bundle** for `/xxx` slash-command literals — plain grep misses binaries. The bundle may be `app.asar` (Electron), `web-dist`, or other formats depending on the outer app's tech stack. See `references/host-commands.md` for the scan method.
   > **Note**: outer app settings may live in Electron internal storage (DIPS/SQLite) with no standalone JSON file. If `$HOST_CONFIG/settings.json` is absent, say so in a table note — don't fabricate. The bundle scan still works regardless.
6. **MCP servers — enumerate ALL of them, never just one**: read every `mcp` key from the global config (`$OPENCODE_CONFIG/opencode.jsonc` → `mcp`), then the project overlay (`$PROJECT_DIR/.opencode/`), and merge. For each key you MUST emit a row — local and remote alike, enabled and disabled alike.
   - **Count assertion (mandatory):** after building Table 5, re-read the config's `mcp` object and compare its key count with your row count. They must match. If they differ, you dropped servers — go back and add them.
   - **Never stop at the first MCP.** A single-row Table 5 is a red flag, not a result: most setups have several (e.g. `websearch`, `context7`, `grep_app`, `pdf-mcp`, `PaddleOCR-VL-*`).
   - The config may not be strict JSON (comments / trailing commas) — strip `//` comments before parsing, or read the `mcp` block directly. Do not skip a server because the file fails to parse strictly.
   - A disabled server is still a row, with `❌disabled` and the config line quoted.
   - **Invocation paths, not a blanket "Agent calls it":** for each server note (a) that a human can ask for it by name (`use <name>`), (b) its tool-name prefix, (c) whether it exposes **MCP Prompts** (those become `/prompt-name` slash commands), and (d) whether it ships its own CLI/HTTP endpoint. Report what you verified; never assert "the human doesn't call it".
7. **Agent model chains**: read the plugin's preset file (`$OPENCODE_CONFIG/oh-my-opencode-slim.json` or equivalent → `preset` + `presets`). The active preset's `<agent>.model` gives each plugin agent's chain; an **array is the chain**, a string is a single model. Record the other preset names as backups. Do not guess — if the file is absent, write `unknown` for plugin agents.
8. **Runtime listing**: `opencode agent list` vs `opencode --pure agent list`, TUI `/` autocomplete. **Run the outer app's own opencode binary**, not the system-wide one — they can differ.

Path variables (common defaults — **verify against the actual host**):

| Variable | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| `$OPENCODE_CONFIG` | `~/.config/opencode/` | `$env:USERPROFILE\.config\opencode\` |
| `$PROJECT_DIR` | current working directory | current working directory |
| `$HOST_CONFIG` | `~/.config/<OuterApp>/` | `$env:APPDATA\<OuterApp>\` (OpenChamber was observed at `~/.config/openchamber/`, not `%APPDATA%` — trust what you observe) |
| `$PACKAGE_CACHE` | host-specific plugin cache dir | host-specific plugin cache dir |

> These are typical values, not guarantees. Always confirm against the machine being inventoried.

### 2. Verify

Cheapest first: (1) direct — TUI autocomplete, host browser, read-only listing, the two `agent list` commands; (2) official docs — `opencode.ai/docs/tui#commands` (full command list), `opencode.ai/docs/agents`; (3) source, last resort — plugin cache registration tables, host `agent-tool/*.js`, app bundles. Docs may lead the local version — local ground truth wins.

Versions/models/counts: look up fresh, order manifest → install-path → lockfile/marketplace → `unknown`. Never from memory.

Agent name handling: if a config-disabled agent name (e.g. `explore`) doesn't match the actual `agent list` name (e.g. `explorer`), **the `agent list` ground truth wins**. Note the mismatch in a table footnote and don't invent a row for the stale config name.

### 3. Error Handling

| Scenario | Action |
|---|---|
| Plugin cache unreadable | `🚫absent` + table note: `plugin cache unreadable (<error>)` |
| Outer app bundle scan fails | note the failure reason in a table note; skip that source, don't fabricate |
| `opencode agent list` returns empty | check `opencode --pure agent list`; if still empty, write "no selectable agents detected" |
| MCP server unreachable | `⚠️inferred` + note: `liveness probe failed (<error>)` |
| Config file missing or malformed | note the gap in a table note; don't guess defaults |
| Version unknown after all sources exhausted | write `unknown` — never invent |
| Language mismatch (user asks in English, config is Chinese) | follow the user's language for output; use English for technical terms |

**Rule:** When in doubt, write what you observed — never fabricate. A `⚠️inferred` with an explanation is always better than a confident `✅verified` on unverified data.

### 4. Empty tables

No content after verification → **do not invent, do not omit**: output `no usable rows in this table (as of <lookup date>)`; JSON = `[]`.

### 5. Output

- Every run writes **three files** into the **`output/` directory of the project
  being inventoried** — the current working directory (`$PROJECT_DIR`), created if
  missing. Not the skill's install location: the skill may live in a global config
  dir, but the output must always land in the user's project root so it ships with
  that project. Never write anywhere else:
  - `output/inventory.md` — the 7-table inventory below.
  - `output/usage-guide.md` — the how-to-use guide derived from the same rows.
  - `output/asset-inventory.json` — standalone JSON, one element per row.
- **Language follows the user**: every table header, cell value, state marker, and the usage guide must be written in the same language the user asked in (Chinese→Chinese, English→English, Japanese→Japanese, etc.). Never default to a fixed language. The 7-table *structure* and column *count* stay fixed (Tables 1-5/7 five columns, Table 6 six), but the header text, all cell content, state markers, and prose are translated into the user's language, using the exact fixed strings in `references/glossary.json`. For a language without a glossary entry, derive the strings from the `en` block and note it in Provenance. When in doubt, ask or mirror the last user message.
- Compact tables, blank line between tables, fixed headers, rows alphabetical (Table 2 grouped by software), one entry per cell.
- Format examples: see `references/format-example.md` (values there are placeholders — replace, never copy).
- **Usage Guide (`usage-guide.md`)**: after producing the 7 tables, derive a plain-language usage guide from the same rows. Do NOT re-collect evidence. Organize by user scenario, not by type. **Pick a mode first:** Mode A (generic) when the project is empty, Mode B (adapt the framing to the project, without over-coupling) when it already has real work. See `references/usage-guide.md` for both modes and the format.
- End: one-line mnemonic + **Provenance** (3 lines, in the output language; exact templates in `references/glossary.json` → `provenance`):
  ```
  Inventory time: <fill after scan> | Preset: <fill after scan> | Commands: `opencode agent list` + `opencode --pure agent list` run
  Unresolved: list honestly (e.g. plugin cache unreadable), or "none"
  Generated by asset-inventory (self-contained)
  ```
  Real-name mode adds a 4th line: `This output contains user-requested real project names — do not share externally.` (localized template: `references/glossary.json` → `provenanceRealName`).
- **JSON** (`output/asset-inventory.json`): standalone file, one element per row: `table, name, source, state, confidence, invoke`. PK = `table`+`name`. Empty table ⇒ `[]`.
  - **The `table` field is always the numeric `1`-`7`** (matching Tables 1-7) and **does not change with the output language** — this is what makes diff mode comparable across runs. The Markdown "Table N" heading serves human readers; the JSON number serves machines. Never write `Table 1` or any localized string there.
  - Group rows, table notes, and hidden agents are excluded from JSON; the JSON row set = the Markdown data-row set.
- **Masking**: default redact API keys, tokens, auth headers, absolute user paths, private project names. Real-name mode only on explicit request + Provenance line.
- **Diff mode**: user asks "what changed since last time" → ask them to paste the previous JSON/Markdown, output only added/removed, keyed by PK. Never re-dump full tables.

---

## Quality Checklist

Run the full checklist in **`references/checklist.md`** before outputting. Every item must pass.

---

## Anti-patterns

These behaviors make an inventory untrustworthy. Items already covered by the Quality Checklist are not repeated here.

- Inventing a version, model chain, count, or a `📦shelf-only` item to fill a table.
- Writing an inference as `✅verified`; writing "unknown" as a fact.
- Stopping Table 3 at one or two example commands instead of the full list.
- Cramming multiple commands into one cell, or merging distinct user commands into one row.
- Fabricating an MCP "related skill" you never verified.
- Listing only one MCP server and stopping — Table 5 must match the config's `mcp` key count. A one-row Table 5 means servers were dropped.
- Calling every MCP "Agent-only" ("the human doesn't call it") — a human reaches an MCP by asking its name in a prompt, MCP Prompts become `/prompt-name` slash commands, and some servers ship their own CLI/HTTP endpoint.
- Treating a user's casually-named software as fact — verify first (`📦`/`🚫` if absent).
- Writing a bare `plugin package`/`local` as a source without naming the actual plugin/software.
- Calling a plugin-managed skill "local" — check the plugin's `skills-manifest.json` (or the plugin config) first; the plugin is the bringer.
- Inventing an upstream repo URL from a skill's folder name (`clonedeps` → `github.com/<user>/clonedeps`). A repo form requires a URL you actually saw, else write the real bringer or `local (repo unverified) ⚠️inferred`.
- Skipping the binary scan of the outer app bundle — silently drops the whole host-injected class.
- Copying example rows from `references/format-example.md` as literal output.
- Editing any skill/command/agent/MCP/config during the inventory. Read-only.
- Scrambling Table 6 order (core primary should precede plugin primary; primary precedes subagent).
- Reporting every agent as "single model, no chain fallback" when the active preset actually lists arrays — read the preset file and expand each array into its chain.
- Omitting a known MCP alias/tool-name prefix from Table 5.
- Missing plugin-registered slash commands (`/loop`) because the scan stopped at `command/` and never read the plugin dist `hooks/`.
- Writing run output anywhere outside `output/` (baselines or state files onto the machine being inventoried).
