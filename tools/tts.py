"""Generate per-scene voiceover with edge-tts and a timing manifest for Remotion.

Usage: .venv/bin/python tools/tts.py <episode> [s01 s02 ...]

Reads  video/src/episodes/<episode>/narration.json
Writes video/public/voice/<video>/<scene>.mp3
       video/src/episodes/<episode>/voice.json   (duration, word timings, subtitle cues per scene)

A scene may set "tts" to feed the engine different text (e.g. to fix a
pronunciation) while "text" stays what is shown in subtitles.
"""

import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent / "video"
PUNCT = set("，。！？；：、“”‘’（）《》…—,.!?;:\"'() \n")
# Subtitle chunks break after these; long chunks are split again at commas.
BREAK = "。！？；"
MAX_SUB = 20


def duration_of(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)]
    )
    return float(out.strip())


async def synth(text: str, voice: str, rate: str, out: Path):
    comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words = []
    with out.open("wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "start": chunk["offset"] / 1e7,
                    "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                })
    return words


SR = 24000  # edge-tts mp3 sample rate
SERIOUS = re.compile(r"注意|一定|必须|不能|不可以|不允许|视为|终止|逾期|无法|放弃")


def pct(n: int) -> str:
    return f"{n:+d}%"


def hz(n: int) -> str:
    return f"{n:+d}Hz"


def prosody_for(sentence: str, i: int, base: int):
    """Vary delivery per sentence so the read doesn't sound uniform.
    Returns (rate %, pitch Hz, pause-after seconds)."""
    s = sentence.strip()
    if s.endswith("？"):
        return base + 6, 12, 0.28
    if s.endswith("！"):
        return base + 8, 10, 0.26
    if SERIOUS.search(s):
        return base - 8, -3, 0.42
    if re.match(r"^(第[一二三四五六七八九十]+步|最后|首先|另外|其次)", s):
        return base + 2, 6, 0.34
    # gentle alternation for ordinary sentences
    return (base + 4, 3, 0.3) if i % 2 == 0 else (base, -1, 0.32)


def split_sentences(text: str):
    return [s for s in re.split(r"(?<=[。！？])", text) if s.strip()]


def decode_pcm(mp3: bytes) -> bytes:
    return subprocess.run(
        ["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", str(SR), "pipe:1"],
        input=mp3, capture_output=True, check=True,
    ).stdout


async def synth_segment(text: str, voice: str, rate: str, pitch: str):
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    audio, words = bytearray(), []
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] == "WordBoundary":
            words.append({
                "text": chunk["text"],
                "start": chunk["offset"] / 1e7,
                "end": (chunk["offset"] + chunk["duration"]) / 1e7,
            })
    return bytes(audio), words


async def synth_expressive(text: str, voice: str, base_rate: int, out: Path, style=None):
    """Synthesize sentence by sentence with varied rate/pitch, trim each
    segment to its speech and join with deliberate pauses."""
    pcm = bytearray()
    words_all = []
    sentences = split_sentences(text)
    for i, s in enumerate(sentences):
        rate, pitch, pause = prosody_for(s, i, base_rate)
        if style and str(i) in style:  # manual override: {"2": [rate, pitch, pause]}
            rate, pitch, pause = style[str(i)]
        audio, words = await synth_segment(s, voice, pct(rate), hz(pitch))
        raw = decode_pcm(audio)
        if words:
            a = max(0.0, words[0]["start"] - 0.04)
            b = words[-1]["end"] + 0.12
        else:
            a, b = 0.0, len(raw) / 2 / SR
        seg = raw[int(a * SR) * 2: int(b * SR) * 2]
        offset = len(pcm) / 2 / SR
        for w in words:
            words_all.append({**w, "start": offset + w["start"] - a, "end": offset + w["end"] - a})
        pcm += seg
        if i < len(sentences) - 1:
            pcm += b"\x00\x00" * int(pause * SR)
    pcm += b"\x00\x00" * int(0.25 * SR)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-i", "pipe:0",
         "-b:a", "128k", str(out)],
        input=bytes(pcm), check=True,
    )
    return words_all


def char_times(text: str, words):
    """Map each non-punctuation char index in `text` to a start time."""
    times = {}
    wi, wpos = 0, 0
    for i, ch in enumerate(text):
        if ch in PUNCT:
            continue
        # advance to the word that contains this char
        while wi < len(words):
            wtext = [c for c in words[wi]["text"] if c not in PUNCT]
            if wpos < len(wtext) and wtext[wpos] == ch:
                w = words[wi]
                n = max(len(wtext), 1)
                times[i] = w["start"] + (w["end"] - w["start"]) * wpos / n
                wpos += 1
                if wpos >= len(wtext):
                    wi, wpos = wi + 1, 0
                break
            # mismatch (engine normalised the text): skip this word
            wi, wpos = wi + 1, 0
    return times


def split_subs(text: str):
    """Split into clauses at ，：。！？； then greedily merge clauses of one
    sentence while they fit in MAX_SUB characters."""
    clauses = [c for c in re.split(r"(?<=[，：。！？；])", text) if c.strip()]
    out, buf = [], ""
    for c in clauses:
        if buf and (buf[-1] in BREAK or len(buf) + len(c) > MAX_SUB):
            out.append(buf)
            buf = ""
        buf += c
    if buf:
        out.append(buf)
    return out


def build_subs(text: str, times: dict, total: float):
    chunks = split_subs(text)
    cues, idx = [], 0
    for c in chunks:
        ks = [i for i in range(idx, idx + len(c)) if i in times]
        start = times[ks[0]] if ks else None
        cues.append({"text": c.strip("，。；、 ").strip(), "start": start})
        idx += len(c)
    # fill gaps / ends
    for i, cue in enumerate(cues):
        if cue["start"] is None:
            cue["start"] = cues[i - 1]["end"] if i else 0.0
        cue["end"] = None
    for i, cue in enumerate(cues):
        cue["end"] = cues[i + 1]["start"] if i + 1 < len(cues) else total
    return [c for c in cues if c["text"]]


def remap(t: str, m: dict) -> str:
    for k in sorted(m, key=len, reverse=True):
        t = t.replace(k, m[k])
    return t


async def main():
    video = sys.argv[1]
    only = set(sys.argv[2:])
    src = ROOT / "src" / "episodes" / video / "narration.json"
    manifest_path = ROOT / "src" / "episodes" / video / "voice.json"
    cfg = json.loads(src.read_text("utf-8"))
    manifest = json.loads(manifest_path.read_text("utf-8")) if manifest_path.exists() else {}
    outdir = ROOT / "public" / "voice" / video
    outdir.mkdir(parents=True, exist_ok=True)

    for sc in cfg["scenes"]:
        if only and sc["id"] not in only:
            continue
        # "text" is what is spoken (numbers in Chinese words, so the engine reads them right);
        # "subs_map" rewrites subtitles back to digits, e.g. {"六十分": "60分"}.
        text = sc["text"]
        out = outdir / f"{sc['id']}.mp3"
        rate = sc.get("rate", cfg["rate"])
        if cfg.get("expressive", True):
            words = await synth_expressive(sc.get("tts", text), cfg["voice"], int(rate.rstrip("%")), out, sc.get("style"))
        else:
            words = await synth(sc.get("tts", text), cfg["voice"], rate, out)
        total = duration_of(out)
        times = char_times(text, words)
        coverage = len(times) / max(1, sum(1 for c in text if c not in PUNCT))
        manifest[sc["id"]] = {
            "file": f"voice/{video}/{sc['id']}.mp3",
            "duration": round(total, 3),
            "text": text,
            "words": [{**w, "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in words],
            "chars": {str(k): round(v, 3) for k, v in times.items()},
            "subs": [{**c, "text": remap(c["text"], sc.get("subs_map", {})), "start": round(c["start"], 3), "end": round(c["end"], 3)}
                     for c in build_subs(text, times, total)],
        }
        print(f"{sc['id']}: {total:.2f}s, {len(words)} words, char alignment {coverage:.0%}")

    ordered = {s["id"]: manifest[s["id"]] for s in cfg["scenes"] if s["id"] in manifest}
    manifest_path.write_text(json.dumps(ordered, ensure_ascii=False, indent=1), "utf-8")


if __name__ == "__main__":
    asyncio.run(main())
