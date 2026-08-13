# BuildX Behance Case Study Draft

## Cover

**BuildX**

Exact fractional arithmetic and trade calculators for construction work that needs speed, clarity, and confidence.

**Suggested cover visual:** blueprint-blue interface composition with calculator, stairs, rafters, concrete, drywall, and board-feet screens arranged like a field notebook.

## Project Snapshot

| Area | Detail |
| --- | --- |
| Product | BuildX |
| Category | Construction calculator, trade utility, productivity |
| Platform | iPhone |
| Role | Product design, SwiftUI implementation, design system, calculation logic, QA |
| Core surfaces | Calculator, Layout & Framing tools, Materials tools, History, Settings, Paywall |
| Key tools | Stairs, Rafters, Right Triangle, Area, Concrete, Drywall, Board Feet, Balusters |

## One-Line Story

BuildX turns construction math into a mobile-first toolkit: exact feet-inch-fraction arithmetic, reusable history, and trade-specific calculators wrapped in a clear blueprint-inspired interface.

## The Problem

Construction calculations are often simple in theory and risky in context.

A user may need to check rafter length, stair rise and run, board feet, concrete yardage, drywall sheet count, baluster spacing, or a right-triangle layout while standing on a job site.

The hard part is not only the formula. It is entering real construction measurements quickly, preserving fractional precision, understanding what the result means, and avoiding costly mistakes from rounding, waste, or code constraints.

## Product Opportunity

The product opportunity was to build a calculator that respects trade-specific workflows:

- feet, inches, and fractions as first-class input
- fast arithmetic for field measurements
- reusable calculation history
- dedicated calculators for common trade jobs
- quick reference guidance inside the tool
- metric and imperial unit support
- larger controls for work conditions

BuildX is designed less like a generic calculator and more like a practical job-site assistant.

## User Jobs

**Carpenter:** calculate layout, diagonals, rafters, and stair geometry without converting everything into decimals.

**Builder:** estimate material quantities for concrete, drywall, lumber, and board feet.

**Remodeler:** move between quick calculator math and specialized tools without losing the value being worked on.

**DIY user:** understand trade formulas and assumptions through built-in explainers.

**Repeat user:** recall a previous result, copy it, or load it back into the calculator.

## Product Structure

BuildX opens with a focused home screen:

- **Calculator hero:** direct access to exact arithmetic
- **Layout & Framing:** Stairs, Rafters, Right Triangle, Area
- **Materials:** Concrete, Drywall, Board Feet, Balusters
- **History:** one-tap recall of previous calculations
- **Settings:** unit system, precision, appearance, glove mode, support, purchases

The home layout gives the calculator priority, then groups tools by the type of job.

## Core Experience

### Exact Construction Calculator

The calculator supports fractional arithmetic, feet and inches, memory, previous answer recall, copy, reusable history, and metric or imperial display.

The interface includes:

- running tape
- large numeric display
- unit toggle
- memory and answer strip
- copy feedback
- reusable history loading
- keypad controls sized for repeated use

**Behance visual:** calculator screen with annotations for tape, display, fraction input, memory, and recall.

### Tool Cards

BuildX organizes specialized calculators into two scan-friendly groups.

**Layout & Framing**

- Stairs: rise, run, and IRC check
- Rafters: common, hip, and valley calculations
- Right Triangle: hypotenuse and angles
- Area: rectangle, circle, triangle, and polygon-style surface measurements

**Materials**

- Concrete: yards and bag count
- Drywall: sheet count with waste
- Board Feet: lumber volume and cost
- Balusters: count and exact spacing

**Behance visual:** home grid with two category bands and tool cards.

### Trade-Specific Explainers

Each tool includes practical guidance so the app does not feel like a black-box formula engine.

Examples:

- Concrete explains cubic yards, bag yield, and why users should order extra.
- Rafters explain pitch notation, bird's-mouth constraints, and run.
- Balusters explain clear gap, center-to-center spacing, and the IRC sphere rule.
- Drywall explains sheet sizes, waste, openings, and cutouts.

This makes BuildX useful for both experienced users checking work and less experienced users learning the assumptions behind a result.

**Behance visual:** quick reference table and good-to-know cards.

### Result To Calculator Handoff

Specialized tool results can be loaded back into the calculator. This keeps the app fluid when a user needs to continue from a generated measurement into additional arithmetic.

**Behance visual:** result card with "load into calculator" annotation and the calculator receiving the value.

### History And Reuse

BuildX keeps previous calculations available for one-tap recall. This supports real job-site behavior where a user may need to compare, revise, or reuse values while moving between tools.

**Behance visual:** history panel with one calculation being restored into the calculator.

## Visual System

BuildX uses a blueprint-blue design system with adaptive light and dark palettes.

Key visual choices:

- cool white and blue-tinted neutrals
- deep blue accent for actions and selected states
- monospaced numeric values where precision matters
- compact card grids
- strong separation between calculator, tools, and reference content
- high-contrast text for field readability

The visual language is practical, structured, and technical without becoming visually heavy.

## Interaction Details

BuildX includes several small details that make the product feel field-ready:

- unit onboarding asks whether the user works in imperial or metric
- calculator mode changes copy from "Fractions, Feet & Inches" to "Meters & Centimeters"
- glove mode can increase keypad target comfort
- haptics reinforce successful actions
- copy and reuse banners confirm completed actions
- settings expose precision and copy format

These details reduce friction during repeated use.

## Calculation Trust

The product separates core math into a `BuildXCore` module with tests for measurements and tools. This keeps calculation behavior more trustworthy than view-local formulas.

For a construction calculator, that matters. A beautiful interface is not enough if the arithmetic, rounding, or unit conversion rules are fragile.

## Monetization

BuildX can support a freemium model where the core calculator demonstrates daily value and advanced trade tools, saved workflows, or pro capabilities support paid conversion.

The important design principle is to keep the upgrade tied to real professional utility rather than hiding basic trust-building functionality too early.

## Outcome

BuildX became a focused construction utility with:

- exact calculator workflows
- trade-specific calculators
- built-in reference content
- reusable history
- adaptive visual system
- tested core calculation logic
- field-aware settings such as unit system, precision, and glove mode

## Reflection

The strongest design lesson in BuildX is that construction math is not just math. It is context.

A result has to match the units people actually use, explain assumptions when they matter, and remain easy to reuse in the next step. BuildX works best when it behaves like a compact field notebook: fast enough for quick checks, structured enough for precision, and clear enough to trust.

## Behance Layout Sequence

Use the STUDIVA reference as the visual rhythm: soft editorial boards, giant faded wordmark, rounded pills, calm process panels, comparison matrices, and polished device compositions.

1. Hero: ghosted `BUILDX` wordmark, central calculator iPhone, tool screens, top pills, `2026`
2. Intro statement: large paragraph about exact construction math in field conditions
3. Overview / Project Info / Services: three-column context panel
4. Project Timeline: Domain Mapping, Calculator UX, Trade Tools, QA
5. Competitive Analysis: Generic Calculator, Construction Calculator, Spreadsheet, BuildX
6. User Jobs: floating cards for carpenter, builder, remodeler, DIY user, repeat user
7. Problem Cards: fractions, unit switching, waste factors, code constraints, rounding trust
8. Tool Architecture: Calculator at center, Layout & Framing branch, Materials branch
9. Calculator Deep Dive: display, tape, fractions, memory, Ans, unit toggle
10. Tool Gallery: stairs, rafters, concrete, drywall, board feet, balusters
11. Explainer Board: quick reference table and good-to-know cards
12. History And Reuse: result handoff into calculator
13. Design System: blueprint palette, numeric typography, cards, keypad
14. Calculation Trust: BuildXCore, tests, formula handling, reusable results
15. Reflection: construction math is context, not only arithmetic

## Suggested Behance Caption

BuildX is a construction calculator for iPhone built around exact fractional arithmetic, trade-specific tools, reusable history, and practical reference guidance. This case study covers the product structure, calculator interaction model, blueprint-inspired design system, calculation trust, and the small field-ready details that make the app useful beyond a generic calculator.

## STUDIVA-Style Cover Brief

**Board size:** 1600 x 1200 px or similar wide hero.

**Background:** soft blueprint-white to pale blue gradient with a subtle grid.

**Foreground:** one central angled iPhone showing the calculator, with Home Grid and Concrete/Rafters screens tucked behind it.

**Typography:** giant translucent `BUILDX` behind the device. Smaller title block: `BuildX - Construction Calculator`.

**Pills:** `UI/UX Design`, `Construction App`, `Calculator`, `SwiftUI`.

**Micro details:** floating measurement chips such as `6/12 pitch`, `4x12 drywall`, `27 ft3`, `1/16 in`.
