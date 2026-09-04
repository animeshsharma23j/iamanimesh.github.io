# Animesh Portfolio Design System

Version 1.4 · 4 September 2026 · audited against live `styles.css` + `index.html`

## Product intent

The system presents a product designer and engineer who brings clarity to complex work. It is deliberately quiet, technical, and editorial: a near-black canvas, warm reading colour, a single restrained cyan signal, fine structural lines, and generous space around a small number of important actions.

## Foundations

### Non-negotiable type rule

**Use two typefaces only.** No third display face, serif, decorative font, or one-off logo font is permitted.

1. **Inter** is the sole reading and display face: headings, body, buttons, navigation, numbers, and product copy.
2. **System mono** is reserved for tiny technical labels, project metadata, and process markers only.

The CSS fallback lists are operating-system fallbacks for these two roles, not extra design typefaces.

### Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#030405` | Main canvas |
| `--bg-2` | `#070A0D` | Deep supporting surface |
| `--text` | `#F3EEE2` | Main headings and high-emphasis copy |
| `--muted` | `#AAA395` | Supporting copy and navigation |
| `--soft` | `#8D877D` | Captions and lower-emphasis metadata |
| `--line` | `rgba(243,238,226,0.08)` | Default divider and border |
| `--line-strong` | `rgba(243,238,226,0.15)` | Active border and stronger separation |
| `--rule` | `rgba(243,238,226,0.24)` | Case-study section rules in long-form copy |
| `--amber` / `--cyan` | `#75D5E4` | Primary action, emphasis, availability, labels, process markers |
| `--warn` | `#F0857C` | Invalid form fields and error hints only |
| `--panel` | `rgba(7,10,13,0.52)` | Translucent supporting surface |

**The system now runs a single accent colour.** `--amber` and `--cyan` both resolve to the same cyan (`#75D5E4`) in production — there is no separate gold/amber token in use anywhere in `styles.css`. `--amber` survives only as a legacy variable name; treat it as an alias for cyan, not a second hue. If a warm accent is ever reintroduced, `--amber` should be repointed to a real amber value rather than left as a synonym.

**These line values are a deliberate aesthetic choice.** They sit below the WCAG 1.4.11 3:1 minimum for UI-component boundaries (`--line` ≈1.1:1, `--line-strong` ≈1.4:1, `--rule` ≈1.9:1). Raising them to clear that floor was tried and reverted — it made the design heavier than intended. Treat the restraint as intentional; do not raise them again without being asked.

The background uses only a subtle low-contrast grid and restrained radial cyan atmosphere. These effects support hierarchy; they must never reduce text legibility or become decorative content.

### Typography

| Role | Family | Weight | Scale / behaviour |
| --- | --- | --- | --- |
| Display, headings, body, navigation, actions | **Inter only** (`--font-sans`) | **400 / 650 / 750 / 800** — these four only | Display `clamp(3rem, 4.5vw, 4.5rem)`, weight 800, line-height 0.87; body 1.55–1.62 line height |
| Technical labels and metadata | **System mono only** (`--font-mono`: ui-monospace / SF Mono / Menlo) | 750 | `--text-label`, uppercase, 0.08em tracking |

#### Small-type scale — two steps, no more

Everything at or below ~13.6px resolves to one of two tokens. Role decides which, not appearance:

| Token | Value | Use |
| --- | --- | --- |
| `--text-label` | `0.7rem` (11.2px) | Mono and/or uppercase technical labels — eyebrows, tags, table headers, case numbers, metadata |
| `--text-small` | `0.82rem` (13.1px) | All other small sans copy — buttons, links, captions, footnotes, hints |

This band previously held **23 distinct sizes across 59 declarations**, eight of them inside a 2.2px range. Differences that small are invisible on screen and read as inconsistency rather than hierarchy. 11.2px is also the floor: nothing on the site renders smaller.

**Do not add a third step here**, and do not write a literal `rem` value below `0.86rem` — use a token.

#### The eyebrow

One component, one definition. `.intro`, `.page-eyebrow`, `.case-eyebrow`, `.detail-label`, `.products-eyebrow` and `.product-kicker` share a single rule: mono, `--text-label`, weight 750, 0.08em, uppercase, cyan. Only margin varies by context. Class names are kept rather than renamed across 36 files; adding a new one means adding it to that selector list, not writing a new treatment.

### Spacing and layout

| Token / rule | Value |
| --- | --- |
| Maximum main width | `1180px` |
| Standard desktop gutter | `48px` (`calc(100% - 48px)`) |
| Mobile gutter | `16px` main shell; `12px` header at ≤560px |
| Header height | `80px` at all breakpoints (sticky, blurred) |
| Hero grid | `0.94fr / 0.8fr`, 88px gap; becomes one column at ≤900px |
| Shell padding | `96px` top, `168px` bottom (desktop) |
| Case-detail rhythm | `72px` vertical padding per section, `52px` at ≤900px |
| Corner treatment | Intended scale: `0` buttons and primary surfaces (square); `8px` hover chips / accent icons; `16px` cards and portrait imagery; `999px` pills (tag lists, availability). Eighteen radius values are currently live — see *Known drift* |

## Components

### Navigation

- Sticky, blurred header with brand at left and portfolio links at right.
- Links use muted text by default, cyan on hover and keyboard focus.
- The active route has a low-opacity cyan outlined chip treatment.
- Contact remains an outlined utility action.

### Buttons and actions

| Component | Resting state | Interaction |
| --- | --- | --- |
| Primary action | Cyan fill, dark text, 46px minimum height, square corners | Lighter cyan fill (`#A9EDF5`) + dark text (`#0B1B1D`) + 2px upward movement |
| Secondary action | Transparent dark surface, strong hairline border | Cyan border and text |
| Resume / utility action | Translucent cyan border (52% alpha), text colour | Solid cyan border and text |

### Recognition

- Used on `about.html` (not a homepage "proof rail" — that pattern is no longer part of any live page; its CSS is now dead weight in `styles.css`).
- Cyan mono eyebrow ("Recognition") followed by a stat grid: high-emphasis value in `--text`, explanatory caption in `--muted`.
- A masked, auto-scrolling row of press/partner marks (Microsoft, Nokia, Windows Central) sits below the stats, followed by a screenshot gallery.
- Respects `prefers-reduced-motion` by stopping the marquee.

### Case-study structure

1. Eyebrow: project number, domain, platform.
2. One-sentence product proposition.
3. Role and focus metadata.
4. Repeating evidence sections: Context → Design choices → Selected surfaces / Evidence → Reflection.
5. `case-facts` use a thin-divider list: uppercase mini-heading, then concise explanation.
6. Public-sector work uses a clear portfolio-not-service note and excludes confidential content.

### Visual surfaces

- Ambient grid and tesseract are decorative and correctly `aria-hidden`.
- The hero process diagram (`.thinking-diagram`) is **not** currently hidden — it carries `aria-label="Design process diagram"` and exposes its step labels. It also renders live text at 9.3px, below the 11px floor. It is a generic Empathize → Define → Ideate → Prototype → Test diagram, which the *Do not* list below prohibits. Resolve rather than document.
- Product screenshots are real image assets with descriptive alternative text.
- Fine rules create hierarchy before cards or large fills are introduced.

## Responsive rules

| Breakpoint | Behaviour |
| --- | --- |
| ≤900px | Hero becomes one column; page grids simplify; background object is moved and reduced in opacity. |
| ≤560px | Header uses compressed type and gaps; actions wrap; case-detail grid becomes one column; project/screenshot galleries become two columns. |
| All sizes | Content uses `min-width: 0`, bounded widths, and overflow-safe text wrapping. No horizontal scrolling is permitted. |

## Accessibility and motion

- Semantic landmarks, descriptive navigation label, and real heading hierarchy are required.
- Decorative space artwork must remain `aria-hidden`.
- Image content requires meaningful `alt` text.
- **Keyboard focus is a single global rule and must never be removed.** `styles.css` defines one zero-specificity source of truth:

  ```css
  :where(a, button, summary, input, select, textarea, [tabindex]):focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 3px;
  }
  ```

  A component may override the ring **colour** — controls with a cyan fill (`.skip-link`, `.action-primary`, `.product-button.primary`, the mobile menu's active link) set a dark ring, because cyan on cyan is invisible. No component may set `outline: 0` or `outline: none` on a focus state. Merging `:focus-visible` into a `:hover` rule is not a focus indicator: hover styling is not keyboard feedback.
- `prefers-reduced-motion: reduce` removes animation and transitions.
- Never encode a status with colour alone; labels, copy, and structure carry the meaning.

## Do / do not

**Do:** lead with one clear task, use proof sparingly, keep copy direct, preserve generous whitespace, and show real product evidence.

**Do not:** introduce glossy cards, large gradients, rounded-everything UI, generic process diagrams without project evidence, fake metrics, or decorative effects that compete with content.

## Known drift

Measured against live `styles.css` on 4 September 2026. These are gaps between the system as specified above and the system as built. Recorded so the spec stays honest — this section should shrink, not grow.

### Display sizes

About 40 near-unique `clamp()` expressions carry the headings — `clamp(3.3rem, 7vw, 7rem)`, `clamp(3.4rem, 8vw, 7.2rem)`, `clamp(3.8rem, 7vw, 6.4rem)` and so on, mostly one use each. This is the remaining half of the type finding. It is deliberately untouched: display type carries the site's character, and consolidating it onto a modular ramp changes every heading on every page, which wants a designer's eye rather than a mechanical pass.

The small tier, the weights and the eyebrow were resolved in v1.3.

### Corner radii

Eighteen values are live where four are intended: `0`, `2px`, `6px`, `8px`, `10px`, `14px`, `15px`, `16px`, `18px`, `20px`, `24px`, `25px`, `28px`, `30px`, `32px`, `41px`, `50%`, `999px`.

### Spacing

No modular scale is in force. Padding and margin populate effectively every even value from 4px to 34px (22 ×14, 24 ×19, 26 ×11, 28 ×21, 30 ×9, 32 ×19, 34 ×10). Target: a 4px beat — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.

### Accent token

One colour, three spellings: `var(--amber)` ×30, `var(--cyan)` ×61, and hard-coded `#75d5e4` / `rgba(117,213,228,…)` ×32. About a quarter of accent references bypass the token, so repointing the accent means editing literals. Migrate to `--cyan` and retire `--amber`.

Separately, cyan currently does seven jobs at once — primary fill, every eyebrow, hover/focus, the availability dot, case numbering, mono metadata, and the FAQ `+`. Reserve the solid fill for primary actions so it retains isolation value.

### Dead CSS

Roughly 36 classes are defined and never used in any page, including the whole `proof-rail` / `proof-items` / `proof-label` / `hero-proof` family already noted under *Recognition*, plus `case-back`, `split-panel`, `principles`, `section-heading`, `contact-stack`, `swap-button`, `temperature-*`, `calculator-cta` and `calculator-submit`.

`styles.css` also carries a complete second `.products-page` theme — light background `#f5f6f8`, `#151820` text, `#e0e3e8` borders, white card fills, drop shadows, and a red `#ed3438` accent — that is fully overridden by a later dark block. It does not render, but it contradicts the single-accent rule above and should be deleted rather than left to confuse the next reader.

### Case-study template

Only `income-tax.html` uses `signal-tag` and `case-next`. `case-back` is styled and used nowhere. Depth ranges from 3,078 words (Income Tax) to 381 (UnitX) with no signal of that difference on `case-studies.html`.

## Assets

- Exact technical board: `assets/animesh-design-system.png` — regenerated 1 September 2026 from live `styles.css` + `index.html` values (this document's source of truth).
- `assets/animesh-design-system.svg` still shows the old amber-primary palette and a text-overflow bug; treat it as superseded by the PNG above and do not hand-edit it further — regenerate it (or drop it) instead.
- Concept-only visual mood board (not a typography source): `assets/animesh-design-system-moodboard.png`
- Product evidence: `case-studies/assets/unitx/`
