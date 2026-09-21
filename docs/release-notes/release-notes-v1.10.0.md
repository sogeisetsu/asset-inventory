<!--
  Release notes for v1.10.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.10.0-ZH.md
  Release: v1.10.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.10.0

This release is a documentation-site pass plus a repository tidy-up. The inventory logic and 7-table structure are unchanged.

## What's New

- **Release notes in their own folders** — `docs/release-notes/` and `zh/release-notes/`, instead of loose files at the root of `docs/` and `zh/`. `check-docs`'s pair table, the CONTRIBUTING/repository trees, and every cross-link were updated.

## Fixes / Consistency

- **Language stacking fixed** — the docs language toggle grouped translations by `className`, which included the `.i18n-on` class it had just added; a second switch split each slot and rendered several languages at once. Grouping now ignores `i18n-on`, so every slot shows exactly one language.
- **Language choice is per-tab** — the toggle now uses `sessionStorage` instead of `localStorage`, so a fresh visit always starts in English while a choice still carries across pages within the same tab.
- **Detail pages cleaned up** — removed the file-path bar above each rendered sample, added real cell borders to the `.facts` tables, and capped the JSON sample's height with a scrollbar.
- **`build-sample-pages --check` is line-ending agnostic** — it normalizes CRLF before comparing, so a fresh Windows checkout is never reported as out of date.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).