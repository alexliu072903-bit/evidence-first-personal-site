---
name: evidence-first-personal-site
description: Build or revise a durable personal portfolio site from a person's real projects, writing, and resume evidence. Use when creating, redesigning, or auditing a personal website, portfolio, resume site, or GitHub Pages profile, including bilingual sites and work done at a company; do not use for marketing landing pages or company sites.
---

# Evidence-First Personal Site

Build a personal site that makes a visitor understand three things quickly: what this person has made, what they have thought through, and the factual context behind the work. The site should create an impression through verifiable material, not self-descriptive claims.

The default delivery is a static Astro site with four routes: `/`, `/projects/`, `/writing/`, and `/about/`. Keep that structure only when it fits the person's material. A person with no public writing does not need a Writing navigation item; a researcher may need Publications instead of Projects.

## Main Loop

```text
real material enters
→ propose a public boundary and site contract
→ the owner confirms only uncertain or high-impact boundaries
→ build a working preview
→ the owner reacts to the real page
→ update the ledger or contract
→ regenerate and verify
```

The approved evidence ledger and site contract are the source of truth. Pages are generated projections. Do not turn schema fields into a questionnaire: propose the obvious classifications yourself and ask one focused question only where the boundary is ambiguous or costly to get wrong.

## Start With Evidence

Before choosing layout or writing copy, create a private source ledger. Read [the evidence guide](references/evidence.md) and separate each statement into:

- **Public fact:** employer, role, date, publication, public URL, repository, product that can be visited.
- **Permitted interpretation:** the person's contribution or product decision, stated narrowly and only with their approval.
- **Private or unverified:** internal roadmap, metrics, unpublished feature, client data, uncertain status. Do not publish it.

Ask only for material that is necessary to make an honest first version. A workable minimum is: a short factual bio, two or more projects or work samples, one public link per public project where possible, and a contact method. Do not invent metrics, dates, titles, outcomes, testimonials, or technical implementation details.

## Revising an Existing Site

If a site already exists, do these before designing anything. Read [the existing-site guide](references/existing-site.md).

1. **Compare the working copy with what is live.** A local folder is often behind the deployed branch. Edit a copy of the newest version, never the live directory.
2. **Diagnose why it feels "almost right".** Name the specific gaps (what a visitor cannot tell in the first screen, which claims have no evidence next to them) before proposing a redesign.
3. **Learn structure from reference sites, not content.** Take what they make clear, such as strengths stated in the first screen, and leave their wording and projects.

## Lead With What the Person Mainly Does

Home works best when it states two or three things the person mainly does and puts a different piece of public evidence under each one. Read [the proof guide](references/proof.md) for the rules:

- One piece of evidence supports one capability. If two projects tell the same story, keep the stronger one.
- If a capability has no evidence, say so to the owner. The honest options are to build a project that fills the gap, or to drop the claim. Do not stretch an unrelated project over it.
- Numbers appear only with a source and a date, and only the two or three most persuasive.

## Choose the Site Shape

Use the smallest information architecture that lets visitors scan rather than decode.

| Surface | Job | Default contents |
| --- | --- | --- |
| Home | Index, not a compressed resume | One-line orientation; selected projects; latest writing; optional factual current/past role summary |
| Projects | Evidence catalogue | Project image or public artifact, status, source visibility, plain-language summary, link |
| Project detail | Explain one thing clearly | Situation, what was made or changed, present status, public evidence; optional deeper note |
| Writing | Reading entry point | One featured essay with date, description, provenance, and a reading link |
| About | Factual resume page | Name/contact, education, internships or employment, awards, skills, PDF resume when supplied |

Do not force every person into this table. Remove empty sections rather than adding placeholder cards. Keep a private case study private; a precise public boundary is stronger than vague, impressive-sounding detail.

For a new build or a migration, read [the Astro foundation](references/astro-foundation.md). It contains the content model, route contracts, and GitHub Pages requirements.

For a new site whose public boundary and modules are already clear, read [the site foundation](references/site-foundation.md) and initialize it from the approved site contract. The foundation deliberately carries no branded skin or fixed homepage composition.

## Build in This Order

1. **Content contract:** define project and writing frontmatter before writing pages. Model publication, status, and source visibility as separate facts rather than burying them in prose. Publication intent must be explicit; missing intent never defaults to public.
2. **Reading path:** implement the route that contains the strongest evidence first, usually Projects. On an individual project page, put a compact factual brief before long prose.
3. **Index pages:** make Home an index of real routes. It should help a visitor choose where to go, not repeat every project description.
4. **About:** use factual modules and short descriptions. Avoid personality claims such as “visionary”, “rigorous”, or “excellent intuition”.
5. **Visual system:** ask whether the owner has a visual preference. If so, follow it. If not, offer the default in [default style](references/default-style.md) (a soft haze behind solid evidence tiles) and say that it is a default, not a requirement. The plain system in [visual and QA](references/visual-and-qa.md) is the alternative. Images must be evidence, personal context, or a meaningful reading visual; they are not filler.
6. **Publish:** build locally, inspect the affected desktop and narrow layouts, then deploy only after the user approves the target repository and public boundary.

## Content Rules

- Write project summaries as `specific situation -> what changed or was made -> current state`, not feature lists or generic benefits.
- Place source status near the project title: for example `Open source`, `Private source`, `Historical`, or `Experimental`. Use words that are factually true for this project.
- For company work, show the contribution at an agreed level of abstraction. A role and a non-sensitive scope are usually enough. Do not expose internal screenshots or future plans merely to make a page feel substantial.
- Preserve provenance for adapted writing. Link the original when it is public and label the relationship plainly.
- Use the visitor's reading language for body copy. Keep company names, role titles, product names, and technical terms in their native form when that improves accuracy. Do not create awkward mixed-language sentences by default.
- One decisive image is better than a repeated gallery. Do not reuse the same photo across pages unless repetition is intentionally part of the narrative.
- Write in the voice described in [voice](references/voice.md): say what the visitor can do or see, keep titles short, one sentence for one thing, and never praise the site's own material.
- For a bilingual site, put the second language in the content schema and check it, as described in [bilingual](references/bilingual.md). A stub page in the second language is worse than none.
- Screenshots of social posts, chats, or dashboards show only the owner's own content, cropped to the text and the figures. Remove other people's content, account details, and status bars.

## Definition of Done

Read [visual and QA](references/visual-and-qa.md) before declaring success. At minimum, verify the production build, route generation, no broken local assets, status/source labels, keyboard focus, and the narrow layout. Do not claim a site is public until the deployment target returns the new content.

## Boundaries

- This is not a résumé-writing skill that fabricates a polished narrative from sparse material.
- This is not a generic AI-themed landing-page recipe. Do not use translucent glass cards, gradient text, neon, particle fields, stock “future of AI” imagery, invented metrics, or exaggerated founder language as substitutes for evidence. A pale haze behind solid evidence tiles is allowed and is the default option (see [default style](references/default-style.md)).
- Do not publish, move domains, create repositories, or change public visibility without the user's explicit approval of the exact target.
