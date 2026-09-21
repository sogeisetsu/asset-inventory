<!--
  Release notes for v1.5.0 (English). Paste into the GitHub Release body.
  Chinese version: zh/release-notes-v1.5.0-ZH.md
  Release: v1.5.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.5.0

This release fixes a claim v1.4.0 could not back up, closes the checker gap that let it through, and removes a duplicated runtime file. The inventory logic and 7-table structure are unchanged.

## What's New

- **Language-claim check** — `check-docs.mjs` now parses the "Fixed-string languages" line in `SKILL.md` and fails if any advertised language has no block in `references/glossary.json`.
- **Reference-integrity check** — every `references/<name>` named in `SKILL.md` must exist, and `references/checklist.md` must keep at least 20 items.
- **Japanese glossary block** — actually delivered now; `en` / `zh` / `ja` each carry the same 10 keys.
- **`update.ps1 -Help`** — usage, options, and install locations, changing nothing.
- **"Which file should I read?" navigation** in both READMEs.

## Fixes / Consistency

- **`SKILL.md` advertised `ja` with no `ja` data.** v1.4.0's SKILL.md said the glossary shipped English, Chinese, and Japanese, but `references/glossary.json` only had `en` and `zh` — and the checker missed it because it only compared languages that already existed. Both the data and the checker are fixed.
- **Duplicate example file removed.** `examples/inventory-example.md` was a near-duplicate of `references/format-example.md` (17 identical rows). Merged into the one file; the runtime set is now `SKILL.md` + `references/`.
- **`SKILL.md` "What it does" rules consolidated** into a single section.

## Runtime payload

| | Before | After |
|---|---|---|
| Files shipped | `SKILL.md` + `references/` + `examples/` | `SKILL.md` + `references/` |
| Total bytes | 60,390 | 55,250 |
| ≈ tokens (4 bytes/token) | ~15,098 | ~13,813 |

**≈1,285 tokens saved** on a full read, with no rule removed.

## Verification

The new checks were deliberately broken and confirmed to fail:

```
advertised ja but glossary lacks it → error: glossary check: SKILL.md advertises "ja" ... but references/glossary.json has no "ja" block
referenced a missing file           → error: reference check: SKILL.md references "references/nonexistent-file.md" but the file does not exist
dropped checklist items             → error: reference check: references/checklist.md has only 15 checklist item(s); at least 20 expected
clean tree                          → 0 error(s), 0 warning(s)
```

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../LICENSE).
