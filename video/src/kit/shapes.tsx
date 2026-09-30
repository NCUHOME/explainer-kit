import React from "react";

// Minimal geometric icons for the 补测 episode (drawn, not borrowed).
type P = { x: number; y: number; s: number; color: string; bg?: string };

export const ListDoc: React.FC<P> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.14} y={0} width={s * 0.72} height={s} rx={s * 0.06} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    {[0.22, 0.4, 0.58, 0.76].map((k) => (
      <g key={k}>
        <circle cx={s * 0.3} cy={s * k} r={s * 0.04} fill={color} />
        <rect x={s * 0.4} y={s * k - s * 0.025} width={s * 0.34} height={s * 0.05} rx={s * 0.025} fill={color} opacity={0.7} />
      </g>
    ))}
  </g>
);

export const Building: React.FC<P & { label?: string }> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <path d={`M${s * 0.08},${s * 0.34} L${s * 0.5},${s * 0.06} L${s * 0.92},${s * 0.34} Z`} fill={color} />
    <rect x={s * 0.12} y={s * 0.36} width={s * 0.76} height={s * 0.5} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    {[0.24, 0.44, 0.64].map((k) => (
      <rect key={k} x={s * k} y={s * 0.44} width={s * 0.1} height={s * 0.34} fill={color} />
    ))}
    <rect x={s * 0.04} y={s * 0.86} width={s * 0.92} height={s * 0.08} fill={color} />
  </g>
);

export const Lock: React.FC<P> = ({ x, y, s, color }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <path d={`M${s * 0.28},${s * 0.46} V${s * 0.3} a${s * 0.22},${s * 0.22} 0 0 1 ${s * 0.44},0 V${s * 0.46}`} fill="none" stroke={color} strokeWidth={s * 0.09} />
    <rect x={s * 0.16} y={s * 0.44} width={s * 0.68} height={s * 0.5} rx={s * 0.08} fill={color} />
    <circle cx={s * 0.5} cy={s * 0.66} r={s * 0.07} fill="#fff" />
  </g>
);

export const Flag: React.FC<P> = ({ x, y, s, color }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.2} y={s * 0.05} width={s * 0.07} height={s * 0.9} fill={color} />
    <path d={`M${s * 0.27},${s * 0.08} H${s * 0.85} L${s * 0.7},${s * 0.28} L${s * 0.85},${s * 0.48} H${s * 0.27} Z`} fill={color} />
  </g>
);

export const Trophy: React.FC<P> = ({ x, y, s, color }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`} fill="none" stroke={color} strokeWidth={s * 0.08} strokeLinejoin="round">
    <path d={`M${s * 0.28},${s * 0.12} H${s * 0.72} V${s * 0.4} a${s * 0.22},${s * 0.22} 0 0 1 -${s * 0.44},0 Z`} fill={color} />
    <path d={`M${s * 0.28},${s * 0.2} H${s * 0.12} a${s * 0.12},${s * 0.14} 0 0 0 ${s * 0.2},${s * 0.2}`} />
    <path d={`M${s * 0.72},${s * 0.2} H${s * 0.88} a${s * 0.12},${s * 0.14} 0 0 1 -${s * 0.2},${s * 0.2}`} />
    <path d={`M${s * 0.5},${s * 0.62} V${s * 0.78} M${s * 0.3},${s * 0.86} H${s * 0.7}`} />
  </g>
);

export const Cap: React.FC<P> = ({ x, y, s, color }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <path d={`M${s * 0.02},${s * 0.4} L${s * 0.5},${s * 0.18} L${s * 0.98},${s * 0.4} L${s * 0.5},${s * 0.62} Z`} fill={color} />
    <path d={`M${s * 0.22},${s * 0.52} V${s * 0.74} Q${s * 0.5},${s * 0.9} ${s * 0.78},${s * 0.74} V${s * 0.52}`} fill={color} />
    <line x1={s * 0.9} y1={s * 0.42} x2={s * 0.9} y2={s * 0.72} stroke={color} strokeWidth={s * 0.05} />
  </g>
);

export const Diploma: React.FC<P> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.06} y={s * 0.2} width={s * 0.88} height={s * 0.6} rx={s * 0.06} fill={bg} stroke={color} strokeWidth={s * 0.06} />
    <rect x={s * 0.2} y={s * 0.34} width={s * 0.5} height={s * 0.06} fill={color} opacity={0.7} />
    <rect x={s * 0.2} y={s * 0.48} width={s * 0.36} height={s * 0.06} fill={color} opacity={0.7} />
    <circle cx={s * 0.72} cy={s * 0.62} r={s * 0.1} fill={color} />
  </g>
);

export const Hospital: React.FC<P> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.14} y={s * 0.2} width={s * 0.72} height={s * 0.72} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    <rect x={s * 0.4} y={s * 0.3} width={s * 0.2} height={s * 0.36} fill={color} />
    <rect x={s * 0.32} y={s * 0.38} width={s * 0.36} height={s * 0.2} fill={color} />
    <rect x={s * 0.42} y={s * 0.74} width={s * 0.16} height={s * 0.18} fill={color} />
  </g>
);

export const MedDoc: React.FC<P> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.16} y={0} width={s * 0.68} height={s} rx={s * 0.05} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    <rect x={s * 0.43} y={s * 0.12} width={s * 0.14} height={s * 0.34} fill={color} />
    <rect x={s * 0.33} y={s * 0.22} width={s * 0.34} height={s * 0.14} fill={color} />
    {[0.58, 0.7, 0.82].map((k) => (
      <rect key={k} x={s * 0.28} y={s * k} width={s * 0.44} height={s * 0.05} rx={s * 0.025} fill={color} opacity={0.6} />
    ))}
  </g>
);

export const Cal: React.FC<P & { hi?: number }> = ({ x, y, s, color, bg = "#fff", hi }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.06} y={s * 0.14} width={s * 0.88} height={s * 0.8} rx={s * 0.06} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    <rect x={s * 0.06} y={s * 0.14} width={s * 0.88} height={s * 0.18} fill={color} />
    {[0.26, 0.74].map((k) => (
      <rect key={k} x={s * k - s * 0.03} y={s * 0.04} width={s * 0.06} height={s * 0.18} fill={color} />
    ))}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={s * (0.16 + (i % 3) * 0.24)} y={s * (0.42 + Math.floor(i / 3) * 0.16)} width={s * 0.16} height={s * 0.1} fill={color} opacity={hi === i ? 1 : 0.3} />
    ))}
  </g>
);

export const PhoneIcon: React.FC<P> = ({ x, y, s, color, bg = "#fff" }) => (
  <g transform={`translate(${x - s / 2},${y - s / 2})`}>
    <rect x={s * 0.26} y={0} width={s * 0.48} height={s} rx={s * 0.08} fill={bg} stroke={color} strokeWidth={s * 0.05} />
    {[0.16, 0.34, 0.52, 0.7].map((k) => (
      <rect key={k} x={s * 0.34} y={s * k} width={s * 0.32} height={s * 0.12} rx={s * 0.02} fill={color} opacity={0.35} />
    ))}
  </g>
);
