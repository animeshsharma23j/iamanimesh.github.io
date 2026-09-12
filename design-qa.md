# Products showcase design QA — 2026-09-12

## Comparison target

- Source visual truth: `/Users/johnconnor/Desktop/Screenshot 2026-09-12 at 11.11.39 AM.png` (2284 × 1158 px).
- Implementation: `http://localhost:4173/products.html`, `products.html`, and the Products showcase rules in `styles.css`.
- Implementation evidence: in-app browser captures emitted in the task at a 1440 × 900 CSS viewport and a 390 × 844 mobile viewport.
- Density normalization: visual proportions were compared at each artifact's native capture density; the source is a cropped standalone block while the implementation includes the Portfolio header and background.
- State: dark theme, page start. A second desktop capture checked the TradeBill and JobBook panels lower in the page.

## Full-view comparison evidence

The source and final implementation were opened together in one comparison input. Both use a dark split panel, a text-led left column, a product image on the right, and one white CTA. Following the user's refinement, the implementation uses square panels and controls, a denser vertical rhythm, the Portfolio header, Roboto Condensed typography, the black/ivory/gold palette, geometric background, real app icons, real product copy, and real product screenshots.

## Focused-region comparison evidence

- First panel: app icon, app-name h2, descriptor, supporting copy, modern Apple-device row, square CTA, vertical divider, and vertically centred phone image are all visible without clipping at 1440 × 900. The media region measures exactly 440 × 440px.
- Lower panels: TradeBill and JobBook preserve the same layout and image treatment; lazy-loaded product imagery resolves when the panels enter the viewport.
- Mobile: at 390 × 844 the first panel becomes a single column, measures 366px wide inside a 390px viewport, its media region remains square at 364 × 364px inside the border, and the document scroll width remains exactly 390px.

## Required fidelity surfaces

- Fonts and typography: the implementation uses the site's Roboto Condensed family and shared `--h2-size`, `--h2-weight`, `--lede-size`, `--text-small`, and body-size roles. The app name—not its subtitle—is the h2.
- Spacing and layout rhythm: the final flexible-copy / 440px-media split, 440px minimum panel height, 24px section gap, square frame, single divider, and compact page-start spacing use the Portfolio's established layout tokens without adding a separate visible page hero.
- Colors and visual tokens: existing near-black, ivory, muted gray, warm-gold, and line tokens are reused. No foreign color system was introduced.
- Image quality and asset fidelity: every block uses its real app icon. Real UnitX, BuildX, TradeBill, JobBook, and Recital product captures are vertically centred at fixed proportional heights; RateX uses its existing identity artwork because no product screen exists yet. The Apple mark comes from the MIT-licensed Phosphor set, while the updated edge-to-edge iPhone, iPad, and Watch silhouettes come from Apache-2.0-licensed Material Symbols. Both sets are vendored locally.
- Motion: mockups use a low-amplitude 6-second vertical float with staggered delays. `prefers-reduced-motion` removes the animation and all associated transitions.
- Copy and content: product names, descriptors, benefits, platform metadata, routes, and coming-soon state remain product-specific and truthful.

## Comparison history

### Earlier blocked pass

- P1: the app name was demoted to a small label while the subtitle/benefit incorrectly became the headline.
- P1: product blocks did not show their app icons or make Apple ecosystem support visually immediate.
- P2: 610–749px panels were unnecessarily tall, had rounded corners, and used too much inter-panel space.
- P2: product images were bottom-aligned instead of vertically centred.
- P2: device indicators used dated phone, tablet, and analog-watch silhouettes.
- P2: the CTA still had a pill radius, the mockups were static, and the right-side media region was rectangular rather than square.

### Fixes made

- Made each app name the h2, moved the descriptor beneath it, and kept benefit/detail copy at the shared body size.
- Added the real 72px app icon beside each app name.
- Added labelled Apple, iPhone, iPad, and Watch support indicators, limited to each app's supported devices, then replaced the older device silhouettes with current edge-to-edge Material Symbols.
- Reduced panels to a 440px minimum height with 24px gaps and zero corner radius.
- Vertically centred product imagery and normalized it to 360px on desktop and 280px on mobile.
- Set the media region to an exact responsive square: 440 × 440px on desktop and full-width square on mobile.
- Removed the CTA's residual pill radius and added a restrained 6-second floating animation with a reduced-motion fallback.
- Kept a semantic-only h1 while removing the visible page-level hero and heading.

### Post-fix result

The final responsive render shows no remaining actionable P0, P1, or P2 issue. Two compact blocks are visible in the 1440 × 900 desktop viewport; the app identity, product hierarchy, current device silhouettes, square media region, square CTA, and gently animated product imagery are immediately legible.

## Interaction and validation evidence

- View UnitX navigated successfully to `unitx.html`.
- Mobile document width: 390px viewport / 390px scroll width; no horizontal overflow.
- Browser console errors: none.
- Computed desktop checks: media 440 × 440px; CTA radius 0px; mockup animation `product-mockup-float`, 6s.
- `npm run verify`: all 36 pages pass landmarks, skip links, canonicals, Open Graph, navigation, and local links.
- `git diff --check`: passed.

## Follow-up polish

- P3: wide landscape product imagery could reduce unused horizontal space further, but the current real phone captures are more honest than manufactured composites.

final result: passed

---

# Case-study index design QA — 2026-09-12

## Comparison target

- Visual reference: the finished Products index at `http://localhost:4173/products.html`.
- Implementation: `http://localhost:4173/case-studies.html`, using the same shared showcase panel classes and Portfolio tokens.
- Evidence: Products and Case Studies were rendered together at 1440 × 900; Case Studies was also checked at 390 × 844.

## Fidelity and responsive evidence

- Both indexes use the same 1380px shell, 24px vertical gap, flexible-copy / 440px-square split, zero-radius frame, zero-radius CTA, divider, typography hierarchy, and page-start spacing.
- Case studies replace product imagery with purposeful editorial numbering and project-focus metadata; this distinguishes project narratives from app listings while preserving the shared structure.
- Four visible case studies remain: Income Tax, ITBA, UnitX, and Trade Cloud Apps. CGDA has no public-facing link, has been removed from the sitemap and homepage metadata, and its retained source page carries `noindex, nofollow`.
- At 1440px, the first case media field is exactly 440 × 440px. At 390px, it remains square at 364 × 364px, the card is 366px wide, and the document scroll width equals the viewport width.
- The visible h2 hierarchy, read time, topic tags, description, and square CTA remain legible without clipping. The page-level h1 remains semantic-only.

## Interaction and validation evidence

- The Income Tax CTA navigates to `income-tax.html`.
- Browser console errors: none.
- `npm run verify`: all 36 pages pass landmarks, skip links, canonicals, Open Graph, navigation, and local links.
- `git diff --check`: passed.

final result: passed

---

# Archived: Unified case-study design QA — 2026-09-11

historical result: passed

## Comparison target

- Source visual truth: `/Users/johnconnor/Desktop/Screenshot 2026-09-11 at 6.08.02 PM.png` (3840 × 2070 px), interpreted together with the user’s explicit constraints: 1380px portfolio width, shared top bar, contents at left, summary and feedback at right.
- Master implementation: `itba-case-study.html` and `itba-case-study.css`.
- Rebuilt routes: `income-tax.html`, `unitx-case-study.html`, `cgda-case-study.html`, and `trade-cloud-apps.html`.
- Desktop implementation captures: `/private/tmp/portfolio-case-study-qa/.qa-income-tax.png`, `/private/tmp/portfolio-case-study-qa/.qa-unitx-fresh.png`, `/private/tmp/portfolio-case-study-qa/.qa-cgda.png`, `/private/tmp/portfolio-case-study-qa/.qa-trade-cloud-fresh.png` (1440 × 1000 CSS px for Income Tax and CGDA; fresh UnitX and Trade Cloud captures at the in-app browser’s 1280 × 720 default).
- Focused captures: `/private/tmp/portfolio-case-study-qa/.qa-unitx-evidence.png`, `/private/tmp/portfolio-case-study-qa/.qa-cgda-research.png`, `/private/tmp/portfolio-case-study-qa/.qa-trade-suite.png`, `/private/tmp/portfolio-case-study-qa/.qa-income-testing.png`.
- Mobile implementation capture: `/private/tmp/portfolio-case-study-qa/.qa-income-tax-mobile.png` (390 × 844 CSS px).
- Density: source and implementation were compared at browser-rendered 1× display density. The source is a wider reference, so the comparison normalised composition rather than claiming pixel-identical content.
- State: dark theme, page start for overview captures; scrolled long-form sections for focused captures.

## Full-view comparison evidence

The source and rebuilt Income Tax page were opened together in one comparison view. Both establish a persistent contents rail, a dominant editorial title, compact project-fact cards, and a third supporting column. The portfolio intentionally substitutes its requested summary and feedback rail for the source’s project illustration, retains the shared portfolio top bar, and uses the ITBA page’s typography and cyan token rather than copying the source’s pink project branding.

The four rebuilt overview captures show the same 190px / flexible story / 250px grid, 48px gutters, sticky navigation and summary, hero spacing, metadata-card treatment, divider rhythm, and responsive structure.

## Focused-region comparison evidence

- UnitX evidence: full-width editorial section treatment, restrained table, existing product imagery, and sticky side rails remain aligned.
- CGDA research: subsection headings, two-column fact groups, long-form measure, and evidence-bound language retain the ITBA rhythm.
- Trade Cloud suite: three product cards and the real product screenshots use the shared card and image treatment without changing routes.
- Income Tax workflow: section kicker, large heading, explanatory copy, and the existing wireframe sequence share the new vertical rhythm.
- Mobile: overview stays first, metadata becomes one column at 390px, and contents, summary, feedback, and story follow in that order without horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: the same portfolio display and body families, weights, line heights, cyan kickers, balanced headings, and readable long-form measure are used across all five cases.
- Spacing and layout rhythm: all case-study overviews use the same 1380px desktop shell, 48px column gaps, card spacing, 64px section rhythm, borders, radii, and sticky offsets.
- Colors and visual tokens: the ITBA charcoal, warm white, muted grey, cyan accent, translucent panel, and divider values are shared by the other four routes.
- Image quality and asset fidelity: existing product screenshots remain proportional and uncropped; no placeholder imagery was introduced. Pages without publishable product imagery remain intentionally text-led.
- Copy and content: existing case-study text, proof boundaries, confidentiality language, links, and product claims were preserved.

## Comparison history

### Earlier blocked pass

- P1: only the outer three-column shell matched; the four pages retained their previous hero, inline metadata, label/content split, cards, and section rhythm.
- P2: at narrower layouts the summary and contents could appear after the full story instead of following the overview.
- P2: each page’s proof cards, tables, workflows, galleries, and prose used visibly different spacing and surface treatments.

### Fixes made

- Rebuilt the generic case-study DOM into separate overview, contents, story, and summary regions.
- Converted metadata into consistent labelled cards.
- Applied the ITBA typography, color, divider, card, table, gallery, and long-form section system to all four pages.
- Matched the ITBA responsive order: overview, contents, summary/feedback, then story.
- Clipped horizontal overflow at the page root so wide evidence sections cannot displace the persistent rails.
- Preserved existing product screenshots and all case-specific copy.

### Post-fix result

Fresh desktop and mobile captures show no remaining actionable P0, P1, or P2 mismatch within the requested adaptation. The intentional differences from the source are the portfolio top bar, the right-hand summary/feedback rail, the portfolio type system, and case-specific content/assets.

## Follow-up polish

- P3: case studies with three metadata cards naturally leave the fourth grid position empty; this preserves truthful metadata rather than inventing a field for visual symmetry.

## Validation

- `npm run verify`: all 36 pages pass landmark, skip-link, canonical, Open Graph, navigation, and local-link checks.
- `node --check scripts/case-study-layout.js`: passed.
- `git diff --check`: passed.

historical result: passed
