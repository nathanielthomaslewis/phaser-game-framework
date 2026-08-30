import Phaser from "phaser";
import { theme } from "./theme";

export function createPauseOverlay(scene: Phaser.Scene, onResume: () => void) {
  const { width, height } = scene.scale;
  const root = scene.add.container(0, 0).setDepth(2000).setScrollFactor(0);
  const dim = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55);
  const label = scene.add
    .text(width / 2, height / 2 - 24, "paused", {
      fontFamily: theme.fontFamily,
      fontSize: "40px",
      color: theme.text,
    })
    .setOrigin(0.5);
  const resume = scene.add
    .text(width / 2, height / 2 + 40, "resume", {
      fontFamily: theme.fontFamily,
      fontSize: "28px",
      color: "#0e1116",
      backgroundColor: "#f4c542",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  resume.on("pointerup", onResume);
  root.add([dim, label, resume]);
  root.setVisible(false);

  return {
    show: () => root.setVisible(true),
    hide: () => root.setVisible(false),
  };
}
