import { makeTL, Voice } from "../../lib/tl";
import timeline from "./timeline.json";
import voice from "./voice.json";

export const T = makeTL(timeline, voice as Record<string, Voice>);
export const { TL, beat, cue } = T;
