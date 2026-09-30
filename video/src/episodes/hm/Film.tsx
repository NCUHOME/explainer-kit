import React from "react";
import { Entry, Film } from "../../picto/Episode";
import { C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13 } from "./shots";
import { T } from "./tl";

// 教务答疑直通车｜第七期：南昌大学《学生体质健康标准》Q&A（缓免测篇）
const SHOTS: Entry[] = [
  { id: "c01", el: <C01 />, reveal: { type: "none" } },
  { id: "c02", el: <C02 />, reveal: { type: "columns" } },
  { id: "c03", el: <C03 />, reveal: { type: "rows" } },
  { id: "c04", el: <C04 />, reveal: { type: "columns" } },
  { id: "c05", el: <C05 />, reveal: { type: "columns" } },
  { id: "c06", el: <C06 />, reveal: { type: "rows" } },
  { id: "c07", el: <C07 />, reveal: { type: "columns" } },
  { id: "c08", el: <C08 />, reveal: { type: "columns" } },
  { id: "c09", el: <C09 />, reveal: { type: "rows" } },
  { id: "c10", el: <C10 />, reveal: { type: "columns" } },
  { id: "c11", el: <C11 />, reveal: { type: "columns" } },
  { id: "c12", el: <C12 />, reveal: { type: "rows" } },
  { id: "c13", el: <C13 />, reveal: { type: "iris", x: 960, y: 480 } },
];

const PART: Record<string, string> = {
  c03: "PART 1 / 3 · 怎么申请", c04: "PART 1 / 3 · 怎么申请", c05: "PART 1 / 3 · 怎么申请",
  c06: "PART 2 / 3 · 证明材料", c07: "PART 2 / 3 · 证明材料", c08: "PART 2 / 3 · 证明材料",
  c09: "PART 3 / 3 · 免测之后", c10: "PART 3 / 3 · 免测之后", c11: "PART 3 / 3 · 免测之后",
};
const DARK = ["c02", "c03", "c06", "c09"];

const TAIL = 45;
export const EPISODE_FRAMES = T.TL.totalFrames + TAIL;

export const EpisodeFilm: React.FC = () => (
  <Film
    tl={T}
    shots={SHOTS}
    score="music/hm_score.mp3"
    episode="第七期"
    chapterOf={(id) => PART[id] ?? ""}
    dark={(id) => DARK.includes(id)}
    noTab={["c02", "c13"]}
    noCaption={["c13"]}
    tail={TAIL}
  />
);
