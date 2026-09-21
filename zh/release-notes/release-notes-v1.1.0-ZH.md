<!--
  v1.1.0 release notes（中文）。英文版见 ../../docs/release-notes/release-notes-v1.1.0.md
  Release: v1.1.0 — asset-inventory (sogeisetsu/asset-inventory)
-->

# v1.1.0

本次发布聚焦文档可读性、skill 健壮性与新增落地页。盘点逻辑与 7 表结构不变。

## 变更亮点

- **重写 README（EN + ZH）** — Features 改写成大白话；补三份文件、状态标记随输出语言、差异模式到特性列表；Install 段新增全局 vs 项目级选择表 + 双平台命令；AI 自动安装提示润色（含 Windows 路径）；新增 Verify 段；中英 9 节逐节对应。
- **SKILL.md 整改** — Output 段明确三份产出；状态标记随输出语言（中文输出用中文标记，英文输出用英文标记）；插件证据源按宿主可重映射（新增 manifest / `package.json` 等替代源）；路径变量补 macOS/Linux 与 Windows 默认值；宿主设置若存于 Electron 内部存储则表注说明而非编造；agent 配置名与实际名不符时以 agent list 为准；删 Quality Bar 重复项。
- **references/host-commands.md** — 注明命令清单为 2026-09 快照；明确盘点时须现扫全量 `magicPrompts` key（不只限于列出的 11 个）；补非斜杠 key 说明（git / github / linear / planning / session 组）。
- **新增 GitHub Pages 落地页**（`docs/index.html`）— 单文件、无外部依赖；中英双语切换；首屏复制安装块（复制给 AI 即自动装）；四个板块（功能、为什么、适用场景、安装方式）。
- **新增 .ignore** — `!.slim/deepwork/**` 不入库但可被 OpenCode 读取。

## 修复 / 一致性

- 状态标记（`✅可用` / `❌已禁用` / `📦仅货架未装` / `🚫不存在`）现随输出语言变化，不再中文硬编码。
- 插件发现不再假设单一固定包缓存路径；缓存缺失时回退到 manifest 与 `package.json`。
- 宿主注入命令盘点现扫描全量 `magicPrompts` key，不再仅限于 11 个已文档化的斜杠命令。

## 使用方式

从落地页（或 README）复制安装提示发给 AI 助手即可自动安装；或手动装到全局 / 项目级 skills 目录。然后问："列一下我有什么插件/Skill/命令/MCP/Agent"。

## 许可证

MIT — 见 [LICENSE](../../LICENSE)。
