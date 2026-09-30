// Timeline helpers for one episode, built from tools/timeline.py (timeline.json)
// and tools/tts.py (voice.json). Every episode folder calls makeTL once.

type Shot = { id: string; section: string; startBeat: number; beats: number; from: number; frames: number; voiceFrom: number | null };
type Timeline = { bpm: number; fps: number; beatSeconds: number; totalBeats: number; totalFrames: number; shots: Shot[] };
export type Voice = {
  file: string;
  duration: number;
  text: string;
  chars: Record<string, number>;
  subs: { text: string; start: number; end: number }[];
};

/** Frames a shot keeps rendering after its cut, so the next shot can reveal over it. */
export const OVERLAP = 16;

export const makeTL = (timeline: Timeline, voice: Record<string, Voice>) => {
  const FPS = timeline.fps;
  const shot = (id: string) => {
    const s = timeline.shots.find((x) => x.id === id);
    if (!s) throw new Error(`no shot ${id}`);
    return s;
  };
  const voiceOf = (id: string): Voice | undefined => voice[id];
  /** Frame, relative to the shot's start, of `n` beats into the shot. */
  const beat = (id: string, n: number) => {
    const s = shot(id);
    return Math.round((s.startBeat + n) * timeline.beatSeconds * FPS) - s.from;
  };
  /** Frame, relative to the shot's start, at which `phrase` is spoken (spoken form). */
  const cue = (id: string, phrase: string, nth = 0) => {
    const s = shot(id);
    const v = voiceOf(id);
    if (!v || s.voiceFrom == null) throw new Error(`shot ${id} has no voice`);
    let idx = -1;
    for (let i = 0; i <= nth; i++) {
      idx = v.text.indexOf(phrase, idx + 1);
      if (idx < 0) throw new Error(`cue "${phrase}" not in ${id}: ${v.text}`);
    }
    for (let i = idx; i < idx + phrase.length + 4; i++) {
      const t = v.chars[String(i)];
      if (t !== undefined) return s.voiceFrom + Math.round(t * FPS);
    }
    throw new Error(`cue "${phrase}" has no timing`);
  };
  /** Captions, each held ≥ speech + 0.6 s and ≥ 1.8 s (STYLE.md §3). */
  const CAPTIONS = (() => {
    const out: { text: string; from: number; to: number }[] = [];
    for (const s of timeline.shots) {
      const v = voiceOf(s.id);
      if (!v || s.voiceFrom == null) continue;
      for (const c of v.subs) out.push({ text: c.text, from: s.from + s.voiceFrom + Math.round(c.start * FPS), to: s.from + s.voiceFrom + Math.round(c.end * FPS) });
    }
    for (let i = 0; i < out.length; i++) {
      const next = out[i + 1]?.from ?? Infinity;
      out[i].to = Math.min(next, Math.max(out[i].to + Math.round(0.6 * FPS), out[i].from + Math.round(1.8 * FPS)));
    }
    return out;
  })();
  const SPEECH = timeline.shots
    .filter((s) => voiceOf(s.id) && s.voiceFrom != null)
    .map((s) => [s.from + (s.voiceFrom as number), s.from + (s.voiceFrom as number) + Math.round(voiceOf(s.id)!.duration * FPS)] as const);
  return { TL: timeline, FPS, shot, voiceOf, beat, cue, CAPTIONS, SPEECH };
};

export type TLHelpers = ReturnType<typeof makeTL>;
