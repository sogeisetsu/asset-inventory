# 为 Asset Inventory 贡献

感谢你有兴趣改进这个 skill！以下是贡献方式。

> 本文是英文 [`CONTRIBUTING.md`](../CONTRIBUTING.md) 的中文对读版；两者内容保持同步。

## 快速开始

1. Fork 仓库
2. 建分支：`git checkout -b improve/your-change`
3. 做修改
4. 本地测试：把 `SKILL.md`、`references/` 复制到你的 skills 目录
5. 跑 `/asset-inventory` 验证能正常工作
6. 提交 pull request

## 可以贡献什么

- **Bug 修复** —— 表格逻辑错误、来源分类错误、缺命令
- **新宿主支持** —— 为新外层应用添加路径变量或发现方法
- **文档** —— 更清晰的示例、更好的解释、翻译改进
- **测试** —— skill 由 AI 驱动，但你可以把它拿到不同机器上跑来测试

## 规则

1. **绝不编造资产** —— 每一行都必须来自机器上的真实证据
2. **保持 7 表结构** —— 新类别归入现有表，不新增表
3. **语言跟随用户** —— 输出必须与请求语言一致
4. **来源必须具体** —— "某个插件"不是合法来源；写实际插件名
5. **"干什么"列怎么写** —— 详细：一句话 + 2–4 句展开，基于真实来源描述

## 文件结构

```
asset-inventory/
├── SKILL.md                    # skill 主体（规则与流程）
├── README.md                   # 英文文档
├── README-ZH.md                # 中文文档（按项目约定放在根目录）
├── CHANGELOG.md                # 版本历史（英文）
├── CONTRIBUTING.md             # 贡献指南（英文）
├── AGENTS.md                  # agent 工作指南（中文）
├── LICENSE                     # MIT
├── update.ps1                  # 一键更新脚本
├── references/                 # skill 格式与扫描方法参考
├── scripts/
│   ├── check-docs.mjs          # 文档 / 链接 / frontmatter 校验
│   └── generate-assets.mjs     # 重新生成 docs/assets/*.svg
├── docs/                       # GitHub Pages + release notes + assets + TODO
│   ├── TODO.md                 # 发布计划（英文）
│   ├── assets/                 # 本地 SVG 图标 / banner / 徽章（脚本生成）
│   └── release-notes/          # English release notes
└── zh/                         # 除 README-ZH.md 外的所有中文文档
    ├── CHANGELOG-ZH.md
    ├── CONTRIBUTING-ZH.md
    ├── LICENSE-ZH.txt
    └── release-notes/          # Chinese release notes
```

本地专用的中文指南（`zh/skill-zh.md`、`zh/repo-init-guide-zh.md`）已被 gitignore，永不入库。`AGENTS.md` 已入库。

## 测试你的改动

1. 本地安装 skill（全局或项目级）
2. 在装了 OpenCode + 插件的机器上跑 `/asset-inventory`
3. 检查 7 张表是否都正确生成
4. 核对 JSON 主键与 Markdown 行一致
5. 跑 `/asset-inventory diff` 与上次输出对比
6. 提 PR 前跑文档校验：

   ```sh
   node scripts/check-docs.mjs
   node --check scripts/*.mjs
   ```

   `check-docs.mjs` 会解析所有相对 Markdown 链接与 `<img src>`、检查 EN/ZH 配对表、告警单侧改动、校验 frontmatter，并标出英文文档中的 CJK 字符。出错时退出码非 0；warning 不失败。

## 术语规范（canonical terms）

为让文案无歧义，统一使用下列术语，避免右列的写法：

| 用 | 不要用 | 原因 |
|-----|------------|-----|
| **outer app**（又称 **host**） | "container"、"wrapper app" | 它指包裹 OpenCode 引擎、注入自有命令的桌面程序（如 OpenChamber）。 |
| **host-injected command** | 指外层应用命令时用 "native command" | "native" 会与 OpenCode 自带的内置命令混淆。 |
| **built-in command / skill** | 把 "native OpenCode" 当名词指代 custom agent | "native OpenCode" 读起来像"OpenCode 自带"，与自定义含义正好相反。 |
| **custom agent** | "user agent"、"private agent" | 用于区分用户/插件定义的 agent 与内置 agent。 |

## 版本管理

遵循 [Semantic Versioning](https://semver.org/)：
- **PATCH**（1.0.x）：Bug 修复、文档改进
- **MINOR**（1.x.0）：新功能、新表类型、新宿主支持
- **MAJOR**（x.0.0）：表结构或输出格式的破坏性变更

更新 `SKILL.md` frontmatter 里的 `metadata.version`，并往 `CHANGELOG.md` 加条目。

三处版本必须保持一致，`check-docs.mjs` 现已强制校验：

1. `SKILL.md` frontmatter 的 `metadata.version`
2. `CHANGELOG.md` 顶部的发布标题
3. `zh/CHANGELOG-ZH.md` 顶部的发布标题

任一不一致都会导致校验失败。发布标题格式必须为 `## [x.y.z]`（其后的日期不参与比对）。

若往 `references/glossary.json` 新增语言，必须给它**与 `en` 块完全相同的键集** —— 校验会逐语言报告缺失或多余的键。每个语言块都必须包含这些键：`columns`、`columnsAgent`、`tableTitles`、`state`、`confidence`、`emptyTable`、`unknown`、`threeQuestions`、`provenance`、`provenanceRealName`。

### 分支规则

**不要在 `master` 上直接改动。** 每次改动先拉一个分支，在分支上完成并自测通过，确认无误后再合并回 `master`。
- 分支命名沿用既有风格：`feat/vX.Y.Z`、`fix/...`、`docs/...`、`chore/...`。
- 合并前跑 `node scripts/check-docs.mjs`（动过样本再加 `node scripts/build-sample-pages.mjs --check`）。
- 合并后按下面的版本规则打 tag / 建 Release。
- 例外：`zh/skill-zh.md` 等 gitignored 本地文件不受此限。

### 提交粒度

**一个逻辑变更 = 一次提交。** 不要把不相关的改动攒成一个大提交，也不要"全部做完才提交一次"——改完一项就提交一项，提交信息写清这一项做了什么。相关联却可独立成篇的改动（如"新增文件"与"精简引用它的文档"）也各成一次提交。每次提交前跑 `node scripts/check-docs.mjs`。

### tag 与 release

| 级别 | 动作 |
|---|---|
| **PATCH**（`1.0.x`） | **只打 git tag** —— 不建 GitHub Release |
| **MINOR**（`1.x.0`） | 打 git tag **并**建 GitHub Release |
| **MAJOR**（`x.0.0`） | 打 git tag **并**建 GitHub Release |

**每个改动都按其自身达到的标准打 tag：** patch 达标打 patch tag，minor 达标打 minor tag，major 达标打 major tag。不要把 patch 级别的改动攒到后面的 minor 才打。GitHub Release 只为 minor/major 而建；patch 只有 tag、不建 Release。而只要改动达到 minor 标准，只打 patch tag 是不够的——必须打 minor tag **并**建 Release。patch 默认只打 tag；但若用户明确要求为 patch 建 GitHub Release，则建之——此时需提供已登记进 `scripts/check-docs.mjs` 的 `PAIRS` 的双语 release notes 文件，并以英文文件作 Release 正文（与 minor/major 同一规则）。

Release 正文只用英文：粘贴 `docs/release-notes/release-notes-vX.Y.Z.md` 作为正文。`zh/` 版仅供文档站与仓库使用，永不放进 Release 页面。

**notes 必须覆盖的范围：** 与**上一个 GitHub Release 的 tag** 相比的全部变化，而不是本次发版包含哪些 commit。patch 不建 Release，所以自上一个 Release tag 到新 tag 之间落进来的所有改动——含中间的每个 patch——都要写进 notes。用上一个 Release 的 tag 圈定范围（`gh release list` 或 Releases 页最新的那条），以用户视角描述该范围内的变化；不要罗列本版本的 commit 清单。尚无任何 GitHub Release 时，覆盖到新 tag 为止的全部内容。

## 许可证

贡献即表示你同意你的贡献按 MIT License 授权。
