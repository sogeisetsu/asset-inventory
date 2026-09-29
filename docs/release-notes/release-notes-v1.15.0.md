<!--
  Release notes for v1.15.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.15.0-ZH.md
  Release: v1.15.0 — asset-inventory (sogeisetsu/asset-inventory)
  Scope: all changes since the previous Release tag (v1.14.0).
-->

# v1.15.0

Host commands are now found by enumerating the app bundle's own registries instead of hunting for prose, so an inventory stops losing commands it should have listed. The 7-table structure and every other scan are unchanged.

## Changed

- **Host-command scan is registry-first** — `references/host-commands.md` now runs two passes. Pass 1 enumerates the bundle's command registry deterministically: the `{id,name,source}` entry array, a raw-`id` completeness guard that a different field order cannot hide entries from, the composer-autocomplete i18n key set, and the prompt templates that name a command (`command:"/xxx"` literals, magicPrompt descriptions). The registry `id`/`name` is authoritative for the typed form — an autocomplete key is not always its camelCase transliteration (`workspaceReview` → `/workspace-review` holds; `featurePlan` → `/plan-feature`, and `feature-plan` occurs zero times in the bundle). The old phrase-filtered token scan is demoted to Pass 2, a documented fallback carrying an explicit "this is not the complete set" warning, and `references/checklist.md` now gates Table 4 on reconciling the union of the three registries.

## Fixed

- **The phrase-filtered scan was silently incomplete** — it kept a `/xxx` token only when the surrounding bytes contained the literal wording "slash command", so real commands whose evidence lacked that phrase vanished without a trace. On the machine where this was measured it reported 8 of 13 host commands: `/btw`, `/fork`, `/schedule-task` and `/handoff-review` were dropped, and `/timeline` could never have been found — the bundle contains no typed `/timeline` literal at all (its five raw hits are GitHub API paths), so registry enumeration is the only way to reach it. A silently short host-command table is worse than an admitted gap, so the fallback now says so and `SKILL.md`'s failure-mode list carries the pitfall.

## Usage

Copy the install prompt from the landing page (or the README), run `npx skills add sogeisetsu/asset-inventory`, or install manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
