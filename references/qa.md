# Site QA

## Required command

```bash
node scripts/check-site.mjs --site <dir> --browser
```

Use `--external` when outbound network access is available and external HEAD requests are appropriate.

## Content and route checks

- Every capability references a different public project.
- Draft entries produce no route.
- Status and source visibility are visible near every project title.
- Private or historical work does not imply public access.
- Facts have a source and date in `factsNote`.
- Adapted writing preserves provenance.
- Disabled modules have no page, navigation item, or RSS route.

## Browser checks

- Every generated route loads at 1440 and 375 px without console errors.
- No horizontal overflow.
- Every image loads and preserves its subject.
- Real Tab navigation produces a visible focus indicator.
- The language switch updates text, `alt`, `aria-label`, links, image sources, title, and metadata.
- Internal links preserve the selected secondary language.
- Secondary pages contain no primary-language residue except the approved language-independent name.
- Reduced motion leaves all content visible.

## Visual review

Automation cannot decide whether the hierarchy is specific, the image is meaningful, or the site feels like the owner. Inspect the generated screenshots after the technical report passes.

- The first screen states who the person is and what a visitor can inspect.
- Body text remains within the confirmed measure and line height.
- One decisive image is better than a repeated gallery.
- Screenshots are evidence; generated illustrations are labelled explanations.
- The style matches the confirmed HTML kit. Do not repair a weak page by adding generic sections or larger headings.

## Delivery

Keep `qa/check-report.json` and screenshots in the PR. For an existing site, include old and new homepage screenshots at the same width. Do not call the site public until the deployed route returns the expected content.
