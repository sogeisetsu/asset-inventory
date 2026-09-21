<!--
  v1.8.0 release notes（中文）。英文版见 ../docs/release-notes-v1.8.0.md
  Release: v1.8.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.8.0

skill 的固定输出字符串现已覆盖文档早就承诺的全部七种语言。

## 新增

- **四种固定字符串语言** —— `references/glossary.json` 在 `en` / `zh` / `ja` 之外新增 `ko`（韩语）、`ru`（俄语）、`ar`（阿拉伯语）、`es`（西班牙语）四个语言块。每个都与 `en` 拥有相同的 10 个键：`columns`、`columnsAgent`、`tableTitles`、`state`、`confidence`、`emptyTable`、`unknown`、`threeQuestions`、`provenance`、`provenanceRealName`。

## 变更

- **扩宽 `SKILL.md` 的语言声明** —— "Fixed-string languages" 行现列出全部七种；韩/俄/阿/西请求直接使用词表字符串，不再从英文块派生。七种之外的语言仍按文档化的"从英文派生"规则处理。

## 验证

- `check-docs`：词表结构校验确认每个语言块与 `en` 的键集完全一致。
- 人工比对每个新块与 `en`：10 键、5 列、agent 6 列、provenance 3 行。

## 许可证

MIT — 见 [LICENSE](../LICENSE)。
