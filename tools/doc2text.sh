#!/bin/zsh
# Convert a .docx / .pdf / .txt policy document to plain text for reading.
# Usage: tools/doc2text.sh <file> [out.md]
set -e
in="$1"; out="${2:-${in%.*}.md}"
case "$in" in
  *.docx) (command -v pandoc >/dev/null && pandoc "$in" -t markdown -o "$out") || textutil -convert txt "$in" -output "$out" ;;
  *.pdf) command -v pdftotext >/dev/null && pdftotext -layout "$in" "$out" || { echo "需要 pdftotext（brew install poppler）"; exit 1; } ;;
  *) cp "$in" "$out" ;;
esac
echo "$out"
