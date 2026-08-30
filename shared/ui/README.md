# Shared UI

Every game uses this chrome so the series looks like one studio.

| Piece | Job |
|---|---|
| `theme.ts` | Colours, type, portrait/landscape sizes |
| `hud.ts` | Score, mute, pause button, safe-area pad |
| `pause.ts` | Dim + resume / retry |
| `gameOver.ts` | Final score + retry |

Games may change copy and accent via tokens. Do not draw a different pause button per title.

Safe area: pad `env(safe-area-inset-*)` on the parent page and keep HUD inside the Phaser camera with a 48px top/bottom reserve.
