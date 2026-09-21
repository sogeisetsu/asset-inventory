# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.4.0] - 2026-09-21

### Added
- **PR-triggered docs check** (`.github/workflows/docs-check.yml`) — runs `node --check` on the scripts and `node scripts/check-docs.mjs` on every pull request to `master` (and on push), so PRs finally get a real gate instead of the deploy-only workflow.
- **Version-consistency check** in `check-docs.mjs` — reads `metadata.version` from the `SKILL.md` frontmatter and fails if it disagrees with the top release heading in `CHANGELOG.md` or `zh/CHANGELOG-ZH.md`.
- **Glossary-structure check** in `check-docs.mjs` — every language block in `references/glossary.json` must expose the same key set as the `en` block; reports missing or extra keys per language.
- **Japanese glossary entries** (`references/glossary.json` → `ja`) — the fixed-string promise now holds for `en` / `zh` / `ja`, with an explicit fallback rule for any other language.
- **`references/checklist.md`** — the full Quality Checklist, moved out of `SKILL.md` so the rule body stays focused; `SKILL.md` now points to it.
- **`update.ps1 -DryRun`** — previews exactly which runtime files would be copied and writes nothing.
- **Troubleshooting entries** — Table 6 row-order self-check, non-glossary language handling, and the stale local-copy warning explained.

### Changed
- **`SKILL.md` language promise narrowed and made honest** — it no longer claims every language has fixed strings; `en` / `zh` / `ja` are verbatim from the glossary, any other language derives its strings from the `en` block and says so in Provenance.
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** — versioning section now names the three places that must stay in lockstep and the exact glossary key set a new language needs.
- **`SKILL.md` trimmed** — the inline Quality Checklist (42 lines) moved to `references/checklist.md`.

### Fixed
- **v1.3.0 release date** in `CHANGELOG.md` and `zh/CHANGELOG-ZH.md` corrected from `2026-09-13` to the actual release day `2026-09-21`.

---

## [1.3.0] - 2026-09-21

### Added
- **Chinese doc set** (`zh/`) — `CONTRIBUTING-ZH.md`, `CHANGELOG-ZH.md`, and `release-notes-v1.1.0-ZH.md`, paired with the English docs at the repo root.
- **Docs validation script** (`scripts/check-docs.mjs`) — resolves relative Markdown links and `<img src>`, checks the EN/ZH pair table, warns on one-sided edits, validates frontmatter, and flags CJK in English docs.
- **Asset generator** (`scripts/generate-assets.mjs`) — regenerates the local SVG icon, banner, and badges into `assets/` (no external CDN).
- **README visual header** — centered local-SVG icon → title → tagline → badge row → language links → banner.
- **English-first skill content** — `SKILL.md`, `references/`, and `examples/` rewritten in English; the frontmatter `description` is now pure English.
- **Explicit Output Language section** in SKILL.md — output follows the user's language (a Chinese request yields Chinese output), while the skill's own instructions stay English.
- **Chinese reference license** (`zh/LICENSE-ZH.txt`) — a non-official OpenAtom Foundation translation, carrying a disclaimer that the root English `LICENSE` governs.
- **Chinese banner** (`assets/banner-zh.svg`) — a Chinese-subtitle banner used by `README-ZH.md`.
- **Localization glossary** (`references/glossary.json`) — a machine-readable map of fixed output strings per language (headers, state markers, confidence suffixes, table titles, empty-table/unknown strings, provenance), so localized output stays consistent and diff-comparable.
- **Prominent language rule** — a callout directly under the title states that output follows the user's language.
- **Quick Reference section** in SKILL.md — workflow summary at a glance (one-line trigger, three output files, scanning modes).
- **Error handling guidance** in Procedure section — concrete actions for common failure scenarios (plugin cache unreadable, outer app scan fails, MCP unreachable, etc.).
- **"what it does" column format subsection** — dedicated section for the most critical cell format rule, with clear source priority and forbidden patterns.
- **PowerShell scan method** in `references/host-commands.md` — added PowerShell equivalent alongside existing Node.js code.
- **Troubleshooting guide** (`references/troubleshooting.md`) — common issues and solutions.
- **CHANGELOG.md** — this file.
- **CONTRIBUTING.md** — contribution guidelines.

### Changed
- **README install guidance** — both READMEs now prominently recommend a global install at the top of the Install section, explaining why (one copy to install and update, available everywhere) and the effect (usable in every project and session; output still lands in the current project).
- **Options kept at the repo root** — `update.ps1` stays where it is (it is the user-facing one-command updater); `scripts/` holds dev tooling only (`check-docs.mjs`, `generate-assets.mjs`).
- **`check-docs.mjs` CJK scope widened** — now also enforces English on `SKILL.md`, `references/`, and `examples/`; only the local `AGENTS.md` stays exempt.
- **`references/troubleshooting.md`** — the version-read note now points at `metadata.version`.
- **Chinese read-along** (`zh/skill-zh.md`) — a local-only (gitignored) Chinese version of `SKILL.md`.
- **Repository restructured** per the repo-init convention — English docs at the root, `README-ZH.md` at the root, and all other Chinese docs under `zh/`; `README-zh.md` renamed to `README-ZH.md`.
- **`SKILL.md` frontmatter reconciled** — `version` moved under `metadata.version`, since OpenCode recognizes only `name`, `description`, `license`, `compatibility`, and `metadata`; `update.ps1` still reads it.
- **Release notes split by language** — English in `docs/release-notes-v1.1.0.md`, Chinese moved to `zh/release-notes-v1.1.0-ZH.md`.
- **Fixed a broken relative link** in `docs/release-notes-v1.1.0.md` (`LICENSE` → `../LICENSE`).
- **`.gitignore`** — added `/AGENTS.md` and the local-only Chinese guides (`zh/skill-zh.md`, `zh/repo-init-guide-zh.md`).
- **CONTRIBUTING.md** — added a canonical-terms section and the docs-check command; refreshed the file-structure tree.
- **SKILL.md restructured** — separated Table Overview, Cell Conventions, and Source Classification into distinct subsections for better scannability.
- **Quality Checklist restructured** — grouped by table (All Tables, Table 1, Table 2, ..., Table 7, "what it does" & usage guide) for easier per-table verification.
- **Anti-patterns deduplicated** — removed items already covered by Quality Checklist; added note explaining the relationship.
- **Provenance format** — now includes both Chinese and English templates, follows output language rule.
- **Quick Reference "how to use"** — expanded from "invocation path" to "when to use + invocation path" to match the original definition.
- **Targeting section** — unified to English headers for consistency with other sections.
- **Output section** — condensed to avoid duplicating Quick Reference; now references format-example.md for details.
- **update.ps1 improved** — added auto-create target directory, backup step before overwrite, `-NoBackup` switch, better error messages.
- **host-commands.md rewritten** — removed hardcoded command list (contradicted "always scan fresh" philosophy); now provides scan methods only, with generic support for Electron/Tauri/native outer apps.
- **Outer app scanning generic** — removed OpenChamber-specific assumptions; source classification now uses the `host-injected, found via binary scan of <bundle>` format.

### Removed
- Removed "Disposal note" section (marked as removed in v1.1.0, now fully deleted).
- Removed hardcoded command list from host-commands.md (was causing AI to skip actual scanning).

---

## [1.2.0] - 2026-09-08

### Added
- Targeting parameter routing (`/asset-inventory <target>`).
- Diff mode for comparing inventory across runs.
- Usage guide output (`usage-guide.md`).
- Real-name mode with 4th provenance line.

### Changed
- Hardened SKILL.md with explicit output section, state markers that follow output language.
- Plugin evidence sources now remappable per host.

---

## [1.1.0] - 2026-09-07

### Added
- Rewritten README (EN + ZH) with clearer install/update instructions.
- GitHub Pages landing page (`docs/index.html`).
- `.ignore` file for deepwork state.
- Non-slash magicPrompts key documentation in `references/host-commands.md`.

### Changed
- State markers now follow output language (not hardcoded Chinese).
- Plugin discovery falls back to manifests when cache is absent.
- Host-injected command inventory scans full `magicPrompts` key set.
- Removed duplicate Quality Bar entries.

---

## [1.0.0] - 2026-09-06

### Added
- Initial release with 7-table inventory structure.
- Source classification system (three-part provenance).
- Cross-platform path variables (macOS/Linux/Windows).
- Format examples and usage guide references.
