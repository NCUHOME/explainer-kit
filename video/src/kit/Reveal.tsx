import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// Grid transitions from STYLE.md §5: the incoming shot is revealed over the
// outgoing one (which keeps rendering for OVERLAP frames underneath).
const CELL = 180;
const W = 1920;
const H = 1080;
const inOut = Easing.bezier(0.7, 0, 0.3, 1);

type Kind = { type: "columns" } | { type: "rows" } | { type: "iris"; x: number; y: number } | { type: "none" };

export const Reveal: React.FC<{ kind: Kind; dur?: number; children: React.ReactNode }> = ({ kind, dur = 14, children }) => {
  const f = useCurrentFrame();
  if (kind.type === "none" || f >= dur + 12) return <AbsoluteFill>{children}</AbsoluteFill>;
  let clipPath = "none";
  if (kind.type === "columns") {
    // columns drop from the top, staggered left → right
    const n = Math.ceil(W / CELL);
    const hs = Array.from({ length: n }, (_, i) =>
      interpolate(f, [i * 1.1, i * 1.1 + dur], [0, H], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
    );
    const pts = ["0px 0px", `${W}px 0px`];
    for (let i = n - 1; i >= 0; i--) {
      pts.push(`${Math.min(W, (i + 1) * CELL)}px ${hs[i]}px`, `${i * CELL}px ${hs[i]}px`);
    }
    clipPath = `polygon(${pts.join(",")})`;
  } else if (kind.type === "rows") {
    // rows slide in from the left, staggered top → bottom
    const n = Math.ceil(H / CELL);
    const ws = Array.from({ length: n }, (_, i) =>
      interpolate(f, [i * 1.6, i * 1.6 + dur], [0, W], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut }),
    );
    const pts = ["0px 0px"];
    for (let i = 0; i < n; i++) pts.push(`${ws[i]}px ${i * CELL}px`, `${ws[i]}px ${Math.min(H, (i + 1) * CELL)}px`);
    pts.push(`0px ${H}px`);
    clipPath = `polygon(${pts.join(",")})`;
  } else if (kind.type === "iris") {
    const r = interpolate(f, [0, dur], [0, 2300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.2, 1) });
    clipPath = `circle(${r}px at ${kind.x}px ${kind.y}px)`;
  }
  return <AbsoluteFill style={{ clipPath }}>{children}</AbsoluteFill>;
};
