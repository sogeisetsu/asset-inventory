<!--
  v1.4.0 release notes（中文）。英文版见 ../../docs/release-notes/release-notes-v1.4.0.md
  Release: v1.4.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.4.0

本次发布把文档规则变成自动化校验，兑现了 skill 此前无法兑现的语言承诺，并精简了 `SKILL.md`。盘点逻辑与 7 表结构不变。

## 变更亮点

- **PR 触发的文档校验**（`.github/workflows/docs-check.yml`）—— 现在每次向 `master` 提 PR 都会运行两个脚本的 `node --check` 与 `node scripts/check-docs.mjs`。此前唯一的工作流只在 `master` push 时部署 Pages，PR 完全没有闸门。
- **版本一致性校验** —— `check-docs.mjs` 读取 `SKILL.md` frontmatter 的 `metadata.version`，与 `CHANGELOG.md`、`zh/CHANGELOG-ZH.md` 顶部发布标题比对，不一致即失败。
- **glossary 结构校验** —— `references/glossary.json` 每个语言块的键集必须与 `en` 一致；逐语言报告缺失或多余的键。
- **日语词条** —— `references/glossary.json` 现提供 `en` / `zh` / `ja`，并为其它语言写明明确回退规则，而不再暗示所有语言都有固定字符串。
- **`references/checklist.md`** —— 完整质量清单，从 `SKILL.md` 提取出来。
- **`update.ps1 -DryRun`** —— 预览将复制哪些运行时文件，且不写任何内容。

## 修复 / 一致性

- **语言承诺修正** —— `SKILL.md` 不再声称所有语言都有词表条目。`en` / `zh` / `ja` 直接使用；其它语言从 `en` 块派生固定字符串并在 Provenance 中注明。
- **v1.3.0 发布日期**在两个 CHANGELOG 中由 `2026-09-13` 更正为 `2026-09-21`。
- **`SKILL.md` 精简** —— 42 行内联清单移出，规则主体更聚焦。
- **故障排除**补充了 Table 6 行序、非 glossary 语言、本地副本过期告警等条目。

## 验证

两个新校验都做了"故意破坏 → 确认失败"的验证：

```
版本错位 → error: version mismatch: SKILL.md has 1.3.0 but CHANGELOG.md top heading is 9.9.9
glossary 缺键 → error: glossary check: "zh" is missing key(s): tableTitles
回归干净 → 0 error(s) / 0 warning(s)
```

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../../LICENSE)。
