<!--
  Release notes for v1.11.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.11.0-ZH.md
  Release: v1.11.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.11.0

A documentation-site polish plus a behavior-neutral token trim. The 7-table structure and the inventory logic are unchanged.

## What's New

- **Targeting docs** — `docs/guides/how-it-works.md` now documents what each argument scans and what it writes (`mcp`, `agents`, `hosts`, `skills`, `diff`, `usage`), linked from the quick-start argument line of `README.md` and `README-ZH.md`.
- **Rendered samples are now M3 panels** — each rendered sample sits in a Material 3 outlined panel with a localized caption (for example "Rendered sample", or the Chinese for it) and demoted inner headings, so it no longer competes with the page's own headings.
- **Light M3 interaction polish** — hover state layers, a visible keyboard focus ring, and M3 easing curves across the docs site.

## Changed

- **Token trim (behavior-neutral)** — `SKILL.md` is ~17% smaller and `references/format-example.md` ~25% smaller, achieved by removing duplicated rules and illustrative rows and moving the path-variable table into `references/host-commands.md`. Every rule was audited to remain present and unambiguous, and a produced inventory is unchanged.

## Fixes / Consistency

- **Old release-note URLs no longer 404** — `docs/404.html` redirects `/release-notes-vX.Y.Z.md` to `/release-notes/release-notes-vX.Y.Z.md` (GitHub Pages is static and cannot issue server-side redirects).

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
