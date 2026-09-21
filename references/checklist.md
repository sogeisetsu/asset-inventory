# Quality Checklist

Run this checklist before outputting. Every item must pass.

> Moved out of `SKILL.md` in v1.4.0 so the rule body stays focused and this list can be read on its own. `SKILL.md` → Quality Checklist points here. The `Anti-patterns` section in `SKILL.md` deliberately does **not** repeat items already covered below.

---

## All Tables

- [ ] Exactly 7 tables; Tables 1-5/7 five columns, Table 6 six (including Model chain); headers consistent.
- [ ] Every `Source` names the specific bringer, with a confidence suffix.
- [ ] No skill in the global skills dir is called `local` until the plugin manifest has been checked — a `managed`/`customized` entry means the plugin is the bringer.
- [ ] No absolute paths, plaintext keys/tokens, or real project names (unless real-name mode + 4th Provenance line).
- [ ] Versions/models/counts looked up fresh.
- [ ] JSON PKs match Markdown data rows, no duplicates; the `table` field is the fixed numeric `1`-`7` (never localized strings).
- [ ] Empty tables have a declaration line + `[]`.
- [ ] The `Name` column is uniform per asset type: commands are bare `/command` (no "command" suffix), skills bare `skill-name` (no `/`), Table 2 rows bare child name (no plugin prefix), software real names. No mixed styles.
- [ ] Every `How to call` lists ALL real invocation paths. No bare "auto-triggers on intent".

## Table 1 — Plugins & companion software

- [ ] Software names are real names (e.g. `OpenChamber`), never placeholders.

## Table 2 — Skills & commands each software/plugin brings

- [ ] Commands sit in the right table (built-in→Table 3, plugin→Table 2, user→Table 4, host-injected→Table 4).
- [ ] No summary rows duplicating Table 1 software entries.

## Table 3 — Built-in commands & built-in skills

- [ ] Lists **all** built-in commands from the docs, not a handful.

## Table 4 — Custom skills, commands, and host-injected commands

- [ ] Includes outer-app-injected commands (source `host-injected`).
- [ ] This skill appears in Table 4.

## Table 5 — MCP

- [ ] **Row count equals the number of `mcp` keys in the config** (global + project merged). If you listed fewer, you dropped servers — go back.
- [ ] A single-row table has been double-checked against the config — it is the exception, not the norm.
- [ ] Every server is listed: local and remote, enabled and disabled (`❌disabled` with the config line quoted).
- [ ] Rows carry known aliases/tool-name prefixes (e.g. grep_app → `gh_grep`).

## Table 6 — Agents

- [ ] Every row has a concrete Model chain (`a→b→c`) **or** (for a core agent with no configured chain) the host's currently effective real model + a "single model, no chain fallback" note. Placeholder phrasing does not count.
- [ ] Row order: core primary → plugin primary → core subagent → plugin subagent, alphabetical within each group.

## Table 7 — Host capabilities

- [ ] No duplication with Table 1/Table 2; outer-app capabilities (non-command) → Table 7.

## What it does & Usage Guide

- [ ] Every `What it does` is **one detailed paragraph** (no `Simple: … Detailed: …` split) answering: how it is invoked, when to use it, and what happens after (with caveats). One-liners/labels do not pass.
- [ ] Tables 1/2/4/5/7 rows do NOT carry deletion consequences; `What it does` focuses on what/who/how/caveats.
- [ ] `usage-guide.md` is derived from the same rows — no re-collection, no invented facts; grouped by scenario/frequency; only `✅available` items; plain-language "when and why".
- [ ] The usage guide picked the right mode: generic (Mode A) for an empty project, project-anchored (Mode B) for a non-empty one — and in Mode B the tool facts are unchanged, with no real file paths or private code pasted in.

## Language & Fixed Strings

- [ ] Output language follows the user's last message.
- [ ] Fixed strings come verbatim from `references/glossary.json` for the chosen language (or, for a language with no entry, are derived from the `en` block and noted in Provenance).
- [ ] Provenance lines follow the output language; real-name mode adds the 4th line.
