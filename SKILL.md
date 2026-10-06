---
name: evidence-first-personal-site
description: Build or redesign a Chinese, English, or bilingual personal portfolio as a static Astro site. Use when creating a personal site from projects, writing, photos, and resume evidence, or when migrating an existing personal site. The workflow confirms an HTML style kit before generating the final site; do not use for company sites or marketing landing pages.
---

# Evidence-First Personal Site

Create a durable personal site in one path: collect approved material, confirm an HTML style kit, generate the site, verify it, then deploy only with explicit approval.

## 1. Collect material and public boundaries

Read [evidence](references/evidence.md). Build a private ledger from the owner's projects, writing, photos, resume, public links, and company work. Propose obvious classifications yourself; ask only where publication or contribution boundaries are ambiguous. Do not invent facts, metrics, outcomes, or testimonials.

- For a new site, read [new site](references/new-site.md).
- For an existing site, read [existing site](references/existing-site.md) and run `inventory-site.mjs` before rewriting content.
- For copy, read [voice](references/voice.md).

## 2. Confirm the style kit

Read [style kit](references/style-kit.md). Ask three or four visual questions, then create a private HTML style kit from `assets/style-kit/template.html`. Use Soft Haze or Paper only as a starting point. Replace the accent and all sample copy with the owner's material.

Render light and dark screenshots. Iterate only on requested parts, for at most three rounds. Do not generate the final site until the owner explicitly says the style kit is confirmed.

## 3. Generate the site

Run:

```bash
node scripts/new-site.mjs --output <dir> --name <name> \
  --languages zh-CN,en --modules projects,writing,about \
  --site https://USER.github.io --base /REPO
```

Complete `src/site.config.mjs` and content using the approved ledger. Each of the 2–3 homepage capabilities must point to a different public project. For bilingual sites, read [bilingual](references/bilingual.md); Agent-generated translations must be complete and listed for owner review.

After style confirmation, run:

```bash
node scripts/apply-style.mjs --kit <confirmed-kit.html> --site <dir>
```

## 4. Check

Read [QA](references/qa.md), then run:

```bash
node scripts/check-site.mjs --site <dir> --browser
```

Fix build, route, asset, draft, translation, focus, overflow, and console failures. Use `--external` when the environment permits external HEAD checks. Keep the report and screenshots in the PR.

## 5. Deploy

Only after the owner approves the exact repository and public boundary, rerun `new-site.mjs` with `--deploy` or add the template deployment workflow. Verify the public route after GitHub Pages finishes. Do not modify custom domains or DNS.

## Boundaries

- Only `zh-CN` and `en` are supported.
- No CMS, comments, analytics, custom-domain work, or theme library.
- Do not publish private screenshots, raw research notes, internal metrics, or another person's copy.
- Stop after the requested site passes verification; v1 does not expand beyond infrastructure and style-kit confirmation.
