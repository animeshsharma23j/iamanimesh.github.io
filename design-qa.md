# Review fixes - 2026-09-12 (round 2)

Seven items raised by the user against the research case-study build, with the
cause of each where it was a defect rather than a preference.

## 1. Controller, not Comptroller

`cgda-case-study.html` called the organisation the "Comptroller General of
Defence Accounts". It is the **Controller** General of Defence Accounts. Two
occurrences corrected. No other file named the organisation.

## 2. Em dashes replaced with plain hyphens, site-wide

387 em dashes across 35 HTML files became " - ". Done site-wide rather than only
on the pages in this change, because a half-converted convention reads worse than
either convention on its own.

- En dashes were left alone where they are numeric ranges ("2019-2021", "3-5
  engineers", "30-50%") - that is correct typography, not the thing being
  complained about. The one non-range en dash, "Say-do", became a hyphen, as did
  a stray `&ndash;` entity in the ITBA evidence section.
- `scripts/case-study-layout.js` splits `.case-meta > span` on the separator to
  build the label/value pair. The delimiter was ` — ` and is now ` - `; without
  that change every Role/Team/Focus line on the unified case studies would have
  rendered as one unsplit string. Verified still splitting on CGDA, Income Tax
  and Trade Cloud.
- The two counter placeholders rendered a bare em dash before the fetch resolved
  ("— appreciations online"). Rather than swap in another dash, the total row now
  ships hidden and is revealed only when a real count arrives.
- `currency-converter.html` used an em dash as the live-rate placeholder, which
  became a stray " - " in the middle of a sentence. Now an ellipsis.
- CSS comments still contain em dashes. They are not user-visible and were left.

## 3. Case-study index: CTA crowding the tag list

**Cause, not preference.** `.case-showcase .product-showcase-link` uses
`margin-top: auto` above 901px to floor-align the CTA with the media panel's
corner marks. An auto margin resolves to *zero* when there is no free space, so
on the two cards whose copy column is the taller of the two - CGDA and Trade
Cloud, both with four tags and a three-line description - the button sat flush
against the tags. The minimum gap now lives on the tag list
(`.case-showcase .case-showcase-tags { margin-bottom: 32px }`), so the auto
margin still absorbs any remaining slack. Measured 32px on all five cards at
1440px and 28px at 375px.

## 4. ITBA hero: four columns now top-aligned

`.itba-hero-grid` used `align-items: center` with `padding-top: 42px`, while the
sidebar and summary rails both use `padding-top: 64px`. The figure was the taller
cell, so the copy column was centred against it and pushed 35px down, and all
four column tops landed on four different lines (172 / 184 / 209 / 219px). Now
`align-items: start` with `padding-top: 64px`, which puts the rail title, the
kicker, the mockup window and the summary card all at exactly **184px**.

## 5. Two different "Evidence" statements

The overview facts row and the summary card both had an Evidence entry, saying
different things. The summary card's Challenge/Response/Evidence triad is shared
with every other case study, so the *card* keeps Evidence - now reading
"Officer walkthroughs, qualitative validation, and a 13-source documentary
review; no claimed production metric" - and the facts row drops its cell,
leaving My role / Team / Focus. `.itba-facts` regridded from four columns to
three.

## 6. Clipped table

**Cause, not preference.** `.comparison-table tbody th` carried
`white-space: nowrap`. That is fine for a short label like "Case status", but the
research tables use sentence-length row headers, so column one was forced wide
enough to hold a whole sentence on one line - squeezing the remaining columns to
roughly one word per line and pushing the last column out of the scroll
container. `nowrap` removed globally. Separately, the ITBA table caption had
`padding: 0 0 14px`, so its text started at the wrap's rounded border; now
`18px 18px 14px`.

After the fix, zero tables overflow their container at 1440px across
itba-case-study.html (8), trade-cloud-apps.html (8), cgda-case-study.html (3) and
income-tax.html (1). At 375px they all scroll inside their own wrap and the page
itself does not.

## 7. Callout needed breathing space

`.itba-callout` had `margin: 32px 0 0` - no bottom margin - so the next heading
abutted it. Now `36px 0 40px`. Section headings also had no margin of their own,
so `.itba-section > h3` gets `40px 0 14px`.

**Regression caught during verification:** the heading rule was first written as
`.itba-section h3`, which leaked a 40px top margin into every h3 *inside* a
component - mockup bodies, proof cards. Re-scoped to the child selector
`.itba-section > h3`. Re-audited all 35 h3 elements on the page: mockup headings
0px, proof cards 0px, findings articles 18px, iteration steps 0px, callout
headings 12px, pre-existing research-subheads 36px, and only the four
section-level headings at 40px.

## Verification evidence

- `npm run verify`: all 36 pages pass.
- `git diff --check`: clean.
- Console errors on the three rebuilt case studies: none.
- Screenshots at 1440x900 confirm the ITBA hero alignment, the corpus and
  persistence tables rendering in full, the callout spacing, the BuildX
  traceability table, and the CGDA index card's CTA gap.
- Counter renders "1 appreciation online" (singular) and the row is hidden until
  a count arrives.

final result: passed

---

# Research case-study build — 2026-09-12

## Scope

Three changes, all driven by research documents supplied by the user on 2026-09-12
(ITBA field research kit, ITBA research case study, ITBA UX research report, and
per-product pain-point studies for JobBook, BuildX, RateX and TradeBill).

1. **CGDA restored and rewritten as a pure research study.** The page was
   orphaned on 2026-09-12 (noindex, out of the sitemap, no public link). It is
   now indexed, back in the sitemap, back on the case-study index at position 04,
   and relinked from the About journey entry. The content was rewritten to end at
   the stakeholder submission per the user's instruction ("pure research,
   thematic analysis and submission to the stakeholder"): design decisions,
   wireframe walkthrough, prototype validation and the before/after capability
   table were all removed. New sections: research questions, method (with a
   per-method rationale table), thematic analysis (four coded blockers clustered
   into two themes by shared cause), findings, say–do gaps, submission
   (recommendation set plus what the department pushed back on), limitations, and
   reflection.
2. **ITBA gained an evidence-review section (05).** The user confirmed the
   existing primary-research claims describe real professional work and that the
   supplied documents are supplementary, so the fieldwork narrative is unchanged.
   The new section presents the documentary strand alongside it: the 13-source
   corpus with a watch-out per source, confidence tagging (documented / inferred
   / hypothesis, with hypotheses excluded from recommendations), the eight-year
   persistence table with the 2018 response pattern, four documented say–do gaps,
   the six root causes with an explicit "what design cannot fix" column, and the
   2026 dual-Act context. The Delivery & outcomes section gained a "what I would
   instrument" table — four proposed measures, which is the honest complement to
   the page's existing statement that no production metric was captured. Sidebar
   contents and section kickers renumbered 05–11.
3. **Trade Cloud Apps rebuilt as a four-product research case study.** Per the
   user's instruction, the JobBook, BuildX, RateX and TradeBill research all live
   here. New sections: method (four corpora, inductive-then-deductive coding,
   stated uncoded residue of 31.2%), limitations placed deliberately before the
   findings, findings (five themes by share of 1,832 negative reviews, the
   positive contrast set, and the tool-vs-software cross-cutting table), the trust
   arc, evidence → decisions (a traceability table per product plus the payments
   reversal and the held-back recommendation), and open questions. Suite roles,
   design choices and the handoff model were kept; suite roles now notes RateX as
   a fourth product in App Store review.

## RateX handling

RateX is under App Store submission. Its research is included in the Trade Cloud
case study, but `ratex.html` remains unlinked and the products-page card keeps its
"Coming soon" state. No link to the RateX product page was added anywhere.

## Incidental fixes

- Singular/plural bug in the appreciation counter on both case-study layouts:
  it rendered "1 appreciations online". Both `case-study-layout.js` and
  `itba-case-study.js` now switch the label on count === 1. Verified live:
  "1 appreciation online".
- Read times on the case-study index were stale and are now derived from actual
  main-content word count at ~215 wpm: ITBA 8 → 17 min (measured with the
  research disclosure collapsed, which is the default reading path), UnitX 2 → 4,
  CGDA 10, Trade Cloud 2 → 21. Income Tax was already accurate at 15.

## Verification evidence

- `npm run verify`: all 36 pages pass landmarks, skip links, canonicals, Open
  Graph, navigation, and local links.
- Browser console errors on cgda-case-study.html, itba-case-study.html and
  trade-cloud-apps.html: none.
- Unified layout applied on both rebuilt pages (`unified-case-study` present);
  contents rails render 10 entries for CGDA, 12 for Trade Cloud, 11 for ITBA.
- No horizontal document overflow at 375 px on cgda-case-study.html,
  itba-case-study.html, trade-cloud-apps.html or case-studies.html; every wide
  table scrolls inside its own `.comparison-table-wrap` rather than the page.
- Case-study index renders five cards in order: Income Tax, ITBA, UnitX, CGDA,
  Trade Cloud Apps.

## Known gap, not addressed here

The home page still carries no work and no contact address, and the header
"Contact" tab still resolves to the hero section. Out of scope for this change and
left untouched.

final result: passed

---

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

---

# About page design QA

## Comparison target

- Source visual truth:
  - `/Users/johnconnor/Desktop/Screenshot 2026-09-12 at 8.41.23 PM.png`
  - `/Users/johnconnor/Desktop/Screenshot 2026-09-12 at 8.41.50 PM.png`
- Implementation: `http://127.0.0.1:4173/about.html?v=20260912-23`
- Implementation screenshot: Codex in-app browser capture surfaced inline; the browser backend did not expose a filesystem path.
- Viewport: 1280 × 720 CSS px for desktop, with an additional 390 × 844 CSS px responsive check.
- Source pixels: 2934 × 344 and 3142 × 648. These are user-provided focused crops; their CSS viewport and device density are unknown.
- Implementation pixels: 1280 × 720 at the browser's default density; 390 × 844 for the responsive check.
- Density normalization: not applicable because the source images are directional crops rather than full-viewport fidelity targets.
- State: About page, dark theme, intro and certifications regions.

## Full-view comparison evidence

- The source intro showed the About label below the portrait's top edge and placed New Delhi inside the copy metadata row.
- The corrected render aligns the About metadata and portrait frame at exactly the same top coordinate (`topDelta: 0`) and moves location beneath the image.
- The corrected portrait caption rendered `NEW DELHI, INDIA` with the live New Delhi date, time, and IST timezone.
- The page retained its existing type, color, background, portrait crop, and section rhythm.

## Focused region comparison evidence

- The source credentials crop repeated `CERTIFICATION` once for each credential.
- The corrected render contains one `CERTIFICATIONS` heading and two credential headings in a single shared section.
- DOM verification found one `.case-showcase-meta-title` and two certification `h3` elements.
- At 390px, the intro reflowed to one column, the portrait remained uncropped horizontally, and the caption content remained present in the accessibility tree.

## Required fidelity surfaces

- Fonts and typography: existing font families, weights, heading scale, label tracking, and casing were preserved.
- Spacing and layout rhythm: intro top alignment is exact; the caption sits 16px below the image; certifications use one numbered vertical sequence at every breakpoint.
- Colors and visual tokens: existing text, muted, amber, and background tokens are unchanged.
- Image quality and asset fidelity: the existing portrait asset, crop mode, and source dimensions are unchanged.
- Copy and content: location moved below the portrait; date and time are generated for `Asia/Kolkata`; the two credential titles are unchanged and now share one section label.

## Findings

- No actionable P0, P1, or P2 mismatch remains for the three requested corrections.
- P3: the live time changes after capture by design; this is expected dynamic content rather than visual drift.

## Comparison history

1. Earlier findings: intro copy was vertically centered below the portrait top, location occupied the copy metadata row, and Certification was duplicated.
2. Fixes: top-aligned the intro copy, added a portrait caption with live New Delhi date/time, and consolidated credentials into one semantic section.
3. Post-fix evidence: browser render and DOM metrics confirmed a 0px top delta, one certification tagline, two credential titles, and no desktop horizontal overflow (`scrollWidth: 1280` at a 1280px viewport).

## Implementation checklist

- [x] Top-align About copy with portrait.
- [x] Move New Delhi below portrait.
- [x] Add live date, time, and IST label.
- [x] Use one Certifications tagline and one ordered vertical list for two credentials.
- [x] Check desktop and mobile reflow.
- [x] Check browser console warnings and errors.

final result: passed
