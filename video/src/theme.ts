import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Visual language follows the 教务处「教务答疑直通车」series: 南大蓝 panels,
// monochrome blue with one azure accent, bright sky backgrounds. 南大蓝 is sampled from the emblem.
export const C = {
  blue: "#12368F",
  navy: "#0A1F5C",
  blueMid: "#2A56C6",
  sky: "#5B9BEF",
  skyTop: "#DCEBFF",
  skyBottom: "#F7FAFF",
  blueTint: "#EAF1FD",
  ink: "#0E1B3D",
  gray: "#5B6680",
  line: "#D8E1F0",
  white: "#FFFFFF",
  accent: "#2F7BFF",
  green: "#16A864",
  // 跑道风 palette
  track: "#D4483B",
  trackDeep: "#B23A2F",
  paper: "#FBFAF7",
  red: "#D64545",
};

export const BLUE_GRADIENT = `linear-gradient(135deg, ${C.blueMid} 0%, ${C.blue} 55%, ${C.navy} 100%)`;

export const FONT_BODY = "Noto Sans SC";
export const FONT_SERIF = "Noto Serif SC";
export const FONT_NUM = "Oswald";

export const fontsReady = Promise.all([
  loadFont({
    family: FONT_BODY,
    url: staticFile("fonts/NotoSansSC-VF.woff2"),
    weight: "100 900",
  }),
  loadFont({
    family: FONT_SERIF,
    url: staticFile("fonts/NotoSerifSC-VF.woff2"),
    weight: "200 900",
  }),
  loadFont({ family: "Inter Tight", url: staticFile("fonts/InterTight-VF.woff2"), weight: "100 900" }),
  loadFont({ family: "DM Mono", url: staticFile("fonts/DMMono-Medium.woff2"), weight: "500" }),
  loadFont({
    family: FONT_NUM,
    url: staticFile("fonts/Oswald-VF.woff2"),
    weight: "200 700",
  }),
]);

// Voice starts this long after a scene begins; scenes end this long after the voice.
export const LEAD = 0.35;
export const TAIL = 0.8;
export const TRANSITION_FRAMES = 16;

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
