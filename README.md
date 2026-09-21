<div align="center">

<img src="assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# 🗃️ Asset Inventory

**Know exactly what your OpenCode setup can actually invoke — every plugin, skill, command, MCP server, agent, and host capability, each with provenance.**

[![License: MIT](assets/badge-license.svg)](LICENSE)
[![OpenCode Skill](assets/badge-opencode.svg)](#compatibility)

[English](README.md) · [中文](README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="assets/banner.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory** is an OpenCode skill that inventories your setup in one shot — every plugin, skill, command, MCP server, agent, and outer-app capability on your machine, each with **provenance** (where it came from). For every asset it answers three questions: **what it is, who brought it in, how to use it**. 🎯

## 🚀 Quick start

```
/asset-inventory
```

Install the skill (one scope), then invoke it. No configuration needed. Append an argument to target part of your setup — `/asset-inventory mcp`, `agents`, `hosts`, `skills`, `diff`, `usage`.

## 📦 Install

> 🌍 **Recommended: install globally.** One copy to install and update, available in every project.

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# copy only SKILL.md + references/ to your skills dir
```

- **Global:** `~/.config/opencode/skills/asset-inventory/`
- **Project-scoped:** `<project-root>/.opencode/skills/asset-inventory/`

📖 Full steps (all platforms) + AI auto-install + updating → **[Install & update](docs/guides/install-and-update.md)**

## 📤 What you get

```
your-project-root/
└── output/
    ├── inventory.md         # the 7-table inventory
    ├── usage-guide.md       # "when to use" guide, by scenario & frequency
    └── asset-inventory.json # machine-readable rows (PK: table + name)
```

👀 **See real examples:** 📄 [inventory.md](docs/samples/inventory.md) · 🧭 [usage-guide.md](docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](docs/samples/asset-inventory.json)

## ✨ Highlights

- 🧭 **Provenance** — built into OpenCode, brought by a plugin, created by you, or injected by a host app. A plugin-managed skill is credited to its plugin, never mislabeled "local".
- 🚦 **Four-state labels** — ✅available / ❌disabled / 📦shelf-only / 🚫absent
- 🔒 **Read-only & masked** — changes no config; masks keys, paths, and private project names by default
- 🖥️ **Host-aware** — binary-scans the app bundle for injected commands that plain grep misses
- 🔀 **Diff mode** — paste the previous JSON and get only additions and removals
- 🌐 **Multilingual output** — the deliverable follows your language (English, Chinese, Japanese, …)

## 📚 Detailed guides

| Guide | What's inside |
|---|---|
| 🧠 [How it works](docs/guides/how-it-works.md) | Core idea, the 7 tables, provenance, the three files |
| 📦 [Install & update](docs/guides/install-and-update.md) | All platforms, AI auto-install, `update.ps1` options |
| 🧭 [Repository & contributing](docs/guides/repository-and-contributing.md) | Which file to read, layout, contributing, versioning |

## 🔗 Links

- 🖥️ **Landing page:** <https://sogeisetsu.github.io/asset-inventory/>
- 🖼️ **Slash commands & usage:** see [How it works](docs/guides/how-it-works.md)
- 📝 **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- 🤝 **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

## ✅ Compatibility

**Scope: this skill is only tested in OpenCode** (including outer apps that wrap OpenCode, such as OpenChamber). It is **not verified in other AI coding assistants** (Claude Code, Cursor, Windsurf, etc.).

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool).

## 📄 License

MIT — see [LICENSE](LICENSE).
