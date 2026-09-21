<!--
  v1.3.0 release notes（中文）。英文版见 ../docs/release-notes-v1.3.0.md
  Release: v1.3.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.3.0

本次发布把仓库改为英文优先，新增成对的中文文档集，并引入让文档保持诚实的工具链。盘点逻辑与 7 表结构不变。

## 变更亮点

- **英文优先的 skill 内容** — `SKILL.md`、`references/`、`examples/` 全部改写为英文；frontmatter `description` 现为纯英文。
- **显式的 Output Language 段** — 输出跟随用户语言（中文提问→中文输出），skill 指令本身保持英文。
- **中文文档集（`zh/`）** — `CONTRIBUTING-ZH.md`、`CHANGELOG-ZH.md` 与 `release-notes-v1.1.0-ZH.md`，与仓库根目录的英文文档成对。
- **本地化词汇表**（`references/glossary.json`）— 机器可读的"固定输出字符串 × 语言"映射（表头、状态标记、可信度缀、表名、空表/未知值、Provenance），保证本地化输出跨运行一致、diff 可比。
- **文档校验脚本**（`scripts/check-docs.mjs`）— 解析相对 Markdown 链接与 `<img src>`、检查 EN/ZH 配对表、告警单侧改动、校验 frontmatter，并标出英文文档中的 CJK 字符。
- **资源生成脚本**（`scripts/generate-assets.mjs`）— 重新生成本地 SVG 图标、banner 与徽章到 `assets/`（不依赖外部 CDN）。
- **README 视觉头部** — 居中本地 SVG 图标 → 标题 → 标语 → 徽章行 → 语言互链 → banner。
- **Quick Reference 段**（`SKILL.md`）— 一览式流程摘要（一行触发、三份产物、扫描模式）。
- **错误处理指导** — 针对常见失败场景的具体处置（插件缓存不可读、外层应用扫描失败、MCP 不可达）。
- **故障排除指南**（`references/troubleshooting.md`），并在 `references/host-commands.md` 中补充 PowerShell 扫描方法。
- **中文参考 License**（`zh/LICENSE-ZH.txt`）— 开放原子基金会非官方中译本；以根目录英文 `LICENSE` 为准。

## 变更 / 修复

- **仓库结构重构** — 英文文档在根目录，`README-ZH.md` 在根目录，其余中文文档统一放进 `zh/`。
- **README 安装指引** — 中英 README 均在"安装"段顶部推荐全局安装，并说明原因。
- **外层应用扫描通用化** — 去掉 OpenChamber 特有假设；来源分类改用 `外层应用注入，二进制扫描 <bundle> 发现` 格式。
- **`host-commands.md` 重写** — 删除硬编码命令清单（与"永远现扫"哲学冲突）；现只提供扫描方法。
- **`SKILL.md` 重构** — 把 Table Overview、Cell Conventions、Source Classification 拆成独立子段；Quality Checklist 按表分组。
- **`SKILL.md` frontmatter 对齐** — `version` 移入 `metadata.version`。
- **Provenance 格式** — 现同时含中英文模板，跟随输出语言规则。
- **`update.ps1` 改进** — 新增自动创建目标目录、覆盖前备份、`-NoBackup` 开关、更清晰的错误信息。

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../LICENSE)。
