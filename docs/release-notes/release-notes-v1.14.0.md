<!--
  Release notes for v1.14.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.14.0-ZH.md
  Release: v1.14.0 — asset-inventory (sogeisetsu/asset-inventory)
  Scope: all changes since the previous Release tag (v1.13.3), including the
  1.13.4–1.13.7 patches.
-->

# v1.14.0

Install with one command via skills.sh, a workflow-first SKILL.md, and honest handling of the edge cases real machines throw at an inventory — plus everything that landed in the 1.13.4–1.13.7 patches since the last release. The 7-table structure and inventory logic are unchanged.

## Added

- **Install via skills.sh** — every README (7 languages) and the install guide now offer the one-liner `npx skills add sogeisetsu/asset-inventory`: it detects the agents on your machine (OpenCode, Claude Code, Codex, GitHub Copilot, …) and installs into each, with `-g` for global, `-y` to skip prompts, and `--copy` instead of symlinking. The English and Chinese READMEs also carry the official skills.sh badge.
- **Richer skill description** — the frontmatter description now states the three provenance questions (what it is / who brought it in / how to use it), the state markers, the trigger scenarios (diff mode, cleanup and unused-asset questions), the usage-guide deliverable, and the read-only and masking guarantees, so hosts and registries can judge relevance before loading the skill.
- **`metadata.source`** — the frontmatter records the canonical repository URL as an Agent Skills `metadata` extension key, machine-readable for hosts and registries.
- **Evidence returns verdicts, not dumps** (1.13.4) — count assertions print `N = M`, hashes print `match=true|false`, binary scans print evidence-ranked context candidates plus a suppressed count instead of thousands of raw tokens, and the checklist gates every output on "verdict + supporting line + no silent truncation". Same findings, a fraction of the context cost.

## Changed

- **Workflow-first structure** — `Procedure` now precedes the output-format spec so the skill reads in execution order (discover → verify → output → format), fixing a stale "the 7-table inventory below" reference; the vague `The Rule` heading is now `Output format — the 7 tables`, and the targeted-mode write list points at the Targeting table instead of repeating it.
- **Host-aware invocation wording** (1.13.6) — quick starts now distinguish typing `/skill-name` (works in any host) from picking from the OpenCode TUI's `/skills` selector (not every host exposes it).
- **Sample inventory renders on the docs site** (1.13.6) — the sample tables and JSON are served as standalone rendered HTML pages instead of raw Markdown source.
- **Install prompt is unambiguous in every language** (1.13.7) — all seven locales define `<target>` as the skills root, so the copy steps point at one destination.

## Fixed

- **Nested MCP configs count correctly** — the Table 5 count assertion now handles servers nested under `mcp.servers.*` and servers a plugin registers at runtime: it counts leaves plus plugin registrations, quotes the basis in the table note (`6 config leaves + 1 plugin = rows`), and never pads or cuts rows to force a match.
- **Diff mode detects state flips** — a PK present in both versions whose state marker changed (e.g. `✅available → ❌disabled`) now appears as a one-line `state changed:` note; previously it was neither Added nor Removed and could be silently lost.
- **Table 7 category names are never improvised** — `references/glossary.json` gains `hostCategories` (7 fixed slots) in all seven languages, so non-English inventories use the fixed category labels verbatim instead of translating them on the spot.
- **`update.ps1` backups leave the skills namespace** (1.13.5) — backups are written next to the skills directory instead of inside it, where a backup `SKILL.md` would load as a duplicate skill.
- **`update.ps1 -DryRun` has no side effects** (1.13.7) — the preview runs before `git pull`, so a dry run never pulls the repo and no longer exits 1 when no global install exists.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, run `npx skills add sogeisetsu/asset-inventory`, or install manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
