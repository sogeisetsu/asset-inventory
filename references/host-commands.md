# 外层应用扫描方法

## 如何发现注入命令（必做，普通 grep 会漏二进制）

外层应用注入的斜杠命令可能藏在：
1. **应用包二进制**（`app.asar`、`web-dist` 等）— 最常见
2. **配置文件**（`settings.json` 等）— 较少见
3. **注册表/内部存储**（Electron DIPS/SQLite）— 需要专门工具

**通用原则：** 不要预设任何命令列表。以扫描结果为准。

## 应用包二进制扫描（Electron 类应用）

**原理：** 在二进制文件中搜索 `/xxx` 字面量。用字节匹配，不用正则。

**Node.js（推荐）：**
```js
const b = require('fs').readFileSync('<外层应用包/app.asar>');
// 列出你想验证的命令（从其他来源获知的，或全量扫描）
['/catch-up','/plan-feature','/weigh'].forEach(t =>
  console.log(t, b.indexOf(Buffer.from(t)) >= 0 ? 'FOUND' : 'absent'));
```

**PowerShell：**
```powershell
$b = [IO.File]::ReadAllBytes('<外层应用包/app.asar>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
@('/catch-up','/plan-feature','/weigh') | ForEach-Object {
    "$_ $(if($text.Contains($_)){'FOUND'}else{'absent'})"
}
```

> **注意：** PowerShell 的 `Contains()` 对 60MB+ 文件可能较慢。Node.js 的 `Buffer.indexOf` 更快更可靠。

## 全量扫描（不知道有哪些命令时）

如果不知道该验证哪些命令，可以先全量扫描：

**Node.js：**
```js
const b = require('fs').readFileSync('<外层应用包/app.asar>');
const text = b.toString('utf8');
// 找所有 / 开头的斜杠命令模式
const matches = text.match(/\/[a-z][a-z0-9-]{2,}/g);
if (matches) {
  const unique = [...new Set(matches)].sort();
  console.log(`Found ${unique.length} potential commands:`);
  unique.forEach(cmd => console.log(cmd));
}
```

**PowerShell（慢，建议用 Node.js）：**
```powershell
$b = [IO.File]::ReadAllBytes('<外层应用包/app.asar>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
$matches = [regex]::Matches($text, '/[a-z][a-z0-9]{2,}')
$matches | ForEach-Object { $_.Value } | Sort-Object -Unique
```

> **警告：** 全量扫描会返回大量结果（包括代码注释、字符串常量中的路径等）。需要人工判断哪些是真正的斜杠命令。

## 配置文件扫描（辅助手段）

如果外层应用有配置文件，检查其中是否有命令注册相关的键：

```powershell
$configPath = "$env:USERPROFILE\.config\<外层应用名>\settings.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    $config.PSObject.Properties | Where-Object { 
        $_.Name -match 'prompt|command|slash|magic' 
    } | ForEach-Object {
        Write-Host "$($_.Name): $($_.Value)"
    }
}
```

> **注意：** 配置文件中可能没有命令列表（如 OpenChamber），命令是写死在应用包里的。配置文件扫描只是辅助手段。

## 盘点要求

1. **不要预设任何命令列表** — 每次盘点必须现扫，以扫描结果为准
2. **不要假设外层应用的格式** — 先确认是什么技术栈，再用对应方法
3. **不要假设配置键名** — `magicPrompts` 只是 OpenChamber 的键名，其他外层应用可能用不同的键
4. **来源一律写** `外层应用注入，<具体发现方式>（<路径>）`
5. **找不到就说找不到** — 不编造、不推测

## 常见外层应用（仅供参考）

| 应用 | 技术栈 | 扫描目标 |
|---|---|---|
| OpenChamber | Electron | `app.asar`（命令写死在包里，不在配置文件） |
| 其他 Electron 应用 | Electron | 应用安装目录下的 `app.asar` 或 `resources/` |
| Tauri 应用 | Tauri | `web-dist/`、`src-tauri/` 配置 |
| 原生应用 | 各异 | 安装目录、配置目录、系统注册表 |

> 以上仅为参考，实际盘点时以现查为准。
