# 资产盘点（Asset Inventory）

**asset-inventory** 是一个 OpenCode Skill：一次扫清你机器上的 OpenCode 环境——所有插件、Skill、命令、MCP、Agent 和外层应用能力，每一项都带**来源追溯**（它从哪来的）。对每个资产回答三问：**是什么、谁带来的、怎么用**。

## 这是什么

OpenCode 环境膨胀得很快。几周后你就忘了自己装了什么、*从哪来的*、*什么时候该用*。这个 skill 按需产出一份可信的完整答案——而且从不瞎编。一次扫描就能把你机器上**真正能调用**的一切（不只是盘上的文件）映射成三份文件：

- **`inventory.md`** — 一份 Markdown 文件，里面包含 7 张表：插件、Skill、命令、MCP、Agent、外层应用能力等各类内容，全部按固定 7 张表列全。
- **`usage-guide.md`** — 大白话"什么时候用"指南：按场景/频率讲每样东西何时用、为什么用。
- **`asset-inventory.json`** — 机器可读的 JSON：同一批数据的结构化形式，供程序处理/对比。

## 安装

**第一步：把仓库弄到本地。** 二选一：

```sh
# 克隆（推荐）
git clone https://github.com/sogeisetsu/asset-inventory.git
```

或者从 GitHub 页面 **Code → Download ZIP** 下载并解压。之后你会得到一个 `asset-inventory/` 文件夹。

**第二步：进入 `asset-inventory/` 文件夹，只复制三样东西**（`SKILL.md`、`references/`、`examples/`——README、docs 等文档不用装）到目标位置：

| 范围 | 什么时候选 | 目标位置 |
|---|---|---|
| **全局** | 每个项目都能用 | `~/.config/opencode/skills/`（Windows：`$env:USERPROFILE\.config\opencode\skills\`） |
| **项目级** | 只给一个项目用 | 那个项目根目录下的 `.opencode/skills/` |

先 `cd` 进 `asset-inventory/` 再执行（下面的命令都在这个文件夹里运行）：

```sh
# 全局（macOS / Linux）
mkdir -p ~/.config/opencode/skills/asset-inventory
cp -r SKILL.md references examples ~/.config/opencode/skills/asset-inventory/

# 项目级（macOS / Linux）——把 <项目根目录> 换成你的项目路径
mkdir -p <项目根目录>/.opencode/skills/asset-inventory
cp -r SKILL.md references examples <项目根目录>/.opencode/skills/asset-inventory/
```

```powershell
# 全局（PowerShell）
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references, examples -Destination "$env:USERPROFILE\.config\opencode\skills\asset-inventory\"

# 项目级（PowerShell）——把 <项目根目录> 换成你的项目路径
New-Item -ItemType Directory -Force -Path "<项目根目录>\.opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references, examples -Destination "<项目根目录>\.opencode\skills\asset-inventory\"
```

> 不确定选哪个？选**全局**——skill 输出跟着你运行的项目走，不管 skill 本身装在哪。

### 用 AI 自动安装

如果你用 AI 编程助手，直接把下面这段话复制给它，让它帮你装：

```text
请帮我安装 "asset-inventory" 这个 OpenCode skill，来源是 <https://github.com/sogeisetsu/asset-inventory>。先问我装到全局还是只装进当前项目。然后克隆或下载该仓库，只复制运行所需的文件——SKILL.md、references/、examples/——到选定的目标位置：全局就装到 ~/.config/opencode/skills/（Windows：$env:USERPROFILE\.config\opencode\skills\），项目级就装到当前项目内的 .opencode/skills/（没有就创建）。不要复制 README 文件。确认最终路径是 <目标位置>/asset-inventory/SKILL.md。安装过程中不要改动任何 skill 文件。完成后告诉我最终路径。
```

## 更新

已安装过？拉最新版并覆盖：

```sh
cd asset-inventory && pwsh ./update.ps1
```

脚本自动检测安装位置（全局 `~/.config/opencode/skills/asset-inventory/` 或项目级目录），执行 `git pull`，然后覆盖三个运行时文件。会报告更新前后的版本号，确认更新成功。

**项目级**安装需要显式指定目标：

```sh
pwsh ./update.ps1 -Target /path/to/your-project/.opencode/skills/asset-inventory
```

也可以重新跑一遍[安装](#安装)命令——覆盖安装是幂等的。

## 快速上手

装好 skill（选一种范围），直接调用，无需任何配置：

```
/asset-inventory
```

这一条命令就会端到端跑完整个盘点。只想盘某一部分？在命令后加参数——见[斜杠命令](#斜杠命令)。

## 斜杠命令

装好后，OpenCode 会自动把 skill 按它的名字注册成斜杠命令。在输入框敲 `/` 选中 `asset-inventory`，或打开 `/skills` 对话框选择它即可。

7 张表依次是：**1** 插件与配套软件 · **2** 各软件/插件带来的 Skill 与命令 · **3** 原生命令与原生 Skill · **4** 自定义 Skill、命令与外层应用注入命令 · **5** MCP · **6** Agent（含默认模型链） · **7** 外层应用能力。各表具体覆盖什么 → [看 `inventory.md` 里的 7 张表](#inventorymd-里的-7-张表)

| 命令 | 干什么 | 产物 |
|---|---|---|
| `/asset-inventory` | 全量盘点：7 张表全出 | `inventory.md` + `usage-guide.md` + `asset-inventory.json` |
| `/asset-inventory mcp` | 只盘 MCP（表5） | `inventory.md`（仅表5）+ `asset-inventory.json`（仅表5行） |
| `/asset-inventory agents` | 只盘 Agent（表6） | `inventory.md`（仅表6）+ `asset-inventory.json`（仅表6行） |
| `/asset-inventory hosts` | 只盘外层应用能力（表7） | `inventory.md`（仅表7）+ `asset-inventory.json`（仅表7行） |
| `/asset-inventory skills` | 只盘 Skill 与命令（表2–4） | `inventory.md`（仅表2–4）+ `asset-inventory.json`（仅表2–4行） |
| `/asset-inventory diff` | 差异模式 | 只出按主键增减的项（请贴上次 JSON） |
| `/asset-inventory usage` | 全量扫描，但只生成使用指南 | 仅 `usage-guide.md` |

精扫（`mcp`、`agents`、`hosts`、`skills`）只写 `inventory.md`（限该表）+ 对应的 JSON 行，并跳过无关的证据收集步骤。

## 用法

- **斜杠命令**：见上表。加参数可精扫某一类。
- **自然语言**——直接说，任意措辞：
  - "列一下我有什么插件/Skill/命令/MCP/Agent"
  - "哪个被禁用了"
  - "谁带进来的"
  - "跟上次比变了啥"（差异模式——把上次的 JSON 贴给我）

skill 会往**当前项目根目录**的 `output/` 写入产物，描述你机器的真实情况。

## 你会得到什么

```
当前项目根目录\
└── output/
    ├── inventory.md        # 7 表清单
    ├── usage-guide.md      # 使用指南（每天必用 / 干活主力 / 按需 / 周期性）
    └── asset-inventory.json # 机器可读行（主键：table + name）
```

> 注意：产物落在"被盘点的项目"根目录，不是 skill 安装目录——全局安装后，输出跟着你的项目走。

### `inventory.md` 里的 7 张表

`inventory.md` 就是上面 `output/` 里的第一份文件——一份 Markdown 文档，所有资产按下面 7 张表组织：

| # | 表 | 覆盖什么 |
|---|---|---|
| 1 | 插件与配套软件 | 软件/插件本体，写实名 |
| 2 | 各软件/插件带来的 Skill 与命令 | 每个 skill/命令按"谁提供的"分组 |
| 3 | 原生命令与原生 Skill | 内置 TUI 命令与 Skill |
| 4 | 自定义 Skill、命令与外层应用注入命令 | 你自建的 + 外层应用注入的命令 |
| 5 | MCP | 所有 MCP 服务器（全局+项目）、本地/远端、启用态 |
| 6 | Agent | 所有 Agent，带默认模型链（`a→b→c`） |
| 7 | 外层应用 | 外层应用能力（行为规则、浏览器等） |

### 来源可追溯，不瞎编

清单里每一项都会写清楚它是**从哪来的**——是 OpenCode 自带的、某个插件装进来的、你自己建的，还是外层应用（如 OpenChamber）注入的——绝不写"某个插件"这种含糊说法。每一项还会标出当前状态：能用、被禁用、只是货架上没装、还是压根不存在。

### 三份文件，一批证据

`inventory.md`、`usage-guide.md`、`asset-inventory.json` 都从**同一次扫描**派生——不重复收集。使用指南把同一批行按场景和频率重排（"每样东西什么时候用、为什么用"），绝不重新收集或编造事实。

## 关于「外层应用」（宿主 / host）

本 skill 的一些表和来源里会出现**外层应用**这个词——它指的是包裹 OpenCode 引擎、额外注入命令与能力的桌面程序（例如 **OpenChamber**）。英文资料里有时叫 **host**。我们中文用**外层应用**而不用生硬的"宿主"，因为"宿主"看不出它是什么。看到"外层应用"，就理解为：*包在 OpenCode 外面、自己带一堆斜杠命令和功能的桌面 App*。

## 仓库布局

```
asset-inventory/
├── SKILL.md                    # skill 主体（规则与流程）
├── update.ps1                  # 一键更新脚本
├── README.md                   # 英文文档
├── README-zh.md                # 中文文档（本文件）
├── CHANGELOG.md                # 版本历史
├── CONTRIBUTING.md             # 贡献指南
├── references/
│   ├── format-example.md       # 7 表单元格格式参考
│   ├── host-commands.md        # 外层应用命令扫描方法 + 清单
│   └── usage-guide.md          # 使用指南格式参考
└── examples/
    └── inventory-example.md    # 脱敏输出示例
```

## 适用范围与兼容性

**适用范围：本 skill 目前只在 OpenCode 中测试过**（含包裹 OpenCode 的外层应用，如 OpenChamber）。**未在其他 AI 编程助手中验证**（Claude Code、Cursor、Windsurf 等）——在这些软件中能否生效无法确定，也不做支持。

需要 [OpenCode](https://opencode.ai)（skill 经原生 `skill` 工具按需加载）。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
