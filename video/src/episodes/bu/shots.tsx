import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Check } from "../../kit/uiIcons";
import { ScribbleCircle } from "../../kit/Track";
import { Answer, ChapterCard, CoverCard, EndCard, QHeader, Room } from "../../picto/Episode";
import { Figure, hipOnGround, POSES, walkPose, runPose } from "../../picto/Figure";
import { ItemIcon } from "../../picto/ItemIcon";
import { CREAM, FONT_CN, FONT_LATIN, FONT_MONO, HUES, INK, mix, NEUTRAL } from "../../picto/palette";
import { clamp, Grain, inn, MaskUp, pop, Sfx, Tag } from "../../kit/kit";
import { Building, Cap, Diploma, Flag, ListDoc, Lock, Trophy } from "../../kit/shapes";
import { beat, cue } from "./tl";
import { Arrow, ITEM_ROWS, Node, ScoreCard } from "../../kit/blocks";

const blue = HUES.blue;
const red = HUES.red;
const green = HUES.green;
const teal = HUES.teal;
const OF = 10;
const LABEL = "补测";

// ── shared pieces ─────────────────────────────────────────────
// ── b01 · cold open: the score card fails ─────────────────────────
export const B01: React.FC = () => {
  const f = useCurrentFrame();
  const c60 = cue("b01", "六十分");
  const cHold = cue("b01", "别慌");
  return (
    <AbsoluteFill style={{ background: NEUTRAL }}>
      <ScoreCard x={150} y={170} f={f} start={2} total={56} lens={[0.8, 0.55, 0.62, 0.5, 0.35, 0.7, 0.45]} label="体测成绩单" stampAt={c60 + 4} stamp="不及格" />
      <div style={{ position: "absolute", left: 1000, top: 330 }}>
        <MaskUp at={cHold}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 150, lineHeight: 1.1, color: CREAM, letterSpacing: 6 }}>别慌，</div>
        </MaskUp>
        <MaskUp at={cHold + 10}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 150, lineHeight: 1.1, color: red[3], letterSpacing: 6 }}>还有补测。</div>
        </MaskUp>
      </div>
      <Grain />
      <Sfx at={c60 + 4} name="stamp" volume={0.7} />
      <Sfx at={cHold + 10} name="whistle" volume={0.35} />
    </AbsoluteFill>
  );
};

// ── b02 · cover ───────────────────────────────────────────────────
export const B02: React.FC = () => (
  <CoverCard
    episode="第六期"
    tag="补测篇"
    subtitle="南昌大学《学生体质健康标准》Q&A"
    questions={[
      { t: "谁要补测？", at: beat("b02", 3) },
      { t: "什么时候补？", at: beat("b02", 4) },
      { t: "怎么补？", at: beat("b02", 5) },
    ]}
  />
);

export const B03: React.FC = () => <ChapterCard n="01" title="谁要补测" en="WHO" sub="单项不及格 · 要不要报名" hue={blue} seed={11} />;
export const B06: React.FC = () => <ChapterCard n="02" title="什么时候补" en="WHEN" sub="补测时间 · 能否提前 · 往年成绩" hue={teal} seed={41} />;
export const B09: React.FC = () => <ChapterCard n="03" title="怎么补" en="HOW" sub="复测项目 · 分值标准 · 成绩取舍" hue={green} seed={53} />;
export const B13: React.FC = () => <ChapterCard n="04" title="补完之后" en="AFTER" sub="仍不及格 · 可否放弃" hue={red} seed={67} />;

// ── b04 · Q1 单项不及格要补测吗 ────────────────────────────────────
const Scenario: React.FC<{ x: number; at: number; title: string; total: string; ok: boolean; verdict: string; f: number; kind: "single" | "total" | "missing" }> = ({ x, at, title, total, ok, verdict, f, kind }) => {
  const p = inn(f, at, 14);
  const v = pop(f, at + 12, 10);
  const rows = kind === "single" ? [0.8, 0.4, 0.75, 0.7] : kind === "total" ? [0.5, 0.45, 0.55, 0.4] : [0.8, -1, 0.7, 0.75];
  return (
    <div style={{ position: "absolute", left: x, top: 400, width: 500, opacity: p, translate: `0px ${(1 - p) * 40}px` }}>
      <div style={{ background: CREAM, border: `4px solid ${blue[0]}`, padding: "22px 26px" }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 44, color: INK }}>{title}</div>
        <div style={{ marginTop: 16 }}>
          {rows.map((l, i) => (
            <div key={i} style={{ height: 38, display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, height: 18, background: "#E3E1DA", position: "relative" }}>
                {l < 0 ? <div style={{ position: "absolute", inset: -2, border: `3px dashed ${red[2]}` }} /> : <div style={{ width: `${l * 100}%`, height: "100%", background: l < 0.6 ? red[2] : blue[1] }} />}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 700, fontSize: 24, color: "#5B6680" }}>总分</div>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 36, color: ok ? green[1] : red[2] }}>{total}</div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", opacity: Math.min(1, v * 1.5), scale: String(0.7 + 0.3 * v) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: ok ? mix(green[4], CREAM, 0.3) : red[2], color: ok ? green[0] : CREAM, border: ok ? `3px solid ${green[1]}` : "none", padding: "10px 26px", fontFamily: FONT_CN, fontWeight: 900, fontSize: 36 }}>
          {ok ? <Check size={30} color={green[1]} /> : null}
          {verdict}
        </div>
      </div>
    </div>
  );
};

export const B04: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Room />
      <QHeader q={1} of={OF} label={LABEL} title="单项不及格，需要补测吗？" />
      <Answer at={cue("b04", "不需要")}>不需要 · 总分不及格或有缺项才补测</Answer>
      <Scenario x={120} at={beat("b04", 2)} title="单项不及格" total="及格" ok verdict="不用补测" f={f} kind="single" />
      <Scenario x={710} at={cue("b04", "总成绩不及格") - 4} title="总分不及格" total="不及格" ok={false} verdict="需要补测" f={f} kind="total" />
      <Scenario x={1300} at={cue("b04", "缺项") - 4} title="有缺项" total="—" ok={false} verdict="需要补测" f={f} kind="missing" />
      <Grain />
      <Sfx at={cue("b04", "不需要")} name="pop" volume={0.5} />
      <Sfx at={cue("b04", "总成绩不及格") + 8} name="stamp" volume={0.45} />
      <Sfx at={cue("b04", "缺项") + 8} name="stamp" volume={0.45} />
    </AbsoluteFill>
  );
};

// ── b05 · Q2 要不要报名 ─────────────────────────────────────────────
export const B05: React.FC = () => {
  const f = useCurrentFrame();
  const a1 = cue("b05", "低于六十分");
  const a2 = cue("b05", "补测名单");
  const a3 = cue("b05", "体育学院");
  const a4 = cue("b05", "各学院教务办");
  const X = [300, 740, 1180, 1620];
  const Y = 610;
  return (
    <AbsoluteFill>
      <Room />
      <QHeader q={2} of={OF} label={LABEL} title="补测要不要报名？" />
      <Answer at={cue("b05", "不用报名")}>不用报名 · 自动进入补测名单</Answer>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Arrow x1={X[0] + 125} y1={Y} x2={X[1] - 125} y2={Y} p={inn(f, a2 - 8, 10)} />
        <Arrow x1={X[1] + 125} y1={Y} x2={X[2] - 125} y2={Y} p={inn(f, a3 - 8, 10)} />
        <Arrow x1={X[2] + 125} y1={Y} x2={X[3] - 125} y2={Y} p={inn(f, a4 - 8, 10)} />
      </svg>
      <Node x={X[0]} y={Y} at={a1} f={f} label="当年成绩 < 60 分" accent={red[2]}>
        <text x={110} y={140} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={900} fontSize={96} fill={red[2]}>&lt;60</text>
      </Node>
      <Node x={X[1]} y={Y} at={a2} f={f} label="进入补测名单" sub="无须报名">
        <ListDoc x={110} y={110} s={120} color={blue[0]} />
      </Node>
      <Node x={X[2]} y={Y} at={a3} f={f} label="体育学院">
        <Building x={110} y={110} s={120} color={blue[0]} />
      </Node>
      <Node x={X[3]} y={Y} at={a4} f={f} label="各学院教务办" sub="名单发到学院">
        <g>
          <Building x={80} y={120} s={80} color={blue[0]} />
          <Building x={145} y={105} s={80} color={blue[1]} />
        </g>
      </Node>
      <Grain />
      {[a1, a2, a3, a4].map((a) => (
        <Sfx key={a} at={a} name="pop" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

// ── b07 · Q3 什么时候 + Q4 能否提前 ────────────────────────────────
export const B07: React.FC = () => {
  const f = useCurrentFrame();
  const q4 = cue("b07", "已经不及格");
  const phaseB = inn(f, q4 - 6, 14);
  const stages = ["预约", "测试", "出成绩", "补测"];
  const fill = interpolate(f, [beat("b07", 2), cue("b07", "具体时间") + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const cNo = cue("b07", "不可以");
  const cDoc = cue("b07", "统一按照");
  // phase B: student runs to the gate, is stopped
  const runX = interpolate(f, [q4, q4 + 40], [300, 880], { ...clamp, easing: Easing.bezier(0.3, 0, 0.6, 1) });
  const running = f >= q4 && f < q4 + 40;
  const rp = runPose((f / 14) * Math.PI * 2);
  const pose = running ? rp.pose : POSES.stand;
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <QHeader q={3} of={OF} label={LABEL} title="补测一般在什么时候？" second={{ q: 4, title: "已经不及格，能提前补测吗？", at: q4 }} />
      {/* phase A: the season's progress — the student walks along it */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - phaseB }}>
        <Answer at={cue("b07", "具体时间")} color={teal[1]}>根据体测开展进度而定</Answer>
        <div style={{ position: "absolute", left: 200, top: 552, width: 1520, height: 22, background: CREAM, border: `4px solid ${teal[0]}` }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: teal[2] }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {(() => {
            const g = walkPose((f / 30) * Math.PI * 2);
            const moving = fill > 0.01 && fill < 0.99;
            const pose = moving ? g.pose : POSES.stand;
            return <Figure x={200 + 1520 * fill} y={hipOnGround(pose, 200, 548)} H={200} pose={pose} color={teal[0]} farColor={mix(teal[0], teal[4], 0.4)} />;
          })()}
        </svg>
        {stages.map((st, i) => {
          const x = 200 + (1520 / 3) * i;
          const on = fill >= i / 3 - 0.001;
          const q = i === 3 && f < cue("b07", "具体时间");
          return (
            <div key={st} style={{ position: "absolute", left: x - 90, top: 545, width: 180, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: on ? teal[0] : CREAM, border: `4px solid ${teal[0]}` }} />
              <div style={{ marginTop: 22, width: 112, height: 112, borderRadius: 56, background: CREAM, boxShadow: `0 0 0 5px ${on ? teal[0] : teal[3]}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={112} height={112}>
                  {i === 0 ? <ListDoc x={56} y={56} s={62} color={teal[0]} /> : null}
                  {i === 1 ? <ItemIcon kind="run" cx={56} cy={50} s={96} color={teal[0]} far={teal[3]} /> : null}
                  {i === 2 ? (
                    <g>
                      <rect x={28} y={24} width={56} height={66} rx={6} fill="none" stroke={teal[0]} strokeWidth={5} />
                      <text x={56} y={70} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={900} fontSize={30} fill={teal[0]}>分</text>
                    </g>
                  ) : null}
                  {i === 3 ? (q ? <text x={56} y={76} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={900} fontSize={60} fill={red[2]}>?</text> : <Flag x={56} y={56} s={64} color={red[2]} />) : null}
                </svg>
              </div>
              <div style={{ marginTop: 14, fontFamily: FONT_CN, fontWeight: 900, fontSize: 34, color: on ? INK : "#8A93A8", whiteSpace: "nowrap" }}>{st}</div>
            </div>
          );
        })}
      </div>
      {/* phase B: the gate is closed until the notice */}
      <div style={{ position: "absolute", inset: 0, opacity: phaseB }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={1060} y={380} width={300} height={420} fill={CREAM} stroke={teal[0]} strokeWidth={8} />
          <text x={1210} y={450} textAnchor="middle" fontFamily={FONT_CN} fontWeight={900} fontSize={44} fill={teal[0]}>补测</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={1090 + i * 60} y1={480} x2={1090 + i * 60} y2={800} stroke={teal[0]} strokeWidth={10} />
          ))}
          <g opacity={pop(f, cNo, 10)}>
            <Lock x={1210} y={630} s={130} color={red[2]} />
          </g>
          <Figure x={runX} y={hipOnGround(pose, 380, 800)} H={380} pose={pose} color={teal[0]} farColor={mix(teal[0], teal[4], 0.4)} />
        </svg>
        <Answer at={cNo} color={red[2]}>不可提前</Answer>
        <div style={{ position: "absolute", left: 1420, top: 540 }}>
          <Tag at={cDoc}>统一按补测文件要求进行</Tag>
        </div>
      </div>
      <Grain />
      <Sfx at={cNo} name="stamp" volume={0.55} />
      <Sfx at={q4 + 40} name="thud" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── b08 · Q5 往年成绩能补吗 ─────────────────────────────────────────
export const B08: React.FC = () => {
  const f = useCurrentFrame();
  const cNo = cue("b08", "不能");
  const cRule = cue("b08", "当年成绩当年补");
  const years = [
    { t: "上一学年", x: 280 },
    { t: "本学年", x: 1100 },
  ];
  const cross = pop(f, cNo, 10);
  const loops = inn(f, cRule, 16);
  return (
    <AbsoluteFill>
      <Room hue={teal} />
      <QHeader q={5} of={OF} label={LABEL} title="上一年的成绩，能拿到今年补吗？" />
      <Answer at={cNo} color={red[2]}>不能 · 当年成绩当年补</Answer>
      {years.map((y, i) => (
        <div key={y.t} style={{ position: "absolute", left: y.x, top: 430, width: 540, height: 380, background: CREAM, border: `5px solid ${teal[0]}`, opacity: inn(f, beat("b08", 1 + i), 12) }}>
          <div style={{ height: 70, background: teal[0], color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_CN, fontWeight: 900, fontSize: 40 }}>{y.t}</div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 300 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 30, color: INK }}>体测</div>
              <div style={{ width: 120, height: 16, background: red[2], marginTop: 12 }} />
            </div>
            <svg width={90} height={60} style={{ opacity: loops }}>
              <path d="M10 30 H70 M56 16 L72 30 L56 44" stroke={green[1]} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ textAlign: "center", opacity: loops }}>
              <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 30, color: green[1] }}>补测</div>
              <div style={{ width: 120, height: 16, background: green[2], marginTop: 12 }} />
            </div>
          </div>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M720 470 Q960 360 1200 470" fill="none" stroke={red[2]} strokeWidth={7} strokeDasharray="14 12" opacity={inn(f, beat("b08", 3), 10)} />
        {cross > 0 ? (
          <g transform={`translate(960,395) scale(${0.6 + 0.4 * cross})`} opacity={cross}>
            <circle r={48} fill={red[2]} />
            <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={CREAM} strokeWidth={9} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      <Grain />
      <Sfx at={cNo} name="stamp" volume={0.5} />
      <Sfx at={cRule} name="ding" volume={0.3} />
    </AbsoluteFill>
  );
};

// ── b10 · Q6 全部重测还是选项目 ─────────────────────────────────────
export const B10: React.FC = () => {
  const f = useCurrentFrame();
  const cPick = cue("b10", "想要提升");
  const cMust = cue("b10", "不允许缺项");
  const tiles = ITEM_ROWS.map((r, i) => ({ ...r, i }));
  const MISSING = 4;
  const PICK = [1, 3];
  return (
    <AbsoluteFill>
      <Room hue={green} />
      <QHeader q={6} of={OF} label={LABEL} title="补测要全部重测吗？" />
      <Answer at={cue("b10", "不用")} color={green[1]}>不用全部重测 · 选想提升的项目</Answer>
      {tiles.map((t) => {
        const col = t.i % 4;
        const row = Math.floor(t.i / 4);
        const x = 160 + col * 410 + (row === 1 ? 205 : 0);
        const y = 400 + row * 280;
        const appear = pop(f, beat("b10", 1) + t.i * 2, 10);
        const picked = PICK.includes(t.i) && f >= cPick;
        const missing = t.i === MISSING;
        const pk = pop(f, cPick + PICK.indexOf(t.i) * 5, 10);
        const must = missing ? pop(f, cMust, 10) : 0;
        return (
          <div key={t.i} style={{ position: "absolute", left: x, top: y, width: 360, height: 240, opacity: Math.min(1, appear * 1.5), scale: String(0.7 + 0.3 * appear) }}>
            <div style={{ position: "absolute", inset: 0, background: missing ? "transparent" : CREAM, border: missing ? `4px dashed ${red[2]}` : `4px solid ${picked ? green[1] : green[3]}`, boxShadow: picked ? `0 0 0 ${6 * pk}px ${mix(green[3], CREAM, 0.3)}` : "none" }} />
            <svg width={360} height={200} style={{ position: "absolute", left: 0, top: 0, opacity: missing ? 0.45 : 1 }}>
              <ItemIcon kind={t.kind} cx={180} cy={100} s={190} color={green[0]} far={mix(green[0], CREAM, 0.45)} t={f / 30} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: FONT_CN, fontWeight: 800, fontSize: 26, color: INK }}>{t.name}</div>
            {picked ? (
              <div style={{ position: "absolute", right: -14, top: -18, background: green[1], color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 28, padding: "4px 14px", scale: String(pk) }}>复测</div>
            ) : null}
            {missing && must > 0 ? (
              <div style={{ position: "absolute", right: -14, top: -18, background: red[2], color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 28, padding: "4px 14px", scale: String(must) }}>必须测</div>
            ) : null}
          </div>
        );
      })}
      {f >= cMust ? <ScribbleCircle at={cMust + 2} x={160 + 0 * 410 + 205 - 22} y={680 - 20} w={404} h={280} color={red[2]} /> : null}
      <Grain />
      <Sfx at={cPick} name="click" volume={0.5} />
      <Sfx at={cPick + 5} name="click" volume={0.5} />
      <Sfx at={cMust} name="stamp" volume={0.55} />
    </AbsoluteFill>
  );
};

// ── b11 · Q7 分值标准一致吗 ────────────────────────────────────────
const Ruler: React.FC<{ y: number; label: string; color: string; f: number; at: number }> = ({ y, label, color, f, at }) => {
  const p = inn(f, at, 16);
  return (
    <g opacity={p} transform={`translate(${(1 - p) * -80},0)`}>
      <text x={250} y={y + 12} textAnchor="end" fontFamily={FONT_CN} fontWeight={900} fontSize={40} fill={INK}>{label}</text>
      <rect x={290} y={y - 30} width={1340} height={60} fill={CREAM} stroke={color} strokeWidth={5} />
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={i} x1={290 + i * 67} y1={y - 30} x2={290 + i * 67} y2={y - 30 + (i % 5 === 0 ? 40 : 22)} stroke={color} strokeWidth={4} />
      ))}
      {[0, 20, 40, 60, 80, 100].map((v, i) => (
        <text key={v} x={290 + i * 268} y={y + 70} textAnchor="middle" fontFamily={FONT_LATIN} fontWeight={800} fontSize={28} fill={color}>{v}</text>
      ))}
    </g>
  );
};
export const B11: React.FC = () => {
  const f = useCurrentFrame();
  const cSame = cue("b11", "完全一致");
  const eq = pop(f, cSame, 10);
  return (
    <AbsoluteFill>
      <Room hue={green} />
      <QHeader q={7} of={OF} label={LABEL} title="补测的分值标准，和正常测试一样吗？" />
      <Answer at={cSame} color={green[1]}>完全一致</Answer>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Ruler y={500} label="正常测试" color={blue[0]} f={f} at={beat("b11", 1)} />
        <Ruler y={700} label="补测" color={green[0]} f={f} at={beat("b11", 2)} />
        {eq > 0 ? (
          <g transform={`translate(1760,600) scale(${0.6 + 0.4 * eq})`} opacity={eq}>
            <circle r={62} fill={green[1]} />
            <path d="M-26 -12 H26 M-26 12 H26" stroke={CREAM} strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : null}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={290 + i * 268} y1={540} x2={290 + i * 268} y2={660} stroke={green[1]} strokeWidth={3} strokeDasharray="6 8" opacity={inn(f, cSame + i * 2, 8)} />
        ))}
      </svg>
      <Grain />
      <Sfx at={cSame} name="ding" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── b12 · Q8 会覆盖原成绩吗 ────────────────────────────────────────
export const B12: React.FC = () => {
  const f = useCurrentFrame();
  const cL = cue("b12", "身高体重");
  const cB = cue("b12", "其他项目");
  const left = inn(f, cL - 6, 14);
  const right = inn(f, cB - 6, 14);
  const hlL = pop(f, cL + 20, 10);
  const hlR = pop(f, cB + 20, 10);
  const Bar: React.FC<{ label: string; w: number; hi: boolean; color: string }> = ({ label, w, hi, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 70 }}>
      <div style={{ width: 90, fontFamily: FONT_CN, fontWeight: 800, fontSize: 28, color: INK }}>{label}</div>
      <div style={{ width: w, height: 34, background: hi ? color : "#C9CED9" }} />
      {hi ? <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 26, color, whiteSpace: "nowrap" }}>✓ 计入</div> : null}
    </div>
  );
  return (
    <AbsoluteFill>
      <Room hue={green} />
      <QHeader q={8} of={OF} label={LABEL} title="补测成绩会覆盖原来的成绩吗？" />
      <div style={{ position: "absolute", left: 958, top: 390, width: 4, height: 500, background: green[0], opacity: 0.25 }} />
      <div style={{ position: "absolute", left: 150, top: 400, opacity: left, translate: `${(1 - left) * -40}px 0px` }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 52, color: INK }}>身高体重</div>
        <div style={{ display: "inline-block", marginTop: 10, background: blue[1], color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 38, padding: "6px 20px" }}>取最新</div>
        <div style={{ marginTop: 40 }}>
          <Bar label="原测" w={420} hi={false} color={blue[1]} />
          <Bar label="补测" w={400} hi={hlL > 0.5} color={blue[1]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1050, top: 400, opacity: right, translate: `${(1 - right) * 40}px 0px` }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 52, color: INK }}>其他项目</div>
        <div style={{ display: "inline-block", marginTop: 10, background: green[1], color: CREAM, fontFamily: FONT_CN, fontWeight: 900, fontSize: 38, padding: "6px 20px" }}>取最好</div>
        <div style={{ marginTop: 40 }}>
          <Bar label="原测" w={330} hi={false} color={green[1]} />
          <Bar label="补测" w={470} hi={hlR > 0.5} color={green[1]} />
        </div>
      </div>
      <Grain />
      <Sfx at={cL + 20} name="click" volume={0.5} />
      <Sfx at={cB + 20} name="click" volume={0.5} />
    </AbsoluteFill>
  );
};

// ── b14 · Q9 补测后仍不及格 ────────────────────────────────────────
export const B14: React.FC = () => {
  const f = useCurrentFrame();
  const cV = cue("b14", "视为");
  return (
    <AbsoluteFill style={{ background: NEUTRAL }}>
      <div style={{ position: "absolute", left: 72, top: 170 }}>
        <QHeaderDark />
      </div>
      <ScoreCard x={150} y={330} f={f} start={beat("b14", 2)} total={57} lens={[0.8, 0.6, 0.62, 0.55, 0.4, 0.65, 0.5]} label="补测后成绩" stampAt={cV + 4} stamp="不及格" />
      <div style={{ position: "absolute", left: 1000, top: 460, width: 800 }}>
        <MaskUp at={cV}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 92, lineHeight: 1.2, color: CREAM }}>视为</div>
        </MaskUp>
        <MaskUp at={cV + 6}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 92, lineHeight: 1.2, color: red[3] }}>当年体测</div>
        </MaskUp>
        <MaskUp at={cV + 12}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 92, lineHeight: 1.2, color: red[3] }}>成绩不及格</div>
        </MaskUp>
      </div>
      <Grain />
      <Sfx at={cV + 4} name="stamp" volume={0.7} />
    </AbsoluteFill>
  );
};
const QHeaderDark: React.FC = () => {
  const f = useCurrentFrame();
  const t = inn(f, 2, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: t }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: red[2], color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 44 }}>Q9</div>
      <div>
        <div style={{ fontFamily: `${FONT_MONO}, ${FONT_CN}`, fontSize: 22, letterSpacing: 5, color: red[3] }}>{LABEL} · 09 / 10</div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 58, color: CREAM, marginTop: 4 }}>补测后仍不及格，怎么办？</div>
      </div>
    </div>
  );
};

// ── b15 · Q10 可以放弃吗 ─────────────────────────────────────────
export const B15: React.FC = () => {
  const f = useCurrentFrame();
  const cChance = cue("b15", "提升机会");
  const cGive = cue("b15", "如果放弃");
  const cons = [cue("b15", "评奖评优"), cue("b15", "推免"), cue("b15", "毕业")];
  const cKeep = cue("b15", "珍惜");
  const up = inn(f, cChance - 4, 14);
  const down = inn(f, cGive - 4, 14);
  const walk = interpolate(f, [cKeep, cKeep + 70], [0, 1], clamp);
  const walking = walk > 0 && walk < 1;
  const w = walkPose((f / 30) * Math.PI * 2);
  const figX = 330 + 300 * walk;
  const figG = 800 - 0 * walk;
  return (
    <AbsoluteFill>
      <Room hue={red} />
      <QHeader q={10} of={OF} label={LABEL} title="可以放弃补测吗？" />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* the fork */}
        <path d="M560 740 C760 740 800 520 1000 500" fill="none" stroke={green[1]} strokeWidth={70} strokeLinecap="round" opacity={up} />
        <path d="M560 740 C760 740 800 900 1000 900" fill="none" stroke={red[2]} strokeWidth={70} strokeLinecap="round" opacity={down * (walk > 0 ? 0.35 : 1)} />
        <Figure x={figX} y={hipOnGround(walking ? w.pose : POSES.stand, 360, figG)} H={360} pose={walking ? w.pose : POSES.stand} color={blue[0]} farColor={mix(blue[0], red[4], 0.4)} />
      </svg>
      {/* up: take the chance */}
      <div style={{ position: "absolute", left: 1040, top: 400, opacity: up, translate: `${(1 - up) * 30}px 0px` }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 50, color: green[0] }}>参加补测</div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 700, fontSize: 32, color: INK, marginTop: 6 }}>一次成绩提升机会</div>
      </div>
      {/* down: give up → consequences */}
      <div style={{ position: "absolute", left: 1040, top: 760, opacity: down * (walk > 0 ? 0.45 : 1), translate: `${(1 - down) * 30}px 0px` }}>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 50, color: red[1] }}>放弃补测 → 维持不及格</div>
        <div style={{ display: "flex", gap: 34, marginTop: 20 }}>
          {[
            { t: "评奖评优", I: Trophy, at: cons[0] },
            { t: "推免", I: Cap, at: cons[1] },
            { t: "毕业", I: Diploma, at: cons[2] },
          ].map(({ t, I, at }) => {
            const p = pop(f, at, 10);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p) }}>
                <svg width={64} height={64}>
                  <I x={32} y={32} s={60} color={red[1]} />
                </svg>
                <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 32, color: INK }}>{t}</div>
                <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 36, color: red[2] }}>!</div>
              </div>
            );
          })}
        </div>
      </div>
      <Answer at={cKeep} color={green[1]} top={300}>珍惜补测机会</Answer>
      <Grain />
      {cons.map((a) => (
        <Sfx key={a} at={a} name="click" volume={0.45} />
      ))}
      <Sfx at={cKeep} name="ding" volume={0.35} />
    </AbsoluteFill>
  );
};

// ── b16 · recap ───────────────────────────────────────────────────
export const B16: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { n: "1", t: "谁要补", d: "总分不及格或有缺项\n不用报名，自动进名单", at: cue("b16", "总分不及格"), hue: blue },
    { n: "2", t: "什么时候", d: "不能提前\n当年成绩当年补", at: cue("b16", "补测不能提前"), hue: teal },
    { n: "3", t: "怎么补", d: "可只复测想提升的项目\n但不能有缺项", at: cue("b16", "可以只复测"), hue: green },
  ];
  const last = cue("b16", "补测机会");
  return (
    <AbsoluteFill>
      <Room />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center" }}>
        <MaskUp at={2}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 80, color: INK, letterSpacing: 6 }}>补测 · 划重点</div>
        </MaskUp>
      </div>
      {items.map((it, i) => {
        const p = pop(f, it.at - 2, 10);
        return (
          <div key={it.n} style={{ position: "absolute", left: 150 + i * 555, top: 340, width: 510, height: 350, background: CREAM, border: `5px solid ${it.hue[0]}`, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p) }}>
            <div style={{ height: 110, background: it.hue[1], display: "flex", alignItems: "center", gap: 18, padding: "0 28px" }}>
              <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 70, color: "transparent", WebkitTextStroke: `3px ${CREAM}` }}>{it.n}</div>
              <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 50, color: CREAM }}>{it.t}</div>
            </div>
            <div style={{ padding: "40px 32px", fontFamily: FONT_CN, fontWeight: 800, fontSize: 42, lineHeight: 1.6, color: INK, whiteSpace: "pre-line" }}>{it.d}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
        <div style={{ background: red[2], color: CREAM, padding: "10px 34px", fontFamily: FONT_CN, fontWeight: 900, fontSize: 46, letterSpacing: 3, opacity: Math.min(1, pop(f, last, 10) * 1.5), scale: String(0.7 + 0.3 * pop(f, last, 10)) }}>补测机会，一定要珍惜！</div>
      </div>
      <Grain />
      {items.map((it) => (
        <Sfx key={it.n} at={it.at - 2} name="stamp" volume={0.4} />
      ))}
      <Sfx at={last} name="ding" volume={0.4} />
    </AbsoluteFill>
  );
};

// ── b17 · end card ───────────────────────────────────────────────
export const B17: React.FC = () => <EndCard disclaimer={["以上内容为科普介绍，补测等具体安排以正式通知为准，", "动画短片不作为正式官方文件。"]} />;
