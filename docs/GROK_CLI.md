# Grok CLI (Grok Build)

Work from the repo root.

```bash
cd phaser-game-framework
grok
```

## Rules the agent must follow

Read `AGENTS.md` and `.grok/skills/new-game/SKILL.md` first.

- One game at a time. Current: `games/tap-portrait`.
- Shared UI lives in `shared/ui`. Games import it. Do not fork buttons per title.
- Name folders `{mechanic}-{orientation}`.
- Phaser until the catalog row says graduate.
- Do not start Godot files under `games/`. Godot only under `graduates/godot/`.

## Useful prompts

```
Implement tap-portrait from the Phaser template.
Use shared/ui for HUD, pause, mute, score, game-over.
Portrait lock. One tap to flap. Pipes. Score. Retry.
Keep it under one playable scene plus boot.
```

```
Do not touch other game folders. Parked titles stay stubs.
```

## MCP

Optional later:

- filesystem (built in)
- Godot MCP only when a winner is in `graduates/godot/`
- sprite generator MCP if you want generated art instead of Kenney

## Publish

```bash
cd games/tap-portrait
npm run build
# zip dist/ and butler push to itch
```
