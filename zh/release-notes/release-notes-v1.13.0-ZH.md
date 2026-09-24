<!--
  中文版 release notes v1.13.0。仅供文档站与中文读者；GitHub Release 正文只用英文版。
  英文版：../../docs/release-notes/release-notes-v1.13.0.md
  Release: v1.13.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.13.0

新增 `🛑已损坏` 状态标记、可见的安全检查点，以及终于与精扫模式对齐的文件产出 / Provenance 规则。7 张表结构与盘点逻辑不变。

## 新增

- **第 5 个状态标记 `🛑已损坏`（7 语言）** —— 针对"配置里注册了但调不起来"的资产（缺命令 / 缺环境变量 / 探活失败）：来源缀 `⚠️inferred` + 状态 `🛑已损坏`，失败原因引用进表注。七种 glossary 语言（en/zh/ja/ko/ru/ar/es）全部就位，并接入状态标记表、`MCP server unreachable` 故障分支、使用指南排除清单与质量清单。在此之前，探活失败的服务器没有诚实的标记可写：`✅available` 等于声称能调用，`❌disabled` 又会歪曲配置。
- **三处检查点标记可见化** —— diff 粘贴门 🔴、实名门 🔴、脱敏 STOP 🛑 现在以醒目标记立在各自关口，不再混在正文里。

## 变更

- **文件产出与运行类型对齐** —— 全量扫描写三份文件到 `output/`；精扫模式（`mcp` / `agents` / `hosts` / `skills`）只写 `inventory.md` + JSON，`usage` 只写 `usage-guide.md`，`diff` 不写文件（在对话中作答，仅明确要求才写）。"绝不写到 `output/` 之外"保持绝对。
- **精扫模式 Provenance 规则** —— Provenance 模板描述的是全量扫描；精扫模式下被跳过的字段写 `not scanned (<target> target)` / `skipped (<target> target)`，落款绝不会声称跑过其实没跑的命令。
- **新增无法解析粘贴的失败分支** —— 粘贴的 diff JSON/Markdown 解析不了时，请用户重贴或退回对比 Markdown 表格，不再猜测；绝不编造 PK 行。
- **规则归位、示例修正** —— 表 2 / 表 6 规则从概览单元格移入专节（模型链豁免只说一次），`format-example.md` 的每个 Source 单元格都补上可信度 + 状态后缀，Error Handling 关联了故障排除指南。

## 使用

从落地页（或 README）复制安装提示词发给你的 AI 助手，或把 skill 手动装进全局 / 项目级 skills 目录。然后说："盘点我的插件 / Skill / 命令 / MCP / Agent"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
