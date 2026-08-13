# Animesh Portfolio Design System

Version 1.0 · 10 August 2026

## Product intent

The system presents a product designer and engineer who brings clarity to complex work. It is deliberately quiet, technical, and editorial: a near-black canvas, warm reading colour, restrained amber and cyan signals, fine structural lines, and generous space around a small number of important actions.

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
| `--soft` | `#706B62` | Captions and lower-emphasis metadata |
| `--line` | `rgba(243,238,226,0.15)` | Default divider and border |
| `--line-strong` | `rgba(243,238,226,0.32)` | Active border and stronger separation |
| `--amber` | `#F1B45A` | Primary action, emphasis, availability |
| `--cyan` | `#75D5E4` | Labels, process markers, secondary signal |
| `--panel` | `rgba(7,10,13,0.52)` | Translucent supporting surface |

The background uses only subtle radial amber/cyan atmosphere and a low-contrast grid. These effects support hierarchy; they must never reduce text legibility or become decorative content.

### Typography

| Role | Family | Weight | Scale / behaviour |
| --- | --- | --- | --- |
| Display, headings, body, navigation, actions | **Inter only** (`--font-sans`) | 400–800 | Display `clamp(3rem, 5.5vw, 5.8rem)`; body 1.55–1.62 line height |
| Technical labels and metadata | **System mono only** (`--font-mono`) | 700 | 0.72–0.78rem, uppercase, 0.07–0.08em tracking |

### Spacing and layout

| Token / rule | Value |
| --- | --- |
| Maximum main width | `1180px` |
| Standard desktop gutter | `48px` (`calc(100% - 48px)`) |
| Mobile gutter | `16px` main shell; `12px` header at ≤560px |
| Header height | 86px desktop, 78px tablet |
| Hero grid | `0.94fr / 0.8fr`, 88px gap; becomes one column at ≤900px |
| Long-form case width | 980px |
| Section rhythm | 72px case-detail padding; 96px desktop page top padding |
| Corner treatment | 8px for small interactive and proof surfaces; otherwise square / hairline |

## Components

### Navigation

- Sticky, blurred header with brand at left and portfolio links at right.
- Links use muted text by default, warm amber on hover and keyboard focus.
- The active route has a low-opacity cyan outlined treatment.
- Contact remains an outlined utility action.

### Buttons and actions

| Component | Resting state | Interaction |
| --- | --- | --- |
| Primary action | Amber fill, dark text, 46px minimum height | Lighter amber + 2px upward movement |
| Secondary action | Transparent dark surface, strong hairline border | Cyan border and text |
| Resume / utility action | Transparent with cyan border | Amber border and text |

### Proof rail

- Full-width hairline-bordered region.
- Cyan mono label followed by four evidence points.
- High-emphasis value in `--text`; explanatory caption in `--muted`.
- On small screens, changes to a two-column grid.

### Case-study structure

1. Eyebrow: project number, domain, platform.
2. One-sentence product proposition.
3. Role and focus metadata.
4. Repeating evidence sections: Context → Design choices → Selected surfaces / Evidence → Reflection.
5. `case-facts` use a thin-divider list: uppercase mini-heading, then concise explanation.
6. Public-sector work uses a clear portfolio-not-service note and excludes confidential content.

### Visual surfaces

- Ambient grid, tesseract, and process diagram are decorative and hidden from assistive technology.
- Product screenshots are real image assets with descriptive alternative text.
- Fine rules create hierarchy before cards or large fills are introduced.

## Responsive rules

| Breakpoint | Behaviour |
| --- | --- |
| ≤900px | Hero becomes one column; page grids simplify; background object is moved and reduced in opacity. |
| ≤560px | Header uses compressed type and gaps; actions wrap; proof rail becomes two columns; case detail becomes one column; UnitX gallery becomes two columns. |
| All sizes | Content uses `min-width: 0`, bounded widths, and overflow-safe text wrapping. No horizontal scrolling is permitted. |

## Accessibility and motion

- Semantic landmarks, descriptive navigation label, and real heading hierarchy are required.
- Decorative space artwork must remain `aria-hidden`.
- Image content requires meaningful `alt` text.
- Keyboard focus must be visible via amber/cyan borders or outlines.
- `prefers-reduced-motion: reduce` removes animation and transitions.
- Never encode a status with colour alone; labels, copy, and structure carry the meaning.

## Do / do not

**Do:** lead with one clear task, use proof sparingly, keep copy direct, preserve generous whitespace, and show real product evidence.

**Do not:** introduce glossy cards, large gradients, rounded-everything UI, generic process diagrams without project evidence, fake metrics, or decorative effects that compete with content.

## Assets

- Exact technical board: `assets/animesh-design-system.svg`
- Concept-only visual mood board (not a typography source): `assets/animesh-design-system-moodboard.png`
- Product evidence: `case-studies/assets/unitx/`
