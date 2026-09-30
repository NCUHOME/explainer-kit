#!/bin/zsh
# Voice → beat timeline → original score for one episode.
# Usage: tools/audio.sh <episode> [scene ids…]   (scene ids = only re-voice those lines)
set -e
cd "$(dirname "$0")/.."
ep="$1"; shift
.venv/bin/python tools/tts.py "$ep" "$@"
.venv/bin/python tools/timeline.py "$ep"
.venv/bin/python tools/score.py "$ep"
