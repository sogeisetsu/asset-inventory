# 更新日志

本项目的所有重要变更都记录在此文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/)，版本号遵循 [Semantic Versioning](https://semver.org/)。

> 本文是英文 [`CHANGELOG.md`](../CHANGELOG.md) 的中文对读版；两者内容保持同步。

---

## [1.7.2] - 2026-09-22

### 修复
- **MCP 调用被描述成"只能由 Agent 调用"。** skill 与全部样例都声称人永远不会调用 MCP。`SKILL.md` 现要求列出所有真实调用路径 —— 点名调用（`use context7`）、Agent 的工具调用（`<server>_<tool>`）、MCP Prompt 注册成的 `/prompt-name`，或服务器自带的 CLI/HTTP 端点 —— 并禁止"人不会调用"这类笼统断言。`references/checklist.md` 增加对应检查项，全部样例（`inventory.md`、`usage-guide.md`、`asset-inventory.json`、站点示例）已同步。

---

## [1.7.1] - 2026-09-22

### 新增
- **`TODO.md` / `zh/TODO-ZH.md`** —— 双语的滚动式发布计划，新会话打开即可看清当前进行到哪个版本、下一步是什么。

### 变更
- **tag/release 政策澄清**（`CONTRIBUTING.md`、`zh/CONTRIBUTING-ZH.md`）—— 每个改动都按其自身级别打 tag：patch 级别打 patch tag（仅 tag，不建 Release），minor/major 打各自 tag 并建 GitHub Release。patch 级别的改动不得攒到后面的 minor 才打。

---

## [1.7.0] - 2026-09-22

### Added
- **七语言文档** —— 落地页与所有详情页现支持英、中、日、韩、俄、阿拉伯（含 RTL）、西七种语言；选择跨页面保持。
- **多语言 README** —— 新增 `README-JA.md`、`README-KO.md`、`README-RU.md`、`README-AR.md`、`README-ES.md`，与英文、中文版本互链成一套。
- **`docs/guides/`** —— 长文文档（`how-it-works.md`、`install-and-update.md`、`repository-and-contributing.md`），从 README 链接进入。
- **`docs/samples/`** —— 公开的示例产物（`inventory.md`、`usage-guide.md`、`asset-inventory.json`），README 有超链接，用户可先看清最终产物。
- **Material Design 3 重构** —— 落地页与详情页改为 MD3 风格（颜色角色、阴影层级、圆角、分段式语言切换）。
- **`check-docs` 新增校验** —— HTML 的 `href`/`src` 链接，以及七份本地化 README 的存在性与互链。

### Changed
- **README 精简** —— 中英 README 改为简洁的落地页并加入 emoji；细节移入 `docs/guides/`。
- **落地页示例改为渲染效果** —— 盘点示例以真实表格展示，JSON 逐行展示，不再是裸代码块。
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** —— 写明提交粒度规则与 tag/release 策略（PATCH 只打 tag；MINOR/MAJOR 打 tag 并建 Release）。

### Fixed
- **复制按钮反馈**在英文界面下仍显示硬编码中文；现跟随当前语言。

---

## [1.6.1] - 2026-09-22

### Fixed
- **插件管理的 skill 被误标为"本地自建"。** `oh-my-opencode-slim@2.2.18` 通过 `.oh-my-opencode-slim/skills-manifest.json` 管理着 8 个 skill（`simplify`、`codemap`、`clonedeps`、`deepwork`、`verification-planning`、`reflect`、`oh-my-opencode-slim`、`worktrees`）。skill 从不读该 manifest，于是回退到 `local, integrated/upstream <repo>`，并根据目录名**编造**出 `github.com/sogeisetsu/<name>`。`Discover` 现读取插件 manifest；`local, upstream <repo>` 要求已验证的 URL；绝不从目录名推断仓库。
- **所有 Agent 都被报成"单模型，无链式回退"。** 当前预设（`jibei-factory`）对每个 agent 都使用**数组形式**的 `model`，但 skill 只处理了字符串/箭头形式，并把豁免过度套用到插件 agent 上。现规则写明 `presets.<name>.<agent>.model` 可以是字符串**或数组**（数组*就是*模型链），且豁免仅适用于**核心自带**的 agent。

---

## [1.6.0] - 2026-09-22

### Fixed
- **MCP server 被静默漏掉** —— skill 可能只列出一个 MCP 就停下，即使配置里有五个。`Discover` 现有明确的 MCP 步骤：读取全部 `mcp` key（全局 + 项目），每个 key 出一行，并**把行数与配置的 key 数做断言**。单行表 5 现被明确标为危险信号，写进表格规范与质检清单。
- **`update.ps1` 目录嵌套** —— `Copy-Item -Recurse` 复制到已存在的目标时会把源目录嵌进内部，导致多次更新长出 `references/references/…`。现改为先删除目标再复制。
- **`update.ps1` 备份步骤失败且污染安装目录** —— 备份目录从未创建（导致写入报错），且备份被写在 skill 目录**内部**，成为已安装 skill 的一部分并在后续更新中再次嵌套。备份现改写到同级目录，并在使用前先创建。

### Changed
- **"干什么"现为一段详细文字** —— 取消 `简单：… 详细：…` 的拆分。每个单元格必须是一段连贯的文字，覆盖三件事：怎么调用、何时用、用了之后会发生什么（含注意事项）。已同步更新 `SKILL.md`、`references/checklist.md` 与 `references/format-example.md` 中全部 26 个示例单元格。
- **使用指南分两种模式** —— **模式 A**（通用）用于空项目，**模式 B** 用于有实际内容的项目：把场景锚定到项目的大致形态，但**不过度耦合**（不贴文件路径、不引私有代码；工具事实绝不变）。已在 `references/usage-guide.md` 写明并附对比表。
- **中文列名变更** —— `references/glossary.json` 中 `怎么叫` → **`调用方式`**（更正式、更准确的说法）。
- **`check-docs.mjs` 现校验 HTML 链接** —— `docs/*.html` 的 `href`/`src` 目标必须可解析，从而保护新的落地页结构。

### Added
- **落地页改为英文优先** —— `docs/index.html` 默认以英文打开；语言切换可切到中文，且选择跨页面保持。
- **产物详情页** —— 落地页的三份产物改为卡片链接，各自打开专门的页面（`docs/inventory.html`、`docs/usage-guide.html`、`docs/asset-inventory-json.html`），含详细介绍与真实示例。
- **标签栏图标** —— `docs/favicon.svg`，已接入每个页面。
- **共享资源** —— `docs/style.css` 与 `docs/lang.js`，保持各页风格与行为一致。

---

## [1.5.0] - 2026-09-21

### Added
- **语言声明校验**（`check-docs.mjs`）—— 解析 `SKILL.md` 的 "Fixed-string languages" 行，若其中声称的语言（如 `ja`）在 `references/glossary.json` 中没有对应块则失败。堵住了 v1.4.0 那个"声称有 `ja` 却无 `ja` 数据"的漏洞。
- **引用完整性校验**（`check-docs.mjs`）—— `SKILL.md` 里提到的每个 `references/<name>` 必须存在，且 `references/checklist.md` 至少保留 20 个清单项（防止编辑时无声丢失）。
- **日语 glossary 块**（`references/glossary.json` → `ja`）—— 现已真正落地；`en` / `zh` / `ja` 三者各含相同的 10 个键。
- **`update.ps1 -Help`** —— 显示用法、选项与安装位置，不改动任何文件。
- **两个 README 新增"该读哪个文件？"导航** —— 把常见意图映射到对应文件。

### Changed
- **`references/format-example.md` 与 `examples/inventory-example.md` 合并** —— 两者近乎重复（17 行完全相同，约 3,932 共享字节）。现合为一个文件；运行时集合变为 `SKILL.md` + `references/`，`update.ps1`、两个 README、两个 CONTRIBUTING 均不再提及 `examples/`。
- **`SKILL.md` 的 "What it does" 规则合并** —— Cell Conventions 的条目不再重复整套规则，改为指向专门的 "What-it-does format (mandatory)" 段。

### Removed
- **`examples/inventory-example.md`** —— 作为 `references/format-example.md` 的重复文件删除。运行时载荷由 60,390 B 降至 55,250 B（约 8.5%，全量读取约省 1,285 tokens）。

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
