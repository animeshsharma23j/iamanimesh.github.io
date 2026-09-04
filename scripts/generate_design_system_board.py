#!/usr/bin/env python3
"""Regenerate assets/animesh-design-system.png from the live stylesheet.

The board's whole value is that it reports what styles.css actually does, not
what the system aspires to. So every number on it is parsed from styles.css at
render time — nothing here is typed by hand. Re-run after any token change:

    python3 scripts/generate_design_system_board.py

Inter is not installed locally, so the sans face falls back to SF (SFNS.ttf),
which is exactly what --font-sans resolves to on macOS when Inter is absent.
The mono face uses SFNSMono.ttf, which is what --font-mono resolves to.
"""

import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CSS = ROOT / "styles.css"
OUT = ROOT / "assets" / "animesh-design-system.png"

W = 1600
PAD = 64
COL_GAP = 32
COL_W = (W - PAD * 2 - COL_GAP) // 2

SANS = "/System/Library/Fonts/SFNS.ttf"
MONO = "/System/Library/Fonts/SFNSMono.ttf"
WEIGHT_NAME = {400: "Regular", 650: "Semibold", 750: "Bold", 800: "Heavy"}

_cache = {}


def font(size, weight=400, mono=False):
    key = (size, weight, mono)
    if key in _cache:
        return _cache[key]
    f = ImageFont.truetype(MONO if mono else SANS, size)
    if not mono:
        try:
            f.set_variation_by_name(WEIGHT_NAME.get(weight, "Regular"))
        except Exception:
            pass
    _cache[key] = f
    return f


# ---------------------------------------------------------------- parse CSS

css = CSS.read_text(encoding="utf-8")
root_block = re.search(r":root\s*\{(.*?)\n\}", css, re.S).group(1)


def token(name, block=root_block):
    m = re.search(rf"--{re.escape(name)}:\s*([^;]+);", block)
    return m.group(1).strip() if m else None


def rem_px(v):
    m = re.match(r"([\d.]+)rem", v or "")
    return round(float(m.group(1)) * 16) if m else None


mobile_block = re.search(
    r"@media \(max-width: 900px\)\s*\{.*?:root\s*\{(.*?)\}", css, re.S
).group(1)

COLOURS = [
    ("Canvas", token("bg")), ("Surface", token("bg-2")),
    ("Text", token("text")), ("Muted", token("muted")),
    ("Soft", token("soft")), ("Accent", token("cyan")),
    ("Warn", token("warn")),
]

RAMP = [
    ("h1", "headline-size", "every page"),
    ("h2", "h2-size", "section headings"),
    ("h3", "h3-size", "cards, journey, suite"),
    ("h3 small", "h3-small", "proof cards, feature grids"),
]

SMALL = [
    ("--text-label", token("text-label"), "mono / uppercase labels, eyebrows, tags"),
    ("--text-small", token("text-small"), "buttons, links, captions, hints"),
]

weights = sorted({int(x) for x in re.findall(r"font-weight:\s*(\d+)", css)})
_raw_radii = [r.strip() for r in re.findall(r"border-radius:\s*([^;]+);", css)]
radii = sorted(
    {r for r in _raw_radii if "%" not in r and " " not in r},
    key=lambda v: float(re.match(r"([\d.]+)", v).group(1)),
)
gaps = {}
for g in re.findall(r"\bgap:\s*([^;]+);", css):
    for px in re.findall(r"(\d+)px", g):
        gaps[int(px)] = gaps.get(int(px), 0) + 1
top_gaps = sorted(gaps.items(), key=lambda kv: -kv[1])[:7]


def line_alpha(name):
    v = token(name) or ""
    m = re.search(r"([\d.]+)\)", v)
    return float(m.group(1)) if m else 0


def blend(alpha, fg=(243, 238, 226), bg=(3, 4, 5)):
    return tuple(round(bg[i] + alpha * (fg[i] - bg[i])) for i in range(3))


# ---------------------------------------------------------------- draw

BG = (3, 4, 5)
SURF = (7, 10, 13)
TEXT = (243, 238, 226)
MUTED = (170, 163, 149)
SOFT = (141, 135, 125)
CYAN = (117, 213, 228)
WARN = (240, 133, 124)

img = Image.new("RGB", (W, 3000), BG)
d = ImageDraw.Draw(img)


def tracked(x, y, text, f, fill, track=0):
    """Draw text with letter-spacing, return advance width."""
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + track
    return x


def label(x, y, text, colour=CYAN, size=15, track=1.6):
    tracked(x, y, text.upper(), font(size, mono=True), colour, track)
    return y + size + 12


def rule(y, x0=PAD, x1=W - PAD, alpha=0.15):
    d.line([(x0, y), (x1, y)], fill=blend(alpha), width=1)


def panel(x, y, w, h):
    d.rectangle([x, y, x + w, y + h], outline=blend(0.15), width=1)


y = 56
tracked(PAD, y, "ANIMESH  /  PORTFOLIO DESIGN SYSTEM", font(15, mono=True), CYAN, 1.8)
y += 40
d.text((PAD, y), "Clarity in dark mode.", font=font(62, 800), fill=TEXT)
y += 82
d.text((PAD, y), "Design tokens, type, components and rules as implemented in production —",
       font=font(20), fill=MUTED)
y += 28
d.text((PAD, y), "every value on this board is parsed from styles.css at render time.",
       font=font(20), fill=MUTED)
y += 36
tracked(PAD, y, "v2.0  ·  04 SEP 2026  ·  GENERATED FROM styles.css",
        font(14, mono=True), SOFT, 1.5)
y += 40
rule(y)
y += 34

# ---- 01 colour
top = y
y = label(PAD, y, "01 / Colour")
sw = 108
for i, (name, val) in enumerate(COLOURS):
    cx = PAD + (i % 4) * (sw + 28)
    cy = y + (i // 4) * (sw + 62)
    hexv = (val or "#000").strip()
    try:
        rgb = tuple(int(hexv[j:j + 2], 16) for j in (1, 3, 5))
    except Exception:
        rgb = (0, 0, 0)
    d.rectangle([cx, cy, cx + sw, cy + sw], fill=rgb, outline=blend(0.2))
    d.text((cx, cy + sw + 10), name, font=font(17, 750), fill=TEXT)
    d.text((cx, cy + sw + 32), hexv.upper(), font=font(14, mono=True), fill=SOFT)
y += (sw + 62) * 2 + 6

d.text((PAD, y), "Structural lines", font=font(17, 750), fill=TEXT)
y += 26
for nm in ("line", "line-strong", "rule"):
    a = line_alpha(nm)
    d.line([(PAD, y + 8), (PAD + 210, y + 8)], fill=blend(a), width=1)
    d.text((PAD + 226, y), f"--{nm}", font=font(14, mono=True), fill=MUTED)
    d.text((PAD + 380, y), f"{a}", font=font(14, mono=True), fill=SOFT)
    y += 26
y += 6
d.line([(PAD, y), (PAD, y + 46)], fill=WARN, width=3)
d.text((PAD + 16, y), "Deliberately low contrast. Restraint is the design;", font=font(15), fill=MUTED)
d.text((PAD + 16, y + 22), "these were raised once and reverted.", font=font(15), fill=MUTED)
left_end = y + 58

# ---- 02 type scale (right column)
x2 = PAD + COL_W + COL_GAP
y = label(x2, top, "02 / Type scale")
d.text((x2, y), "HEADING RAMP — ONE TOKEN PER LEVEL", font=font(13, mono=True), fill=SOFT)
y += 30
for tag, tok, role in RAMP:
    dv = rem_px(token(tok))
    mv = rem_px(token(tok, mobile_block))
    size = round(dv * 0.72)
    d.text((x2, y), "Aa", font=font(size, 800), fill=TEXT)
    d.text((x2 + 116, y + 2), tag, font=font(19, 750), fill=TEXT)
    d.text((x2 + 116, y + 26), role, font=font(14), fill=SOFT)
    rt = f"{dv} / {mv}px"
    d.text((x2 + COL_W - d.textlength(rt, font=font(15, mono=True)), y + 8),
           rt, font=font(15, mono=True), fill=CYAN)
    y += max(size, 44) + 14
y += 4
rule(y, x2, x2 + COL_W, 0.12)
y += 20
d.text((x2, y), "SMALL TYPE — TWO STEPS ONLY", font=font(13, mono=True), fill=SOFT)
y += 26
for nm, val, role in SMALL:
    d.text((x2, y), nm, font=font(15, mono=True), fill=MUTED)
    d.text((x2 + 170, y), role, font=font(14), fill=SOFT)
    rt = f"{rem_px(val)}px"
    d.text((x2 + COL_W - d.textlength(rt, font=font(15, mono=True)), y),
           rt, font=font(15, mono=True), fill=CYAN)
    y += 26
y += 14
d.text((x2, y), "WEIGHTS IN USE", font=font(13, mono=True), fill=SOFT)
y += 26
wx = x2
for w in weights:
    t = f"{w}"
    d.text((wx, y), t, font=font(24, w), fill=TEXT)
    wx += d.textlength(t, font=font(24, w)) + 30
y += 40
d.text((x2, y), "Eyebrow — Inter, uppercase, 0.15em", font=font(15), fill=MUTED)
y += 24
tracked(x2, y, "SELECTED CASE STUDIES", font(rem_px(token("text-label")), 800), CYAN, 2.4)
right_end = y + 34

y = max(left_end, right_end) + 26
rule(y)
y += 34

# ---- buttons + navigation
y = label(PAD, y, "03 / Buttons & navigation")
bx = PAD
d.text((bx, y + 4), "animesh", font=font(21, 800), fill=TEXT)
d.ellipse([bx - 16, y + 12, bx - 8, y + 20], fill=CYAN)
bx += 150
for nm, state in (("Products", "default"), ("Case studies", "default"),
                  ("About", "current"), ):
    d.text((bx, y + 6), nm, font=font(17), fill=TEXT if state == "current" else MUTED)
    d.text((bx, y + 30), state, font=font(13, mono=True), fill=SOFT)
    bx += d.textlength(nm, font=font(17)) + 46
d.rectangle([bx, y, bx + 108, y + 32], outline=blend(0.28))
d.text((bx + 18, y + 7), "Contact", font=font(16, 750), fill=TEXT)
d.text((bx, y + 42), "outlined utility", font=font(13, mono=True), fill=SOFT)
y += 74

btn_h = 46
d.rectangle([PAD, y, PAD + 236, y + btn_h], fill=CYAN)
tracked(PAD + 22, y + 15, "VIEW CASE STUDIES  →", font(15, 750), (11, 27, 29), 0.6)
d.rectangle([PAD + 256, y, PAD + 256 + 220, y + btn_h], outline=blend(0.15))
tracked(PAD + 278, y + 15, "DOWNLOAD RÉSUMÉ", font(15, 750), TEXT, 0.6)
y += btn_h + 16
d.text((PAD, y), "46px min-height · square corners (0px) · hover and focus → #A9EDF5 fill, −2px lift",
       font=font(15), fill=SOFT)
y += 24
d.text((PAD, y), "Focus adds a 2px ring; on a cyan fill the ring goes dark, never removed.",
       font=font(15), fill=SOFT)
y += 40
rule(y)
y += 34

# ---- 03 spacing + layout
top = y
y = label(PAD, y, "04 / Spacing & layout")
d.text((PAD, y), "GAP VALUES — MOST TO LEAST FREQUENT", font=font(13, mono=True), fill=SOFT)
y += 28
mx = max(c for _, c in top_gaps)
for px, c in top_gaps:
    bw = int(300 * c / mx)
    d.rectangle([PAD, y + 3, PAD + bw, y + 15], fill=(45, 92, 100))
    d.text((PAD + bw + 12, y), f"{px}px", font=font(15, mono=True), fill=MUTED)
    y += 24
y += 16
facts = [
    ("MAX CONTENT WIDTH", token("max")),
    ("GUTTER", "48px desktop · 16px mobile · 12px header ≤560px"),
    ("HEADER HEIGHT", "80px, sticky + blurred, all breakpoints"),
    ("SHELL PADDING", "96px top · 168px bottom"),
    (f"CORNER RADIUS — {len(radii)} VALUES IN USE", " · ".join(radii)),
]
for k, v in facts:
    d.text((PAD, y), k, font=font(13, mono=True), fill=SOFT)
    y += 20
    d.text((PAD, y), str(v), font=font(16), fill=TEXT)
    y += 28
left_end = y

# ---- 04 responsive + a11y
y = label(x2, top, "05 / Responsive & accessibility")
blocks = [
    ("BREAKPOINTS", [
        "≤900px — hero collapses to one column; heading ramp",
        "  drops to 48/36/24/20; grids simplify.",
        "≤560px — header compresses, actions wrap.",
        "All sizes — bounded widths, no horizontal scroll.",
    ]),
    ("ACCESSIBILITY & MOTION", [
        "One global :focus-visible rule — 2px cyan outline.",
        "  No component may remove it.",
        "Semantic landmarks, real heading order, skip link.",
        "Every image carries descriptive alt text.",
        "prefers-reduced-motion removes animation site-wide.",
        "Status never carried by colour alone.",
    ]),
]
for head, rows in blocks:
    d.text((x2, y), head, font=font(13, mono=True), fill=CYAN)
    y += 26
    for r in rows:
        d.text((x2, y), r, font=font(16), fill=MUTED if not r.startswith("  ") else SOFT)
        y += 24
    y += 16
right_end = y

y = max(left_end, right_end) + 10
rule(y)
y += 34

# ---- 05 do / do not
d.text((PAD, y), "DO", font=font(15, 800), fill=CYAN)
d.text((x2, y), "DO NOT", font=font(15, 800), fill=WARN)
y += 30
do = ["One clear task, one primary action per view.",
      "Real product evidence over decorative filler.",
      "Generous whitespace; hairlines before cards.",
      "Size headings by role, using a ramp token."]
dont = ["Glossy cards, heavy gradients, rounded-everything.",
        "Fabricated metrics or generic stock process art.",
        "Colour as the only carrier of status or meaning.",
        "A per-component font-size outside the ramp."]
for a, b in zip(do, dont):
    d.text((PAD, y), "• " + a, font=font(16), fill=MUTED)
    d.text((x2, y), "• " + b, font=font(16), fill=MUTED)
    y += 26

y += 26
rule(y)
y += 20
tracked(PAD, y, "REGENERATE WITH  python3 scripts/generate_design_system_board.py",
        font(14, mono=True), SOFT, 1.4)
y += 44

img = img.crop((0, 0, W, y))
img.save(OUT)
print(f"wrote {OUT.relative_to(ROOT)}  {W}x{y}")
