# Astro Foundation

Use Astro with static output when the site is primarily a public archive of projects, writing, and background information. It is easy to host on GitHub Pages and does not require a database or runtime server.

## Minimum Structure

```text
src/
  content/
    projects/*.md
    writing/*.md
  content.config.ts
  layouts/BaseLayout.astro
  pages/
    index.astro
    about.astro
    projects/index.astro
    projects/[id].astro
    writing/index.astro
    writing/[id].astro
  styles/global.css
public/
  project-assets/
  profile/
.github/workflows/deploy.yml
astro.config.mjs
```

Use content collections for projects and writing. Keep frontmatter validation strict enough to prevent accidental omission of public status, source visibility, order, image path, and alt text.

## Project Contract

The exact vocabulary can change, but the model needs these concepts:

```yaml
title: string
description: one-sentence public summary
year: number
category: a small, site-specific group
status: current public state
source: open, private, or another truthful visibility label
order: number
image: local public asset path
imageAlt: what the visitor can see in the image
problem: specific situation
contribution: what was made or changed
current: honest present state
links:
  - label: human-readable action
    url: public URL
```

For a concise first read, support an optional `brief` field of two or three labeled rows. It is useful for `Situation`, `Use`, `What remains`, or equivalents. The labels should describe actual information, not fit a decorative universal formula.

## Writing Contract

```yaml
title: string
description: one-sentence reason to read
publishedAt: ISO date
draft: false
tags: []
readTime: optional positive number
source:
  label: original publisher or author
  url: public URL
  note: precise relationship to original
```

Build list pages from non-draft entries, sort projects by a deliberate order and writing by publication date, and generate static detail pages from collection IDs.

## GitHub Pages

Set Astro to `output: 'static'`. Configure `site` and `base` for the intended deployment URL. For a project site at `https://ACCOUNT.github.io/REPOSITORY/`, the base is `/REPOSITORY`; for a user site it is normally `/`.

Use the official Astro GitHub Action and `actions/deploy-pages`. A push to the agreed branch may deploy automatically, but deployment configuration is not proof that the public version is live. After a push, verify the expected route and a changed piece of public content.

Never alter an existing custom domain or DNS just because a GitHub Pages deployment is available.
