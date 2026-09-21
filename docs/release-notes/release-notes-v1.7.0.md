<!--
  Release notes for v1.7.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.7.0-ZH.md
  Release: v1.7.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.7.0

Seven languages, a Material landing site with rendered examples, and long-form docs split out of the READMEs. The inventory logic and 7-table structure are unchanged.

## Added

- **Seven-language docs site** — the landing page and all detail pages support English, Chinese, Japanese, Korean, Russian, Arabic (RTL), and Spanish; the choice persists across pages.
- **Localized READMEs** — `README-JA.md`, `README-KO.md`, `README-RU.md`, `README-AR.md`, `README-ES.md`, cross-linking the full set.
- **`docs/guides/`** — long-form documentation linked from the READMEs.
- **`docs/samples/`** — published example output so users can see the final artifacts before running anything.
- **Material Design 3 restyle** of the docs site.
- **New `check-docs` validations** — HTML link checking, and a check that all seven READMEs exist and cross-link.

## Changed

- **READMEs slimmed** into concise, emoji-accented landing pages; detail moved to `docs/guides/`.
- **Landing-page examples render** as a real table and line-by-line JSON instead of raw code blocks.
- **`CONTRIBUTING` (EN+ZH)** now documents the commit-granularity rule and the tag/release policy.

## Fixed

- **Copy-button feedback** no longer hardcodes Chinese in the English UI.

## Verification

- `check-docs`: 0 errors across 35 markdown files.
- New checks confirmed to fail when broken (missing README, broken HTML link).
- All seven languages verified switching in a real browser, including Arabic RTL.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
