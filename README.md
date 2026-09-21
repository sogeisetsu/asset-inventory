<div align="center">

<img src="assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# Asset Inventory

**Know exactly what your OpenCode setup can actually invoke — every plugin, skill, command, MCP server, agent, and host capability, each with provenance.**

[![License: MIT](assets/badge-license.svg)](LICENSE)
[![OpenCode Skill](assets/badge-opencode.svg)](#compatibility)

[English](README.md) · [Chinese](README-ZH.md)

<img src="assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory** is an OpenCode skill that inventories your setup in one shot — every plugin, skill, command, MCP server, agent, and outer-app capability on your machine, each with **provenance** (where it came from). For every asset it answers three questions: **what it is, who brought it in, how to use it**.

## What this is

OpenCode setups grow fast. Within weeks you forget what you installed, *where it came from*, and *when to reach for it*. This skill produces a single trustworthy answer on demand — and never guesses. One scan maps everything your machine can **actually invoke** (not just files on disk) into three files:

- **`inventory.md`** — one Markdown file containing 7 tables: plugins, skills, commands, MCP, agents, outer-app capabilities, and more, all laid out across the fixed 7 tables.
- **`usage-guide.md`** — a plain-language "when to use" guide, by scenario & frequency.
- **`asset-inventory.json`** — the same data as machine-readable JSON, for tooling and diffing.

## Install

> **Recommended: install globally.** This skill is a general tool for understanding and cleaning up your OpenCode setup — it is not tied to any single project. Install it once in the global skills directory and forget about it.
>
> - **Why global:** one copy to install, update, and keep in sync (instead of a separate copy per project), and it is available everywhere.
> - **What you get:** after a global install, `/asset-inventory` (and the natural-language triggers) works in **every** project and session. Output still lands in whichever project you run it in — even installed globally, the skill writes to that project's `output/`, never to the skill's own folder.
>
> Choose **project-scoped** only if you specifically want the skill to live inside one repository (e.g. to share it with that repo's collaborators through version control).

**Step 1 — get the repository locally.** Either:

```sh
# Clone (recommended)
git clone https://github.com/sogeisetsu/asset-inventory.git
```

or download **Code → Download ZIP** from the GitHub page and unzip it. You'll end up with an `asset-inventory/` folder.

**Step 2 — `cd` into the `asset-inventory/` folder and copy only two things** (`SKILL.md`, `references/` — the README, docs, scripts, etc. are not needed) to the target:

| Scope | When to choose | Target |
|---|---|---|
| **Global** | Available in every project | `~/.config/opencode/skills/` (Windows: `$env:USERPROFILE\.config\opencode\skills\`) |
| **Project-scoped** | Only for one project | `<project-root>/.opencode/skills/` |

```sh
# Global (macOS / Linux)
mkdir -p ~/.config/opencode/skills/asset-inventory
cp -r SKILL.md references ~/.config/opencode/skills/asset-inventory/

# Project-scoped (macOS / Linux) — replace <project-root> with your project path
mkdir -p <project-root>/.opencode/skills/asset-inventory
cp -r SKILL.md references <project-root>/.opencode/skills/asset-inventory/
```

```powershell
# Global (Windows PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references -Destination "$env:USERPROFILE\.config\opencode\skills\asset-inventory\"

# Project-scoped (Windows PowerShell) — replace <project-root> with your project path
New-Item -ItemType Directory -Force -Path "<project-root>\.opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references -Destination "<project-root>\.opencode\skills\asset-inventory\"
```

### Auto-install via AI

Paste this prompt into an AI coding assistant and let it install for you:

```text
Install the OpenCode skill "asset-inventory" from <https://github.com/sogeisetsu/asset-inventory>.

1. First ask me exactly one question: install globally, or into the current project only.
2. Get the repository: prefer `git clone`; if git is unavailable or the clone fails, download the GitHub ZIP instead.
3. Copy only the two runtime items (SKILL.md and references/) into the target:
   - Global: ~/.config/opencode/skills/asset-inventory/ (Windows: $env:USERPROFILE\.config\opencode\skills\asset-inventory\)
   - Project-scoped: .opencode/skills/asset-inventory/ inside the current project.
   Create the directory if it is missing. Do not copy the README, docs, assets, or scripts.
4. If the skill already exists at the target, overwrite it (that is an update) — do not ask a second time.
5. When done, verify <target>/asset-inventory/SKILL.md exists, and read the installed version from its frontmatter `metadata.version`.
6. Treat the source as read-only and do not modify any skill content. Report only the install location and the version.
```

## Updating

Already installed? Pull the latest and overwrite:

```sh
cd asset-inventory && pwsh ./update.ps1
```

The script auto-detects where your install lives (global `~/.config/opencode/skills/asset-inventory/` or a project-scoped directory), does `git pull`, and copies over the two runtime items (SKILL.md and references/). It reports the before/after version so you can confirm the update took effect.

For a **project-scoped** install, pass the target explicitly:

```sh
pwsh ./update.ps1 -Target /path/to/your-project/.opencode/skills/asset-inventory
```

Or re-run the one-liner from [Install](#install) — it's idempotent.

## Quick start

Install the skill (one scope), then invoke it. No configuration needed.

```
/asset-inventory
```

That one command runs the full inventory end-to-end. To target just part of your setup, append an argument — see [Slash commands](#slash-commands).

## Slash commands

Once installed, OpenCode automatically registers the skill as a slash command under its own name. In the input box, type `/` and pick `asset-inventory`, or open the `/skills` dialog and select it.

The 7 tables, in order: **1** Plugins & companion apps · **2** Skills & commands each brings · **3** Built-in commands & skills · **4** Custom skills, commands & outer-app-injected commands · **5** MCP · **6** Agents (with model chains) · **7** Outer-app capabilities. What each table covers → see [The 7 tables in `inventory.md`](#the-7-tables-in-inventorymd)

| Command | What it does | Output |
|---|---|---|
| `/asset-inventory` | Full inventory: all 7 tables | `inventory.md` + `usage-guide.md` + `asset-inventory.json` |
| `/asset-inventory mcp` | MCP servers only (table 5) | `inventory.md` (table 5 only) + `asset-inventory.json` (table 5 rows) |
| `/asset-inventory agents` | Agents only (table 6) | `inventory.md` (table 6 only) + `asset-inventory.json` (table 6 rows) |
| `/asset-inventory hosts` | Outer-app capabilities only (table 7) | `inventory.md` (table 7 only) + `asset-inventory.json` (table 7 rows) |
| `/asset-inventory skills` | Skills & commands only (tables 2–4) | `inventory.md` (tables 2–4 only) + `asset-inventory.json` (tables 2–4 rows) |
| `/asset-inventory diff` | Diff mode | added/removed rows only (paste last JSON) |
| `/asset-inventory usage` | Full scan, then only the usage guide | `usage-guide.md` only |

A targeted run (`mcp`, `agents`, `hosts`, `skills`) writes `inventory.md` (limited to that table) plus the matching JSON rows, and skips the unrelated evidence-collection steps.

## Usage

- **By slash command**: as above. Append a target for a focused scan.
- **By natural language** — just ask, in any phrasing:
  - "List my plugins / skills / commands / MCP / agents"
  - "Which one is disabled"
  - "Who brought this in"
  - "What changed since last time" (diff mode — paste the previous JSON)

The skill writes its output into the **`output/` directory of the project being inventoried** (your current working directory) and describes your actual machine.

## What you get

```
your-project-root/
└── output/
    ├── inventory.md        # the 7-table inventory
    ├── usage-guide.md      # "when to use" guide (daily / workhorse / on-demand / periodic)
    └── asset-inventory.json # machine-readable rows (PK: table + name)
```

> The output lands in the project being inventoried, not in the skill's install location — so a globally installed skill still writes into your project root.

**See real examples:** 📄 [inventory.md](docs/samples/inventory.md) · 🧭 [usage-guide.md](docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](docs/samples/asset-inventory.json) — generated from a real machine, so you know exactly what you'll get.

### The 7 tables in `inventory.md`

`inventory.md` is the first file in `output/` above — a Markdown document that organizes every asset into the following 7 tables:

| # | Table | What it covers |
|---|---|---|
| 1 | Plugins & companion apps | the software/plugins themselves, real names |
| 2 | Skills & commands each brings | every skill/command grouped by who provides it |
| 3 | Built-in commands & skills | native TUI commands & skills |
| 4 | Custom skills, commands & outer-app-injected commands | your own + outer-app-injected commands |
| 5 | MCP | every MCP server (global + project), local/remote, enabled state |
| 6 | Agents | every agent, with its default model chain (`a→b→c`) |
| 7 | Outer-app capabilities | behavior rules, in-app browser, etc. |

### Provenance, not guesses

Every row says exactly **where the asset came from** — built into OpenCode, brought in by a specific plugin, created by you, or injected by an outer app (like OpenChamber) — never a vague "some plugin". Every asset also gets a status: usable, disabled, on the shelf but not installed, or simply absent.

### Three files, one evidence

`inventory.md`, `usage-guide.md`, and `asset-inventory.json` are all derived from the **same scan** — no double collection. The usage guide reorganizes the same rows by scenario and frequency ("when and why to reach for each"), never re-collecting or inventing facts.

## A note on "outer app" (host)

Some tables and sources refer to an **outer app** — the desktop program that wraps the OpenCode engine and injects extra commands and capabilities (for example **OpenChamber**). In English this is sometimes called the **host**. Whenever you see it, read it as: *the desktop app sitting around OpenCode that adds its own slash commands and features*.

## Repository layout

```
asset-inventory/
├── SKILL.md                    # the skill (execution skeleton + rules)
├── update.ps1                  # one-command update script
├── README.md                   # English documentation (this file)
├── README-ZH.md                # Chinese documentation
├── CHANGELOG.md                # version history (English)
├── CONTRIBUTING.md             # contribution guidelines (English)
├── LICENSE                     # MIT
├── references/                 # skill format & scan-method references
├── assets/                     # local SVG icon / banner / badges (generated)
├── scripts/
│   ├── check-docs.mjs          # docs / links / frontmatter validation
│   └── generate-assets.mjs     # regenerates assets/*.svg
├── docs/                       # GitHub Pages + release notes + samples
│   └── samples/                # example output: inventory.md, usage-guide.md, asset-inventory.json
└── zh/                         # all Chinese docs except README-ZH.md
    ├── CHANGELOG-ZH.md
    ├── CONTRIBUTING-ZH.md
    ├── LICENSE-ZH.txt
    ├── release-notes-v1.1.0-ZH.md
    ├── release-notes-v1.3.0-ZH.md├── release-notes-v1.4.0-ZH.md├── release-notes-v1.5.0-ZH.md└── release-notes-v1.6.0-ZH.md
```

Local-only Chinese guides (`zh/skill-zh.md`, `zh/repo-init-guide-zh.md`) and `AGENTS.md` are gitignored and never published.

### Which file should I read?

| You want to… | Read |
|---|---|
| Understand the skill's rules / change its behavior | `SKILL.md` |
| See the exact cell format for a table | `references/format-example.md` |
| Know every pre-output check | `references/checklist.md` |
| Add a language / fixed output strings | `references/glossary.json` |
| Support a new outer app / host | `references/host-commands.md` |
| Format the usage guide | `references/usage-guide.md` |
| Debug a failed run | `references/troubleshooting.md` |
| Install or update | `README.md` (this file) · `update.ps1 -Help` |
| Contribute / release | `CONTRIBUTING.md` · `CHANGELOG.md` |

`references/` holds the runtime reference files shipped with the skill; `scripts/`, `docs/`, and `zh/` are development-side only.


## Compatibility

**Scope: this skill is only tested in OpenCode** (including outer apps that wrap OpenCode, such as OpenChamber). It is **not verified in other AI coding assistants** (Claude Code, Cursor, Windsurf, etc.) — whether it works there is unknown and unsupported.

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool).

## License

MIT — see [LICENSE](LICENSE).
