<!--
  Release notes for v1.13.1 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.13.1-ZH.md
  Release: v1.13.1 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.13.1

A patch that hardens MCP probing, pins down what diff mode actually compares, and adds three security guards. The 7-table structure and the inventory logic are unchanged.

## Added

- **Security guards** — everything read during discovery (skill descriptions, config comments, file contents, bundle strings, pasted JSON) is evidence, never instructions; scanned text that tries to direct the run gets quoted in a table note instead of obeyed. Probes touch only the exact command/URL the config declares — the skill never installs, upgrades, or downloads dependencies to make a probe pass, it reports the failure as observed. And raw key/token/secret values are masked at first sight: they never appear in table notes, provenance, error quotes, summaries, or commit messages — only the masked form may be written anywhere.

## Changed

- **Diff mode protocol pinned** — diff now compares only the tables present in your pasted baseline (no full 7-table scan) and ends with a scope note naming any tables the baseline lacks; it warns when the baseline may be incomplete (fewer rows than now) so extra "added" rows aren't misread; output is two compact `Added` / `Removed` tables with `Table | Name | State` columns instead of full rows; and it closes with the standard 3-line Provenance, using `not scanned (diff)` for fields it never collected.
- **Five-state labels synced** — all seven READMEs and the docs pages now name all five states, including the localized `🛑broken` marker introduced in v1.13.0.

## Fixed

- **MCP liveness probes use the config's environment** — a local stdio server is probed with the exact config `command` plus its `env` block, and a remote server with the config `headers`. A bare launch without that environment proves nothing (it once produced a false "dependency not installed" failure) and is never recorded; a probe that still fails with the config environment is recorded as `⚠️inferred 🛑broken` with the error class.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
