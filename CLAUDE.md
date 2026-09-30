# 项目说明

这是「政策文档 → 动画说明视频」套件。用户要做视频、做新的一集、修改或重新导出某一集时，**先加载并严格按照 skill `explainer-video` 执行**（`.claude/skills/explainer-video/SKILL.md`），包括其中的 references。

- 画面代码在 `video/`（Remotion），脚本在 `tools/`，所有命令在项目根目录运行。
- `references/LESSONS.md` 是真实审片意见，属于硬性要求。
- 答案只能来自用户给的原文；任何改写、合并、补充都要在交付时列出来请用户核对。
- 渲染完整视频很慢（约 10 分钟），放到后台运行；交付前必须用 `tools/review.sh` 截帧自查。
