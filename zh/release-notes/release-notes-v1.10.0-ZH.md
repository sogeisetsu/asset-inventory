<!--
  v1.10.0 release notes（中文）。英文版见 ../../docs/release-notes/release-notes-v1.10.0.md
  Release: v1.10.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.10.0

本次发布是文档站打磨 + 仓库整理。盘点逻辑与 7 表结构不变。

## 变更亮点

- **release notes 移入独立目录** —— 改为 `docs/release-notes/` 与 `zh/release-notes/`，不再散落在 `docs/`、`zh/` 根目录。`check-docs` 配对表、CONTRIBUTING / 仓库目录树与所有交叉链接均已同步。

## 修复 / 一致性

- **修复语言叠加** —— 文档站语言切换用 `className` 分组，而其中包含它自己刚加上的 `.i18n-on`，导致第二次切换把同一槽位拆散、多语言同时渲染。现在分组忽略 `i18n-on`，每个槽位只显示一种语言。
- **语言选择改为按标签页** —— 由 `localStorage` 改为 `sessionStorage`：重新打开时回到英语，同一标签页内跨页面仍记住选择。
- **详情页清理** —— 去掉每个渲染示例上方的文件路径栏，给 `.facts` 定义表加上单元格边框，并给 JSON 示例加高度上限与滚动。

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../../LICENSE)。