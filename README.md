# 政策动画说明视频套件（Explainer Kit）

把一份通知、办事指南或常见问题文档，交给 Claude Code，做成带单位品牌、AI 配音、字幕和原创配乐的动画说明视频。

首批成片：南昌大学教务处「教务答疑直通车」第六期《学生体质健康标准》Q&A（补测篇）、第七期（缓免测篇）。两期的完整源码就在 `video/src/episodes/bu/` 和 `hm/` 里，可以直接打开看、改、重新导出。

## 需要准备

| 软件 | 用途 | 安装 |
|---|---|---|
| Claude Code | 让 Claude 帮你做视频 | https://claude.com/claude-code |
| Node.js 20 以上 | 渲染画面 | https://nodejs.org（选 LTS） |
| ffmpeg | 合成视频、处理声音 | macOS：`brew install ffmpeg`；Windows：`winget install ffmpeg` |
| Python 3.10 以上 | 配音、配乐 | https://www.python.org/downloads/ |
| pandoc（可选） | 读取 Word 文档 | macOS：`brew install pandoc` |

配音使用微软的在线语音（edge-tts），制作时需要联网。

## 三步开始

```bash
# 1. 安装（只需一次，约 2 分钟）
./setup.sh

# 2. 在本文件夹里打开 Claude Code
claude
```

3. 对 Claude 说：

> 用这份文档做一期视频：/路径/某某通知.docx。单位是××大学××处，栏目叫「××」，这是第一期，标题是「……」。

Claude 会按内置的 skill（`.claude/skills/explainer-video/`）自动完成：读文档 → 拆问题、排顺序 → 写配音稿 → 生成配音、节拍、配乐 → 做动画 → 截帧自查 → 导出。导出的文件在 `out/` 里：

- `标题.mp4`：1080p 成片，响度 −14 LUFS
- `标题.srt`：字幕文件
- `标题_压缩版.mp4`：适合发微信群

## 换成你自己的单位

只改一个文件夹：`video/public/brand/`

- `brand.json`：单位名、部门、栏目名、品牌色（五个色阶，深→浅）、片尾免责声明
- 官方组合标志两张：浅色底用（`lockupColor`）、深色底用的反白版（`lockupWhite`）。没有图片就把这两项留空，会自动用文字排版。

改完所有集同时生效。

## 手动命令（一般不需要，Claude 会自己用）

```bash
.venv/bin/python tools/new_episode.py <id> --episode 第一期 --tag 某某篇 --subtitle "…" --title "…"
tools/audio.sh <id>                 # 配音 + 节拍时间轴 + 原创配乐
tools/review.sh <id>                # 半分辨率试渲染 + 截帧拼图（out/review/<id>/）
tools/render.sh <id> "<文件标题>"    # 最终导出 mp4 + srt + 压缩版
cd video && npx remotion studio     # 在浏览器里逐帧预览、拖动时间轴
```

## 文件夹结构

```
.claude/skills/explainer-video/   方法：SKILL.md（流程）+ references/（视觉规范、组件目录、审片意见、检查清单）
video/public/brand/               品牌配置和标志
video/src/episodes/<id>/          每一集：配音稿、镜头表、画面代码
video/src/picto/ · video/src/kit/ 画面组件（象形小人、图案、封面、章节卡、问答头、流程节点……）
tools/                            配音、时间轴、配乐、字幕、导出脚本
```

## 版权与许可

见 `NOTICE.md`。重点：
- **单位标志**：`video/public/brand/` 里的南昌大学标志仅供南昌大学相关单位按学校视觉规范使用。转给校外朋友前，请删除这两张图，换成对方自己的标志。
- **Remotion**（渲染引擎）对个人、非营利组织和 3 人以内公司免费，其他情况需购买授权：https://www.remotion.pro/license
