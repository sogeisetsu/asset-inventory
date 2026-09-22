<!--
  Release notes for v1.12.0 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.12.0-ZH.md
  Release: v1.12.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.12.0

A correctness fix for how skill invocation is described, plus a version bump. The 7-table structure and the inventory logic are unchanged.

## Changed

- **Skill `How to call` now shows the real TUI path** — the cell reads `auto-triggers on intent, or pick from /skills (typing /skill-name works too)` instead of implying a bare `/skill-name`: the OpenCode TUI hides skills from the `/` autocomplete (commands with `source === "skill"` are skipped) and `/skills` is the official picker, though typing the full name still dispatches as a command. Updated `SKILL.md` (rule + Name legend), `references/checklist.md`, `references/format-example.md`, `references/usage-guide.md`, and all EN/ZH samples (`inventory.md`, `asset-inventory.json`, `usage-guide.md`); sample pages rebuilt.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
