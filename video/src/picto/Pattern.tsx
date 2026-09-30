import React from "react";
import { CELL, Hue } from "./palette";

type Motif =
  | "disc"
  | "half"
  | "quarter"
  | "arcs"
  | "dots"
  | "lanes"
  | "checker"
  | "ring"
  | "crescent"
  | "plain";

const MOTIFS: Motif[] = ["disc", "half", "quarter", "arcs", "dots", "lanes", "checker", "ring", "crescent", "plain", "plain", "half", "quarter", "disc"];

/** One grid cell with a geometric motif, drawn in tones of one hue. */
const Cell: React.FC<{ x: number; y: number; motif: Motif; bg: string; fg: string; rot: number; seed: number }> = ({
  x,
  y,
  motif,
  bg,
  fg,
  rot,
  seed,
}) => {
  const s = CELL;
  const c = s / 2;
  let inner: React.ReactNode = null;
  switch (motif) {
    case "disc":
      inner = <circle cx={c} cy={c} r={c} fill={fg} />;
      break;
    case "half":
      inner = <path d={`M0,${c} A${c},${c} 0 0 1 ${s},${c} Z`} fill={fg} />;
      break;
    case "quarter":
      inner = <path d={`M0,0 L${s},0 A${s},${s} 0 0 1 0,${s} Z`} fill={fg} />;
      break;
    case "arcs":
      inner = (
        <g fill="none" stroke={fg} strokeWidth={s * 0.07}>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <path key={k} d={`M0,${s * k} A${s * k},${s * k} 0 0 0 ${s * k},0`} />
          ))}
        </g>
      );
      break;
    case "dots":
      inner = (
        <g fill={fg}>
          {[0, 1, 2, 3].flatMap((i) => [0, 1, 2, 3].map((j) => <circle key={`${i}${j}`} cx={s * (0.125 + i * 0.25)} cy={s * (0.125 + j * 0.25)} r={s * 0.06} />))}
        </g>
      );
      break;
    case "lanes": // running-track lanes: the series' own motif
      inner = (
        <g>
          <rect width={s} height={s} fill={fg} />
          {[0.25, 0.5, 0.75].map((k) => (
            <rect key={k} y={s * k - 3} width={s} height={6} fill={bg} />
          ))}
        </g>
      );
      break;
    case "checker":
      inner = (
        <g fill={fg}>
          <rect width={c} height={c} />
          <rect x={c} y={c} width={c} height={c} />
        </g>
      );
      break;
    case "ring":
      inner = <circle cx={c} cy={c} r={c * 0.72} fill="none" stroke={fg} strokeWidth={s * 0.18} />;
      break;
    case "crescent":
      inner = (
        <g>
          <circle cx={c} cy={c} r={c * 0.9} fill={fg} />
          <circle cx={c + s * 0.22} cy={c - s * 0.12} r={c * 0.78} fill={bg} />
        </g>
      );
      break;
    default:
      inner = seed % 3 === 0 ? <circle cx={c} cy={c} r={s * 0.08} fill={fg} /> : null;
  }
  return (
    <g transform={`translate(${x},${y}) rotate(${rot} ${c} ${c})`}>
      <rect width={s} height={s} fill={bg} />
      {inner}
    </g>
  );
};

/**
 * Full-bleed pattern grid. `contrast="full"` for chapter cards, "low" under type.
 * `shift` offsets each row (in px); rows alternate direction.
 */
/** Stable pseudo-random value for a (seed, row, col, salt) — cells keep their look while scrolling. */
const hash = (seed: number, row: number, col: number, salt: number) => {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(row + 0x1000, 0xc2b2ae35) ^ Math.imul(col + 0x100000, 0x27d4eb2f) ^ Math.imul(salt + 7, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};

/**
 * Full-bleed pattern grid. `contrast="full"` for chapter cards, "low" under type.
 * `shift` scrolls each row continuously (px); rows alternate direction.
 */
export const Pattern: React.FC<{
  hue: Hue;
  seed?: number;
  contrast?: "full" | "low";
  shift?: number;
  width?: number;
  height?: number;
  rows?: number;
  top?: number;
  style?: React.CSSProperties;
}> = ({ hue, seed = 1, contrast = "full", shift = 0, width = 1920, height = 1080, rows, top = 0, style }) => {
  const nRows = rows ?? Math.ceil(height / CELL);
  const nCols = Math.ceil(width / CELL) + 2;
  // tone pairs (bg, fg) allowed in each contrast mode
  const pairs: [number, number][] =
    contrast === "full"
      ? [
          [1, 3],
          [0, 2],
          [2, 4],
          [1, 2],
          [2, 0],
          [3, 1],
          [0, 3],
          [2, 3],
        ]
      : [
          [2, 1],
          [1, 2],
          [2, 2],
          [1, 1],
        ];
  const out: React.ReactNode[] = [];
  for (let row = 0; row < nRows; row++) {
    const dir = row % 2 === 0 ? 1 : -1;
    const offset = shift * dir;
    const base = Math.floor(offset / CELL);
    const frac = offset - base * CELL;
    const cells: React.ReactNode[] = [];
    for (let c = -1; c < nCols; c++) {
      const col = c - base; // world column: content follows the cell as it scrolls
      const motif = MOTIFS[Math.floor(hash(seed, row, col, 1) * MOTIFS.length)];
      const [bi, fi] = pairs[Math.floor(hash(seed, row, col, 2) * pairs.length)];
      const rot = Math.floor(hash(seed, row, col, 3) * 4) * 90;
      cells.push(
        <Cell key={col} x={c * CELL + frac} y={0} motif={motif} bg={hue[bi]} fg={hue[fi === bi ? (fi + 1) % 5 : fi]} rot={rot} seed={Math.floor(hash(seed, row, col, 4) * 1000)} />,
      );
    }
    out.push(
      <g key={row} transform={`translate(0,${top + row * CELL})`}>
        {cells}
      </g>,
    );
  }
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, ...style }}>
      {out}
    </svg>
  );
};
