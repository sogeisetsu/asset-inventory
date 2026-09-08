# Contributing to Asset Inventory

Thanks for your interest in improving this skill! Here's how to contribute.

## Quick Start

1. Fork the repository
2. Create a branch: `git checkout -b improve/your-change`
3. Make your changes
4. Test by installing locally: copy `SKILL.md`, `references/`, `examples/` to your skills directory
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
4. **Source must be specific** — "某个插件" is not a valid source; name the actual plugin
5. **干什么是怎么写的** — detailed: simple sentence + 2-4 detailed sentences, based on actual source description

## File Structure

```
asset-inventory/
├── SKILL.md                    # Main skill file (rules + procedure)
├── references/
│   ├── format-example.md       # Table cell format reference
│   ├── host-commands.md        # Outer-app command scan method
│   └── usage-guide.md          # Usage guide format reference
├── examples/
│   └── inventory-example.md    # Desensitized output example
├── update.ps1                  # Update script
└── docs/                       # GitHub Pages + release notes
```

## Testing Your Changes

1. Install the skill locally (global or project-scoped)
2. Run `/asset-inventory` on a machine with OpenCode + plugins
3. Check that all 7 tables are generated correctly
4. Verify JSON PKs match Markdown rows
5. Run `/asset-inventory diff` to compare with previous output

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- **PATCH** (1.0.x): Bug fixes, documentation improvements
- **MINOR** (1.x.0): New features, new table types, new host support
- **MAJOR** (x.0.0): Breaking changes to table structure or output format

Update the `version` field in SKILL.md frontmatter and add an entry to `CHANGELOG.md`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
