import Phaser from "phaser";
import { theme } from "./theme";

export type HudHandles = {
  setScore: (n: number) => void;
  onPause: (fn: () => void) => void;
  onMute: (fn: (muted: boolean) => void) => void;
};

export function createHud(scene: Phaser.Scene): HudHandles {
  const { width } = scene.scale;
  const score = scene.add
    .text(width / 2, 48, "0", {
      fontFamily: theme.fontFamily,
      fontSize: "48px",
      color: theme.text,
    })
    .setOrigin(0.5, 0)
    .setScrollFactor(0)
    .setDepth(1000);

  const pause = scene.add
    .text(width - 48, 48, "II", {
      fontFamily: theme.fontFamily,
      fontSize: "28px",
      color: theme.text,
    })
    .setOrigin(1, 0)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
    .setDepth(1000);

  const mute = scene.add
    .text(48, 48, "\u266A", {
      fontFamily: theme.fontFamily,
      fontSize: "28px",
      color: theme.text,
    })
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
    .setDepth(1000);

  let muted = false;
  let pauseFn = () => {};
  let muteFn: (m: boolean) => void = () => {};

  pause.on("pointerup", () => pauseFn());
  mute.on("pointerup", () => {
    muted = !muted;
    mute.setAlpha(muted ? 0.4 : 1);
    muteFn(muted);
  });

  return {
    setScore: (n) => score.setText(String(n)),
    onPause: (fn) => {
      pauseFn = fn;
    },
    onMute: (fn) => {
      muteFn = fn;
    },
  };
}
