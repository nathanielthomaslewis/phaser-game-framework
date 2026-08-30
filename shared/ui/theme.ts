export const theme = {
  bg: 0x0e1116,
  panel: 0x1a2030,
  panelAlpha: 0.92,
  accent: 0xf4c542,
  danger: 0xe85d4c,
  obstacle: 0x3f8f6b,
  text: "#f4f1ea",
  muted: "#9aa3b5",
  fontFamily: "Georgia, 'Times New Roman', serif",
  radius: 16,
  pad: 16,
} as const;

export type Orientation = "portrait" | "landscape";

export const view = {
  portrait: { width: 720, height: 1280 },
  landscape: { width: 1280, height: 720 },
} as const;
