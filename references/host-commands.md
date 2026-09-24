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

If you don't know which commands to verify, scan everything first — but **print verdicts, not the token list**: match in-process, rank candidates by their surrounding bytes, and print only contexted candidates plus a suppressed count. A bare `/xxx` token inside a bundle is almost always a path, route, or vendor string; only the context can tell you it is a slash command.

**Node.js (pattern checked on a ~130 MB Electron `app.asar`: 6125 raw unique tokens → 12 contexted candidates, 8 real commands among them):**

```js
const fs = require('fs');
const b = fs.readFileSync('<outer-app bundle/app.asar>');
const text = b.toString('utf8');
const hits = new Map();
// Check EVERY occurrence, not just the first — a command's first appearance may sit in unrelated code.
for (const m of text.matchAll(/\/[a-z][a-z0-9-]*[a-z0-9]/g)) {
  const ctx = text.slice(Math.max(0, m.index - 80), m.index + 120).replace(/[\x00-\x1f]/g, ' ');
  // Strong evidence = the bundle itself describes the token as a slash command.
  // Adapt the pattern to the phrasings you actually observe in THIS bundle (here: German + English
  // i18n strings), never to a command list remembered from another machine or another app.
  if (/-Slash-Befehl|slash command/i.test(ctx) && !hits.has(m[0])) hits.set(m[0], ctx);
}
console.log(`printed: ${hits.size} candidates (rest suppressed)`);
for (const [t, ctx] of hits) console.log(t, '::', ctx);
```

Then judge each printed window: 1-4 will be prose or tests that merely *mention* "slash commands" (false positives); real commands carry registration or i18n context. If zero candidates print, your evidence pattern doesn't match this bundle — widen it from **observed** bytes (menus, `registerCommand`, i18n keys), still printing context windows. Never fall back to dumping the full unique-token list: it floods context with thousands of vendor/path tokens for zero extra evidence. If one candidate needs more context, re-slice around that token specifically.

**PowerShell (slow, prefer Node.js):** the same match-then-context-then-count shape applies, but decoding 60 MB+ files in PowerShell is too slow for a full scan — use the Node.js script above.

> **Warning:** even a ranked scan leaves human judgment in the loop — read each printed context before trusting it, and keep the suppressed count visible so nothing disappears silently.

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

> Trust what you observe at inventory time.
