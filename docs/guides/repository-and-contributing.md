# Repository & contributing 🧭

> Detailed companion to the main [README](../../README.md).

## Which file should I read?

| You want to… | Read |
|---|---|
| Understand the skill's rules / change its behavior | [`SKILL.md`](../../SKILL.md) |
| See the exact cell format for a table | [`references/format-example.md`](../../references/format-example.md) |
| Know every pre-output check | [`references/checklist.md`](../../references/checklist.md) |
| Add a language / fixed output strings | [`references/glossary.json`](../../references/glossary.json) |
| Support a new outer app / host | [`references/host-commands.md`](../../references/host-commands.md) |
| Format the usage guide | [`references/usage-guide.md`](../../references/usage-guide.md) |
| Debug a failed run | [`references/troubleshooting.md`](../../references/troubleshooting.md) |
| See what the output looks like | [`docs/samples/`](../samples/) |
| Install or update | [install-and-update.md](install-and-update.md) · `update.ps1 -Help` |
| Contribute / release | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) · [`CHANGELOG.md`](../../CHANGELOG.md) |

## 📁 Repository layout

```
asset-inventory/
├── SKILL.md                    # the skill (execution skeleton + rules)
├── update.ps1                  # one-command update script
├── README.md                   # English documentation
├── README-ZH.md                # Chinese documentation
├── readmes/                    # localized READMEs (JA / KO / RU / AR / ES)
├── TODO.md                     # rollout plan (English)
├── CHANGELOG.md                # version history (English)
├── CONTRIBUTING.md             # contribution guidelines (English)
├── AGENTS.md                  # agent working guide (Chinese)
├── LICENSE                     # MIT
├── references/                 # skill format & scan-method references
├── scripts/
│   ├── check-docs.mjs          # docs / links / frontmatter validation
│   ├── build-sample-pages.mjs  # renders docs/samples/ into the detail pages
│   └── generate-assets.mjs     # regenerates docs/assets/*.svg
├── docs/                       # GitHub Pages + release notes + guides + samples + assets
│   ├── assets/                 # local SVG icon / banner / badges (generated)
│   ├── guides/                 # these long-form guides
│   ├── release-notes/          # English release notes
│   └── samples/                # example output (English; zh/ holds the Chinese set)
└── zh/                         # all Chinese docs except README-ZH.md
    └── release-notes/          # Chinese release notes
```

## 🧩 Runtime vs. development

Only `SKILL.md` and `references/` are shipped to the skill's install location. Everything else (`docs/`, `scripts/`, `zh/`, `readmes/`, `README*`, `CHANGELOG*`, `CONTRIBUTING*`) is development-side only.

## ✅ Contributing

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md). Work on a branch — never change `master` directly — and merge it back once the checks pass. Before opening a pull request:

```sh
node scripts/check-docs.mjs
node --check scripts/*.mjs
node scripts/build-sample-pages.mjs --check
```

The docs check resolves links (Markdown **and** HTML), checks EN/ZH pairs, validates frontmatter, flags CJK in English docs, verifies version consistency across `SKILL.md` / both changelogs, checks glossary structure, and confirms every `references/*` named in `SKILL.md` exists.

## 📜 Versioning

Follows [Semantic Versioning](https://semver.org/):

- **PATCH** (`1.0.x`): bug fixes, documentation improvements → **git tag only**
- **MINOR** (`1.x.0`): new features, new table types, new host support → **git tag + GitHub Release**
- **MAJOR** (`x.0.0`): breaking changes to table structure or output format → **git tag + GitHub Release**
