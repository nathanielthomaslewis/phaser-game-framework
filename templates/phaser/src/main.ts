import Phaser from "phaser";
import { theme, view, type Orientation } from "@ui";
import { PlayScene } from "./PlayScene";

const orientation = (document.documentElement.dataset.orientation ||
  "portrait") as Orientation;
const size = view[orientation];

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: theme.bg,
  width: size.width,
  height: size.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } },
  scene: [PlayScene],
});
