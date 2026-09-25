# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- **`metadata.source`** — the SKILL.md frontmatter now records the canonical repository URL (`https://github.com/sogeisetsu/asset-inventory`) as an Agent Skills `metadata` extension key, so hosts and registries can machine-read the source.
- **Richer frontmatter `description`** — the SKILL.md description now states the three provenance questions, the state markers, the trigger scenarios (diff mode, cleanup/unused-asset questions), the usage-guide deliverable, and the read-only/masking guarantees, in 966 chars (limit 1024).
- **Install via skills.sh** — the install section in all seven READMEs gains a `### 📥 Install via skills.sh` subsection (`npx skills add sogeisetsu/asset-inventory`, with the `-g` / `-y` / `--copy` flags explained), and `docs/guides/install-and-update.md` gains a matching "One-command install via skills.sh" section covering flags, scope, and `skills update`.
- **skills.sh badge** — the English and Chinese README badge rows show the official `skills.sh` badge for this repo; it turns green (install count) once the registry entry lands ([vercel-labs/skills#2298](https://github.com/vercel-labs/skills/issues/2298)).

### Changed
- **SKILL.md restructured workflow-first** — `Procedure` now precedes the output-format spec, fixing the stale "the 7-table inventory below" reference; the vague `## The Rule` heading becomes `## Output format — the 7 tables`, and the targeted-modes write list in §5 points to the Targeting table instead of repeating it (darwin dim7 round, paired judges 3–0 keep).
- **Two failure branches encoded** — the Table 5 count assertion now handles nested `mcp.servers.*` and plugin-registered servers (count leaves + plugin, quote the basis, never pad rows to pass), and diff mode defines state-flips (same PK, changed marker) as a one-line `state changed:` note instead of silently mishandling them (darwin dim3 round, paired judges 3–0 keep).

## [1.13.7] - 2026-09-25

### Fixed
- **`update.ps1 -DryRun` no longer has side effects** — the preview now runs before `git pull`, so a dry run never pulls the repo, and it no longer exits 1 when no global install exists: it previews the path a real run would install into (and states which pull it skipped), then exits 0. Real runs keep the previous `exit 1` guidance.
- **The install prompt now defines `<target>`** — in every locale (root READMEs ×2, `readmes/` ×5, landing page ×7) step 3 states that `<target>` is the skills root and that the two runtime items go into `<target>/asset-inventory/`, so steps 3–5 all name one destination instead of two different ones.

### Changed
- **`check-docs.mjs`** — the header check list is numbered 1–10 to match the code (it skipped 7 and had no localized-README entry), and the version check now tolerates an `[Unreleased]` top heading and a non-semver `metadata.version`, warning instead of reporting a bogus mismatch.
- **`references/glossary.json`** is pretty-printed — parsed content is byte-identical, but language changes are now visible in diffs.
- **CONTRIBUTING file trees** (English and Chinese) list `scripts/build-sample-pages.mjs`.

## [1.13.6] - 2026-09-25

### Changed
- **Sample inventory renders on the docs site** — `samples/inventory.md` links no longer serve raw Markdown source in the browser: `scripts/build-sample-pages.mjs` now also emits standalone rendered pages (`docs/samples/inventory.html` + `docs/samples/zh/inventory.html`, full 7 tables, language fixed per page) and `docs/inventory.html`'s "Full sample" links point at them; the new pages are covered by `build-sample-pages --check`.
- **Invocation wording matches how hosts actually expose skills** — the quick start in all seven READMEs now says to type `/asset-inventory`, pick it from the OpenCode TUI's `/skills` selector, or ask in plain language, and replaces "append an argument" with "add a target" (plain-language targets work too); the `How it works` link row's label becomes "Invocation & targets". In `SKILL.md`, the `How to call` skill rule and the name legend are host-aware: `/skills` is the OpenCode TUI's picker — not every host exposes it — while typing `/skill-name` works regardless.
- **Landing page loses the redundant "Copy commands" button** — the manual-install block keeps its commands; only the extra copy button (7 locales) is removed.

---

## [1.13.5] - 2026-09-25

### Changed
- **`update.ps1` backups leave the skills namespace** — backups were written *next to* the install dir, i.e. inside `skills/`, where the host scanner picked the backup's `SKILL.md` up and loaded it as a duplicate `asset-inventory` skill (stale version, a second entry in `/skills`). Backups now go to `<parent-of-skills>/backups/` (global: `~/.config/opencode/backups/`; project-scoped: `<project>/.opencode/backups/`), with a beside-dir fallback for non-standard `-Target` layouts; the duplicate already created on this machine was moved out and deregistered. The `AGENTS.md` backup-location rule is updated to match.

---

## [1.13.4] - 2026-09-25

### Changed
- **Evidence returns verdicts, not dumps** — `SKILL.md`'s Verify section now requires every evidence command to return *verdict + supporting source line + suppressed-candidate count*: counts assert `N = M` instead of printing both lists, hashes print `match=true|false`, `agent list` / `debug agent` print name+mode lines plus only the permission lines a row cites, skill listings project name/description/location instead of full SKILL.md bodies, and binary scans print evidence-ranked context windows instead of the full unique-token list. Every verdict keeps its quote, and a silent `-First N` cut that could hide unregistered residue is forbidden — provenance claims are unchanged, only the transport waste is gone.
- **First sufficient evidence wins** — each fact (version, upstream URL, state, model chain, count) is verified exactly once: the first source in the documented lookup order that actually shows it, recorded and stopped at; escalate only when the current source doesn't show the fact or two sources conflict.
- **Output budget in Discover** — trim before returning: project only the fields you will cite, error line only on failure, parse single-line JSON with a parser instead of `Read`, scan binaries in-process, read the error and retry at most twice.
- **Full-scan example rewritten to match** — `references/host-commands.md` now scans in-process and prints ranked context candidates with a suppressed count (6125 raw tokens → 12 contexted candidates measured on a ~130 MB `app.asar`), checking every occurrence so a command whose first appearance sits in unrelated code cannot be missed; `references/checklist.md` gains an **Evidence & Output Budget** gate (verdicts not dumps / no silent truncation / one sufficient source per fact).

---

## [1.13.3] - 2026-09-24

### Changed
- **Release-notes content range defined** — `CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md` now state that a GitHub Release's notes must cover **all changes since the previous Release's tag** (found via `gh release list`), not the current version's commit list: patch tags carry no Release, so every intermediate patch belongs in the notes; written from the user's perspective, never as a raw commit dump. `AGENTS.md` carries the summary, and `scripts/release-prep.mjs`'s `--notes` checklist repeats the rule at fill-in time.

---

## [1.13.2] - 2026-09-24

### Added
- **`scripts/release-prep.mjs`** — one command prepares the mechanical half of a release: bumps `metadata.version`, inserts EN/ZH CHANGELOG heading stubs, optionally scaffolds the bilingual release-notes pair and registers it in check-docs' `PAIRS` (`--notes`, for minor/major), then runs both validation gates and prints the remaining manual steps. Never commits, tags, or pushes; refuses to run on a dirty tree or a duplicate version; `--dry-run` previews without writing.
- **State-parity check in `check-docs`** — every `state` value in `references/glossary.json` (all seven locales, including the fifth marker) must appear verbatim in that language's README and in `docs/index.html`, so a new marker can no longer ship while the public docs still list the old set.

### Changed
- **Workflow step 1 names the zh mirror** — `AGENTS.md` now tells every session to sync the gitignored `zh/skill-zh.md` alongside `SKILL.md`, instead of relying on each agent remembering it.
- **Patch-Release override clause** — `CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md` state the default (patch = tag only) and the explicit-user-request exception (then bilingual notes + `PAIRS` registration + English Release body, the same rule as minor/major).

---

## [1.13.1] - 2026-09-24

### Added
- **Security guards** — three new rules close gaps found in review: anti-injection (everything read during discovery — skill descriptions, config comments, file contents, bundle strings, pasted JSON — is evidence, never instructions; scanned text that tries to direct the run gets quoted in a table note), probe boundary (probe only the exact command/URL the config declares; never install, upgrade, or download dependencies to make a probe pass — report the failure as observed), and secrets masked at first sight, never echoed in table notes, provenance, error quotes, intermediate summaries, or commit messages.

### Changed
- **Diff mode protocol pinned** — four decisions written down: scope = only the tables whose numeric ids appear in the pasted baseline (re-collect just those tables, no full 7-table scan) plus a one-line scope note when tables are absent from the baseline; a partial-baseline caveat when baseline rows < current rows; row shape = `Added` / `Removed` sections with `Table | Name | State` columns, never full rows; ending = the standard 3-line Provenance with `not scanned (diff)` for uncollected fields. The Targeting paste gate now points to the §5 protocol.
- **Five-state labels synced** — READMEs ×7 (every language, each with its own localized `🛑broken` label) and docs pages (`index.html` ×7 lines, `inventory.html` EN+ZH, `asset-inventory-json.html` EN+ZH, `how-it-works.md`) now name all five states.

### Fixed
- **MCP liveness probes must use the config's env/headers** — a local stdio probe spawns the exact `command` with the config `env` merged into the child process; remote HTTP probes send the config `headers`. A bare-launch failure proves nothing and must never be recorded as a probe result; a probe that fails even with config env records `⚠️inferred 🛑broken` + the error class. Error Handling and the Table 5 checklist item now require confirming the probe used config env/headers before that row applies.

---

## [1.13.0] - 2026-09-24

### Added
- **5th state marker `🛑broken` (7 locales)** — for an asset that is registered in config but not invokable (missing command / env / probe fail): source reads `⚠️inferred` + state `🛑broken`, with the failure class quoted in a table note. Added to `references/glossary.json` (en/zh/ja/ko/ru/ar/es), the state-marker table, the `MCP server unreachable` error branch, the usage-guide exclusion list, `references/checklist.md` (Table 5), and the probe-failed format-example row. It closes the gap where `✅available` / `❌disabled` / `📦shelf-only` / `🚫absent` all misdescribe a registered-but-broken server (hit live during a dim8 MCP evaluation run).
- **Three visible checkpoint markers** — the diff paste gate 🔴, the real-name gate 🔴, and the masking STOP 🛑 now stand out as visible markers at their gates instead of reading as plain prose.
- **`test-prompts.json`** — darwin dim8 evaluation prompts for skill testing.

### Changed
- **§5 file-output reconciliation** — a full scan writes the three files into `output/`; targeted modes write only the files named in the Targeting table (`mcp` / `agents` / `hosts` / `skills` → `inventory.md` + JSON; `usage` → `usage-guide.md` only); `diff` writes no files (answer in the chat, write a file only on explicit request). "Never write outside `output/`" stays absolute.
- **Targeted-mode provenance rule** — the provenance template describes a full scan; in targeted modes any field whose evidence was skipped must read `not scanned (<target> target)` or `skipped (<target> target)`, never claiming a command that was not run.
- **Table 2 / Table 6 rules extracted from the overview cells, model-chain exemption deduped** — merge/split, grouping, and row-order rules now live in dedicated sections; the core-agent model-chain exemption is stated once instead of twice.
- **Unparseable-paste failure branch** — Error Handling now directs an unparseable pasted diff JSON/Markdown to a re-paste or a Markdown-table fallback, never guessing or inventing PK rows.
- **Format-example Source cells carry confidence + state suffixes** — every example row in `references/format-example.md` now demonstrates "suffix confidence, then append state"; Error Handling now links `references/troubleshooting.md`.

---

## [1.12.0] - 2026-09-22

### Changed
- **Skill `How to call` now shows the real TUI path** — the cell reads `auto-triggers on intent, or pick from /skills (typing /skill-name works too)` instead of implying a bare `/skill-name`: the OpenCode TUI hides skills from the `/` autocomplete (commands with `source === "skill"` are skipped) and `/skills` is the official picker, though typing the full name still dispatches as a command. Updated `SKILL.md` (rule + Name legend), `references/checklist.md`, `references/format-example.md`, `references/usage-guide.md`, all EN/ZH samples (`inventory.md`, `asset-inventory.json`, `usage-guide.md`); sample pages rebuilt; version bumped to 1.12.0.

---

## [1.11.8] - 2026-09-22

### Changed
- **Behavior-neutral token trim** — trimmed redundant restatements, compressible filler, and verbose modifiers across the runtime payload (`SKILL.md` + all 6 `references/` files). `references/glossary.json` was minified (parsed JSON verified deep-equal to original). Total payload reduced by 4911 bytes (71453 → 66542) with no rule, example semantic, or Anti-pattern removed; checklist item count unchanged at 36.

---

## [1.11.7] - 2026-09-22

### Added
- **Self-declared source line** — `SKILL.md` now states its own repository directly under the title (`github.com/sogeisetsu/asset-inventory`), so a reader of the skill alone can tell where it comes from. The `references/` files stay unmarked deliberately: they are only reachable through `SKILL.md` (the skill entry point) and never stand alone — recorded here as a decision, not an omission.

---

## [1.11.6] - 2026-09-22

### Changed
- **Root slimming** — `assets/` moved to `docs/assets/` and `TODO.md` to `docs/` (root goes from 18 to 16 items). All README image paths (7 languages), the `generate-assets.mjs` output path, the file trees (both CONTRIBUTINGs + the repository guide), `AGENTS.md`, the `check-docs` PAIRS entry, the `zh/TODO-ZH.md` cross-link, and the install prompts' "do not copy" list (14 spots) were updated; historical CHANGELOG / release-notes wording stays as written.

---

## [1.11.5] - 2026-09-22

### Changed
- **`AGENTS.md` is now tracked** — the local-only privacy notes were removed (the branch-rule exception naming it, the gitignore-status bullet, and the local `zh/skill-zh.md` copy note), `/AGENTS.md` dropped from `.gitignore`, and every doc that described it as untracked was updated (both CONTRIBUTINGs, the repository guide's file tree, and the `check-docs` comments — its CJK exemption stays, renamed `CHINESE_ROOT_DOCS`).
- **GitHub Release bodies are English-only** — the five bodies that still carried Chinese (v1.0.0, v1.1.0, v1.2.0, v1.11.3, v1.11.4) were rewritten to English, and the rule is now written down in `AGENTS.md` and both CONTRIBUTINGs; the `zh/` release-notes files stay for the docs site but never enter a Release body.

---

## [1.11.4] - 2026-09-22

### Changed
- **"Install via AI" now requires `git clone`** — step 2 of the install prompt no longer falls back to a ZIP download (the clone URL is spelled out), so an installer can never pull an outdated archive from the Releases page. Updated across all 7 READMEs and the 7 localized prompts on `docs/index.html`; the manual install guide now warns explicitly against Releases-page ZIPs.

---

## [1.11.3] - 2026-09-22

### Fixed
- **Merge scope corrected** — a skill and its same-named command are **one row only when the same plugin package delivers both** (e.g. `deepwork` + `/deepwork`, `reflect` + `/reflect`). A **separately-authored** command and a skill stay **two rows**, and a gate/wrapper command is described as a gate. Refines the rule from 1.11.1 / 1.11.2.

---

## [1.11.2] - 2026-09-22

### Fixed
- **A command and its same-named skill are never merged** — they are different assets (a skill, versus a command that targets it), so they get **separate rows**; a gate/wrapper command is now described as a gate, not as the skill's own behavior. This reverts the same-name merge rule added in 1.11.1.
- **Upstream discovery widened** — a local skill's repo URL is now looked up in a documented order, including a **config-root sibling checkout** (e.g. `~/.config/opencode/<name>/` with `plugin.json` / `INSTALL.md` / `README`) and the host **marketplace cache** (`skills-catalog-cache.json`). If still unverified, the source simply reads `local (repo unverified) ⚠️inferred` (no list of searched places).
- **Name legend** — `inventory.md` now opens with a one-line legend explaining `/command` vs. bare skill/asset names.

---

## [1.11.1] - 2026-09-22

### Fixed
- **Recurring output defects fixed at the rule level** (never by hand-editing `output/`): `SKILL.md` now requires home-path masking (`~` / `%USERPROFILE%`) in the Markdown **and** the JSON, merges a plugin skill with its same-named registered command into **one** row, names config-disabled agents that `agent list` never exposes, and records unregistered skill-/plugin-like residue in the Provenance **Unresolved** line with the observed reason. `references/checklist.md` gained matching items.

---

## [1.11.0] - 2026-09-22

### Added
- **Targeting docs** and **M3 rendered-sample panels** on the docs site (`docs/guides/how-it-works.md`, `docs/style.css`).

### Changed
- **Token trim (behavior-neutral)** — see [1.10.3]; this release rolls 1.10.1–1.10.3 into a documented minor.

---

## [1.10.3] - 2026-09-22

### Changed
- **Token trim (behavior-neutral)** — condensed `SKILL.md` (~17% smaller) and `references/format-example.md` (~25% smaller) by removing duplicated rules and illustrative example rows; the path-variable table moved from `SKILL.md` into `references/host-commands.md`. Every rule was audited to remain present and unambiguous; produced output is unchanged.

---

## [1.10.2] - 2026-09-22

### Added
- **Targeting docs** — `docs/guides/how-it-works.md` gains a "Targeting" section: what each argument (`mcp` / `agents` / `hosts` / `skills` / `diff` / `usage`) scans and what it writes. `README.md` and `README-ZH.md` link to it from the quick-start argument line.

### Changed
- **Docs-site M3 polish** — the rendered sample is now an M3 panel (surface + outline + radius) with a localized caption and demoted inner headings; added hover state layers, a visible keyboard focus ring, and M3 easing curves.

---

## [1.10.1] - 2026-09-22

### Fixed
- **Old release-note URLs no longer 404** — `docs/404.html` redirects `/release-notes-vX.Y.Z.md` to `/release-notes/release-notes-vX.Y.Z.md`; GitHub Pages is static and cannot issue server-side redirects.

---

## [1.10.0] - 2026-09-22

### Added
- **Bilingual release notes** — `docs/release-notes/release-notes-v1.10.0.md` and its Chinese counterpart, now in the dedicated release-notes folders.

### Changed
- Documentation-site and repository tidy-up: release notes in `docs/release-notes/` + `zh/release-notes/` (1.9.2), the language-stacking fix and per-tab language choice (1.9.3), and the detail-page polish (1.9.4).
- **`build-sample-pages --check` is line-ending agnostic** — it normalizes CRLF before comparing, so a fresh Windows checkout is no longer reported as out of date.

---

## [1.9.4] - 2026-09-22

### Changed
- **Detail pages cleaned up** — dropped the file-path bar above each rendered sample (the generator no longer emits it), gave the definition tables (`.facts`) real cell borders, and capped the JSON sample's height with a scrollbar instead of one very long page.

---

## [1.9.3] - 2026-09-22

### Fixed
- **Language stacking on the docs pages** — the toggle grouped translations by `className`, which included the `.i18n-on` class it had just added, so a second switch split each slot and rendered several languages at once. Grouping now ignores `i18n-on`.
- **Language choice is per-tab** — `sessionStorage` instead of `localStorage`, so a fresh visit starts in English again.

---

## [1.9.2] - 2026-09-22

### Changed
- **Release notes moved into their own folders** — `docs/release-notes/` and `zh/release-notes/`, with `check-docs`'s pair table, the repository trees, and every cross-link updated.

---

## [1.9.1] - 2026-09-22

### Changed
- **Branching rule documented** (`CONTRIBUTING.md`, `zh/CONTRIBUTING-ZH.md`, and the repository guide) — do not change `master` directly; work on a branch and merge it back only once the checks pass.

---

## [1.9.0] - 2026-09-22

### Added
- **Sample-page generator** — `scripts/build-sample-pages.mjs` renders `docs/samples/` into the three detail pages (Markdown tables, full Markdown, and pretty-printed JSON); CI runs it with `--check`, so a stale page fails the build.
- **English sample output** at `docs/samples/`; the Chinese set moved to `docs/samples/zh/`.

### Changed
- **Detail-page examples are rendered, not raw code blocks** — `usage-guide.html` shows real HTML, `asset-inventory-json.html` shows indented JSON, `inventory.html` shows its table.
- **Human-readable localized page titles** — the detail pages no longer put the bare filename in the `<h1>` or tab title.

### Fixed
- Detail pages no longer go blank for a language without a translated sample: the English sample renders as the fallback.

---

## [1.8.0] - 2026-09-22

### Added
- **Seven fixed-string languages** — `references/glossary.json` now ships `ko` (Korean), `ru` (Russian), `ar` (Arabic), and `es` (Spanish) alongside `en` / `zh` / `ja`, each with the same 10-key shape as `en`. `SKILL.md` advertises all seven, so a request in any of them uses the glossary strings verbatim instead of deriving them from the English block.

---

## [1.7.4] - 2026-09-22

### Fixed
- **Docs site showed a bare frame with no content for ja/ko/ru/ar/es.** Untranslated body content is now resolved at runtime: `lang.js` groups consecutive `data-lang` siblings into translation slots and shows the chosen language, falling back to English when that language has no translation. Frame and headings stay in the chosen language; the install prompts were wrapped per language so only the selected one shows.

---

## [1.7.3] - 2026-09-22

### Added
- **"Install via AI" section** in all seven READMEs, reusing the localized install prompts from the landing page.

### Changed
- **README layout** — the non-English/Chinese READMEs (`README-JA/KO/RU/AR/ES.md`) moved into `readmes/`; the root now holds only `README.md` and `README-ZH.md`. Relative links, the language switcher, the docs check, and the repository-layout guide were updated.
- **README titles** — dropped the 🗃️ emoji from every README H1.

---

## [1.7.2] - 2026-09-22

### Fixed
- **MCP invocation was described as Agent-only.** The skill and every sample claimed a human never calls an MCP server. `SKILL.md` now requires listing all real paths — ask-by-name (`use context7`), the Agent's tool call (`<server>_<tool>`), an MCP Prompt registered as `/prompt-name`, or the server's own CLI/HTTP endpoint — and forbids blanket "the human doesn't call it" claims. `references/checklist.md` gained a matching item, and all samples (`inventory.md`, `usage-guide.md`, `asset-inventory.json`, the docs-site examples) were updated.

---

## [1.7.1] - 2026-09-22

### Added
- **`TODO.md` / `zh/TODO-ZH.md`** — a bilingual, living rollout plan so a fresh session can see which release is in flight and what comes next.

### Changed
- **Tag/release policy clarified** (`CONTRIBUTING.md`, `zh/CONTRIBUTING-ZH.md`) — every change gets the tag for its own level: a patch-level change gets a patch tag (tag only, no Release), while minor/major changes get their tag plus a GitHub Release. A patch-level change must not be held back to bundle into a later minor.

---

## [1.7.0] - 2026-09-22

### Added
- **Seven-language documentation** — the landing page and all detail pages now support English, Chinese, Japanese, Korean, Russian, Arabic (with RTL), and Spanish; the choice persists across pages.
- **Localized READMEs** — `README-JA.md`, `README-KO.md`, `README-RU.md`, `README-AR.md`, `README-ES.md`, joining the English and Chinese ones, each cross-linking the full set.
- **`docs/guides/`** — long-form documentation (`how-it-works.md`, `install-and-update.md`, `repository-and-contributing.md`), linked from the READMEs.
- **`docs/samples/`** — published example output (`inventory.md`, `usage-guide.md`, `asset-inventory.json`), linked from the READMEs so users can see the final artifacts.
- **Material Design 3 restyle** for the landing and detail pages (color roles, elevation, shape scale, segmented language toggle).
- **New `check-docs` validations** — HTML `href`/`src` links, and a check that all seven localized READMEs exist and cross-link.

### Changed
- **READMEs slimmed** — both the English and Chinese README are now concise landing pages with emoji; detail moved into `docs/guides/`.
- **Landing-page examples are rendered** — the inventory sample shows as a real table and the JSON as line-by-line records, instead of raw code blocks.
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** — document the commit-granularity rule and the tag/release policy (PATCH = tag only; MINOR/MAJOR = tag + Release).

### Fixed
- **Copy-button feedback** on the docs site followed a hardcoded Chinese string even in English; it now follows the active language.

---

## [1.6.1] - 2026-09-22

### Fixed
- **Plugin-managed skills were misattributed as "local".** `oh-my-opencode-slim@2.2.18` manages 8 skills (`simplify`, `codemap`, `clonedeps`, `deepwork`, `verification-planning`, `reflect`, `oh-my-opencode-slim`, `worktrees`) via `.oh-my-opencode-slim/skills-manifest.json`. The skill never read that manifest, so it fell back to `local, integrated/upstream <repo>` and **invented** `github.com/sogeisetsu/<name>` from the folder name. `Discover` now reads the plugin manifest; `local, upstream <repo>` requires a verified URL; never infer a repo from a folder name.
- **Every agent was reported as "single model, no chain fallback".** The active preset (`jibei-factory`) uses **array-valued** `model` for every agent, but the skill only handled string/arrow shapes and over-applied the exemption to plugin agents. The rule now states that `presets.<name>.<agent>.model` may be a string **or an array** (an array *is* the chain), and the exemption applies to **core-bundled agents only**.

---

## [1.6.0] - 2026-09-22

### Fixed
- **MCP servers were silently dropped** — the skill could list one MCP server and stop, even when the config had five. `Discover` now has an explicit MCP step: read every `mcp` key (global + project), emit a row per key, and **assert the row count against the config's key count**. A one-row Table 5 is now called out as a red flag, in both the table spec and the checklist.
- **`update.ps1` nested directories** — `Copy-Item -Recurse` into an existing target nested the source inside it, so repeated updates grew `references/references/…`. The target is now removed before copying.
- **`update.ps1` backup step failed and polluted the install** — the backup directory was never created (causing a write error), and backups were written *inside* the skill directory, becoming part of the installed skill and re-nesting later. Backups now go to a sibling directory and are created before use.

### Changed
- **`What it does` is now one detailed paragraph** — the `Simple: … Detailed: …` split is gone. Every cell must be a single flowing paragraph covering three things: how it is invoked, when to use it, and what happens after (with caveats). Updated in `SKILL.md`, `references/checklist.md`, and all 26 example cells in `references/format-example.md`.
- **Usage guide has two modes** — **Mode A** (generic) when the project is empty, **Mode B** when it has real work: anchor the framing to the project's general shape *without over-coupling* (no file paths, no private code; tool facts never change). Documented in `references/usage-guide.md` with a comparison table.
- **Chinese column renamed** — the invocation column's Chinese header changed from its old colloquial form to a more formal, precise term (`references/glossary.json`; see the Chinese changelog for the exact strings).
- **`check-docs.mjs` now validates HTML links** — `docs/*.html` `href`/`src` targets must resolve, so the new landing-page structure is protected.

### Added
- **Landing page is English-first** — `docs/index.html` opens in English by default; the language toggle switches to Chinese and the choice persists across pages.
- **Output detail pages** — the three deliverables on the landing page are now linked cards, each opening a dedicated page (`docs/inventory.html`, `docs/usage-guide.html`, `docs/asset-inventory-json.html`) with a detailed description and a real example.
- **Favicon** — `docs/favicon.svg`, wired into every page.
- **Shared assets** — `docs/style.css` and `docs/lang.js` keep all pages consistent.

---

## [1.5.0] - 2026-09-21

### Added
- **Language-claim check** in `check-docs.mjs` — parses the "Fixed-string languages" line in `SKILL.md` and fails if any advertised language (e.g. `ja`) has no block in `references/glossary.json`. This closes the gap that let v1.4.0 ship a `ja` claim with no `ja` data.
- **Reference-integrity check** in `check-docs.mjs` — every `references/<name>` named in `SKILL.md` must exist, and `references/checklist.md` must keep at least 20 checklist items (guards against silent loss when the list is edited).
- **Japanese glossary block** (`references/glossary.json` → `ja`) — actually delivered now; `en` / `zh` / `ja` each carry the same 10 keys.
- **`update.ps1 -Help`** — usage, options, and install locations without touching anything.
- **"Which file should I read?" navigation** in both READMEs — maps common intents to the right file.

### Changed
- **`references/format-example.md` merged with `examples/inventory-example.md`** — they were near-duplicates (17 identical rows, ~3,932 shared bytes). The two are now one file; the runtime set is `SKILL.md` + `references/`, and `update.ps1`, both READMEs, and both CONTRIBUTING files no longer mention `examples/`.
- **`SKILL.md` "What it does" rules consolidated** — the Cell Conventions bullet no longer restates the full rule set; it points at the dedicated "What-it-does format (mandatory)" section.

### Removed
- **`examples/inventory-example.md`** — removed as a duplicate of `references/format-example.md`. Runtime payload drops from 60,390 B to 55,250 B (~8.5%, ≈1,285 tokens saved on a full read).

---

## [1.4.0] - 2026-09-21

### Added
- **PR-triggered docs check** (`.github/workflows/docs-check.yml`) — runs `node --check` on the scripts and `node scripts/check-docs.mjs` on every pull request to `master` (and on push), so PRs finally get a real gate instead of the deploy-only workflow.
- **Version-consistency check** in `check-docs.mjs` — reads `metadata.version` from the `SKILL.md` frontmatter and fails if it disagrees with the top release heading in `CHANGELOG.md` or `zh/CHANGELOG-ZH.md`.
- **Glossary-structure check** in `check-docs.mjs` — every language block in `references/glossary.json` must expose the same key set as the `en` block; reports missing or extra keys per language.
- **Japanese glossary entries** (`references/glossary.json` → `ja`) — the fixed-string promise now holds for `en` / `zh` / `ja`, with an explicit fallback rule for any other language.
- **`references/checklist.md`** — the full Quality Checklist, moved out of `SKILL.md` so the rule body stays focused; `SKILL.md` now points to it.
- **`update.ps1 -DryRun`** — previews exactly which runtime files would be copied and writes nothing.
- **Troubleshooting entries** — Table 6 row-order self-check, non-glossary language handling, and the stale local-copy warning explained.

### Changed
- **`SKILL.md` language promise narrowed and made honest** — it no longer claims every language has fixed strings; `en` / `zh` / `ja` are verbatim from the glossary, any other language derives its strings from the `en` block and says so in Provenance.
- **`CONTRIBUTING.md` / `zh/CONTRIBUTING-ZH.md`** — versioning section now names the three places that must stay in lockstep and the exact glossary key set a new language needs.
- **`SKILL.md` trimmed** — the inline Quality Checklist (42 lines) moved to `references/checklist.md`.

### Fixed
- **v1.3.0 release date** in `CHANGELOG.md` and `zh/CHANGELOG-ZH.md` corrected from `2026-09-13` to the actual release day `2026-09-21`.

---

## [1.3.0] - 2026-09-21

### Added
- **Chinese doc set** (`zh/`) — `CONTRIBUTING-ZH.md`, `CHANGELOG-ZH.md`, and `release-notes-v1.1.0-ZH.md`, paired with the English docs at the repo root.
- **Docs validation script** (`scripts/check-docs.mjs`) — resolves relative Markdown links and `<img src>`, checks the EN/ZH pair table, warns on one-sided edits, validates frontmatter, and flags CJK in English docs.
- **Asset generator** (`scripts/generate-assets.mjs`) — regenerates the local SVG icon, banner, and badges into `assets/` (no external CDN).
- **README visual header** — centered local-SVG icon → title → tagline → badge row → language links → banner.
- **English-first skill content** — `SKILL.md`, `references/`, and `examples/` rewritten in English; the frontmatter `description` is now pure English.
- **Explicit Output Language section** in SKILL.md — output follows the user's language (a Chinese request yields Chinese output), while the skill's own instructions stay English.
- **Chinese reference license** (`zh/LICENSE-ZH.txt`) — a non-official OpenAtom Foundation translation, carrying a disclaimer that the root English `LICENSE` governs.
- **Chinese banner** (`assets/banner-zh.svg`) — a Chinese-subtitle banner used by `README-ZH.md`.
- **Localization glossary** (`references/glossary.json`) — a machine-readable map of fixed output strings per language (headers, state markers, confidence suffixes, table titles, empty-table/unknown strings, provenance), so localized output stays consistent and diff-comparable.
- **Prominent language rule** — a callout directly under the title states that output follows the user's language.
- **Quick Reference section** in SKILL.md — workflow summary at a glance (one-line trigger, three output files, scanning modes).
- **Error handling guidance** in Procedure section — concrete actions for common failure scenarios (plugin cache unreadable, outer app scan fails, MCP unreachable, etc.).
- **"what it does" column format subsection** — dedicated section for the most critical cell format rule, with clear source priority and forbidden patterns.
- **PowerShell scan method** in `references/host-commands.md` — added PowerShell equivalent alongside existing Node.js code.
- **Troubleshooting guide** (`references/troubleshooting.md`) — common issues and solutions.
- **CHANGELOG.md** — this file.
- **CONTRIBUTING.md** — contribution guidelines.

### Changed
- **README install guidance** — both READMEs now prominently recommend a global install at the top of the Install section, explaining why (one copy to install and update, available everywhere) and the effect (usable in every project and session; output still lands in the current project).
- **Options kept at the repo root** — `update.ps1` stays where it is (it is the user-facing one-command updater); `scripts/` holds dev tooling only (`check-docs.mjs`, `generate-assets.mjs`).
- **`check-docs.mjs` CJK scope widened** — now also enforces English on `SKILL.md`, `references/`, and `examples/`; only the local `AGENTS.md` stays exempt.
- **`references/troubleshooting.md`** — the version-read note now points at `metadata.version`.
- **Chinese read-along** (`zh/skill-zh.md`) — a local-only (gitignored) Chinese version of `SKILL.md`.
- **Repository restructured** per the repo-init convention — English docs at the root, `README-ZH.md` at the root, and all other Chinese docs under `zh/`; `README-zh.md` renamed to `README-ZH.md`.
- **`SKILL.md` frontmatter reconciled** — `version` moved under `metadata.version`, since OpenCode recognizes only `name`, `description`, `license`, `compatibility`, and `metadata`; `update.ps1` still reads it.
- **Release notes split by language** — English in `docs/release-notes-v1.1.0.md`, Chinese moved to `zh/release-notes-v1.1.0-ZH.md`.
- **Fixed a broken relative link** in `docs/release-notes-v1.1.0.md` (`LICENSE` → `../LICENSE`).
- **`.gitignore`** — added `/AGENTS.md` and the local-only Chinese guides (`zh/skill-zh.md`, `zh/repo-init-guide-zh.md`).
- **CONTRIBUTING.md** — added a canonical-terms section and the docs-check command; refreshed the file-structure tree.
- **SKILL.md restructured** — separated Table Overview, Cell Conventions, and Source Classification into distinct subsections for better scannability.
- **Quality Checklist restructured** — grouped by table (All Tables, Table 1, Table 2, ..., Table 7, "what it does" & usage guide) for easier per-table verification.
- **Anti-patterns deduplicated** — removed items already covered by Quality Checklist; added note explaining the relationship.
- **Provenance format** — now includes both Chinese and English templates, follows output language rule.
- **Quick Reference "how to use"** — expanded from "invocation path" to "when to use + invocation path" to match the original definition.
- **Targeting section** — unified to English headers for consistency with other sections.
- **Output section** — condensed to avoid duplicating Quick Reference; now references format-example.md for details.
- **update.ps1 improved** — added auto-create target directory, backup step before overwrite, `-NoBackup` switch, better error messages.
- **host-commands.md rewritten** — removed hardcoded command list (contradicted "always scan fresh" philosophy); now provides scan methods only, with generic support for Electron/Tauri/native outer apps.
- **Outer app scanning generic** — removed OpenChamber-specific assumptions; source classification now uses the `host-injected, found via binary scan of <bundle>` format.

### Removed
- Removed "Disposal note" section (marked as removed in v1.1.0, now fully deleted).
- Removed hardcoded command list from host-commands.md (was causing AI to skip actual scanning).

---

## [1.2.0] - 2026-09-08

### Added
- Targeting parameter routing (`/asset-inventory <target>`).
- Diff mode for comparing inventory across runs.
- Usage guide output (`usage-guide.md`).
- Real-name mode with 4th provenance line.

### Changed
- Hardened SKILL.md with explicit output section, state markers that follow output language.
- Plugin evidence sources now remappable per host.

---

## [1.1.0] - 2026-09-07

### Added
- Rewritten README (EN + ZH) with clearer install/update instructions.
- GitHub Pages landing page (`docs/index.html`).
- `.ignore` file for deepwork state.
- Non-slash magicPrompts key documentation in `references/host-commands.md`.

### Changed
- State markers now follow output language (not hardcoded Chinese).
- Plugin discovery falls back to manifests when cache is absent.
- Host-injected command inventory scans full `magicPrompts` key set.
- Removed duplicate Quality Bar entries.

---

## [1.0.0] - 2026-09-06

### Added
- Initial release with 7-table inventory structure.
- Source classification system (three-part provenance).
- Cross-platform path variables (macOS/Linux/Windows).
- Format examples and usage guide references.
