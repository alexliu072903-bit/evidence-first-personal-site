# Default Style: Soft Haze

Use this when the owner has no visual preference. Say that it is a default and that it can be replaced. It will not suit everyone; it is a reasonable choice for someone with no stronger idea.

## The idea

Evidence sits on solid white tiles, and a pale haze sits behind the tiles. The haze gives the page a calm, slightly warm look; the tile keeps the evidence legible.

## Parts

- **Haze:** the three SVGs in `assets/haze/` (`haze-cyan`, `haze-violet`, `haze-warm`), each 1000x400, three soft radial gradients. Use as `background: #f4f7f8 url(...) center / cover` behind a header band, a feature block, or an evidence panel. Never behind running text.
- **Tile:** `#ffffff`, radius 18-22px, shadow `0 24px 60px rgba(0,80,102,.14), 0 2px 6px rgba(0,80,102,.06)`. Opaque. No blur, no transparency.
- **Cards for lists:** white, 1px border in a pale line color, radius 16px, a faint shadow `0 10px 30px rgba(0,80,102,.06)`.
- **Accent:** one muted accent for labels and links. Check its contrast on the tile; a pale accent that passes on the page can fail on white.
- **Dark mode:** use the dark haze and a dark tile (`#2a2e33`); keep the structure.
- **Pass the base path to the haze** with an inline CSS variable (`style="--haze: url(...)"`) when the site is served under a sub-path, because a relative `url()` in a global stylesheet will not resolve.

## Where it works

Page header bands, one feature block per page, evidence tiles for screenshots and numbers, project list images. Use two or three hues across the site, rotating by position.

## Replacing it

Change the hues, drop the haze and keep the tiles on a flat background, or use a different system entirely. What should stay: evidence is opaque and legible, and decoration never covers text.

## Do not

Apply the haze to everything. Put text on it without a tile. Stack more than one haze per screen. Use it to hide thin content.
