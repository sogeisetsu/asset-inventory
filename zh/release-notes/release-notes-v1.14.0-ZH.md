<!--
  v1.14.0 的中文 release notes。英文版（GitHub Release 正文只用英文版）：
  ../../docs/release-notes/release-notes-v1.14.0.md
  Release: v1.14.0 — asset-inventory (sogeisetsu/asset-inventory)
  范围：与上一个 Release tag（v1.13.3）相比的全部变化，含 1.13.4–1.13.7 各 patch。
-->

# v1.14.0

一条命令经 skills.sh 安装、流程前置的 SKILL.md、以及对真实机器上各种边角情况的诚实处理——并包含上次 Release 之后 1.13.4–1.13.7 各 patch 的全部改动。7 表结构与盘点逻辑不变。

## 新增

- **通过 skills.sh 安装** —— 七种语言的 README 与安装指南新增一行命令 `npx skills add sogeisetsu/asset-inventory`：自动检测本机的 agent（OpenCode、Claude Code、Codex、GitHub Copilot……）并装进各自的 skills 目录，`-g` 全局安装、`-y` 跳过确认、`--copy` 复制而非软链接。中英 README 同时加入 skills.sh 官方徽章。
- **更完整的 skill description** —— frontmatter 描述现在写明三问（是什么/谁带来的/怎么用）、状态标记、触发场景（diff 模式、清理与未使用资产问询）、usage guide 产出与只读/打码保证，宿主与 registry 加载前即可判断相关性。
- **`metadata.source`** —— frontmatter 以 Agent Skills `metadata` 扩展键记录规范仓库地址，宿主与 registry 可机器读取。
- **证据返回判定，不倒 dump**（1.13.4）—— 计数断言只打 `N = M`、哈希只打 `match=true|false`、二进制扫描打印按证据强度排序的上下文候选加被抑制计数（不再倾倒上千个裸 token），checklist 把"判定 + 支撑原句 + 无静默截断"设为输出门禁。结论不变，上下文成本大降。

## 变更

- **流程前置的结构** —— `Procedure` 移到输出格式规范之前，skill 按执行顺序阅读（发现 → 验证 → 输出 → 格式），修复了原文"the 7-table inventory below"的死引用；模糊的 `The Rule` 标题改为 `Output format — the 7 tables`，定向写盘枚举改为指向 Targeting 表不再重复。
- **调用措辞适配宿主**（1.13.6）—— 快速开始区分"输入 `/skill-name`（任何宿主可用）"与"从 OpenCode TUI 的 `/skills` 选择器挑选（并非所有宿主都暴露）"。
- **示例清单在文档站渲染展示**（1.13.6）—— 示例 7 表与 JSON 以独立 HTML 页面呈现，不再直接甩 Markdown 源码。
- **安装提示词七语统一无歧义**（1.13.7）—— 所有语言均定义 `<target>` 为 skills 根目录，复制步骤指向同一目标。

## 修复

- **嵌套 MCP 配置计数正确** —— 表 5 计数断言现在处理嵌套在 `mcp.servers.*` 下的 server 与插件运行时注册的 server：数叶子加插件注册、在表注写明口径（`6 config leaves + 1 plugin = rows`），绝不为凑断言填充或删行。
- **diff 模式识别状态翻转** —— 两版都存在、只有状态标记变化的 PK（如 `✅available → ❌disabled`）现在以一行 `state changed:` 注记呈现；此前它既不算 Added 也不算 Removed，可能被静默丢失。
- **表 7 类目名绝不即兴** —— `references/glossary.json` 全部 7 种语言新增 `hostCategories`（固定 7 槽），非英文产出逐字使用固定类目标签，不再临场翻译。
- **`update.ps1` 备份离开 skills 命名空间**（1.13.5）—— 备份写到 skills 目录的上级，避免备份里的 `SKILL.md` 被宿主当重复 skill 加载。
- **`update.ps1 -DryRun` 无副作用**（1.13.7）—— 预览在 `git pull` 之前执行，dry run 绝不拉仓库，且没有全局安装时不再退出 1。

## 用法

从落地页（或 README）复制安装提示词发给你的 AI 助手，或运行 `npx skills add sogeisetsu/asset-inventory`，或手动装进全局 / 项目级 skills 目录。然后问："盘点我的插件 / skill / 命令 / MCP / agent"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
