# Visual System and QA

## Default Visual System

This is a floor, not a brand identity. Adapt it to the person's material while retaining the constraints that make the site readable.

- Use one readable sans-serif family with a native-language fallback.
- Use a neutral light background, dark ink text, one muted metadata color, and one restrained accent with a semantic role. Do not use the accent merely as decoration.
- Keep body content between roughly 45–68 characters per line. Use a reading column for prose and a somewhat wider column for project evidence.
- Put the first meaningful content close to the navigation. A title is not a hero by default; compact route titles around `2–3rem` usually expose more useful material above the fold.
- Use simple rules, tonal surfaces, and asymmetric image sizes for hierarchy. Avoid stacked cards, wide soft shadows, glass effects, gradient text, decorative blobs, and generic “AI” imagery.
- Product screenshots must be legible. Use a stable aspect ratio, `object-fit`, useful `alt`, and a modest border rather than placing them in decorative frames.
- Personal photos need a page-specific reason: a living context on Home, a personal moment on About, or a carefully chosen cover on Writing. Keep one photo unique when possible.

## Page Checks

### Home

- Does the first viewport tell a visitor what kinds of material exist, without repeating full case studies?
- Are the visible entries links to Projects, Writing, and optional About rather than static summaries?
- If it includes roles, are they factual and short?

### Projects

- Can a visitor understand each item from the image, title, status, source label, and one paragraph?
- Does a project detail page begin with a useful brief before long prose?
- Are private source, historical state, and uncertainty plainly stated?

### Writing

- Is the featured article led by title, date, description, and provenance rather than an oversized claim?
- Does the article page reserve visual space for a diagram only when the diagram explains the writing?

### About

- Is it readable as a resume without turning into a self-description page?
- Are role type, employer, dates, education, awards, and skills all direct and correct?
- Is each bilingual label intentional rather than accidental mixed-language copy?

## Technical and Visual Verification

Before publishing, run the project's production build and a whitespace check such as `git diff --check`. Then inspect the changed routes at desktop width and a narrow width.

Check:

1. Every local image loads and its crop preserves the subject.
2. Text does not overflow, especially long names, titles, dates, and navigation.
3. The keyboard focus indicator is visible and navigation has an accessible label.
4. Reduced-motion preferences leave content visible and remove nonessential transitions.
5. Draft content is absent from generated routes.
6. All external links have an honest label; links opening a new tab use the appropriate safe relationship attributes.
7. The final public route contains the expected new content after deployment.

Do not “fix” a page by making headings larger or by adding a generic hero. First remove unnecessary copy, reduce top padding, surface the strongest evidence, and make the reading hierarchy explicit.
