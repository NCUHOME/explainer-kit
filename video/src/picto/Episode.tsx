import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { TLHelpers } from "../lib/tl";
import { OVERLAP } from "../lib/tl";
import { Grain, inn, MaskUp, pop, Sfx } from "../kit/kit";
import { Reveal } from "../kit/Reveal";
import { BRAND } from "../brand";
import { BrandTab, NCU_BLUE, OfficeLockup } from "./Brand";
import { Figure, hipOnGround, runPose } from "./Figure";
import { CaptionBand } from "./Hud";
import { CREAM, FONT_CN, FONT_LATIN, FONT_MONO, Hue, HUES, INK, mix } from "./palette";
import { Pattern } from "./Pattern";

const blue = HUES.blue;
const red = HUES.red;

/** Horizontal running track with moving distance marks. */
export const TrackStrip: React.FC<{ x: number; y: number; w: number; h: number; lanes: number; travel: number }> = ({ x, y, w, h, lanes, travel }) => {
  const laneH = h / lanes;
  const gap = 420;
  const off = -(travel % gap);
  const marks: React.ReactNode[] = [];
  for (let i = -1; i < w / gap + 2; i++)
    for (let l = 0; l < lanes; l++) marks.push(<rect key={`${i}-${l}`} x={x + off + i * gap} y={y + l * laneH + laneH * 0.42} width={46} height={laneH * 0.16} fill={CREAM} opacity={0.55} />);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id={`tc${x}${y}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={red[2]} />
      {Array.from({ length: lanes + 1 }).map((_, l) => (
        <rect key={l} x={x} y={y + l * laneH - 3} width={w} height={6} fill={CREAM} opacity={0.92} />
      ))}
      <g clipPath={`url(#tc${x}${y})`}>{marks}</g>
    </svg>
  );
};

/** Series cover: official lockup, 教务答疑直通车, episode ribbon, question chips, runner. */
export const CoverCard: React.FC<{ episode: string; tag: string; subtitle: string; questions: { t: string; at: number }[] }> = ({ episode, tag, subtitle, questions }) => {
  const f = useCurrentFrame();
  const panel = { x: 230, y: 108, w: 1460, h: 782 };
  const rise = inn(f, 0, 20);
  const { pose, lift } = runPose((f / 14) * Math.PI * 2);
  const stripY = panel.y + panel.h - 120;
  return (
    <AbsoluteFill style={{ background: blue[1] }}>
      <Pattern hue={blue} seed={23} contrast="full" shift={f * 0.8} />
      <div style={{ position: "absolute", inset: 0, translate: `0px ${(1 - rise) * 760}px` }}>
        <div style={{ position: "absolute", left: panel.x, top: panel.y, width: panel.w, height: panel.h, background: CREAM, boxShadow: "0 30px 80px rgba(27,63,143,0.35)" }} />
        <div style={{ position: "absolute", left: panel.x, top: panel.y + 60, width: panel.w, display: "flex", justifyContent: "center", opacity: inn(f, 8, 16) }}>
          <OfficeLockup height={120} variant="color" />
        </div>
        <div style={{ position: "absolute", left: panel.x, top: panel.y + 240, width: panel.w, display: "flex", justifyContent: "center" }}>
          <MaskUp at={14}>
            <div style={{ fontFamily: "Noto Serif SC", fontWeight: 900, fontSize: 124, lineHeight: 1, color: blue[0], letterSpacing: 16, whiteSpace: "nowrap" }}>{BRAND.series}</div>
          </MaskUp>
        </div>
        <div style={{ position: "absolute", left: panel.x, top: panel.y + 404, width: panel.w, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: inn(f, 22, 14) }}>
          <div style={{ fontFamily: FONT_CN, fontWeight: 800, fontSize: 36, color: CREAM, background: blue[1], padding: "6px 20px", letterSpacing: 3, whiteSpace: "nowrap" }}>
            {episode} · {tag}
          </div>
          <div style={{ fontFamily: FONT_CN, fontWeight: 700, fontSize: 36, color: blue[1], letterSpacing: 2, whiteSpace: "nowrap" }}>{subtitle}</div>
        </div>
        <div style={{ position: "absolute", left: panel.x, top: panel.y + 510, width: panel.w, display: "flex", justifyContent: "center", gap: 28 }}>
          {questions.map((q) => {
            const p = pop(f, q.at - 2, 10);
            return (
              <div key={q.t} style={{ display: "flex", alignItems: "center", gap: 14, border: `4px solid ${blue[0]}`, padding: "10px 24px 10px 12px", fontFamily: FONT_CN, fontWeight: 800, fontSize: 38, color: blue[0], opacity: Math.min(1, p * 1.6), scale: String(0.6 + 0.4 * p), whiteSpace: "nowrap" }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: red[2], color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 30 }}>?</div>
                {q.t}
              </div>
            );
          })}
        </div>
        <TrackStrip x={panel.x} y={stripY} w={panel.w} h={120} lanes={2} travel={f * 22} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <Figure x={1520} y={hipOnGround(pose, 130, stripY + 100, lift * lift * 8)} H={130} pose={pose} color={blue[0]} farColor={mix(blue[0], CREAM, 0.38)} />
        </svg>
      </div>
      <Grain />
      {questions.map((q) => (
        <Sfx key={q.t} at={q.at - 2} name="pop" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

/** Chapter card: full-contrast pattern in the chapter hue, band with outlined numeral. */
export const ChapterCard: React.FC<{ n: string; title: string; en: string; sub: string; hue: Hue; seed?: number; titleAt?: number }> = ({ n, title, en, sub, hue, seed = 11, titleAt = 16 }) => {
  const f = useCurrentFrame();
  const drift = f * 1.1 + 90 * inn(f, 0, 24);
  const band = inn(f, 0, 12);
  const kicker = `CHAPTER ${n} · ${en}`;
  const typed = kicker.slice(0, Math.max(0, Math.floor((f - 8) / 1.2)));
  return (
    <AbsoluteFill style={{ background: hue[1] }}>
      <Pattern hue={hue} seed={seed} contrast="full" shift={drift} />
      <div style={{ position: "absolute", left: 0, top: 360, height: 360, width: 1920 * band, background: hue[0] }} />
      <div style={{ position: "absolute", left: 180, top: 360, height: 360, display: "flex", alignItems: "center", gap: 56 }}>
        <MaskUp at={4}>
          <div style={{ fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 300, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${CREAM}`, letterSpacing: -8 }}>{n}</div>
        </MaskUp>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 6, color: hue[3], marginBottom: 10, height: 30, whiteSpace: "nowrap" }}>{typed}</div>
          <MaskUp at={titleAt}>
            <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 170, lineHeight: 1, color: CREAM, letterSpacing: 4, whiteSpace: "nowrap" }}>{title}</div>
          </MaskUp>
          <MaskUp at={titleAt + 4}>
            <div style={{ fontFamily: FONT_CN, fontWeight: 700, fontSize: 42, color: hue[3], marginTop: 18, letterSpacing: 3, whiteSpace: "nowrap" }}>{sub}</div>
          </MaskUp>
        </div>
      </div>
      <Grain />
      <Sfx at={0} name="swish" volume={0.5} />
    </AbsoluteFill>
  );
};

/** Question header: red Q medallion, index, question title. `swapAt` switches to a second question. */
export const QHeader: React.FC<{ q: number; of: number; label: string; title: string; second?: { q: number; title: string; at: number }; top?: number }> = ({ q, of, label, title, second, top = 170 }) => {
  const f = useCurrentFrame();
  const useSecond = second && f >= second.at;
  const cur = useSecond ? second : { q, title };
  const at = useSecond ? second!.at : 2;
  const t = inn(f, at, 12);
  return (
    <div key={cur.q} style={{ position: "absolute", left: 72, top, display: "flex", alignItems: "center", gap: 24, opacity: t, translate: `${(1 - t) * -40}px 0px` }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: red[2], color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_LATIN, fontWeight: 900, fontSize: 44, flexShrink: 0 }}>Q{cur.q}</div>
      <div>
        <div style={{ fontFamily: `${FONT_MONO}, ${FONT_CN}`, fontSize: 22, letterSpacing: 5, color: blue[1] }}>
          {label} · {String(cur.q).padStart(2, "0")} / {String(of).padStart(2, "0")}
        </div>
        <div style={{ fontFamily: FONT_CN, fontWeight: 900, fontSize: 58, color: INK, letterSpacing: 2, marginTop: 4, whiteSpace: "nowrap" }}>{cur.title}</div>
      </div>
    </div>
  );
};

/** Answer banner: the one-line answer, stamped under the header. */
export const Answer: React.FC<{ at: number; children: React.ReactNode; color?: string; top?: number; left?: number }> = ({ at, children, color = blue[1], top = 300, left = 192 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 10);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left, top, display: "flex", alignItems: "center", gap: 14, background: color, color: CREAM, padding: "8px 24px", fontFamily: FONT_CN, fontWeight: 900, fontSize: 40, letterSpacing: 2, opacity: Math.min(1, p * 1.5), scale: String(0.7 + 0.3 * p), transformOrigin: "left center", whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};

/** Light room: wall + floor band (the series' default stage). */
export const Room: React.FC<{ hue?: Hue; floor?: number }> = ({ hue = blue, floor = 800 }) => (
  <>
    <AbsoluteFill style={{ background: hue[4] }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: floor, bottom: 0, background: hue[3] }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: floor, height: 6, background: mix(hue[3], hue[0], 0.25) }} />
  </>
);

/** End card: official lockup, disclaimer; held still. */
export const EndCard: React.FC<{ disclaimer?: string[] }> = ({ disclaimer = BRAND.disclaimer.split(/(?<=，)/) }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180 }}>
        <Pattern hue={blue} seed={31} contrast="full" shift={f * 0.6} height={180} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: inn(f, 4, 18) }}>
        <OfficeLockup height={150} variant="color" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", fontFamily: FONT_CN, fontWeight: 600, fontSize: 38, color: INK, lineHeight: 1.7, opacity: inn(f, 14, 18) }}>
        {disclaimer.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

export type Entry = { id: string; el: React.ReactNode; reveal: React.ComponentProps<typeof Reveal>["kind"] };

/**
 * An episode: shots with grid reveals, narration, ducked score, and the stable
 * overlays (brand tab, series/chapter HUD, 南大蓝 caption band).
 */
export const Film: React.FC<{
  tl: TLHelpers;
  shots: Entry[];
  score: string;
  episode: string; // e.g. 第六期
  chapterOf: (id: string) => string;
  dark: (id: string) => boolean;
  noTab?: string[];
  noCaption?: string[];
  tail: number;
}> = ({ tl, shots, score, episode, chapterOf, dark, noTab = [], noCaption = [], tail }) => {
  const total = tl.TL.totalFrames + tail;
  const shotAt = (f: number) => {
    const past = tl.TL.shots.filter((s) => s.from <= f);
    return past[past.length - 1] ?? tl.TL.shots[0];
  };
  const music = (f: number) => {
    let duck = 0;
    for (const [a, b] of tl.SPEECH) duck = Math.max(duck, interpolate(f, [a - 6, a, b, b + 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const fade = interpolate(f, [total - 40, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (0.62 - 0.42 * duck) * fade;
  };
  const Overlays: React.FC = () => {
    const f = useCurrentFrame();
    const s = shotAt(f);
    const isDark = dark(s.id);
    const ink = isDark ? CREAM : blue[0];
    const chapter = chapterOf(s.id);
    const mono: React.CSSProperties = { fontFamily: `${FONT_MONO}, ${FONT_CN}`, fontSize: 22, letterSpacing: 3, color: ink, whiteSpace: "nowrap", padding: isDark ? "6px 12px" : 0, background: isDark ? blue[0] : "transparent" };
    const hideTab = noTab.includes(s.id);
    const cap = tl.CAPTIONS.find((x) => f >= x.from && f < x.to);
    return (
      <>
        <div style={{ position: "absolute", inset: 0, translate: `${hideTab ? -700 : 0}px 0px` }}>
          <BrandTab />
        </div>
        {!hideTab ? (
          <div style={{ position: "absolute", right: 64, top: 44, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={mono}>{BRAND.series} · {episode}</div>
            {chapter ? <div style={{ ...mono, opacity: 0.8 }}>{chapter}</div> : null}
          </div>
        ) : null}
        {!noCaption.includes(s.id) ? <CaptionBand text={cap?.text ?? ""} bg={NCU_BLUE} /> : null}
      </>
    );
  };
  return (
    <AbsoluteFill style={{ background: blue[4] }}>
      {shots.map(({ id, el, reveal }, i) => {
        const s = tl.shot(id);
        const last = i === shots.length - 1;
        return (
          <Sequence key={id} name={id} from={s.from} durationInFrames={s.frames + (last ? tail : OVERLAP)}>
            <Reveal kind={reveal}>{el}</Reveal>
          </Sequence>
        );
      })}
      {tl.TL.shots.map((s) => {
        const v = tl.voiceOf(s.id);
        if (!v || s.voiceFrom == null) return null;
        return (
          <Sequence key={`v-${s.id}`} from={s.from + s.voiceFrom} layout="none">
            <Audio src={staticFile(v.file)} />
          </Sequence>
        );
      })}
      <Audio src={staticFile(score)} volume={music} />
      <Overlays />
    </AbsoluteFill>
  );
};

