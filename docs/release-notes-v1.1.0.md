<!--
  Release notes for v1.1.0 (English). Paste into the GitHub Release body.
  Chinese version: zh/release-notes-v1.1.0-ZH.md
  Release: v1.1.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.1.0

This release focuses on documentation clarity, skill robustness, and a new landing page. The inventory logic and 7-table structure are unchanged.

## What's New

- **Rewritten README (EN + ZH)** — Features rewritten in plain language; added "three output files" wording, state markers that follow the output language, and diff mode to the feature list; Install section now has a global vs. project-scoped chooser table with both macOS/Linux and Windows commands; polished AI auto-install prompt (includes Windows path); added a Verify section; EN and ZH now have 9 corresponding sections.
- **SKILL.md hardening** — Output section now explicitly states three deliverables; state markers follow the output language (Chinese output uses Chinese markers, English output uses English markers); plugin evidence sources are remappable per host (added manifest / `package.json` alternatives); path variables now include macOS/Linux and Windows defaults; documented that host settings may live in Electron internal storage and should be noted as unreadable rather than fabricated; agent name mismatches between config and `agent list` are resolved in favor of `agent list`; removed duplicate Quality Bar entries.
- **references/host-commands.md** — Marked the command list as a 2026-09 snapshot; clarified that a full scan of all `magicPrompts` keys (not just the 11 listed) is required at inventory time; added a section on non-slash keys (git / github / linear / planning / session groups).
- **New GitHub Pages landing page** (`docs/index.html`) — Single-file, no external dependencies; bilingual (ZH/EN) with one-click copy-to-AI install prompt on the hero; four sections (Features, Why, Use Cases, Install).
- **Added `.ignore`** — Excludes `.slim/deepwork/**` from version control while keeping it readable by OpenCode.

## Fixes / Consistency

- State markers (`✅available` / `❌disabled` / `📦shelf-only` / `🚫absent`) now match the output language instead of being hardcoded in Chinese.
- Plugin discovery no longer assumes a single fixed package-cache path; falls back to manifests and `package.json` when the cache is absent.
- Host-injected command inventory now scans the full `magicPrompts` key set rather than only the 11 documented slash commands.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../LICENSE).
