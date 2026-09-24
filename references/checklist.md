# Quality Checklist

Run this checklist before outputting. Every item must pass.

> Moved out of `SKILL.md` in v1.4.0; `SKILL.md` points here. Anti-patterns are not repeated here.

---

## Evidence & Output Budget

- [ ] Evidence commands returned verdicts + supporting lines, not dumps: no full permission arrays, no full SKILL.md bodies, no unique-token lists, no unfiltered directory recursion.
- [ ] No silent truncation (`-First N`-style cuts); any limit prints the pre-limit total; known-noise patterns excluded by name, not by cap.
- [ ] Each fact backed by exactly one sufficient source — no second/third-source re-verification of the same fact (manifest + README + `git remote` for one URL = one lookup).

## All Tables

- [ ] Exactly 7 tables; Tables 1-5/7 five columns, Table 6 six (including Model chain); headers consistent.
- [ ] Every `Source` names the specific bringer, with a confidence suffix.
- [ ] No global-dir skill is `local` until the plugin manifest is checked (managed/customized → plugin is the bringer).
- [ ] No plaintext keys/tokens, masks real project names, and normalizes **every** home path to `~` / `%USERPROFILE%` in the Markdown **and** the JSON (real-name mode is the only exception, with the 4th Provenance line).
- [ ] Unregistered skill-/plugin-like residue (has `SKILL.md`/`plugin.json`/`marketplace.json` but is not referenced by the config) is not dropped silently — it is `📦shelf-only` in a table or named in the Provenance Unresolved line, with the observed reason.
- [ ] A local skill's upstream came from the documented lookup order (manifest → config-root sibling checkout → skill README → host marketplace cache → other client dirs → description attribution); if unverified, the source reads `local (repo unverified) ⚠️inferred` — no fabricated URL.
- [ ] `inventory.md` opens with a one-line Name legend (`/command` = a command you type; bare name = a skill or another asset).
- [ ] Versions/models/counts looked up fresh.
- [ ] JSON PKs match Markdown data rows, no duplicates; the `table` field is the fixed numeric `1`-`7` (never localized strings).
- [ ] Empty tables have a declaration line + `[]`.
- [ ] Name column uniform per type: `/command` (no "command" suffix), `skill-name` (no `/`), Table 2 bare child name, software real names. No mixed styles.
- [ ] Every `How to call` lists ALL real invocation paths. No bare "auto-triggers on intent"; skill rows show the `/skills` picker path, not only `/skill-name`.

## Table 1 — Plugins & companion software

- [ ] Software names are real names (e.g. `OpenChamber`), never placeholders.

## Table 2 — Skills & commands each software/plugin brings

- [ ] Commands sit in the right table (built-in→Table 3, plugin→Table 2, user→Table 4, host-injected→Table 4).
- [ ] No summary rows duplicating Table 1 software entries.
- [ ] Merge vs split: same-package skill+same-named command = one row; separately-authored = two rows; gate/wrapper described as gate.

## Table 3 — Built-in commands & built-in skills

- [ ] Lists **all** built-in commands from the docs, not a handful.

## Table 4 — Custom skills, commands, and host-injected commands

- [ ] Includes outer-app-injected commands (source `host-injected`).
- [ ] This skill appears in Table 4.

## Table 5 — MCP

- [ ] **Row count equals the number of `mcp` keys in the config** (global + project merged). If you listed fewer, you dropped servers — go back.
- [ ] A single-row table has been double-checked against the config — it is the exception, not the norm.
- [ ] Every server is listed: local and remote, enabled and disabled (`❌disabled` with the config line quoted).
- [ ] A server whose probe (spawned with the config's env/headers) failed is listed as `🛑broken` with the probe error quoted in a table note — never silently dropped, never `✅available`.
- [ ] Rows carry known aliases/tool-name prefixes (e.g. grep_app → `gh_grep`).
- [ ] Every MCP row lists real invocation paths — ask-by-name, tool prefix, MCP Prompt if exposed, own CLI/HTTP if shipped — never "Agent calls it" / "human doesn't call it".

## Table 6 — Agents

- [ ] Every row has a concrete chain (`a→b→c`) or (core agent only, no chain) the host's real model + "single model, no chain fallback" note.
- [ ] Array-valued preset entries expanded into chains, not flattened. If several read "single model", re-read the preset.
- [ ] Row order: core primary → plugin primary → core subagent → plugin subagent, alphabetical within each group.
- [ ] Config-disabled agents absent from `agent list` are named in the table note with their config key, not invented as rows (watch `explore` vs `explorer`).

## Table 7 — Host capabilities

- [ ] No duplication with Table 1/Table 2; outer-app capabilities (non-command) → Table 7.

## What it does & Usage Guide

- [ ] Every `What it does` is one detailed paragraph (no Simple/Detailed split) covering: how invoked, when to use, what happens after (caveats). One-liners/labels fail.
- [ ] Tables 1/2/4/5/7 rows do NOT carry deletion consequences; `What it does` focuses on what/who/how/caveats.
- [ ] Derived from the same rows — no re-collection, no invented facts; by scenario/frequency; only `✅available`; plain-language.
- [ ] Picked the right mode: generic (Mode A) for empty project, project-anchored (Mode B) for non-empty — Mode B keeps tool facts unchanged, no real paths or private code.

## Language & Fixed Strings

- [ ] Output language follows the user's last message.
- [ ] Fixed strings come verbatim from `references/glossary.json` for the chosen language (or, for a language with no entry, are derived from the `en` block and noted in Provenance).
- [ ] Provenance lines follow the output language; real-name mode adds the 4th line.
