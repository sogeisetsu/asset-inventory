# AGENTS.md

## 这是什么

一个 OpenCode Skill（`asset-inventory`），盘点机器上的插件、Skill、命令、MCP 服务器、Agent 和外层应用能力。输出 7 张 Markdown 表 + JSON + 使用指南。

**这不是代码项目。** 没有测试、没有构建、没有 lint。"代码"就是 SKILL.md——一份指导 AI agent 干活的提示词。

## 关键文件

- `SKILL.md` — skill 本身（规则、流程、质量清单）。**唯一真相源。**
- `references/` — 格式示例、扫描方法、故障排除。辅助文档，不是事实。
- `examples/` — 脱敏输出示例。
- `update.ps1` — 一键更新脚本（复制运行时文件到安装位置）。
- `output/` — **gitignored**。skill 运行时生成的文件放这里。

## 核心哲学

**永远现扫，永不预设。** skill 的第一原则是"在这台机器上验证一切"。这意味着：
- 不要在 reference 文件里加硬编码的命令/资产列表
- 不要假设有什么——扫描会发现它
- `references/host-commands.md` 提供的是扫描*方法*，不是命令列表

## 工作流

1. 改 `SKILL.md` — 规则/行为变更
2. 改 `references/` — 格式/方法文档
3. 更新 `CHANGELOG.md` — 在 `[1.3.0] - Unreleased` 下加条目（发布时改版本号）
4. 跑 `pwsh ./update.ps1` 部署到安装位置
5. 版本号在 SKILL.md frontmatter（`version: x.y.z`），CHANGELOG 必须同步

## 坑

- `output/` 不入库——别提交生成的文件
- 外层应用扫描必须适配所有宿主（Electron、Tauri、原生），不只是 OpenChamber
- skill 是双语的（CN/EN）——输出跟随用户语言
- Provenance 格式也必须跟随输出语言
