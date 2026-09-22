# Install & update 📦

> Detailed companion to the main [README](../../README.md).

## Recommended: install globally 🌍

This skill is a general tool for understanding and cleaning up your OpenCode setup — it is not tied to any single project. Install it once in the global skills directory and forget about it.

- **Why global:** one copy to install, update, and keep in sync (instead of a separate copy per project), and it is available everywhere.
- **What you get:** after a global install, `/asset-inventory` (and the natural-language triggers) works in **every** project and session. Output still lands in whichever project you run it in — even installed globally, the skill writes to that project's `output/`, never to the skill's own folder.

Choose **project-scoped** only if you specifically want the skill to live inside one repository (e.g. to share it with that repo's collaborators through version control).

## 🚀 Steps

**Step 1 — get the repository locally.** Clone it:

```sh
git clone https://github.com/sogeisetsu/asset-inventory.git
```

or download **Code → Download ZIP** from the repository's main page and unzip it — but never a ZIP from the **Releases** page; release archives can be outdated.

**Step 2 — copy only two things** (`SKILL.md` and `references/`) to the target:

| Scope | When to choose | Target |
|---|---|---|
| **Global** | Available in every project | `~/.config/opencode/skills/` (Windows: `$env:USERPROFILE\.config\opencode\skills\`) |
| **Project-scoped** | Only for one project | `<project-root>/.opencode/skills/` |

```sh
# Global (macOS / Linux)
mkdir -p ~/.config/opencode/skills/asset-inventory
cp -r SKILL.md references ~/.config/opencode/skills/asset-inventory/
```

```powershell
# Global (Windows PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills\asset-inventory"
Copy-Item -Recurse SKILL.md, references -Destination "$env:USERPROFILE\.config\opencode\skills\asset-inventory\"
```

## 🔄 Updating

Already installed? Pull the latest and overwrite:

```sh
cd asset-inventory && pwsh ./update.ps1
```

The script auto-detects where your install lives (global `~/.config/opencode/skills/asset-inventory/` or a project-scoped directory), does `git pull`, backs up the old files next to the install directory, and copies over the two runtime items. It reports the before/after version so you can confirm the update took effect.

- **Dry run:** `pwsh ./update.ps1 -DryRun` previews what would be copied, changing nothing.
- **Project-scoped:** pass the target — `pwsh ./update.ps1 -Target /path/to/your-project/.opencode/skills/asset-inventory`
- **No backup:** `-NoBackup` skips the backup step.
- **Help:** `pwsh ./update.ps1 -Help`

## 🤖 Auto-install via AI

Paste the install prompt from the [landing page](https://sogeisetsu.github.io/asset-inventory/) (it is localized in English, Chinese, Japanese, Korean, Russian, Arabic, and Spanish), or use the one in the main README.
