<!--
  Release notes for v1.8.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.8.0-ZH.md
  Release: v1.8.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.8.0

The skill's fixed output strings now cover all seven languages the documentation already promised.

## Added

- **Four new fixed-string languages** — `references/glossary.json` gains `ko` (Korean), `ru` (Russian), `ar` (Arabic), and `es` (Spanish) blocks alongside `en` / `zh` / `ja`. Each carries the same 10 keys as `en`: `columns`, `columnsAgent`, `tableTitles`, `state`, `confidence`, `emptyTable`, `unknown`, `threeQuestions`, `provenance`, `provenanceRealName`.

## Changed

- **`SKILL.md` language claim widened** — the "Fixed-string languages" line now lists all seven, so a request in Korean, Russian, Arabic, or Spanish uses the glossary strings verbatim instead of deriving them from the English block. Languages outside the seven still follow the documented derive-from-English rule.

## Verification

- `check-docs`: the glossary-structure check confirms every language block exposes the same key set as `en`.
- Each new block was compared against `en` by hand: 10 keys, 5 columns, 6 agent columns, 3 provenance lines.

## License

MIT — see [LICENSE](../../LICENSE).
