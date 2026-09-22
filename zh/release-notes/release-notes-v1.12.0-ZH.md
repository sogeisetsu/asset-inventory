<!--
  中文版 release notes v1.12.0。仅供文档站与中文读者；GitHub Release 正文只用英文版。
  英文版：../../docs/release-notes/release-notes-v1.12.0.md
  Release: v1.12.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.12.0

这次修正 skill 调用方式的描述，并升一版。7 张表结构与盘点逻辑不变。

## 变更

- **skill 的 `调用方式` 现在写真实 TUI 路径** —— 单元格改为 `看话自动干，或在 /skills 里选（直接打 /skill-name 也行）`，不再暗示只有裸 `/skill-name`：OpenCode TUI 的 `/` 补全跳过 `source === "skill"` 条目、`/skills` 才是官方选择器（直接打全名仍按 command 分发）。已同步 `SKILL.md`（规则 + 名称图例）、`references/checklist.md`、`references/format-example.md`、`references/usage-guide.md` 与全部 EN/ZH 样例（`inventory.md`、`asset-inventory.json`、`usage-guide.md`）；样例页已重建。

## 使用

从落地页（或 README）复制安装提示词发给你的 AI 助手，或把 skill 手动装进全局 / 项目级 skills 目录。然后说："盘点我的插件 / Skill / 命令 / MCP / Agent"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
