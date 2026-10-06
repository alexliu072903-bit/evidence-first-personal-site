# Chinese–English Sites

Only `zh-CN` and `en` are supported. Either may be primary; the first language in `site.config.mjs` is primary.

## Authoring

- A language-independent string is allowed only for names, URLs, identifiers, or terms that genuinely remain the same.
- Visitor-facing configuration text uses `{ 'zh-CN': '…', en: '…' }`.
- Project and Writing frontmatter stores primary text at the top level and secondary summaries under `translation`.
- Status and source labels come from the template dictionary and are not written per project.
- Long secondary bodies live under `src/content/translations/<collection>/<id>.md`.
- A bilingual entry with a primary body must have either a translated body or `translation.bodyNote`; otherwise the build fails.

The Agent creates translations while writing content. Do not call a runtime translation service.

## Runtime

The template renders primary text plus `data-t` attributes on leaf nodes. Translated `alt`, `aria-label`, `href`, and `src` values use matching `data-t-*` attributes. Long bodies use `data-lang-block="primary|secondary"`.

The client script chooses language in this order:

1. `?lang=` parameter;
2. saved `localStorage` value;
3. browser language when supported;
4. primary language.

It updates text, attributes, title, metadata, body blocks, and internal links without writing language-specific logic into page components.

## Owner review

Before delivery, list every translated title, description, navigation label, link label, image alt text, and body availability note. Ask the owner to sample the most public or sensitive claims. A translation must make the same claim as the primary text; it is not a shorter promotional rewrite.

Run `check-site.mjs --browser`. It clicks the real switch on every route, checks title and links, and scans the secondary view for primary-language residue, excluding the language-independent site name.
