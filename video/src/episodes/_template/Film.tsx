import React from "react";
import { Entry, Film } from "../../picto/Episode";
import { X01, X02, X03, X04, X05, X06 } from "./shots";
import { T } from "./tl";

// {{TITLE}}
const SHOTS: Entry[] = [
  { id: "x01", el: <X01 />, reveal: { type: "none" } },
  { id: "x02", el: <X02 />, reveal: { type: "columns" } },
  { id: "x03", el: <X03 />, reveal: { type: "rows" } },
  { id: "x04", el: <X04 />, reveal: { type: "columns" } },
  { id: "x05", el: <X05 />, reveal: { type: "rows" } },
  { id: "x06", el: <X06 />, reveal: { type: "iris", x: 960, y: 480 } },
];

// Top-right chapter line per shot ("" = none); which shots have dark backgrounds.
const PART: Record<string, string> = { x03: "PART 1 / 1 · 第一部分", x04: "PART 1 / 1 · 第一部分" };
const DARK = ["x01", "x02", "x03"];

const TAIL = 45;
export const EPISODE_FRAMES = T.TL.totalFrames + TAIL;

export const EpisodeFilm: React.FC = () => (
  <Film
    tl={T}
    shots={SHOTS}
    score="music/{{ID}}_score.mp3"
    episode="{{EPISODE}}"
    chapterOf={(id) => PART[id] ?? ""}
    dark={(id) => DARK.includes(id)}
    noTab={["x02", "x06"]}
    noCaption={["x06"]}
    tail={TAIL}
  />
);
