# Animesh Portfolio Design System

Version 2.2 · 4 September 2026 · audited against live `styles.css` + `index.html`

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

**One palette, no per-section forks.** The six product pages previously ran their own colours — canvas `#08090B`, headings `#F8F8F8`, body `rgba(238,240,244,…)` — which read as a cooler variant of the site. They now use `--bg`, `--text`, `--muted` and `--soft` like everywhere else. No page type gets its own greys.

**The system now runs a single accent colour.** `--amber` and `--cyan` both resolve to the same cyan (`#75D5E4`) in production — there is no separate gold/amber token in use anywhere in `styles.css`. `--amber` survives only as a legacy variable name; treat it as an alias for cyan, not a second hue. If a warm accent is ever reintroduced, `--amber` should be repointed to a real amber value rather than left as a synonym.

**These line values are a deliberate aesthetic choice.** They sit below the WCAG 1.4.11 3:1 minimum for UI-component boundaries (`--line` ≈1.1:1, `--line-strong` ≈1.4:1, `--rule` ≈1.9:1). Raising them to clear that floor was tried and reverted — it made the design heavier than intended. Treat the restraint as intentional; do not raise them again without being asked.

The background uses only a subtle low-contrast grid and restrained radial cyan atmosphere. These effects support hierarchy; they must never reduce text legibility or become decorative content.

### Typography

| Role | Family | Weight | Scale / behaviour |
| --- | --- | --- | --- |
| Display, headings, body, navigation, actions | **Inter only** (`--font-sans`) | **400 / 650 / 750 / 800** — these four only | `h1` = `--headline-size`, weight 800, line-height 0.87; body 1.55–1.62 line height |
| Technical labels and metadata | **System mono only** (`--font-mono`: ui-monospace / SF Mono / Menlo) | 750 | `--text-label`, uppercase, 0.08em tracking |

#### Headline size — one value, whole site

**`--headline-size`: `4.5rem` (72px), dropping to `3rem` (48px) at ≤900px.** Every `h1` on every page resolves to this token; no page type gets its own.

Before this, six different h1 sizes were live at 1440px — home and products at 64.8px, product pages at 72px, the case-study index and all support/privacy/404 pages at 89.28px, case-study detail at 100.8px, and the calculators at 115.2px. Each page type had picked up its own `clamp()` at a different time and they were never compared, so a privacy policy outranked the homepage and the ranking inverted at mobile. It read as accidental because it was.

The mobile value is set by redefining the token inside the `≤900px` block, so a single line moves the whole site. **Do not add a per-page `h1` font-size.**

#### The full heading ramp

| Token | Desktop | ≤900px | Role |
| --- | --- | --- | --- |
| `--headline-size` | 72px | 48px | Every `h1` |
| `--headline-leading` | 0.87 | 0.9 | `h1` line-height, everywhere |
| `--h2-weight` | 750 | 750 | `h2` weight — set on a bare `h2` rule so nothing falls through to the browser's 700 |
| `--h2-size` | 48px | 36px | Section headings — home sections, About journey, case-study sections, product sections, privacy/support headings, calculator panels |
| `--h3-size` | 32px | 24px | Directory and case cards, About journey entries, Trade Cloud suite cards |
| `--h3-small` | 24px | 20px | Small card headings — proof cards, product feature grids, certifications |
| `--lede-size` | 21.4px | 16.8px | The sentence under a heading — `.lede`, `.case-intro`, `.product-lede`, `.products-intro`, `.section-lede`, `.calculator-intro`, `.case-list-intro`, `.contact-lede`, `.about-copy p` |

**Sized by role, not by tag.** The product/case card is an `h2` on its index page and an `h3` on the home page; both take `--h3-size` so the same component reads the same size wherever it appears. Adding a heading means picking the token whose role it matches — never writing a new size.

Two deliberate exceptions, both artwork rather than page structure: the hero diagram's labels (`0.58rem`) and `.mockup-heading` inside the simulated app screens on `income-tax.html` (18.24px). Those reconstruct a UI at miniature scale and would break if pulled onto the page ramp.

#### Small-type scale — two steps, no more

Everything at or below ~13.6px resolves to one of two tokens. Role decides which, not appearance:

| Token | Value | Use |
| --- | --- | --- |
| `--text-label` | `0.7rem` (11.2px) | Mono and/or uppercase technical labels — eyebrows, tags, table headers, case numbers, metadata |
| `--text-small` | `0.82rem` (13.1px) | All other small sans copy — buttons, links, captions, footnotes, hints |

This band previously held **23 distinct sizes across 59 declarations**, eight of them inside a 2.2px range. Differences that small are invisible on screen and read as inconsistency rather than hierarchy.

One deliberate exception: the hero diagram's own labels stay at `0.58rem` (9.28px). That artwork is sized as a unit and the tokens would break its proportions.

**Do not add a third step here**, and do not write a literal `rem` value below `0.86rem` — use a token.

#### The eyebrow

One component, one definition. `.intro`, `.page-eyebrow`, `.case-eyebrow`, `.detail-label`, `.products-eyebrow` and `.product-kicker` share a single rule: **Inter**, `--text-label`, weight 800, 0.15em, uppercase, cyan. Only margin varies by context. Class names are kept rather than renamed across 36 files; adding a new one means adding it to that selector list, not writing a new treatment.

Inter, not mono. A mono eyebrow was tried and reverted — the site reads better with the eyebrow in the same face as the headline it introduces.

### Spacing and layout

| Token / rule | Value |
| --- | --- |
| Maximum main width | `--max`, `1180px` — **every page shell uses it**: `.shell`, `.subpage-shell`, `.case-study-shell`, `.products-shell`, `.calculator-shell`. Product pages are the one exception: `main` is full-bleed for hero art and the inner `.product-hero` / `.product-section` carry the same 1180px column. |
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

### Copy

The type system is fully tokenised as of v2.2 — heading ramp, lede, small tier, weights, eyebrow, headline leading and the content column all resolve to `:root`. Nothing structural is outstanding.

What is outstanding is **the writing**. Several headlines are placeholder-grade: statements that could sit on any designer's portfolio without changing meaning. That is a copy problem, not a system problem, and it needs the site owner's voice rather than a mechanical pass.

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

`signal-tag` and `interview-card` are now shared by `income-tax.html` and `itba-case-study.html`; only `income-tax.html` uses `case-next`. `case-back` is styled and used nowhere. Depth ranges from 3,078 words (Income Tax) to 381 (UnitX) with no signal of that difference on `case-studies.html`.

## Assets

- Exact technical board: `assets/animesh-design-system.png`. **Regenerate it with `python3 scripts/generate_design_system_board.py`** after any token change — every value on the board is parsed from `styles.css` at render time, so it cannot drift from the code the way the hand-made version did. It renders in real Inter via `InterVariable.ttf` (`brew install --cask font-inter`), setting the weight axis directly so the board shows 400/650/750/800 exactly rather than the nearest static cut. Without Inter installed it falls back to SF and says so on the board itself.
- `assets/animesh-design-system.svg` still shows the old amber-primary palette and a text-overflow bug; treat it as superseded by the PNG above and do not hand-edit it further — regenerate it (or drop it) instead.
- Concept-only visual mood board (not a typography source): `assets/animesh-design-system-moodboard.png`
- Product evidence: `case-studies/assets/unitx/`
