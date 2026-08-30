// Single source of truth for all tunables. See CAS-2 core-loop-spec for rationale.
export const CONFIG = {
  world: {
    width: 720,
    height: 1280,
    groundY: 1180,
  },
  player: {
    x: 180,
    gravity: 2200,
    flapImpulse: -620,
    maxFallSpeed: 900,
    maxRiseSpeed: -620,
    rotationMaxUp: -25,
    rotationMaxDown: 90,
    rotationLerp: 10,
    radius: 28,
    hitboxShrink: 0.8,
  },
  obstacle: {
    width: 100,
    gapCenterMin: 280,
    gapCenterMax: 900,
    maxGapDelta: 260,
  },
  deathDebounceMs: 300,
  // Piecewise-linear difficulty curve, keyed on score. Interpolated continuously
  // between breakpoints; holds at the last row beyond its score.
  difficulty: [
    { score: 0, scrollSpeed: 220, gapHeight: 320, spacing: 420 },
    { score: 10, scrollSpeed: 260, gapHeight: 290, spacing: 380 },
    { score: 25, scrollSpeed: 300, gapHeight: 260, spacing: 340 },
    { score: 50, scrollSpeed: 320, gapHeight: 240, spacing: 320 },
    { score: 80, scrollSpeed: 340, gapHeight: 220, spacing: 300 },
  ],
} as const;

export type DifficultyParams = {
  scrollSpeed: number;
  gapHeight: number;
  spacing: number;
};

/** Linearly interpolate scroll speed / gap height / spacing for a given score. */
export function difficultyForScore(score: number): DifficultyParams {
  const rows = CONFIG.difficulty;
  if (score <= rows[0].score) return { ...rows[0] };
  const last = rows[rows.length - 1];
  if (score >= last.score) return { ...last };

  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (score >= a.score && score <= b.score) {
      const t = (score - a.score) / (b.score - a.score);
      return {
        scrollSpeed: a.scrollSpeed + (b.scrollSpeed - a.scrollSpeed) * t,
        gapHeight: a.gapHeight + (b.gapHeight - a.gapHeight) * t,
        spacing: a.spacing + (b.spacing - a.spacing) * t,
      };
    }
  }
  return { ...last };
}

export const BEST_SCORE_KEY = "tap-portrait:best-score";

export function loadBestScore(): number {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // localStorage unavailable (e.g. private mode) - best score just won't persist.
  }
}
