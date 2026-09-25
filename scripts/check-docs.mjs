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
//      or end with -ZH.md; AGENTS.md is deliberately Chinese and exempt).
//   6. Version consistency: the SKILL.md frontmatter metadata.version matches
//      the top release heading in CHANGELOG.md and zh/CHANGELOG-ZH.md.
//   7. Glossary structure: every language block in references/glossary.json
//      exposes the same key set as the `en` block, and every language SKILL.md
//      declares as a fixed-string language actually exists in the glossary.
//   8. Reference integrity: every `references/<name>.md` mentioned in SKILL.md
//      exists, and references/checklist.md still holds the expected number of
//      `- [ ]` items (guards against silent loss when the list is edited).
//   9. Localized README set: every localized README exists and links to the
//      whole locale set.
//   10. State parity: every `languages.<lang>.state` value in the glossary
//      appears verbatim in that language's README and in docs/index.html, so
//      localized pages never drift from the fixed output markers.
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
  ['docs/TODO.md', 'zh/TODO-ZH.md'],
  ['CONTRIBUTING.md', 'zh/CONTRIBUTING-ZH.md'],
  ['CHANGELOG.md', 'zh/CHANGELOG-ZH.md'],
  ['docs/release-notes/release-notes-v1.1.0.md', 'zh/release-notes/release-notes-v1.1.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.3.0.md', 'zh/release-notes/release-notes-v1.3.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.4.0.md', 'zh/release-notes/release-notes-v1.4.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.5.0.md', 'zh/release-notes/release-notes-v1.5.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.6.0.md', 'zh/release-notes/release-notes-v1.6.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.7.0.md', 'zh/release-notes/release-notes-v1.7.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.8.0.md', 'zh/release-notes/release-notes-v1.8.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.9.0.md', 'zh/release-notes/release-notes-v1.9.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.10.0.md', 'zh/release-notes/release-notes-v1.10.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.11.0.md', 'zh/release-notes/release-notes-v1.11.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.12.0.md', 'zh/release-notes/release-notes-v1.12.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.13.0.md', 'zh/release-notes/release-notes-v1.13.0-ZH.md'],
  ['docs/release-notes/release-notes-v1.13.1.md', 'zh/release-notes/release-notes-v1.13.1-ZH.md'],
  ['docs/release-notes/release-notes-v1.13.3.md', 'zh/release-notes/release-notes-v1.13.3-ZH.md'],
];

// Localized READMEs that must all exist and cross-link each other, keyed by
// glossary language code (used by the locale and state-parity checks).
const README_LOCALES = [
  ['en', 'README.md'],
  ['zh', 'README-ZH.md'],
  ['ja', 'readmes/README-JA.md'],
  ['ko', 'readmes/README-KO.md'],
  ['ru', 'readmes/README-RU.md'],
  ['ar', 'readmes/README-AR.md'],
  ['es', 'readmes/README-ES.md'],
];

// Gitignored local copies compared by mtime (source, local copy).
const LOCAL_PAIRS = [['SKILL.md', 'zh/skill-zh.md']];

// Root-level files that are deliberately Chinese (exempt from the CJK rule).
const CHINESE_ROOT_DOCS = ['AGENTS.md'];

// Directories whose docs follow the *output* language, not the repo's English
// rule — e.g. sample artifacts, which may legitimately be in any language.
const OUTPUT_LANGUAGE_DIRS = ['docs/samples/'];

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
// HTML: href="..." and src="..." on any element (used by docs/*.html).
const HTML_HREF_RE = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
const EXTERNAL = /^(https?:|mailto:|tel:|data:|#|\/\/)/i;

async function checkHtmlLinks(file, raw) {
  const targets = [];
  let m;
  HTML_HREF_RE.lastIndex = 0;
  while ((m = HTML_HREF_RE.exec(raw))) targets.push(m[1]);

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
  // Any non-English locale README (README-JA.md, README-KO.md, …) is exempt.
  if (/(^|\/)README-[A-Za-z]{2,3}\.md$/i.test(relPath)) return false;
  if (CHINESE_ROOT_DOCS.includes(relPath)) return false;
  if (OUTPUT_LANGUAGE_DIRS.some((d) => relPath.startsWith(d))) return false;
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
  if (!/^\d+\.\d+\.\d+/.test(skillVersion)) {
    warn(`version check: metadata.version in SKILL.md frontmatter is not a semver value ("${skillVersion}") — skipping comparison`);
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
    if (changelogVersion.toLowerCase() === 'unreleased') {
      warn(`version check: ${relPath} top heading is [Unreleased] — skipping comparison with SKILL.md metadata.version`);
      continue;
    }
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

  // 7b. Languages SKILL.md advertises must actually exist in the glossary.
  // SKILL.md states them on the "Fixed-string languages:" line, each code in
  // backticks, e.g. "English (`en`), Chinese (`zh`), and Japanese (`ja`)".
  const skillPath = path.join(ROOT, 'SKILL.md');
  if (!(await exists(skillPath))) return;
  const skillRaw = await fs.readFile(skillPath, 'utf8');
  const claimLine = skillRaw
    .split(/\r?\n/)
    .find((l) => l.includes('Fixed-string languages'));
  if (!claimLine) {
    warn('glossary check: no "Fixed-string languages" line found in SKILL.md — cannot verify advertised languages');
    return;
  }
  const advertised = [...claimLine.matchAll(/\(`([a-z]{2}(?:-[A-Za-z]{2,4})?)`\)/g)].map((m) => m[1]);
  if (advertised.length === 0) {
    warn('glossary check: "Fixed-string languages" line lists no (`xx`) codes — cannot verify advertised languages');
    return;
  }
  for (const lang of advertised) {
    if (!Object.prototype.hasOwnProperty.call(languages, lang)) {
      err(`glossary check: SKILL.md advertises "${lang}" as a fixed-string language but references/glossary.json has no "${lang}" block`);
    }
  }
  const advertisedSet = new Set(advertised);
  const undocumented = keys.filter((k) => !advertisedSet.has(k));
  if (undocumented.length > 0) {
    warn(`glossary check: glossary has language(s) not advertised in SKILL.md: ${undocumented.join(', ')}`);
  }
}

async function checkReferenceIntegrity() {
  // 8. References named in SKILL.md must exist; checklist must keep its items.
  const skillPath = path.join(ROOT, 'SKILL.md');
  if (!(await exists(skillPath))) {
    err('reference check: SKILL.md not found');
    return;
  }
  const skillRaw = await fs.readFile(skillPath, 'utf8');

  const named = new Set([...skillRaw.matchAll(/`references\/([A-Za-z0-9._-]+)`/g)].map((m) => m[1]));
  for (const name of named) {
    if (!(await exists(path.join(ROOT, 'references', name)))) {
      err(`reference check: SKILL.md references "references/${name}" but the file does not exist`);
    }
  }

  const checklistPath = path.join(ROOT, 'references', 'checklist.md');
  if (!(await exists(checklistPath))) {
    err('reference check: references/checklist.md not found');
    return;
  }
  const checklistRaw = await fs.readFile(checklistPath, 'utf8');
  const itemCount = (checklistRaw.match(/^- \[ \]/gm) || []).length;
  if (itemCount < 20) {
    err(`reference check: references/checklist.md has only ${itemCount} checklist item(s); at least 20 expected (were items dropped?)`);
  }
}

async function checkReadmeLocales() {
  // 9. Every localized README exists and links to the whole locale set.
  for (const [, relPath] of README_LOCALES) {
    const abs = path.join(ROOT, relPath);
    if (!(await exists(abs))) {
      err(`readme locales: missing ${relPath}`);
      continue;
    }
    const raw = await fs.readFile(abs, 'utf8');
    // Compare by basename so a README may link siblings inside its own folder
    // (`README-JA.md`) or across folders (`../README.md`, `readmes/README-JA.md`).
    const linked = new Set(
      [...raw.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1].split('/').pop()),
    );
    for (const [, target] of README_LOCALES) {
      const name = target.split('/').pop();
      if (!linked.has(name)) {
        warn(`readme locales: ${relPath} does not link to ${target}`);
      }
    }
  }
}

async function checkGlossaryStateParity() {
  // 10. Every glossary state marker must appear verbatim in that language's
  // README and in docs/index.html (which renders a five-state line per
  // locale), so a marker rename in references/glossary.json cannot silently
  // strand the localized pages.
  const glossaryPath = path.join(ROOT, 'references', 'glossary.json');
  if (!(await exists(glossaryPath))) return; // already reported by check 7
  let data;
  try {
    data = JSON.parse(await fs.readFile(glossaryPath, 'utf8'));
  } catch {
    return; // already reported by check 7
  }
  const languages = data && typeof data === 'object' ? data.languages : null;
  if (!languages || typeof languages !== 'object') return;

  const statesOf = (lang) => {
    const block = languages[lang];
    const state = block && typeof block === 'object' ? block.state : null;
    if (!state || typeof state !== 'object') return null; // key-parity reports this
    return Object.values(state).filter((v) => typeof v === 'string' && v !== '');
  };

  const readmeByLang = new Map(README_LOCALES);
  for (const lang of Object.keys(languages)) {
    const values = statesOf(lang);
    if (!values) continue;
    const relPath = readmeByLang.get(lang);
    if (!relPath) {
      warn(`state parity: no README mapped for glossary language "${lang}"`);
      continue;
    }
    const abs = path.join(ROOT, relPath);
    if (!(await exists(abs))) continue; // readme-locales check reports this
    const raw = await fs.readFile(abs, 'utf8');
    for (const value of values) {
      if (!raw.includes(value)) {
        err(`state parity: ${relPath} is missing glossary state value "${value}" (${lang})`);
      }
    }
  }

  const indexAbs = path.join(ROOT, 'docs', 'index.html');
  if (!(await exists(indexAbs))) {
    err('state parity: docs/index.html not found');
    return;
  }
  const indexRaw = await fs.readFile(indexAbs, 'utf8');
  for (const lang of Object.keys(languages)) {
    const values = statesOf(lang);
    if (!values) continue;
    for (const value of values) {
      if (!indexRaw.includes(value)) {
        err(`state parity: docs/index.html is missing glossary state value "${value}" (${lang})`);
      }
    }
  }
}

async function main() {
  const allFiles = await walk(ROOT);
  const mdFiles = allFiles.filter((f) => f.endsWith('.md'));
  const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));

  // 1, 4, 5
  for (const file of mdFiles) {
    const raw = await fs.readFile(file, 'utf8');
    await checkLinks(file, raw);
    checkFrontmatter(file, raw);
    if (isEnglishDoc(rel(file))) {
      // The language-navigation row legitimately contains language names in
      // their own scripts (中文, 日本語, 한국어, …). Strip such rows before the
      // CJK scan so only real prose is checked.
      const prose = raw
        .split(/\r?\n/)
        .filter((l) => !/\]\([^)]*README(?:-[A-Z]{2})?\.md\)/.test(l))
        .join('\n');
      if (CJK.test(prose)) {
        const count = (prose.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
        err(`CJK characters found in English doc ${rel(file)} (${count})`);
      }
    }
  }

  // 1b: HTML pages (docs/*.html) — validate href/src targets resolve.
  for (const file of htmlFiles) {
    const raw = await fs.readFile(file, 'utf8');
    await checkHtmlLinks(file, raw);
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

  // 6, 7, 8
  await checkVersionConsistency();
  await checkReferenceIntegrity();
  await checkGlossaryStructure();
  await checkReadmeLocales();
  await checkGlossaryStateParity();

  for (const w of warnings) console.warn(`warning: ${w}`);
  for (const e of errors) console.error(`error: ${e}`);
  console.log(`\ncheck-docs: ${mdFiles.length} markdown files, ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
