# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.0] - Unreleased

### Added
- **Quick Reference section** in SKILL.md — workflow summary at a glance (one-line trigger, three output files, scanning modes).
- **Error handling guidance** in Procedure section — concrete actions for common failure scenarios (plugin cache unreadable, outer app scan fails, MCP unreachable, etc.).
- **CHANGELOG.md** — this file.
- **CONTRIBUTING.md** — contribution guidelines.

### Changed
- **SKILL.md restructured** — separated Table Overview, Cell Conventions, and Source Classification into distinct subsections for better scannability; Quality Bar converted from numbered list to checklist format; added "干什么" good/bad example directly in cell conventions.
- **update.ps1 improved** — added backup step before overwrite (auto-backup to `backup.<timestamp>/`), `-NoBackup` switch, better error messages for missing sources, reads 15 lines of frontmatter instead of 10 for robustness.

### Removed
- Removed "Disposal note" section (marked as removed in v1.1.0, now fully deleted).

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
