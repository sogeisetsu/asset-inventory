<!--
  Release notes for v1.6.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.6.0-ZH.md
  Release: v1.6.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.6.0

Three real bugs fixed, a cleaner output format, and a landing page that explains each deliverable. The inventory logic and 7-table structure are unchanged.

## Fixed

- **MCP servers were silently dropped.** The skill listed one MCP server and stopped, even when the config had five (`websearch`, `context7`, `grep_app`, `pdf-mcp`, `PaddleOCR-VL-*`). `Discover` now has an explicit MCP step that reads every `mcp` key and **asserts the row count against the config's key count** — a one-row Table 5 is now a red flag in both the table spec and the checklist.
- **`update.ps1` nested directories.** `Copy-Item -Recurse` into an existing target nested the source inside it, so repeated updates grew `references/references/…`. The target is removed before copying now.
- **`update.ps1` backup step failed and polluted the install.** The backup dir was never created (write error), and backups landed *inside* the skill directory. They now go to a sibling directory, created before use.

## Changed

- **`What it does` is one detailed paragraph** — no more `Simple: … Detailed: …`. Each cell covers how it is invoked, when to use it, and what happens after.
- **Usage guide has two modes** — generic for an empty project (Mode A), project-anchored for a non-empty one (Mode B) without over-coupling.
- **Chinese column renamed** — the invocation column's Chinese header changed from its old colloquial form to a more formal term.
- **`check-docs.mjs` validates HTML links.**

## Added

- **English-first landing page** with a persistent language toggle.
- **Detail pages** for each of the three deliverables, linked as cards, each with a description and a real example.
- **Favicon**, plus shared `style.css` and `lang.js`.

## Verification

- `update.ps1`: simulated a messy install (nested `references/references/` + stale `examples/`) — after update: 7 clean files, no nesting, backup in a sibling dir.
- `check-docs`: 0 errors. New HTML-link check confirmed to catch a broken link.
- The local install was upgraded from the stale 1.2.0 to the current version with the fixed script.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
