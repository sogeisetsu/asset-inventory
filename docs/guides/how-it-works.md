# How it works 📖

> Detailed companion to the main [README](../../README.md). This page explains what the skill produces and why it is trustworthy.

## Core idea 💡

The inventory records what the machine can **actually invoke**, not which files exist on disk. Every row answers three questions:

- **what it is** (name)
- **who brought it in** (a specific, three-part source)
- **how to use it** (when to use it + the invocation path)

The source must name the specific bringer — "built into OpenCode", "brought by `@user/plugin`", "created by you", or "injected by the host app (e.g. OpenChamber)". Never a vague "some plugin".

## 🗂️ The 7 tables in `inventory.md`

| # | Table | What it covers |
|---|---|---|
| 1 | Plugins & companion apps | the software/plugins themselves, by real product name |
| 2 | Skills & commands each brings | every skill/command, grouped by who provides it |
| 3 | Built-in commands & skills | native TUI commands & skills |
| 4 | Custom skills, commands & host-injected commands | your own + outer-app-injected commands |
| 5 | MCP | **every** MCP server (global + project), local/remote, enabled state |
| 6 | Agents | every agent, with its default model chain (`a→b→c`) |
| 7 | Host capabilities | behavior rules, model preferences, in-app browser, etc. |

Tables 1–5 and 7 have five columns (`Name | Source | How to call | When to use | What it does`); Table 6 (Agents) adds a sixth, `Model chain`.

## 🔍 Provenance, not guesses

Every row says exactly where the asset came from. A plugin-managed skill is attributed to its plugin (read from the plugin's `skills-manifest.json`), never called "local" by default. A repo URL is only written when actually verified — never inferred from a folder name.

Every asset also carries a state: ✅available, ❌disabled, 📦shelf-only, or 🚫absent — plus a confidence suffix (✅verified / ✅docs / ⚠️inferred).

## 🧾 Three files, one evidence

`inventory.md`, `usage-guide.md`, and `asset-inventory.json` are all derived from the **same scan** — no double collection.

- **`inventory.md`** — the 7 tables.
- **`usage-guide.md`** — the same rows reorganized by scenario and frequency ("when and why to reach for each"). It has two modes: a generic guide for an empty project, and a project-anchored one for a non-empty project (kept general enough not to over-couple).
- **`asset-inventory.json`** — the same rows, machine-readable. Primary key is `table` + `name`, and the `table` field is always the number `1`–`7`, which keeps diffing stable even across languages.

See real examples in [`docs/samples/`](../samples/): 📄 [inventory.md](../samples/inventory.md) · 🧭 [usage-guide.md](../samples/usage-guide.md) · 🧾 [asset-inventory.json](../samples/asset-inventory.json).

<a id="targeting"></a>
## 🎯 Targeting: scanning only part of your setup

By default the skill produces the full inventory. Appending **one argument** narrows the scan: unrelated evidence is skipped, but the fixed strings, cell conventions, masking rules, and the `output/` path stay identical.

| Argument | What it scans | What it writes |
|---|---|---|
| *(none)* | all 7 tables | `inventory.md` + `usage-guide.md` + `asset-inventory.json` |
| `mcp` | MCP servers only | `inventory.md` (Table 5 only) + JSON (Table 5 rows) |
| `agents` | agents only | `inventory.md` (Table 6 only) + JSON (Table 6 rows) |
| `hosts` | outer-app capabilities only | `inventory.md` (Table 7 only) + JSON (Table 7 rows) |
| `skills` | skills & commands only | `inventory.md` (Tables 2–4) + JSON (Tables 2–4 rows) |
| `diff` | no new scan — you paste the previous JSON | only the added and removed rows |
| `usage` | a full scan (the guide derives from the full rows) | `usage-guide.md` only |

Example: `/asset-inventory mcp` re-checks only your MCP servers and rewrites `inventory.md` with Table 5 alone — handy after adding or removing a server. An unrecognized argument falls back to the full scan and says so at the end.

## 🖥️ A note on "outer app" (host)

Some tables refer to an **outer app** — the desktop program that wraps the OpenCode engine and injects extra commands and capabilities (for example **OpenChamber**). In English this is sometimes called the **host**. It is *the desktop app sitting around OpenCode that adds its own slash commands and features*.
