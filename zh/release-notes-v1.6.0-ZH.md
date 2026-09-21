<!--
  v1.6.0 release notes（中文）。英文版见 ../docs/release-notes-v1.6.0.md
  Release: v1.6.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.6.0

三个真实缺陷已修，输出格式更干净，落地页现在会逐个解释每份产物。盘点逻辑与 7 表结构不变。

## 修复

- **MCP server 被静默漏掉。** skill 只列出 1 个 MCP 就停下，即使配置里有 5 个（`websearch`、`context7`、`grep_app`、`pdf-mcp`、`PaddleOCR-VL-*`）。`Discover` 现有明确的 MCP 步骤：读取全部 `mcp` key，并**把行数与配置的 key 数做断言** —— 单行表 5 现被标为危险信号，写入表格规范与质检清单。
- **`update.ps1` 目录嵌套。** `Copy-Item -Recurse` 复制到已存在目标时会嵌套，多次更新长出 `references/references/…`。现改为先删后复制。
- **`update.ps1` 备份步骤失败且污染安装目录。** 备份目录从未创建（写入报错），且备份落在 skill 目录**内部**。现改写到同级目录，且使用前先创建。

## 变更

- **"干什么"为一段详细文字** —— 不再有 `简单：… 详细：…`。每个单元格覆盖：怎么调用、何时用、用了之后会发生什么。
- **使用指南分两种模式** —— 空项目用通用模式（A），非空项目锚定到项目但不过度耦合（B）。
- **中文列名变更** —— `怎么叫` → `调用方式`。
- **`check-docs.mjs` 校验 HTML 链接。**

## 新增

- **英文优先的落地页**，语言选择跨页面保持。
- **三份产物各有详情页**，以卡片链接进入，含介绍与真实示例。
- **标签栏图标**，以及共享的 `style.css` 与 `lang.js`。

## 验证

- `update.ps1`：模拟了脏安装（嵌套 `references/references/` + 残留 `examples/`）—— 更新后 7 个干净文件、无嵌套、备份在同级目录。
- `check-docs`：0 error。新增的 HTML 链接校验已确认能抓到失效链接。
- 本机安装用修复后的脚本从陈旧的 1.2.0 升到了当前版本。

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../LICENSE)。
