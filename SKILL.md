---
name: asset-inventory
description: 全量盘点任意一台机器的 OpenCode/OpenChamber 资产。用户说“列一下我有什么插件/Skill/命令/MCP/Agent”“哪个被禁用了”时用。产出 0→6 共 7 张表，每行必带来源与可信度，不抄二手速查，不写死任何版本与路径。
---

# 资产盘点（通用开源版）

## 适用与不适用

- 适用：给新手讲清“我装了啥、怎么叫、何时用”；核对禁用项；换机迁移前留档。
- 不适用：普通改代码、单次调试、性能优化。一次孤立问题不建新资产。

## 人话定义（每次先复述）

- **命令**：你敲的，`/xxx` 按一下动一下。
- **Skill**：看你说话自动干，也能硬敲 `/技能名`。按需经 `skill` 工具加载完整 `SKILL.md`。
- **MCP**：Agent 的工具箱，分本地/远端。Skill 也可自带 MCP（按需懒加载），别只查全局配置。
- **Agent**：后台干活的人，分原生（core 自带）与插件带来。`description` 决定何时被自动叫起。
- **宿主**：包着 opencode 的桌面/服务端应用，命令不在 opencode 配置里。

## 表顺序与列（固定）

0. 配套软件/插件 → 1. 插件带来的命令/Skill → 2. 原生命令+Skill →
3. 自定义/自装 → 4. MCP → 5. Agent → 6. 宿主。

每表 5 列：`名称｜来源｜怎么叫｜何时用｜干什么`

- 来源词典（只用这些）：`核心` / `全局配置` / `项目配置` / `插件包` / `技能包` /
  `本地自建` / `远端MCP` / `本地MCP` / `宿主`。
- 可信度缀来源后：`✅实测` / `✅文档` / `⚠️推断`。
- 何时用必须写场景，禁“按需”。干什么=简单一句+详细1-2句。
- 禁止写死：版本号、绝对路径、模型名、数量（如“17个命令”）一律现查现写。

## 路径变量（勿写绝对路径）

- `$OPENCODE_CONFIG`：全局配置目录（Win `%APPDATA%` 下或 `~/.config/opencode`，
  以 `OPENCODE_CONFIG_DIR` 环境变量为准）。
- `$PROJECT_DIR`：当前项目根，由会话目录推导。
- `$HOST_CONFIG`：宿主应用配置目录（OpenChamber 即其 config 目录）。
- `$PACKAGE_CACHE`：插件缓存目录（`opencode` 的 packages 缓存）。
- 贴路径时写 `$OPENCODE_CONFIG/opencode.jsonc` 这类相对式，正文不出现
  `C:\Users\xxx`、`E:\xxx`。

## 证据顺序

1. **直接验证**：TUI 输 `/` 看联想；宿主自带浏览器打开宿主本地端口页亲眼确认；
   只读列 `$OPENCODE_CONFIG/command/`、`$OPENCODE_CONFIG/skills/*/SKILL.md` 前15行；
   读 `opencode.jsonc`、`tui.json`、项目 `.opencode/`；
   跑 `opencode agent list` 与 `opencode --pure agent list` 对比，得出
   `✅可用 / ❌已禁用（贴配置行）/ 不存在（两份list皆无）` 三态。
2. **查官方文档**：`opencode.ai/docs/tui#commands`（系统命令）、
   `opencode.ai/docs/agents/`（原生 Agent 三态：primary/subagent/隐藏）、
   Context7 查插件包文档。文档版本可能领先本地版本，以本地实测为准。
3. **最后读源码**：插件缓存包内搜技能注册表（如 `CUSTOM_SKILLS`）、命令注册；
   有源码无注册=未安装，必须显式说明；宿主 `agent-tool/*.js` 定工具动作；
   应用包（asar/web-dist）只读搜补漏，有才收录。

## 各表 checklist（只写查法，不写答案）

- **表0**：`plugin[]`、`package.json:dependencies`、项目 `tui.json:plugin[]`、
  宿主被管进程文件。判宿主 vs 插件 vs 项目级。
- **表1**：技能 manifest 定版本与 customized；重写类插件读其 wrapper 配置；
  无包注册的命令归宿主自定义，不硬归插件。
- **表2**：系统命令以官方文档为准；builtin skill（如改自身配置类）归原生。
- **表3**：本地自建 skill 必写上游（GitHub/协议/版本）与外部依赖
  （如浏览器 CLI、OCR CLI）；全局/项目自定义命令逐条展开，禁合并。
- **表4**：全局 `mcp` + 项目级追加，注明远端/本地、启用位、认证头是否脱敏。
- **表5**：原生三类 + 插件全量 + 自定义（`agents/` 目录有无）。
  模型写“当前预设全链现查”，示例格式 `a→b→c`，另注备用预设名，不贴死模型。
- **表6**：全局行为规则、模型偏好、会话/任务动作、页内浏览器动作、
  被管进程、提示优化、技能市场（仅货架，未装不可用）。

## 开源卫生（本 skill 自带）

- 输出与示例中**脱敏**：API key、token、绝对用户名路径、私有项目名一律打码。
- 跨平台：路径用变量，shell 示例同时给 PowerShell 与 sh，或注明仅某平台。
- 仓库建议：`SKILL.md` + `README.md`（中英双语）+ `LICENSE` + `examples/`（脱敏表示例）。
- 不收录、不引用用户私有的二手速查文件；引用第三方 skill 注明上游与协议。

## 禁止

- 写死版本/路径/模型/数量；把推断写成实测；多命令挤一格。
- 未经确认改 skill/command/agent/MCP/配置；为凑数造资产。
- 把单会话返工当跨会话高频；用隐私路径做示例。

## 输出

中文 compact 表格为主，表间空一行，末尾一句口诀。版本新增（如未来新 subagent）
单独注一句，不改历史结论。
