"""Original score + foley samples, synthesized from the timeline.

Usage: .venv/bin/python tools/score.py <episode>

Reads  video/src/episodes/<episode>/timeline.json
Writes video/public/music/<episode>_score.mp3   (music only; the mix happens in Remotion)
       video/public/sfx/gen/*.wav             (procedural foley, shared)

Sections (from shots.json "section"): tense-intro, tense, calm, cover, chapter, qa, steps,
steps-light, finale, breath, end, intro.
Everything is generated here — no third-party audio.
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
ROOT = Path(__file__).resolve().parent.parent / "video"
rng = np.random.default_rng(7)


# ── helpers ───────────────────────────────────────────────────
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)


def hp(x, f):
    return sosfilt(butter(2, f, btype="high", fs=SR, output="sos"), x)


def lp(x, f):
    return sosfilt(butter(2, f, btype="low", fs=SR, output="sos"), x)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ── instruments ───────────────────────────────────────────────
def kick(v=1.0):
    t = t_axis(0.4)
    f = 48 + 110 * np.exp(-t * 38)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 9.5) * 0.7
    x[:120] += np.linspace(0.6, 0, 120) * rng.standard_normal(120) * 0.4
    return x * v


def snare(v=1.0):
    t = t_axis(0.25)
    n = bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 24)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 32) * 0.5
    return (n * 0.9 + tone) * v


def clap(v=1.0):
    t = t_axis(0.3)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += (t >= d) * np.exp(-(t - d).clip(0) * 180)
    env += (t >= 0.03) * np.exp(-(t - 0.03).clip(0) * 18) * 0.5
    return bp(rng.standard_normal(len(t)), 900, 3200) * env * v * 1.4


def hat(v=1.0, open_=False):
    t = t_axis(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (14 if open_ else 70)) * v * 0.5


def shaker(v=1.0):
    t = t_axis(0.09)
    env = np.minimum(t / 0.012, 1) * np.exp(-t * 40)
    return hp(rng.standard_normal(len(t)), 5000) * env * v * 0.35


def tom(n=45, v=1.0):
    t = t_axis(0.45)
    f = midi(n) * (1 + 0.5 * np.exp(-t * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * v


def crash(v=1.0):
    t = t_axis(1.6)
    return hp(rng.standard_normal(len(t)), 4500) * np.exp(-t * 2.6) * v * 0.35


def marimba(n, v=1.0, dur=1.2):
    t = t_axis(dur)
    f = midi(n)
    x = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1.0, 5.5), (3.99, 0.32, 16), (10.6, 0.07, 40)):
        if f * ratio < SR / 2:
            x += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * dec)
    x *= np.minimum(t / 0.002, 1)
    return x * v * 1.1


def pluck(n, v=1.0, dur=0.9):
    """Karplus–Strong plucked string."""
    f = midi(n)
    N = int(SR / f)
    buf = rng.uniform(-1, 1, N)
    buf = lp(buf, 5000)
    out = np.empty(int(dur * SR))
    for i in range(len(out)):
        s = buf[i % N]
        out[i] = s
        buf[i % N] = 0.5 * (s + buf[(i + 1) % N]) * 0.996
    return out * v * 0.9


def bass(n, v=1.0, dur=0.5):
    t = t_axis(dur)
    f = midi(n)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.18 * np.sin(6 * np.pi * f * t)
    env = np.minimum(t / 0.006, 1) * np.exp(-t * 3.2) * np.clip((dur - t) / 0.03, 0, 1)
    return lp(x * env, 900) * v * 0.28


def pad(notes, dur, v=1.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in notes:
        for det in (-0.12, 0, 0.12):
            x += np.sin(2 * np.pi * midi(n + det) * t)
    env = np.minimum(t / 0.6, 1) * np.clip((dur - t) / 0.8, 0, 1)
    return lp(x * env / (len(notes) * 3), 2500) * v * 0.5


# ── foley (shared sample files) ───────────────────────────────
def gen_sfx():
    d = ROOT / "public" / "sfx" / "gen"
    d.mkdir(parents=True, exist_ok=True)
    t = t_axis(0.75)
    trill = 1 + 0.03 * np.sign(np.sin(2 * np.pi * 26 * t))
    whistle = np.sin(2 * np.pi * np.cumsum(2950 * trill) / SR) * np.minimum(t / 0.02, 1) * np.clip((0.75 - t) / 0.08, 0, 1)
    whistle += bp(rng.standard_normal(len(t)), 2500, 3500) * 0.15
    sounds = {
        "whistle": whistle * 0.5,
        "stamp": np.concatenate([kick(0.8)[: int(0.18 * SR)] * 0.9 + bp(rng.standard_normal(int(0.18 * SR)), 300, 2500) * np.exp(-t_axis(0.18) * 30) * 0.5]),
        "pop": np.sin(2 * np.pi * np.cumsum(500 + 900 * t_axis(0.09) / 0.09) / SR) * np.exp(-t_axis(0.09) * 30) * 0.6,
        "tick": hp(rng.standard_normal(int(0.02 * SR)), 3000) * np.exp(-t_axis(0.02) * 300) * 0.8,
        "click": bp(rng.standard_normal(int(0.03 * SR)), 1500, 6000) * np.exp(-t_axis(0.03) * 200) * 0.7,
        "ding": sum(a * np.sin(2 * np.pi * f * t_axis(1.4)) * np.exp(-t_axis(1.4) * dcy) for f, a, dcy in ((1568, 0.5, 3), (3136, 0.2, 5), (4700, 0.08, 8))),
        "swish": bp(rng.standard_normal(int(0.35 * SR)), 600, 4000) * np.sin(np.pi * t_axis(0.35) / 0.35) ** 2 * 0.5,
        "thud": tom(40, 0.9)[: int(0.3 * SR)],
        "shutter": np.concatenate([bp(rng.standard_normal(int(0.025 * SR)), 1200, 8000) * np.exp(-t_axis(0.025) * 160), np.zeros(int(0.05 * SR)), bp(rng.standard_normal(int(0.04 * SR)), 800, 6000) * np.exp(-t_axis(0.04) * 90) * 0.8]),
        "type": np.concatenate([hp(rng.standard_normal(int(0.012 * SR)), 2500) * 0.5, np.zeros(int(0.05 * SR))]),
    }
    for name, x in sounds.items():
        x = np.asarray(x, dtype=float)
        x = x / (np.abs(x).max() + 1e-9) * 0.8
        sf.write(d / f"{name}.wav", x, SR)
    print("sfx:", ", ".join(sounds))


# ── score ─────────────────────────────────────────────────────
# D major: I – vi – IV – V   (D, Bm, G, A), one chord per bar
CHORDS = [(50, [62, 66, 69]), (47, [59, 62, 66]), (43, [55, 59, 62]), (45, [57, 61, 64])]
ARP = [0, 1, 2, 1, 0, 2, 1, 2]  # chord-tone index per 8th note


def render(tl):
    bs = tl["beatSeconds"]
    total = tl["totalBeats"]
    L = np.zeros((int((total * bs + 3) * SR), 2))

    def put(x, beat, v=1.0, pan=0.0):
        i = int(beat * bs * SR)
        x = np.asarray(x) * v
        j = min(len(L), i + len(x))
        if j <= i:
            return
        L[i:j, 0] += x[: j - i] * (1 - max(0, pan))
        L[i:j, 1] += x[: j - i] * (1 + min(0, pan))

    sec_at = {}
    for s in tl["shots"]:
        for b in range(s["startBeat"], s["startBeat"] + s["beats"]):
            sec_at[b] = s["section"]
    shot_starts = {s["startBeat"]: s for s in tl["shots"]}

    for b in range(total):
        sec = sec_at[b]
        bar, pos = divmod(b, 4)
        root, chord = CHORDS[bar % 4]
        last = b == total - 1

        if sec in ("tense-intro", "tense"):
            # clock-like ticks and a low drone; the intro ends in a snare pickup
            put(hat(0.5), b, pan=0.2)
            if pos == 0:
                put(pad([38, 45, 50] if sec == "tense-intro" else [35, 42, 47], bs * 4, 0.9), b)
            end = max(x["startBeat"] + x["beats"] for x in tl["shots"] if x["section"] == sec and x["startBeat"] <= b)
            if sec == "tense-intro" and b >= end - 2:
                for k in range(4):
                    put(snare(0.2 + 0.6 * ((b - (end - 2)) * 4 + k) / 8), b + k / 4, pan=0.1)
            continue
        if sec == "end":
            if b in shot_starts:
                put(np.sum([marimba(n, 0.7, 3.0) for n in (62, 66, 69, 74)], axis=0), b)
                put(pad([50, 57, 62, 66], bs * 10, 0.9), b)
                put(bass(38, 0.8, bs * 6), b)
            continue
        if sec == "calm":
            if pos == 0:
                put(pad(chord, bs * 4, 0.7), b)
                put(bass(root, 0.6, bs * 3.5), b)
            if pos in (0, 2):
                put(marimba(chord[(bar + pos) % 3] + 12, 0.45), b, pan=-0.2)
            put(shaker(0.35), b + 0.5, pan=0.3)
            continue
        if sec == "qa":
            if b in shot_starts:
                put(marimba(chord[2] + 24, 0.5, 0.6), b, pan=0.3)
                put(crash(0.25), b, pan=0.2)
            put(kick(0.7), b) if pos == 0 else None
            put(clap(0.45), b, pan=-0.15) if pos == 3 else None
            for k in (0, 0.5):
                put(shaker(0.5), b + k, pan=0.25)
            put(bass(root, 0.7, bs * 1.8), b) if pos in (0, 2) else None
            for k in range(2):
                idx = ARP[(pos * 2 + k) % 8]
                put(marimba(chord[idx], 0.42 if k == 0 else 0.3), b + k * 0.5, pan=-0.3 + 0.2 * idx)
            continue
        if sec == "finale":
            sec = "cover"  # full band, same arrangement as the cover

        if sec == "intro":
            # rising snare roll into the cover
            for k in range(4):
                put(snare(0.25 + 0.7 * (b + k / 4) / 8), b + k / 4, pan=0.1)
            if b == 0:
                put(kick(1.0), b)
            continue

        # accents on shot starts
        if b in shot_starts and sec != "breath":
            put(crash(0.6 if sec in ("cover", "chapter") else 0.35), b, pan=0.2)
            put(np.sum([marimba(n + 12, 0.5, 1.6) for n in chord], axis=0), b)

        if sec in ("cover", "steps", "chapter"):
            put(kick(0.9), b) if pos in (0, 2) else None
            put(clap(0.55), b, pan=-0.15) if pos in (1, 3) else None
            for k in (0, 0.5):
                put(hat(0.45 if k else 0.3), b + k, pan=0.3)
            put(bass(root, 0.9, bs * 0.9), b)
            put(bass(root + (7 if pos == 3 else 0), 0.6, bs * 0.45), b + 0.5)
        if sec == "chapter":
            put(tom(45 - pos * 2, 0.7), b, pan=-0.2)
        if sec == "steps-light":
            for k in (0, 0.5):
                put(shaker(0.6), b + k, pan=0.25)
            put(bass(root, 0.6, bs * 0.9), b) if pos in (0, 2) else None
            if pos == 0:
                put(pad([n for n in chord], bs * 4, 0.6), b)

        # marimba arpeggio in 8ths (all sections but breath)
        if sec in ("cover", "steps", "steps-light", "chapter"):
            for k in range(2):
                idx = ARP[(pos * 2 + k) % 8]
                put(marimba(chord[idx] + (12 if sec == "cover" else 0), 0.55 if k == 0 else 0.4), b + k * 0.5, pan=-0.3 + 0.2 * idx)
        # plucked melody on the cover: a short call on every other bar
        if sec == "cover" and bar % 2 == 0 and pos in (0, 1, 2):
            n = chord[[2, 1, 0][pos]] + 12
            put(pluck(n, 0.8), b + 0.5, pan=0.25)

        if sec == "breath":
            if pos == 0 and b == shot_starts.get(b, {}).get("startBeat", -1):
                put(pad([62, 66, 69, 74], bs * 8, 0.9), b)
                put(bass(38, 0.8, bs * 6), b)
            put(marimba(chord[pos % 3] + 12, 0.35), b, pan=0.2)
        if last:
            put(np.sum([marimba(n, 0.6, 2.5) for n in (62, 66, 69, 74)], axis=0), b + 1)

    L = L / (np.abs(L).max() + 1e-9) * 0.7
    return L


def main():
    video = sys.argv[1]
    tl = json.loads((ROOT / "src" / "episodes" / video / "timeline.json").read_text("utf-8"))
    gen_sfx()
    out = ROOT / "public" / "music" / f"{video}_score.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".wav")
    sf.write(tmp, render(tl), SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-b:a", "192k", str(out)], check=True)
    tmp.unlink()
    print("score:", out, f"{tl['totalBeats']} beats @ {tl['bpm']} bpm")


if __name__ == "__main__":
    main()
