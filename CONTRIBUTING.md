# Contributing to Asset Inventory

Thanks for your interest in improving this skill! Here's how to contribute.

## Quick Start

1. Fork the repository
2. Create a branch: `git checkout -b improve/your-change`
3. Make your changes
4. Test by installing locally: copy `SKILL.md` and `references/` to your skills directory
5. Run `/asset-inventory` to verify it works
6. Submit a pull request

## What to Contribute

- **Bug fixes** — incorrect table logic, wrong source classification, missing commands
- **New host support** — add path variables or discovery methods for new outer apps
- **Documentation** — clearer examples, better explanations, translation improvements
- **Tests** — the skill is AI-driven, but you can test by running it on different machines

## Rules

1. **Never invent assets** — every row must come from actual evidence on a machine
2. **Keep the 7-table structure** — new categories go into existing tables, not new ones
3. **Language follows user** — output must match the language of the request
4. **Source must be specific** — a vague "some plugin" is not a valid source; name the actual plugin
5. **How the "what it does" column is written** — detailed: a simple sentence plus 2-4 detailed sentences, based on the actual source description

## File Structure

```
asset-inventory/
├── SKILL.md                    # Main skill file (rules + procedure)
├── README.md                   # English documentation
├── README-ZH.md                # Chinese documentation (root, per project convention)
├── CHANGELOG.md                # Version history (English)
├── CONTRIBUTING.md             # Contribution guidelines (English)
├── LICENSE                     # MIT
├── update.ps1                  # One-command update script
├── references/                 # Skill format & scan-method references
├── assets/                     # Local SVG icon / banner / badges (generated)
├── scripts/
│   ├── check-docs.mjs          # Doc/link/frontmatter validation
│   └── generate-assets.mjs     # Regenerates assets/*.svg
├── docs/                       # GitHub Pages + release notes
└── zh/                         # All Chinese docs except README-ZH.md
    ├── CHANGELOG-ZH.md
    ├── CONTRIBUTING-ZH.md
    ├── LICENSE-ZH.txt
    ├── release-notes-v1.1.0-ZH.md
    ├── release-notes-v1.3.0-ZH.md├── release-notes-v1.4.0-ZH.md├── release-notes-v1.5.0-ZH.md└── release-notes-v1.6.0-ZH.md
```

Local-only Chinese guides (`zh/skill-zh.md`, `zh/repo-init-guide-zh.md`) and `AGENTS.md` are gitignored and never committed.

## Testing Your Changes

1. Install the skill locally (global or project-scoped)
2. Run `/asset-inventory` on a machine with OpenCode + plugins
3. Check that all 7 tables are generated correctly
4. Verify JSON PKs match Markdown rows
5. Run `/asset-inventory diff` to compare with previous output
6. Run the docs check before opening a PR:

   ```sh
   node scripts/check-docs.mjs
   node --check scripts/*.mjs
   ```

   `check-docs.mjs` resolves every relative Markdown link and `<img src>`, checks the EN/ZH pair table, warns on one-sided edits, validates frontmatter, and flags CJK characters in English docs. It exits non-zero on errors; warnings do not fail.

## Canonical Terms

To keep prose unambiguous, use these terms and avoid the listed alternatives:

| Use | Do not use | Why |
|-----|------------|-----|
| **outer app** (a.k.a. **host**) | "container", "wrapper app" | It is the desktop program wrapping the OpenCode engine (e.g. OpenChamber) that injects its own commands. |
| **host-injected command** | "native command" when referring to an outer app's command | "native" collides with OpenCode's own built-ins. |
| **built-in command / skill** | "native OpenCode" as a noun for custom agents | "native OpenCode" reads as "ships with OpenCode", which is the opposite of custom. |
| **custom agent** | "user agent", "private agent" | Distinguishes user/plugin-defined agents from built-in ones. |

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- **PATCH** (1.0.x): Bug fixes, documentation improvements
- **MINOR** (1.x.0): New features, new table types, new host support
- **MAJOR** (x.0.0): Breaking changes to table structure or output format

Update `metadata.version` in the `SKILL.md` frontmatter and add an entry to `CHANGELOG.md`.

Three places must stay in lockstep, and `check-docs.mjs` now enforces it:

1. `SKILL.md` frontmatter `metadata.version`
2. The top release heading in `CHANGELOG.md`
3. The top release heading in `zh/CHANGELOG-ZH.md`

A mismatch fails the check. The release heading must be `## [x.y.z]` (the date after it is not compared).

If you add a language to `references/glossary.json`, give it **the same key set as the `en` block** — the check reports any missing or extra key per language. Every language block must expose the same keys: `columns`, `columnsAgent`, `tableTitles`, `state`, `confidence`, `emptyTable`, `unknown`, `threeQuestions`, `provenance`, `provenanceRealName`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
