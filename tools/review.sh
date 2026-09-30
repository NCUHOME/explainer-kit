#!/bin/zsh
# Draft render (half size) + contact sheets for visual review.
# Usage: tools/review.sh <episode>      → out/review/<episode>/sheet_*.jpg
set -e
setopt null_glob
cd "$(dirname "$0")/.."
ep="$1"; D="out/review/$ep"; mkdir -p "$D"; rm -f "$D"/f_*.jpg "$D"/sheet_*.jpg
(cd video && npx remotion render "EP-$ep" "../$D/draft.mp4" --scale=0.5 --crf=23 --log=error)
frames=$(python3 -c "
import json; t=json.load(open('video/src/episodes/$ep/timeline.json'))
print(' '.join(str(int(s['from']+s['frames']*k)) for s in t['shots'] for k in (0.45,0.92)))")
i=0; for fr in ${=frames}; do i=$((i+1)); ffmpeg -v error -y -ss $(python3 -c "print($fr/30)") -i "$D/draft.mp4" -frames:v 1 -vf scale=640:-1 "$D/f_$(printf %03d $i).jpg"; done
ffmpeg -v error -y -i "$D/f_%03d.jpg" -vf tile=3x4 "$D/sheet_%d.jpg"
ls "$D"/sheet_*.jpg
