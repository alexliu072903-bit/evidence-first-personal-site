# evidence-first-personal-site v1 交接文档

日期：2026-10-06 · 需求方：Alex · 执行方：Claude Code（本地）

## 0. 一句话

把这个 Skill 收敛成两件事：**A 技术基础设施**（按 Alex 线上站的架构重做）+ **B 风格包确认**（先产出 HTML 风格包、让用户多轮确认，再生成网站）。证据优先方法论保留，精简后并入建站的内容收集环节。跑通两次端到端就发布，然后停。

## 1. 材料

| 材料 | 位置 | 用途 |
| --- | --- | --- |
| Skill 仓库 | `github.com/alexliu072903-bit/evidence-first-personal-site`（main @ 2207852） | 要改的对象 |
| Alex 的线上站 | `github.com/alexliu072903-bit/alexliu.readme`，线上 `https://alexliu072903-bit.github.io/alexliu.readme/` | 基础设施的参照架构 |
| 风格包标杆 | `/Users/mac/Documents/AirJelly/.claude/worktrees/claude-code-feature-onboarding-ec5b5c/prototypes/style-kit/index.html` 及其 `assets/` | 风格包模板的结构来源 |

## 2. 现状问题（为什么要改）

1. 三样东西叠在一起没接上：方法论文档、JSON contract 生成器（`init-site.mjs` + `assets/site-foundation`）、haze 风格文档。
2. 两条建站路线并存：`references/astro-foundation.md` 教手写站，生成器产出 `[...path].astro` 结构，SKILL.md 两个都推荐。
3. 生成器没实现核心主张：首页只有名字 + 描述 + 导航，没有「2–3 件事 + 各自证据」；`skin.css` 为空，页面无风格。
4. Alex 的线上站是手写 Astro，不是这个 Skill 生成的，生成器从未被真实站点验证。
5. style-kit 最有价值的部分没进来：排版数值、配图画法、写法对照、可粘贴提示词。
6. Alex 的个人数据混在通用规则示例里（`proof.md` 的 “about 50,000 views”、“Cold-start figures, from my resume”）。
7. 规则自相矛盾：QA 要求路由标题 2–3rem，foundation.css 写的是 `clamp(2.4rem, 7vw, 5rem)`。
8. 缺少「风格包确认」这一步：现在只有一句「没偏好就用 haze」。

## 3. 范围

**做**

- A1 从零建站：引导用户提供照片、文章、项目（开源或不开源），部署到 GitHub Pages。
- A2 改造已有站：抓取旧站内容 → 进证据台账 → 迁入模板。
- A3 基础功能：链接真实可跳、中英切换、Agent 生成翻译后由构建校验。
- B 风格包：提问 → 产出 HTML 风格包 → 多轮确认 → 写入站点 tokens。
- 证据方法论：精简为一篇 `references/evidence.md`，用在 A1/A2 的内容收集环节。

**不做**：多主题库（最多 2 个起始预设）、自定义域名、CMS、评论、统计、中英以外的语言、旧生成器的重构。

**停止线**：第 8 节两次端到端都通过，就打 tag `v1.0.0` 发布，停止迭代。

## 4. 目标结构

```text
SKILL.md                       ~60 行，只做路由：收集材料 → 风格包 → 生成 → 检查 → 部署
README.md / README.zh-CN.md    按新结构重写；机制图更新或暂时删除
references/
  evidence.md       证据台账 + 公开边界 + 能力配证据 + 数字规则 + 公司工作（合并原 evidence.md 与 proof.md，去掉 Alex 个人数据）
  voice.md          保留原文，补入 style-kit 第 5 节的「不这样写 / 这样写」对照
  new-site.md       A1：从零到 GitHub Pages 的完整流程
  existing-site.md  A2：保留原四步，补「抓取旧站 → 台账 → 迁入模板」
  bilingual.md      A3：翻译流程（Agent 翻译、用户抽查）+ 机制说明
  style-kit.md      B：提问清单、产出、确认轮次、写入站点
  qa.md             合并原 visual-and-qa.md 的页面检查与技术检查
assets/
  site-template/    Astro 站点模板（从 alexliu.readme 抽出并去个人化）
  style-kit/
    template.html               风格包 HTML 模板
    presets/soft-haze.css       起始预设 1：来自 Alex 的 style-kit（去掉 AirJelly 青色）
    presets/paper.css           起始预设 2：平面、暖白、衬线标题
    hero-template.light.svg     底纹模板（含丝纹和颗粒），从标杆 assets 复制
    hero-template.dark.svg
scripts/
  new-site.mjs        复制模板，写入名字、语言、模块、site/base；删掉未启用模块的页面
  apply-style.mjs     从确认后的风格包里抽出 token 块，写进站点的 tokens.css，复制底纹
  check-site.mjs      静态检查 +（--browser）浏览器检查
  inventory-site.mjs  A2：抓取旧站同源页面，输出 JSON 原始材料
tests/
```

删除：`assets/site-foundation`、`assets/deployment`（部署文件移进模板）、`assets/haze`（由 hero-template 取代）、`scripts/init-site.mjs`、`verify-site.mjs`、`browser-qa.mjs`、旧 tests、`references/astro-foundation.md`、`site-foundation.md`、`default-style.md`、`visual-and-qa.md`、`proof.md`。

## 5. 关键机制设计（已定，照做）

### 5.1 站点模板（A）

- 版本对齐线上站：`astro 7.3.5`、`@astrojs/mdx 7.0.7`、`@astrojs/sitemap 3.7.3`、`@astrojs/rss 4.0.19`；`output: 'static'`、`trailingSlash: 'always'`。
- 页面：`index`、`projects/index`、`projects/[id]`、`writing/index`、`writing/[id]`、`about`、`404`、`rss.xml.js`。未启用的模块由 `new-site.mjs` 直接删除对应页面，导航从 `site.config.mjs` 的 `modules` 生成。
- **唯一配置文件** `src/site.config.mjs`（JS + JSDoc 类型，Node 脚本和 Astro 都能直接 import）：`name`、`description`、`languages`（第一个为主语言，只允许 `zh-CN`/`en`）、`modules`、`capabilities[]`（`title`、`text`、`evidence: <project id>`）、`resume`、`contact`、`photo`、`about.summary`、`about.sections[]`、`deployment.site/base`。
- **首页**必须实现：名字 + 一句话 → 2–3 个能力，每个下面链接一个不同的项目作为证据 → 精选项目 → 最近文章。构建时校验：`capabilities` 引用的项目必须存在且为 public，同一个项目不能被两个能力引用。
- **项目 frontmatter**：`title`、`description`、`year`、`order`、`publication: public | draft`（必填，不默认 public）、`status: live | available | experimental | in-progress | historical | discontinued`、`source: open | private | mixed | not-applicable`、`category?`、`image?`、`imageAlt?`、`brief?`（2–3 行 label/text）、`facts?`（≤4，配 `factsNote` 写来源与时间）、`links[]`、`translation?`（次语言的 title/description/imageAlt/brief/facts/factsNote/links label/bodyNote）。状态和源码标签由模板内置的中英词表渲染，不需要用户翻译。
- **文章 frontmatter**：`title`、`description`、`publishedAt`、`publication`（必填）、`tags`、`readTime?`、`image?`、`imageAlt?`、`source?`（label/url/note）、`translation?`。
- **长正文的次语言**：放在 `src/content/translations/<collection>/<id>.md`，作为单独 collection。双语站上一篇有正文的条目，必须有翻译正文或 `translation.bodyNote`（说明「全文目前只有中文」），否则构建失败。

### 5.2 中英切换（A3，从线上站 BaseLayout 抽出并泛化）

线上站的做法：中文为主，叶子节点上写 `data-i18n-en`，客户端脚本切换文本、`alt`、`aria-label`、`href`、`src`、`<title>` 和 meta，`?lang=` 参数 + `localStorage` + 浏览器语言检测，切换后给站内链接带上 `?lang=`。泛化方式：

- 类型 `Text = string | { 'zh-CN'?: string; en?: string }`。纯字符串表示与语言无关（人名、URL）；访客要读的文字一律写成对象。
- `lib/i18n.ts` 里的 `tx(text)` 返回 `{ primary, secondary }`；双语站缺次语言时**直接 throw**，构建失败，不出现半翻译页面。
- 组件 `<T text={…} as="p" />`：输出主语言文本，次语言放在 `data-t`。属性用 `attr('alt', pair)` 生成 `data-t-alt` / `data-t-aria-label` / `data-t-href` / `data-t-src`。
- `<html>` 上写 `data-primary`、`data-secondary`；脚本按主次语言切换，不写死中文。整块内容（长正文）用 `data-lang-block="primary|secondary"`，CSS 按 `html[data-mode]` 隐藏。
- 翻译由 Agent 在写内容时生成，进 `translation` 字段，并在交付时列出来让用户抽查。不接任何运行时机器翻译服务。

参考实现（已写好的开头，可直接用）：

```ts
export function tx(text: Text | undefined, where = 'text'): Pair {
  if (text === undefined) return { primary: '' };
  if (typeof text === 'string') return { primary: text };
  const first = text[primary];
  if (!first) throw new Error(`Missing ${primary} for ${where}: ${JSON.stringify(text)}`);
  if (!secondary) return { primary: first };
  const second = text[secondary];
  if (!second) throw new Error(`Missing ${secondary} translation for ${where}: "${first}"`);
  return { primary: first, secondary: second };
}
```

### 5.3 风格包与站点之间的桥（B → A）

- 风格包 HTML 和站点共用**同一个 token 块**，用注释标记：`/* tokens:start */ … /* tokens:end */`。用户确认风格包后，`apply-style.mjs --kit kit.html --site <dir>` 把这一块原样抽出写入站点的 `src/styles/tokens.css`，并复制底纹 SVG 到 `public/style/`。站点的 `site.css` 只引用变量，不写死任何颜色、字号、圆角。
- token 清单（两边一致）：
  - 颜色：`--color-ink`、`--color-body`、`--color-muted`、`--color-line`、`--color-page`、`--color-surface`、`--color-accent`、`--color-accent-ink`、`--tile-bg`
  - 字体：`--font-sans`、`--font-display`、`--font-mono`
  - 字号：`--size-body`、`--leading-body`、`--size-h1`、`--size-h2`、`--size-title`、`--size-small`、`--measure`、`--space-entry`
  - 形状：`--radius-tile`、`--radius-card`、`--radius-pill`、`--shadow-tile`、`--shadow-card`
  - 底纹：`--haze`（渐变或 `none`）
  - 暗色：在 `@media (prefers-color-scheme: dark)` 里重设同名变量。
- 底纹图片的路径用 BaseLayout 的内联 style 传入（`--haze-image: url(${base}style/…)`），因为打包后的 CSS 里相对 `url()` 在子路径部署时会失效。线上站就是这样处理的。

### 5.4 风格包模板（B）

`assets/style-kit/template.html` 照标杆的结构，所有预览都由 token 驱动，改 token 即改全部预览：

1. 配色：色板 + 用途说明（标题、正文、次要、分隔线、底色、强调色）。
2. 背景和悬浮元素：底纹 + 一个悬浮方块/药丸的明暗两版预览。
3. 配图画法：1000×400 画布、一张图只放一个元素、线宽、强调色最多一处、图标来源（Phosphor，MIT）、明暗两张都要渲染检查。
4. 排版：字体、字号、行高、条目间距、标签样式的取值表。
5. 文字写法：「不这样写 / 这样写」对照 + 规则表（Agent 用用户自己的材料举例）。
6. **真实页面预览**：用用户的名字、一个能力、一个项目卡片渲染出首页第一屏和一个项目条目。这是用户确认时最依赖的部分。
7. 不要带走的东西：第三方品牌、别人的原文、和个人站无关的规则。

两个起始预设只是讨论起点：`soft-haze`（来自 Alex 的 style-kit：`#fafafa` 底、`#0d0d0d`/`#404040`/`#666666` 文字、15px/1.75 正文、28px 条目标题、白色 0.94 方块 + `0 24px 60px rgba(0,80,102,.14), 0 2px 6px rgba(0,80,102,.06)` 阴影、三层径向渐变底纹）和 `paper`（平面、暖白底、衬线标题、无底纹、细线分隔）。强调色必须换成用户自己的，不能用 AirJelly 青色 `#00c8ff`。

`references/style-kit.md` 的流程：

1. 先问 3–4 个问题（喜欢的参考网站或截图；浅色/暗色；有没有底纹和悬浮元素；配图偏截图还是单元素插画；强调色）。用户说不出偏好时，展示两个预设的预览让他选。
2. 产出风格包 HTML，用浏览器渲染截图给用户看（明暗各一张）。
3. 每轮只改用户指出的部分，最多 3 轮；第 3 轮后仍不满意，回到第 1 步换预设。
4. 用户明确说「确认」后才运行 `apply-style.mjs`，并把风格包放进站点仓库的 `style-kit/` 目录留档。

### 5.5 脚本

- `new-site.mjs --output <dir> --name <name> --languages zh-CN,en --modules projects,writing,about --site https://USER.github.io --base /REPO [--deploy]`：目录非空就拒绝；不带 `--deploy` 不写 `.github/workflows/deploy.yml`（用户确认目标仓库和公开范围后才加）。
- `check-site.mjs --site <dir> [--browser] [--external]`：
  - 静态（默认）：先 build；遍历 `dist` 里所有 HTML，站内的 `href`/`src`（含 `data-t-href`/`data-t-src`）必须对应到 `dist` 里的文件；`publication: draft` 的条目不能出现在产物里；`--external` 时对外链做 HEAD 请求。
  - 浏览器（`--browser`，Playwright）：每个路由在 1440 和 375 宽度下无 console 错误、无横向溢出、图片都能加载；双语站点击切换后扫描正文：主语言为中文时不应残留中文字符（人名、机构名除外，用白名单），主语言为英文时不应残留连续 4 个以上的英文单词；切换后站内链接带 `?lang=`、`<title>` 已切换；用真实 Tab 键检查焦点可见。截图存到 `qa/`。
- `inventory-site.mjs --url <old site> [--max 50] --out inventory.json`：用 Playwright 抓同源页面，输出每页的 title、description、h1–h3、段落、链接、图片（src/alt）。只用于生成私有台账，不进站点。

### 5.6 CI

`.github/workflows/validate.yml` 保留两个 job：`npm test`（脚本单测）+ 两个 fixture 的完整构建与 `check-site --browser`：
- fixture 1：中文为主的双语站，三个模块都开，`soft-haze` 预设；
- fixture 2：只有英文，不开 Writing，`paper` 预设。

## 6. 执行顺序与每步验收

1. **模板**：从 `alexliu.readme` 抽出并去个人化，实现 5.1–5.3。验收：用 fixture 1 能构建，切到英文后没有中文残留。
2. **脚本**：`new-site`、`apply-style`、`check-site`、`inventory-site` + 单测。验收：`npm test` 通过；`check-site` 能抓到一个故意写坏的站内链接和一个漏翻的字段。
3. **风格包**：`template.html` + 两个预设 + `references/style-kit.md`。验收：两个预设渲染出的风格包，明暗截图看起来明显是两种风格，第 6 节的页面预览可读。
4. **文档**：重写 SKILL.md（~60 行）、合并 references、重写两个 README。验收：SKILL.md 里每个链接都指向存在的文件；全仓库搜不到 “50,000”、“Resume.AI”、“AirJelly”、“#00c8ff”。
5. **端到端**：见第 8 节。

## 7. 注意事项

- 不改 `alexliu.readme` 本身，只读它。
- 不把 Alex 的照片、简历、项目、数据放进 Skill 的模板、fixture 或示例。fixture 用虚构人物。
- 不带走 AirJelly 的标志和青色、第三方 logo、Typeless 原文。
- 在分支上做，开 draft PR，不要 merge，不要打 tag，等 Alex 看过再说。
- PR 描述用 Before / After 写清楚用户能感知的变化。

## 8. 发布验收（停止线）

两次都要从头完整走一遍 Skill，像真实用户一样：

1. **从零建站**：虚构人物（例如一位做无障碍设计的研究者，中英双语，有 3 个项目、1 篇文章、1 份简历）。风格包流程里选一个和 Alex 不同的风格（例如 `paper` + 自定义强调色）。产出：风格包截图 + 生成的站点 + `check-site --browser` 全部通过。
2. **改造已有站**：用 `inventory-site.mjs` 抓一个现有个人站（Alex 会提供 Oli 的网址；拿不到就用 `tests/fixtures/old-site/` 里一个手写的旧站）。产出：私有台账、改版后的站点、新旧首页对比截图、`check-site --browser` 全部通过。

两次都通过后，在 PR 里附上截图和检查报告，交给 Alex 决定是否 merge 和打 `v1.0.0`。到这里就停，不再加功能。
