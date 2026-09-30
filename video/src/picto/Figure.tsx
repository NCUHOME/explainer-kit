import React from "react";

/**
 * Pictogram pose, in degrees.
 * torso: lean from vertical (forward +). head: extra tilt of the head.
 * Limb angles are measured from straight down, forward +; 180 = straight up.
 * n* = near side, f* = far side. u/l = upper/lower (arm), t/s = thigh/shin.
 */
export type Pose = {
  torso: number;
  head?: number;
  nu: number;
  nl: number;
  fu: number;
  fl: number;
  nt: number;
  ns: number;
  ft: number;
  fs: number;
};

export const POSES = {
  stand: { torso: 0, nu: 8, nl: 10, fu: -8, fl: -6, nt: 4, ns: 0, ft: -4, fs: -2 },
  holdPhone: { torso: 3, head: 18, nu: 28, nl: 112, fu: 18, fl: 98, nt: 4, ns: 0, ft: -5, fs: -3 },
  // 立定跳远 in flight: arms swung forward-up, knees tucked, feet reaching
  longJumpFlight: { torso: 26, head: -6, nu: 104, nl: 118, fu: 90, fl: 104, nt: 102, ns: 38, ft: 92, fs: 30 },
  longJumpCrouch: { torso: 48, head: -10, nu: -60, nl: -40, fu: -70, fl: -50, nt: 70, ns: -40, ft: 62, fs: -44 },
  longJumpLand: { torso: 30, head: -4, nu: 80, nl: 95, fu: 70, fl: 85, nt: 75, ns: -35, ft: 68, fs: -40 },
  // selfie: phone held up at arm's length, looking at it
  selfie: { torso: -2, head: -8, nu: 100, nl: 128, fu: 6, fl: 10, nt: 4, ns: 0, ft: -5, fs: -3 },
  // presenter: arm extended, pointing forward and a little up
  point: { torso: 2, head: -4, nu: 100, nl: 96, fu: 6, fl: 14, nt: 5, ns: 0, ft: -6, fs: -3 },
  // test items (hip on the ground for the seated ones)
  blow: { torso: 4, head: -4, nu: 30, nl: 158, fu: 16, fl: 150, nt: 3, ns: 0, ft: -4, fs: -2 },
  sitReach: { torso: 42, head: 14, nu: 70, nl: 82, fu: 64, fl: 78, nt: 90, ns: 90, ft: 88, fs: 88 },
  sitUp: { torso: -38, head: 14, nu: 100, nl: 112, fu: 94, fl: 106, nt: 132, ns: 28, ft: 124, fs: 22 },
  hang: { torso: 0, head: -6, nu: 174, nl: 180, fu: 168, fl: 176, nt: -6, ns: -22, ft: 4, fs: -12 },
  pullTop: { torso: 0, head: -12, nu: 138, nl: 212, fu: 130, fl: 206, nt: -8, ns: -26, ft: 2, fs: -16 },
  runA: { torso: 16, head: -6, nu: 62, nl: 140, fu: -48, fl: 18, nt: 62, ns: 8, ft: -34, fs: 78 },
  runB: { torso: 16, head: -6, nu: -48, nl: 18, fu: 62, fl: 140, nt: -34, ns: 78, ft: 62, fs: 8 },
  walkA: { torso: 3, head: 0, nu: 24, nl: 40, fu: -20, fl: -8, nt: 22, ns: 6, ft: -18, fs: 12 },
  walkB: { torso: 3, head: 0, nu: -20, nl: -8, fu: 24, fl: 40, nt: -18, ns: 12, ft: 22, fs: 6 },
} satisfies Record<string, Pose>;

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const k = Object.keys(a) as (keyof Pose)[];
  const out = {} as Pose;
  for (const key of k) out[key] = (a[key] ?? 0) + ((b[key] ?? 0) - (a[key] ?? 0)) * t;
  return out;
};


/**
 * Procedural running cycle, phase in radians. Recovery leg folds high
 * (heel toward hip), front leg reaches, support leg straightens; arms swing
 * opposite to the legs with bent elbows. `lift` is 0 at mid-stance, 1 in flight.
 */
export const runPose = (ph: number): { pose: Pose; lift: number } => {
  const leg = (p: number) => {
    const thigh = 8 + 48 * Math.sin(p);
    const flex = 12 + 100 * Math.pow(Math.max(0, Math.cos(p)), 1.3);
    return [thigh, thigh - flex] as const;
  };
  const [nt, ns] = leg(ph);
  const [ft, fs] = leg(ph + Math.PI);
  const nu = -44 * Math.sin(ph);
  const fu = 44 * Math.sin(ph);
  return {
    pose: { torso: 14, head: -6, nu, nl: nu + 85, fu, fl: fu + 85, nt, ns, ft, fs },
    lift: Math.abs(Math.sin(ph)),
  };
};

/** Procedural walking cycle; `lift` peaks at mid-stance. */
export const walkPose = (ph: number): { pose: Pose; lift: number } => {
  const leg = (p: number) => {
    const thigh = 3 + 24 * Math.sin(p);
    const flex = 4 + 38 * Math.pow(Math.max(0, Math.cos(p)), 1.5);
    return [thigh, thigh - flex] as const;
  };
  const [nt, ns] = leg(ph);
  const [ft, fs] = leg(ph + Math.PI);
  const nu = -18 * Math.sin(ph);
  const fu = 18 * Math.sin(ph);
  return {
    pose: { torso: 3, head: 0, nu, nl: nu + 14, fu, fl: fu + 14, nt, ns, ft, fs },
    lift: 1 - Math.abs(Math.sin(ph)),
  };
};

/**
 * Cyclic gait between two poses. `period` in frames for a full stride.
 * Returns the pose and a vertical bob (px, per unit H) to add to the hip.
 */
export const gait = (a: Pose, b: Pose, frame: number, period: number) => {
  const ph = (frame / period) * Math.PI * 2;
  const t = (Math.sin(ph) + 1) / 2;
  return { pose: lerpPose(a, b, t), bob: -Math.abs(Math.cos(ph)) };
};

const rad = (d: number) => (d * Math.PI) / 180;
const down = (a: number) => [Math.sin(rad(a)), Math.cos(rad(a))] as const;
const up = (a: number) => [Math.sin(rad(a)), -Math.cos(rad(a))] as const;

/**
 * Faceless geometric figure: round-capped bars and a disc head.
 * (x, y) is the hip; H is body height in px; facing 1 = right.
 */
export const Figure: React.FC<{
  x: number;
  y: number;
  H: number;
  pose: Pose;
  color: string;
  farColor: string;
  facing?: 1 | -1;
  children?: (j: Record<string, [number, number]>) => React.ReactNode; // props drawn with joint positions
}> = ({ x, y, H, pose, color, farColor, facing = 1, children }) => {
  const P = (p: readonly [number, number], d: readonly [number, number], len: number): [number, number] => [
    p[0] + d[0] * len * H * facing,
    p[1] + d[1] * len * H,
  ];
  const hip: [number, number] = [x, y];
  const sh = P(hip, up(pose.torso), 0.3);
  const headC = P(sh, up(pose.torso + (pose.head ?? 0)), 0.14);
  const nEl = P(sh, down(pose.nu), 0.16);
  const nHa = P(nEl, down(pose.nl), 0.15);
  const fEl = P(sh, down(pose.fu), 0.16);
  const fHa = P(fEl, down(pose.fl), 0.15);
  const nKn = P(hip, down(pose.nt), 0.24);
  const nFt = P(nKn, down(pose.ns), 0.24);
  const fKn = P(hip, down(pose.ft), 0.24);
  const fFt = P(fKn, down(pose.fs), 0.24);
  const limb = 0.075 * H;
  const bar = (a: [number, number], b: [number, number], c: [number, number], col: string, w = limb) => (
    <polyline points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const joints = { hip, sh, headC, nEl, nHa, fEl, fHa, nKn, nFt, fKn, fFt };
  return (
    <g>
      {bar(sh, fEl, fHa, farColor)}
      {bar(hip, fKn, fFt, farColor)}
      <line x1={hip[0]} y1={hip[1]} x2={sh[0]} y2={sh[1]} stroke={color} strokeWidth={0.115 * H} strokeLinecap="round" />
      {bar(hip, nKn, nFt, color)}
      {children ? children(joints) : null}
      {bar(sh, nEl, nHa, color)}
      <circle cx={headC[0]} cy={headC[1]} r={0.078 * H} fill={color} />
    </g>
  );
};

/** Hip y that puts the lowest foot on `ground` (plus an optional lift in px). */
export const hipOnGround = (pose: Pose, H: number, ground: number, lift = 0) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const drop = (t: number, s: number) => 0.24 * H * (Math.cos(r(t)) + Math.cos(r(s)));
  return ground - Math.max(drop(pose.nt, pose.ns), drop(pose.ft, pose.fs)) - lift;
};
