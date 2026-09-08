# Troubleshooting

## 常见问题

### Skill 找不到（`/asset-inventory` 命令不出现）

1. 检查安装位置：
   - 全局：`~/.config/opencode/skills/asset-inventory/SKILL.md` 应存在
   - 项目级：`<项目根目录>/.opencode/skills/asset-inventory/SKILL.md` 应存在
2. 检查 SKILL.md frontmatter 是否完整（`name`、`version`、`description` 字段）
3. 重启 OpenCode 后重试

### 输出未生成（`output/` 目录为空）

1. 检查当前目录是否有写权限
2. 检查 `output/` 目录是否存在（不存在会自动创建）
3. 如果是精扫模式（如 `/asset-inventory mcp`），确认参数拼写正确

### 盘点结果不全

1. 插件相关：检查 `$OPENCODE_CONFIG/opencode.jsonc` 的 `plugin[]` 配置
2. 外层应用命令：需要对 `app.asar` 做二进制安全扫描（见 `references/host-commands.md`）
3. Agent：运行 `opencode agent list` 和 `opencode --pure agent list` 对比结果
4. MCP：检查 `opencode.jsonc` 的 `mcp` 配置段

### 版本号读取失败

`update.ps1` 从 SKILL.md frontmatter 的 `version:` 字段读取版本号。如果读不到：
1. 检查 frontmatter 格式（必须是 `version: x.y.z`，注意冒号后有空格）
2. 检查文件编码（UTF-8 with BOM 也可，但纯 ASCII 最稳）

### Diff 模式不工作

1. 必须先有上一次的 `asset-inventory.json`
2. 把 JSON 内容贴给 skill（不要只贴文件路径）
3. 只对比 `table` + `name` 作为主键

### 多语言输出不一致

1. 语言跟随用户最后一次输入的语言
2. Provenance 行也应跟随输出语言（中文输出用中文 Provenance，英文用英文）
3. 表头、状态标记、单元格内容全部跟随用户语言
