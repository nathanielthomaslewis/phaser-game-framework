# New factory game

Use when scaffolding or implementing a title in this repo.

## Do

- Clone `templates/phaser` into `games/{mechanic}-{orientation}`
- Set orientation in game config (`portrait` or `landscape`)
- Import HUD, pause, mute, score, game-over from `shared/ui`
- Implement one mechanic only
- Update `docs/CATALOG.md` status

## Do not

- Start a second game while another is `next` or `phaser`
- Duplicate button styles
- Add Godot files under `games/`
