# Casual Game Factory

Phaser-first factory for a series of casual games.

**Ship order:** web + itch.io → Chrome Web Store / PWA → Capacitor iOS/Android.
**Winners only** get a Godot remake for native feel.

Games are named `{mechanic}-{orientation}`. One title at a time.

| | |
|---|---|
| Repo | [nathanielthomaslewis/phaser-game-framework](https://github.com/nathanielthomaslewis/phaser-game-framework) |
| Engine now | Phaser 4 + TypeScript + Vite |
| Engine later | Godot 4 (graduates) |
| Shared chrome | `shared/ui` — every game uses the same HUD, pause, mute, score |

## Current title

**`games/tap-portrait`** — Flappy-style one-tap flyer. First game because it proves shared UI, portrait lock, and itch zip in the shortest loop.

Everything else is a stub. Do not start a second mechanic until tap-portrait is playable on itch.

## Layout

```
shared/ui/            Shared HUD / buttons / theme / audio mute / safe-area
templates/phaser/     Clone this to start a title
games/                One folder per mechanic-orientation
graduates/godot/      Promoted winners only
docs/                 Roadmap, catalog, Grok CLI
.grok/                Agent skill + project rules
```

## How we iterate

1. Pick the next row in `docs/CATALOG.md` with status `next`.
2. Copy `templates/phaser` into `games/{mechanic}-{orientation}` if it is still a stub.
3. Build in Phaser with Grok CLI (`docs/GROK_CLI.md`).
4. Publish HTML5 to itch.
5. If it gets traction: copy systems into `graduates/godot/{same-name}` and export native.

Rules: one mechanic, one orientation, shared UI only. No new engine mid-title.

## Local

```bash
cd templates/phaser
npm install
npm run dev
```

When a game folder has its own `package.json`:

```bash
cd games/tap-portrait
npm install
npm run dev
```
