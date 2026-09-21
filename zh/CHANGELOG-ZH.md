# 更新日志

本项目的所有重要变更都记录在此文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/)，版本号遵循 [Semantic Versioning](https://semver.org/)。

> 本文是英文 [`CHANGELOG.md`](../CHANGELOG.md) 的中文对读版；两者内容保持同步。

---

## [1.4.0] - 2026-09-21

### Added
- **PR 触发的文档校验**（`.github/workflows/docs-check.yml`）—— 每次向 `master` 提 PR（以及 push）时运行脚本语法检查与 `node scripts/check-docs.mjs`，PR 终于有了真正的质量闸门，而不再只有部署工作流。
- **版本一致性校验**（`check-docs.mjs`）—— 从 `SKILL.md` frontmatter 读取 `metadata.version`，与 `CHANGELOG.md`、`zh/CHANGELOG-ZH.md` 顶部发布标题比对，不一致即失败。
- **glossary 结构校验**（`check-docs.mjs`）—— `references/glossary.json` 每个语言块的键集必须与 `en` 块一致；逐语言报告缺失或多余的键。
- **日语词条**（`references/glossary.json` → `ja`）—— 固定字符串承诺现对 `en` / `zh` / `ja` 成立，并为其它语言写明明确回退规则。
- **`references/checklist.md`** —— 完整质量清单，从 `SKILL.md` 移出，使规则主体更聚焦；`SKILL.md` 现指向它。
- **`update.ps1 -DryRun`** —— 预览将复制哪些运行时文件，且不写任何内容。
- **故障排除补充** —— Table 6 行序自检、非 glossary 语言的处理、本地副本过期告警的说明。

### Changed
- **`SKILL.md` 语言承诺收窄并改为诚实表述** —— 不再声称所有语言都有固定字符串；`en` / `zh` / `ja` 直接取自词表，其它语言从 `en` 块派生并在 Provenance 中注明。
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** —— 版本管理段现写明必须同步的三处，以及新增语言所需的精确 glossary 键集。
- **`SKILL.md` 精简** —— 内联的质量清单（42 行）移至 `references/checklist.md`。

### Fixed
- **v1.3.0 发布日期**在 `CHANGELOG.md` 与 `zh/CHANGELOG-ZH.md` 中由 `2026-09-13` 更正为实际发布日 `2026-09-21`。

---

## [1.3.0] - 2026-09-21

### Added
- **中文文档集**（`zh/`）—— `CONTRIBUTING-ZH.md`、`CHANGELOG-ZH.md` 与 `release-notes-v1.1.0-ZH.md`，与仓库根目录的英文文档成对。
- **文档校验脚本**（`scripts/check-docs.mjs`）—— 解析相对 Markdown 链接与 `<img src>`、检查 EN/ZH 配对表、告警单侧改动、校验 frontmatter，并标出英文文档中的 CJK 字符。
- **资源生成脚本**（`scripts/generate-assets.mjs`）—— 重新生成本地 SVG 图标、banner 与徽章到 `assets/`（不依赖外部 CDN）。
- **README 视觉头部** —— 居中本地 SVG 图标 → 标题 → 标语 → 徽章行 → 语言互链 → banner。
- **英文优先的 skill 内容** —— `SKILL.md`、`references/`、`examples/` 全部改写为英文；frontmatter `description` 现为纯英文。
- **显式的 Output Language 段**（SKILL.md）—— 输出跟随用户语言（中文提问→中文输出），skill 指令本身保持英文。
- **中文参考 License**（`zh/LICENSE-ZH.txt`）—— 开放原子基金会非官方中译本，附免责声明：以根目录英文 `LICENSE` 为准。
- **中文 banner**（`assets/banner-zh.svg`）—— 中文小字 banner，供 `README-ZH.md` 使用。
- **本地化词汇表**（`references/glossary.json`）—— 机器可读的"固定输出字符串 × 语言"映射（表头、状态标记、可信度缀、表名、空表/未知值、Provenance），保证本地化输出跨运行一致、diff 可比。
- **显著的语言规则** —— 标题正下方加醒目提示：输出跟随用户语言。
- **Quick Reference 段**（SKILL.md）—— 一览式流程摘要（一行触发、三份产物、扫描模式）。
- **错误处理指导**（Procedure 段）—— 针对常见失败场景的具体处置（插件缓存不可读、外层应用扫描失败、MCP 不可达等）。
- **"干什么"格式要求子段** —— 为最关键的单元格格式规则单列一段，写明来源优先级与禁止写法。
- **PowerShell 扫描方法**（`references/host-commands.md`）—— 在原有 Node.js 代码旁补充 PowerShell 版本。
- **故障排除指南**（`references/troubleshooting.md`）—— 常见问题与解决方案。
- **CHANGELOG.md** —— 本文件。
- **CONTRIBUTING.md** —— 贡献指南。

### Changed
- **README 安装指引** —— 中英 README 均在"安装"段顶部显著推荐全局安装，说明原因（只装一份、只更新一份，随处可用）与效果（任何项目、任何会话都能用；产物仍落在当前项目）。
- **脚本位置保持根目录** —— `update.ps1` 不移动（它是面向用户的一键更新入口）；`scripts/` 只放开发工具（`check-docs.mjs`、`generate-assets.mjs`）。
- **`check-docs.mjs` CJK 范围收紧** —— 现同时约束 `SKILL.md`、`references/`、`examples/`；仅本地 `AGENTS.md` 豁免。
- **`references/troubleshooting.md`** —— 版本读取说明改为 `metadata.version`。
- **中文对读版**（`zh/skill-zh.md`）—— `SKILL.md` 的中文版，仅本地（gitignored）。
- **仓库结构重构** —— 按 repo-init 约定：英文文档在根目录，`README-ZH.md` 在根目录，其余中文文档统一放进 `zh/`；`README-zh.md` 重命名为 `README-ZH.md`。
- **`SKILL.md` frontmatter 对齐** —— `version` 移入 `metadata.version`，因为 OpenCode 只识别 `name`、`description`、`license`、`compatibility`、`metadata`；`update.ps1` 仍能读到它。
- **release notes 按语言拆分** —— 英文留在 `docs/release-notes-v1.1.0.md`，中文移到 `zh/release-notes-v1.1.0-ZH.md`。
- **修复失效的相对链接** —— `docs/release-notes-v1.1.0.md` 中 `LICENSE` → `../LICENSE`。
- **`.gitignore`** —— 新增 `/AGENTS.md` 与本地专用中文指南（`zh/skill-zh.md`、`zh/repo-init-guide-zh.md`）。
- **CONTRIBUTING.md** —— 新增术语规范段与文档校验命令；刷新文件结构树。
- **SKILL.md 重构** —— 把 Table Overview、Cell Conventions、Source Classification 拆成独立子段，便于速览。
- **Quality Checklist 重构** —— 按表分组（All Tables、表1、表2 …… 表7、干什么 & 使用指南），便于逐表校验。
- **Anti-patterns 去重** —— 删除已被 Quality Checklist 覆盖的条目；加注说明两者关系。
- **Provenance 格式** —— 现同时含中英文模板，跟随输出语言规则。
- **Quick Reference 的"怎么用"** —— 从"调用路径"扩展为"何时用 + 调用路径"，与原始定义一致。
- **Targeting 段** —— 统一为英文标题，与其他段一致。
- **Output 段** —— 精简以避免与 Quick Reference 重复；细节改为引用 format-example.md。
- **update.ps1 改进** —— 新增自动创建目标目录、覆盖前备份、`-NoBackup` 开关、更清晰的错误信息。
- **host-commands.md 重写** —— 删除硬编码命令清单（与"永远现扫"哲学冲突）；现只提供扫描方法，并通用支持 Electron/Tauri/原生外层应用。
- **外层应用扫描通用化** —— 去掉 OpenChamber 特有假设；来源分类改用 `外层应用注入，二进制扫描 <bundle> 发现` 格式。

### Removed
- 删除 "Disposal note" 段（v1.1.0 已标记移除，现已彻底删掉）。
- 从 host-commands.md 删除硬编码命令清单（会导致 AI 跳过实际扫描）。

---

## [1.2.0] - 2026-09-08

### Added
- Targeting 参数路由（`/asset-inventory <target>`）。
- 跨次对比的差异模式。
- 使用指南产物（`usage-guide.md`）。
- 带第 4 行 provenance 的实名模式。

### Changed
- 加固 SKILL.md：明确 Output 段、状态标记跟随输出语言。
- 插件证据来源现可按宿主重映射。

---

## [1.1.0] - 2026-09-07

### Added
- 重写 README（EN + ZH），安装/更新说明更清晰。
- GitHub Pages 落地页（`docs/index.html`）。
- 用于 deepwork 状态的 `.ignore` 文件。
- `references/host-commands.md` 中补充非斜杠 magicPrompts key 文档。

### Changed
- 状态标记现跟随输出语言（不再中文硬编码）。
- 插件发现：缓存缺失时回退到 manifest。
- 宿主注入命令盘点扫描全量 `magicPrompts` key 集合。
- 删除重复的 Quality Bar 条目。

---

## [1.0.0] - 2026-09-06

### Added
- 首版发布，含 7 表清单结构。
- 来源分类系统（三段式 provenance）。
- 跨平台路径变量（macOS/Linux/Windows）。
- 格式示例与使用指南参考。
