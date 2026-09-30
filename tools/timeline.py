"""Build the beat-locked timeline for a video from its voice manifest.

Usage: .venv/bin/python tools/timeline.py <episode>

Reads  video/src/episodes/<episode>/voice.json and shots.json
Writes video/src/episodes/<episode>/timeline.json — the single source of truth read by
Remotion (picture) and tools/score.py (music, SFX).

shots.json: [{"id": "s01", "min": 4.0, "hold": 0.0, "section": "intro"}, ...]
  min     minimum shot length in seconds
  hold    extra seconds after the voice (reading time, a breath)
  section music state name (see tools/score.py)
Each shot's voice starts one beat after the shot starts, so speech lands on the grid.
"""

import json
import math
import sys
from pathlib import Path

BPM = 112
FPS = 30
BEAT = 60 / BPM
LEAD_BEATS = 1
TAIL = 0.55

ROOT = Path(__file__).resolve().parent.parent / "video" / "src" / "episodes"


def frame_of(beat: float) -> int:
    return round(beat * BEAT * FPS)


def main():
    video = sys.argv[1]
    voice = json.loads((ROOT / video / "voice.json").read_text("utf-8"))
    shots = json.loads((ROOT / video / "shots.json").read_text("utf-8"))
    out, beat = [], 0
    for s in shots:
        v = voice.get(s["id"])
        need = (LEAD_BEATS * BEAT + v["duration"] + TAIL + s.get("hold", 0)) if v else 0
        secs = max(need, s.get("min", 0))
        beats = math.ceil(secs / BEAT)
        beats += beats % 2  # keep shots on half-bar boundaries
        start, end = frame_of(beat), frame_of(beat + beats)
        out.append({
            "id": s["id"],
            "section": s.get("section", ""),
            "startBeat": beat,
            "beats": beats,
            "from": start,
            "frames": end - start,
            "voiceFrom": frame_of(beat + LEAD_BEATS) - start if v else None,
        })
        beat += beats
    tl = {"bpm": BPM, "fps": FPS, "beatSeconds": BEAT, "totalBeats": beat,
          "totalFrames": frame_of(beat), "shots": out}
    (ROOT / video / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), "utf-8")
    for s in out:
        print(f"{s['id']}  beat {s['startBeat']:>3}  {s['beats']:>3} beats  {s['frames'] / FPS:5.1f}s  [{s['section']}]")
    print(f"total {beat} beats = {tl['totalFrames'] / FPS:.1f}s")


if __name__ == "__main__":
    main()
