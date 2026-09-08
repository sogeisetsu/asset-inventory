# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.3.0] - Unreleased

> 此版本尚未发布。frontmatter 中的 version 应保持为上一发布版本，或改为 `1.3.0-dev`。

### Added
- **Quick Reference section** in SKILL.md — workflow summary at a glance (one-line trigger, three output files, scanning modes).
- **Error handling guidance** in Procedure section — concrete actions for common failure scenarios (plugin cache unreadable, outer app scan fails, MCP unreachable, etc.).
- **干什么格式要求 subsection** — dedicated section for the most critical cell format rule, with clear source priority and forbidden patterns.
- **PowerShell scan method** in `references/host-commands.md` — added PowerShell equivalent alongside existing Node.js code.
- **Troubleshooting guide** (`references/troubleshooting.md`) — common issues and solutions.
- **CHANGELOG.md** — this file.
- **CONTRIBUTING.md** — contribution guidelines.

### Changed
- **SKILL.md restructured** — separated Table Overview, Cell Conventions, and Source Classification into distinct subsections for better scannability.
- **Quality Checklist restructured** — grouped by table (All Tables, 表1, 表2, ..., 表7, 干什么 & 使用指南) for easier per-table verification.
- **Anti-patterns deduplicated** — removed items already covered by Quality Checklist; added note explaining the relationship.
- **Provenance format** — now includes both Chinese and English templates, follows output language rule.
- **Quick Reference "怎么用"** — expanded from "调用路径" to "何时用 + 调用路径" to match original definition.
- **Targeting section** — unified to English headers for consistency with other sections.
- **Output section** — condensed to avoid duplicating Quick Reference; now references format-example.md for details.
- **update.ps1 improved** — added auto-create target directory, backup step before overwrite, `-NoBackup` switch, better error messages.

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
