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

1. **App bundle binaries** (`app.asar`, `web-dist`, etc.) — most common; may include a compiled command registry array (`{id,name,source}` entries) and autocomplete i18n description keys (see *Full scan* below)
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

If you don't know which commands to verify, scan everything — in **two passes**: enumerate the bundle's own registries first (deterministic), then context-rank raw tokens for whatever the registries miss.

### Pass 1 — enumerate the command registries (preferred)

Hosts that bake commands into their code usually keep them in a registry array carrying identity metadata (`id` / `name` / `source`), a set of composer-autocomplete i18n description keys, and prompt templates that name the command. Enumerate those directly instead of hunting for prose that happens to say "slash command".

**Node.js (verified on the observed machine's ~130 MB OpenChamber `app.asar`, 2026-09):**

```js
const fs = require('fs');
const text = fs.readFileSync('<outer-app bundle/app.asar>').toString('utf8');

// 1. Registry entries: {id:"<ns>:<name>", name:"<name>", source:"<who>"}
const entries = new Map();
for (const m of text.matchAll(/\{id:"([^"]+:[^"]+)",name:"([^"]+)",source:"([^"]+)"/g)) {
  entries.set(m[1], m[2] + ' (source=' + m[3] + ')');
}
for (const [id, info] of entries) console.log(id, info);

// 2. Completeness guard — every raw id:"ns:name" literal. Entries may repeat,
//    sit behind feature flags, or appear with a different field order than the
//    pattern above expects; the raw id set cannot miss them.
//    The character class matches THIS bundle's observed ids — widen it from
//    observed bytes if another host uses uppercase or underscores in ids.
const ids = new Set();
for (const m of text.matchAll(/id:"([a-z][a-z0-9-]*):([a-z0-9-]+)"/g)) ids.add(m[1] + ':' + m[2]);
console.log('unique ids:', ids.size);
```

If the guard set contains ids the entry pattern did not print (guard-only ids), inspect their surrounding bytes before treating them as commands — they may sit behind inactive feature flags, belong to another id namespace, or be unrelated literals.

Cross-check the **union** of three registries — each catches what the others miss:

1. **Registry array** (above) — identity + who registers the entry.
2. **Composer autocomplete i18n keys** — `chat.commandAutocomplete.command.<x>Description`: the key set is complete by construction and proves a command's UI entry exists, but the key name is not always the camelCase form of the typed command (`workspaceReview` → `/workspace-review` holds; `featurePlan` → `/feature-plan` does not — the real command is `/plan-feature`, and the literal `feature-plan` occurs 0 times in the bundle). **The registry `id`/`name` (item 1) is the authoritative typed form**; resolve every key against it before naming a command.
3. **Prompt-template literals** — preset arrays (`command:"/xxx"`) and magicPrompts descriptions (`"Visible user message sent by the /xxx command."`).

A command named by ANY of these registries is real; reconcile the union before writing rows, and always name it by the registry's `id`/`name`. Observed 2026-09 on OpenChamber: registry array = 17 entries, autocomplete keys = 17 (**count**-equal, not name-equal — see the `featurePlan` caveat above), draft-preset `command:"/…"` literals = 8, magicPrompts descriptions = 10 — while the phrase-filtered token scan (Pass 2) surfaced only 8.

**Classify before crediting the host:** a `source:"..."` field says who *registers* an entry, but a host's list may pass the engine's built-ins through unchanged (`init` / `undo` / `redo` / `compact` here — engine built-ins documented elsewhere, not host features). Some registry entries also sit behind feature flags (`...r?[{id:...`) and may be inactive on some machines. Verify each command's usage evidence (toast i18n, prompt template, UI string) before writing its row; if you can't find it, say so.

### Pass 2 — context-ranked token scan (fallback)

If this bundle has no registry arrays — or to catch commands registered outside them — fall back to the token scan: **print verdicts, not the token list**: match in-process, rank candidates by their surrounding bytes, and print only contexted candidates plus a suppressed count. A bare `/xxx` token inside a bundle is almost always a path, route, or vendor string; only the context can tell you it is a slash command.

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

Then judge each printed window: 1-4 will be prose or tests that merely *mention* "slash commands" (false positives); real commands carry registration or i18n context. If zero candidates print, your evidence pattern doesn't match this bundle — widen it from **observed** bytes (registry arrays from Pass 1, menus, `registerCommand`, i18n keys), still printing context windows. Never fall back to dumping the full unique-token list: it floods context with thousands of vendor/path tokens for zero extra evidence. If one candidate needs more context, re-slice around that token specifically.

**PowerShell (slow, prefer Node.js):** the same match-then-context-then-count shape applies, but decoding 60 MB+ files in PowerShell is too slow for a full scan — use the Node.js script above.

> **Warning — Pass 2 is a fallback and it is NOT complete.** The filter keeps a token only when the bytes around it contain the literal phrasing `slash command` / `Slash-Befehl`; real commands whose evidence lacks that exact phrase are silently dropped. Observed on the 2026-09 machine: Pass 2 printed 8 of the 13 host commands — it dropped `/btw`, `/fork`, `/schedule-task` and `/handoff-review` (real `/xxx` literals whose nearby bytes lacked the phrase), and it could never have found `/timeline` at all (the bundle contains no typed `/timeline` literal; its 5 raw hits are GitHub API paths) — only Pass 1's registries cover that case. When Pass 1 found registries, never treat Pass 2's output as the complete set. Even a ranked scan leaves human judgment in the loop — read each printed context before trusting it, and keep the suppressed count visible so nothing disappears silently.

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

## Known failure modes

- Missing plugin-registered slash commands (`/loop`) because the scan stopped at `command/` and never read the plugin dist `hooks/`.
- Treating a phrase-filtered token scan as the complete host-command set — enumerate the bundle's command registry and autocomplete i18n keys instead (see `references/host-commands.md`); a filter keyed on the literal words "slash command" silently drops real commands (this machine lost `/btw`, `/fork`, `/schedule-task` and `/handoff-review` that way; `/timeline` has no typed literal at all, so registry enumeration is the only way to find it).

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
