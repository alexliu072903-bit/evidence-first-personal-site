# Style Kit Confirmation

Use this after the evidence ledger is approved and before generating the final site. The style kit is a temporary decision surface: the owner confirms typography, color, imagery, spacing, and voice on one HTML page before those decisions enter the site.

## 1. Ask only what changes the result

Ask three or four concise questions:

1. Is there a reference website or screenshot the owner wants to learn structure from?
2. Should the site feel primarily light, dark, or follow the system setting?
3. Should the surface be flat, or use a restrained haze and one floating element?
4. Should project visuals lead with real screenshots or single-element illustrations?
5. What accent color belongs to this person?

If the owner cannot answer, show rendered previews of both starting presets:

- `assets/style-kit/presets/soft-haze.css`: pale textured field, opaque floating tile, sans-serif typography.
- `assets/style-kit/presets/paper.css`: warm flat page, serif display typography, rules instead of shadows.

Presets are conversation starters, not themes to select permanently.

## 2. Produce the HTML style kit

Copy `assets/style-kit/template.html` into a private working directory. Replace its token block with one preset, then replace every placeholder in the real-page preview and writing comparison with the owner's own name, capability, project, and language.

The required sections are:

1. color and semantic purpose;
2. background and floating element, light and dark;
3. illustration grammar;
4. typography values;
5. “not this / use this” writing comparison;
6. first-screen and project-entry preview using real material;
7. elements that must not carry into the site.

The HTML and final site must share one token block, delimited exactly by:

```css
/* tokens:start */
/* tokens:end */
```

Do not introduce additional hard-coded colors, type sizes, radii, or shadows in the page preview. Change the tokens instead.

## 3. Render and confirm

Open the HTML in a browser and capture a light screenshot and a dark screenshot. Show both to the owner.

- Change only what the owner identifies in each round.
- Allow at most three adjustment rounds.
- If the third round still does not converge, return to the questions and switch the starting preset.
- Do not generate the final site until the owner explicitly says the style kit is confirmed.

## 4. Apply the confirmed kit

After explicit confirmation, run:

```bash
node scripts/apply-style.mjs --kit /path/to/index.html --site /path/to/site
```

The script copies the exact token block into `src/styles/tokens.css`, copies the light and dark hero textures into `public/style/`, and archives the confirmed kit in the site's `style-kit/` directory.

Run `check-site.mjs --browser` after applying it. The style kit confirms visual direction; the built site still needs route, translation, focus, image, and overflow checks.

## Boundaries

- Use no more than two starting presets in v1.
- Replace the preset accent with a color that belongs to the owner.
- Do not bring third-party logos, another person's prose, private screenshots, or unsupported claims into the kit.
- A generated illustration explains a documented mechanism; it is not evidence that a product exists.
