<!--
  v1.5.0 release notes（中文）。英文版见 ../../docs/release-notes/release-notes-v1.5.0.md
  Release: v1.5.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.5.0

本次发布修复了一个 v1.4.0 无法圆上的声明，堵住了放它过关的校验器漏洞，并删除了一个重复的运行时文件。盘点逻辑与 7 表结构不变。

## 变更亮点

- **语言声明校验** —— `check-docs.mjs` 现解析 `SKILL.md` 的 "Fixed-string languages" 行，若其中声称的语言在 `references/glossary.json` 中没有对应块则失败。
- **引用完整性校验** —— `SKILL.md` 提到的每个 `references/<name>` 必须存在，且 `references/checklist.md` 至少保留 20 个清单项。
- **日语 glossary 块** —— 现已真正落地；`en` / `zh` / `ja` 各含相同的 10 个键。
- **`update.ps1 -Help`** —— 显示用法、选项与安装位置，不改动任何文件。
- **两个 README 的"该读哪个文件？"导航。**

## 修复 / 一致性

- **`SKILL.md` 声称有 `ja` 却无 `ja` 数据。** v1.4.0 的 SKILL.md 说词表提供英、中、日三种语言，但 `references/glossary.json` 只有 `en` 和 `zh`——而校验器没发现，因为它只比对已存在的语言。数据与校验器均已修复。
- **删除重复的示例文件。** `examples/inventory-example.md` 与 `references/format-example.md` 近乎重复（17 行完全相同）。已合并为一个文件；运行时集合现为 `SKILL.md` + `references/`。
- **`SKILL.md` 的 "What it does" 规则合并**为单一小节。

## 运行时载荷

| | 之前 | 之后 |
|---|---|---|
| 分发文件 | `SKILL.md` + `references/` + `examples/` | `SKILL.md` + `references/` |
| 总字节 | 60,390 | 55,250 |
| 约 tokens（4 字节/token） | ~15,098 | ~13,813 |

**全量读取约省 1,285 tokens**，且无任何规则被删除。

## 验证

新校验均做了"故意破坏 → 确认失败"的验证：

```
声称 ja 但词表无 ja → error: glossary check: SKILL.md advertises "ja" ... but references/glossary.json has no "ja" block
引用了不存在的文件   → error: reference check: SKILL.md references "references/nonexistent-file.md" but the file does not exist
删掉清单项           → error: reference check: references/checklist.md has only 15 checklist item(s); at least 20 expected
回归干净             → 0 error(s), 0 warning(s)
```

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../../LICENSE)。
