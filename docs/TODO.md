# TODO — rollout plan

> Living rollout plan. After finishing a release, tick its box and update the
> **Next step** line at the bottom. A fresh session should read this file first
> to know exactly which release is in flight and what comes next.
>
> Chinese counterpart: [`zh/TODO-ZH.md`](../zh/TODO-ZH.md) (kept in sync).

## Release ladder

| Version | Level | Summary | Tag | Release | Status |
|---|---|---|---|---|---|
| 1.7.1 | patch | Rollout plan + tag/release policy clarified | ✅ | — | ✅ done |
| 1.7.2 | patch | MCP invocation facts corrected (skill rule + every sample) | ✅ | — | ✅ done |
| 1.7.3 | patch | README cleanup: drop title emoji, add "Install via AI", move non-EN/ZH READMEs into `readmes/` | ✅ | — | ✅ done |
| 1.7.4 | patch | Docs site: English fallback for untranslated content (fix "frame with no content") | ✅ | — | ✅ done |
| 1.8.0 | minor | Glossary: add `ko` / `ru` / `ar` / `es` fixed strings (7 languages) | ✅ | ✅ | ✅ done |
| 1.9.0 | minor | Sample pages: generator script, rendered Markdown/JSON, `docs/samples/` restructure | ✅ | ✅ | ✅ done |
| 1.9.1 | patch | Document the branch rule (CONTRIBUTING + repository guide) | ✅ | — | ✅ done |
| 1.9.2 | patch | Release notes moved into docs/release-notes/ + zh/release-notes/ | ✅ | — | ✅ done |
| 1.9.3 | patch | Fix language stacking + per-tab language (sessionStorage) | ✅ | — | ✅ done |
| 1.9.4 | patch | Detail pages: drop sample bar, add .facts borders, cap JSON height | ✅ | — | ✅ done |
| 1.10.0 | minor | Docs-site fixes + release-notes reorg, bilingual release notes | ✅ | ✅ | ✅ done |
| 1.10.1 | patch | 404 redirect for old release-note URLs | ✅ | — | ✅ done |
| 1.10.2 | patch | Docs site M3 polish + example panel; Targeting docs (EN/ZH) | ✅ | — | ✅ done |
| 1.10.3 | patch | Token trim: condense SKILL.md + format-example.md (behavior-neutral) | ✅ | — | ✅ done |
| 1.11.0 | minor | Docs-site M3 + example panel, Targeting docs, token trim; bilingual release notes | ✅ | ✅ | ✅ done |
| 1.11.1 | patch | Rule hardening: home-path masking, merge skill/command pairs, disabled agents, unregistered residue | ✅ | — | ✅ done |
| 1.11.2 | patch | Never merge command + same-named skill; widen upstream lookup; name legend | ✅ | — | ✅ done |
| 1.11.3 | patch | Merge scope: same-plugin pair = one row; separate-origin command + skill = two rows | ✅ | ✅ | ✅ done |
| 1.11.4 | patch | Install via AI: require `git clone`, drop ZIP fallback; warn against Releases ZIPs | ✅ | ✅ | ✅ done |
| 1.11.5 | patch | `AGENTS.md` de-privatized & tracked; Release bodies English-only | ✅ | — | ✅ done |

## Details

### 1.7.2 — MCP invocation facts (patch)
The skill (and every sample) claimed MCP servers are "called only by the Agent —
a human never calls them". That is wrong. Fix the rule in `SKILL.md`
(Cell Conventions, Discover, Anti-patterns) and `references/checklist.md`, then
sync all samples: `docs/samples/inventory.md`, `docs/samples/usage-guide.md`,
`docs/samples/asset-inventory.json`, `docs/inventory.html`,
`docs/asset-inventory-json.html`, `docs/index.html`.

### 1.7.3 — README cleanup (patch)
- Remove the 🗃️ emoji from every README title (all 7 files).
- Add an "Install via AI" section to every README (reuse the localized prompts
  already on `docs/index.html`).
- Move non-EN/ZH READMEs into `readmes/` and rewrite their relative links
  (`assets/`, `LICENSE`, `docs/`, `CHANGELOG.md`, `CONTRIBUTING.md`), the
  language switchers, `scripts/check-docs.mjs` (`README_LOCALES` + CJK strip),
  and the directory tree in `docs/guides/repository-and-contributing.md`.

### 1.7.4 — Docs site English fallback (patch)
Untranslated body content is empty for ja/ko/ru/ar/es. Introduce `data-i18n`
grouping plus a `lang.js` resolver (chosen language → fall back to English) and
switch `style.css` visibility to a `.on` class across the four HTML pages. Frame
and headings stay in the chosen language.

### 1.8.0 — Glossary 7 languages (minor · Release)
Add `ko` / `ru` / `ar` / `es` blocks to `references/glossary.json` (10 keys each,
identical key set to `en`), and widen the "Fixed-string languages" line in
`SKILL.md` to all seven.

### 1.9.0 — Sample pages (minor · Release)
Add `scripts/build-sample-pages.mjs` to render `inventory.md` (tables),
`usage-guide.md` (real HTML) and `asset-inventory.json` (pretty-printed) into the
three detail pages. Restructure samples: English at `docs/samples/`, Chinese
under `docs/samples/zh/`; update every sample link. Drop the raw filename from
the detail-page titles.

## Next step

The rollout is complete through **1.11.5**: 1.11.1–1.11.5 (patches) with GitHub
Releases on 1.11.3 and 1.11.4. Nothing is in flight — start a new ladder here
for the next piece of work.
