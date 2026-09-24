#!/usr/bin/env node
// release-prep.mjs — mechanical half of the release checklist (AGENTS.md).
//
// Releases keep their prose human/agent-written; this script only does the
// repetitive edits: bump metadata.version, insert CHANGELOG stubs (EN + ZH),
// optionally create bilingual release-notes stubs and register the pair in
// the PAIRS array of scripts/check-docs.mjs, then run the validation gate.
// It never commits, tags, or pushes — it prints a remaining-steps checklist.
//
// Usage:
//   node scripts/release-prep.mjs <version> [--notes] [--dry-run]
//
//   <version>   semver release version, e.g. 1.13.2 (no leading "v")
//   --notes     minor/major release: also create release-notes stubs and
//               register the EN/ZH pair in scripts/check-docs.mjs
//               (omit for a patch: changelog-only, no release-notes files)
//   --dry-run   print every planned edit and exit without writing anything
//   --help      show this help
//
// Exit codes: 0 success, 1 aborted (dirty tree / already prepared /
// structure unexpected / validation gate failed), 2 invalid usage or version.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Strict x.y.z without a leading "v" (matches how versions are written in
// CHANGELOG.md headings and SKILL.md frontmatter).
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const HELP = `Usage: node scripts/release-prep.mjs <version> [options]

Prepare the mechanical half of a release: bump metadata.version in SKILL.md,
insert CHANGELOG.md / zh/CHANGELOG-ZH.md stub blocks, optionally create
bilingual release-notes stubs + register them in scripts/check-docs.mjs
PAIRS, then run the validation gate (check-docs + build-sample-pages --check).

Arguments:
  <version>   semver release version, e.g. 1.13.2 (no leading "v")

Options:
  --notes     minor/major release: also create release-notes stubs and
              register the EN/ZH pair in scripts/check-docs.mjs PAIRS
              (omit for a patch — no release-notes files are created)
  --dry-run   print every planned edit and exit without writing anything
  --help      show this help

Exit codes: 0 success, 1 aborted (dirty tree / already prepared / gate
failed), 2 invalid usage or invalid version.

Prose (CHANGELOG entries, release notes, TODO rows) and the commit / tag /
push / gh-release steps stay manual — a real run ends with that checklist.
A real run requires a clean working tree: releases start from a clean tree.`;

const die = (code, message) => {
  console.error(`release-prep: ${message}`);
  process.exit(code);
};

function parseArgs(argv) {
  const opts = { version: null, notes: false, dryRun: false };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      console.log(HELP);
      process.exit(0);
    } else if (arg === '--notes') {
      opts.notes = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg.startsWith('--')) {
      die(2, `unknown option "${arg}" (see --help)`);
    } else if (opts.version === null) {
      opts.version = arg;
    } else {
      die(2, `unexpected extra argument "${arg}" (see --help)`);
    }
  }
  if (opts.version === null) die(2, 'missing <version> (see --help)');
  if (!SEMVER.test(opts.version)) {
    die(2, `invalid version "${opts.version}" — expected semver like 1.13.2, no leading "v"`);
  }
  return opts;
}

const detectEol = (raw) => (raw.includes('\r\n') ? '\r\n' : '\n');

// Local date as YYYY-MM-DD (release headings use local, not UTC).
function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function gitPorcelain() {
  try {
    return execFileSync('git', ['status', '--porcelain'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
  } catch {
    return null;
  }
}

const readFile = (relPath) => fs.readFile(path.join(ROOT, relPath), 'utf8');

async function mustExist(relPath) {
  if (!(await exists(path.join(ROOT, relPath)))) {
    die(1, `expected file not found: ${relPath}`);
  }
  return readFile(relPath);
}

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

function hasVersionHeader(raw, version) {
  const re = new RegExp(`^##\\s*\\[${version.replace(/\./g, '\\.')}\\]`, 'm');
  return re.test(raw);
}

// (1) Set metadata.version inside the SKILL.md frontmatter.
function setSkillVersion(raw, version) {
  const eol = detectEol(raw);
  const lines = raw.split(/\r?\n/);
  if ((lines[0] || '').trim() !== '---') die(1, 'SKILL.md has no frontmatter');
  let close = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      close = i;
      break;
    }
  }
  if (close === -1) die(1, 'SKILL.md frontmatter is unterminated');
  for (let i = 1; i < close; i += 1) {
    const m = lines[i].match(/^(\s+version:\s*).*$/);
    if (m) {
      lines[i] = `${m[1]}${version}`;
      return lines.join(eol);
    }
  }
  die(1, 'SKILL.md frontmatter has no metadata.version line');
  return null; // unreachable
}

// (2)/(3) Insert a release stub above the first "## [" heading.
function insertChangelogStub(raw, stubLines) {
  const eol = detectEol(raw);
  const lines = raw.split(/\r?\n/);
  const idx = lines.findIndex((l) => /^##\s*\[/.test(l));
  if (idx === -1) die(1, 'no "## [" release heading found — cannot insert the stub');
  lines.splice(idx, 0, ...stubLines);
  return lines.join(eol);
}

function changelogStubEn(version, today) {
  return [`## [${version}] - ${today}`, '', '### Changed', '- TODO: describe changes', '', '---', ''];
}

function changelogStubZh(version, today) {
  return [`## [${version}] - ${today}`, '', '### 变更', '- TODO: 待填写本版本变更内容', '', '---', ''];
}

// (4) Register the EN/ZH release-notes pair at the end of PAIRS in
// scripts/check-docs.mjs, mirroring the existing entry structure.
function registerPair(raw, version) {
  const eol = detectEol(raw);
  const lines = raw.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith('const PAIRS = ['));
  if (start === -1) die(1, 'scripts/check-docs.mjs: could not find "const PAIRS = ["');
  let end = -1;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i] === '];') {
      end = i;
      break;
    }
  }
  if (end === -1) die(1, 'scripts/check-docs.mjs: could not find the closing "];" of PAIRS');
  lines.splice(
    end,
    0,
    `  ['docs/release-notes/release-notes-v${version}.md', 'zh/release-notes/release-notes-v${version}-ZH.md'],`,
  );
  return lines.join(eol);
}

function releaseNotesEn(version, eol) {
  return [
    `# v${version}`,
    '',
    `<!-- TODO: fill release notes; zh counterpart: zh/release-notes/release-notes-v${version}-ZH.md -->`,
    '',
  ].join(eol);
}

function releaseNotesZh(version, eol) {
  return [
    `# v${version}`,
    '',
    `<!-- TODO: 待填写中文 release notes；英文版：docs/release-notes/release-notes-v${version}.md -->`,
    '',
  ].join(eol);
}

function runGate(relScript, args) {
  console.log(`release-prep: gate — node ${relScript} ${args.join(' ')}`.trim());
  const r = spawnSync(process.execPath, [relScript, ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  return r.status === 0;
}

function printManualSteps(version, notes) {
  const lines = [
    `remaining manual steps for v${version}:`,
    '  [ ] CHANGELOG.md — replace the TODO under the new heading with the real entries',
    '  [ ] zh/CHANGELOG-ZH.md — 填写新标题下的中文条目',
  ];
  if (notes) {
    lines.push(`  [ ] docs/release-notes/release-notes-v${version}.md — fill in the English release notes`);
    lines.push(`  [ ] zh/release-notes/release-notes-v${version}-ZH.md — 填写中文 release notes`);
  }
  lines.push(`  [ ] docs/TODO.md + zh/TODO-ZH.md — add the ${version} version row`);
  lines.push('  [ ] write the release commit(s)');
  lines.push(`  [ ] git tag -a v${version} -m "v${version}"`);
  lines.push('  [ ] git push origin master --follow-tags');
  if (notes) {
    lines.push(`  [ ] gh release create v${version} --notes-file docs/release-notes/release-notes-v${version}.md  (minor/major)`);
  } else {
    lines.push('  [ ] patch release: tag only — no GitHub Release, no release-notes file');
  }
  lines.push('');
  lines.push('release-prep never commits, tags, or pushes.');
  for (const l of lines) console.log(l);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { version, notes, dryRun } = opts;
  const kind = notes ? 'minor/major' : 'patch';
  const today = todayLocal();

  // Idempotency: never stack a second stub for the same version.
  const changelogEn = await mustExist('CHANGELOG.md');
  if (hasVersionHeader(changelogEn, version)) {
    die(1, `CHANGELOG.md already has a "## [${version}]" heading — nothing to prepare`);
  }
  const changelogZh = await mustExist('zh/CHANGELOG-ZH.md');
  if (hasVersionHeader(changelogZh, version)) {
    die(1, `zh/CHANGELOG-ZH.md already has a "## [${version}]" heading — nothing to prepare`);
  }
  const notesEnRel = `docs/release-notes/release-notes-v${version}.md`;
  const notesZhRel = `zh/release-notes/release-notes-v${version}-ZH.md`;
  if (notes) {
    if (await exists(path.join(ROOT, notesEnRel))) {
      die(1, `${notesEnRel} already exists — nothing to prepare`);
    }
    if (await exists(path.join(ROOT, notesZhRel))) {
      die(1, `${notesZhRel} already exists — nothing to prepare`);
    }
  }

  // Safety: releases start from a clean tree.
  const status = gitPorcelain();
  if (status === null) {
    if (!dryRun) die(1, 'git status unavailable — cannot verify a clean tree, refusing to edit');
  } else if (status.trim() !== '') {
    if (!dryRun) {
      console.error(status.trimEnd());
      die(1, 'working tree is not clean — releases start from a clean tree; commit or stash first');
    }
  }

  // Build every edit in memory first so structure problems surface before
  // anything is written (and show up in --dry-run output too).
  const skillRaw = await mustExist('SKILL.md');
  const checkDocsRaw = await mustExist('scripts/check-docs.mjs');
  await mustExist('scripts/build-sample-pages.mjs');

  const plan = [
    {
      file: 'SKILL.md',
      after: setSkillVersion(skillRaw, version),
      desc: `set metadata.version → ${version}`,
    },
    {
      file: 'CHANGELOG.md',
      after: insertChangelogStub(changelogEn, changelogStubEn(version, today)),
      desc: `insert "## [${version}] - ${today}" + ### Changed TODO stub above the first release heading`,
    },
    {
      file: 'zh/CHANGELOG-ZH.md',
      after: insertChangelogStub(changelogZh, changelogStubZh(version, today)),
      desc: `insert "## [${version}] - ${today}" + ### 变更 Chinese TODO stub above the first release heading`,
    },
  ];
  if (notes) {
    plan.push(
      {
        file: notesEnRel,
        create: releaseNotesEn(version, '\r\n'),
        desc: 'create English release-notes stub (TODO comment naming the zh counterpart)',
      },
      {
        file: notesZhRel,
        create: releaseNotesZh(version, '\r\n'),
        desc: 'create Chinese release-notes stub (TODO comment naming the en counterpart)',
      },
      {
        file: 'scripts/check-docs.mjs',
        after: registerPair(checkDocsRaw, version),
        desc: `register ['${notesEnRel}', '${notesZhRel}'] at the end of the PAIRS array`,
      },
    );
  }

  if (dryRun) {
    console.log(`release-prep: dry run for ${version} (${kind}) — no files will be written`);
    console.log('');
    console.log('planned edits:');
    plan.forEach((p, i) => console.log(`  ${i + 1}. ${p.file} — ${p.desc}`));
    console.log('');
    console.log('then the validation gate would run:');
    console.log('  node scripts/check-docs.mjs');
    console.log('  node scripts/build-sample-pages.mjs --check');
    if (status !== null && status.trim() !== '') {
      console.log('');
      console.log('note: working tree is not clean — a real run would abort before editing');
    }
    return;
  }

  console.log(`release-prep: preparing ${version} (${kind})`);
  for (const p of plan) {
    const abs = path.join(ROOT, p.file);
    if (p.create !== undefined) {
      await fs.writeFile(abs, p.create, 'utf8');
    } else {
      await fs.writeFile(abs, p.after, 'utf8');
    }
    console.log(`release-prep: ${p.file} — ${p.desc}`);
  }

  if (!runGate('scripts/check-docs.mjs', [])) {
    die(1, 'validation gate failed at check-docs (edits were written — inspect with git diff)');
  }
  if (!runGate('scripts/build-sample-pages.mjs', ['--check'])) {
    die(1, 'validation gate failed at build-sample-pages --check (edits were written — inspect with git diff)');
  }

  console.log('');
  console.log(`release-prep: v${version} prepared — validation gate passed`);
  console.log('');
  printManualSteps(version, notes);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
