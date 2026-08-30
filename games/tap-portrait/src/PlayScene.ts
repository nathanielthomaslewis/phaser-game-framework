import Phaser from "phaser";
import { createHud, createPauseOverlay, createGameOver, theme } from "@ui";

const GAP = 280;
const PIPE_W = 90;
const SPEED = -180;

export class PlayScene extends Phaser.Scene {
  private score = 0;
  private dead = false;
  private bird!: Phaser.Physics.Arcade.Sprite;
  private pipes!: Phaser.Physics.Arcade.StaticGroup;
  private hud!: ReturnType<typeof createHud>;
  private over!: ReturnType<typeof createGameOver>;

  constructor() {
    super("play");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(theme.bg);
    this.dead = false;
    this.score = 0;

    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(theme.accent, 1);
    g.fillCircle(18, 18, 18);
    g.generateTexture("bird", 36, 36);
    g.destroy();

    this.bird = this.physics.add.sprite(width * 0.28, height * 0.45, "bird");
    this.bird.setCircle(18);
    this.bird.setCollideWorldBounds(true);
    this.bird.setGravityY(980);
    this.bird.setVelocityY(-280);

    this.pipes = this.physics.add.staticGroup();
    this.spawnPair();
    this.time.addEvent({ delay: 1600, loop: true, callback: () => !this.dead && this.spawnPair() });
    this.physics.add.overlap(this.bird, this.pipes, () => this.fail());

    this.hud = createHud(this);
    this.hud.setScore(0);
    const pause = createPauseOverlay(this, () => {
      this.physics.resume();
      this.time.paused = false;
      pause.hide();
    });
    this.over = createGameOver(this, () => this.scene.restart());
    this.hud.onPause(() => {
      if (this.dead) return;
      this.physics.pause();
      this.time.paused = true;
      pause.show();
    });
    this.hud.onMute((muted) => {
      this.sound.mute = muted;
    });

    this.input.on("pointerdown", () => {
      if (this.dead) return;
      this.bird.setVelocityY(-380);
    });
  }

  update() {
    if (this.dead) return;
    const { height } = this.scale;
    if (this.bird.y > height - 20 || this.bird.y < 20) this.fail();

    this.pipes.getChildren().forEach((obj) => {
      const s = obj as Phaser.Physics.Arcade.Image;
      s.x += SPEED * (this.game.loop.delta / 1000);
      if (!s.getData("scored") && s.getData("role") === "top" && s.x + PIPE_W < this.bird.x) {
        s.setData("scored", true);
        this.score += 1;
        this.hud.setScore(this.score);
      }
      if (s.x < -PIPE_W) s.destroy();
      if (typeof s.refreshBody === "function") s.refreshBody();
    });
  }

  private spawnPair() {
    const { width, height } = this.scale;
    const mid = Phaser.Math.Between(280, height - 280);
    const topH = mid - GAP / 2;
    const botY = mid + GAP / 2;
    const botH = height - botY;
    this.addPipe(width + 40, topH / 2, PIPE_W, topH, "top");
    this.addPipe(width + 40, botY + botH / 2, PIPE_W, botH, "bot");
  }

  private addPipe(x: number, y: number, w: number, h: number, role: string) {
    const key = `pipe-${Math.round(h)}`;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3d6b4f, 1);
      g.fillRect(0, 0, w, Math.max(8, h));
      g.generateTexture(key, w, Math.max(8, h));
      g.destroy();
    }
    const img = this.pipes.create(x, y, key) as Phaser.Physics.Arcade.Image;
    img.setData("role", role);
    img.setData("scored", false);
    img.refreshBody();
  }

  private fail() {
    if (this.dead) return;
    this.dead = true;
    this.bird.setVelocity(0, 0);
    this.physics.pause();
    this.over.show(this.score);
  }
}
