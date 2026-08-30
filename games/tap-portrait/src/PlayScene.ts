import Phaser from "phaser";
import { createHud, createPauseOverlay, createGameOver, theme } from "@ui";
import { CONFIG, difficultyForScore, loadBestScore, saveBestScore } from "./config";

type GameState = "ready" | "playing" | "dead";

type Pipe = Phaser.Physics.Arcade.Image & {
  getData(key: "role"): "top" | "bot";
  getData(key: "scored"): boolean;
};

export class PlayScene extends Phaser.Scene {
  private state: GameState = "ready";
  private score = 0;
  private best = 0;
  private bird!: Phaser.Physics.Arcade.Sprite;
  private pipes!: Phaser.Physics.Arcade.StaticGroup;
  private hud!: ReturnType<typeof createHud>;
  private over!: ReturnType<typeof createGameOver>;
  private readyPrompt!: Phaser.GameObjects.Text;
  private velocityY = 0;
  private lastGapCenterY: number | null = null;
  private distanceSinceSpawn = 0;
  private deathAt = 0;

  /** v2 hook: fired the instant an obstacle is cleared (gap-center X pass). */
  onObstacleCleared: (score: number) => void = () => {};

  constructor() {
    super("play");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(theme.bg);
    this.state = "ready";
    this.score = 0;
    this.best = loadBestScore();
    this.velocityY = 0;
    this.lastGapCenterY = null;
    this.distanceSinceSpawn = 0;
    this.deathAt = 0;

    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(theme.accent, 1);
    g.fillCircle(18, 18, 18);
    g.generateTexture("bird", 36, 36);
    g.destroy();

    this.bird = this.physics.add.sprite(CONFIG.player.x, height * 0.45, "bird");
    // HITBOX_SHRINK: collider is smaller than the visual sprite for forgiveness.
    const hitRadius = CONFIG.player.radius * CONFIG.player.hitboxShrink;
    this.bird.setCircle(hitRadius, 18 - hitRadius, 18 - hitRadius);
    this.bird.setGravityY(0); // gravity is integrated manually below (clamped rise/fall).

    this.pipes = this.physics.add.staticGroup();
    this.physics.add.overlap(this.bird, this.pipes, () => this.state === "playing" && this.fail());

    this.hud = createHud(this);
    this.hud.setScore(0);
    const pause = createPauseOverlay(this, () => {
      this.physics.resume();
      this.time.paused = false;
      pause.hide();
    });
    this.over = createGameOver(this, () => this.retry());
    this.hud.onPause(() => {
      if (this.state !== "playing") return;
      this.physics.pause();
      this.time.paused = true;
      pause.show();
    });
    this.hud.onMute((muted) => {
      this.sound.mute = muted;
    });

    this.readyPrompt = this.add
      .text(width / 2, height * 0.65, "Tap to Start", {
        fontFamily: theme.fontFamily,
        fontSize: "32px",
        color: theme.text,
      })
      .setOrigin(0.5);

    this.input.on("pointerdown", () => this.handleInput());
    this.input.keyboard?.on("keydown-SPACE", () => this.handleInput());
  }

  private handleInput() {
    if (this.state === "ready") {
      this.state = "playing";
      this.readyPrompt.setVisible(false);
      this.flap();
      return;
    }
    if (this.state === "playing") {
      this.flap();
      return;
    }
    if (this.state === "dead") {
      // Input debounce after death - ignore an accidental tap on the death screen.
      if (this.time.now - this.deathAt < CONFIG.deathDebounceMs) return;
      this.retry();
    }
  }

  private flap() {
    this.velocityY = CONFIG.player.flapImpulse;
  }

  private retry() {
    this.scene.restart();
  }

  update(_time: number, deltaMs: number) {
    const dt = deltaMs / 1000;
    const { height } = this.scale;

    if (this.state === "ready") {
      // Idle bob while waiting for the first tap.
      this.bird.y = height * 0.45 + Math.sin(this.time.now / 300) * 12;
      this.bird.rotation = 0;
      return;
    }

    if (this.state === "dead") return;

    const difficulty = difficultyForScore(this.score);

    // Manual gravity integration per spec: flap hard-resets velocity (not
    // additive, so rapid taps can't stack impulse), clamped both directions.
    this.velocityY = Phaser.Math.Clamp(
      this.velocityY + CONFIG.player.gravity * dt,
      CONFIG.player.maxRiseSpeed,
      CONFIG.player.maxFallSpeed,
    );
    this.bird.y += this.velocityY * dt;

    // Ceiling clamps position (no death) unless an obstacle occupies that space.
    if (this.bird.y < CONFIG.player.radius) {
      this.bird.y = CONFIG.player.radius;
      if (this.velocityY < 0) this.velocityY = 0;
    }
    // Ground is always an instant death.
    if (this.bird.y >= CONFIG.world.groundY) {
      this.fail();
      return;
    }

    // Rotation eases toward a target angle derived from vertical velocity.
    const riseRatio = Phaser.Math.Clamp(this.velocityY / CONFIG.player.maxRiseSpeed, 0, 1);
    const fallRatio = Phaser.Math.Clamp(this.velocityY / CONFIG.player.maxFallSpeed, 0, 1);
    const targetDeg =
      this.velocityY < 0
        ? Phaser.Math.Linear(0, CONFIG.player.rotationMaxUp, riseRatio)
        : Phaser.Math.Linear(0, CONFIG.player.rotationMaxDown, fallRatio);
    const targetRad = Phaser.Math.DegToRad(targetDeg);
    this.bird.rotation = Phaser.Math.Angle.RotateTo(
      this.bird.rotation,
      targetRad,
      CONFIG.player.rotationLerp * dt,
    );

    // Frame-rate independent scroll + spawn spacing, both measured as scroll distance.
    const scrollDelta = difficulty.scrollSpeed * dt;
    this.distanceSinceSpawn += scrollDelta;
    if (this.distanceSinceSpawn >= difficulty.spacing) {
      this.distanceSinceSpawn -= difficulty.spacing;
      this.spawnPair(difficulty.gapHeight);
    }

    this.pipes.getChildren().forEach((obj) => {
      const s = obj as Pipe;
      s.x -= scrollDelta;
      // Gap-center X = pipe pair's x (top and bot spawn on the same x).
      if (!s.getData("scored") && s.getData("role") === "top" && s.x <= this.bird.x) {
        s.setData("scored", true);
        this.score += 1;
        this.hud.setScore(this.score);
        this.onObstacleCleared(this.score);
      }
      if (s.x < -CONFIG.obstacle.width) s.destroy();
      if (typeof s.refreshBody === "function") s.refreshBody();
    });
  }

  private spawnPair(gapHeight: number) {
    const { width, height } = this.scale;
    let gapCenterY = Phaser.Math.Between(
      CONFIG.obstacle.gapCenterMin,
      CONFIG.obstacle.gapCenterMax,
    );
    if (this.lastGapCenterY !== null) {
      const delta = Phaser.Math.Clamp(
        gapCenterY - this.lastGapCenterY,
        -CONFIG.obstacle.maxGapDelta,
        CONFIG.obstacle.maxGapDelta,
      );
      gapCenterY = this.lastGapCenterY + delta;
    }
    this.lastGapCenterY = gapCenterY;

    const topH = gapCenterY - gapHeight / 2;
    const botY = gapCenterY + gapHeight / 2;
    const botH = height - botY;
    const spawnX = width + CONFIG.obstacle.width / 2 + 40;

    this.addPipe(spawnX, topH / 2, CONFIG.obstacle.width, topH, "top");
    this.addPipe(spawnX, botY + botH / 2, CONFIG.obstacle.width, botH, "bot");
  }

  private addPipe(x: number, y: number, w: number, h: number, role: "top" | "bot") {
    const key = `pipe-${Math.round(h)}`;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(theme.obstacle, 1);
      g.fillRect(0, 0, w, Math.max(8, h));
      g.generateTexture(key, w, Math.max(8, h));
      g.destroy();
    }
    const img = this.pipes.create(x, y, key) as Pipe;
    img.setData("role", role);
    img.setData("scored", false);
    img.refreshBody();
  }

  private fail() {
    if (this.state !== "playing") return;
    this.state = "dead";
    this.deathAt = this.time.now;
    this.velocityY = 0;
    this.physics.pause();
    const isNewBest = this.score > this.best;
    if (isNewBest) {
      this.best = this.score;
      saveBestScore(this.best);
    }
    this.over.show(this.score, isNewBest);
  }
}
