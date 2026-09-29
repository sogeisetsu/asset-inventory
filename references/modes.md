# Targeted modes & diff protocol

> Read this file only when a target/mode argument is present (`mcp` | `agents` | `hosts` | `skills` | `usage`) or the run is diff mode; a no-argument full scan does not need it.

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
- **Paste gate:** diff (argument form or natural language) starts here: ask the user to paste the previous JSON, then run the full diff protocol under **Diff mode** below. Never re-dump full tables.
- `usage` still does a full scan (the usage guide must derive from the same rows), but only writes `usage-guide.md`, not `inventory.md` or JSON.
- Unrecognized target → fall back to full scan and note "unknown target, fell back to full scan" at the end.

## Diff mode

- **Diff mode**: user asks "what changed since last time" → ask them to paste the previous JSON/Markdown (answer in the chat; diff writes no files unless explicitly asked). Full protocol:
  1. **Scope**: compare ONLY the tables whose numeric ids appear in the pasted baseline JSON — re-collect just those tables' evidence, never a full 7-table scan. If the baseline lacks any of tables 1–7, end the output with a one-line scope note: `Scope: tables <present> compared; tables <absent> not in baseline — not compared.`
  2. **Partial-baseline caveat**: for any compared table where the baseline row count < the current row count, add: `Baseline may be incomplete for table <n> (<b> rows vs <c> now) — verify before treating all differences as newly added.`
  3. **Row shape**: output two sections, `Added` and `Removed`, each a markdown table with columns `Table | Name | State` (Table = numeric id, Name = PK name, State = the current state marker for Added / the baseline state marker for Removed). Never re-dump full rows or full tables.
     **State flips:** if a PK exists in both versions but only its state marker differs, it is neither Added nor Removed — append a one-line note directly under the tables: `state changed: <table>|<name> <baseline marker> → <current marker>` (e.g. `state changed: 5|websearch ✅available → ❌disabled`). Never list it as a new row, and never drop it silently.
  4. **Ending**: finish with the standard 3-line Provenance (language rule unchanged), where fields not collected in diff mode follow the targeted-mode rule (`not scanned (diff)`); the scope note from (1) goes immediately before it. No new glossary keys.
