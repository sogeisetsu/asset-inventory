<!--
  Release notes for v1.13.3 (English). Paste into the GitHub Release body.
  Chinese version: ../../zh/release-notes/release-notes-v1.13.3-ZH.md
  Release: v1.13.3 — asset-inventory (sogeisetsu/asset-inventory)
  Range: all changes since the previous Release tag (v1.13.1).
-->

# v1.13.3

A patch that makes releases repeatable: a release-prep script, a docs-parity gate, and two release-policy rules. The inventory logic and the 7-table output are unchanged. This Release covers everything since v1.13.1, including the v1.13.2 tag.

## Added

- **`scripts/release-prep.mjs`** — one command prepares the mechanical half of a release: bumps the version in `SKILL.md`, inserts the EN/ZH CHANGELOG heading stubs, and (with `--notes`) scaffolds the bilingual release-notes pair and registers it in the docs checker's pair table. It then runs both validation gates and prints the remaining manual steps. It never commits, tags, or pushes; it refuses to run on a dirty tree or a duplicate version, and `--dry-run` previews every planned edit without writing.
- **State-parity gate in `check-docs`** — every state marker in the glossary (all seven languages, including the fifth marker `🛑broken`) must now appear verbatim in that language's README and on the docs landing page. A new marker can no longer ship while the public docs still list the old set — the exact gap that shipped in v1.13.0 and had to be patched by hand.

## Changed

- **Release notes now describe the range since the last Release** — the contribution guide (English and Chinese) states that a Release's notes must cover all changes since the previous Release's tag, found via `gh release list`, written from the user's perspective — never the current version's raw commit list. Patch tags carry no Release, so every intermediate patch now finds its way into the next notes. You are reading the first Release written under this rule.
- **Patch Releases are possible on explicit request** — the default stays "patch = tag only", but when you explicitly ask for a patch Release, it follows the same rules as minor/major: bilingual release-notes files, registered as a pair, English file as the body.
- **Mirror-sync is now part of the workflow** — the contributor workflow's first step names the gitignored `zh/skill-zh.md` mirror, so editing `SKILL.md` no longer relies on each agent remembering to sync it.

## Usage

Copy the install prompt from the landing page (or the README) and send it to your AI assistant, or install the skill manually into your global or project-scoped skills directory. Then ask: "List my plugins / skills / commands / MCP / agents".

## License

MIT — see [LICENSE](../../LICENSE).
