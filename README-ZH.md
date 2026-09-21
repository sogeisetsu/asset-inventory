<div align="center">

<img src="assets/icon.svg" alt="asset-inventory icon" width="96" height="96">

# Asset Inventory

**一眼看清你的 OpenCode 环境真正能调用什么 —— 每个插件、Skill、命令、MCP、Agent 与外层应用能力，都带来源追溯。**

[![License: MIT](assets/badge-license.svg)](LICENSE)
[![OpenCode Skill](assets/badge-opencode.svg)](#compatibility)

[English](README.md) · [中文](README-ZH.md) · [日本語](README-JA.md) · [한국어](README-KO.md) · [Русский](README-RU.md) · [العربية](README-AR.md) · [Español](README-ES.md)

<img src="assets/banner-zh.svg" alt="asset-inventory banner" width="100%">

</div>

**asset-inventory** 是一个 OpenCode skill，一条命令盘清你的环境 —— 本机的每个插件、Skill、命令、MCP、Agent 与外层应用能力，都带**来源追溯**（它从哪来）。每行回答三个问题：**是什么、谁带来的、怎么用**。🎯

## 🚀 快速开始

```
/asset-inventory
```

装好 skill 后直接调用，无需配置。加参数可只盘点一部分 —— `/asset-inventory mcp`、`agents`、`hosts`、`skills`、`diff`、`usage`。

## 📦 安装

> 🌍 **推荐全局安装。** 只装一份、只更新一份，在任何项目都可用。

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
cd asset-inventory
# 只把 SKILL.md + references/ 复制到 skills 目录
```

- **全局：** `~/.config/opencode/skills/asset-inventory/`
- **项目级：** `<项目根目录>/.opencode/skills/asset-inventory/`

### 🤖 通过 AI 安装

把下面这段发给 AI，它会帮你装好：

```
请帮我安装 OpenCode skill "asset-inventory"，仓库地址 <https://github.com/sogeisetsu/asset-inventory>。

1. 先只问我一个问题：装到全局，还是只装进当前项目。
2. 获取仓库：优先 `git clone`；如果没有 git 或克隆失败，就改用 GitHub 的 ZIP 下载。
3. 只把两个运行时项（SKILL.md 和 references/）复制到目标位置：
   - 全局：~/.config/opencode/skills/asset-inventory/（Windows：$env:USERPROFILE\.config\opencode\skills\asset-inventory\）
   - 项目级：当前项目下的 .opencode/skills/asset-inventory/
   目录不存在就创建。不要复制 README、docs、assets、scripts。
4. 如果目标位置已存在同名 skill，直接覆盖（这等于更新），不要问第二遍。
5. 完成后确认 <目标位置>/asset-inventory/SKILL.md 存在，并从它的 frontmatter `metadata.version` 读出安装的版本号。
6. 全程把源文件当只读，不修改任何 skill 内容；最后只报告安装位置和版本号。
```

📖 完整步骤（各平台）+ AI 自动安装 + 更新 → **[安装与更新](docs/guides/install-and-update.md)**

## 📤 产出

```
你的项目根目录/
└── output/
    ├── inventory.md         # 7 张表盘点
    ├── usage-guide.md       # 按场景与频率的"什么时候用"指南
    └── asset-inventory.json # 机器可读的行（主键 table + name）
```

👀 **看真实示例：** 📄 [inventory.md](docs/samples/inventory.md) · 🧭 [usage-guide.md](docs/samples/usage-guide.md) · 🧾 [asset-inventory.json](docs/samples/asset-inventory.json)

## ✨ 特点

- 🧭 **来源可追溯** —— OpenCode 自带、插件带来、你自建，还是外层应用注入。插件管理的 skill 会归功于插件，绝不误标"本地自建"。
- 🚦 **四态标注** —— ✅可用 / ❌已禁用 / 📦仅货架未装 / 🚫不存在
- 🔒 **只读脱敏** —— 不改任何配置；默认打码密钥、路径与私有项目名
- 🖥️ **外层应用感知** —— 二进制扫描应用包，抓出普通 grep 漏掉的注入命令
- 🔀 **差异模式** —— 贴上次 JSON，只输出增删
- 🌐 **多语言输出** —— 交付物跟随你的语言（中、英、日……）

## 📚 详细文档

| 文档 | 内容 |
|---|---|
| 🧠 [它如何工作](docs/guides/how-it-works.md) | 主体思想、7 张表、来源追溯、三份产物 |
| 📦 [安装与更新](docs/guides/install-and-update.md) | 各平台、AI 自动安装、`update.ps1` 选项 |
| 🧭 [仓库与贡献](docs/guides/repository-and-contributing.md) | 该读哪个文件、目录结构、贡献、版本规则 |

## 🔗 链接

- 🖥️ **落地页：** <https://sogeisetsu.github.io/asset-inventory/>
- 🖼️ **斜杠命令与用法：** 见 [它如何工作](docs/guides/how-it-works.md)
- 📝 **更新日志：** [zh/CHANGELOG-ZH.md](zh/CHANGELOG-ZH.md)
- 🤝 **贡献指南：** [CONTRIBUTING.md](CONTRIBUTING.md)

## ✅ 适用范围与兼容性

**范围：本 skill 只在 OpenCode 中测试过**（含包装 OpenCode 的外层应用，如 OpenChamber）。**未在其他 AI 编程助手中验证**（Claude Code、Cursor、Windsurf 等）。

需要 [OpenCode](https://opencode.ai)（skill 通过原生 `skill` 工具按需加载）。

## 📄 许可证

MIT —— 见 [LICENSE](LICENSE)。
