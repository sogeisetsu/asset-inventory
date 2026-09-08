# Asset Inventory

**asset-inventory** is an OpenCode skill that inventories your setup in one shot — every plugin, skill, command, MCP server, agent, and outer-app capability on your machine, each with **provenance** (where it came from). For every asset it answers three questions: **what it is, who brought it in, how to use it**.

## What this is

OpenCode setups grow fast. Within weeks you forget what you installed, *where it came from*, and *when to reach for it*. This skill produces a single trustworthy answer on demand — and never guesses. One scan maps everything your machine can **actually invoke** (not just files on disk) into three files:

- **`inventory.md`** — one Markdown file containing 7 tables: plugins, skills, commands, MCP, agents, outer-app capabilities, and more, all laid out across the fixed 7 tables.
- **`usage-guide.md`** — a plain-language "when to use" guide, by scenario & frequency.
- **`asset-inventory.json`** — the same data as machine-readable JSON, for tooling and diffing.

## Install

**Step 1 — get the repository locally.** Either:

```sh
# Clone (recommended)
git clone https://github.com/sogeisetsu/asset-inventory.git
```

or download **Code → Download ZIP** from the GitHub page and unzip it. You'll end up with an `asset-inventory/` folder.

**Step 2 — `cd` into the `asset-inventory/` folder and copy only three things** (`SKILL.md`, `references/`, `examples/` — the README, docs, etc. are not needed) to the target:

| Scope | When to choose | Target |
|---|---|---|
| **Global** | Available in every project | `~/.config/opencode/skills/` (Windows: `$env:USERPROFILE\.config\opencode\skills\`) |
| **Project-scoped** | Only for one project | `<project-root>/.opencode/skills/` |

```sh
# Global (macOS / Linux)
mkdir -p ~/.config/opencode/skills/asset-inventory
cp -r SKILL.md references examples ~/.config/opencode/skills/asset-inventory/

# Project-scoped (macOS / Linux) — replace <project-root> with your project path
mkdir -p <project-root>/.opencode/skills/asset-inventory
cp -r SKILL.md references examples <project-root>/.opencode/skills/asset-inventory/
```

```powershell
# Global (Windows PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references, examples -Destination "$env:USERPROFILE\.config\opencode\skills\asset-inventory\"

# Project-scoped (Windows PowerShell) — replace <project-root> with your project path
New-Item -ItemType Directory -Force -Path "<project-root>\.opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references, examples -Destination "<project-root>\.opencode\skills\asset-inventory\"
```

> Not sure? Go with **global** — the skill writes its output into whatever project you run it in, regardless of where the skill itself lives.

### Auto-install via AI

Paste this prompt into an AI coding assistant and let it install for you:

```text
Install the "asset-inventory" OpenCode skill from <https://github.com/sogeisetsu/asset-inventory>. First ask me whether to install it globally or into the current project only. Then clone or download the repository and copy only the runtime files — SKILL.md, references/, examples/ — into the chosen target: global skills directory ~/.config/opencode/skills/ (Windows: $env:USERPROFILE\.config\opencode\skills\) for global, or .opencode/skills/ inside the current project for project-scoped (create the directory if missing). Do not copy the README files. Verify that SKILL.md ends up at <target>/asset-inventory/SKILL.md. Do not modify any skill file during installation. Report the final path.
```

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
├── README.md                   # English documentation (this file)
├── README-zh.md                # Chinese documentation
├── references/
│   ├── format-example.md       # 7-table cell format reference
│   ├── host-commands.md        # outer-app command scan method + list
│   └── usage-guide.md          # usage-guide format reference
└── examples/
    └── inventory-example.md    # desensitized output example
```

## Compatibility

**Scope: this skill is only tested in OpenCode** (including outer apps that wrap OpenCode, such as OpenChamber). It is **not verified in other AI coding assistants** (Claude Code, Cursor, Windsurf, etc.) — whether it works there is unknown and unsupported.

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool).

## License

MIT — see [LICENSE](LICENSE).
