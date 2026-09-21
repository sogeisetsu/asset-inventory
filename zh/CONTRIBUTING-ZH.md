# 为 Asset Inventory 贡献

感谢你有兴趣改进这个 skill！以下是贡献方式。

> 本文是英文 [`CONTRIBUTING.md`](../CONTRIBUTING.md) 的中文对读版；两者内容保持同步。

## 快速开始

1. Fork 仓库
2. 建分支：`git checkout -b improve/your-change`
3. 做修改
4. 本地测试：把 `SKILL.md`、`references/`、`examples/` 复制到你的 skills 目录
5. 跑 `/asset-inventory` 验证能正常工作
6. 提交 pull request

## 可以贡献什么

- **Bug 修复** —— 表格逻辑错误、来源分类错误、缺命令
- **新宿主支持** —— 为新外层应用添加路径变量或发现方法
- **文档** —— 更清晰的示例、更好的解释、翻译改进
- **测试** —— skill 由 AI 驱动，但你可以把它拿到不同机器上跑来测试

## 规则

1. **绝不编造资产** —— 每一行都必须来自机器上的真实证据
2. **保持 7 表结构** —— 新类别归入现有表，不新增表
3. **语言跟随用户** —— 输出必须与请求语言一致
4. **来源必须具体** —— "某个插件"不是合法来源；写实际插件名
5. **"干什么"列怎么写** —— 详细：一句话 + 2–4 句展开，基于真实来源描述

## 文件结构

```
asset-inventory/
├── SKILL.md                    # skill 主体（规则与流程）
├── README.md                   # 英文文档
├── README-ZH.md                # 中文文档（按项目约定放在根目录）
├── CHANGELOG.md                # 版本历史（英文）
├── CONTRIBUTING.md             # 贡献指南（英文）
├── LICENSE                     # MIT
├── update.ps1                  # 一键更新脚本
├── references/                 # skill 格式与扫描方法参考
├── examples/                   # 脱敏输出示例
├── assets/                     # 本地 SVG 图标 / banner / 徽章（脚本生成）
├── scripts/
│   ├── check-docs.mjs          # 文档 / 链接 / frontmatter 校验
│   └── generate-assets.mjs     # 重新生成 assets/*.svg
├── docs/                       # GitHub Pages + release notes
└── zh/                         # 除 README-ZH.md 外的所有中文文档
    ├── CHANGELOG-ZH.md
    ├── CONTRIBUTING-ZH.md
    ├── LICENSE-ZH.txt
    ├── release-notes-v1.1.0-ZH.md
    └── release-notes-v1.3.0-ZH.md
```

本地专用的中文指南（`zh/skill-zh.md`、`zh/repo-init-guide-zh.md`）与 `AGENTS.md` 已被 gitignore，永不入库。

## 测试你的改动

1. 本地安装 skill（全局或项目级）
2. 在装了 OpenCode + 插件的机器上跑 `/asset-inventory`
3. 检查 7 张表是否都正确生成
4. 核对 JSON 主键与 Markdown 行一致
5. 跑 `/asset-inventory diff` 与上次输出对比
6. 提 PR 前跑文档校验：

   ```sh
   node scripts/check-docs.mjs
   node --check scripts/*.mjs
   ```

   `check-docs.mjs` 会解析所有相对 Markdown 链接与 `<img src>`、检查 EN/ZH 配对表、告警单侧改动、校验 frontmatter，并标出英文文档中的 CJK 字符。出错时退出码非 0；warning 不失败。

## 术语规范（canonical terms）

为让文案无歧义，统一使用下列术语，避免右列的写法：

| 用 | 不要用 | 原因 |
|-----|------------|-----|
| **outer app**（又称 **host**） | "container"、"wrapper app" | 它指包裹 OpenCode 引擎、注入自有命令的桌面程序（如 OpenChamber）。 |
| **host-injected command** | 指外层应用命令时用 "native command" | "native" 会与 OpenCode 自带的内置命令混淆。 |
| **built-in command / skill** | 把 "native OpenCode" 当名词指代 custom agent | "native OpenCode" 读起来像"OpenCode 自带"，与自定义含义正好相反。 |
| **custom agent** | "user agent"、"private agent" | 用于区分用户/插件定义的 agent 与内置 agent。 |

## 版本管理

遵循 [Semantic Versioning](https://semver.org/)：
- **PATCH**（1.0.x）：Bug 修复、文档改进
- **MINOR**（1.x.0）：新功能、新表类型、新宿主支持
- **MAJOR**（x.0.0）：表结构或输出格式的破坏性变更

更新 `SKILL.md` frontmatter 里的 `metadata.version`，并往 `CHANGELOG.md` 加条目。

## 许可证

贡献即表示你同意你的贡献按 MIT License 授权。
