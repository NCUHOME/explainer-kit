import React from "react";
import { Entry, Film } from "../../picto/Episode";
import { B01, B02, B03, B04, B05, B06, B07, B08, B09, B10, B11, B12, B13, B14, B15, B16, B17 } from "./shots";
import { T } from "./tl";

// 教务答疑直通车｜第六期：南昌大学《学生体质健康标准》Q&A（补测篇）
const SHOTS: Entry[] = [
  { id: "b01", el: <B01 />, reveal: { type: "none" } },
  { id: "b02", el: <B02 />, reveal: { type: "columns" } },
  { id: "b03", el: <B03 />, reveal: { type: "rows" } },
  { id: "b04", el: <B04 />, reveal: { type: "columns" } },
  { id: "b05", el: <B05 />, reveal: { type: "columns" } },
  { id: "b06", el: <B06 />, reveal: { type: "rows" } },
  { id: "b07", el: <B07 />, reveal: { type: "columns" } },
  { id: "b08", el: <B08 />, reveal: { type: "columns" } },
  { id: "b09", el: <B09 />, reveal: { type: "rows" } },
  { id: "b10", el: <B10 />, reveal: { type: "columns" } },
  { id: "b11", el: <B11 />, reveal: { type: "columns" } },
  { id: "b12", el: <B12 />, reveal: { type: "columns" } },
  { id: "b13", el: <B13 />, reveal: { type: "rows" } },
  { id: "b14", el: <B14 />, reveal: { type: "columns" } },
  { id: "b15", el: <B15 />, reveal: { type: "columns" } },
  { id: "b16", el: <B16 />, reveal: { type: "rows" } },
  { id: "b17", el: <B17 />, reveal: { type: "iris", x: 960, y: 480 } },
];

const PART: Record<string, string> = {
  b03: "PART 1 / 4 · 谁要补测", b04: "PART 1 / 4 · 谁要补测", b05: "PART 1 / 4 · 谁要补测",
  b06: "PART 2 / 4 · 什么时候补", b07: "PART 2 / 4 · 什么时候补", b08: "PART 2 / 4 · 什么时候补",
  b09: "PART 3 / 4 · 怎么补", b10: "PART 3 / 4 · 怎么补", b11: "PART 3 / 4 · 怎么补", b12: "PART 3 / 4 · 怎么补",
  b13: "PART 4 / 4 · 补完之后", b14: "PART 4 / 4 · 补完之后", b15: "PART 4 / 4 · 补完之后",
};
const DARK = ["b01", "b02", "b03", "b06", "b09", "b13", "b14"];

const TAIL = 45;
export const EPISODE_FRAMES = T.TL.totalFrames + TAIL;

export const EpisodeFilm: React.FC = () => (
  <Film
    tl={T}
    shots={SHOTS}
    score="music/bu_score.mp3"
    episode="第六期"
    chapterOf={(id) => PART[id] ?? ""}
    dark={(id) => DARK.includes(id)}
    noTab={["b02", "b17"]}
    noCaption={["b17"]}
    tail={TAIL}
  />
);
