import React from "react";
import { Figure, POSES, runPose } from "./Figure";
import { CREAM } from "./palette";

export type ItemKind = "scale" | "blow" | "reach" | "jump" | "pullup" | "situp" | "run";

export const ITEMS: { kind: ItemKind; name: string; en: string; place: "室内" | "室外" }[] = [
  { kind: "scale", name: "身高体重", en: "HEIGHT & WEIGHT", place: "室内" },
  { kind: "blow", name: "肺活量", en: "VITAL CAPACITY", place: "室内" },
  { kind: "reach", name: "坐位体前屈", en: "SIT AND REACH", place: "室内" },
  { kind: "jump", name: "立定跳远", en: "STANDING LONG JUMP", place: "室内" },
  { kind: "pullup", name: "引体向上 / 仰卧起坐", en: "PULL-UP / SIT-UP", place: "室内" },
  { kind: "run", name: "50 米跑", en: "50 M SPRINT", place: "室外" },
  { kind: "run", name: "1000 / 800 米", en: "1000 M / 800 M", place: "室外" },
];

/**
 * A test item as a pictogram in a square box (size s), centred at (cx, cy).
 * `t` animates the action where it makes sense (0..1 loops).
 */
export const ItemIcon: React.FC<{ kind: ItemKind; cx: number; cy: number; s: number; color: string; far: string; t?: number }> = ({ kind, cx, cy, s, color, far, t = 0 }) => {
  const H = s * 0.62;
  const ground = cy + s * 0.36;
  const bar = { stroke: color, strokeWidth: s * 0.035, strokeLinecap: "round" as const };
  switch (kind) {
    case "scale":
      return (
        <g>
          <line x1={cx - s * 0.22} y1={ground - s * 0.72} x2={cx - s * 0.22} y2={ground} {...bar} />
          <line x1={cx - s * 0.22} y1={ground - H * 0.99} x2={cx + s * 0.02} y2={ground - H * 0.99} {...bar} />
          <rect x={cx - s * 0.2} y={ground - s * 0.035} width={s * 0.4} height={s * 0.06} rx={s * 0.02} fill={color} />
          <Figure x={cx + s * 0.02} y={ground - s * 0.04 - 0.48 * H} H={H} pose={POSES.stand} color={color} farColor={far} />
        </g>
      );
    case "blow":
      return (
        <g>
          <Figure x={cx - s * 0.05} y={ground - 0.48 * H} H={H} pose={POSES.blow} color={color} farColor={far}>
            {(j) => (
              <g>
                <rect x={j.nHa[0] - s * 0.02} y={j.nHa[1] - s * 0.05} width={s * 0.13} height={s * 0.07} rx={s * 0.02} fill={color} />
                {[0, 1, 2].map((i) => (
                  <path key={i} d={`M${j.nHa[0] + s * (0.16 + i * 0.05)},${j.nHa[1] - s * 0.06} q${s * 0.03},${s * 0.03} 0,${s * 0.06}`} fill="none" stroke={color} strokeWidth={s * 0.02} strokeLinecap="round" opacity={((t * 3 + i) % 3) / 3} />
                ))}
              </g>
            )}
          </Figure>
        </g>
      );
    case "reach":
      return (
        <g>
          <line x1={cx - s * 0.42} y1={ground} x2={cx + s * 0.42} y2={ground} {...bar} />
          <rect x={cx + s * 0.13} y={ground - s * 0.15} width={s * 0.12} height={s * 0.15} fill={color} />
          <line x1={cx + s * 0.06} y1={ground - s * 0.17} x2={cx + s * 0.36} y2={ground - s * 0.17} {...bar} />
          <Figure x={cx - s * 0.2} y={ground - s * 0.045} H={H} pose={POSES.sitReach} color={color} farColor={far} />
        </g>
      );
    case "jump":
      return (
        <g>
          <line x1={cx - s * 0.42} y1={ground} x2={cx + s * 0.42} y2={ground} {...bar} />
          <Figure x={cx - s * 0.02} y={ground - s * 0.46} H={H * 0.95} pose={POSES.longJumpFlight} color={color} farColor={far} />
        </g>
      );
    case "pullup":
      return (
        <g>
          <line x1={cx - s * 0.3} y1={cy - s * 0.4} x2={cx + s * 0.3} y2={cy - s * 0.4} {...bar} />
          <Figure x={cx} y={cy - s * 0.4 + 0.62 * H * 0.9} H={H * 0.9} pose={POSES.hang} color={color} farColor={far} />
        </g>
      );
    case "situp":
      return (
        <g>
          <line x1={cx - s * 0.42} y1={ground} x2={cx + s * 0.42} y2={ground} {...bar} />
          <Figure x={cx - s * 0.06} y={ground - s * 0.04} H={H} pose={POSES.sitUp} color={color} farColor={far} />
        </g>
      );
    case "run": {
      const { pose } = runPose(Math.PI * 0.55 + t * Math.PI * 2);
      return (
        <g>
          <line x1={cx - s * 0.42} y1={ground} x2={cx + s * 0.42} y2={ground} {...bar} />
          <Figure x={cx} y={ground - 0.45 * H} H={H} pose={pose} color={color} farColor={far} />
        </g>
      );
    }
  }
};

export const ItemSheet: React.FC = () => (
  <svg width={1920} height={1080} style={{ background: CREAM }}>
    {(["scale", "blow", "reach", "jump", "pullup", "situp", "run"] as ItemKind[]).map((k, i) => (
      <g key={k}>
        <rect x={40 + (i % 4) * 460} y={40 + Math.floor(i / 4) * 500} width={420} height={420} fill="#E0E9FA" />
        <ItemIcon kind={k} cx={250 + (i % 4) * 460} cy={250 + Math.floor(i / 4) * 500} s={420} color="#1B3F8F" far="#8FA6D6" />
      </g>
    ))}
  </svg>
);
