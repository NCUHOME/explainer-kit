// Palette from .claude/skills/explainer-video/references/STYLE.md §2: four hues × five tones (darkest → lightest,
// index 2 is the base), one dark neutral, one cream, one ink.
export type Hue = readonly [string, string, string, string, string];

import { BRAND } from "../brand";

export const HUES = {
  // "blue" is the brand hue (public/brand/brand.json → primary)
  blue: BRAND.primary,
  red: ["#7A2820", "#B23A2F", "#D4483B", "#EC9A8F", "#F8D8D2"],
  green: ["#1D5236", "#2C7A4E", "#3F9A66", "#98CFAB", "#DAEFE1"],
  teal: ["#0C566B", "#157E98", "#2BA2BF", "#8ED2E2", "#D5EFF5"],
} as const satisfies Record<string, Hue>;

export const NEUTRAL = "#15181F";
export const CREAM = "#F6F2EA";
export const INK = "#15181F";

export const FONT_CN = "Noto Sans SC";
export const FONT_LATIN = "Inter Tight";
export const FONT_MONO = "DM Mono";

export const CELL = 180; // grid cell = 1/6 of 1080

/** Deterministic PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Mix two hex colours; t=0 → a, t=1 → b. */
export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};
