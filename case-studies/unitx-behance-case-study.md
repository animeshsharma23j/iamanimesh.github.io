# UnitX Behance Case Study Draft

## Cover

**UnitX**

Designing a faster way to convert anything: type it, say it, scan it, save it, or continue from Apple Watch.

**Suggested cover visual:** three iPhone screens in a dark utility composition, with the UnitX app icon and small tokens for `500 g to lb`, `100 USD to INR`, camera, microphone, and watch.

## Project Snapshot

| Area | Detail |
| --- | --- |
| Product | UnitX |
| Category | Utility, productivity, unit and currency converter |
| Platform | iPhone with Apple Watch companion |
| Role | Product design, UX strategy, SwiftUI implementation, QA, App Store preparation |
| Core surfaces | Smart Convert, Manual Converter, Camera Scan, Voice Convert, Favorites, History, Settings, Watch |
| Business model | Freemium with UnitX Pro |

## One-Line Story

UnitX turns conversion from a setup-heavy calculator task into a flexible utility moment that works through typed intent, manual controls, speech, camera input, saved pairs, and Apple Watch shortcuts.

## The Problem

Unit conversion is usually a tiny task, but people need it in inconvenient moments.

A traveler checks a price in another currency. A cook adapts a recipe. A shopper compares package weight. A student sees a measurement in a document. A worker finds a value on a label, screenshot, or tool.

Most converter apps solve the math, but many still ask the user to do too much before the answer appears:

- choose a category
- choose a source unit
- choose a target unit
- enter a value
- read the result
- repeat the setup later

The design challenge was to reduce that setup without removing precision.

## Product Opportunity

The opportunity was not to build another converter. It was to design a converter around the way conversion needs actually appear.

**Core product principle:** start with intent, then offer control.

UnitX supports five conversion entry points:

- **Type:** natural queries like `72 kg to lb`
- **Manual:** exact category, unit, value, and swap controls
- **Voice:** quick spoken conversion requests
- **Camera:** scan printed or nearby text
- **Watch:** repeat useful conversions from the wrist

## User Jobs

**Traveler:** convert prices quickly without mental math.

**Cook:** adapt recipes while staying in the cooking flow.

**Shopper:** understand grams, ounces, liters, or serving sizes from packaging.

**Student or professional:** convert values seen in notes, tools, documents, and screenshots.

**Repeat user:** save frequent unit pairs and reopen recent conversions.

**Watch user:** perform common conversions away from the phone.

## Design Principles

### 1. Start with intent, not setup

The primary surface is a smart input model. The user can say what they want before configuring the converter.

### 2. Keep manual control visible

Smart input is fast, but precision users still need direct controls. Manual conversion is not treated as a fallback; it is a parallel workflow.

### 3. Make premium utility practical

Voice, camera, Apple Watch, unlimited history, unlimited favorites, and premium appearance settings are tied to repeated utility, not decorative upgrade pressure.

### 4. Support recovery

Recognition and parsing can fail. The experience needs clear feedback, editable results, and a handoff into manual conversion.

### 5. Build for repeat behavior

Favorites and history turn one-off conversions into reusable routines.

## Information Architecture

UnitX is organized around four primary iPhone tabs:

- **Convert:** smart input, voice, camera, manual converter, result editing
- **Favorites:** saved unit pairs
- **History:** recent conversions and replay
- **Settings:** appearance, Pro, Watch settings, review, share, support

The Apple Watch app focuses on glanceable repeat flows:

- Quick Convert
- Travel conversion
- Favorites
- Recents
- Voice conversion

## Final Experience

### Smart Convert

Smart Convert is the center of gravity. The user can type short, messy, real-world requests like:

- `5 miles in km`
- `100 USD to INR`
- `72 kg to lbs`
- `30 celsius to F`
- `1 foot to cm`

The interface keeps input reachable near the thumb zone, while suggestions and results remain visible above it.

**Behance visual:** phone screen with query examples orbiting the smart input field.

### Manual Converter

Manual mode gives full control over source unit, target unit, category, value, and swap direction.

This matters because smart parsing and direct control solve different moments. A user may begin with natural input, then move into manual editing once the app understands the intended category and units.

**Behance visual:** annotated source/target cards, swap control, category selector, favorite action.

### Smart Result

The result view turns a parsed query into structured conversion cards. The goal is to make the answer feel instant, but still inspectable.

Key choices:

- preserve interpreted source and target units
- keep values large and readable
- allow swapping and unit editing
- provide a clear path into manual conversion

**Behance visual:** before/after strip: raw text query to structured cards.

### Camera Scan

Camera conversion extends the product into real-world moments: labels, documents, packaging, and printed measurements.

The UX needs to be honest about uncertainty. When scan results are ambiguous, the user should be able to confirm, edit, or move into manual control.

**Behance visual:** camera frame with extracted measurement chips and an editable confirmation state.

### Favorites And History

Favorites support repeated unit pairs. History supports recovery.

Together, they turn UnitX from a one-off answer tool into a daily utility that learns from use.

**Behance visual:** retention loop diagram: convert -> save/replay -> faster next use.

### Apple Watch

The Watch app focuses on short, high-frequency flows. It is strongest for travel, repeat conversions, favorites, and recents.

**Behance visual:** iPhone and Watch side by side, showing a saved conversion continuing from phone to wrist.

## Visual System

UnitX uses a dark, utility-first visual language:

- black and charcoal surfaces
- high-contrast values
- compact cards
- crisp typography
- accent colors for actions and categories
- premium themes and accent palettes for Pro users

The design intent is speed and trust: the app should feel focused enough for quick answers, but polished enough for daily use.

## QA And Product Hardening

One key reliability fix came from testing the Smart Convert to Manual Converter handoff. A smart result could previously open the manual converter with stale previous units. The fix gave each smart handoff a fresh presentation identity so the manual screen always reflected the current parsed result.

That detail matters because conversion products depend on trust. The result and the editable state must never disagree.

## Monetization

UnitX keeps core typed and manual conversion free. Pro is attached to higher-intensity utility:

- unlimited voice conversions
- unlimited camera conversions
- Apple Watch companion
- unlimited favorites
- unlimited history
- premium themes and full accent palette

The upgrade model is designed around convenience and repeated use.

## Outcome

UnitX shipped as a multi-input converter with a broader interaction model than a typical manual converter.

Key outcomes:

- smart typed conversion became the main flow
- manual conversion remained available for precision
- voice and camera expanded input options
- favorites and history supported repeat use
- Apple Watch created a stronger Pro value proposition
- QA surfaced and resolved important state and sync details

## Reflection

UnitX began as a conversion utility, but the strongest design insight was that conversion is not one workflow. It is a family of moments.

Sometimes the user wants speed. Sometimes precision. Sometimes hands-free input. Sometimes a camera shortcut. Sometimes a saved pair. Sometimes a glance from the wrist.

The best version of UnitX is not the converter with the most categories. It is the converter that lets people reach the answer in the way the moment naturally allows.

## Behance Layout Sequence

Use the STUDIVA reference as the visual rhythm: soft editorial boards, giant faded wordmark, rounded pills, calm process panels, and polished device compositions.

1. Hero: ghosted `UNITX` wordmark, angled iPhone, Watch, top pills, `2026`
2. Intro statement: large paragraph about conversion as a flexible utility moment
3. Overview / Project Info / Services: three-column context panel
4. Project Timeline: Strategy, UX, SwiftUI Build, Launch Prep
5. Competitive Analysis: Manual Converter, Calculator, Currency App, UnitX
6. User Jobs: floating angled cards for traveler, cook, shopper, student, worker, repeat user
7. Problem Cards: setup friction, recognition ambiguity, repeat setup, watch handoff
8. Product Map: Type / Voice / Camera / Manual -> Result -> Save / Replay / Watch
9. Smart Convert: annotated hero screen
10. Manual Converter: precision-control screen
11. Camera Scan: scan and confirmation board
12. Favorites, History, Watch: repeat-use board
13. Design System: dark utility palette, cards, typography, result chips
14. Trust / QA: smart-to-manual handoff, scan uncertainty, currency availability, sync
15. Reflection: conversion is a family of moments

## Suggested Behance Caption

UnitX is a modern iPhone and Apple Watch converter designed around the way conversion needs actually happen: typed shorthand, natural language, speech, camera text, saved routines, and quick Watch access. This case study covers the product thinking, interaction model, visual system, monetization, and QA behind turning a small utility task into a fast, flexible everyday workflow.

## STUDIVA-Style Cover Brief

**Board size:** 1600 x 1200 px or similar wide hero.

**Background:** soft charcoal-to-lavender gradient with a warm amber glow.

**Foreground:** one angled iPhone showing Smart Convert, one smaller Watch mockup, and two cropped supporting iPhones.

**Typography:** giant translucent `UNITX` behind the device. Smaller title block: `UnitX - Smart Unit Converter`.

**Pills:** `UI/UX Design`, `iOS Utility`, `AI Input`, `Watch App`.

**Micro details:** floating query chips such as `500 g to lb`, `100 USD to INR`, `Scan text`, `Save pair`.
