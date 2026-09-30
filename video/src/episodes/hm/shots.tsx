import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Check } from "../../kit/uiIcons";
import { Arrow, Node } from "../../kit/blocks";
import { Cal, Hospital, ListDoc, MedDoc, PhoneIcon, Trophy } from "../../kit/shapes";
import { Answer, ChapterCard, CoverCard, EndCard, QHeader, Room } from "../../picto/Episode";
import { Bust } from "../../kit/kit";
import { Figure, hipOnGround, POSES } from "../../picto/Figure";
import { ItemIcon } from "../../picto/ItemIcon";
import { CREAM, FONT_CN, FONT_LATIN, FONT_MONO, HUES, INK, mix } from "../../picto/palette";
import { clamp, Grain, inn, MaskUp, pop, Sfx, Tag } from "../../kit/kit";
import { beat, cue } from "./tl";

const blue = HUES.blue;
const red = HUES.red;
const green = HUES.green;
const teal = HUES.teal;
const OF = 6;
const LABEL = "缓免测";

const ITEMS = [
  { kind: "scale" as const, name: "身高体重" },
  { kind: "blow" as const, name: "肺活量" },
  { kind: "reach" as const, name: "坐位体前屈" },
  { kind: "jump" as const, name: "立定跳远" },
  { kind: "pullup" as const, name: "引体 / 仰卧" },
  { kind: "run" as const, name: "50 米" },
  { kind: "run" as const, name: "800 / 1000 米" },
];

/** Big red "not accepted" stamp. */
const Stamp: React.FC<{ at: number; text: string; x: number; y: number; size?: number; color?: string }> = ({ at, text, x, y, size = 56, color = red[2] }) => {
  const f = useCurrentFrame();
  const s = pop(f, at, 9);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, border: `8px solid ${color}`, color, fontFamily: FONT_CN, fontWeight: 900, fontSize: size, padding: "6px 22px", rotate: "-8deg", scale: String(1.8 - 0.8 * s), opacity: Math.min(1, s * 1.5), background: "rgba(246,242,234,0.92)", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

// ── c01 · cold open ──────────────────────────────────────────────
export const C01: React.FC = () => {
  const f = useCurrentFrame();
  const cAsk = cue("c01", "缓测或免测");
  const H = 440;
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={520} cy={560} r={270} fill={CREAM} />
        <Figure x={500} y={hipOnGround(POSES.holdPhone, H, 800)} H={H} pose={{ ...POSES.holdPhone, head: 14 }} color={teal[0]} farColor={mix(teal[0], teal[4], 0.4)}>
          {(j) => {
            // holding a medical certificate, looking at it
            const px = (j.nHa[0] + j.fHa[0]) / 2 + 16;
            const py = (j.nHa[1] + j.fHa[1]) / 2 - 30;
            return (
              <g opacity={inn(f, 6, 12)}>
                <MedDoc x={px} y={py} s={120} color={teal[0]} bg={CREAM} />
              </g>
            );
          }}
        </Figure>
      </svg>
      <div style={{ position: "absolute", left: 1000, top: 330 }}>
        <MaskUp at={4}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 100, color: INK, letterSpacing: 4 }}>身体原因</div>
        </MaskUp>
        <MaskUp at={12}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 100, color: INK, letterSpacing: 4 }}>没法正常体测？</div>
        </MaskUp>
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          {[
            { t: "缓测", c: teal[1] },
            { t: "免测", c: blue[1] },
          ].map((b, i) => {
            const p = pop(f, cAsk + i * 6, 10);
            return (
              <div key={b.t} style={{ background: b.c, color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 80, padding: "10px 40px", opacity: Math.min(1, p * 1.5), scale: String(0.6 + 0.4 * p) }}>
                {b.t}
              </div>
            );
          })}
        </div>
      </div>
      <Grain />
      <Sfx at={cAsk} name="stamp" volume={0.45} />
      <Sfx at={cAsk + 6} name="stamp" volume={0.45} />
    </AbsoluteFill>
  );
};

// ── c02 · cover ──────────────────────────────────────────────────
export const C02: React.FC = () => (
  <CoverCard
    episode="第七期"
    tag="缓免测篇"
    subtitle="南昌大学《学生体质健康标准》Q&A"
    questions={[
      { t: "怎么申请？", at: beat("c02", 3) },
      { t: "证明要求？", at: beat("c02", 4) },
      { t: "免测给几分？", at: beat("c02", 5) },
    ]}
  />
);

export const C03: React.FC = () => <ChapterCard n="01" title="怎么申请" en="APPLY" sub="办理流程 · 保健班" hue={teal} seed={41} />;
export const C06: React.FC = () => <ChapterCard n="02" title="证明材料" en="PROOF" sub="医院要求 · 有效期" hue={blue} seed={11} />;
export const C09: React.FC = () => <ChapterCard n="03" title="免测之后" en="AFTER" sub="免测分数 · 其余项目" hue={green} seed={53} />;

// ── c04 · Q1 怎么提交 ─────────────────────────────────────────────
export const C04: React.FC = () => {
  const f = useCurrentFrame();
  const cDoc = cue("c04", "按照体测文件");
  const cAtt = cue("c04", "附件一");
  const cNo = cue("c04", "不接受");
  const doc = inn(f, cDoc - 4, 14);
  const hl = inn(f, cAtt, 12);
  const phone = inn(f, cNo - 16, 14);
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <QHeader q={1} of={OF} label={LABEL} title="缓测、免测申请，怎么提交？" />
      <Answer at={cDoc} color={teal[1]}>按体测文件办理 · 流程见附件1</Answer>
      {/* the notice document with 附件1 highlighted */}
      <div style={{ position: "absolute", left: 200, top: 400, width: 620, height: 470, background: CREAM, border: `5px solid ${teal[0]}`, opacity: doc, translate: `0px ${(1 - doc) * 40}px`, padding: "28px 34px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 40, color: INK }}>体测通知</div>
        {[0.9, 0.7, 0.8].map((w, i) => (
          <div key={i} style={{ height: 14, width: `${w * 100}%`, background: "#C9CED9", marginTop: 20 }} />
        ))}
        <div style={{ marginTop: 34, padding: "18px 22px", border: `4px solid ${teal[1]}`, background: hl > 0 ? mix(teal[4], CREAM, 1 - hl) : CREAM, boxShadow: `0 0 0 ${8 * hl}px ${mix(teal[3], CREAM, 0.4)}` }}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 36, color: teal[0] }}>附件 1 · 缓免测办理</div>
          {[0.8, 0.6].map((w, i) => (
            <div key={i} style={{ height: 12, width: `${w * 100}%`, background: teal[3], marginTop: 14 }} />
          ))}
        </div>
      </div>
      {/* the APP: not accepted */}
      <div style={{ position: "absolute", left: 1150, top: 380, opacity: phone, translate: `0px ${(1 - phone) * 40}px` }}>
        <svg width={520} height={500}>
          <PhoneIcon x={260} y={250} s={460} color={teal[0]} />
        </svg>
        <div style={{ textAlign: "center", fontFamily: FONT_CN, fontWeight: 800, fontSize: 30, color: INK, marginTop: 6 }}>步道乐跑 APP</div>
      </div>
      <Stamp at={cNo + 4} text="不接受线上提交" x={1120} y={560} size={52} />
      <Grain />
      <Sfx at={cAtt} name="click" volume={0.5} />
      <Sfx at={cNo + 4} name="stamp" volume={0.65} />
    </AbsoluteFill>
  );
};

// ── c05 · Q2 保健班 ───────────────────────────────────────────────
export const C05: React.FC = () => {
  const f = useCurrentFrame();
  const a1 = beat("c05", 2);
  const a2 = cue("c05", "保健班老师");
  const a3 = cue("c05", "根据病情");
  const X = [360, 960, 1560];
  const Y = 600;
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <QHeader q={2} of={OF} label={LABEL} title="保健班的同学，怎么办理免测？" />
      <Answer at={a2} color={teal[1]}>由保健班老师上报名单</Answer>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Arrow x1={X[0] + 130} y1={Y} x2={X[1] - 130} y2={Y} p={inn(f, a2 - 6, 10)} color={teal[0]} />
        <Arrow x1={X[1] + 130} y1={Y} x2={X[2] - 130} y2={Y} p={inn(f, a3 - 6, 10)} color={teal[0]} />
      </svg>
      <Node x={X[0]} y={Y} at={a1} f={f} label="进入保健班" accent={teal[0]}>
        <g>
          <Bust cx={70} cy={130} s={52} color={teal[1]} />
          <Bust cx={150} cy={130} s={52} color={teal[1]} />
          <Bust cx={110} cy={118} s={60} color={teal[0]} />
        </g>
      </Node>
      <Node x={X[1]} y={Y} at={a2} f={f} label="保健班老师上报名单" accent={teal[0]}>
        <ListDoc x={110} y={110} s={120} color={teal[0]} />
      </Node>
      <Node x={X[2]} y={Y} at={a3} f={f} label="根据病情免相应项目" accent={teal[0]}>
        <g>
          <rect x={40} y={50} width={60} height={60} fill={CREAM} stroke={teal[0]} strokeWidth={4} />
          <rect x={120} y={50} width={60} height={60} fill={mix(teal[3], CREAM, 0.3)} stroke={teal[0]} strokeWidth={4} />
          <rect x={40} y={120} width={60} height={60} fill={mix(teal[3], CREAM, 0.3)} stroke={teal[0]} strokeWidth={4} />
          <rect x={120} y={120} width={60} height={60} fill={CREAM} stroke={teal[0]} strokeWidth={4} />
          <text x={150} y={88} textAnchor="middle" fontFamily={FONT_CN} fontWeight={900} fontSize={20} fill={teal[0]}>免测</text>
          <text x={70} y={158} textAnchor="middle" fontFamily={FONT_CN} fontWeight={900} fontSize={20} fill={teal[0]}>免测</text>
        </g>
      </Node>
      <Grain />
      {[a1, a2, a3].map((a) => (
        <Sfx key={a} at={a} name="pop" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

// ── c07 · Q3 证明材料 ─────────────────────────────────────────────
export const C07: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { t: "不限南昌本地医院", at: cue("c07", "不限于"), icon: "pins" },
    { t: "本学期出具", at: cue("c07", "本学期"), icon: "cal" },
    { t: "三甲医院", at: cue("c07", "三甲医院"), icon: "hos" },
  ];
  const card = inn(f, 4, 14);
  return (
    <AbsoluteFill>
      <Room />
      <QHeader q={3} of={OF} label={LABEL} title="疾病证明，一定要南昌本地医院开吗？" />
      <Answer at={rows[0].at}>不限本地 · 须本学期三甲医院出具</Answer>
      <div style={{ position: "absolute", left: 200, top: 400, opacity: card, translate: `0px ${(1 - card) * 40}px` }}>
        <svg width={420} height={460}>
          <MedDoc x={210} y={230} s={430} color={blue[0]} bg={CREAM} />
        </svg>
        <div style={{ textAlign: "center", fontFamily: FONT_CN, fontWeight: 900, fontSize: 34, color: INK }}>疾病证明</div>
      </div>
      {rows.map((r, i) => {
        const p = pop(f, r.at, 10);
        return (
          <div key={r.t} style={{ position: "absolute", left: 780, top: 420 + i * 150, display: "flex", alignItems: "center", gap: 28, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p), transformOrigin: "left center" }}>
            <div style={{ width: 110, height: 110, borderRadius: 55, background: CREAM, boxShadow: `0 0 0 5px ${blue[0]}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={110} height={110}>
                {r.icon === "hos" ? <Hospital x={55} y={55} s={72} color={blue[0]} /> : null}
                {r.icon === "cal" ? <Cal x={55} y={55} s={70} color={blue[0]} hi={4} /> : null}
                {r.icon === "pins"
                  ? [
                      [34, 50],
                      [58, 38],
                      [80, 58],
                    ].map(([x, y], k) => <path key={k} d={`M${x} ${y + 22}s-12-12-12-21a12 12 0 0124 0c0 9-12 21-12 21z`} fill={k === 1 ? blue[0] : blue[3]} />)
                  : null}
              </svg>
            </div>
            <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 52, color: INK, whiteSpace: "nowrap" }}>{r.t}</div>
            <Check size={48} color={green[1]} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1290, top: 880 - 36 }}>
        <Tag at={cue("c07", "认真阅读")}>具体材料 · 以体测通知为准</Tag>
      </div>
      <Grain />
      {rows.map((r) => (
        <Sfx key={r.t} at={r.at} name="pop" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

// ── c08 · Q4 有效期 ───────────────────────────────────────────────
export const C08: React.FC = () => {
  const f = useCurrentFrame();
  const cOnly = cue("c08", "只对当年有效");
  const cRe = cue("c08", "重新提交");
  const yr = (i: number) => inn(f, beat("c08", 1 + i), 12);
  const pass = pop(f, cOnly, 10);
  const expired = inn(f, cOnly + 12, 12);
  const stack = interpolate(f, [cRe, cRe + 24], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <AbsoluteFill>
      <Room />
      <QHeader q={4} of={OF} label={LABEL} title="今年办了免测，明年还有效吗？" />
      <Answer at={cOnly} color={red[2]}>只对当年有效</Answer>
      {[
        { t: "今年", x: 200 },
        { t: "明年", x: 1060 },
      ].map((y, i) => (
        <div key={y.t} style={{ position: "absolute", left: y.x, top: 420, width: 660, height: 400, background: CREAM, border: `5px solid ${blue[0]}`, opacity: yr(i) }}>
          <div style={{ height: 76, background: blue[0], color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_CN, fontWeight: 900, fontSize: 42 }}>{y.t}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            {i === 0 ? (
              <div style={{ border: `6px solid ${green[1]}`, color: green[1], fontFamily: FONT_CN, fontWeight: 900, fontSize: 52, padding: "10px 30px", scale: String(0.6 + 0.4 * pass), opacity: pass }}>免测 · 有效</div>
            ) : (
              <div style={{ border: `6px dashed #9AA3B5`, color: "#8A93A8", fontFamily: FONT_CN, fontWeight: 900, fontSize: 48, padding: "10px 30px", opacity: expired }}>需重新申请</div>
            )}
          </div>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${760 + 520 * stack},${880 - 40 * stack})`} opacity={inn(f, cRe - 4, 8)}>
          <ListDoc x={0} y={0} s={96} color={blue[0]} bg={CREAM} />
          <ListDoc x={14} y={-10} s={96} color={blue[0]} bg={CREAM} />
          <ListDoc x={28} y={-20} s={96} color={blue[0]} bg={CREAM} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1400, top: 850 }}>
        <Tag at={cRe + 20}>重新提交全套材料</Tag>
      </div>
      <Grain />
      <Sfx at={cOnly} name="stamp" volume={0.5} />
      <Sfx at={cRe} name="swish" volume={0.45} />
    </AbsoluteFill>
  );
};

// ── c10 · Q5 免测给几分 ───────────────────────────────────────────
export const C10: React.FC = () => {
  const f = useCurrentFrame();
  const cPass = cue("c10", "及格分");
  const cShow = cue("c10", "显示");
  const cAlso = cue("c10", "另外");
  const note = inn(f, cAlso - 4, 16);
  const W = 470;
  return (
    <AbsoluteFill>
      <Room hue={green} />
      <QHeader q={5} of={OF} label={LABEL} title="免测的项目给多少分？" />
      <Answer at={cPass} color={green[1]}>给予及格分 · 显示“免测”</Answer>
      {/* score rows with a pass line */}
      <div style={{ position: "absolute", left: 160, top: 400, width: 840, background: CREAM, padding: "36px 30px 24px", boxSizing: "border-box", border: `4px solid ${green[0]}` }}>
        {ITEMS.slice(0, 5).map((r, i) => {
          const exempt = i === 2;
          const g = inn(f, 6 + i * 3, 14);
          const w = exempt ? interpolate(f, [cPass, cPass + 14], [0, 0.6], clamp) : [0.8, 0.72, 0, 0.66, 0.74][i];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 64 }}>
              <div style={{ width: 170, fontFamily: FONT_CN, fontWeight: 800, fontSize: 26, color: INK, whiteSpace: "nowrap" }}>{r.name}</div>
              <div style={{ width: W, height: 22, background: "#E3E1DA", position: "relative" }}>
                <div style={{ width: `${w * 100 * (exempt ? 1 : g)}%`, height: "100%", background: exempt ? green[2] : blue[1] }} />
                <div style={{ position: "absolute", left: W * 0.6 - 2, top: -14, width: 4, height: 50, background: red[2] }} />
              </div>
              {exempt ? (
                <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 26, color: CREAM, background: green[1], padding: "2px 12px", opacity: inn(f, cShow, 10) }}>免测</div>
              ) : null}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 30 + 170 + 16 + W * 0.6 - 30, top: 2, fontFamily: FONT_CN, fontWeight: 800, fontSize: 20, color: red[2] }}>及格线</div>
      </div>
      {/* note: students with disabilities approved for exemption */}
      <div style={{ position: "absolute", left: 1060, top: 420, width: 720, background: CREAM, border: `4px solid ${blue[0]}`, padding: "30px 34px", boxSizing: "border-box", opacity: note, translate: `${(1 - note) * 40}px 0px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width={80} height={80}>
            <Trophy x={40} y={40} s={74} color={blue[0]} />
          </svg>
          <div style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 4, color: blue[1] }}>另外</div>
        </div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 31, color: INK, lineHeight: 1.55, marginTop: 14, whiteSpace: "nowrap" }}>
          确实丧失运动能力、经核准免测的残疾学生
        </div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 36, color: green[1], lineHeight: 1.5, marginTop: 10, whiteSpace: "nowrap" }}>不受成绩限制，仍可参加评奖评优</div>
      </div>
      <Grain />
      <Sfx at={cShow} name="stamp" volume={0.45} />
      <Sfx at={cAlso} name="pop" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── c11 · Q6 未免测项目 ───────────────────────────────────────────
export const C11: React.FC = () => {
  const f = useCurrentFrame();
  const cYes = cue("c11", "要测");
  const cBook = cue("c11", "正常预约");
  const EX = [1, 5];
  return (
    <AbsoluteFill>
      <Room hue={green} />
      <QHeader q={6} of={OF} label={LABEL} title="只免测了部分项目，其他还要测吗？" />
      <Answer at={cYes} color={green[1]}>要测 · 其余项目正常预约测试</Answer>
      {ITEMS.map((t, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 160 + col * 410 + (row === 1 ? 205 : 0);
        const y = 400 + row * 280;
        const appear = pop(f, beat("c11", 1) + i * 2, 10);
        const ex = EX.includes(i);
        const bk = !ex ? pop(f, cBook + i * 2, 10) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 360, height: 240, opacity: Math.min(1, appear * 1.5), scale: String(0.7 + 0.3 * appear) }}>
            <div style={{ position: "absolute", inset: 0, background: ex ? "#E3E6EC" : CREAM, border: `4px solid ${ex ? "#A9B0C0" : bk > 0.5 ? green[1] : green[3]}` }} />
            <svg width={360} height={200} style={{ position: "absolute", left: 0, top: 0, opacity: ex ? 0.35 : 1 }}>
              <ItemIcon kind={t.kind} cx={180} cy={100} s={190} color={green[0]} far={mix(green[0], CREAM, 0.45)} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: FONT_CN, fontWeight: 800, fontSize: 26, color: ex ? "#8A93A8" : INK }}>{t.name}</div>
            {ex ? (
              <div style={{ position: "absolute", left: 100, top: 70, border: `5px solid #8A93A8`, color: "#6B7488", fontFamily: FONT_CN, fontWeight: 900, fontSize: 40, padding: "2px 16px", rotate: "-8deg", background: "rgba(246,242,234,0.9)" }}>免测</div>
            ) : null}
            {!ex && bk > 0 ? (
              <div style={{ position: "absolute", right: -14, top: -18, background: green[1], color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 26, padding: "4px 12px", scale: String(bk), whiteSpace: "nowrap" }}>预约测试</div>
            ) : null}
          </div>
        );
      })}
      <Grain />
      <Sfx at={cBook} name="click" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── c12 · recap ──────────────────────────────────────────────────
export const C12: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { n: "1", t: "怎么办", d: "按体测文件办理\nAPP 线上不受理", at: cue("c12", "缓免测按"), hue: teal },
    { n: "2", t: "证明", d: "本学期\n三甲医院出具", at: cue("c12", "疾病证明"), hue: blue },
    { n: "3", t: "有效期", d: "免测\n只当年有效", at: cue("c12", "只当年有效"), hue: blue },
    { n: "4", t: "其余项目", d: "没免测的项目\n照常预约测试", at: cue("c12", "照常预约"), hue: green },
  ];
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <MaskUp at={2}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 80, color: INK, letterSpacing: 6 }}>缓免测 · 划重点</div>
        </MaskUp>
      </div>
      {items.map((it, i) => {
        const p = pop(f, it.at - 2, 10);
        return (
          <div key={it.n} style={{ position: "absolute", left: 110 + i * 435, top: 340, width: 400, height: 380, background: CREAM, border: `5px solid ${it.hue[0]}`, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p) }}>
            <div style={{ height: 104, background: it.hue[1], display: "flex", alignItems: "center", gap: 16, padding: "0 24px" }}>
              <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 64, color: "transparent", WebkitTextStroke: `3px ${CREAM}` }}>{it.n}</div>
              <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 46, color: CREAM }}>{it.t}</div>
            </div>
            <div style={{ padding: "40px 28px", fontFamily: FONT_CN, fontWeight: 800, fontSize: 38, lineHeight: 1.6, color: INK, whiteSpace: "pre-line" }}>{it.d}</div>
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

export const C13: React.FC = () => <EndCard disclaimer={["以上内容为科普介绍，缓免测等具体安排以正式通知为准，", "动画短片不作为正式官方文件。"]} />;
