# Evidence-First Personal Site

**English | [中文](README.zh-CN.md)**

A Skill for building or redesigning a personal portfolio as a static Astro site. It does two things:

1. provides tested technical infrastructure for projects, writing, About, Chinese–English switching, GitHub Pages, and verification;
2. requires the owner to confirm an HTML style kit before the final site is generated.

Evidence rules remain in the material-intake step so an Agent does not publish private, stale, unsupported, or inflated claims.

## Workflow

```text
collect approved material
→ confirm the public boundary
→ render and approve an HTML style kit
→ generate the Astro site
→ apply the confirmed tokens
→ build and check every route
→ deploy only after explicit approval
```

For an existing site, the Skill first inventories the live same-origin pages, moves current material into a private evidence ledger, and migrates only approved content into the new template.

## What is included

```text
SKILL.md                 Workflow router
references/evidence.md   Evidence ledger and public boundaries
references/new-site.md   New-site workflow
references/existing-site.md
                         Existing-site inventory and migration
references/bilingual.md  Chinese–English authoring and runtime
references/style-kit.md  Style questions, HTML confirmation, token transfer
references/voice.md      Evidence-led copy
references/qa.md         Content, browser, and delivery checks
assets/site-template/    De-personalized Astro template
assets/style-kit/        HTML template, Soft Haze and Paper presets
scripts/new-site.mjs     Initialize a site in an empty directory
scripts/apply-style.mjs  Transfer confirmed tokens and textures
scripts/check-site.mjs   Static, browser, and optional external checks
scripts/inventory-site.mjs
                         Capture same-origin material from an old site
```

## Quick start

After installing the Skill, ask an Agent:

```text
Build a personal site from my approved resume, projects, articles, and photos.
Chinese first, with English. Keep company work and private source clearly labelled.
Show me the HTML style kit before generating the final site.
```

The Agent will create a private ledger and a style-kit preview before writing the site. It will not publish, create a repository, or enable deployment without approval of the exact target.

## Infrastructure

The generated template uses Astro 7.3.5 with static output, explicit Projects and Writing routes, content collections, RSS, sitemap, and GitHub Pages base-path support. The homepage requires two or three capabilities, each backed by a different public project.

Only Chinese (`zh-CN`) and English (`en`) are supported. Translations are generated during authoring and checked at build and browser time; no runtime translation service is used.

## Style kits

The two starting presets are deliberately limited:

- **Soft Haze**: restrained textured field, opaque floating tile, sans-serif typography;
- **Paper**: warm flat page, serif display typography, rules instead of shadows.

They are starting points, not a theme library. The accent color, real-page preview, and writing examples must come from the owner. A confirmed token block is copied unchanged into the site, and the complete kit remains in the generated repository.

## Verification

```bash
node scripts/check-site.mjs --site /path/to/site --browser
```

The checker builds the site, validates internal assets and routes, prevents draft leakage, clicks the language switch, checks focus and overflow at desktop and mobile widths, and stores screenshots plus a JSON report in `qa/`.

## Boundaries

- Personal portfolios only; not company sites or campaign landing pages.
- No CMS, comments, analytics, custom-domain work, or languages beyond Chinese and English.
- No private screenshots, internal metrics, invented results, or copied third-party prose.
- Deployment is added only after the owner approves the repository and public boundary.

## License

[MIT](LICENSE)
