# Evidence-First Personal Site

**[English](README.md) | 中文**

一个用于创建或改造个人作品网站的 Skill，最终产物是静态 Astro 网站。它只负责两件事：

1. 提供经过验证的技术基础设施：Projects、Writing、About、中英切换、GitHub Pages 与交付检查；
2. 在生成最终网站前，先产出一份 HTML 风格包，让用户确认视觉和文字方向。

证据优先方法被收进材料收集环节，避免 Agent 把私密、过期、无依据或夸大的内容发布成个人经历。

## 工作流

```text
收集获准公开的材料
→ 确认公开边界
→ 渲染并确认 HTML 风格包
→ 生成 Astro 网站
→ 写入已确认 tokens
→ 构建并检查所有路由
→ 获得明确授权后才部署
```

改造已有站时，Skill 会先抓取线上同源页面，整理成私有证据台账，只把重新确认过的内容迁入新模板。

## 包含内容

```text
SKILL.md                 工作流入口
references/evidence.md   证据台账与公开边界
references/new-site.md   从零建站
references/existing-site.md
                         已有站抓取与迁移
references/bilingual.md  中英内容和切换机制
references/style-kit.md  风格提问、HTML 确认与 token 写入
references/voice.md      证据驱动的文字规则
references/qa.md         内容、浏览器与发布检查
assets/site-template/    去个人化 Astro 模板
assets/style-kit/        HTML 模板、Soft Haze 与 Paper 预设
scripts/new-site.mjs     在空目录初始化网站
scripts/apply-style.mjs  写入已确认 tokens 与底纹
scripts/check-site.mjs   静态、浏览器及可选外链检查
scripts/inventory-site.mjs
                         抓取旧站同源公开材料
```

## 使用方式

安装 Skill 后，可以这样告诉 Agent：

```text
基于我确认可公开的简历、项目、文章和照片做个人网站。
中文为主，同时提供英文；公司工作和私有源码要明确标注。
先把 HTML 风格包给我确认，再生成最终网站。
```

Agent 会先建立私有台账和风格包预览，不会在没有明确授权时发布网站、创建仓库或启用部署。

## 技术基础设施

模板使用 Astro 7.3.5 静态输出，包含独立 Projects、Writing、About 路由、content collections、RSS、sitemap 和 GitHub Pages 子路径支持。首页必须有 2–3 个能力，每个能力由不同的公开项目支撑。

只支持中文（`zh-CN`）和英文（`en`）。翻译在写内容时由 Agent 生成，并通过构建和浏览器检查验证；不接运行时翻译服务。

## 风格包

v1 只提供两个起始预设：

- **Soft Haze**：克制的柔和底纹、不透明悬浮方块、sans-serif 排版；
- **Paper**：暖白平面、serif 标题、用细线而不是阴影分层。

它们只是讨论起点，不是主题库。强调色、真实页面预览和文字对照必须换成用户自己的材料。确认后的 token 块会原样写入网站，完整风格包保留在生成的网站仓库中。

## 检查

```bash
node scripts/check-site.mjs --site /path/to/site --browser
```

检查器会构建网站、验证内部资源和路由、阻止 draft 泄漏、点击真实语言切换、检查桌面与移动端的焦点和横向溢出，并把截图与 JSON 报告保存在 `qa/`。

## 边界

- 只做个人作品网站，不做公司官网和营销活动页；
- 不做 CMS、评论、统计、自定义域名和中英之外的语言；
- 不发布私密截图、内部指标、虚构结果或复制的第三方文字；
- 只有用户确认仓库和公开边界后才加入部署。

## License

[MIT](LICENSE)
