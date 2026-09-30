import React from "react";
import { Easing, interpolate } from "remotion";
import { ItemKind } from "../picto/ItemIcon";
import { CREAM, FONT_CN, FONT_LATIN, FONT_MONO, HUES, INK } from "../picto/palette";
import { clamp, pop } from "./kit";

// Reusable illustration blocks (score card, flow nodes, arrows).
const blue = HUES.blue;
const red = HUES.red;
const green = HUES.green;

export const ITEM_ROWS: { kind: ItemKind; name: string }[] = [
  { kind: "scale", name: "身高体重" },
  { kind: "blow", name: "肺活量" },
  { kind: "reach", name: "坐位体前屈" },
  { kind: "jump", name: "立定跳远" },
  { kind: "pullup", name: "引体 / 仰卧" },
  { kind: "run", name: "50 米" },
  { kind: "run", name: "800 / 1000 米" },
];

/** Illustrative score card (not real data): rows fill, total counts up, optional stamp. */
export const ScoreCard: React.FC<{ x: number; y: number; f: number; start: number; total: number; lens: number[]; label: string; stampAt?: number; stamp?: string; missing?: number }> = ({ x, y, f, start, total, lens, label, stampAt, stamp, missing }) => {
  const W = 720;
  const shown = Math.round(interpolate(f, [start + 20, start + 44], [0, total], clamp));
  const st = stampAt !== undefined ? pop(f, stampAt, 9) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, background: CREAM, padding: "26px 34px", boxSizing: "border-box", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 38, color: INK }}>{label}</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: "#888", letterSpacing: 3 }}>示意 · SAMPLE</div>
      </div>
      <div style={{ marginTop: 16 }}>
        {ITEM_ROWS.map((r, i) => {
          const g = interpolate(f, [start + i * 3, start + i * 3 + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
          const isMissing = i === missing;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 46 }}>
              <div style={{ width: 170, fontFamily: FONT_CN, fontWeight: 700, fontSize: 24, color: INK, whiteSpace: "nowrap" }}>{r.name}</div>
              <div style={{ flex: 1, height: 16, background: "#E3E1DA", position: "relative" }}>
                {isMissing ? (
                  <div style={{ position: "absolute", inset: -2, border: `3px dashed ${red[2]}`, opacity: g }} />
                ) : (
                  <div style={{ width: `${lens[i] * 100 * g}%`, height: "100%", background: lens[i] < 0.6 ? red[2] : blue[1] }} />
                )}
              </div>
              <div style={{ width: 70, fontFamily: isMissing ? FONT_CN : FONT_LATIN, fontWeight: 800, fontSize: 22, color: isMissing ? red[2] : INK, textAlign: "right" }}>{isMissing ? "未测" : ""}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 14, borderTop: `3px solid ${INK}`, paddingTop: 10 }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 30, color: INK }}>总分</div>
        <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 96, lineHeight: 1, color: total < 60 ? red[2] : green[1] }}>{shown}</div>
      </div>
      {st > 0 && stamp ? (
        <div style={{ position: "absolute", right: 40, bottom: 130, border: `8px solid ${red[2]}`, color: red[2], fontFamily: FONT_CN, fontWeight: 900, fontSize: 60, padding: "6px 22px", rotate: "-9deg", scale: String(1.8 - 0.8 * st), opacity: Math.min(1, st * 1.5), background: "rgba(246,242,234,0.9)", whiteSpace: "nowrap" }}>{stamp}</div>
      ) : null}
    </div>
  );
};

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string }> = ({ x1, y1, x2, y2, p, color = blue[0] }) => {
  if (p <= 0) return null;
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${x},${y} l${-22 * Math.cos(a - 0.5)},${-22 * Math.sin(a - 0.5)} M${x},${y} l${-22 * Math.cos(a + 0.5)},${-22 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
    </g>
  );
};

export const Node: React.FC<{ x: number; y: number; at: number; label: string; sub?: string; children: React.ReactNode; f: number; accent?: string }> = ({ x, y, at, label, sub, children, f, accent = blue[0] }) => {
  const p = pop(f, at, 10);
  return (
    <div style={{ position: "absolute", left: x - 150, top: y - 150, width: 300, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, p * 1.6), scale: String(0.6 + 0.4 * p) }}>
      <div style={{ width: 220, height: 220, borderRadius: 110, background: CREAM, boxShadow: `0 0 0 6px ${accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={220} height={220}>{children}</svg>
      </div>
      <div style={{ marginTop: 22, fontFamily: FONT_CN, fontWeight: 900, fontSize: 36, color: INK, whiteSpace: "nowrap" }}>{label}</div>
      {sub ? <div style={{ fontFamily: FONT_CN, fontWeight: 600, fontSize: 24, color: "#5B6680", marginTop: 4, whiteSpace: "nowrap" }}>{sub}</div> : null}
    </div>
  );
};

