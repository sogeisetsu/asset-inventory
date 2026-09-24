<!--
  中文版 release notes v1.13.3。仅供文档站与中文读者；GitHub Release 正文只用英文版。
  英文版：../../docs/release-notes/release-notes-v1.13.3.md
  Release: v1.13.3 — asset-inventory (sogeisetsu/asset-inventory)
  范围：与上一个 Release tag（v1.13.1）相比的全部变化。
-->

# v1.13.3

一个让发版可重复的 patch：发版准备脚本、文档对等门禁、两条发版政策规则。盘点逻辑与 7 表输出不变。本 Release 覆盖 v1.13.1 以来的全部变化，含仅打了 tag 的 v1.13.2。

## 新增

- **`scripts/release-prep.mjs`** —— 一条命令完成发版的机械半场：改 `SKILL.md` 版本号、插入中英 CHANGELOG 标题 stub、`--notes` 时生成双语 release-notes 并登记进文档校验器的配对表；随后跑双校验门、打印剩余手工步骤。绝不自动 commit/tag/push；工作树不干净或版本号重复则拒绝执行；`--dry-run` 只预览全部计划改动、不写盘。
- **check-docs 状态对等门禁** —— 词表里每个语言的每个状态标记（含第五个 `🛑broken`）必须原文出现在该语言 README 与文档落地页上。新标记再也不能在门面文档还列着旧集合时发出去——这正是 v1.13.0 踩过、只能手工补救的坑。

## 变更

- **Release notes 改为描述"与上个 Release 之间的范围"** —— 贡献指南（中英）现明确规定：Release 的 notes 必须覆盖与上一个 Release tag 相比的全部变化（用 `gh release list` 找上个 Release），以用户视角撰写——绝不罗列本次发版的原始 commit 清单。patch 不建 Release，所以中间的每个 patch 如今都会进入下一份 notes。你现在读的正是按此规则写的第一份 Release。
- **patch Release 显式要求即可建** —— 默认仍是"patch 只打 tag"；但当你明确要求为 patch 建 Release 时，走与 minor/major 相同的规则：双语 release-notes 文件、登记配对、英文文件作正文。
- **镜像同步进入工作流** —— 贡献工作流第一步点名 gitignored 的 `zh/skill-zh.md` 镜像，改 `SKILL.md` 不再依赖每个 agent 自己记得同步。

## 用法

从落地页（或 README）复制安装提示词发给你的 AI 助手，或手动把 skill 装进全局/项目级 skills 目录。然后问："列一下我的插件 / skills / 命令 / MCP / agents"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
