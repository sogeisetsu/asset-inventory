# Asset Inventory · 资产盘点

> **English** | [**中文**](#中文)

An OpenCode skill that inventories every plugin, companion app, skill, command, MCP server, agent, and host capability on your machine — with **provenance** for each item. It answers three questions for every asset: **what is it, who brought it in, can I remove it**.

一个 OpenCode Skill，全量盘点本机的插件、配套软件、Skill、命令、MCP、Agent 与宿主能力，并为每一项标注**来源追溯**。对每个资产回答三问：**是什么、谁带来的、能不能删/删了会怎样**。

---

## English

### Why

OpenCode setups grow fast: plugins, skills, host-injected commands, MCP servers, agents. Within weeks you can't remember what you have, *where it came from*, or *what breaks if you delete it*. This skill produces a single trustworthy answer on demand — and never guesses.

### Features

- **7 tables, fixed structure** — plugins/companion apps → skills & commands they bring → built-in commands & skills → custom + host-injected commands → MCP → agents → host capabilities.
- **Specific provenance** — every source names the actual bringer (`oh-my-opencode-slim@2.2.18（插件包）`, `宿主平台注入，宿主应用 magicPrompts（app.asar）`), never a vague category.
- **4-state classification** — `✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在`; disabled items quote the config line.
- **Dual output** — `inventory.md` (the encyclopedia) + `usage-guide.md` (a scenario/frequency "when to use" guide derived from the same evidence).
- **Agent model chains** — 表6 carries each agent's default model chain (`a→b→c`) from the current preset, looked up fresh.
- **Read-only & safe** — never edits any skill/command/agent/MCP/config; redacts API keys, tokens, and private paths by default (real-name mode only on explicit request).
- **Machine-readable** — standalone JSON with `table + name` primary keys for diff / migration / onboarding.
- **Host-app-aware** — binary-safe scan of the host app bundle (e.g. OpenChamber `app.asar`) to catch host-injected slash commands that plain grep misses.
- **Portable** — evidence sources abstracted into 5 classes; remap one section on a new host/CLI.

### Install

Copy the `asset-inventory` folder into your global skills directory (or project `.opencode/skills/`):

```sh
# global
cp -r asset-inventory ~/.config/opencode/skills/
# or project-scoped
cp -r asset-inventory .opencode/skills/
```

### Usage

Just ask, in any phrasing:

- "列一下我有什么插件/Skill/命令/MCP/Agent"
- "哪个被禁用了"
- "谁带进来的"
- "能不能删 / 删了会怎样"
- "跟上次比变了啥" (diff mode — paste the previous JSON)

The skill outputs `inventory.md` + `usage-guide.md` (+ a JSON file) describing your actual machine. It is also self-inventorying: it appears in its own 表4.

### Output structure

```
E:\your-project\
├── inventory.md        # 7-table encyclopedia
├── usage-guide.md      # when-to-use guide (每天必用 / 干活主力 / 按需 / 周期性)
└── asset-inventory.json # machine-readable rows (PK: table + name)
```

### Repository layout

```
asset-inventory/
├── SKILL.md                    # the skill (execution skeleton)
├── references/
│   ├── format-example.md       # 7-table cell format reference
│   ├── host-commands.md        # host-injected command scan method + list
│   └── usage-guide.md          # usage-guide format reference
└── examples/
    └── inventory-example.md    # desensitized output example
```

### Compatibility

Requires [OpenCode](https://opencode.ai) (skills are loaded on-demand via the native `skill` tool). Works with host apps that wrap OpenCode (e.g. OpenChamber); the evidence-source mapping in `SKILL.md` can be remapped for other hosts. Windows (PowerShell) and Unix (sh) examples are both considered.

### License

MIT — see [LICENSE](LICENSE).

---

## 中文

### 为什么做

OpenCode 环境膨胀得很快：插件、Skill、宿主注入命令、MCP、Agent，几周后你就忘了自己装了什么、**从哪来的**、**删了会不会炸**。这个 skill 按需产出一份可信的完整答案——而且从不瞎编。

### 特性

- **固定 7 表结构** — 插件/配套软件 → 它们带来的 Skill 与命令 → 原生命令与原生 Skill → 自定义 + 宿主注入命令 → MCP → Agent → 宿主能力。
- **来源必写具体带来者** — 每行来源标注实际来源（`oh-my-opencode-slim@2.2.18（插件包）`、`宿主平台注入，宿主应用 magicPrompts（app.asar）`），绝不写模糊的类别词。
- **四态分类** — `✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在`；禁用项必须贴出配置行。
- **双输出** — `inventory.md`（百科）+ `usage-guide.md`（按场景/频率的"什么时候用"指南，同一批证据派生，不重复收集）。
- **Agent 模型链** — 表6 每个 Agent 带当前预设下的默认模型链（`a→b→c`），现查不写死。
- **只读且安全** — 绝不改动任何 skill/command/agent/MCP/配置；默认脱敏 API key、token 与私有路径（真名模式需显式要求）。
- **机器可读** — 独立 JSON，`table + name` 主键，供 diff / 迁移 / 入职交接。
- **宿主应用感知** — 对宿主应用包做二进制安全扫描（如 OpenChamber `app.asar`），抓出普通 grep 漏掉的宿主注入命令。
- **可移植** — 证据源抽象为 5 类，换宿主/换 CLI 只重映射一节。

### 安装

把 `asset-inventory` 文件夹复制到全局 skills 目录（或项目 `.opencode/skills/`）：

```powershell
# 全局（PowerShell）
Copy-Item -Recurse asset-inventory "$env:USERPROFILE\.config\opencode\skills\"
# 或项目级
Copy-Item -Recurse asset-inventory .opencode\skills\
```

### 用法

直接说，任意措辞：

- "列一下我有什么插件/Skill/命令/MCP/Agent"
- "哪个被禁用了"
- "谁带进来的"
- "能不能删 / 删了会怎样"
- "跟上次比变了啥"（差异模式——把上次的 JSON 贴给我）

skill 会输出 `inventory.md` + `usage-guide.md`（+ JSON），描述你机器的真实情况。它也是自包含的：在它自己的表4 里能找到它自己。

### 输出结构

```
E:\your-project\
├── inventory.md        # 7 表百科
├── usage-guide.md      # 使用指南（每天必用 / 干活主力 / 按需 / 周期性）
└── asset-inventory.json # 机器可读行（主键：table + name）
```

### 仓库布局

```
asset-inventory/
├── SKILL.md                    # skill 本体（执行骨架）
├── references/
│   ├── format-example.md       # 7 表单元格格式参考
│   ├── host-commands.md        # 宿主注入命令扫描方法 + 清单
│   └── usage-guide.md          # 使用指南格式参考
└── examples/
    └── inventory-example.md    # 脱敏输出示例
```

### 兼容性

需要 [OpenCode](https://opencode.ai)（skill 经原生 `skill` 工具按需加载）。兼容包裹 OpenCode 的宿主应用（如 OpenChamber）；换宿主时重映射 `SKILL.md` 里的证据源即可。PowerShell 与 sh 示例均考虑。

### 许可证

MIT — 见 [LICENSE](LICENSE)。