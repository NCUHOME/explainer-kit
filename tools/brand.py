#!/usr/bin/env python3
"""品牌库：每个单位 / 栏目的品牌是 brands/<品牌名>/ 一个文件夹（brand.json + 标志图片）。

用法（在项目根目录运行）：
  python3 tools/brand.py list                     列出品牌库（编号、名称）
  python3 tools/brand.py use <品牌名>              设为当前品牌：复制到 video/public/brand/（画面从这里读）
  python3 tools/brand.py for <期id>                按这一期 episode.json 里的品牌设为当前品牌（review.sh、render.sh 会自动调用）
  python3 tools/brand.py gallery [-o 品牌一览.html]  生成品牌一览网页（编号、配色、标志）
  python3 tools/brand.py check                    检查品牌库：字段、图片、编号（提 PR 前必须通过）

brand.json 字段：
  order / name / description / rights      品牌库用：编号、名称、一句话说明、标志版权说明
  org / orgEn / dept / deptEn / series      单位、部门（中英文）、栏目名
  lockupColor / lockupWhite                 组合标志：浅色底用 / 深色底反白用（图片文件名；没有就留空，用文字排版代替）
  primary                                   品牌色五个色阶，深 → 浅
  disclaimer                                片尾免责声明
"""

import argparse
import base64
import html
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRANDS = ROOT / "brands"
ACTIVE = ROOT / "video" / "public" / "brand"
EPISODES = ROOT / "video" / "src" / "episodes"
DEFAULT = "ncu-jwc"
FIELDS = ["order", "name", "description", "rights", "org", "orgEn", "dept", "deptEn", "series",
          "lockupColor", "lockupWhite", "primary", "disclaimer"]


def brands():
    """[(品牌名, brand.json)]，按 order 排序"""
    out = [(d.name, json.loads((d / "brand.json").read_text("utf-8")))
           for d in BRANDS.iterdir() if (d / "brand.json").is_file()]
    return sorted(out, key=lambda x: (x[1].get("order", 999), x[0]))


def use(bid):
    src = BRANDS / bid
    if not (src / "brand.json").is_file():
        sys.exit(f"✗ 品牌库里没有「{bid}」。现有：{'、'.join(b for b, _ in brands())}")
    if ACTIVE.exists():
        shutil.rmtree(ACTIVE)
    shutil.copytree(src, ACTIVE)
    (ACTIVE / ".current").write_text(bid, "utf-8")
    print(f"当前品牌：{bid}（{json.loads((src / 'brand.json').read_text('utf-8'))['name']}）")


def brand_of(ep):
    f = EPISODES / ep / "episode.json"
    if not f.is_file():
        print(f"· {ep} 没有 episode.json，用默认品牌 {DEFAULT}")
        return DEFAULT
    return json.loads(f.read_text("utf-8")).get("brand", DEFAULT)


def check():
    bad, seen = 0, {}
    for bid, b in brands():
        errs = []
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", bid):
            errs.append("品牌名只能用小写字母、数字和连字符，例如 ncu-tw")
        errs += [f"brand.json 缺少「{k}」" for k in FIELDS if k not in b]
        errs += [f"「{k}」不能为空" for k in ("name", "org", "series", "disclaimer", "rights") if k in b and not b[k]]
        p = b.get("primary", [])
        if not (isinstance(p, list) and len(p) == 5 and all(re.fullmatch(r"#[0-9A-Fa-f]{6}", c or "") for c in p)):
            errs.append("primary 要写五个 #RRGGBB 颜色，深 → 浅")
        for k in ("lockupColor", "lockupWhite"):
            if b.get(k) and not (BRANDS / bid / b[k]).is_file():
                errs.append(f"{k} 指向的图片 {b[k]} 不存在")
        if b.get("order") in seen:
            errs.append(f"编号 order={b['order']} 和 {seen[b['order']]} 重复")
        seen[b.get("order")] = bid
        print(f"{'✗' if errs else '✓'} {b.get('order', '?')}. {bid}（{b.get('name', '')}）")
        for e in errs:
            print(f"   - {e}")
        bad += bool(errs)
    ids = [x for x, _ in brands()]
    for ep in sorted(EPISODES.iterdir()):
        f = ep / "episode.json"
        if f.is_file() and json.loads(f.read_text("utf-8")).get("brand") not in ids:
            print(f"✗ 第 {ep.name} 期的 episode.json 用的品牌不在品牌库里")
            bad += 1
    print(f"\n{len(ids)} 个品牌，{'全部通过' if not bad else f'{bad} 处有问题'}")
    return 1 if bad else 0


def img_tag(path, alt):
    if not path.is_file():
        return ""
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    return f'<img alt="{html.escape(alt)}" src="data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}">'


def gallery(out):
    cards = []
    for i, (bid, b) in enumerate(brands(), 1):
        d, p = BRANDS / bid, b["primary"]
        swatches = "".join(f'<span style="background:{c}" title="{c}"></span>' for c in p)
        color = img_tag(d / b["lockupColor"], "标志") if b.get("lockupColor") else f'<b>{html.escape(b["org"])} {html.escape(b["dept"])}</b>'
        white = img_tag(d / b["lockupWhite"], "反白标志") if b.get("lockupWhite") else f'<b style="color:#fff">{html.escape(b["org"])} {html.escape(b["dept"])}</b>'
        cards.append(f'''<div class="card">
  <div class="logo light">{color}</div><div class="logo dark" style="background:{p[0]}">{white}</div>
  <div class="info"><div><span class="no">{i}</span><span class="name">{html.escape(b["name"])}</span></div>
  <div class="meta">{html.escape(b["org"])} {html.escape(b["dept"])} · 栏目「{html.escape(b["series"])}」 · 品牌名 {bid}</div>
  <div class="sw">{swatches}</div><div>{html.escape(b.get("description", ""))}</div>
  <div class="meta">片尾：{html.escape(b["disclaimer"])}</div></div></div>''')
    cards.append(f'''<div class="card new"><div class="plus">＋</div><div class="info">
  <div><span class="no">{len(cards) + 1}</span><span class="name">新单位 / 栏目品牌</span></div>
  <div>给单位名、栏目名、标志和品牌色，做一个新品牌；做完可以存进品牌库。</div></div></div>''')
    page = PAGE.replace("__CARDS__", "\n".join(cards))
    out.write_text(page, "utf-8")
    print(f"写入 {out.resolve()}")


PAGE = """<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>品牌一览</title>
<style>
:root { --page: #eef1f6; --ink: #1d2433; --muted: #66708a; --line: #d6dbe6; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--page); color: var(--ink);
  font: 14px/1.6 -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
main { max-width: 1120px; margin: 0 auto; padding: 28px 16px 48px; }
h1 { margin: 0; font-size: 22px; }
.lead { margin: 4px 0 20px; color: var(--muted); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
.card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 0 0 1px var(--line), 0 8px 24px rgba(29, 36, 51, .08); }
.logo { height: 92px; display: grid; place-items: center; padding: 14px; }
.logo img { max-height: 64px; max-width: 100%; }
.logo.light { border-bottom: 1px solid var(--line); }
.info { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; }
.no { display: inline-block; min-width: 26px; padding: 0 8px; border-radius: 999px; background: #2658C4; color: #fff;
  font-weight: 700; text-align: center; margin-right: 6px; }
.name { font-size: 16px; font-weight: 700; }
.meta { color: var(--muted); font-size: 13px; }
.sw { display: flex; gap: 4px; }
.sw span { width: 28px; height: 18px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .08); }
.new .plus { height: 184px; display: grid; place-items: center; font-size: 44px; color: #2658C4; background: #f2f5fb; }
</style></head>
<body><main><h1>品牌一览</h1><p class="lead">回复编号选择品牌；要给新的单位或栏目做视频，选最后一项。</p>
<div class="grid">
__CARDS__
</div></main></body></html>
"""


def main():
    ap = argparse.ArgumentParser(description="品牌库")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    sub.add_parser("check")
    sub.add_parser("use").add_argument("brand")
    sub.add_parser("for").add_argument("episode")
    g = sub.add_parser("gallery")
    g.add_argument("-o", "--out", type=Path, default=Path("品牌一览.html"))
    a = ap.parse_args()
    if a.cmd == "list":
        for i, (bid, b) in enumerate(brands(), 1):
            print(f"{i}. {b['name']}（品牌名 {bid}）：{b.get('description', '')}")
        print(f"{len(brands()) + 1}. 新单位 / 栏目品牌")
    elif a.cmd == "use":
        use(a.brand)
    elif a.cmd == "for":
        use(brand_of(a.episode))
    elif a.cmd == "gallery":
        gallery(a.out)
    elif a.cmd == "check":
        sys.exit(check())


if __name__ == "__main__":
    main()
