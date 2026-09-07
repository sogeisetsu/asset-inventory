# Asset Inventory

Inventory your OpenCode setup in one shot — every plugin, skill, command, MCP server, agent, and outer-app capability on your machine, each with **provenance** (where it came from). For every asset it answers three questions: **what it is, who brought it in, how to use it**.

## What this is

OpenCode setups grow fast. Within weeks you forget what you installed, *where it came from*, and *when to reach for it*. This skill produces a single trustworthy answer on demand — and never guesses. One scan maps everything your machine can **actually invoke** (not just files on disk), into a fixed 7-table encyclopedia plus a plain-language "when to use" guide and a machine-readable JSON.

## Quick start

Install the skill (one scope), then invoke it. No configuration needed.

```
/asset-inventory
```

That one command runs the full inventory end-to-end. To target just part of your setup, append an argument — see [Slash commands](#slash-commands).

## Slash commands

Once installed, OpenCode automatically registers the skill as a slash command under its own name. In the input box, type `/` and pick `asset-inventory`, or open the `/skills` dialog and select it.

| Command | What it does | Output |
|---|---|---|
| `/asset-inventory` | Full inventory: all 7 tables | three files in `output/` |
| `/asset-inventory mcp` | MCP servers only | `inventory.md` (table 5) + JSON |
| `/asset-inventory agents` | Agents only | table 6 + JSON |
| `/asset-inventory hosts` | Outer-app capabilities only | table 7 + JSON |
| `/asset-inventory skills` | Skills & commands only | tables 2+3+4 + JSON |
| `/asset-inventory diff` | Diff mode | added/removed rows only (paste last JSON) |
| `/asset-inventory usage` | Full scan, then only the usage guide | `usage-guide.md` only |

> The command name follows the skill's `name` (frontmatter in `SKILL.md`). Rename the skill and the slash command changes with it. Targeted runs skip the unrelated evidence-collection steps, but keep the same output rules (language, provenance, masking, `output/` location).

## Install

Choose **one** scope:

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

> Install the "asset-inventory" OpenCode skill from <https://github.com/sogeisetsu/asset-inventory>. First ask me whether to install it **globally** or **into the current project only**. Then clone or download the repository and copy only the runtime files — `SKILL.md`, `references/`, `examples/` — into the chosen target: global skills directory `~/.config/opencode/skills/` (Windows: `$env:USERPROFILE\.config\opencode\skills\`) for global, or `.opencode/skills/` inside the current project for project-scoped (create the directory if missing). Do not copy the README files. Verify that `SKILL.md` ends up at `<target>/asset-inventory/SKILL.md`. Do not modify any skill file during installation. Report the final path.

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
    ├── inventory.md        # the 7-table encyclopedia
    ├── usage-guide.md      # "when to use" guide (daily / workhorse / on-demand / periodic)
    └── asset-inventory.json # machine-readable rows (PK: table + name)
```

> The output lands in the project being inventoried, not in the skill's install location — so a globally installed skill still writes into your project root.

### The 7 tables

| # | Table | What it covers |
|---|---|---|
| 1 | 插件与配套软件 | the software/plugins themselves, real names |
| 2 | 各软件/插件带来的 Skill 与命令 | every skill/command grouped by who provides it |
| 3 | 原生命令与原生 Skill | built-in TUI commands & skills |
| 4 | 自定义 Skill、命令与外层应用注入命令 | your own + outer-app-injected commands |
| 5 | MCP | every MCP server (global + project), local/remote, enabled state |
| 6 | Agent | every agent, with its default model chain (`a→b→c`) |
| 7 | 外层应用 | outer-app capabilities (behavior rules, browser, etc.) |

### Provenance, not guesses

Every row names the **specific bringer** with a confidence suffix — `oh-my-opencode-slim@2.2.18（插件包）`, `外层应用注入，外层应用 magicPrompts（app.asar）` — never a vague category. Every asset gets one of four states: `✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在`.

### Three files, one evidence

`inventory.md`, `usage-guide.md`, and `asset-inventory.json` are all derived from the **same scan** — no double collection. The usage guide reorganizes the same rows by scenario and frequency ("when and why to reach for each"), never re-collecting or inventing facts.

## Verify

After running, check:
1. `inventory.md` has exactly 7 tables.
2. Every source names a specific bringer (not a bare category like "plugin").
3. `usage-guide.md` only contains available items.
4. `asset-inventory.json` has the same row count as the markdown tables.

## A note on "outer app" (宿主 / host)

Some of this skill's tables and sources refer to an **outer app** — the desktop program that wraps the OpenCode engine and injects extra commands and capabilities (for example **OpenChamber**). In English sources this is sometimes called the **host**. We use **外层应用** in Chinese to avoid the confusing bare word "宿主", which doesn't tell a reader *what* it is. When you see 外层应用, think: *the desktop app sitting around OpenCode that adds its own slash commands and features*.

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
