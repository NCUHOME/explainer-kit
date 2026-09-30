"""Export burned-in captions as .srt (same hold rules as src/lib/tl.ts).
Usage: .venv/bin/python tools/srt.py <episode> out/file.srt"""
import json, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent / "video" / "src" / "episodes" / sys.argv[1]
tl = json.loads((R / "timeline.json").read_text("utf-8")); v = json.loads((R / "voice.json").read_text("utf-8"))
fps = tl["fps"]; cues = []
for s in tl["shots"]:
    if s["id"] in v and s["voiceFrom"] is not None:
        base = s["from"] + s["voiceFrom"]
        for c in v[s["id"]]["subs"]:
            cues.append([c["text"], base + round(c["start"] * fps), base + round(c["end"] * fps)])
for i, c in enumerate(cues):
    nxt = cues[i + 1][1] if i + 1 < len(cues) else 10**9
    c[2] = min(nxt, max(c[2] + round(0.6 * fps), c[1] + round(1.8 * fps)))
ts = lambda f: "%02d:%02d:%02d,%03d" % (f // fps // 3600, f // fps // 60 % 60, f // fps % 60, round((f % fps) / fps * 1000))
Path(sys.argv[2]).write_text("\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{t}\n" for i, (t, a, b) in enumerate(cues)), "utf-8")
print(len(cues), "captions")
