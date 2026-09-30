import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CREAM, FONT_CN, FONT_LATIN, FONT_MONO, HUES, INK } from "../picto/palette";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const BACK_OUT = Easing.bezier(0.34, 1.56, 0.64, 1);

/** 0→1, exponential ease-out. */
export const inn = (f: number, at: number, dur = 14) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: EXPO_OUT });
/** 0→1 with overshoot (pop-ins; STYLE.md: use sparingly). */
export const pop = (f: number, at: number, dur = 10) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: BACK_OUT });
/** Step a frame to twos (12 fps feel) for hand-made motion. */
export const twos = (f: number) => Math.floor(f / 2) * 2;

/** Text that slides up out of a mask (STYLE.md §3). */
export const MaskUp: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dur?: number }> = ({ at, children, style, dur = 16 }) => {
  const f = useCurrentFrame();
  const t = inn(f, at, dur);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ translate: `0px ${(1 - t) * 110}%` }}>{children}</div>
    </div>
  );
};

/** Procedural foley from tools/score.py (public/sfx/gen). */
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/gen/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const grain = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;
export const Grain: React.FC = () => <AbsoluteFill style={{ backgroundImage: grain, mixBlendMode: "multiply", pointerEvents: "none" }} />;

/** Sun disc with the one allowed gradient: a faint light sweep. */
export const SunDisc: React.FC<{ cx: number; cy: number; r: number; color: string; scale?: number }> = ({ cx, cy, r, color, scale = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <defs>
      <linearGradient id={`sw${Math.round(cx)}_${Math.round(cy)}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.14" />
        <stop offset="0.58" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r * scale} fill={color} />
    <circle cx={cx} cy={cy} r={r * scale} fill={`url(#sw${Math.round(cx)}_${Math.round(cy)})`} />
  </svg>
);

/** Numbered medallion: ink disc with a paper numeral. */
export const Medallion: React.FC<{ n: React.ReactNode; size?: number; bg?: string; fg?: string; style?: React.CSSProperties }> = ({ n, size = 104, bg = HUES.blue[0], fg = CREAM, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_LATIN,
      fontWeight: 900,
      fontSize: size * 0.6,
      flexShrink: 0,
      ...style,
    }}
  >
    {n}
  </div>
);

/** Paper detail tag with a star bullet; pops on the action beat. */
export const Tag: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; star?: string }> = ({ at, children, style, star = HUES.red[2] }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 10);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: CREAM,
        border: `3px solid ${HUES.blue[0]}`,
        padding: "8px 20px",
        fontFamily: FONT_CN,
        fontWeight: 700,
        fontSize: 30,
        color: INK,
        opacity: Math.min(1, p * 1.6),
        scale: String(0.7 + 0.3 * p),
        transformOrigin: "left center",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ color: star, fontFamily: FONT_LATIN, fontWeight: 900 }}>✱</span>
      {children}
    </div>
  );
};

/** Step header: medallion + "STEP n OF N" + title; slides in on twos. */
export const StepHeader: React.FC<{ n: number; of?: number; title: string; at?: number; top?: number }> = ({ n, of = 4, title, at = 0, top = 176 }) => {
  const f = twos(useCurrentFrame());
  const t = inn(f, at, 12);
  return (
    <div style={{ position: "absolute", left: 72, top, display: "flex", alignItems: "center", gap: 24, opacity: t, translate: `${(1 - t) * -60}px 0px` }}>
      <Medallion n={n} />
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 6, color: HUES.blue[1] }}>
          STEP {n} OF {of}
        </div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 64, color: INK, letterSpacing: 2, marginTop: 4 }}>{title}</div>
      </div>
    </div>
  );
};

/**
 * Round call-out showing a real screenshot at native-ish scale.
 * `view` = which screenshot point sits at the centre, and the zoom.
 */
export const Callout: React.FC<{
  cx: number;
  cy: number;
  r: number;
  src: string;
  view: { x: number; y: number; zoom: number };
  open: number; // 0..1 scale-in
  children?: React.ReactNode; // overlay in call-out coordinates (0..2r)
}> = ({ cx, cy, r, src, view, open, children }) => {
  if (open <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        overflow: "hidden",
        background: "#fff",
        boxShadow: `0 0 0 12px ${CREAM}, 0 0 0 16px ${HUES.blue[0]}`,
        scale: String(open),
      }}
    >
      <Img src={staticFile(src)} style={{ position: "absolute", width: 900 * view.zoom, maxWidth: "none", left: r - view.x * view.zoom, top: r - view.y * view.zoom }} />
      {children}
    </div>
  );
};

/** Pictogram fingertip tapping at (x, y) inside a call-out; enters from the right. */
export const Tap: React.FC<{ x: number; y: number; at: number; r: number; dir?: [number, number] }> = ({ x, y, at, r, dir = [280, 60] }) => {
  const f = useCurrentFrame();
  const inT = inn(f, at - 10, 10);
  const press = interpolate(f, [at, at + 3, at + 8], [0, 1, 0], clamp);
  const ring = interpolate(f, [at, at + 16], [0, 1], clamp);
  const len = Math.hypot(dir[0], dir[1]);
  const ux = dir[0] / len;
  const uy = dir[1] / len;
  const ox = (1 - inT) * 300 * ux;
  const oy = (1 - inT) * 300 * uy;
  return (
    <svg width={r * 2} height={r * 2} style={{ position: "absolute", left: 0, top: 0 }}>
      {ring > 0 && ring < 1 ? <circle cx={x} cy={y} r={30 + ring * 90} fill="none" stroke={HUES.blue[0]} strokeWidth={5} opacity={1 - ring} /> : null}
      <g transform={`translate(${ox - press * 6 * ux},${oy - press * 6 * uy})`}>
        <line x1={x + dir[0]} y1={y + dir[1]} x2={x + ux * 22} y2={y + uy * 22} stroke={HUES.blue[0]} strokeWidth={44} strokeLinecap="round" />
        <circle cx={x + ux * 8} cy={y + uy * 8} r={20} fill={HUES.blue[0]} stroke={CREAM} strokeWidth={5} />
      </g>
    </svg>
  );
};

/** Head-and-shoulders pictogram (for photo rules). */
export const Bust: React.FC<{ cx: number; cy: number; s: number; color: string }> = ({ cx, cy, s, color }) => (
  <g>
    <circle cx={cx} cy={cy - 0.42 * s} r={0.26 * s} fill={color} />
    <path
      d={`M${cx - 0.62 * s},${cy + 0.62 * s} L${cx - 0.62 * s},${cy + 0.2 * s} Q${cx - 0.62 * s},${cy - 0.08 * s} ${cx - 0.3 * s},${cy - 0.08 * s} L${cx + 0.3 * s},${cy - 0.08 * s} Q${cx + 0.62 * s},${cy - 0.08 * s} ${cx + 0.62 * s},${cy + 0.2 * s} L${cx + 0.62 * s},${cy + 0.62 * s} Z`}
      fill={color}
    />
  </g>
);
