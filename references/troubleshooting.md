# Troubleshooting

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

### Version read failure

`update.ps1` reads the version from the `metadata.version` field of the SKILL.md frontmatter. If it can't read it:
1. Check the frontmatter format (`version: x.y.z` under `metadata:`, with a space after the colon)
2. Check the file encoding (UTF-8 with BOM also works, but plain ASCII is safest)

### Diff mode doesn't work

1. You must have a previous `asset-inventory.json`
2. Paste the JSON content to the skill (don't paste just the file path)
3. Compare only on `table` + `name` as the primary key

### Inconsistent multilingual output

1. Language follows the language of the user's last message
2. The Provenance lines should also follow the output language (Chinese output uses Chinese Provenance, English uses English)
3. Table headers, state markers, and cell content all follow the user's language
