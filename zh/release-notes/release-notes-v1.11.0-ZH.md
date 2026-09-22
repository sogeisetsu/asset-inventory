<!--
  中文版 release notes v1.11.0。仅供文档站与中文读者；GitHub Release 正文只用英文版。
  英文版：../../docs/release-notes/release-notes-v1.11.0.md
  Release: v1.11.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.11.0

这次是文档站的打磨，加上一次不改变行为的省 token 精简。7 张表结构与盘点逻辑不变。

## 新增

- **参数（Targeting）文档** —— `docs/guides/how-it-works.md` 现在说明每个参数扫什么、写哪些文件（`mcp`、`agents`、`hosts`、`skills`、`diff`、`usage`），并从 `README.md` 与 `README-ZH.md` 的快速开始参数行链接过去。
- **渲染示例改为 M3 面板** —— 每个渲染示例都放进带描边的 Material 3 面板，配随语言变化的标签（"Rendered sample" / "渲染示例" / …），并把内部标题降级，不再与页面自身标题抢层级。
- **轻度 M3 交互优化** —— 悬停 state layer、可见的键盘聚焦环、M3 缓动曲线。

## 变更

- **省 token 精简（不改变行为）** —— `SKILL.md` 缩小约 17%，`references/format-example.md` 缩小约 25%：删除重复规则与示例行，并把路径变量表移入 `references/host-commands.md`。已逐条审计，规则完整无歧义，产出不变。

## 修复 / 一致性

- **旧的 release notes 地址不再 404** —— `docs/404.html` 会把 `/release-notes-vX.Y.Z.md` 跳到 `/release-notes/release-notes-vX.Y.Z.md`（GitHub Pages 是静态托管，无法做服务端跳转）。

## 使用

从落地页（或 README）复制安装提示词发给你的 AI 助手，或把 skill 手动装进全局 / 项目级 skills 目录。然后说："盘点我的插件 / Skill / 命令 / MCP / Agent"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
