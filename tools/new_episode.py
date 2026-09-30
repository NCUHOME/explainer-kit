"""Scaffold a new episode from the template and register it.

Usage: .venv/bin/python tools/new_episode.py <id> --episode 第八期 --tag 补测篇 \
         --subtitle "南昌大学《学生体质健康标准》Q&A" --title "教务答疑直通车｜第八期：…"
<id>: short latin name, e.g. "bk". Composition id becomes EP-<id>.
"""
import argparse
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "video" / "src" / "episodes"

ap = argparse.ArgumentParser()
ap.add_argument("id")
ap.add_argument("--episode", required=True)
ap.add_argument("--tag", required=True)
ap.add_argument("--subtitle", default="")
ap.add_argument("--title", default="")
a = ap.parse_args()
if not re.fullmatch(r"[a-z][a-z0-9]*", a.id):
    raise SystemExit("id must be lowercase latin letters/digits, e.g. bk")
dst = ROOT / a.id
if dst.exists():
    raise SystemExit(f"{dst} already exists")
shutil.copytree(ROOT / "_template", dst)
subs = {"{{ID}}": a.id, "{{EPISODE}}": a.episode, "{{TAG}}": a.tag, "{{TAG_SHORT}}": a.tag.removesuffix("篇"), "{{SUBTITLE}}": a.subtitle, "{{TITLE}}": a.title}
for f in dst.iterdir():
    if f.suffix in (".tsx", ".ts"):
        s = f.read_text("utf-8")
        for k, v in subs.items():
            s = s.replace(k, v)
        f.write_text(s, "utf-8")
# point the template's voice manifest at this episode's audio folder
vj = dst / "voice.json"
v = json.loads(vj.read_text("utf-8"))
for sc in v.values():
    sc["file"] = sc["file"].replace("voice/_template/", f"voice/{a.id}/")
vj.write_text(json.dumps(v, ensure_ascii=False, indent=1), "utf-8")
# register
idx = ROOT / "index.ts"
s = idx.read_text("utf-8")
s = s.replace("// <new-imports>", f'import * as {a.id} from "./{a.id}/Film";\n// <new-imports>')
s = s.replace("  // <new-entries>", f'  {{ id: "{a.id}", Comp: {a.id}.EpisodeFilm, frames: {a.id}.EPISODE_FRAMES }},\n  // <new-entries>')
idx.write_text(s, "utf-8")
print(f"created {dst} → composition EP-{a.id}")
print(f"next: edit narration.json / shots.json / shots.tsx, then tools/audio.sh {a.id}")
