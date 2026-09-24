<!--
  Release notes for v1.13.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.13.0-ZH.md
  Release: v1.13.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.13.0

A new `🛑broken` state marker for registered-but-uninvokable assets, visible safety checkpoints, and output/provenance rules that finally match targeted modes. The 7-table structure and the inventory logic are unchanged.

## Added

- **5th state marker `🛑broken` (7 locales)** — for an asset that is registered in config but not invokable (missing command / env / probe fail): source reads `⚠️inferred` + state `🛑broken`, with the failure class quoted in a table note. Available in all seven glossary languages (en/zh/ja/ko/ru/ar/es), wired into the state-marker table, the `MCP server unreachable` error branch, the usage-guide exclusion list, and the checklist. Previously a probe-failing server had no honest marker: `✅available` claims it is invokable and `❌disabled` would misquote the config.
- **Three visible checkpoint markers** — the diff paste gate 🔴, the real-name gate 🔴, and the masking STOP 🛑 now stand out as visible markers at their gates instead of reading as plain prose.

## Changed

- **File output matches the run type** — a full scan writes the three files into `output/`; targeted modes (`mcp` / `agents` / `hosts` / `skills`) write only `inventory.md` + JSON, `usage` writes only `usage-guide.md`, and `diff` writes no files (it answers in the chat; a file is written only if you explicitly ask). "Never write outside `output/`" remains absolute.
- **Targeted-mode provenance rule** — the provenance template describes a full scan; in targeted modes any skipped field reads `not scanned (<target> target)` / `skipped (<target> target)`, so the footer never claims a command that was not run.
- **New failure branch for unparseable pastes** — when a pasted diff JSON/Markdown cannot be parsed, the skill asks for a re-paste or falls back to comparing the Markdown tables, instead of guessing; it never invents PK rows.
- **Rules tidied, examples corrected** — Table 2/Table 6 rules moved out of the overview cells into dedicated sections (model-chain exemption stated once), every `format-example.md` Source cell now carries its confidence + state suffixes, and Error Handling links the troubleshooting guide.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
