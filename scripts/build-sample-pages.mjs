#!/usr/bin/env node
// build-sample-pages.mjs — render docs/samples/* into the three detail pages.
//
// The detail pages (docs/inventory.html, docs/usage-guide.html,
// docs/asset-inventory-json.html) show a live, rendered preview of the sample
// output. Rather than hand-maintain that HTML, this script generates it from
// docs/samples/ (English) and docs/samples/zh/ (Chinese) and injects it between
// the `<!-- build-sample:start -->` / `<!-- build-sample:end -->` markers.
//
// English is the base sample; languages without a translated sample fall back to
// it at runtime (see docs/lang.js).
//
// Usage:
//   node scripts/build-sample-pages.mjs          # write the pages
//   node scripts/build-sample-pages.mjs --check  # fail if a page is out of date

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const SAMPLES = path.join(DOCS, 'samples');

const START = '<!-- build-sample:start -->';
const END = '<!-- build-sample:end -->';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

function renderTable(rows) {
  const cells = (row) =>
    row.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => inline(c.trim()));
  const head = cells(rows[0]);
  const body = rows.slice(2);
  const out = ['<div class="md-table-wrap"><table class="md-table"><thead><tr>'];
  out.push(head.map((h) => `<th>${h}</th>`).join(''));
  out.push('</tr></thead><tbody>');
  for (const row of body) {
    out.push(`<tr>${cells(row).map((c) => `<td>${c}</td>`).join('')}</tr>`);
  }
  out.push('</tbody></table></div>');
  return out.join('');
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let i = 0;
  let inList = false;
  const flushList = () => {
    if (inList) { html.push('</ul>'); inList = false; }
  };
  while (i < lines.length) {
    const line = lines[i];
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      flushList();
      const level = m[1].length;
      html.push(`<h${level}>${inline(m[2])}</h${level}>`);
      i += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushList();
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      html.push(`<blockquote>${buf.map((b) => inline(b)).join('<br>')}</blockquote>`);
      continue;
    }
    if (/^\|/.test(line)) {
      flushList();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i]);
        i += 1;
      }
      html.push(renderTable(rows));
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${inline(line.replace(/^\s*-\s+/, ''))}</li>`);
      i += 1;
      continue;
    }
    if (line.trim() === '') { flushList(); i += 1; continue; }
    flushList();
    const buf = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^[#>|]/.test(lines[i]) &&
      !/^\s*-\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  flushList();
  return html.join('\n');
}

function sectionOf(md, re) {
  const lines = md.split(/\r?\n/);
  let start = -1;
  let end = lines.length;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      if (start !== -1) { end = i; break; }
      if (re.test(lines[i])) start = i;
    }
  }
  return start === -1 ? null : lines.slice(start, end).join('\n');
}

function renderJson(text) {
  const pretty = JSON.stringify(JSON.parse(text), null, 2);
  const body = pretty
    .split('\n')
    .map((line) => {
      let out = esc(line);
      out = out.replace(/"([^"\\]*)":/g, '<span class="k">"$1"</span>:');
      out = out.replace(/: (".*?")(,?)$/g, ': <span class="s">$1</span>$2');
      return out;
    })
    .join('\n');
  return `<pre class="json-view">${body}</pre>`;
}

function exampleBlock(lang, body) {
  return [
    `<div class="example" data-lang="${lang}">`,
    body,
    '</div>',
  ].join('\n');
}

const PAGES = [
  {
    html: 'inventory.html',
    kind: 'inventory',
  },
  {
    html: 'usage-guide.html',
    kind: 'usage',
  },
  {
    html: 'asset-inventory-json.html',
    kind: 'json',
  },
];

const read = (p) => readFileSync(path.join(SAMPLES, p), 'utf8');

function bodyFor(kind, text) {
  if (kind === 'inventory') {
    const sec = sectionOf(text, /^##\s+.*(Table 5|表\s*5)/);
    if (!sec) throw new Error('inventory sample: could not find the Table 5 section');
    return renderMarkdown(sec);
  }
  if (kind === 'usage') return renderMarkdown(text);
  if (kind === 'json') return renderJson(text);
  throw new Error(`unknown kind: ${kind}`);
}

function buildBlock(page, lang) {
  const en = read(page.html === 'asset-inventory-json.html'
    ? 'asset-inventory.json'
    : page.html === 'inventory.html' ? 'inventory.md' : 'usage-guide.md');
  const zhPath = page.html === 'asset-inventory-json.html'
    ? 'zh/asset-inventory.json'
    : page.html === 'inventory.html' ? 'zh/inventory.md' : 'zh/usage-guide.md';
  const source = lang === 'en' ? en : read(zhPath);
  return exampleBlock(lang, bodyFor(page.kind, source));
}

function renderPageContent(page) {
  return [buildBlock(page, 'en'), buildBlock(page, 'zh')].join('\n\n');
}

function injectInto(raw, content, file) {
  const s = raw.indexOf(START);
  const e = raw.indexOf(END);
  if (s === -1 || e === -1 || e < s) {
    throw new Error(`${file}: build-sample markers not found`);
  }
  return `${raw.slice(0, s + START.length)}\n${content}\n${raw.slice(e)}`;
}

function main() {
  const check = process.argv.includes('--check');
  let stale = 0;
  for (const page of PAGES) {
    const file = path.join(DOCS, page.html);
    const raw = readFileSync(file, 'utf8');
    const next = injectInto(raw, renderPageContent(page), page.html);
    if (next === raw) continue;
    if (check) {
      stale += 1;
      console.error(`sample pages: ${page.html} is out of date — run node scripts/build-sample-pages.mjs`);
    } else {
      writeFileSync(file, next);
      console.log(`sample pages: updated ${page.html}`);
    }
  }
  if (check) {
    console.log(`\nbuild-sample-pages: ${PAGES.length} page(s), ${stale} out of date`);
    process.exit(stale > 0 ? 1 : 0);
  }
}

main();
