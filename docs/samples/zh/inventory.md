# 资产盘点（示例输出）

> 这是 asset-inventory skill 的一份**示例输出**，用于展示最终生成的 7 张表长什么样。
> 数据取自一台真实机器（macOS/Linux 路径已脱敏），但**每一行都经过实测**；你自己的机器跑出来的结果会不同。
> 表格结构固定：表 1–5、7 为五列，表 6 为六列。

## 表1 插件与配套软件

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| OpenChamber | 外层应用官方，安装包 `resources/` + 配置 `$HOST_CONFIG/` ✅实测 | 不用叫，开机自带 | 每次打开工作区时 | 它是你一直在用的桌面工作区，常驻运行、无需调用；它管理项目、会话、计划任务、模型偏好与内嵌浏览器，并向 opencode 注入一批 `/` 命令和会话、浏览器工具。要在应用里而不是裸终端里做事时，就用它的各项能力。盘点时，以它托管的 opencode 进程为准。 |
| @rezamonangg/opencode-rtk | 第三方插件，`opencode.jsonc:plugin[]` ✅实测 | 不用叫，自动生效 | 会话变长、想省 token 时 | 一旦列进 `opencode.jsonc:plugin[]` 就自动生效，没有命令要跑；它把白名单命令经 RTK 改写，省下 token 并记账。切换模型或角色时最常感受到它的存在。 |
| oh-my-opencode-slim@2.2.18 | 第三方插件，`opencode.jsonc:plugin[]` ✅实测 | 不用叫，自动生效 | 想按角色切换模型链时 | 它在配置里声明后自动生效；它带来 8 个受管 skill、7 个 agent 与多套模型预设，并自动拆分派发多步任务。想按角色或模型链切换时用它。 |

## 表2 各软件/插件带来的 Skill 与命令

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| simplify | oh-my-opencode-slim manages skill（skills-manifest.json，status managed，v2.2.18）✅实测 | 看话自动干，或 `/simplify` | 需要在不改行为的前提下简化代码时 | 它在请求匹配描述时自动触发，也可用 `/simplify` 按名调用；触发后它梳理冗余、提升可读性，但**不改变行为**。适合行为已经明确、只想让代码更清爽时。 |
| codemap | oh-my-opencode-slim manages skill（skills-manifest.json，status managed，v2.2.18）✅实测 | 看话自动干，或 `/codemap` | 进入陌生仓库需要导览时 | 自动触发或按名调用；它为不熟悉的仓库生成层级结构图，标注主模块、入口文件与模块关系。第一次接触新项目时先跑它——但它很贵，只在确实需要时用。 |
| clonedeps | oh-my-opencode-slim manages skill（skills-manifest.json，status managed，v2.2.18）✅实测 | 看话自动干，或 `/clonedeps` | 需要读依赖库源码时 | 自动触发或按名调用；它把重要依赖的源码克隆到本地被忽略的工作区，让你能直接读 SDK/框架内部实现。调试库行为、理解底层机制时用。 |
| deepwork | oh-my-opencode-slim manages skill（skills-manifest.json，status managed，v2.2.18）✅实测 | 看话自动干，或 `/deepwork` | 复杂多阶段、需要审查关卡时 | 自动触发或按名调用；它是高成本编排器，拆活、派活、再整合，带审查关卡，适合大型重构或新功能实现。**很贵**，只在明确需要时用。 |
| /rtk-gain | @rezamonangg/opencode-rtk 注册命令（dist hooks/）✅实测 | `/rtk-gain` | 长会话结束时想确认省了多少 token | 你输入 `/rtk-gain`；它立即执行 rtk_gain 工具，把白名单命令经 RTK 改写后省下的 token 量打成账单展示，不问问题也不改配置。适合每次长会话结束时看一眼省了多少。 |

## 表3 原生命令与原生 Skill

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| /compact | 核心自带，官方 TUI 文档 ✅文档 | `/compact` | 会话很长、上下文快溢出时 | 你输入 `/compact`；它用 AI 压缩会话历史，让你能继续干活，而不是被迫开新会话丢上下文。适合长会话中途上下文吃紧时。 |
| /undo | 核心自带，官方 TUI 文档 ✅文档 | `/undo` | 说错话或改错文件、想撤回时；需要 git | 你输入 `/undo`；它撤回上一条消息，并通过 Git 回滚那条消息产生的文件改动，反悔用 `/redo`。项目不是 git 仓库时不可用——这是最常见的坑。 |
| /new | 核心自带，官方 TUI 文档 ✅文档 | `/new` | 一个任务做完、不想污染下一个任务时；需要 git | 你输入 `/new`（别名 `/clear`）；它开一个干净会话，旧会话仍保留、随时可切回。适合一件事做完、想要清爽开局时。 |

## 表4 自定义 Skill、命令与外层应用注入命令

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| asset-inventory | 本地自建，上游 `github.com/sogeisetsu/asset-inventory` MIT ✅实测 | 看话自动干，或 `/asset-inventory` | 需要盘点本机 opencode 环境时 | 自动触发或按名调用；它一次扫清本机所有可调用的插件、Skill、命令、MCP、Agent 和外层应用能力，输出 7 张表 + JSON + 使用指南。适合换机器、交接、或搞不清环境时用。 |
| /catch-up | host-injected，二进制扫描 `<app.asar>` 发现 ✅实测 | `/catch-up` | 每次回到项目、丢了上下文时第一件事 | 它由外层应用注入，输入 `/catch-up` 运行；它汇总当前分支提交、PR 状态与未提交改动，给出可速览的摘要和下一步。多会话来回切换时，这是最高频的命令。 |
| /debug | host-injected，二进制扫描 `<app.asar>` 发现 ✅实测 | `/debug` | 测试红了、修几次修不好时 | 输入 `/debug` 运行；它做引导式根因分析，定位到原因后才动手修，禁止盲目试错。适合反复修不好、需要根因而不是再猜一次时。 |

## 表5 MCP

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| websearch | 远端 MCP，`mcp.exa.ai`，全局配置 `opencode.jsonc:mcp.websearch` ✅实测 | 点名调用（"use websearch"），或 Agent 自调（工具 `websearch_*`） | 需要联网实时搜索时 | 你可以点名调用它，Agent 在需要实时信息时也会自动调它，返回清洁文本；查文档、查新闻、查技术细节时用。 |
| context7 | 远端 MCP，`mcp.context7.com`，全局配置 `opencode.jsonc:mcp.context7` ✅实测 | 点名调用（"use context7"），或 Agent 自调（工具 `context7_*`） | 需要最新的库/框架文档时 | 你可以点名调用它，Agent 也会用它拉取最新的库文档而不是靠记忆；其 auth 头含密钥，已打码。 |
| grep_app | 远端 MCP，`mcp.grep.app`，全局配置 `opencode.jsonc:mcp.grep_app` ✅实测 | 点名调用（"use gh_grep"），或 Agent 自调（工具 `grep_app_*` / `gh_grep_*`） | 想在真实开源代码里找用法时 | 你可以点名调用它，Agent 也会用它检索上百万公开仓库的真实代码；适合找某个库的实际用法或生产环境示例。 |
| PaddleOCR-VL-1.6 | 本地 MCP，`paddleocr_mcp.exe`，全局配置 `opencode.jsonc:mcp.PaddleOCR-VL-1.6` ✅实测 | 点名调用（"use PaddleOCR-VL-1.6"），或 Agent 自调（工具 `PaddleOCR_VL_*`） | 需要识别图片型/扫描版 PDF 时 | 你可以点名调用它，Agent 也会用它做 OCR 解析；有文字层的 PDF 应先走文本提取，无文字层再用它。 |
| pdf-mcp | 本地 MCP，`pdf-mcp` 命令，全局配置 `opencode.jsonc:mcp.pdf-mcp` ✅实测 | 点名调用（"use pdf-mcp"），或 Agent 自调（工具 `pdf_*`） | 需要读取、检索或抽取 PDF 内容时 | 你可以点名调用它，Agent 也会用它提取文本、检索、拉取表格与目录，带 SQLite 缓存；只读用途，不做表单填写或签名。 |

## 表6 Agent

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 | 模型链 |
|---|---|---|---|---|---|
| build | 核心自带（primary）✅实测 | 默认 Tab | 要改代码、跑命令时 | 它是默认 primary，Tab 切换落在这里，全工具开启；它实现需求、编辑文件、运行命令，除规划类任务外所有日常改动都走它。 | `opencode-go/mimo-v2.5`（单模型，无链式回退） |
| plan | 核心自带（primary）✅实测 | Tab 切换 | 想先要方案再动手时 | 用 Tab 切到它；它研究代码并给出方案与步骤，默认不改文件，适合"先计划再行动"。 | `opencode-go/mimo-v2.5`（单模型，无链式回退） |
| orchestrator | oh-my-opencode-slim（plugin package，primary）✅实测 | 自动接管 | 任何多步任务 | 它在匹配的多步任务上自动接管，也可按名调用；它拆活、派活、再整合结果，只协调不亲自写代码，把子任务结果缝合成最终答复。 | `opencode-go/deepseek-v4-flash → longcat/LongCat-2.0 → opencode/big-pickle → opencode/hy3-free`（当前预设 jibei-factory）；备用预设：openai、opencode-go |
| oracle | oh-my-opencode-slim（plugin package，subagent）✅实测 | 自动接管 | 需要架构建议、复杂调试或代码审查时 | 由 orchestrator 在匹配子任务上派发；它做战略性技术判断，给架构、调试、简化方向的建议，只出结论不落代码。 | `opencode-go/mimo-v2.5 → opencode-go/deepseek-v4-flash → opencode-go/hy3`；备用预设：openai、opencode-go |
| explorer | oh-my-opencode-slim（plugin package，subagent）✅实测 | 自动接管 | 需要快速定位代码时 | 由 orchestrator 派发；它做快速代码检索与模式匹配，回答"X 在哪"这类问题，只读不改。 | `opencode-go/hy3 → opencode/big-pickle`；备用预设：openai、opencode-go |
| librarian | oh-my-opencode-slim（plugin package，subagent）✅实测 | 自动接管 | 需要查官方文档或真实代码示例时 | 由 orchestrator 派发；它查官方文档、GitHub 示例、库内部实现，把外部资料带回来。 | `longcat/LongCat-2.0 → opencode-go/hy3 → opencode/big-pickle`；备用预设：openai、opencode-go |
| fixer | oh-my-opencode-slim（plugin package，subagent）✅实测 | 自动接管 | 需要按明确规格执行改动时 | 由 orchestrator 派发；它接收完整上下文与任务规格，高效执行代码改动。 | `longcat/LongCat-2.0 → opencode-go/mimo-v2.5 → opencode-go/deepseek-v4-flash`；备用预设：openai、opencode-go |

> 注：隐藏系统 agent（compaction/title/summary）自动运行，但不可在 UI 选择，故不列为可用行。

## 表7 外层应用

| 名称 | 来源 | 调用方式 | 何时用 | 干什么 |
|---|---|---|---|---|
| 全局行为规则 | 宿主设置 `$HOST_CONFIG/` global behavior ✅实测 | 看话自动干 | 所有会话 | 它在每次回复前自动生效、无需调用；它为每个会话设定家规，例如先验证再查文档、不可逆操作先计划后确认。没有要叫的东西——它就是一直在生效。 |
| 模型偏好管理 | 宿主设置 `$HOST_CONFIG/` model preferences ✅实测 | 在应用里切换 | 想换默认模型或预设时 | 它在应用界面里管理模型偏好，切换后对后续会话生效；想换默认模型或预设时在这里改，不用碰配置文件。 |
| 内嵌浏览器 | 宿主工具 ✅实测 | Agent 调用时 | 需要看已登录的页面时 | Agent 按需用它打开页面、读内容、点击、截图，全程带着你真实的登录态；当任务依赖只有登录浏览器才能看到的页面时用它。 |

---

**记忆口诀：盘点的三个问题——是什么、谁带来的、怎么用；来源必须具体到带来者，命令归它调用的工具所属方。**

盘点时间：2026-09-22 | 预设：jibei-factory | 命令：`opencode agent list` + `opencode --pure agent list` 已跑
未解析：无
本表由 asset-inventory 生成（自包含）
