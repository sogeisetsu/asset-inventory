<!--
  Release notes for v1.9.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.9.0-ZH.md
  Release: v1.9.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.9.0

The three output-detail pages now show their samples **rendered from the sample files** instead of as raw code blocks — and the sample set is bilingual.

## Added

- **`scripts/build-sample-pages.mjs`** — renders `docs/samples/` into `inventory.html` (Markdown table), `usage-guide.html` (full Markdown), and `asset-inventory-json.html` (pretty-printed JSON). It runs with `--check` in CI, so a stale page fails the build.
- **English samples** at `docs/samples/`; the Chinese samples moved to `docs/samples/zh/`. English is the fallback for languages without a translated sample.

## Changed

- **Rendered examples** — the detail pages no longer dump raw Markdown or a run-on JSON blob. `usage-guide.html` renders headings and tables, `asset-inventory-json.html` shows one key per line with indentation, and `inventory.html` shows its table.
- **Human-readable page titles** — the `<h1>` and tab title are localized and no longer a bare filename.

## Verification

- `build-sample-pages.mjs --check`: 3 pages up to date.
- `check-docs`: 0 errors.
- Rendered pages inspected in a browser: JSON is indented, Markdown renders as HTML, and untranslated languages fall back to the English sample.

## License

MIT — see [LICENSE](../../LICENSE).
