# Asset Inventory

An OpenCode skill that inventories every plugin, companion app, skill, command, MCP server, agent, and host capability on your machine — with **provenance** for each item. For every asset it answers three questions: **what it is, who brought it in, how to use it**.

## Why

OpenCode setups grow fast: plugins, skills, host-injected commands, MCP servers, agents. Within weeks you can't remember what you have, *where it came from*, or *when to reach for it*. This skill produces a single trustworthy answer on demand — and never guesses.

## Features

- **Fixed 7-table structure** — plugins/companion apps → skills & commands they bring → built-in commands & skills → custom + host-injected commands → MCP → agents → host capabilities.
- **Specific provenance** — every source names the actual bringer (`oh-my-opencode-slim@2.2.18 (plugin package)`, `host-injected, host app magicPrompts (app.asar)`), never a vague category.
- **4-state classification** — `✅available / ❌disabled / 📦shelf-only / 🚫absent`; disabled items quote the config line.
- **Dual output** — `inventory.md` (the encyclopedia) + `usage-guide.md` (a scenario/frequency "when to use" guide derived from the same evidence).
- **Agent model chains** — table 6 carries each agent's default model chain (`a→b→c`) from the current preset, looked up fresh.
- **Read-only & safe** — never edits any skill/command/agent/MCP/config; redacts API keys, tokens, and private paths by default (real-name mode only on explicit request).
- **Machine-readable** — standalone JSON with `table + name` primary keys for diff / migration / onboarding.
- **Host-app-aware** — binary-safe scan of the host app bundle (e.g. OpenChamber `app.asar`) to catch host-injected slash commands that plain grep misses.
- **Portable** — evidence sources abstracted into classes; remap one section on a new host/CLI.

## Install

Copy the `asset-inventory` folder into your global skills directory (or project `.opencode/skills/`):

```sh
# global
cp -r asset-inventory ~/.config/opencode/skills/
# or project-scoped
cp -r asset-inventory .opencode/skills/
```

### Auto-install via AI

If you use an AI coding assistant, paste this prompt and let the AI install it for you (the AI should first ask you whether to install globally or into the current project):

> Install the "asset-inventory" OpenCode skill from <https://github.com/sogeisetsu/asset-inventory>. First ask me whether to install it **globally** or **into the current project only**. Then clone or download the repository and copy only the runtime files — `SKILL.md`, `references/`, `examples/` — into the chosen target: global skills directory `~/.config/opencode/skills/` for global, or `.opencode/skills/` inside the current project for project-scoped (create the directory if missing). Do not copy the README files. Verify that `SKILL.md` ends up at `<target>/asset-inventory/SKILL.md`. Do not modify any skill file during installation. Report the final path.

## Usage

Just ask, in any phrasing:

- "List my plugins / skills / commands / MCP / agents"
- "Which one is disabled"
- "Who brought this in"
- "What changed since last time" (diff mode — paste the previous JSON)

The skill writes three files into the **`output/` directory of the project being inventoried** (the current working directory) and describes your actual machine. It is also self-inventorying: it appears in its own table 4.

## Output structure

```
your-project-root/
└── output/
    ├── inventory.md        # 7-table encyclopedia
    ├── usage-guide.md      # when-to-use guide (daily / workhorse / on-demand / periodic)
    └── asset-inventory.json # machine-readable rows (PK: table + name)
```

> Note: the output lands in the project being inventoried, not in the skill's install location — so a globally installed skill still writes into your project root.

## Repository layout

```
asset-inventory/
├── SKILL.md                    # the skill (execution skeleton)
├── README.md                   # English documentation (this file)
├── README-zh.md                # Chinese documentation
├── references/
│   ├── format-example.md       # 7-table cell format reference
│   ├── host-commands.md        # host-injected command scan method + list
│   └── usage-guide.md          # usage-guide format reference
└── examples/
    └── inventory-example.md    # desensitized output example
```

## Compatibility

**Scope: this skill is only tested in OpenCode** (including host apps that wrap OpenCode, such as OpenChamber). It is **not verified in other AI coding assistants** (Claude Code, Cursor, Windsurf, etc.) — whether it works there is unknown and unsupported.

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool). The evidence-source mapping in `SKILL.md` can be remapped for other hosts. Windows (PowerShell) and Unix (sh) examples are both considered.

## License

MIT — see [LICENSE](LICENSE).