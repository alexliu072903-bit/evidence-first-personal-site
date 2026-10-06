# Site Foundation

Read this for a new site after the public boundary and site contract are clear. The foundation owns build reliability, conditional routes, publication filtering, language infrastructure, and deployment paths. It does not own the person's narrative, page composition, or visual identity.

## Main loop

```text
real material enters
→ the Agent proposes a public boundary and site contract
→ the owner confirms only uncertain or high-impact boundaries
→ the foundation produces a working preview
→ the owner reacts to the real page
→ the ledger or contract changes
→ the site regenerates and is verified
```

The canonical state is the approved evidence ledger plus the site contract. Generated pages are projections of that state, not a second source of truth.

## Public-boundary interaction

Do not ask the owner to fill schema fields one item at a time. Propose a compact ledger and call out only decisions that are ambiguous or costly to get wrong. A useful prompt is:

> I suggest describing your role and the public product direction, while excluding internal screenshots, data, and roadmap. Is that boundary correct?

After approval, map the decision into three separate content facts:

- `publication`: whether the entry appears on the site (`public` or `draft`);
- `status`: the work's current state;
- `source`: whether its underlying source is open, private, mixed, or not applicable.

Missing publication intent never defaults to public.

## Initialize

Create a JSON site contract, then run:

```bash
node scripts/init-site.mjs --contract /path/to/site-contract.json --output /path/to/empty-site
```

The contract declares identity, languages, enabled modules, an optional factual About summary, and deployment mode. The initializer refuses to overwrite a non-empty directory and does not apply a branded skin.

## Verify

After adding content and installing the generated site's dependencies, run:

```bash
node scripts/verify-site.mjs --site /path/to/site
```

Verification builds the actual artifact, requires enabled Projects or Writing modules to contain public entries, and checks that declared routes exist while disabled routes do not.

This is the v0.3 core. Browser-width, contrast, focus-by-keyboard, and complete bilingual residual checks remain required manual QA until the contract-aware full verifier is added.
