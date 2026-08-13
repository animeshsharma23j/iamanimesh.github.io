# Design QA — portfolio refinement

## Source visual truth

- Recognition reference: `/Users/johnconnor/Desktop/Screenshot 2026-07-30 at 9.24.46 PM.png`
- Header / hero reference: `/Users/johnconnor/Desktop/Screenshot 2026-07-30 at 9.26.11 PM.png`
- Journey reference: `/Users/johnconnor/Desktop/Screenshot 2026-07-30 at 9.30.23 PM.png`

## Implementation evidence

- Screenshot: `tmp/qa/journey-implementation.png`
- Viewport: 1280 × 720 CSS pixels
- State: home page loaded at `#journey`; first timeline entry and header visible.
- Route checks: `index.html`, `unitx.html`, and `income-tax.html` each returned HTTP 200 from the local server.

## Comparison

### Full view

The implementation keeps the reference's dark editorial field, quiet line work, pale type, and compact header. The home page intentionally retains its existing design-thinking visual language rather than copying the reference hero verbatim. Section spacing was widened so the hero, work, journey, and about content read as separate chapters.

### Focused regions

- **Header and identity:** the previous horizontal blur mask created a seam beside the wordmark. The veil now spans the viewport and fades only vertically. The supplied logo has a cyan-and-amber glow and alternates cleanly with the online wordmark.
- **Journey:** cards were replaced with a left-hand rail, dot markers, company / role / summary in the main column, and dates aligned on the right—matching the requested reference structure.
- **Recognition:** moved into About as a two-column editorial block: label left, yellow outcomes and recognition names right.
- **Case studies:** rows are now whole, keyboard-focusable links to dedicated UnitX and Income Tax pages.

## Iteration history

1. Increased hero-to-section spacing and added low-contrast section rules.
2. Separated the recognition content from the home hero and placed it within About.
3. Rebuilt Journey as a timeline.
4. Replaced conflicting identity-face animation with a timed cross-flip.
5. Replaced the masked header blur with a full-width vertical fade to eliminate the perceived cut near the brand.

## Required fidelity surfaces

- Hero / main visible surface: reviewed.
- Header navigation: reviewed, including wordmark, logo state, and Contact outline button.
- Case-study entry interaction: verified through direct destination routes.
- Journey anchor: reviewed at `#journey`.
- About / recognition content: reviewed in source and visual treatment.
- Responsive rules: reviewed for 900px and 560px breakpoints; journey, recognition, case rows, header, and case-study layout each collapse to one-column-safe patterns.

Final result: passed

---

# Design QA — Product consistency correction (2026-08-13)

## Source visual truth

- UnitX: supplied iPhone and iPad simulator screenshots.
- BuildX: supplied iPhone and iPad simulator screenshots.
- PaceX: supplied iPhone simulator screenshot.

## Corrections verified

- Products now uses the same black surface, warm-white type, low-contrast grid, and compact navigation treatment as the rest of the portfolio; the previous white directory treatment has been removed.
- UnitX, BuildX, and PaceX heroes now render real supplied app screenshots. The previously generated app mockups are no longer used by product pages.
- Each product hero now exposes exactly two intentional actions: a primary `Download on the App Store` link and a secondary `Explore` anchor to the feature section.
- Browser checks confirmed all three real screenshot sources and App Store links: UnitX `6760877550`, BuildX `6767122401`, and PaceX `6767212682`.
- The BuildX hero was visually reviewed at desktop width with the supplied iPhone screenshot; browser console reported no errors.

Final result: passed

---

# Design QA — Products and app landing pages (2026-08-13)

## Reference and scope

- Directory reference: `/Users/johnconnor/Desktop/Screenshot 2026-08-13 at 10.19.17 AM.png`
- App-launch reference: `/Users/johnconnor/Desktop/Screenshot 2026-08-13 at 10.22.26 AM.png`
- Implemented routes: `products.html`, `unitx.html`, `buildx.html`, and `pacex.html`

## Visual checks

- The Products page was rendered locally at desktop width. It uses the reference’s light editorial surface, large black headline, rounded white app cards, icon-first hierarchy, metadata, and a single clear exploration action per app.
- The BuildX landing page was rendered locally. Its hero retains the reference’s dark app-launch rhythm: app icon and short copy on the left, full iPhone product image on the right, strong accent word, two focused actions, and compact product facts.
- UnitX and PaceX routes were loaded locally; their unique hero headings were visible and the browser console reported no errors.

## Interaction and integrity checks

- Products is a first-class global-navigation item on all pages, with the active state applied only on the directory and product pages.
- All three directory actions lead to their dedicated landing pages.
- `npm run verify` passed across 10 pages, including metadata, landmarks, navigation, and local product assets.

Final result: passed
