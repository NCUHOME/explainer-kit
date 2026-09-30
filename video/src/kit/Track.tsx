import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Fine grain as an SVG turbulence tile — gives flat colour a printed/rubber feel. */
const grain = (opacity: number, freq = 0.9) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`;

/** Warm paper background with grain. */
export const Paper: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <AbsoluteFill style={{ backgroundImage: grain(0.06, 1.1), mixBlendMode: "multiply" }} />
  </AbsoluteFill>
);

/**
 * Rubber running-track surface with white lane lines.
 * `direction` is the running direction; lines run along it. `scroll` moves
 * the surface texture to suggest speed.
 */
export const TrackSurface: React.FC<{
  direction?: "horizontal" | "vertical";
  lanes?: number;
  scroll?: number;
  style?: React.CSSProperties;
}> = ({ direction = "horizontal", lanes = 6, scroll = 0, style }) => {
  const horiz = direction === "horizontal";
  const pct = 100 / lanes;
  const lines = `repeating-linear-gradient(${horiz ? "180deg" : "90deg"}, transparent 0, transparent calc(${pct}% - 5px), rgba(255,255,255,0.92) calc(${pct}% - 5px), rgba(255,255,255,0.92) ${pct}%)`;
  return (
    <div style={{ position: "absolute", overflow: "hidden", background: C.track, ...style }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: lines }} />
      <div
        style={{
          position: "absolute",
          inset: -240,
          backgroundImage: grain(0.35, 1.4),
          backgroundPosition: horiz ? `${-scroll}px 0px` : `0px ${-scroll}px`,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${horiz ? "180deg" : "90deg"}, rgba(0,0,0,0.10), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.12))`,
        }}
      />
    </div>
  );
};

/**
 * A slanted band of track that sweeps right→left across the frame, fully
 * covering it at `at` (the cut point). Plays a whoosh.
 */
export const TrackWipe: React.FC<{ at: number; dur?: number }> = ({ at, dur = 18 }) => {
  const frame = useCurrentFrame();
  const start = at - dur / 2;
  const visible = frame >= start - 1 && frame <= start + dur + 1;
  const x = interpolate(frame, [start, start + dur], [2100, -2900], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {visible ? (
        <TrackSurface
          lanes={8}
          scroll={frame * 30}
          style={{ left: x, top: -120, width: 2700, height: 1320, transform: "skewX(-14deg)", zIndex: 50 }}
        />
      ) : null}
      <Sequence from={Math.max(0, Math.round(start))} durationInFrames={10} layout="none">
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.55} />
      </Sequence>
    </>
  );
};

/** Hand-drawn ellipse that draws itself (slight overshoot loop, uneven stroke). */
export const ScribbleCircle: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  stroke?: number;
  dur?: number;
}> = ({ at, x, y, w, h, color = C.track, stroke = 7, dur = 14 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  if (p <= 0) return null;
  // Slightly wobbly loop that overshoots its start, like a marker circle.
  const rx = w / 2;
  const ry = h / 2;
  const pts: string[] = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2 * 1.12 - 2.1;
    const wob = 1 + 0.035 * Math.sin(i * 0.9) + 0.02 * Math.cos(i * 2.3);
    const grow = 1 + 0.06 * (i / N);
    pts.push(`${(rx + 10 + Math.cos(t) * rx * wob * grow).toFixed(1)},${(ry + 10 + Math.sin(t) * ry * wob * grow).toFixed(1)}`);
  }
  const d = `M${pts.join(" L")}`;
  return (
    <svg
      width={w + 40}
      height={h + 40}
      style={{ position: "absolute", left: x - 10, top: y - 10, overflow: "visible", zIndex: 20 }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/** Hand-drawn underline stroke. */
export const ScribbleUnderline: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  color?: string;
  stroke?: number;
}> = ({ at, x, y, w, color = C.track, stroke = 8 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  if (p <= 0) return null;
  const d = `M4,${14} C${w * 0.25},${6} ${w * 0.55},${18} ${w * 0.8},${9} S${w - 6},${12} ${w},${7}`;
  return (
    <svg width={w + 10} height={30} style={{ position: "absolute", left: x, top: y, overflow: "visible", zIndex: 20 }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/** Keyword slam: scales down from big with a quick settle and a tiny shake. */
export const slam = (frame: number, at: number) => {
  const t = interpolate(frame, [at, at + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.3, 1.2),
  });
  const shake = frame >= at + 7 && frame < at + 13 ? Math.sin((frame - at) * 2.6) * 5 * (1 - (frame - at - 7) / 6) : 0;
  return {
    opacity: interpolate(frame, [at, at + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    scale: String(2.2 - 1.2 * t),
    translate: `${shake}px 0px`,
  } as React.CSSProperties;
};

/** Short sound effect placed at a frame. */
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.45 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
