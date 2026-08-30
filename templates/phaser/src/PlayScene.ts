import Phaser from "phaser";
import { createHud, createPauseOverlay, createGameOver, theme } from "@ui";

export class PlayScene extends Phaser.Scene {
  private score = 0;
  private paused = false;

  constructor() {
    super("play");
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, "replace this with the mechanic", {
        fontFamily: theme.fontFamily,
        fontSize: "28px",
        color: theme.muted,
        align: "center",
        wordWrap: { width: width - 80 },
      })
      .setOrigin(0.5);

    const hud = createHud(this);
    const pause = createPauseOverlay(this, () => {
      this.paused = false;
      this.physics.resume();
      pause.hide();
    });
    const over = createGameOver(this, () => this.scene.restart());

    hud.setScore(this.score);
    hud.onPause(() => {
      this.paused = true;
      this.physics.pause();
      pause.show();
    });
    hud.onMute((muted) => {
      this.sound.mute = muted;
    });

    void over;
    void this.paused;
  }
}
