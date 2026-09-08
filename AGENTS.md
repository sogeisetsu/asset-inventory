# AGENTS.md

## What this is

An OpenCode skill (`asset-inventory`) that inventories plugins, skills, commands, MCP servers, agents, and outer-app capabilities on a machine. It outputs 7 Markdown tables + JSON + usage guide.

**This is not a code project.** There are no tests, no build, no lint. The "code" is SKILL.md — a prompt that instructs an AI agent what to do.

## Key files

- `SKILL.md` — the skill itself (rules, procedure, quality checklist). **Source of truth.**
- `references/` — format examples, scan methods, troubleshooting.辅助文档，不是事实。
- `examples/` — desensitized output examples.
- `update.ps1` — one-command update script (copies runtime files to install location).
- `output/` — **gitignored**. Generated files land here when skill runs.

## Core philosophy

**Always scan fresh. Never preset.** The skill's #1 rule is "verify everything on this machine." This means:
- Do NOT add hardcoded command/asset lists to reference files
- Do NOT assume what exists — the scan discovers it
- `references/host-commands.md` provides scan *methods*, not command lists

## Workflow

1. Edit `SKILL.md` for rule/behavior changes
2. Edit `references/` for format/method documentation
3. Run `pwsh ./update.ps1` to deploy to install location
4. Version lives in SKILL.md frontmatter (`version: x.y.z`)

## Gotchas

- `output/` is gitignored — don't commit generated files
- Outer app scanning must work for any host (Electron, Tauri, native), not just OpenChamber
- The skill is bilingual (CN/EN) — output follows user's language
- Provenance format must also follow output language
