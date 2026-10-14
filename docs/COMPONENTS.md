# 组件目录

画布 1920×1080，30fps。所有动画由 `useCurrentFrame()` 驱动（不能用 CSS transition）。镜头里的帧号都是**相对该镜头开头**。范例：`video/src/episodes/bu/shots.tsx`、`hm/shots.tsx`。

## 时间：`episodes/<id>/tl.ts`
| 函数 | 作用 |
|---|---|
| `cue(id, "词")` | 配音说到这个词的帧（第 n 次出现：`cue(id, "词", n)`） |
| `beat(id, n)` | 镜头开始后第 n 拍的帧（112 BPM，1 拍 ≈ 16 帧） |

## 缓动与小工具：`kit/kit.tsx`
| 名称 | 用法 |
|---|---|
| `inn(f, at, dur)` | 0→1，指数缓出（入场首选） |
| `pop(f, at, dur)` | 0→1，带回弹（圆章、标签；克制使用） |
| `clamp` | `interpolate` 的夹紧选项 |
| `<MaskUp at>` | 文字从遮罩里向上滑出 |
| `<Sfx at name volume>` | 音效：`whistle` `stamp` `pop` `tick` `click` `ding` `swish` `thud` `shutter` `type` |
| `<Grain />` | 纸张颗粒（每个镜头最后放一层） |
| `<Tag at>` | 带星号的纸质细节标签 |
| `<Medallion n>` | 编号圆章 |
| `<StepHeader n of title>` | 步骤头（圆章 + STEP n OF N + 标题） |
| `<Callout cx cy r src view open>` | 圆形放大框，显示真实截图：`view={{x, y, zoom}}` 是截图上放在中心的点 |
| `<Tap x y at r dir>` | 放大框里的“手指点击”+ 波纹 |
| `<Bust cx cy s color>` | 头肩象形（SVG 内） |
| `<SunDisc cx cy r color>` | 太阳圆盘（小人身后的舞台） |

## 分集结构：`picto/Episode.tsx`
| 名称 | 用法 |
|---|---|
| `<CoverCard episode tag subtitle questions>` | 系列封面（标志、栏目名、期数、问题标签、跑道小人） |
| `<ChapterCard n title en sub hue seed>` | 章节卡（满屏图案 + 空心数字） |
| `<QHeader q of label title second?>` | 问题头；`second={{q, title, at}}` 同一镜头切换到第二个问题 |
| `<Answer at color top? left?>` | 一句话答案条 |
| `<Room hue floor?>` | 浅色房间（墙 + 地面带），问答镜头默认舞台 |
| `<EndCard disclaimer?>` | 片尾卡（默认读 brand.json 的 disclaimer） |
| `<Film …>` | 整集外壳：镜头 + 配音 + 配乐 + 品牌标签 + HUD + 字幕 |
| `<TrackStrip>` | 跑道条（封面用） |

## 插画积木：`kit/blocks.tsx`、`kit/shapes.tsx`
| 名称 | 用法 |
|---|---|
| `<Node x y at f label sub accent>` + SVG 子元素 | 流程节点（圆 + 图标 + 标签），配 `<Arrow>` 连成流程 |
| `<Arrow x1 y1 x2 y2 p color>`（SVG 内） | 逐渐画出的箭头，`p` 0→1 |
| `<ScoreCard … total lens stamp>` | 示意成绩单（逐行填充、总分滚动、盖章） |
| `ITEM_ROWS` | 七个体测项目 |
| 图标（SVG 内）`ListDoc` `Building` `Lock` `Flag` `Trophy` `Cap` `Diploma` `Hospital` `MedDoc` `Cal` `PhoneIcon` | 几何图标：`<Icon x y s color bg?/>` |
| `kit/uiIcons.tsx`：`Check` `Download` `Face` `Calendar` `Pin` | 线性小图标（HTML 内） |
| `kit/Track.tsx`：`ScribbleCircle` `ScribbleUnderline` | 手绘圈、手绘下划线 |

## 象形小人：`picto/Figure.tsx`
```tsx
<svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
  <Figure x={600} y={hipOnGround(pose, H, 800)} H={400} pose={pose}
          color={blue[0]} farColor={mix(blue[0], CREAM, 0.4)}>
    {(j) => /* 用关节坐标画道具：j.nHa 近手、j.fHa 远手、j.headC 头 … */ null}
  </Figure>
</svg>
```
- 姿势 `POSES`：`stand` `holdPhone` `selfie` `point` `blow` `sitReach` `sitUp` `hang` `pullTop` `longJumpFlight` `longJumpCrouch` `longJumpLand`。
- 动态：`runPose(相位)`、`walkPose(相位)` → `{pose, lift}`，相位 = `(f / 周期) * 2π`（跑 14 帧，走 30 帧）。
- `lerpPose(a, b, t)` 姿势过渡；`hipOnGround(pose, H, 地面y, lift)` 让脚落地。
- 新姿势角度：四肢从“竖直向下”量起，向前为正（180 = 朝上）；躯干从竖直量起，前倾为正。
- `picto/ItemIcon.tsx`：`<ItemIcon kind cx cy s color far t>`，kind = `scale` `blow` `reach` `jump` `pullup` `situp` `run`。

## 颜色与字体：`picto/palette.ts`
- `HUES.blue`（= 品牌色）`HUES.red` `HUES.green` `HUES.teal`，每个 5 个色阶 `[0]` 最深 → `[4]` 最浅，`[1]` 为主色。
- `CREAM`（米白）`INK`（墨色）`NEUTRAL`（深色底）`mix(a, b, t)`。
- 字体：`FONT_CN`（思源黑体）`FONT_LATIN`（Inter Tight，数字/英文）`FONT_MONO`（DM Mono，HUD）；标题衬线用 `"Noto Serif SC"`。
- 图案：`<Pattern hue seed contrast="full|low" shift={f * 0.8} />`（shift 连续增长即可平滑滚动）。

## 转场（Film.tsx 里每个镜头的 `reveal`）
`{ type: "columns" }` 整列落下 · `{ type: "rows" }` 整行滑入（章节卡）· `{ type: "iris", x, y }` 圆形展开 · `{ type: "none" }`。
