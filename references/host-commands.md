# 外层应用注入命令扫描方法

## 如何发现（必做，普通 grep 会漏二进制）

用二进制安全搜索扫描外层应用包，找 `/xxx` 字面量：

**Node.js:**
```js
const b = require('fs').readFileSync('<外层应用包/app.asar 或 web-dist>');
['/catch-up','/plan-feature','/craft-goal'].forEach(t =>
  console.log(t, b.indexOf(Buffer.from(t)) >= 0 ? 'FOUND' : 'absent'));
```

**PowerShell:**
```powershell
$b = [IO.File]::ReadAllBytes('<外层应用包/app.asar>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
@('/catch-up','/plan-feature','/craft-goal') | ForEach-Object {
    "$_ $(if($text.Contains($_)){'FOUND'}else{'absent'})"
}
```

> **注意：** 上面的命令列表只是示例，不是完整清单。盘点时应扫描**全量** `/xxx` 字面量，以现扫结果为准。

## 非斜杠 magicPrompts key

`settings.magicPrompts` 段还包含多组**非斜杠** key，盘点时不可遗漏：

| 组 | 示例 key | 说明 |
|---|---|---|
| git | `gitCommitGenerate`, `gitPrGenerate`, `gitConflictResolve` | git 提交/PR/冲突 |
| github | `githubPrReview`, `githubIssueReview`, `githubPrChecksReview` | GitHub PR/Issue/检查审查 |
| linear | `linearIssueReview` | Linear Issue 审查 |
| planning | `planTodo`, `planImprove`, `planImplement` | 任务规划与实施 |
| session | `sessionExplore`, `sessionSummary`, `sessionReview` | 会话级操作 |

**盘点要求**：对外层应用包做二进制安全扫描时，应提取 `settings.magicPrompts` 段的**全量 key**（用 `Object.keys()` 或正则提取），不只限于预设的斜杠命令。每个 key 对应一项外层应用注入命令/能力，来源一律写 `外层应用注入，外层应用 magicPrompts（app.asar）`。**以现扫结果为准。**