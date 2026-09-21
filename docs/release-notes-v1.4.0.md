<!--
  Release notes for v1.4.0 (English). Paste into the GitHub Release body.
  Chinese version: zh/release-notes-v1.4.0-ZH.md
  Release: v1.4.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.4.0

This release turns the documentation rules into automated checks, closes a language promise the skill could not keep, and trims `SKILL.md`. The inventory logic and 7-table structure are unchanged.

## What's New

- **PR-triggered docs check** (`.github/workflows/docs-check.yml`) — every pull request to `master` now runs `node --check` on both scripts and `node scripts/check-docs.mjs`. Previously the only workflow deployed Pages on `master` push, so PRs had no gate at all.
- **Version-consistency check** — `check-docs.mjs` reads `metadata.version` from the `SKILL.md` frontmatter and fails if it disagrees with the top release heading in `CHANGELOG.md` or `zh/CHANGELOG-ZH.md`.
- **Glossary-structure check** — every language block in `references/glossary.json` must expose the same key set as `en`; missing or extra keys are reported per language.
- **Japanese glossary entries** — `references/glossary.json` now ships `en` / `zh` / `ja`, and the skill states an explicit fallback for any other language instead of implying every language has fixed strings.
- **`references/checklist.md`** — the full Quality Checklist, extracted from `SKILL.md`.
- **`update.ps1 -DryRun`** — preview which runtime files would be copied; writes nothing.

## Fixes / Consistency

- **Language promise corrected** — `SKILL.md` no longer claims all languages have glossary entries. `en` / `zh` / `ja` are used verbatim; any other language derives its fixed strings from the `en` block and notes that in Provenance.
- **v1.3.0 release date** corrected from `2026-09-13` to `2026-09-21` in both changelogs.
- **`SKILL.md` trimmed** — the 42-line inline checklist moved out, keeping the rule body focused.
- **Troubleshooting** gained entries for Table 6 row order, non-glossary languages, and the stale local-copy warning.

## Verification

Both new checks were deliberately broken and confirmed to fail:

```
version mismatch → error: version mismatch: SKILL.md has 1.3.0 but CHANGELOG.md top heading is 9.9.9
glossary gap     → error: glossary check: "zh" is missing key(s): tableTitles
clean tree       → 0 error(s), 0 warning(s)
```

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../LICENSE).
