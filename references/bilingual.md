# Bilingual Sites

This Skill supports Chinese (`zh-CN`) and English (`en`) only. A site may be Chinese-only, English-only, or bilingual. Do not add generic locale routing or accept other language codes.

## Structure

- Keep the Chinese-English switch client-side only if the site is static and small; keep content for both languages in the same source.
- Put the second language in the content schema under `translations.en` or `translations.zh-CN`, depending on the primary language. A public bilingual entry with no complete block for the enabled second language should fail verification rather than show a stub.
- A page with a single-language long note should say so once ("The full note is currently available in Chinese only") and still show the overview in both languages.

## Implementation

- Put the translation attribute on leaf nodes. A script that replaces `textContent` on a parent erases its children.
- Provide attributes for non-text content: `aria-label`, `alt`, `href`, and page title/description.
- Store the language in `localStorage` and accept a `?lang=` parameter. Preserve the language across internal links.

## QA

- Switch to the second language on every route and scan the main content for characters of the first language. Names and institutions may stay; everything else should be translated.
- Check that numbers and approximation words are translated too ("about 50,000", not "约 5 万").
- Check the document `lang`, the title, and the meta description.
