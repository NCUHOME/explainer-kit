# 项目说明

这是「政策文档 → 动画说明视频」的视频引擎（Remotion）。做视频的流程写在运营组 skill **`explainer-video`** 里（仓库 NCUHOME/ops-skills）。用户要做视频、做新一期、修改或重新导出某一期时，先加载这个 skill，严格按它做。

- 没装这个 skill：请用户运行 `npx skills add NCUHOME/ops-skills -a claude-code`，或经用户同意后代为运行。
- 画面代码在 `video/`，脚本在 `tools/`，所有命令都在项目根目录运行。
- 视觉规范、组件目录、检查清单在 `docs/`。`docs/LESSONS.md` 是真实审片意见，属于硬性要求。
- 品牌库在 `brands/`。每期用哪个品牌写在 `video/src/episodes/<期>/episode.json`，`tools/review.sh` 和 `tools/render.sh` 会自动切换。开 Remotion Studio 之前，先运行 `python3 tools/brand.py for <期>`。
- 答案只能来自用户给的原文；任何改写、合并、补充，都要在交付时列出来请用户核对。
- 渲染完整视频很慢（约 10 分钟），要放到后台运行。交付前必须用 `tools/review.sh` 截帧自查。
