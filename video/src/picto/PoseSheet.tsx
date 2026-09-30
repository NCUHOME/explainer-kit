import React from "react";
import { AbsoluteFill } from "remotion";
import { Figure, runPose, walkPose } from "./Figure";
import { CREAM, HUES, mix } from "./palette";

/** Review sheet: run (top) and walk (bottom) cycles at 8 phases. */
export const PoseSheet: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <svg width={1920} height={1080}>
      {[runPose, walkPose].map((fn, row) =>
        Array.from({ length: 8 }).map((_, i) => {
          const { pose, lift } = fn((i / 8) * Math.PI * 2);
          const H = 300;
          const ground = 460 + row * 480;
          return (
            <g key={`${row}-${i}`}>
              <line x1={i * 240 + 20} y1={ground} x2={i * 240 + 220} y2={ground} stroke="#999" strokeWidth={2} />
              <Figure x={i * 240 + 120} y={ground - 0.47 * H - lift * (row === 0 ? 14 : 5)} H={H} pose={pose} color={HUES.blue[0]} farColor={mix(HUES.blue[0], CREAM, 0.4)} />
            </g>
          );
        }),
      )}
    </svg>
  </AbsoluteFill>
);
