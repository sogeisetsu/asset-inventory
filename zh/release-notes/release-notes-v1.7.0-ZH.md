<!--
  v1.7.0 release notes（中文）。英文版见 ../../docs/release-notes/release-notes-v1.7.0.md
  Release: v1.7.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.7.0

七种语言、Material 风格且示例已渲染的落地页，以及从 README 中拆分出来的长文文档。盘点逻辑与 7 表结构不变。

## Added

- **七语言文档站** —— 落地页与所有详情页支持英、中、日、韩、俄、阿拉伯（RTL）、西七种语言；选择跨页面保持。
- **多语言 README** —— `README-JA.md`、`README-KO.md`、`README-RU.md`、`README-AR.md`、`README-ES.md`，整套互链。
- **`docs/guides/`** —— 长文文档，从 README 链接进入。
- **`docs/samples/`** —— 公开的示例产物，用户运行前就能看到最终会拿到什么。
- **Material Design 3 重构** —— 文档站改为 MD3 风格。
- **`check-docs` 新增校验** —— HTML 链接校验，以及七份 README 的存在性与互链校验。

## Changed

- **README 精简**为简洁、带 emoji 的落地页；细节移入 `docs/guides/`。
- **落地页示例改为渲染效果** —— 盘点示例以真实表格、JSON 逐行展示，不再是裸代码块。
- **`CONTRIBUTING`（中英）** 现写明提交粒度规则与 tag/release 策略。

## Fixed

- **复制按钮反馈**在英文界面下不再硬编码中文。

## 验证

- `check-docs`：35 个 markdown 文件，0 error。
- 新校验均确认能被破坏触发（缺 README、HTML 链接失效）。
- 七种语言在真实浏览器中逐一验证切换，含阿拉伯语 RTL。

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../../LICENSE)。
