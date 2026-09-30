import React from "react";
import { BrandTab, NCU_BLUE } from "./Brand";
import { CREAM, FONT_CN, FONT_MONO } from "./palette";

/** Broadcast-style corner meta text (STYLE.md §3). */
export const Hud: React.FC<{
  color?: string;
  chapter: string; // e.g. "CH.01 / 03 · 体测预约"
  ticks?: { n: number; current: number };
  chip?: string; // background chip colour for legibility over full-contrast patterns
}> = ({ color = CREAM, chapter, ticks, chip }) => {
  const mono: React.CSSProperties = {
    fontFamily: `${FONT_MONO}, ${FONT_CN}`,
    fontSize: 22,
    letterSpacing: 3,
    color,
    background: chip,
    padding: chip ? "6px 12px" : 0,
    whiteSpace: "nowrap",
  };
  return (
    <>
      <BrandTab />
      <div style={{ position: "absolute", right: 64, top: 44, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <div style={mono}>教务答疑直通车 · 第四期</div>
        <div style={{ ...mono, opacity: 0.75 }}>{chapter}</div>
      </div>
      {ticks ? (
        <div style={{ position: "absolute", right: 64, bottom: 124, display: "flex", alignItems: "flex-end", gap: 8, padding: chip ? "8px 12px" : 0, background: chip }}>
          {Array.from({ length: ticks.n }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: i === ticks.current ? 30 : 16,
                background: color,
                opacity: i === ticks.current ? 1 : i < ticks.current ? 0.55 : 0.25,
              }}
            />
          ))}
          <div style={{ ...mono, background: "transparent", padding: 0, marginLeft: 10, fontSize: 20 }}>
            {String(ticks.current + 1).padStart(2, "0")} / {String(ticks.n).padStart(2, "0")}
          </div>
        </div>
      ) : null}
    </>
  );
};

/** Caption: a solid 南大蓝 band at the bottom (brand anchor), never over the subject. */
export const CaptionBand: React.FC<{ text: string; bg?: string; color?: string }> = ({ text, bg = NCU_BLUE, color = CREAM }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 92,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_CN,
      fontWeight: 500,
      fontSize: 40,
      letterSpacing: 2,
      color,
    }}
  >
    {text}
  </div>
);
