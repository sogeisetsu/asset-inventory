#!/usr/bin/env pwsh
# asset-inventory — one-command update
# Usage:  cd asset-inventory && pwsh ./update.ps1
#   or:   pwsh ./update.ps1 -Target /path/to/project
#
# What it does:
#   1. Pulls latest from the repo (skips if the repo dir is dirty)
#   2. Backs up existing files (if version changes)
#   3. Copies SKILL.md + references/ to the install location
#   4. Reports before/after version
#
# Options:
#   -Target <dir>   Update a project-scoped install instead of the global one
#   -NoBackup       Skip the pre-overwrite backup
#   -DryRun         Preview what would be copied; change nothing
#   -Help           Show this help and exit

param(
  [string]$Target,   # Optional: project-scoped target dir (e.g. /path/to/my-project/.opencode/skills/asset-inventory)
  [switch]$NoBackup, # Skip backup step
  [switch]$DryRun,   # Preview what would be copied, change nothing
  [switch]$Help      # Show usage and exit
)

if ($Help) {
  @'
asset-inventory — one-command update

Usage:
  pwsh ./update.ps1                       Update the global install
  pwsh ./update.ps1 -Target <dir>         Update a project-scoped install
  pwsh ./update.ps1 -DryRun               Preview without writing
  pwsh ./update.ps1 -NoBackup             Skip the backup step

It pulls the latest repo (unless the working tree is dirty), backs up any
existing install when the version changes, copies SKILL.md and references/
to the target, and reports the before/after version.

Install location:
  Global          ~/.config/opencode/skills/asset-inventory/
                  (Windows: $env:USERPROFILE\.config\opencode\skills\asset-inventory\)
  Project-scoped  <project-root>/.opencode/skills/asset-inventory/   (pass -Target)
'@ | Write-Host
  exit 0
}

$ErrorActionPreference = "Stop"

# --- locate repo root (where SKILL.md lives) ---
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillSource = Join-Path $RepoRoot "SKILL.md"
if (-not (Test-Path $SkillSource)) {
  Write-Error "SKILL.md not found next to this script. Run this from the asset-inventory repo root."
  exit 1
}

# --- read new version from frontmatter ---
$newVersion = ""
$frontmatter = Get-Content $SkillSource -Head 15
foreach ($line in $frontmatter) {
  if ($line -match '^\s*version:\s*(.+)\s*$') {
    $newVersion = $matches[1].Trim()
    break
  }
}
if ($newVersion) {
  Write-Host "`n  New version: $newVersion" -ForegroundColor Green
} else {
  Write-Host "`n  (no version declared in frontmatter)" -ForegroundColor DarkGray
}

# --- pull latest ---
Write-Host "`n> git pull..." -ForegroundColor Cyan
Set-Location $RepoRoot
if (Test-Path (Join-Path $RepoRoot ".git")) {
  $status = git status --porcelain 2>$null
  if ($status) {
    Write-Warning "Repo has uncommitted changes — skipping git pull. Commit or stash first."
  } else {
    git pull --ff-only 2>&1 | ForEach-Object { Write-Host "  $_" }
  }
} else {
  Write-Warning "Not a git repo — skipping pull."
}

# --- determine install target ---
$runtimeFiles = @("SKILL.md", "references")

if ($Target) {
  $installDir = $Target
} else {
  # Auto-detect: check global install first
  if ($IsWindows -or $env:OS -eq "Windows_NT") {
    $globalDir = Join-Path $env:USERPROFILE ".config\opencode\skills\asset-inventory"
  } else {
    $globalDir = Join-Path $env:HOME ".config/opencode/skills/asset-inventory"
  }
  if (Test-Path $globalDir) {
    $installDir = $globalDir
  } else {
    Write-Host "`nNo global install found at $globalDir" -ForegroundColor Yellow
    Write-Host "To install, see README.md. To update a project-scoped install, pass -Target." -ForegroundColor Yellow
    exit 1
  }
}

Write-Host "`n> Updating: $installDir" -ForegroundColor Cyan

if ($DryRun) {
  Write-Host "`n  DRY RUN — no files will be changed." -ForegroundColor Yellow
  if ($newVersion) { Write-Host "  Would install version: $newVersion" }
  Write-Host "  Target: $installDir" -ForegroundColor DarkGray
  foreach ($item in $runtimeFiles) {
    $src = Join-Path $RepoRoot $item
    if (Test-Path $src) {
      $kind = if (Test-Path $src -PathType Container) { "dir " } else { "file" }
      Write-Host "  would copy [$kind] $item"
    } else {
      Write-Host "  would skip (missing source): $item" -ForegroundColor Yellow
    }
  }
  Write-Host "`n  Dry run complete — nothing was written. Re-run without -DryRun to apply." -ForegroundColor Green
  exit 0
}

# --- ensure target directory exists ---
if (-not (Test-Path $installDir)) {
  Write-Host "  Creating target directory: $installDir" -ForegroundColor DarkGray
  New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

# --- read old version ---
$oldVersion = ""
$oldSkill = Join-Path $installDir "SKILL.md"
if (Test-Path $oldSkill) {
  $oldFM = Get-Content $oldSkill -Head 15
  foreach ($line in $oldFM) {
    if ($line -match '^\s*version:\s*(.+)\s*$') {
      $oldVersion = $matches[1].Trim()
      break
    }
  }
  if ($oldVersion) {
    Write-Host "  Old version: $oldVersion"
  }

  # --- backup existing files ---
  if (-not $NoBackup -and $oldVersion -and $oldVersion -ne $newVersion) {
    # Backups live NEXT TO the install dir, never inside it — a backup inside the
    # skill dir would be copied into the skill and re-nested on the next update.
    $backupRoot = Split-Path -Parent $installDir
    $backupDir = Join-Path $backupRoot "$(Split-Path -Leaf $installDir).backup-$oldVersion-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Write-Host "  Backing up to: $backupDir" -ForegroundColor DarkGray
    foreach ($item in $runtimeFiles) {
      $src = Join-Path $installDir $item
      if (Test-Path $src) {
        $dst = Join-Path $backupDir $item
        if (Test-Path $dst) { Remove-Item -Recurse -Force -Path $dst }
        Copy-Item -Recurse -Force -Path $src -Destination $dst
      }
    }
    Write-Host "  Backup complete." -ForegroundColor DarkGray
  }
}

# --- copy files ---
# Note: Copy-Item -Recurse into an existing directory nests the source inside it
# (references/references/...). Remove the target first, then copy, so repeated
# updates never accumulate nested duplicates.
foreach ($item in $runtimeFiles) {
  $src = Join-Path $RepoRoot $item
  $dst = Join-Path $installDir $item
  if (-not (Test-Path $src)) {
    Write-Warning "Source not found: $src — skipping"
    continue
  }
  if (Test-Path $dst) {
    Remove-Item -Recurse -Force -Path $dst
  }
  if (Test-Path $src -PathType Container) {
    Copy-Item -Recurse -Force -Path $src -Destination $dst
  } else {
    Copy-Item -Force -Path $src -Destination $dst
  }
  Write-Host "  Copied: $item"
}

# --- prune stale runtime dirs (e.g. a directory that is no longer shipped) ---
$knownRuntime = @('SKILL.md', 'references')
$staleCandidates = @('examples')
foreach ($stale in $staleCandidates) {
  $stalePath = Join-Path $installDir $stale
  if ((Test-Path $stalePath) -and ($knownRuntime -notcontains $stale)) {
    Write-Host "  Removing stale item no longer shipped: $stale" -ForegroundColor DarkGray
    Remove-Item -Recurse -Force -Path $stalePath
  }
}

# --- verify ---
$ok = $true
foreach ($item in $runtimeFiles) {
  if (-not (Test-Path (Join-Path $installDir $item))) {
    Write-Error "Verification failed: $item missing"
    $ok = $false
  }
}

if ($ok) {
  if ($newVersion -and $oldVersion -ne $newVersion) {
    Write-Host "`n  Updated: $oldVersion -> $newVersion" -ForegroundColor Green
  } elseif ($newVersion) {
    Write-Host "`n  Already up to date ($newVersion)" -ForegroundColor Green
  } else {
    Write-Host "`n  Done (no version tag)" -ForegroundColor Green
  }
} else {
  Write-Error "Update failed — some files missing after copy."
  exit 1
}
