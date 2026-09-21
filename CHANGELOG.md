# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.9.0] - 2026-09-22

### Added
- **Sample-page generator** — `scripts/build-sample-pages.mjs` renders `docs/samples/` into the three detail pages (Markdown tables, full Markdown, and pretty-printed JSON); CI runs it with `--check`, so a stale page fails the build.
- **English sample output** at `docs/samples/`; the Chinese set moved to `docs/samples/zh/`.

### Changed
- **Detail-page examples are rendered, not raw code blocks** — `usage-guide.html` shows real HTML, `asset-inventory-json.html` shows indented JSON, `inventory.html` shows its table.
- **Human-readable localized page titles** — the detail pages no longer put the bare filename in the `<h1>` or tab title.

### Fixed
- Detail pages no longer go blank for a language without a translated sample: the English sample renders as the fallback.

---

## [1.8.0] - 2026-09-22

### Added
- **Seven fixed-string languages** — `references/glossary.json` now ships `ko` (Korean), `ru` (Russian), `ar` (Arabic), and `es` (Spanish) alongside `en` / `zh` / `ja`, each with the same 10-key shape as `en`. `SKILL.md` advertises all seven, so a request in any of them uses the glossary strings verbatim instead of deriving them from the English block.

---

## [1.7.4] - 2026-09-22

### Fixed
- **Docs site showed a bare frame with no content for ja/ko/ru/ar/es.** Untranslated body content is now resolved at runtime: `lang.js` groups consecutive `data-lang` siblings into translation slots and shows the chosen language, falling back to English when that language has no translation. Frame and headings stay in the chosen language; the install prompts were wrapped per language so only the selected one shows.

---

## [1.7.3] - 2026-09-22

### Added
- **"Install via AI" section** in all seven READMEs, reusing the localized install prompts from the landing page.

### Changed
- **README layout** — the non-English/Chinese READMEs (`README-JA/KO/RU/AR/ES.md`) moved into `readmes/`; the root now holds only `README.md` and `README-ZH.md`. Relative links, the language switcher, the docs check, and the repository-layout guide were updated.
- **README titles** — dropped the 🗃️ emoji from every README H1.

---

## [1.7.2] - 2026-09-22

### Fixed
- **MCP invocation was described as Agent-only.** The skill and every sample claimed a human never calls an MCP server. `SKILL.md` now requires listing all real paths — ask-by-name (`use context7`), the Agent's tool call (`<server>_<tool>`), an MCP Prompt registered as `/prompt-name`, or the server's own CLI/HTTP endpoint — and forbids blanket "the human doesn't call it" claims. `references/checklist.md` gained a matching item, and all samples (`inventory.md`, `usage-guide.md`, `asset-inventory.json`, the docs-site examples) were updated.

---

## [1.7.1] - 2026-09-22

### Added
- **`TODO.md` / `zh/TODO-ZH.md`** — a bilingual, living rollout plan so a fresh session can see which release is in flight and what comes next.

### Changed
- **Tag/release policy clarified** (`CONTRIBUTING.md`, `zh/CONTRIBUTING-ZH.md`) — every change gets the tag for its own level: a patch-level change gets a patch tag (tag only, no Release), while minor/major changes get their tag plus a GitHub Release. A patch-level change must not be held back to bundle into a later minor.

---

## [1.7.0] - 2026-09-22

### Added
- **Seven-language documentation** — the landing page and all detail pages now support English, Chinese, Japanese, Korean, Russian, Arabic (with RTL), and Spanish; the choice persists across pages.
- **Localized READMEs** — `README-JA.md`, `README-KO.md`, `README-RU.md`, `README-AR.md`, `README-ES.md`, joining the English and Chinese ones, each cross-linking the full set.
- **`docs/guides/`** — long-form documentation (`how-it-works.md`, `install-and-update.md`, `repository-and-contributing.md`), linked from the READMEs.
- **`docs/samples/`** — published example output (`inventory.md`, `usage-guide.md`, `asset-inventory.json`), linked from the READMEs so users can see the final artifacts.
- **Material Design 3 restyle** for the landing and detail pages (color roles, elevation, shape scale, segmented language toggle).
- **New `check-docs` validations** — HTML `href`/`src` links, and a check that all seven localized READMEs exist and cross-link.

### Changed
- **READMEs slimmed** — both the English and Chinese README are now concise landing pages with emoji; detail moved into `docs/guides/`.
- **Landing-page examples are rendered** — the inventory sample shows as a real table and the JSON as line-by-line records, instead of raw code blocks.
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** — document the commit-granularity rule and the tag/release policy (PATCH = tag only; MINOR/MAJOR = tag + Release).

### Fixed
- **Copy-button feedback** on the docs site followed a hardcoded Chinese string even in English; it now follows the active language.

---

## [1.6.1] - 2026-09-22

### Fixed
- **Plugin-managed skills were misattributed as "local".** `oh-my-opencode-slim@2.2.18` manages 8 skills (`simplify`, `codemap`, `clonedeps`, `deepwork`, `verification-planning`, `reflect`, `oh-my-opencode-slim`, `worktrees`) via `.oh-my-opencode-slim/skills-manifest.json`. The skill never read that manifest, so it fell back to `local, integrated/upstream <repo>` and **invented** `github.com/sogeisetsu/<name>` from the folder name. `Discover` now reads the plugin manifest; `local, upstream <repo>` requires a verified URL; never infer a repo from a folder name.
- **Every agent was reported as "single model, no chain fallback".** The active preset (`jibei-factory`) uses **array-valued** `model` for every agent, but the skill only handled string/arrow shapes and over-applied the exemption to plugin agents. The rule now states that `presets.<name>.<agent>.model` may be a string **or an array** (an array *is* the chain), and the exemption applies to **core-bundled agents only**.

---

## [1.6.0] - 2026-09-22

### Fixed
- **MCP servers were silently dropped** — the skill could list one MCP server and stop, even when the config had five. `Discover` now has an explicit MCP step: read every `mcp` key (global + project), emit a row per key, and **assert the row count against the config's key count**. A one-row Table 5 is now called out as a red flag, in both the table spec and the checklist.
- **`update.ps1` nested directories** — `Copy-Item -Recurse` into an existing target nested the source inside it, so repeated updates grew `references/references/…`. The target is now removed before copying.
- **`update.ps1` backup step failed and polluted the install** — the backup directory was never created (causing a write error), and backups were written *inside* the skill directory, becoming part of the installed skill and re-nesting later. Backups now go to a sibling directory and are created before use.

### Changed
- **`What it does` is now one detailed paragraph** — the `Simple: … Detailed: …` split is gone. Every cell must be a single flowing paragraph covering three things: how it is invoked, when to use it, and what happens after (with caveats). Updated in `SKILL.md`, `references/checklist.md`, and all 26 example cells in `references/format-example.md`.
- **Usage guide has two modes** — **Mode A** (generic) when the project is empty, **Mode B** when it has real work: anchor the framing to the project's general shape *without over-coupling* (no file paths, no private code; tool facts never change). Documented in `references/usage-guide.md` with a comparison table.
- **Chinese column renamed** — the invocation column's Chinese header changed from its old colloquial form to a more formal, precise term (`references/glossary.json`; see the Chinese changelog for the exact strings).
- **`check-docs.mjs` now validates HTML links** — `docs/*.html` `href`/`src` targets must resolve, so the new landing-page structure is protected.

### Added
- **Landing page is English-first** — `docs/index.html` opens in English by default; the language toggle switches to Chinese and the choice persists across pages.
- **Output detail pages** — the three deliverables on the landing page are now linked cards, each opening a dedicated page (`docs/inventory.html`, `docs/usage-guide.html`, `docs/asset-inventory-json.html`) with a detailed description and a real example.
- **Favicon** — `docs/favicon.svg`, wired into every page.
- **Shared assets** — `docs/style.css` and `docs/lang.js` keep all pages consistent.

---

## [1.5.0] - 2026-09-21

### Added
- **Language-claim check** in `check-docs.mjs` — parses the "Fixed-string languages" line in `SKILL.md` and fails if any advertised language (e.g. `ja`) has no block in `references/glossary.json`. This closes the gap that let v1.4.0 ship a `ja` claim with no `ja` data.
- **Reference-integrity check** in `check-docs.mjs` — every `references/<name>` named in `SKILL.md` must exist, and `references/checklist.md` must keep at least 20 checklist items (guards against silent loss when the list is edited).
- **Japanese glossary block** (`references/glossary.json` → `ja`) — actually delivered now; `en` / `zh` / `ja` each carry the same 10 keys.
- **`update.ps1 -Help`** — usage, options, and install locations without touching anything.
- **"Which file should I read?" navigation** in both READMEs — maps common intents to the right file.

### Changed
- **`references/format-example.md` merged with `examples/inventory-example.md`** — they were near-duplicates (17 identical rows, ~3,932 shared bytes). The two are now one file; the runtime set is `SKILL.md` + `references/`, and `update.ps1`, both READMEs, and both CONTRIBUTING files no longer mention `examples/`.
- **`SKILL.md` "What it does" rules consolidated** — the Cell Conventions bullet no longer restates the full rule set; it points at the dedicated "What-it-does format (mandatory)" section.

### Removed
- **`examples/inventory-example.md`** — removed as a duplicate of `references/format-example.md`. Runtime payload drops from 60,390 B to 55,250 B (~8.5%, ≈1,285 tokens saved on a full read).

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
