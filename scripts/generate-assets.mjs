#!/usr/bin/env node
// generate-assets.mjs - regenerate docs/assets/*.svg used by the README headers.
//
// Style: dark warm grey background, green/orange accents, dot-matrix title and
// monospace body text. Every dot is placed on an integer grid sharing one
// baseline so glyphs stay aligned. Edit this script, never the generated SVG.
//
// Run: node scripts/generate-assets.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'assets');

const COLOR = {
  grayDark: '#4B4646',
  grayMid: '#B7B1B1',
  grayLight: '#F1ECEC',
  green: '#03B000',
  orange: '#FF6900',
};

// 5x7 dot-matrix glyphs. Each row is 5 columns; '1' is a filled dot.
const FONT = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00000', '00100'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  A: ['01110', '10001', '10001', '10001', '11111', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};

const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Renders uppercase text as a grid of dots. `pitch` is the integer distance
// between dot origins; each dot is (pitch - 2) wide so gaps stay uniform.
function dotText(text, { x, y, pitch, color }) {
  const parts = [];
  let cursor = x;
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch] || FONT[' '];
    for (let r = 0; r < glyph.length; r += 1) {
      for (let c = 0; c < glyph[r].length; c += 1) {
        if (glyph[r][c] === '1') {
          parts.push(
            `<rect x="${cursor + c * pitch}" y="${y + r * pitch}" width="${pitch - 2}" height="${pitch - 2}" fill="${color}"/>`,
          );
        }
      }
    }
    cursor += 6 * pitch; // 5 columns + 1 column of letter spacing
  }
  return parts.join('');
}

function iconSvg() {
  const cells = [
    [COLOR.green, COLOR.green, COLOR.grayMid],
    [COLOR.green, COLOR.grayMid, COLOR.grayMid],
    [COLOR.orange, COLOR.grayMid, COLOR.green],
  ];
  const margin = 20;
  const size = 24;
  const gap = 8;
  const parts = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const x = margin + c * (size + gap);
      const y = margin + r * (size + gap);
      parts.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="3" fill="${cells[r][c]}"/>`);
    }
  }
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="asset-inventory">',
    '<title>asset-inventory</title>',
    `<rect width="128" height="128" rx="16" fill="${COLOR.grayDark}"/>`,
    ...parts,
    '</svg>',
    '',
  ].join('\n');
}

function bannerSvg({ subtitle, fontFamily }) {
  const pitch = 10;
  const titleColor = COLOR.grayLight;
  const title2Color = COLOR.green;
  const titleX = 80;
  const titleY = 80;
  const advance = 6 * pitch; // 5 columns + 1 column of letter spacing
  const first = dotText('ASSET', { x: titleX, y: titleY, pitch, color: titleColor });
  const second = dotText('INVENTORY', { x: titleX + 6 * advance, y: titleY, pitch, color: title2Color });
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" role="img" aria-label="asset-inventory">',
    '<title>asset-inventory</title>',
    `<rect width="1280" height="320" fill="${COLOR.grayDark}"/>`,
    `<rect x="0" y="0" width="1280" height="6" fill="${COLOR.green}"/>`,
    first,
    second,
    `<text x="82" y="${titleY + 7 * pitch + 52}" font-family="${fontFamily}" font-size="24" fill="${COLOR.grayMid}">${escapeXml(subtitle)}</text>`,
    `<rect x="82" y="270" width="64" height="5" fill="${COLOR.orange}"/>`,
    '</svg>',
    '',
  ].join('\n');
}

function badgeSvg(label, value) {
  const fontSize = 11;
  const charWidth = 6.6;
  const pad = 8;
  const lw = Math.round(pad * 2 + label.length * charWidth);
  const vw = Math.round(pad * 2 + value.length * charWidth);
  const width = lw + vw;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${escapeXml(`${label}: ${value}`)}">`,
    `<title>${escapeXml(`${label}: ${value}`)}</title>`,
    `<rect width="${width}" height="20" rx="3" fill="${COLOR.grayDark}"/>`,
    `<rect x="${lw - 3}" y="0" width="${vw + 3}" height="20" rx="3" fill="${COLOR.green}"/>`,
    `<rect x="${lw - 3}" y="0" width="6" height="20" fill="${COLOR.green}"/>`,
    `<text x="${lw / 2}" y="14" font-family="Courier New, Courier, monospace" font-size="${fontSize}" fill="${COLOR.grayLight}" text-anchor="middle">${escapeXml(label)}</text>`,
    `<text x="${lw + vw / 2}" y="14" font-family="Courier New, Courier, monospace" font-size="${fontSize}" fill="${COLOR.grayLight}" text-anchor="middle">${escapeXml(value)}</text>`,
    '</svg>',
    '',
  ].join('\n');
}

const OUTPUTS = {
  'icon.svg': iconSvg(),
  'banner.svg': bannerSvg({
    subtitle: 'Inventory every plugin, skill, command, MCP, agent, and host capability.',
    fontFamily: 'Courier New, Courier, monospace',
  }),
  'banner-zh.svg': bannerSvg({
    // "盘点本机可调用的每一个插件、Skill、命令、MCP、Agent 与外层应用能力。"
    subtitle:
      '\u76d8\u70b9\u672c\u673a\u53ef\u8c03\u7528\u7684\u6bcf\u4e00\u4e2a\u63d2\u4ef6\u3001Skill\u3001\u547d\u4ee4\u3001MCP\u3001Agent \u4e0e\u5916\u5c42\u5e94\u7528\u80fd\u529b\u3002',
    fontFamily: "FangSong, 'Noto Serif CJK SC', serif",
  }),
  'badge-license.svg': badgeSvg('license', 'MIT'),
  'badge-opencode.svg': badgeSvg('opencode', 'skill'),
};

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const [name, content] of Object.entries(OUTPUTS)) {
    await fs.writeFile(path.join(OUT, name), content, 'utf8');
    console.log(`wrote docs/assets/${name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
