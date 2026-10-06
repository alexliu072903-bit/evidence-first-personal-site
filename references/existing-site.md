# Existing Site Workflow

## 1. Capture the live source

Do not trust a stale local folder. Clone or fetch the deployed repository into a scratch location and compare its commit with any working copy. Do not edit the live checkout.

Run:

```bash
node scripts/inventory-site.mjs --url <old-site> --out <private-inventory.json>
```

The inventory is raw material, not approved public content. Keep it private.

## 2. Move the old site into an evidence ledger

Read [evidence](evidence.md). For each old page, project, image, number, and link, decide whether to publish, simplify, hold, or omit. Check current state and public boundary again; existing public text may be stale or overclaiming.

Record which facts came from the live site, repository, resume, or direct owner confirmation. Do not silently carry old claims into the new template.

## 3. Preserve decisions, not markup

Read existing product, design, and content notes. Preserve confirmed public commitments and user-recognizable routes where useful. Extract structural lessons from reference sites, not their copy or visual identity.

Initialize a fresh v1 template in a new directory. Migrate approved content into the new schema. Keep the old site and the new site side by side for comparison; do not overwrite the old checkout.

## 4. Confirm style and compare

Create an HTML style kit using the migrated material. After confirmation, apply it and run browser checks. Capture old and new homepage screenshots at the same width, and report what changed, what was removed, and why.

Do not publish or redirect the old site without explicit approval of the repository and public boundary.
