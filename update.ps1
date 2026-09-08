#!/usr/bin/env pwsh
# asset-inventory — one-command update
# Usage:  cd asset-inventory && pwsh ./update.ps1
#   or:   pwsh ./update.ps1 -Target /path/to/project
#
# What it does:
#   1. Pulls latest from the repo (skips if the repo dir is dirty)
#   2. Backs up existing SKILL.md (if exists)
#   3. Copies SKILL.md + references/ + examples/ to the install location
#   4. Reports before/after version

param(
  [string]$Target,   # Optional: project-scoped target dir (e.g. /path/to/my-project/.opencode/skills/asset-inventory)
  [switch]$NoBackup  # Skip backup step
)

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
$runtimeFiles = @("SKILL.md", "references", "examples")

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
    $backupDir = Join-Path $installDir "backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "  Backing up to: $backupDir" -ForegroundColor DarkGray
    foreach ($item in $runtimeFiles) {
      $src = Join-Path $installDir $item
      if (Test-Path $src) {
        $dst = Join-Path $backupDir $item
        Copy-Item -Recurse -Force -Path $src -Destination $dst
      }
    }
    Write-Host "  Backup complete." -ForegroundColor DarkGray
  }
}

# --- copy files ---
foreach ($item in $runtimeFiles) {
  $src = Join-Path $RepoRoot $item
  $dst = Join-Path $installDir $item
  if (-not (Test-Path $src)) {
    Write-Warning "Source not found: $src — skipping"
    continue
  }
  if (Test-Path $src -PathType Container) {
    Copy-Item -Recurse -Force -Path $src -Destination $dst
  } else {
    Copy-Item -Force -Path $src -Destination $dst
  }
  Write-Host "  Copied: $item"
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
