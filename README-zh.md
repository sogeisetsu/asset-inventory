# 资产盘点

一个 OpenCode Skill，全量盘点本机的插件、配套软件、Skill、命令、MCP、Agent 与宿主能力，并为每一项标注**来源追溯**。对每个资产回答三问：**是什么、谁带来的、怎么用**。

## 为什么做

OpenCode 环境膨胀得很快：插件、Skill、宿主注入命令、MCP、Agent，几周后你就忘了自己装了什么、**从哪来的**、**什么时候该用**。这个 skill 按需产出一份可信的完整答案——而且从不瞎编。

## 特性

- **固定 7 表结构** — 插件/配套软件 → 它们带来的 Skill 与命令 → 原生命令与原生 Skill → 自定义 + 宿主注入命令 → MCP → Agent → 宿主能力。
- **来源必写具体带来者** — 每行来源标注实际来源（`oh-my-opencode-slim@2.2.18（插件包）`、`宿主平台注入，宿主应用 magicPrompts（app.asar）`），绝不写模糊的类别词。
- **四态分类** — `✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在`；禁用项必须贴出配置行。
- **双输出** — `inventory.md`（百科）+ `usage-guide.md`（按场景/频率的"什么时候用"指南，同一批证据派生，不重复收集）。
- **Agent 模型链** — 表6 每个 Agent 带当前预设下的默认模型链（`a→b→c`），现查不写死。
- **只读且安全** — 绝不改动任何 skill/command/agent/MCP/配置；默认脱敏 API key、token 与私有路径（真名模式需显式要求）。
- **机器可读** — 独立 JSON，`table + name` 主键，供差异对比 / 迁移 / 入职交接。
- **宿主应用感知** — 对宿主应用包做二进制安全扫描（如 OpenChamber `app.asar`），抓出普通 grep 漏掉的宿主注入命令。
- **可移植** — 证据源抽象为多类，换宿主/换 CLI 只重映射一节。

## 安装

把 `asset-inventory` 文件夹复制到全局 skills 目录（或项目 `.opencode/skills/`）：

```powershell
# 全局（PowerShell）
Copy-Item -Recurse asset-inventory "$env:USERPROFILE\.config\opencode\skills\"
# 或项目级
Copy-Item -Recurse asset-inventory .opencode\skills\
```

## 用法

直接说，任意措辞：

- "列一下我有什么插件/Skill/命令/MCP/Agent"
- "哪个被禁用了"
- "谁带进来的"
- "跟上次比变了啥"（差异模式——把上次的 JSON 贴给我）

skill 会往**当前项目根目录**的 `output/` 写入三份文件，描述你机器的真实情况；它也是自包含的：在它自己的表4 里能找到它自己。

## 输出结构

```
当前项目根目录\
└── output/
    ├── inventory.md        # 7 表百科
    ├── usage-guide.md      # 使用指南（每天必用 / 干活主力 / 按需 / 周期性）
    └── asset-inventory.json # 机器可读行（主键：table + name）
```

> 注意：产物落在"被盘点的项目"根目录，不是 skill 安装目录——全局安装后，输出跟着你的项目走。

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

## 兼容性

需要 [OpenCode](https://opencode.ai)（skill 经原生 `skill` 工具按需加载）。兼容包裹 OpenCode 的宿主应用（如 OpenChamber）；换宿主时重映射 `SKILL.md` 里的证据源即可。PowerShell 与 sh 示例均考虑。

## 许可证

MIT — 见 [LICENSE](LICENSE)。