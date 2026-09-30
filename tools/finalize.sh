#!/bin/zsh
# Two-pass loudness normalization of a rendered video to -14 LUFS / -1 dBTP
# (STYLE.md §7), in place. Video stream is copied untouched.
set -e
in="$1"; tmp="${in%.mp4}.tmp.mp4"
T="I=-14:TP=-1.0:LRA=11"
m=$(ffmpeg -hide_banner -nostats -i "$in" -af loudnorm=$T:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
get() { echo "$m" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$in" -c:v copy \
  -af "loudnorm=$T:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 192k "$tmp"
mv "$tmp" "$in"
ffmpeg -hide_banner -nostats -i "$in" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' '
