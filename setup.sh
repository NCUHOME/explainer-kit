#!/bin/zsh
# One-time setup: checks system tools, installs Node packages and the Python venv.
set -e
cd "$(dirname "$0")"
ok() { printf "  ✓ %s\n" "$1"; }
need() { printf "  ✗ %s\n    %s\n" "$1" "$2"; exit 1; }
echo "检查系统工具 / Checking tools"
command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ] && ok "Node $(node -v)" || need "需要 Node.js 20+" "https://nodejs.org 下载 LTS 版本安装"
command -v ffmpeg >/dev/null && ok "ffmpeg" || need "需要 ffmpeg" "macOS: brew install ffmpeg · Windows: winget install ffmpeg"
command -v python3 >/dev/null && python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)' && ok "Python $(python3 -V | cut -d' ' -f2)" || need "需要 Python 3.10+" "https://www.python.org/downloads/"
command -v pandoc >/dev/null && ok "pandoc（可选，读取 Word 文档）" || echo "  · 未装 pandoc（可选）：brew install pandoc，用来读取 .docx"
echo "安装 Python 依赖 / Python venv"
[ -d .venv ] || python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip >/dev/null
.venv/bin/pip install -q edge-tts numpy scipy soundfile pillow fonttools brotli
ok "Python 依赖"
echo "安装 Node 依赖 / npm install"
(cd video && npm install --no-audit --no-fund --loglevel=error)
ok "Node 依赖"
echo "生成音效 / Generating sound effects"
.venv/bin/python -c "import sys; sys.path.insert(0,'tools'); import score; score.gen_sfx()"
echo
echo "完成。下一步：在本文件夹运行 claude，然后说「用这份文档做一期视频」。"
