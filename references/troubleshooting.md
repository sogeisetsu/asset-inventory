# Troubleshooting

## Scan & output failures

| Scenario | Action |
|---|---|
| Plugin cache unreadable | `🚫absent` + table note: `plugin cache unreadable (<error>)` |
| Outer app bundle scan fails | note the failure reason in a table note; skip that source, don't fabricate |
| `opencode agent list` returns empty | check `opencode --pure agent list`; if still empty, write "no selectable agents detected" |
| MCP server unreachable | `⚠️inferred 🛑broken` + note: `liveness probe failed (<error>)` — this row applies only after the probe is confirmed to have used the config's env/headers |
| Config file missing or malformed | note the gap in a table note; don't guess defaults |
| Version unknown after all sources exhausted | write `unknown` — never invent |
| Language mismatch (user asks in English, config is Chinese) | follow the user's language for output; use English for technical terms |
| Pasted diff JSON/Markdown unparseable | ask the user to re-paste, or fall back to comparing the Markdown tables; never guess or invent PK rows |

## Common issues

### Skill not found (the `/asset-inventory` command doesn't appear)

1. Check the install location:
   - Global: `~/.config/opencode/skills/asset-inventory/SKILL.md` should exist
   - Project-scoped: `<project-root>/.opencode/skills/asset-inventory/SKILL.md` should exist
2. Check that the SKILL.md frontmatter is complete (`name`, `description`, `license`, `metadata` fields)
3. Restart OpenCode and try again

### No output generated (the `output/` directory is empty)

1. Check that the current directory is writable
2. Check whether the `output/` directory exists (it is created automatically if missing)
3. For a targeted mode (e.g. `/asset-inventory mcp`), confirm the argument is spelled correctly

### Inventory results are incomplete

1. Plugins: check the `plugin[]` config in `$OPENCODE_CONFIG/opencode.jsonc`
2. Host commands: you need a binary-safe scan of the outer app bundle (see `references/host-commands.md`)
3. Agents: run `opencode agent list` and `opencode --pure agent list` and compare
4. MCP: check the `mcp` section of `opencode.jsonc`

### Diff mode doesn't work

1. You must have a previous `asset-inventory.json`
2. Paste the JSON content to the skill (don't paste just the file path)
3. Compare only on `table` + `name` as the primary key

### Inconsistent multilingual output

1. Language follows the language of the user's last message
2. The Provenance lines should also follow the output language (Chinese output uses Chinese Provenance, English uses English)
3. Table headers, state markers, and cell content all follow the user's language
4. A language without a `references/glossary.json` entry is still supported: derive the fixed strings from the `en` block, keep the same shape, and say so in Provenance

### Table 6 agent order looks wrong

Row order is enforced. Before finishing, confirm all four groups appear in this order, alphabetical within each group:

1. core primary (`build`, `plan`)
2. plugin primary
3. core subagent
4. plugin subagent

Common slip: plugin primary above core, or subagent in primary block. Re-sort; this is a Quality Checklist item checked manually.
