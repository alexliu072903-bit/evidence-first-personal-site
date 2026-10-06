# New Site Workflow

## 1. Collect

Read [evidence](evidence.md). Create a private ledger and agree on the public boundary before generating content. Collect original files rather than screenshots of documents when possible.

Confirm:

- display name and one-line orientation;
- primary language and whether the site is bilingual;
- two or three capabilities, each with a different public project;
- project state, source visibility, images, links, and limits;
- writing, About facts, contact, photo, and approved resume;
- exact GitHub Pages repository only when deployment is requested.

## 2. Initialize

Run `new-site.mjs` into an empty directory. Enable only modules with real content. Do not pass `--deploy` yet.

Complete the generated `src/site.config.mjs`, then add Markdown or MDX content. `publication` is required and never defaults to public. Keep drafts in source without generated public routes.

## 3. Prepare translations

For bilingual sites, generate the summary translation while writing each entry. Put translated long bodies under `src/content/translations/<collection>/<id>.md`, or provide a factual `translation.bodyNote` saying the full note is available only in the primary language.

List translated titles, summaries, labels, links, image alt text, and body availability for the owner to sample before delivery.

## 4. Confirm style

Follow [style kit](style-kit.md). The HTML style kit must use the owner's name, one real capability, and one real project. Apply it only after explicit confirmation.

## 5. Verify and deploy

Run `check-site.mjs --browser`. Fix every blocking issue and inspect the screenshots. After the owner approves the repository and public boundary, add the deployment workflow and push. Wait for Pages, then verify a changed route and one public asset.
