# Asset Inventory

Inventory your OpenCode setup in one shot — every plugin, skill, command, MCP server, agent, and outer-app capability on your machine, each with **provenance** (where it came from). For every asset it answers three questions: **what it is, who brought it in, how to use it**.

## What this is

OpenCode setups grow fast. Within weeks you forget what you installed, *where it came from*, and *when to reach for it*. This skill produces a single trustworthy answer on demand — and never guesses. One scan maps everything your machine can **actually invoke** (not just files on disk) into three files:

- **`inventory.md`** — a fixed 7-table inventory: every asset listed across the 7 tables.
- **`usage-guide.md`** — a plain-language "when to use" guide, by scenario & frequency.
- **`asset-inventory.json`** — the same data as machine-readable JSON, for tooling and diffing.

## Install

**Step 1 — get the repository locally.** Either:

```sh
# Clone (recommended)
git clone https://github.com/sogeisetsu/asset-inventory.git
```

or download **Code → Download ZIP** from the GitHub page and unzip it. You'll end up with an `asset-inventory/` folder.

**Step 2 — pick** one **scope, then run the matching command from the directory that *contains* the `asset-inventory/` folder** (i.e. `cd` one level *above* `asset-inventory`, then execute):

| Scope | When to choose | Target |
|---|---|---|
| **Global** | Available in every project | `~/.config/opencode/skills/` |
| **Project-scoped** | Only for one project | `<project>/.opencode/skills/` |

```sh
# Global (macOS / Linux)
cp -r asset-inventory ~/.config/opencode/skills/

# Global (Windows PowerShell)
Copy-Item -Recurse asset-inventory "$env:USERPROFILE\.config\opencode\skills\"

# Project-scoped (macOS / Linux)
cp -r asset-inventory .opencode/skills/

# Project-scoped (Windows PowerShell)
Copy-Item -Recurse asset-inventory .opencode\skills\
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

Every run produces **three files**, all derived from the same scan (no double collection):

- **`inventory.md`** — the 7-table inventory.
- **`usage-guide.md`** — a "when to use" guide that reorganizes the same rows by scenario & frequency (daily / workhorse / on-demand / periodic).
- **`asset-inventory.json`** — machine-readable rows (PK: `table` + `name`), for diff / migration / onboarding.

The 7 tables, in order: **1** Plugins & companion apps · **2** Skills & commands each brings · **3** Built-in commands & skills · **4** Custom skills, commands & outer-app-injected commands · **5** MCP · **6** Agents (with model chains) · **7** Outer-app capabilities. What each table covers → see [The 7 tables](#the-7-tables)

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

The skill writes its output into the **`output/` directory of the project being inventoried** (your current working directory) and describes your actual machine. It is also self-inventorying: it appears in its own table 4.

## What you get

```
your-project-root/
└── output/
    ├── inventory.md        # the 7-table inventory
    ├── usage-guide.md      # "when to use" guide (daily / workhorse / on-demand / periodic)
    └── asset-inventory.json # machine-readable rows (PK: table + name)
```

> The output lands in the project being inventoried, not in the skill's install location — so a globally installed skill still writes into your project root.

### The 7 tables

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

Every row names the **specific bringer** with a confidence suffix — `oh-my-opencode-slim@2.2.18 (plugin package)`, `outer-app injected, outer-app magicPrompts (app.asar)` — never a vague category. Every asset gets one of four states: `✅available / ❌disabled / 📦shelf-only / 🚫absent`.

### Three files, one evidence

`inventory.md`, `usage-guide.md`, and `asset-inventory.json` are all derived from the **same scan** — no double collection. The usage guide reorganizes the same rows by scenario and frequency ("when and why to reach for each"), never re-collecting or inventing facts.

## Verify

After running, check:
1. `inventory.md` has exactly 7 tables.
2. Every source names a specific bringer (not a bare category like "plugin").
3. `usage-guide.md` only contains available items.
4. `asset-inventory.json` has the same row count as the markdown tables.

## A note on "outer app" (host / 外层应用)

Some tables and sources refer to an **outer app** — the desktop program that wraps the OpenCode engine and injects extra commands and capabilities (for example **OpenChamber**). In English this is sometimes called the **host**. In the Chinese docs and table sources we use **外层应用** rather than the bare word 宿主, because 宿主 ("host") doesn't tell a reader what it is. Whenever you see 外层应用, read it as: *the desktop app sitting around OpenCode that adds its own slash commands and features*.

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

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool). The evidence-source mapping in `SKILL.md` can be remapped for other hosts. Windows (PowerShell) and Unix (sh) examples are both considered.

## License

MIT — see [LICENSE](LICENSE).
