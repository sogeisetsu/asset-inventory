<!--
  v1.15.0 发布说明（中文）。GitHub Release 正文只贴英文版。
  英文版：../../docs/release-notes/release-notes-v1.15.0.md
  发布：v1.15.0 —— asset-inventory（sogeisetsu/asset-inventory）
  范围：与上一个 Release tag（v1.14.0）相比的全部变化。
-->

# v1.15.0

宿主命令改为通过枚举外层应用 bundle 自带的注册表来发现，而不是靠"找散文"，盘点因此不再漏掉本该列出的命令。7 张表结构与其它扫描逻辑均未改动。

## 变更

- **宿主命令扫描改为注册表优先** —— `references/host-commands.md` 现在分两遍走。Pass 1 确定性枚举 bundle 的命令注册表：`{id,name,source}` 条目数组、一个不受字段顺序影响的原始 `id` 完备性守卫、输入框自动补全的 i18n 键集，以及提到命令的提示词模板（`command:"/xxx"` 字面量、magicPrompt 描述）。命令的输入形态以注册表 `id`/`name` 为准 —— 自动补全键并不总是它的 camelCase 转写（`workspaceReview` → `/workspace-review` 成立；`featurePlan` → 真实命令是 `/plan-feature`，而 `feature-plan` 在 bundle 里出现 0 次）。原来的词组过滤 token 扫描降级为 Pass 2 兜底手段，并附带明确的"这不是完整集合"警告；`references/checklist.md` 现在要求 Table 4 与三方注册表并集对账。

## 修复

- **词组过滤扫描会静默漏项** —— 它只保留邻近字节含 "slash command" 字样的 `/xxx` token，证据文本不含该词组的真实命令会无声消失。在实测机器上它只报出 13 个宿主命令中的 8 个：`/btw`、`/fork`、`/schedule-task`、`/handoff-review` 被丢弃，而 `/timeline` 根本无法被找到 —— bundle 里没有任何类型的 `/timeline` 字面量（它那 5 处原始命中是 GitHub API 路径），只有注册表枚举能触及它。一张悄悄变短的宿主命令表比承认缺口更糟，所以兜底手段现在会明说这一点，`SKILL.md` 的失败模式清单也记录了这个坑。

## 使用

从落地页（或 README）复制安装提示词发给 AI，运行 `npx skills add sogeisetsu/asset-inventory`，或手动安装到全局/项目级 skills 目录。然后问："列出我的 plugins / skills / commands / MCP / agents"。

## 许可证

MIT —— 见 [LICENSE](../../LICENSE)。
