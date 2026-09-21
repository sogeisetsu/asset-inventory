# Outer-app scan methods

## Path variables (common defaults — verify against the actual host)

| Variable | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| `$OPENCODE_CONFIG` | `~/.config/opencode/` | `$env:USERPROFILE\.config\opencode\` |
| `$PROJECT_DIR` | current working directory | current working directory |
| `$HOST_CONFIG` | `~/.config/<OuterApp>/` | `$env:APPDATA\<OuterApp>\` (OpenChamber was observed at `~/.config/openchamber/`, not `%APPDATA%` — trust what you observe) |
| `$PACKAGE_CACHE` | host-specific plugin cache dir | host-specific plugin cache dir |

> These are typical values, not guarantees. Always confirm against the machine being inventoried.

## How to find injected commands (mandatory — plain grep misses binaries)

Host-injected slash commands may hide in:

1. **App bundle binaries** (`app.asar`, `web-dist`, etc.) — most common
2. **Config files** (`settings.json`, etc.) — less common
3. **Registry / internal storage** (Electron DIPS/SQLite) — needs specialized tools

**General rule:** never assume any command list. Trust the scan result.

## App bundle binary scan (Electron-style apps)

**Principle:** search the binary for `/xxx` literals. Match bytes, not regex.

**Node.js (recommended):**
```js
const b = require('fs').readFileSync('<outer-app bundle/app.asar>');
// List the commands you want to verify (known from other sources, or scan all)
['/catch-up','/plan-feature','/weigh'].forEach(t =>
  console.log(t, b.indexOf(Buffer.from(t)) >= 0 ? 'FOUND' : 'absent'));
```

**PowerShell:**
```powershell
$b = [IO.File]::ReadAllBytes('<outer-app bundle/app.asar>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
@('/catch-up','/plan-feature','/weigh') | ForEach-Object {
    "$_ $(if($text.Contains($_)){'FOUND'}else{'absent'})"
}
```

> **Note:** PowerShell's `Contains()` can be slow on 60MB+ files. Node.js `Buffer.indexOf` is faster and more reliable.

## Full scan (when you don't know which commands exist)

If you don't know which commands to verify, scan everything first:

**Node.js:**
```js
const b = require('fs').readFileSync('<outer-app bundle/app.asar>');
const text = b.toString('utf8');
// Find all slash-command patterns starting with /
const matches = text.match(/\/[a-z][a-z0-9-]{2,}/g);
if (matches) {
  const unique = [...new Set(matches)].sort();
  console.log(`Found ${unique.length} potential commands:`);
  unique.forEach(cmd => console.log(cmd));
}
```

**PowerShell (slow, prefer Node.js):**
```powershell
$b = [IO.File]::ReadAllBytes('<outer-app bundle/app.asar>')
$text = [System.Text.Encoding]::UTF8.GetString($b)
$matches = [regex]::Matches($text, '/[a-z][a-z0-9]{2,}')
$matches | ForEach-Object { $_.Value } | Sort-Object -Unique
```

> **Warning:** a full scan returns a lot of noise (code comments, path strings, etc.). Human judgment is needed to tell which are real slash commands.

## Config-file scan (secondary)

If the outer app has a config file, check it for command-registration keys:

```powershell
$configPath = "$env:USERPROFILE\.config\<OuterApp>\settings.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    $config.PSObject.Properties | Where-Object {
        $_.Name -match 'prompt|command|slash|magic'
    } | ForEach-Object {
        Write-Host "$($_.Name): $($_.Value)"
    }
}
```

> **Note:** the config file may not contain a command list (e.g. OpenChamber) — the commands are baked into the app bundle. A config scan is only a secondary measure.

## Inventory requirements

1. **Never assume any command list** — every inventory must scan fresh and trust the result.
2. **Never assume the outer app's format** — first determine the tech stack, then use the matching method.
3. **Never assume config key names** — `magicPrompts` is only OpenChamber's key name; other outer apps may use different keys.
4. **Always write the source as** `host-injected, <how it was found> (<path>)`.
5. **If you can't find it, say so** — don't fabricate or guess.

## Common outer apps (reference only)

| App | Tech stack | Scan target |
|---|---|---|
| OpenChamber | Electron | `app.asar` (commands are baked into the bundle, not the config file) |
| Other Electron apps | Electron | `app.asar` or `resources/` under the install dir |
| Tauri apps | Tauri | `web-dist/`, `src-tauri/` config |
| Native apps | varies | install dir, config dir, system registry |

> The above is reference only; trust what you observe at inventory time.
