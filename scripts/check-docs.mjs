#!/usr/bin/env node
// check-docs.mjs - validate this repository's documentation.
//
// Checks:
//   1. Relative Markdown links and <img src> resolve.
//   2. Every EN/ZH document pair exists.
//   3. One-sided changes: tracked files via `git status`; gitignored local
//      copies via mtime.
//   4. Frontmatter: delimiters complete, top-level keys well formed,
//      unquoted ": " values warned (they silently break YAML).
//   5. English docs contain no CJK characters (Chinese docs live under zh/
//      or end with -ZH.md; local AGENTS.md is exempt).
//   6. Version consistency: the SKILL.md frontmatter metadata.version matches
//      the top release heading in CHANGELOG.md and zh/CHANGELOG-ZH.md.
//   7. Glossary structure: every language block in references/glossary.json
//      exposes the same key set as the `en` block.
//
// Usage: node scripts/check-docs.mjs
// Exits non-zero on errors. Warnings do not fail.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Directories never scanned for docs.
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '.opencode',
  '.openchamber',
  'output',
  'interview',
  '.slim',
  'vendor',
]);

// EN <-> ZH document pairs that must always travel together.
const PAIRS = [
  ['README.md', 'README-ZH.md'],
  ['CONTRIBUTING.md', 'zh/CONTRIBUTING-ZH.md'],
  ['CHANGELOG.md', 'zh/CHANGELOG-ZH.md'],
  ['docs/release-notes-v1.1.0.md', 'zh/release-notes-v1.1.0-ZH.md'],
  ['docs/release-notes-v1.3.0.md', 'zh/release-notes-v1.3.0-ZH.md'],
];

// Gitignored local copies compared by mtime (source, local copy).
const LOCAL_PAIRS = [['SKILL.md', 'zh/skill-zh.md']];

// Local-only files that are deliberately Chinese and never published.
const LOCAL_ONLY_DOCS = ['AGENTS.md'];

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...(await walk(abs)));
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
  return out;
}

function stripFences(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');
}

const LINK_RE = /\]\(([^()\s]+)\)/g;
const IMG_RE = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;
const EXTERNAL = /^(https?:|mailto:|tel:|data:|#|\/\/)/i;

async function checkLinks(file, raw) {
  const text = stripFences(raw);
  const targets = [];
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text))) targets.push(m[1]);
  IMG_RE.lastIndex = 0;
  while ((m = IMG_RE.exec(text))) targets.push(m[1]);

  for (const rawTarget of targets) {
    const target = rawTarget.trim();
    if (!target || EXTERNAL.test(target)) continue;
    const noAnchor = target.split('#')[0].split('?')[0];
    if (!noAnchor) continue;
    let decoded = noAnchor;
    try {
      decoded = decodeURIComponent(noAnchor);
    } catch {
      // Keep the raw form if it is not valid URL encoding.
    }
    const abs = path.resolve(path.dirname(file), decoded);
    if (!(await exists(abs))) {
      err(`broken link in ${rel(file)}: ${target}`);
    }
  }
}

function checkFrontmatter(file, raw) {
  const lines = raw.split(/\r?\n/);
  if ((lines[0] || '').trim() !== '---') return;
  let close = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      close = i;
      break;
    }
  }
  if (close === -1) {
    err(`unterminated frontmatter in ${rel(file)}`);
    return;
  }
  for (let i = 1; i < close; i += 1) {
    const line = lines[i];
    if (line.trim() === '' || /^\s/.test(line)) continue; // blank or nested key
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      warn(`unusual frontmatter line in ${rel(file)}:${i + 1}: ${line.trim()}`);
      continue;
    }
    const value = match[2].trim();
    const quoted = /^".*"$/.test(value) || /^'.*'$/.test(value);
    if (value.includes(': ') && !quoted) {
      warn(`unquoted ": " in frontmatter value at ${rel(file)}:${i + 1} - may break YAML`);
    }
  }
}

const CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

function isEnglishDoc(relPath) {
  if (relPath.startsWith('zh/')) return false;
  if (/(^|\/)[^/]*-ZH\.md$/i.test(relPath)) return false;
  if (LOCAL_ONLY_DOCS.includes(relPath)) return false;
  return relPath.endsWith('.md');
}

function changedFiles() {
  try {
    const out = execFileSync('git', ['status', '--porcelain'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    const set = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line) continue;
      let p = line.slice(3).trim();
      if (p.includes(' -> ')) p = p.split(' -> ')[1];
      p = p.replace(/^"|"$/g, '').replace(/\\/g, '/');
      set.add(p);
    }
    return set;
  } catch {
    return null;
  }
}

async function checkVersionConsistency() {
  // 6. Version must agree across SKILL.md frontmatter and both CHANGELOG tops.
  const skillPath = path.join(ROOT, 'SKILL.md');
  if (!(await exists(skillPath))) {
    err('version check: SKILL.md not found');
    return;
  }
  const skillRaw = await fs.readFile(skillPath, 'utf8');
  const skillLines = skillRaw.split(/\r?\n/);
  let skillVersion = null;
  for (let i = 0; i < skillLines.length; i += 1) {
    const m = skillLines[i].match(/^\s+version:\s*(.+?)\s*$/);
    if (m) {
      skillVersion = m[1].replace(/^["']|["']$/g, '');
      break;
    }
    if (i > 15) break;
  }
  if (!skillVersion) {
    warn('version check: no metadata.version found in SKILL.md frontmatter');
    return;
  }

  const changelogs = ['CHANGELOG.md', 'zh/CHANGELOG-ZH.md'];
  for (const relPath of changelogs) {
    const abs = path.join(ROOT, relPath);
    if (!(await exists(abs))) {
      err(`version check: missing ${relPath}`);
      continue;
    }
    const raw = await fs.readFile(abs, 'utf8');
    const m = raw.match(/^##\s*\[([^\]]+)\]/m);
    if (!m) {
      err(`version check: no release heading in ${relPath}`);
      continue;
    }
    const changelogVersion = m[1].trim();
    if (changelogVersion !== skillVersion) {
      err(
        `version mismatch: SKILL.md has ${skillVersion} but ${relPath} top heading is ${changelogVersion}`,
      );
    }
  }
}

async function checkGlossaryStructure() {
  // 7. Every language block must expose the same key set as `en`.
  const glossaryPath = path.join(ROOT, 'references', 'glossary.json');
  if (!(await exists(glossaryPath))) {
    err('glossary check: references/glossary.json not found');
    return;
  }
  let data;
  try {
    data = JSON.parse(await fs.readFile(glossaryPath, 'utf8'));
  } catch (e) {
    err(`glossary check: invalid JSON in references/glossary.json (${e.message})`);
    return;
  }
  const languages = data && typeof data === 'object' ? data.languages : null;
  if (!languages || typeof languages !== 'object') {
    err('glossary check: missing top-level "languages" object');
    return;
  }
  const keys = Object.keys(languages);
  if (keys.length === 0) {
    err('glossary check: "languages" has no entries');
    return;
  }
  const reference = keys.includes('en') ? 'en' : keys[0];
  const referenceKeys = new Set(Object.keys(languages[reference] || {}));
  if (!keys.includes('en')) {
    warn(`glossary check: no "en" block; using "${reference}" as the reference key set`);
  }
  for (const lang of keys) {
    const block = languages[lang];
    if (!block || typeof block !== 'object') {
      err(`glossary check: language block "${lang}" is not an object`);
      continue;
    }
    const langKeys = new Set(Object.keys(block));
    const missing = [...referenceKeys].filter((k) => !langKeys.has(k));
    const extra = [...langKeys].filter((k) => !referenceKeys.has(k));
    if (missing.length > 0) {
      err(`glossary check: "${lang}" is missing key(s): ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
      err(`glossary check: "${lang}" has key(s) not in "${reference}": ${extra.join(', ')}`);
    }
  }
}

async function main() {
  const allFiles = await walk(ROOT);
  const mdFiles = allFiles.filter((f) => f.endsWith('.md'));

  // 1, 4, 5
  for (const file of mdFiles) {
    const raw = await fs.readFile(file, 'utf8');
    await checkLinks(file, raw);
    checkFrontmatter(file, raw);
    if (isEnglishDoc(rel(file)) && CJK.test(raw)) {
      const count = (raw.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
      err(`CJK characters found in English doc ${rel(file)} (${count})`);
    }
  }

  // 2
  for (const [en, zh] of PAIRS) {
    for (const p of [en, zh]) {
      if (!(await exists(path.join(ROOT, p)))) {
        err(`missing EN/ZH pair file: ${p}`);
      }
    }
  }

  // 3a: tracked one-sided changes
  const changed = changedFiles();
  if (changed) {
    for (const [en, zh] of PAIRS) {
      const enChanged = changed.has(en);
      const zhChanged = changed.has(zh);
      if (enChanged !== zhChanged) {
        warn(`one-sided change: ${enChanged ? en : zh} changed without its pair`);
      }
    }
  } else {
    warn('git status unavailable - skipped one-sided change check');
  }

  // 3b: gitignored local copies via mtime
  for (const [source, local] of LOCAL_PAIRS) {
    const localPath = path.join(ROOT, local);
    if (!(await exists(localPath))) continue;
    const [a, b] = await Promise.all([
      fs.stat(path.join(ROOT, source)),
      fs.stat(localPath),
    ]);
    if (Math.abs(a.mtimeMs - b.mtimeMs) > 24 * 60 * 60 * 1000) {
      warn(`local copy may be stale: ${local} (source: ${source})`);
    }
  }

  // 6, 7
  await checkVersionConsistency();
  await checkGlossaryStructure();

  for (const w of warnings) console.warn(`warning: ${w}`);
  for (const e of errors) console.error(`error: ${e}`);
  console.log(`\ncheck-docs: ${mdFiles.length} markdown files, ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
