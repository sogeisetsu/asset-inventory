# 资产盘点

一个 OpenCode Skill，全量盘点本机的插件、配套软件、Skill、命令、MCP、Agent 与宿主能力，并为每一项标注**来源追溯**。对每个资产回答三问：**是什么、谁带来的、怎么用**。

## 为什么做

OpenCode 环境膨胀得很快：插件、Skill、宿主注入命令、MCP、Agent，几周后你就忘了自己装了什么、**从哪来的**、**什么时候该用**。这个 skill 按需产出一份可信的完整答案——而且从不瞎编。

## 特性

- **一次扫描，完整地图** — 找出本机实际可调用的所有插件、Skill、命令、MCP、Agent 与宿主能力（不只是盘上的文件）。
- **固定 7 表百科** — 软件 → 它们带来的 Skill 与命令 → 原生命令 → 自定义 + 宿主注入命令 → MCP → Agent → 宿主能力。
- **来源可追溯，不瞎编** — 每行来源标注实际来源（`oh-my-opencode-slim@2.2.18（插件包）`、`宿主平台注入，宿主应用 magicPrompts（app.asar）`），绝不写模糊的类别词。
- **四态分类** — `✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在`；禁用项贴出具体配置行。
- **三份文件，一批证据** — `inventory.md`（百科）+ `usage-guide.md`（按每天必用/干活主力/按需/周期性重组的"什么时候用"指南）+ `asset-inventory.json`（机器可读行）。三者同源，一次扫描产出。
- **Agent 模型链** — 表6 每个 Agent 带当前预设下的默认模型链（`a→b→c`），现查不写死，含备用预设名。
- **只读且安全** — 绝不改动任何 skill/command/agent/MCP/配置；默认脱敏 API key、token 与私有路径（真名模式需显式要求）。
- **宿主应用感知** — 对宿主应用包做二进制安全扫描（如 OpenChamber `app.asar`），抓出普通 grep 漏掉的宿主注入命令。
- **差异模式** — 问"跟上次比变了啥"，把上次的 JSON 贴过来，只输出增减项。
- **可移植** — 证据源抽象为多类，换宿主/换 CLI 只重映射一节。

## 安装

选**一种**范围：

| 范围 | 什么时候选 | 目标位置 |
|---|---|---|
| **全局** | 每个项目都能用 | `~/.config/opencode/skills/` |
| **项目级** | 只给一个项目用 | `<项目根目录>/.opencode/skills/` |

```powershell
# 全局（PowerShell）
Copy-Item -Recurse asset-inventory "$env:USERPROFILE\.config\opencode\skills\"

# 项目级（PowerShell）
Copy-Item -Recurse asset-inventory .opencode\skills\
```

```sh
# 全局（macOS / Linux）
cp -r asset-inventory ~/.config/opencode/skills/

# 项目级（macOS / Linux）
cp -r asset-inventory .opencode/skills/
```

> 不确定选哪个？选**全局**——skill 输出跟着你运行的项目走，不管 skill 本身装在哪。

### 用 AI 自动安装

如果你用 AI 编程助手，直接把下面这段话复制给它，让它帮你装：

> 请帮我安装 "asset-inventory" 这个 OpenCode skill，来源是 <https://github.com/sogeisetsu/asset-inventory>。先问我装到**全局**还是**只装进当前项目**。然后克隆或下载该仓库，只复制运行所需的文件——`SKILL.md`、`references/`、`examples/`——到选定的目标位置：全局就装到 `~/.config/opencode/skills/`（Windows：`$env:USERPROFILE\.config\opencode\skills\`），项目级就装到当前项目内的 `.opencode/skills/`（没有就创建）。不要复制 README 文件。确认最终路径是 `<目标位置>/asset-inventory/SKILL.md`。安装过程中不要改动任何 skill 文件。完成后告诉我最终路径。

## 用法

直接说，任意措辞：

- "列一下我有什么插件/Skill/命令/MCP/Agent"
- "哪个被禁用了"
- "谁带进来的"
- "跟上次比变了啥"（差异模式——把上次的 JSON 贴给我）

skill 会往**当前项目根目录**的 `output/` 写入**三份文件**，描述你机器的真实情况；它也是自包含的：在它自己的表4 里能找到它自己。

## 输出结构

```
当前项目根目录\
└── output/
    ├── inventory.md        # 7 表百科
    ├── usage-guide.md      # 使用指南（每天必用 / 干活主力 / 按需 / 周期性）
    └── asset-inventory.json # 机器可读行（主键：table + name）
```

> 注意：产物落在"被盘点的项目"根目录，不是 skill 安装目录——全局安装后，输出跟着你的项目走。

## 验证

跑完后检查：
1. `inventory.md` 恰好 7 个表。
2. 每个来源都写了具体带来者（不是"插件"这种模糊词）。
3. `usage-guide.md` 只收可用项。
4. `asset-inventory.json` 行数与 markdown 表格一致。

## 仓库布局

```
asset-inventory/
├── SKILL.md                    # skill 本体（执行骨架）
├── README-zh.md                # 中文说明（本文件）
├── README.md                   # 英文说明
├── references/
│   ├── format-example.md       # 7 表单元格格式参考
│   ├── host-commands.md        # 宿主注入命令扫描方法 + 清单
│   └── usage-guide.md          # 使用指南格式参考
└── examples/
    └── inventory-example.md    # 脱敏输出示例
```

## 适用范围与兼容性

**适用范围：本 skill 目前只在 OpenCode 中测试过**（含包裹 OpenCode 的宿主应用，如 OpenChamber）。**未在其他 AI 编程助手中验证**（Claude Code、Cursor、Windsurf 等）——在这些软件中能否生效无法确定，也不做支持。

需要 [OpenCode](https://opencode.ai)（skill 经原生 `skill` 工具按需加载）。换宿主时重映射 `SKILL.md` 里的证据源即可。PowerShell 与 sh 示例均考虑。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
