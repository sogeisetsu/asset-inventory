<!--
  v1.9.0 release notes（中文）。英文版见 ../docs/release-notes-v1.9.0.md
  Release: v1.9.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.9.0

三个产物详情页现在把示例**从样本文件渲染**出来，而不再是裸代码块 —— 并且样本集是双语的。

## 新增

- **`scripts/build-sample-pages.mjs`** —— 把 `docs/samples/` 渲染进 `inventory.html`（Markdown 表格）、`usage-guide.html`（完整 Markdown）、`asset-inventory-json.html`（美化 JSON）。CI 以 `--check` 运行，页面过期会导致构建失败。
- **英文样本** 放 `docs/samples/`；中文样本移入 `docs/samples/zh/`。没有对应翻译样本的语言回退英文。

## 变更

- **示例改为渲染效果** —— 详情页不再倾倒裸 Markdown 或挤成一行的 JSON。`usage-guide.html` 渲染标题与表格，`asset-inventory-json.html` 每个键一行、带缩进，`inventory.html` 渲染表格。
- **人类可读的页面标题** —— `<h1>` 与标签标题已本地化，不再是裸文件名。

## 验证

- `build-sample-pages.mjs --check`：3 个页面均为最新。
- `check-docs`：0 error。
- 在浏览器中检查渲染结果：JSON 带缩进、Markdown 渲染为 HTML、未翻译语言回退英文样本。

## 许可证

MIT — 见 [LICENSE](../LICENSE)。
