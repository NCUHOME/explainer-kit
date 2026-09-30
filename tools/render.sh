#!/bin/zsh
# Final render: 1080p mp4 → two-pass −14 LUFS → .srt → compressed copy for WeChat.
# Usage: tools/render.sh <episode> "<file title>"
set -e
cd "$(dirname "$0")/.."
ep="$1"; name="$2"; mkdir -p out
(cd video && npx remotion render "EP-$ep" "../out/$name.mp4" --log=error)
tools/finalize.sh "out/$name.mp4"
.venv/bin/python tools/srt.py "$ep" "out/$name.srt"
ffmpeg -v error -y -i "out/$name.mp4" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -c:a copy -movflags +faststart "out/${name}_压缩版.mp4"
ls -la out | grep -F "$name"
