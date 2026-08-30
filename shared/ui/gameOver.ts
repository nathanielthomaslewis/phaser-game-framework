import Phaser from "phaser";
import { theme } from "./theme";

export function createGameOver(scene: Phaser.Scene, onRetry: () => void) {
  const { width, height } = scene.scale;
  const root = scene.add.container(0, 0).setDepth(2000).setScrollFactor(0);
  const dim = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
  const title = scene.add
    .text(width / 2, height / 2 - 48, "game over", {
      fontFamily: theme.fontFamily,
      fontSize: "44px",
      color: theme.text,
    })
    .setOrigin(0.5);
  const score = scene.add
    .text(width / 2, height / 2 + 8, "score 0", {
      fontFamily: theme.fontFamily,
      fontSize: "24px",
      color: theme.muted,
    })
    .setOrigin(0.5);
  const retry = scene.add
    .text(width / 2, height / 2 + 64, "retry", {
      fontFamily: theme.fontFamily,
      fontSize: "28px",
      color: "#0e1116",
      backgroundColor: "#f4c542",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  retry.on("pointerup", onRetry);
  root.add([dim, title, score, retry]);
  root.setVisible(false);

  return {
    show: (n: number) => {
      score.setText(`score ${n}`);
      root.setVisible(true);
    },
    hide: () => root.setVisible(false),
  };
}
