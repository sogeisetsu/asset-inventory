# AGENTS.md

## 这是什么

一个 OpenCode Skill（`asset-inventory`），盘点机器上的插件、Skill、命令、MCP 服务器、Agent 和外层应用能力。输出 7 张 Markdown 表 + JSON + 使用指南。

**这不是代码项目。** 没有传统测试、没有构建、没有 lint。"代码"就是 SKILL.md——一份指导 AI agent 干活的提示词。唯一的"构建"是 `scripts/build-sample-pages.mjs` 从 `docs/samples/` 渲染出三个详情页，CI 会校验页面是否为最新。

## 关键文件

- `SKILL.md` — skill 本身（规则、流程、质量清单）。**唯一真相源。**
- `references/` — 格式示例、质量清单、扫描方法、故障排除、本地化词汇表（`glossary.json`）。辅助文档，不是事实。
- `references/checklist.md` — 输出前的完整质量清单。
- `update.ps1` — 一键更新脚本（复制 `SKILL.md` + `references/` 到安装位置）。
- `docs/TODO.md` / `zh/TODO-ZH.md` — 滚动发布计划（EN/ZH 配对，`check-docs` 的 `PAIRS` 强制）。**新会话先读它**即可定位当前进度与下一步。
- `scripts/check-docs.mjs` — 文档/链接/frontmatter/版本/词表/README 互链校验（提 PR 前跑）。
- `scripts/build-sample-pages.mjs` — 从 `docs/samples/` 渲染三个详情页；`--check` 判过期。
- `scripts/generate-assets.mjs` — 重新生成 `docs/assets/*.svg`。
- `docs/` — GitHub Pages 落地页 + `docs/release-notes/`（发布说明）+ `docs/guides/`（长文文档）+ `docs/samples/`（示例产物：英文在 base，中文在 `docs/samples/zh/`）。
- `readmes/` — 非中英 README（JA / KO / RU / AR / ES）；根目录只保留 `README.md` 与 `README-ZH.md`。
- `zh/` — 中文对读版（`CHANGELOG-ZH.md`、`CONTRIBUTING-ZH.md`、`TODO-ZH.md`、`release-notes/` 等）。
- `CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md` — 版本 / tag / release 政策的**权威来源**（本文件只是摘要）。
- `output/` — **gitignored**。skill 运行时生成的文件放这里。

运行时只分发 **`SKILL.md` + `references/`** 两项；其余都是开发侧内容。

## 核心哲学

**永远现扫，永不预设。** skill 的第一原则是"在这台机器上验证一切"。这意味着：
- 不要在 reference 文件里加硬编码的命令/资产列表
- 不要假设有什么——扫描会发现它
- `references/host-commands.md` 提供的是扫描*方法*，不是命令列表
- 来源必须可验证：插件管理的 skill 归功于插件（读其 `skills-manifest.json`），**绝不从目录名推断仓库 URL**

## 工作流

> **动手前先从 `master` 拉一个新分支**（见「分支规则」）；以下每一步都在该分支上完成，确认无误后再合并回 `master`。

1. 改 `SKILL.md` — 规则/行为变更；同步 `zh/skill-zh.md`（gitignored 本地镜像，check-docs 会按 mtime 警告）
2. 改 `references/` — 格式/方法文档
3. 改了样本 → 跑 `node scripts/build-sample-pages.mjs` 重新生成三个详情页（**不要手改**标记之间的生成块）
4. 更新 `CHANGELOG.md`（及 `zh/CHANGELOG-ZH.md`）— 在顶部新版本条目下加条目；发布时把标题改成 `[x.y.z] - YYYY-MM-DD`
5. minor/major → 写双语 release notes（`docs/release-notes/release-notes-vX.Y.Z.md` + `zh/release-notes/release-notes-vX.Y.Z-ZH.md`），并登记进 `scripts/check-docs.mjs` 的 `PAIRS`。**GitHub Release 正文只贴英文文件**；中文版仅供 docs 站与仓库，永不追加进 Release 正文
6. 跑 `node scripts/check-docs.mjs` — 校验链接（Markdown + HTML）、EN/ZH 配对、frontmatter、版本一致性、词表结构、README 七语互链、引用完整性
7. 跑 `pwsh ./update.ps1` 部署到安装位置（`-DryRun` 可先预览）
8. 版本号在 `SKILL.md` frontmatter 的 `metadata.version`，与 `CHANGELOG.md`、`zh/CHANGELOG-ZH.md` 顶部三处必须同步

## 提交与版本规则（重要）

### 分支规则

**不要在 `master` 上直接改动。** 每次改动先拉一个分支，在分支上完成并自测通过，确认无误后再合并回 `master`。
- 分支命名沿用既有风格：`feat/vX.Y.Z`、`fix/...`、`docs/...`、`chore/...`。
- 合并前跑 `node scripts/check-docs.mjs`（动过样本再加 `node scripts/build-sample-pages.mjs --check`）。
- 合并后按版本规则打 tag / 建 Release（见下）。

### 提交粒度

**一个逻辑变更 = 一次提交。** 不要把多个不相关的改动攒成一个大提交，更不要"把所有任务都做完才提交一次"。
- 改完一项就提交一项，提交信息写清这一项做了什么
- 相关联却可独立成篇的改动（如"新增文件"与"精简引用它的文档"）也各成一次提交
- 提交前先跑 `node scripts/check-docs.mjs`（动过样本再加 `node scripts/build-sample-pages.mjs --check`）

### 版本与 tag / release

严格遵循 [Semantic Versioning](https://semver.org/)（详见 `CONTRIBUTING.md` 的 Versioning 段）：

| 级别 | 判定 | 动作 |
|---|---|---|
| **PATCH**（`1.0.x`） | bug 修复、文档改进 | **只打 git tag**，**不建 GitHub Release** |
| **MINOR**（`1.x.0`） | 新功能、新表类型、新宿主支持 | 打 tag **并**建 GitHub Release |
| **MAJOR**（`x.0.0`） | 表结构或输出格式的破坏性变更 | 打 tag **并**建 GitHub Release |

**关键：每个达到某级别标准的改动，都要打该级别的 tag —— patch 达标就打 patch tag，minor 达标就打 minor tag（并建 Release），major 达标就打 major tag（并建 Release）。不要把 patch 级别的改动攒到 minor 才打。** GitHub Release 只发布 minor / major，patch 仅以 tag 形式存在。

- tag 一律用 **annotated**（`git tag -a`），风格与既有 tag 一致。
- 推送用 `git push origin master --follow-tags`。
- Release 正文用**英文** release notes 文件：`gh release create vX.Y.Z --title "..." --notes-file docs/release-notes/release-notes-vX.Y.Z.md`；**永不追加 `zh/` 版**（Release 页面只显示英文）。
- Release notes 的**内容范围 = 与上一个 GitHub Release 的 tag 相比的变化**（用 `gh release list` 找上一个 Release tag，`git log --oneline <上个Release tag>..<新tag>` 圈范围），不是本版本的 commit 清单——中间的 patch 改动也要写进去；以用户视角描述，别罗列 commit。
- patch 版本**不写** release notes 文件、不建 Release。

## 发布检查清单（每个版本）

1. 改内容（按需同步 `SKILL.md` / `references/` / `docs/` / `readmes/` / `README*`）
2. `node scripts/check-docs.mjs` → 0 error
3. 动过样本时：`node scripts/build-sample-pages.mjs --check` → 3 页最新
4. 三处版本号同步（`SKILL.md` frontmatter / `CHANGELOG.md` / `zh/CHANGELOG-ZH.md`）
5. 双语 CHANGELOG；minor/major 另写双语 release notes 并登记进 `check-docs` 的 `PAIRS`
6. `git commit`（一个逻辑变更多次提交）
7. `git tag -a vX.Y.Z -m "..."` → `git push origin master --follow-tags`
8. minor/major：`gh release create vX.Y.Z --notes-file docs/release-notes/release-notes-vX.Y.Z.md`（正文仅英文）
9. 更新 `docs/TODO.md` / `zh/TODO-ZH.md` 的状态行与"下一步"

## 坑

- `output/` 不入库——别提交生成的文件
- 外层应用扫描必须适配所有宿主（Electron、Tauri、原生），不只是 OpenChamber
- skill 的输出是多语言的（en/zh/ja/ko/ru/ar/es），**输出跟随用户语言**；skill 自身指令为英文
- Provenance 格式也必须跟随输出语言
- 页面与 README 支持 7 种语言；改一处文案要检查是否该同步到其它语言
- 往 `references/glossary.json` 加语言时，键集必须与 `en` 块一致（`check-docs` 会强制）
- **别手改三个详情页的生成块**（`<!-- build-sample:start -->` … `<!-- build-sample:end -->`）：改 `docs/samples/` 里的样本，再跑 `scripts/build-sample-pages.mjs`
- `docs/samples/` 英文在 base、中文在 `zh/`；该目录**豁免**英文文档的 CJK 检查
- **新增 release-notes 配对、或新增本地化 README，必须登记进 `scripts/check-docs.mjs` 的 `PAIRS` / `README_LOCALES` 硬编码数组**，否则校验看不到它
- `update.ps1` 的备份写到安装目录**上级的 `backups/`**（全局即 `~/.config/opencode/backups/`），绝不留在 skills 命名空间里——`skills/` 下任何带 `SKILL.md` 的目录都会被宿主加载成重复 skill，也绝不放回安装目录内部（否则会被当成 skill 内容复制）
