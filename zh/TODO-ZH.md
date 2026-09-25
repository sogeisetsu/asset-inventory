# TODO —— 发布计划

> 滚动式发布计划。每完成一个版本就勾掉对应项，并更新底部的**下一步**。
> 新会话请先读本文件，即可确认当前进行到哪个版本、接下来做什么。
>
> 英文对读版：[`docs/TODO.md`](../docs/TODO.md)（两者保持同步）。

## 发布梯队

| 版本 | 级别 | 内容 | tag | Release | 状态 |
|---|---|---|---|---|---|
| 1.7.1 | patch | 发布计划 + tag/release 政策澄清 | ✅ | — | ✅ 已完成 |
| 1.7.2 | patch | 修正 MCP 调用事实（skill 规则 + 全部样例） | ✅ | — | ✅ 已完成 |
| 1.7.3 | patch | README 整理：去标题 emoji、加"通过 AI 安装"、非中英 README 移入 `readmes/` | ✅ | — | ✅ 已完成 |
| 1.7.4 | patch | 文档站点：未翻译内容回退英文（修"只有框架没有内容"） | ✅ | — | ✅ 已完成 |
| 1.8.0 | minor | glossary 补齐 `ko` / `ru` / `ar` / `es`（7 语言固定字符串） | ✅ | ✅ | ✅ 已完成 |
| 1.9.0 | minor | 样本页：生成脚本、渲染 Markdown/JSON、`docs/samples/` 目录重构 | ✅ | ✅ | ✅ 已完成 |
| 1.9.1 | patch | 将分支规则写入文档（CONTRIBUTING + 仓库指南） | ✅ | — | ✅ 已完成 |
| 1.9.2 | patch | release notes 移入 docs/release-notes/ 与 zh/release-notes/ | ✅ | — | ✅ 已完成 |
| 1.9.3 | patch | 修复语言叠加、语言选择改为按标签页（sessionStorage） | ✅ | — | ✅ 已完成 |
| 1.9.4 | patch | 详情页：去掉示例 bar、.facts 加边框、JSON 限高 | ✅ | — | ✅ 已完成 |
| 1.10.0 | minor | 文档站修复 + release notes 归集，双语 release notes | ✅ | ✅ | ✅ 已完成 |
| 1.10.1 | patch | 为旧 release notes 地址加 404 跳转 | ✅ | — | ✅ 已完成 |
| 1.10.2 | patch | 文档站 M3 优化 + 示例面板；参数（Targeting）文档（中英） | ✅ | — | ✅ 已完成 |
| 1.10.3 | patch | 省 token：精简 SKILL.md + format-example.md（不改变行为） | ✅ | — | ✅ 已完成 |
| 1.11.0 | minor | 文档站 M3 + 示例面板、参数文档、省 token 精简；双语 release notes | ✅ | ✅ | ✅ 已完成 |
| 1.11.1 | patch | 规则加固：home 路径脱敏、同名 skill/命令合并、禁用 agent、未注册残留 | ✅ | — | ✅ 已完成 |
| 1.11.2 | patch | 命令与同名 skill 绝不合并；扩大上游查找；名称图例 | ✅ | — | ✅ 已完成 |
| 1.11.3 | patch | 合并判据：同一插件包的同名对 = 一行；来源不同则两行 | ✅ | ✅ | ✅ 已完成 |
| 1.11.4 | patch | 通过 AI 安装强制 `git clone`、去掉 ZIP 回退；警告勿用 Releases ZIP | ✅ | ✅ | ✅ 已完成 |
| 1.11.5 | patch | `AGENTS.md` 去隐私并入库；Release 正文纯英文 | ✅ | — | ✅ 已完成 |
| 1.11.6 | patch | 根目录瘦身：`assets/`→`docs/assets/`、`TODO.md`→`docs/` | ✅ | — | ✅ 已完成 |
| 1.11.7 | patch | SKILL.md 自述来源行；references 刻意不加（记录在案） | ✅ | — | ✅ 已完成 |
| 1.11.8 | patch | 运行时载荷行为中立 token 精简 | ✅ | — | ✅ 已完成 |
| 1.12.0 | minor | skill 的 `调用方式` 写真实 TUI 路径（`/skills` 选择器 + 直接打全名） | ✅ | ✅ | ✅ 已完成 |
| 1.13.0 | minor | `🛑已损坏` 状态标记（7 语言）、可见检查点、精扫产出/Provenance 规则 | ✅ | ✅ | ✅ 已完成 |
| 1.13.1 | patch | 探活带配置 env 规则、diff 协议钉死、安全护栏、五态同步 | ✅ | ✅ | ✅ 已完成 |
| 1.13.2 | patch | release-prep 脚本、check-docs 状态对等规则、工作流镜像提示、patch Release 覆盖条款 | ✅ | — | ✅ 已完成 |
| 1.13.3 | patch | release notes 范围规则（对齐上个 Release tag）、release-prep `--notes` 填写提示 | ✅ | ✅ | ✅ 已完成 |
| 1.13.4 | patch | 判定不 dump 证据规则、第一份充分证据即停、输出预算、分级打印的全量扫描示例 | ✅ | — | ✅ 已完成 |
| 1.13.5 | patch | update.ps1 备份移出 skills 命名空间（原会被加载成重复 skill）；AGENTS 规则同步 | ✅ | — | ✅ 已完成 |
| 1.13.6 | patch | 文档站渲染示例页、宿主感知的调用措辞（7 语 README + skill）、移除复制命令按钮 | ✅ | — | ✅ 已完成 |

## 详情

### 1.7.2 —— MCP 调用事实（patch）
skill（及全部样例）曾声称 MCP 服务器"只由 Agent 调用、人永远不用叫"。这是错的。
修正 `SKILL.md`（Cell Conventions、Discover、Anti-patterns）与
`references/checklist.md`，并同步全部样例：`docs/samples/inventory.md`、
`docs/samples/usage-guide.md`、`docs/samples/asset-inventory.json`、
`docs/inventory.html`、`docs/asset-inventory-json.html`、`docs/index.html`。

### 1.7.3 —— README 整理（patch）
- 去掉所有 README 标题里的 🗃️ emoji（共 7 个文件）。
- 每个 README 增加"通过 AI 安装"小节（复用 `docs/index.html` 已本地化的提示词）。
- 非中英 README 移入 `readmes/`，重写相对链接（`assets/`、`LICENSE`、`docs/`、
  `CHANGELOG.md`、`CONTRIBUTING.md`）、语言切换链接、`scripts/check-docs.mjs`
  （`README_LOCALES` + CJK 剥离正则），并更新
  `docs/guides/repository-and-contributing.md` 的目录树。

### 1.7.4 —— 站点英文回退（patch）
ja/ko/ru/ar/es 下未翻译的正文是空白。引入 `data-i18n` 分组 + `lang.js` 解析
（所选语言 → 无则回退英文），并把 `style.css` 的可见性切到 `.on` 类，覆盖四个
HTML 页面。框架与标题保留所选语言。

### 1.8.0 —— glossary 七语言（minor · 建 Release）
往 `references/glossary.json` 新增 `ko` / `ru` / `ar` / `es` 块（各 10 键，键集
与 `en` 完全一致），并把 `SKILL.md` 的 "Fixed-string languages" 行扩到七种。

### 1.9.0 —— 样本页（minor · 建 Release）
新增 `scripts/build-sample-pages.mjs`，把 `inventory.md`（表格）、
`usage-guide.md`（真 HTML）、`asset-inventory.json`（美化缩进）渲染进三个详情页。
样本目录重构：英文放 `docs/samples/`、中文放 `docs/samples/zh/`；更新所有样本链接。
详情页标题去掉裸文件名。

## 下一步

梯队已完成到 **1.13.6**：1.11.1–1.11.8 与 1.13.1–1.13.6（patch）、1.12.0 与
1.13.0（minor），GitHub Release 见 1.11.3、1.11.4、1.12.0、1.13.0、1.13.1 与 1.13.3。
当前没有进行中的工作 —— 后续工作从这里开一条新梯队。
