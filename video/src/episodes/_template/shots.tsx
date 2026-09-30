import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Arrow, Node } from "../../kit/blocks";
import { Grain, MaskUp, pop, Sfx } from "../../kit/kit";
import { ListDoc, Building } from "../../kit/shapes";
import { Answer, ChapterCard, CoverCard, EndCard, QHeader, Room } from "../../picto/Episode";
import { CREAM, FONT_CN, FONT_LATIN, HUES, INK, NEUTRAL } from "../../picto/palette";
import { beat, cue } from "./tl";

// TEMPLATE — replace every shot with your own. Rules: .claude/skills/explainer-video/references/STYLE.md + .claude/skills/explainer-video/SKILL.md.
// cue(id, phrase) = frame where the phrase is spoken; beat(id, n) = frame n beats into the shot.

const blue = HUES.blue;
const teal = HUES.teal;
const green = HUES.green;
const OF = 1; // number of questions in this episode
const LABEL = "{{TAG_SHORT}}";

export const X01: React.FC = () => (
  <AbsoluteFill style={{ background: NEUTRAL }}>
    <div style={{ position: "absolute", left: 180, top: 360 }}>
      <MaskUp at={cue("x01", "开学季")}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 150, color: CREAM }}>开学季到了！</div>
      </MaskUp>
    </div>
    <Grain />
  </AbsoluteFill>
);

export const X02: React.FC = () => (
  <CoverCard
    episode="{{EPISODE}}"
    tag="{{TAG}}"
    subtitle="{{SUBTITLE}}"
    questions={[
      { t: "问题一？", at: beat("x02", 3) },
      { t: "问题二？", at: beat("x02", 4) },
      { t: "问题三？", at: beat("x02", 5) },
    ]}
  />
);

export const X03: React.FC = () => <ChapterCard n="01" title="第一部分" en="PART ONE" sub="小标题 · 小标题" hue={teal} seed={41} />;

export const X04: React.FC = () => {
  const f = useCurrentFrame();
  const a1 = cue("x04", "准备材料");
  const a2 = cue("x04", "办公室");
  const a3 = cue("x04", "等待通知");
  const X = [360, 960, 1560];
  const Y = 610;
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <QHeader q={1} of={OF} label={LABEL} title="示例问题怎么办理？" />
      <Answer at={a1} color={teal[1]}>三步：准备 → 提交 → 等通知</Answer>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Arrow x1={X[0] + 130} y1={Y} x2={X[1] - 130} y2={Y} p={pop(f, a2 - 6, 10)} color={teal[0]} />
        <Arrow x1={X[1] + 130} y1={Y} x2={X[2] - 130} y2={Y} p={pop(f, a3 - 6, 10)} color={teal[0]} />
      </svg>
      <Node x={X[0]} y={Y} at={a1} f={f} label="准备材料" accent={teal[0]}>
        <ListDoc x={110} y={110} s={120} color={teal[0]} />
      </Node>
      <Node x={X[1]} y={Y} at={a2} f={f} label="到办公室提交" accent={teal[0]}>
        <Building x={110} y={110} s={120} color={teal[0]} />
      </Node>
      <Node x={X[2]} y={Y} at={a3} f={f} label="等待通知" accent={teal[0]}>
        <text x={110} y={140} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={900} fontSize={90} fill={teal[0]}>!</text>
      </Node>
      <Grain />
      {[a1, a2, a3].map((a) => (
        <Sfx key={a} at={a} name="pop" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

export const X05: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { n: "1", t: "材料", d: "材料要备齐", at: cue("x05", "材料"), hue: blue },
    { n: "2", t: "时间", d: "按时提交", at: cue("x05", "按时"), hue: teal },
    { n: "3", t: "通知", d: "留意通知", at: cue("x05", "留意"), hue: green },
  ];
  return (
    <AbsoluteFill>
      <Room />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <MaskUp at={2}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 80, color: INK, letterSpacing: 6 }}>划重点</div>
        </MaskUp>
      </div>
      {items.map((it, i) => {
        const p = pop(f, it.at - 2, 10);
        return (
          <div key={it.n} style={{ position: "absolute", left: 150 + i * 555, top: 340, width: 510, height: 330, background: CREAM, border: `5px solid ${it.hue[0]}`, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p) }}>
            <div style={{ height: 110, background: it.hue[1], display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
              <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 70, color: "transparent", WebkitTextStroke: `3px ${CREAM}` }}>{it.n}</div>
              <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 50, color: CREAM }}>{it.t}</div>
            </div>
            <div style={{ padding: "40px 32px", fontFamily: FONT_CN, fontWeight: 800, fontSize: 44, color: INK }}>{it.d}</div>
          </div>
        );
      })}
      <Grain />
      {items.map((it) => (
        <Sfx key={it.n} at={it.at - 2} name="stamp" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

export const X06: React.FC = () => <EndCard />;
