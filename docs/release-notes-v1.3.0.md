<!--
  Release notes for v1.3.0 (English). Paste into the GitHub Release body.
  Chinese version: zh/release-notes-v1.3.0-ZH.md
  Release: v1.3.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.3.0

This release makes the repository English-first, adds a paired Chinese doc set, and introduces tooling that keeps the docs honest. The inventory logic and 7-table structure are unchanged.

## What's New

- **English-first skill content** — `SKILL.md`, `references/`, and `examples/` are rewritten in English; the frontmatter `description` is now pure English.
- **Explicit Output Language section** — output follows the user's language (a Chinese request yields Chinese output), while the skill's own instructions stay English.
- **Chinese doc set (`zh/`)** — `CONTRIBUTING-ZH.md`, `CHANGELOG-ZH.md`, and `release-notes-v1.1.0-ZH.md`, paired with the English docs at the repo root.
- **Localization glossary** (`references/glossary.json`) — a machine-readable map of fixed output strings per language (headers, state markers, confidence suffixes, table titles, empty-table/unknown strings, provenance), so localized output stays consistent and diff-comparable.
- **Docs validation script** (`scripts/check-docs.mjs`) — resolves relative Markdown links and `<img src>`, checks the EN/ZH pair table, warns on one-sided edits, validates frontmatter, and flags CJK in English docs.
- **Asset generator** (`scripts/generate-assets.mjs`) — regenerates the local SVG icon, banner, and badges into `assets/` (no external CDN).
- **README visual header** — centered local-SVG icon → title → tagline → badge row → language links → banner.
- **Quick Reference section** in `SKILL.md` — workflow summary at a glance (one-line trigger, three output files, scanning modes).
- **Error handling guidance** — concrete actions for common failure scenarios (plugin cache unreadable, outer-app scan fails, MCP unreachable).
- **Troubleshooting guide** (`references/troubleshooting.md`) and a PowerShell scan method in `references/host-commands.md`.
- **Chinese reference license** (`zh/LICENSE-ZH.txt`) — a non-official OpenAtom Foundation translation; the root English `LICENSE` governs.

## Changed / Fixes

- **Repository restructured** — English docs at the root, `README-ZH.md` at the root, all other Chinese docs under `zh/`.
- **README install guidance** — both READMEs recommend a global install at the top of the Install section and explain why.
- **Outer-app scanning generic** — removed OpenChamber-specific assumptions; source classification now uses the `host-injected, found via binary scan of <bundle>` format.
- **`host-commands.md` rewritten** — removed the hardcoded command list (it contradicted the "always scan fresh" philosophy); it now provides scan methods only.
- **`SKILL.md` restructured** — Table Overview, Cell Conventions, and Source Classification split into distinct subsections; Quality Checklist grouped per table.
- **`SKILL.md` frontmatter reconciled** — `version` moved under `metadata.version`.
- **Provenance format** — now includes both Chinese and English templates, following the output-language rule.
- **`update.ps1` improved** — auto-creates the target directory, backs up before overwrite, adds a `-NoBackup` switch and clearer error messages.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../LICENSE).
