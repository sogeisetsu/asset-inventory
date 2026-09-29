# TODO — rollout plan

> Living rollout plan. After finishing a release, tick its box and update the
> **Next step** line at the bottom. A fresh session should read this file first
> to know exactly which release is in flight and what comes next.
>
> Chinese counterpart: [`zh/TODO-ZH.md`](../zh/TODO-ZH.md) (kept in sync).

## Release ladder

| Version | Level | Summary | Tag | Release | Status |
|---|---|---|---|---|---|
| 1.7.1 | patch | Rollout plan + tag/release policy clarified | ✅ | — | ✅ done |
| 1.7.2 | patch | MCP invocation facts corrected (skill rule + every sample) | ✅ | — | ✅ done |
| 1.7.3 | patch | README cleanup: drop title emoji, add "Install via AI", move non-EN/ZH READMEs into `readmes/` | ✅ | — | ✅ done |
| 1.7.4 | patch | Docs site: English fallback for untranslated content (fix "frame with no content") | ✅ | — | ✅ done |
| 1.8.0 | minor | Glossary: add `ko` / `ru` / `ar` / `es` fixed strings (7 languages) | ✅ | ✅ | ✅ done |
| 1.9.0 | minor | Sample pages: generator script, rendered Markdown/JSON, `docs/samples/` restructure | ✅ | ✅ | ✅ done |
| 1.9.1 | patch | Document the branch rule (CONTRIBUTING + repository guide) | ✅ | — | ✅ done |
| 1.9.2 | patch | Release notes moved into docs/release-notes/ + zh/release-notes/ | ✅ | — | ✅ done |
| 1.9.3 | patch | Fix language stacking + per-tab language (sessionStorage) | ✅ | — | ✅ done |
| 1.9.4 | patch | Detail pages: drop sample bar, add .facts borders, cap JSON height | ✅ | — | ✅ done |
| 1.10.0 | minor | Docs-site fixes + release-notes reorg, bilingual release notes | ✅ | ✅ | ✅ done |
| 1.10.1 | patch | 404 redirect for old release-note URLs | ✅ | — | ✅ done |
| 1.10.2 | patch | Docs site M3 polish + example panel; Targeting docs (EN/ZH) | ✅ | — | ✅ done |
| 1.10.3 | patch | Token trim: condense SKILL.md + format-example.md (behavior-neutral) | ✅ | — | ✅ done |
| 1.11.0 | minor | Docs-site M3 + example panel, Targeting docs, token trim; bilingual release notes | ✅ | ✅ | ✅ done |
| 1.11.1 | patch | Rule hardening: home-path masking, merge skill/command pairs, disabled agents, unregistered residue | ✅ | — | ✅ done |
| 1.11.2 | patch | Never merge command + same-named skill; widen upstream lookup; name legend | ✅ | — | ✅ done |
| 1.11.3 | patch | Merge scope: same-plugin pair = one row; separate-origin command + skill = two rows | ✅ | ✅ | ✅ done |
| 1.11.4 | patch | Install via AI: require `git clone`, drop ZIP fallback; warn against Releases ZIPs | ✅ | ✅ | ✅ done |
| 1.11.5 | patch | `AGENTS.md` de-privatized & tracked; Release bodies English-only | ✅ | — | ✅ done |
| 1.11.6 | patch | Root slimming: `assets/`→`docs/assets/`, `TODO.md`→`docs/` | ✅ | — | ✅ done |
| 1.11.7 | patch | SKILL.md self-declared source line; references deliberately unmarked | ✅ | — | ✅ done |
| 1.11.8 | patch | Behavior-neutral token trim of runtime payload | ✅ | — | ✅ done |
| 1.12.0 | minor | Skill `How to call` shows the real TUI path (`/skills` picker, typed full name) | ✅ | ✅ | ✅ done |
| 1.13.0 | minor | `🛑broken` state marker (7 locales), visible checkpoints, targeted-mode output/provenance rules | ✅ | ✅ | ✅ done |
| 1.13.1 | patch | Probe env rule, diff protocol pinned, security guards, five-state sync | ✅ | ✅ | ✅ done |
| 1.13.2 | patch | release-prep script, check-docs state-parity rule, workflow mirror note, patch-Release override clause | ✅ | — | ✅ done |
| 1.13.3 | patch | release-notes range rule (vs previous Release tag), release-prep `--notes` fill-in hint | ✅ | ✅ | ✅ done |
| 1.13.4 | patch | Verdict-not-dump evidence rules, sufficiency stop, output budget, ranked full-scan example | ✅ | — | ✅ done |
| 1.13.5 | patch | update.ps1 backups leave the skills/ namespace (were loading as duplicate skill); AGENTS rule synced | ✅ | — | ✅ done |
| 1.13.6 | patch | Rendered sample pages on the docs site, host-aware invocation wording (7 READMEs + skill), Copy commands button removed | ✅ | — | ✅ done |
| 1.13.7 | patch | `update.ps1 -DryRun` side-effect free; install prompt defines `<target>` as skills root (7 locales); check-docs header/version guards; glossary pretty-printed; CONTRIBUTING trees | ✅ | — | ✅ done |
| 1.14.0 | minor | skills.sh install (7 READMEs + guide) + badge; richer description; `metadata.source`; workflow-first SKILL.md; nested-mcp count + diff state-flip branches; glossary `hostCategories` (7 langs) | ✅ | ✅ | ✅ done |
| 1.15.0 | minor | Registry-first host-command scan (Pass 1 registries + completeness guard, Pass 2 fallback); Table 4 three-registry cross-check | ✅ | ✅ | ✅ done |
| 1.15.1 | patch | Progressive disclosure: mode/diff routing, failure handling and Table 2/6 rules moved out of `SKILL.md` (36.6k → 29.7k chars); checklist de-duplicated; description 969 → 620 chars | ✅ | — | ✅ done |
| 1.15.2 | patch | Contributor facts (`update.ps1` version read, `check-docs` stale-mirror warning) moved out of `references/troubleshooting.md` into `CONTRIBUTING.md` + ZH; local `zh/skill-zh.md` mirror resynced | ✅ | — | ✅ done |
| 1.15.3 | patch | `AGENTS.md`: mirror-sync rule made explicit (section-by-section resync + header version pin; `touch` is not a resync) | ✅ | — | ✅ done |

## Details

### 1.7.2 — MCP invocation facts (patch)
The skill (and every sample) claimed MCP servers are "called only by the Agent —
a human never calls them". That is wrong. Fix the rule in `SKILL.md`
(Cell Conventions, Discover, Anti-patterns) and `references/checklist.md`, then
sync all samples: `docs/samples/inventory.md`, `docs/samples/usage-guide.md`,
`docs/samples/asset-inventory.json`, `docs/inventory.html`,
`docs/asset-inventory-json.html`, `docs/index.html`.

### 1.7.3 — README cleanup (patch)
- Remove the 🗃️ emoji from every README title (all 7 files).
- Add an "Install via AI" section to every README (reuse the localized prompts
  already on `docs/index.html`).
- Move non-EN/ZH READMEs into `readmes/` and rewrite their relative links
  (`assets/`, `LICENSE`, `docs/`, `CHANGELOG.md`, `CONTRIBUTING.md`), the
  language switchers, `scripts/check-docs.mjs` (`README_LOCALES` + CJK strip),
  and the directory tree in `docs/guides/repository-and-contributing.md`.

### 1.7.4 — Docs site English fallback (patch)
Untranslated body content is empty for ja/ko/ru/ar/es. Introduce `data-i18n`
grouping plus a `lang.js` resolver (chosen language → fall back to English) and
switch `style.css` visibility to a `.on` class across the four HTML pages. Frame
and headings stay in the chosen language.

### 1.8.0 — Glossary 7 languages (minor · Release)
Add `ko` / `ru` / `ar` / `es` blocks to `references/glossary.json` (10 keys each,
identical key set to `en`), and widen the "Fixed-string languages" line in
`SKILL.md` to all seven.

### 1.9.0 — Sample pages (minor · Release)
Add `scripts/build-sample-pages.mjs` to render `inventory.md` (tables),
`usage-guide.md` (real HTML) and `asset-inventory.json` (pretty-printed) into the
three detail pages. Restructure samples: English at `docs/samples/`, Chinese
under `docs/samples/zh/`; update every sample link. Drop the raw filename from
the detail-page titles.

### 1.15.0 — Registry-first host-command scan (minor · Release)
`references/host-commands.md` gained a deterministic Pass 1: enumerate the bundle's
command registry (`{id,name,source}` entries plus a raw-`id` completeness guard),
cross-check it against the composer-autocomplete i18n keys and the prompt-template
`command:"/xxx"` literals, and name every command by the registry `id`/`name` (an
autocomplete key is not always the typed form's camelCase — `featurePlan` is really
`/plan-feature`). The phrase-filtered token scan became Pass 2, a fallback that states
outright that it is not the complete set; `references/checklist.md` gates Table 4 on the
three-registry union, and `SKILL.md`'s failure-mode list records that the old filter
dropped `/btw`, `/fork`, `/schedule-task` and `/handoff-review` and could never have found
`/timeline`.

### 1.15.1 — Progressive disclosure (patch · tag only)
A review found the payload nominally staged but not actually on-demand: `SKILL.md` was
~9.1k tokens (~2× the ~5k ceiling) and 5 of 6 reference files were read on every run, with
`checklist.md` restating all 41 rules already in `SKILL.md`. The fix relocates the
Targeting table + diff protocol to `references/modes.md` (new), the error-handling table to
`references/troubleshooting.md`, the Table 2/6 rules to `references/format-example.md`, and
the two host-scan failure modes to `references/host-commands.md` — each leaving a trigger
plus a pointer, with the diff paste gate and masking STOP kept in `SKILL.md`; rewrites
`checklist.md` as terse verdicts that cite the owning section; and trims the frontmatter
description to what + triggers. Output behaviour is unchanged, so `docs/samples/` stays
byte-identical. The remaining ~6.8k-token `SKILL.md` is deliberate: the rest of the body is
needed on every full scan.

### 1.15.2 — Contributor facts out of the runtime payload (patch · tag only)
`references/troubleshooting.md` ships inside the runtime payload, so the agent reads it — but
two of its sections were about maintaining the repo, not about running an inventory:
`update.ps1` reading `metadata.version`, and the `check-docs` stale-mirror warning for the
gitignored `zh/skill-zh.md`. Both moved into `CONTRIBUTING.md` + `zh/CONTRIBUTING-ZH.md`;
the runtime file keeps `## Scan & output failures` and the six runtime `## Common issues`
sections verbatim. In the same pass the local Chinese mirror was resynced to the
restructured `SKILL.md`, so `check-docs` now reports 0 errors and 0 warnings.

### 1.15.3 — Mirror-sync rule written down (patch · tag only)
`AGENTS.md` step 1 said only "sync `zh/skill-zh.md`", which is how the mirror drifted: after a
`SKILL.md` restructure it still carried the old Target table, the old diff protocol and a
pre-v1.4.0 inlined checklist. The rule now spells out the whole obligation — resync section by
section on any structural change, and update the mirror header's version-pin line even on a
version-only bump — while the Pitfalls list records that `check-docs` measures staleness by mtime
alone, so `touch` buys silence, not sync. Docs only: the runtime payload is untouched.

## Next step

The rollout is complete through **1.15.3**: 1.11.1–1.11.8, 1.13.1–1.13.7, 1.15.1, 1.15.2 and
1.15.3 (patches), 1.12.0, 1.13.0, 1.14.0 and 1.15.0 (minors), GitHub Releases on 1.11.3,
1.11.4, 1.12.0, 1.13.0, 1.13.1, 1.13.3, 1.14.0 and 1.15.0. Nothing is in flight — start a new
ladder here for the next piece of work.
