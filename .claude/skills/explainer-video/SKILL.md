---
name: explainer-video
description: Turn a policy / notice / FAQ document into a branded animated explainer video (Chinese voice-over, subtitles, original music) in the "pictogram how-to" style — one episode per section. Use whenever the user in this project asks to make a video, a new episode, or to change / re-render an existing episode.
---

# 政策文档 → 动画说明视频

把一份通知 / 办事指南 / 常见问题文档，做成带单位品牌、AI 配音、字幕、原创配乐的动画说明视频。每个信息点都要有画面把它“演”出来，不做会动的 PPT。

所有命令都在项目根目录运行。先读完本文件，再读 `references/STYLE.md`（视觉规范）和 `references/COMPONENTS.md`（组件用法）。`references/LESSONS.md` 是用户审片时提出的意见，**每一条都是硬性要求**。

## 0. 环境

第一次使用先确认运行过 `./setup.sh`（有 `.venv/` 和 `video/node_modules/` 即可）。没有就运行它；缺 Node / ffmpeg / Python 时按脚本提示让用户安装。

## 1. 开工前只问一次（一条消息问完）

- **文档**：政策原文（.docx/.pdf/.txt）。用 `tools/doc2text.sh <文件>` 转成文字后通读。
- **品牌**：单位、部门、栏目名、标志图片。写进 `video/public/brand/brand.json`，标志图放在同一个文件夹（一张用于浅色底 `lockupColor`，一张反白用于深色底 `lockupWhite`；没有就留空，会自动用文字排版代替）。`primary` 是品牌色的五个色阶（深→浅）。
- **期数和标题**：例如「第六期」「补测篇」，完整文件名如「教务答疑直通车｜第六期：南昌大学《学生体质健康标准》Q&A（补测篇）」。
- **素材**：APP 截图、现场照片等（截图放 `video/public/img/`）。
- **要不要先看分镜**：用户说“直接做完”就不停下。

文档里有前后矛盾（例如 APP 有某个入口，但文件说不受理）→ 列出来问用户以哪个为准，不要自己选。

## 2. 拆集与内容

- **一集对应文档的一个章节**。一集 2–3 分钟最合适；超过 4 分钟就拆。
- 把该章节的问题按**同学真实遇到的先后顺序**重新分成 3–4 个部分（例如：谁要做 → 什么时候 → 怎么做 → 做完之后），每部分一张章节卡。
- **答案只能来自原文**。改写处、合并处、从其他章节补进来的句子，都要在交付时逐条标出请用户核对。不要加原文没有的推断（例如原文只说“APP 不受理”，就不能写成“线下办理”）。
- 结构固定为：冷开场（一句钩子，3 秒内有画面动作）→ 封面 → [章节卡 → 问答镜头 × n] × 部分数 → 划重点 → 片尾免责声明卡。

## 3. 建立一集

```bash
.venv/bin/python tools/new_episode.py <id> --episode 第六期 --tag 补测篇 \
  --subtitle "南昌大学《学生体质健康标准》Q&A" --title "<完整标题>"
```

`<id>` 用小写字母（如 `bk`）。它会从 `video/src/episodes/_template/` 复制出 `video/src/episodes/<id>/` 并注册为合成 `EP-<id>`。完整参考范例：`video/src/episodes/bu/`（补测篇）和 `hm/`（缓免测篇）。

### 3.1 配音稿 `narration.json`

- 每个镜头一条（id 如 `b01`…），口语化、短句；问句用问号（配音会自动上扬），强调句会自动放慢。
- **数字写成汉字读法**，字幕再映射回阿拉伯数字：`"subs_map": {"六十分": "60分", "七十二小时": "72小时"}`。年份写“二零二四级”，号码按组读“三九二、四六七、五四四”。
- 某句后要留长停顿：`"style": {"0": [3, 6, 1.1]}`（第 0 句：语速%、音调Hz、句后停顿秒）。
- 声音默认晓伊（`zh-CN-XiaoyiNeural`），用户可换 edge-tts 的其他中文声音。

### 3.2 镜头表 `shots.json`

每个镜头：`{"id", "min"(最短秒), "hold"(配音后留白秒), "section"(配乐段落)}`。
配乐段落：`tense-intro`（冷开场，滴答+低音，结尾军鼓引入）、`cover`（全乐队）、`chapter`（章节卡）、`qa`（问答，轻节奏）、`calm`（舒缓）、`tense`（严肃规则）、`finale`（划重点，全乐队）、`end`（片尾长和弦）。没有配音的镜头（片尾卡）不写进 narration，只在 shots.json 给 `min`。

### 3.3 生成声音、时间轴、配乐

```bash
tools/audio.sh <id>            # 全部重做
tools/audio.sh <id> b04 b07    # 只重配某几句（时间轴和配乐会随之更新）
```

检查输出每句都是 `char alignment 100%`。时间轴按 112 BPM 对齐节拍，写进 `timeline.json`，画面和配乐都读它。

### 3.4 镜头 `shots.tsx` 与 `Film.tsx`

- 用 `cue("<镜头id>", "说到的词")` 让画面在说到那个词时出现；用 `beat(id, n)` 卡节拍。词必须是 narration 里的原文（汉字读法）。
- 每个问答镜头：`QHeader`（问题）+ `Answer`（一句话答案，在答案被说出时弹出）+ 一个**把答案演出来的画面**（流程节点、对比卡、成绩卡、时间轴、象形小人动作、真实截图放大框……），音效卡在动作上（`Sfx`）。
- 布局网格：品牌标签在左上（y≈36–130）；问题标题 y=170；答案条 y=300；画面区 y=390–950；字幕条 y≥988 不能放东西。左右留 ≥150px 边距。
- `Film.tsx` 里填：`PART`（右上角章节名）、`DARK`（深色底镜头，HUD 改浅色）、`noTab`（封面和片尾卡不显示左上标签）、转场方式（`columns` / `rows` / `iris`，章节卡用 `rows`）。
- 新的小人动作先在 `Figure.tsx` 的 `POSES` 里加姿势，用 `PoseSheet` / `ItemSheet` 静帧检查后再用。

## 4. 自查（每次交付前必须做）

```bash
tools/review.sh <id>     # 半分辨率试渲染 + 截帧拼图 → out/review/<id>/sheet_*.jpg
```

打开每一张拼图逐镜检查，对照 `references/CHECKLIST.md`：文字溢出/换行、元素相撞、留白、小人姿势、动作重复、答案是否被画出来、事实是否与原文一致。发现问题就改、再截帧确认。单独查某一帧：

```bash
cd video && npx remotion still EP-<id> /tmp/x.png --frame=<帧号> --scale=0.5
```

帧号从 `timeline.json` 的 `from` / `frames` 算。

## 5. 导出

```bash
tools/render.sh <id> "<完整标题>"
```

得到 `out/<标题>.mp4`（1080p，−14 LUFS）、`.srt` 字幕、`_压缩版.mp4`（适合微信）。完整版约 10 分钟渲染，放后台运行。

## 6. 交付时告诉用户

- 文件位置、时长；声音部分请用户亲自听（你听不到）。
- 内容结构表（部分 → 问题 → 画面）。
- **需要核对的清单**：所有改写、合并、补充、示意数据（例如成绩卡上的分数是示意，要标“示意”）、原文和 APP 的矛盾。

## 7. 修改

- 改字幕/配音文字：改 `narration.json` → `tools/audio.sh <id> <镜头id>` → 检查 → 重新导出。
- 改品牌：只改 `video/public/brand/brand.json`，所有集同时生效。
- 用户的新意见如果是通用的，追加到 `references/LESSONS.md`。
- 用户要“预览”：在 `video/` 里运行 `npx remotion studio`（长时间运行，放后台），把网址告诉用户；有内置浏览器就直接打开 `/EP-<id>`。
- 用户说“继续上次的”：先看 `video/src/episodes/<id>/` 里有哪些文件、`timeline.json` 是否存在、`out/` 里有没有成片，判断做到哪一步再接着做。
