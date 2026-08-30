# Agent rules

This is a Phaser-first casual factory.

1. Only implement the catalog row marked `next` or `phaser`.
2. Game ids are `{mechanic}-{orientation}` (example: `fps-landscape`, `tap-portrait`).
3. All chrome comes from `shared/ui`. Tokens in `shared/ui/theme.ts`.
4. Do not add Unity or Unreal.
5. Do not create Godot projects inside `games/`.
6. Prefer Kenney-style simple shapes over custom art pipelines.
7. Each game is one mechanic. If you want a second mechanic, that is a new folder.
8. When scaffolding a new title, copy `templates/phaser` and fill that game's README status.
