# Evidence-First Personal Site

**English | [中文](README.zh-CN.md)**

A skill for AI coding agents (Claude Code, Codex, and others) that builds or revises a personal website as a durable public archive. The site is neither a long resume nor a page of self-description. Visitors should quickly see three things: what you have made, what they can verify, and what state each piece is in.

## What it solves

Most personal sites lack boundaries more than they lack design:

- Many projects, but visitors cannot tell which are live, which have ended, and which have private source.
- Long passages of "I am good at X" with no evidence next to them.
- A home page that tries to retell everything, so it is neither an index nor a portfolio.
- Large headlines, glass cards, and AI-flavored copy that cover the real material.
- A site that is hard to publish and update, or that exposes work that should not be public.
- A redesign that starts from a stale local copy, or that drops what the owner had already decided.

The skill gives a default method: inventory what can be public, state two or three things you mainly do and put different evidence under each, write in a plain voice, and check state, images, narrow screens, language, and GitHub Pages before publishing.

## Who it is for

- People with projects, writing, open-source repositories, research, or work history who want an independent site.
- People who want to keep a personal archive on GitHub Pages.
- People who want an agent to help build the site without inventing experience or leaning on generic AI visuals.
- People who already have a site and feel it is "almost right" but cannot say what is off.

It is not for company sites, marketing landing pages, or anything that needs login, a database, or payments.

## What you get

A static Astro site by default:

```text
Home        An index that states what you mainly do, with evidence under each
Projects    Projects, their state, source visibility, and public evidence
Writing     Articles, dates, provenance, and a reading entry
About       A factual resume page
```

You do not need all four. Drop Writing if you have no public writing; a researcher can use Publications instead of Projects. The rule is to keep real material and not to fill space with empty sections.

## Install and use

Clone the repository into your agent's skills directory.

For Claude Code:

```bash
git clone https://github.com/alexliu072903-bit/evidence-first-personal-site ~/.claude/skills/evidence-first-personal-site
```

For Codex:

```bash
git clone https://github.com/alexliu072903-bit/evidence-first-personal-site ~/.codex/skills/evidence-first-personal-site
```

Then say what you want:

```text
Build me a personal site from my resume, project repositories, and two articles.
Chinese first, public work strictly separate from internal work, deploy to GitHub Pages.
```

or, for an existing site:

```text
My site feels almost right but I cannot say what is off. Audit it and tell me what you would change before editing.
```

## The minimum you need to provide

A usable first version needs only:

- A public bio or resume.
- At least two projects, work samples, or research outputs.
- One piece of inspectable evidence per public project: a product link, repository, article, screenshot, or demo.
- A public way to contact you.

Articles, photos, a PDF resume, awards, and full case studies are optional. Without material, the skill suggests dropping the section instead of inventing content.

## How it keeps content honest

Every statement is sorted into one of three kinds:

| Kind | Examples | Handling |
| --- | --- | --- |
| Public fact | Role, dates, public repository, published article | Can be placed on the page directly |
| Permitted interpretation | Your specific contribution to a project | Stated within the scope you confirm |
| Private or unverified | Internal roadmap, unreleased feature, internal numbers, unclear product state | Not published, or labeled unknown or historical |

So it will not turn "took part in" into "led a system", will not present private source as open source, and will not show an employer's internal figures unless you confirm they are public. Numbers appear only with a source and a date.

## Voice

The skill writes in a plain, specific voice: say what the visitor can do or see, keep titles short, one sentence for one thing, and let evidence carry the praise. It removes self-endorsement, intensifier words, and stacked "not X but Y" lines. See `references/voice.md` for a table of patterns with replacements.

## Visual options

The skill gives a floor for reading and trust, not a brand:

- Leave the first screen for real information.
- Screenshots, public repositories, and articles are the main visual evidence.
- Use a clear hierarchy, stable ratios, and plain status labels.
- Avoid translucent glass cards, gradient text, template card grids, and generic AI copy.

When you have no visual preference, the default is **soft haze**: evidence sits on opaque white tiles, and a very pale haze sits behind the tiles. It will not suit everyone. It is meant as a reasonable starting point for someone with no stronger idea, and it can be replaced as a whole. Three haze SVGs and the parameters are included; see `references/default-style.md`. A plain, flat system is the alternative in `references/visual-and-qa.md`.

## What is inside

```text
SKILL.md
  Main flow: evidence inventory, revising an existing site, capabilities and
  evidence, site shape, build order, publishing boundary

references/evidence.md
  Intake for projects, writing, work history, and public boundaries

references/proof.md
  Matching capabilities to evidence, rules for numbers, public-reaction
  screenshots, and employer work

references/voice.md
  The voice, with a before-and-after pattern table

references/existing-site.md
  Revising a site: sync with live first, diagnose, learn structure not content

references/bilingual.md
  Content schema, leaf-node translation, leftover checks

references/astro-foundation.md
  Astro content collections, routes, and GitHub Pages constraints

references/visual-and-qa.md
  The plain visual system, page checks, responsive, accessibility, QA

references/default-style.md + assets/haze/
  The default soft-haze style: parameters, assets, and how to replace it
```

## Checks before publishing

Before anything goes public, the skill asks you to confirm at least:

1. The production build passes and drafts are absent from public routes.
2. Each project's current state and source visibility are accurate.
3. Local images and external links work; keyboard focus is visible with the real Tab key; text contrast is measured; there is no horizontal overflow at several widths.
4. For a bilingual site, switching language leaves no leftover text.
5. You approved the exact repository, domain, and content boundary.
6. After deployment, the public page really contains the new content.

## Principle

> Let the material say who you are, not the adjectives.

See [SKILL.md](./SKILL.md) for the full rules.

## License

[MIT](./LICENSE)
