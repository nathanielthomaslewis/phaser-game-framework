# Roadmap

Phaser first. Godot only after a title proves itself.

## Phase 0 — Factory (this commit)

- [x] Naming: `{mechanic}-{orientation}`
- [x] Shared UI contract
- [x] Phaser template
- [x] Genre stubs + competitor list
- [x] Grok CLI notes
- [x] GitHub remote: nathanielthomaslewis/phaser-game-framework

## Phase 1 — Prove the loop

**Title:** `tap-portrait`

- [ ] Boot Phaser 4 with portrait lock + shared HUD
- [ ] One tap = flap / jump. Obstacles. Score. Game over. Retry.
- [ ] Mute, pause, safe-area insets from `shared/ui`
- [ ] itch.io HTML5 zip
- [ ] Optional PWA / CWS hosted app

Done when a stranger can play from an itch link on a phone in portrait.

## Phase 2 — Second title (only after Phase 1 ships)

Pick from catalog. Suggested: `runner-landscape` (Jetpack Joyride class) so we prove landscape + shared UI in the other orientation.

## Phase 3 — Series cadence

For each remaining stub:

1. Clone template
2. One mechanic
3. itch in days, not weeks
4. Stop if it does not hold a session

Do not build two games in parallel.

## Phase 4 — Graduate winners to Godot

A winner is a title that people replay or that you want on native stores with a tighter feel.

Then:

```
games/{name}          stay as web / itch source of truth
graduates/godot/{name}  Godot 4 remake, same UI language
```

Godot exports: Android, iOS, HTML5 fallback.

## Phase 5 — Stores

Capacitor wrap of Phaser *or* Godot native export. Not both for the same title unless there is a reason.

## Kill rules

- No Unreal
- No Unity unless a title specifically needs that ads/IAP stack
- No extra mechanics bolted onto a shipped loop
- Shared UI does not become a different skin per game — theme tokens only
