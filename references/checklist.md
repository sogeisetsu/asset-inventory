# Quality Checklist

Run this checklist before outputting. Every item must pass.

> Moved out of `SKILL.md` in v1.4.0; `SKILL.md` points here. Anti-patterns are not repeated here. Terse acceptance pass: each item is a verdict; full rule text at the cited section.

---

## Evidence & Output Budget

- [ ] Verdict + supporting lines, never dumps (SKILL.md, Verify).
- [ ] No silent `-First N` cut; limits print pre-limit totals; noise excluded by name (SKILL.md, Verify).
- [ ] One sufficient source per fact; no second/third-source re-verification (SKILL.md, Verify).

## All Tables

- [ ] Exactly 7 tables; 1-5/7 five cols, Table 6 six incl. Model chain; headers consistent (SKILL.md, Output format).
- [ ] Every `Source` = specific bringer + confidence suffix (SKILL.md, Source Classification).
- [ ] No global-dir skill `local` before the plugin manifest check (SKILL.md, Discover step 4).
- [ ] Keys/tokens + real project names masked; every home path → `~`/`%USERPROFILE%` in Markdown and JSON; real-name mode = 4th Provenance line (SKILL.md, Masking).
- [ ] Unregistered skill-/plugin-like residue kept: `📦shelf-only` row or Provenance Unresolved + reason (SKILL.md, Discover step 4).
- [ ] Local-skill upstream from the lookup order; else `local (repo unverified) ⚠️inferred` — no fabricated URL (SKILL.md, Source Classification).
- [ ] `inventory.md` opens with the one-line Name legend (SKILL.md, Output → Name legend).
- [ ] Versions/models/counts looked up fresh (SKILL.md, Verify).
- [ ] JSON PKs = Markdown data rows, no dupes; `table` numeric `1`-`7` (SKILL.md, Output → JSON).
- [ ] Empty tables: declaration line + `[]` (SKILL.md, Empty tables).
- [ ] Name shape uniform per type, no mixed styles (SKILL.md, Cell Conventions).
- [ ] `How to call` = ALL real paths; no bare "auto-triggers on intent"; skill rows show `/skills` picker (SKILL.md, Cell Conventions).

## Table 1 — Plugins & companion software

- [ ] Software names real, never placeholders (SKILL.md, Table Overview).

## Table 2 — Skills & commands each software/plugin brings

- [ ] Commands in the right table: built-in→3, plugin→2, user→4, host-injected→4 (SKILL.md, Table Overview).
- [ ] No summary rows duplicating Table 1 software (format-example.md, Table 2 rules).
- [ ] Merge vs split by the same-package test; gate/wrapper described as a gate (format-example.md, Table 2 rules).

## Table 3 — Built-in commands & built-in skills

- [ ] ALL built-in commands from the docs, not a handful (SKILL.md, Table Overview).

## Table 4 — Custom skills, commands, and host-injected commands

- [ ] Outer-app-injected commands included, source `host-injected` (SKILL.md, Table Overview).
- [ ] Host commands cross-checked vs Pass 1 registry union; typed names from registry `id`/`name` (SKILL.md, Discover step 5).
- [ ] This skill appears in Table 4 (SKILL.md, Table Overview).

## Table 5 — MCP

- [ ] Row count = `mcp` key count, global + project merged; fewer = dropped servers (SKILL.md, Discover step 6).
- [ ] Single-row table re-checked against config — exception, not the norm (SKILL.md, Discover step 6).
- [ ] Every server listed: local/remote, enabled/disabled (`❌disabled` + config line) (SKILL.md, Discover step 6).
- [ ] Probe failure = `🛑broken` + quoted error in note; never dropped, never `✅available` (SKILL.md, Verify).
- [ ] Known alias/tool prefix carried (grep_app → `gh_grep`) (SKILL.md, Table Overview).
- [ ] MCP rows: all real invocation paths; never "Agent calls it"/"human doesn't call it" (SKILL.md, Cell Conventions).

## Table 6 — Agents

- [ ] Chain `a→b→c`, or core-only host model + "single model, no chain fallback" (SKILL.md, Cell Conventions).
- [ ] Array presets expanded to chains, not flattened; several "single model" → re-read preset (SKILL.md, Cell Conventions).
- [ ] Row order: core primary → plugin primary → core subagent → plugin subagent, alphabetical in group (format-example.md, Table 6 rules).
- [ ] Config-disabled agents absent from `agent list` = note with config key, not rows; watch `explore`/`explorer` (SKILL.md, Verify).

## Table 7 — Host capabilities

- [ ] No duplication with Tables 1/2; non-command outer-app capabilities → Table 7 (SKILL.md, Table Overview).

## What it does & Usage Guide

- [ ] `What it does` = one paragraph (no Simple/Detailed split): invoke, when, after + caveats; no one-liners (SKILL.md, What-it-does format).
- [ ] No deletion consequences in rows; cell stays what/who/how/caveats (SKILL.md, What-it-does format).
- [ ] Usage guide from the same rows — no re-collection; scenario/frequency; only `✅available`; plain language (SKILL.md, Output → Usage Guide).
- [ ] Right mode: A empty project vs B non-empty — tool facts unchanged, no real paths/private code (SKILL.md, Output → Usage Guide).

## Language & Fixed Strings

- [ ] Output language follows the user's last message (SKILL.md, Output Language).
- [ ] Fixed strings verbatim from `references/glossary.json`, else derived from `en` + noted in Provenance (SKILL.md, Output Language).
- [ ] Provenance in the output language; real-name mode adds the 4th line (SKILL.md, Output → Provenance).
