# 外层应用扫描方法

## 如何发现注入命令（必做，普通 grep 会漏二进制）

外层应用可能通过多种方式注入斜杠命令。以下是常见的注入机制：

| 机制 | 说明 | 扫描方法 |
|---|---|---|
| **应用包二进制扫描** | Electron 应用的 `app.asar`、Tauri 的 `web-dist`、或其他打包格式 | 二进制安全搜索 `/xxx` 字面量 |
| **配置文件** | `settings.json`、`magicPrompts` 段、或其他配置键 | 读取并解析配置 |
| **注册表/内部存储** | Electron DIPS/SQLite、系统注册表等 | 需要特定工具读取 |

**通用原则：** 不要假设外层应用的格式。先确认它是什么（Electron？Tauri？原生？），再用对应方法扫描。

## 应用包二进制扫描（Electron 类应用）

用二进制安全搜索扫描外层应用包，找 `/xxx` 字面量：

**Node.js:**
```js
const b = require('fs').readFileSync('<外层应用包路径>');
const commands = []; // 扫描到的命令列表
// 扫描所有 /xxx 模式
const text = b.toString('utf8');
const matches = text.match(/\/[a-z][a-z0-9-]+/g);
if (matches) {
  const unique = [...new Set(matches)];
  unique.forEach(cmd => console.log(cmd));
}
```

**PowerShell:**
```powershell
$b = [IO.File]::ReadAllBytes('<外层应用包路径>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
# 扫描所有 /xxx 模式
$matches = [regex]::Matches($text, '/[a-z][a-z0-9-]+')
$unique = $matches | ForEach-Object { $_.Value } | Sort-Object -Unique
$unique | ForEach-Object { Write-Host $_ }
```

> **注意：** 上面的正则只是示例。实际扫描时应根据外层应用的具体格式调整。关键是**不要预设任何命令列表**——以现扫结果为准。

## 配置文件扫描

如果外层应用有配置文件（如 `settings.json`），检查其中是否有命令注册相关的键：

```powershell
$configPath = "$env:USERPROFILE\.config\<外层应用名>\settings.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    # 检查是否有 magicPrompts、commands、slashCommands 等键
    $config.PSObject.Properties | Where-Object { 
        $_.Name -match 'prompt|command|slash|magic' 
    } | ForEach-Object {
        Write-Host "$($_.Name): $($_.Value)"
    }
}
```

## 盘点要求

1. **不要预设任何命令列表** — 每次盘点必须现扫，以扫描结果为准
2. **不要假设外层应用的格式** — 先确认是什么技术栈，再用对应方法
3. **不要假设配置键名** — `magicPrompts` 只是 OpenChamber 的键名，其他外层应用可能用不同的键
4. **来源一律写** `外层应用注入，<具体发现方式>（<路径>）`
5. **找不到就说找不到** — 不编造、不推测

## 常见外层应用（仅供参考）

| 应用 | 技术栈 | 可能的扫描目标 |
|---|---|---|
| OpenChamber | Electron | `app.asar`、`~/.config/openchamber/settings.json` |
| 其他 Electron 应用 | Electron | 应用安装目录下的 `app.asar` 或 `resources/` |
| Tauri 应用 | Tauri | `web-dist/`、`src-tauri/` 配置 |
| 原生应用 | 各异 | 安装目录、配置目录、系统注册表 |

> 以上仅为参考，实际盘点时以现查为准。
