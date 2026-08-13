from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets" / "unitx"
OUT = ROOT / "rendered" / "unitx-behance-case-study.png"

W = 1600
H = 9800


def font(size, weight="regular"):
    candidates = {
        "regular": [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/Library/Fonts/Arial.ttf",
        ],
        "bold": [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/Library/Fonts/Arial Bold.ttf",
        ],
        "black": [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/Library/Fonts/Arial Bold.ttf",
        ],
    }
    for path in candidates.get(weight, candidates["regular"]):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


F = {
    "hero": font(78, "bold"),
    "display": font(58, "bold"),
    "section": font(54, "bold"),
    "h3": font(28, "bold"),
    "body": font(22),
    "body_lg": font(30),
    "small": font(18),
    "pill": font(25, "bold"),
    "micro": font(16, "bold"),
    "ghost": font(244, "bold"),
    "ghost_close": font(238, "bold"),
}


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def add_glow(img, center, radius, color, alpha=160):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = center
    d.ellipse((x - radius, y - radius, x + radius, y + radius), fill=rgba(color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius / 2))
    img.alpha_composite(layer)


def gradient_rect(img, box, top, bottom):
    x1, y1, x2, y2 = box
    h = y2 - y1
    grad = Image.new("RGBA", (x2 - x1, h), (0, 0, 0, 0))
    tr, tg, tb, ta = rgba(top)
    br, bg, bb, ba = rgba(bottom)
    gd = ImageDraw.Draw(grad)
    for i in range(h):
        t = i / max(h - 1, 1)
        color = (
            int(tr * (1 - t) + br * t),
            int(tg * (1 - t) + bg * t),
            int(tb * (1 - t) + bb * t),
            int(ta * (1 - t) + ba * t),
        )
        gd.line((0, i, x2 - x1, i), fill=color)
    img.alpha_composite(grad, (x1, y1))


def draw_wrapped(draw, text, xy, max_width, font_obj, fill, line_gap=8):
    x, y = xy
    words = text.split()
    lines = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textbbox((0, 0), test, font=font_obj)[2] <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    for line in lines:
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += font_obj.size + line_gap
    return y


def rounded_image(path, size, radius):
    im = Image.open(path).convert("RGBA")
    im_ratio = im.width / im.height
    target_ratio = size[0] / size[1]
    if im_ratio > target_ratio:
        nh = size[1]
        nw = int(nh * im_ratio)
    else:
        nw = size[0]
        nh = int(nw / im_ratio)
    im = im.resize((nw, nh), Image.LANCZOS)
    left = (nw - size[0]) // 2
    top = (nh - size[1]) // 2
    im = im.crop((left, top, left + size[0], top + size[1]))
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def shadowed_paste(base, layer, xy, blur=28, offset=(0, 18), alpha=90):
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    shadow_alpha = layer.getchannel("A").filter(ImageFilter.GaussianBlur(blur))
    shadow.putalpha(shadow_alpha.point(lambda p: min(p, alpha)))
    base.alpha_composite(shadow, (xy[0] + offset[0], xy[1] + offset[1]))
    base.alpha_composite(layer, xy)


def make_phone(path, size, radius=58):
    w, h = size
    outer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(outer)
    d.rounded_rectangle((0, 0, w, h), radius=radius, fill="#151219")
    pad = max(10, int(w * 0.035))
    screen = rounded_image(path, (w - pad * 2, h - pad * 2), radius - 12)
    outer.alpha_composite(screen, (pad, pad))
    notch_w = int(w * 0.28)
    notch_h = int(h * 0.04)
    d.rounded_rectangle(
        ((w - notch_w) // 2, pad + 10, (w + notch_w) // 2, pad + 10 + notch_h),
        radius=notch_h // 2,
        fill="#050509",
    )
    return outer


def paste_phone(base, path, xy, size, angle=0):
    phone = make_phone(path, size)
    if angle:
        phone = phone.rotate(angle, expand=True, resample=Image.BICUBIC)
    shadowed_paste(base, phone, xy, blur=36, offset=(0, 28), alpha=120)


def pill(draw, xy, text, fill="#f2d4ef", outline="#e9b7df", text_fill="#211825"):
    x, y = xy
    bbox = draw.textbbox((0, 0), text, font=F["pill"])
    w = bbox[2] + 62
    h = 62
    draw.rounded_rectangle((x, y, x + w, y + h), radius=31, fill=fill, outline=outline, width=1)
    draw.text((x + 31, y + 16), text, font=F["pill"], fill=text_fill)
    return w


def card(draw, box, fill="#ffffff", outline="#eadfec", radius=28):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=1)


def section_head(draw, y, title_a, title_b, body, dark=False):
    color = "#ffffff" if dark else "#1c1420"
    tint = "#d8a9d4" if not dark else "#b58cff"
    body_color = (255, 255, 255, 175) if dark else "#756d79"
    draw.text((132, y), title_a, font=F["section"], fill=color)
    x2 = 132 + draw.textbbox((0, 0), title_a + " ", font=F["section"])[2]
    draw.text((x2, y), title_b, font=F["section"], fill=tint)
    draw_wrapped(draw, body, (835, y + 4), 580, F["body"], body_color, 8)


def build():
    img = Image.new("RGBA", (W, H), "#fbfbfd")
    d = ImageDraw.Draw(img)

    y = 0
    # Hero
    gradient_rect(img, (0, y, W, y + 1120), "#fff8fb", "#fff6d9")
    add_glow(img, (220, 180), 330, "#f4c7ed", 185)
    add_glow(img, (1260, 170), 360, "#fff0b5", 160)
    pill(d, (132, 132), "UI/UX Design")
    pill(d, (360, 132), "iOS Utility")
    pill(d, (560, 132), "AI Input")
    pill(d, (740, 132), "Watch App")
    d.text((1320, 138), "2026", font=font(52, "bold"), fill="#151015")
    d.text((118, 390), "UNITX", font=F["ghost"], fill=(123, 70, 116, 22))
    icon = rounded_image(ASSETS / "current-app-icon.png", (120, 120), 30)
    shadowed_paste(img, icon, (132, 335), blur=22, offset=(0, 18), alpha=80)
    d.text((132, 500), "UnitX - Smart\nUnit Converter", font=F["hero"], fill="#17121b", spacing=2)
    draw_wrapped(
        d,
        "Type it. Say it. Scan it. Convert it. A faster way to move from real-world measurement moments to trustworthy answers.",
        (132, 685),
        540,
        F["body_lg"],
        "#5f5663",
        10,
    )
    paste_phone(img, ASSETS / "s2-manual-controls.png", (795, 415), (285, 575), angle=8)
    paste_phone(img, ASSETS / "s1-smart-convert.png", (955, 230), (360, 730), angle=-7)
    paste_phone(img, ASSETS / "s7-watch.png", (1190, 500), (260, 525), angle=11)
    card(d, (725, 780, 895, 842), fill=(255, 255, 255, 215), outline=(255, 255, 255, 120), radius=26)
    d.text((750, 798), "500 g to lb", font=F["body"], fill="#241927")
    card(d, (1190, 840, 1404, 902), fill=(255, 255, 255, 215), outline=(255, 255, 255, 120), radius=26)
    d.text((1215, 858), "100 USD to INR", font=F["body"], fill="#241927")
    card(d, (760, 610, 900, 672), fill="#eaffcf", outline="#eaffcf", radius=26)
    d.text((790, 628), "Scan text", font=F["body"], fill="#241927")
    y += 1120

    # Intro
    d.rectangle((0, y, W, y + 940), fill="#fbfbfd")
    draw_wrapped(
        d,
        "UnitX connects typed input, manual controls, camera scan, voice conversion, saved pairs, history, and Apple Watch into one flexible conversion workflow for everyday moments.",
        (132, y + 110),
        1160,
        font(47),
        "#17131b",
        18,
    )
    icon2 = rounded_image(ASSETS / "current-app-icon.png", (74, 74), 18)
    img.alpha_composite(icon2, (132, y + 360))
    d.text((225, y + 370), "Animesh Sharma", font=F["body"], fill="#17131b")
    d.text((225, y + 400), "Product design, SwiftUI implementation, QA", font=F["small"], fill="#706876")
    cols = [(132, 570, 620), (760, 570, 300), (1115, 570, 300)]
    blocks = [
        ("Overview", "Most converter apps solve the math, but still force users through setup. UnitX reframes conversion as a micro-task: express intent first, then edit or save the result."),
        ("Project Info", "Category / Utility App\nPlatform / iPhone and Watch\nModel / Freemium"),
        ("Services", "Product Strategy\nUI/UX Design\nSwiftUI Build\nLaunch QA"),
    ]
    for (x, yy, width), (head, body) in zip(cols, blocks):
        d.text((x, y + yy), head, font=F["h3"], fill="#17131b")
        for i, line in enumerate(body.split("\n")):
            draw_wrapped(d, line, (x, y + yy + 58 + i * 34), width, F["small"], "#746b78", 6)
    y += 940

    # Timeline
    d.rectangle((0, y, W, y + 760), fill="#fbfbfd")
    section_head(d, y + 70, "Project", " Timeline", "From strategy to UX, implementation, monetization, watch support, and release preparation.")
    phases = [
        ("Strategy", "Job stories, utility positioning, feature model, and freemium boundaries."),
        ("UX Design", "Smart input, manual handoff, camera flow, favorites, history, and watch IA."),
        ("Build", "SwiftUI screens, parser support, currency service, StoreKit, and Watch sync."),
        ("Launch", "QA checks, screenshot planning, App Store copy, monetization, and polish."),
    ]
    x0 = 170
    colw = 310
    for idx, (head, body) in enumerate(phases):
        x = x0 + idx * colw
        d.line((x, y + 250, x, y + 650), fill="#daceda", width=1)
        d.ellipse((x - 14, y + 248, x + 14, y + 276), fill="#e7ff9f")
        pill(d, (x + 28, y + 260), head)
        draw_wrapped(d, body, (x + 28, y + 505), 240, F["small"], "#746b76", 7)
    d.line((x0 + 4 * colw, y + 250, x0 + 4 * colw, y + 650), fill="#daceda", width=1)
    y += 760

    # Matrix
    d.rectangle((0, y, W, y + 820), fill="#fbfbfd")
    section_head(d, y + 70, "Competitive", " Analysis", "The opportunity was not more units. It was reducing friction across the different ways people encounter conversion needs.")
    headers = ["Manual", "Calculator", "Currency", "UnitX"]
    features = [
        ("Natural input", [0, 0, 0, 1]),
        ("Camera scan", [0, 0, 0, 1]),
        ("Manual precision", [1, 0, 0, 1]),
        ("Favorites/history", [0, 0, 0, 1]),
        ("Watch companion", [0, 0, 0, 1]),
    ]
    mx, my = 190, y + 260
    d.text((mx, my + 12), "", font=F["body"], fill="#000")
    for i, htxt in enumerate(headers):
        card(d, (mx + 260 + i * 235, my, mx + 430 + i * 235, my + 58), fill="#f7daf0", outline="#e9b7df", radius=29)
        d.text((mx + 285 + i * 235, my + 16), htxt, font=F["small"], fill="#211825")
    for r, (feat, vals) in enumerate(features):
        yy = my + 95 + r * 83
        card(d, (mx, yy, mx + 220, yy + 58), fill=(255, 255, 255, 200), outline="#e9dcea", radius=29)
        d.text((mx + 28, yy + 17), feat, font=F["small"], fill="#211825")
        for c, val in enumerate(vals):
            cx = mx + 345 + c * 235
            fill = "#ebffb6" if val else "#f0edf2"
            txt = "OK" if val else "--"
            tcolor = "#39510f" if val else "#a199a5"
            d.ellipse((cx, yy + 4, cx + 50, yy + 54), fill=fill)
            tw = d.textbbox((0, 0), txt, font=F["micro"])[2]
            d.text((cx + 25 - tw / 2, yy + 20), txt, font=F["micro"], fill=tcolor)
    y += 820

    # User jobs
    gradient_rect(img, (0, y, W, y + 950), "#fbfbfd", "#f8f4fb")
    add_glow(img, (1260, y + 270), 300, "#fff1b8", 140)
    section_head(d, y + 80, "User", " Jobs", "Conversion needs appear in small, scattered moments. The interface had to support speed, precision, recovery, and repeated use.")
    jobs = [
        ((210, y + 350), -7, "#f4e4f3", "Traveler", "Convert prices quickly without mental math while shopping or moving through a city."),
        ((870, y + 315), 6, "#effbd8", "Cook", "Adapt recipe measurements without leaving the cooking flow."),
        ((270, y + 610), 8, "#fff0be", "Worker", "Scan a label, screenshot, tool, or document and turn a visible value into an answer."),
        ((845, y + 625), -6, "#f4e4f3", "Repeat user", "Save common unit pairs and reopen recent conversions from history or Watch."),
    ]
    for pos, angle, fill, label, body in jobs:
        layer = Image.new("RGBA", (560, 190), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.rounded_rectangle((0, 0, 560, 190), radius=26, fill=fill)
        ld.text((36, 26), label.upper(), font=F["micro"], fill="#8a5f8a")
        draw_wrapped(ld, body, (36, 62), 490, F["body"], "#1d1720", 6)
        layer = layer.rotate(angle, expand=True, resample=Image.BICUBIC)
        shadowed_paste(img, layer, pos, blur=18, offset=(0, 18), alpha=70)
    y += 950

    # Flow
    d.rectangle((0, y, W, y + 850), fill="#0b0c12")
    add_glow(img, (320, y + 240), 280, "#75d5e4", 80)
    add_glow(img, (1260, y + 650), 280, "#f1b45a", 70)
    section_head(d, y + 90, "Product", " Map", "Every input path leads to the same structured conversion model, so users can inspect, edit, save, replay, or continue on Watch.", True)
    left = ["Type a query", "Speak conversion", "Scan text", "Manual controls"]
    right = ["Save favorite", "Replay history", "Open manual", "Continue on Watch"]
    for i, txt in enumerate(left):
        card(d, (132, y + 305 + i * 92, 450, y + 370 + i * 92), fill="#20232f", outline="#393d4b", radius=26)
        d.text((162, y + 323 + i * 92), txt, font=F["body"], fill="#ffffff")
    d.text((515, y + 440), "->", font=font(62, "bold"), fill=(255, 255, 255, 90))
    card(d, (630, y + 315, 970, y + 630), fill="#171923", outline=(255, 255, 255, 40), radius=54)
    d.text((695, y + 410), "Smart Result", font=font(42, "bold"), fill="#ffffff")
    draw_wrapped(d, "interpreted value, units, category, and editable output", (690, y + 468), 230, F["small"], (255, 255, 255, 165), 6)
    d.text((1030, y + 440), "->", font=font(62, "bold"), fill=(255, 255, 255, 90))
    for i, txt in enumerate(right):
        card(d, (1132, y + 305 + i * 92, 1450, y + 370 + i * 92), fill="#20232f", outline="#393d4b", radius=26)
        d.text((1162, y + 323 + i * 92), txt, font=F["body"], fill="#ffffff")
    y += 850

    # Screens
    gradient_rect(img, (0, y, W, y + 1120), "#fbfbfd", "#fff8ef")
    section_head(d, y + 80, "Final", " Experience", "The final app balances smart input with precision controls, camera workflows, retention loops, and watch access.")
    gallery = [
        ("s1-smart-convert.png", "Smart Convert", "Start with intent instead of setup."),
        ("s2-manual-controls.png", "Manual Control", "Precise category, unit, value, and swap controls."),
        ("s4-scan-anything.png", "Camera Scan", "Turn nearby printed text into a conversion moment."),
        ("s7-watch.png", "Watch", "Repeat common conversions away from the phone."),
    ]
    gx = 132
    for i, (file, title, desc) in enumerate(gallery):
        x = gx + i * 345
        paste_phone(img, ASSETS / file, (x, y + 295), (280, 565), angle=0)
        d.text((x, y + 900), title, font=F["h3"], fill="#17131b")
        draw_wrapped(d, desc, (x, y + 940), 280, F["small"], "#746c78", 5)
    y += 1120

    # System
    d.rectangle((0, y, W, y + 820), fill="#fbfbfd")
    section_head(d, y + 80, "Visual", " System", "A dark, crisp utility language softened for Behance through pastel boards, rounded editorial elements, and calm annotations.")
    swatches = [
        ("#08090d", "Charcoal", "#ffffff"),
        ("#75d5e4", "Cyan", "#061114"),
        ("#f1b45a", "Amber", "#201305"),
        ("#a678ff", "Violet", "#ffffff"),
        ("#f2d8ef", "Soft UI", "#2a172a"),
        ("#f6f0e0", "Warm paper", "#251d12"),
    ]
    for i, (c, name, tc) in enumerate(swatches):
        x = 132 + (i % 3) * 180
        yy = y + 300 + (i // 3) * 190
        card(d, (x, yy, x + 154, yy + 154), fill=c, outline=c, radius=26)
        d.text((x + 18, yy + 112), name, font=F["micro"], fill=tc)
    cards = [
        ("Result-first hierarchy", "Large values, compact labels, and clear source or target units keep answers readable at a glance."),
        ("Recoverable workflows", "Smart results move into manual control, favorites reopen, and history gives users a way back."),
        ("Premium utility", "Pro features are attached to repeated value: voice, camera, Watch, history, favorites, and themes."),
    ]
    for i, (head, body) in enumerate(cards):
        yy = y + 300 + i * 145
        card(d, (760, yy, 1420, yy + 115), fill="#ffffff", outline="#ece3ee", radius=26)
        d.text((800, yy + 25), head, font=F["h3"], fill="#17131b")
        draw_wrapped(d, body, (800, yy + 64), 560, F["small"], "#746c78", 5)
    y += 820

    # Trust
    gradient_rect(img, (0, y, W, y + 760), "#fbfbfd", "#fff8ef")
    add_glow(img, (1240, y + 140), 300, "#e8ffb3", 130)
    section_head(d, y + 80, "Trust And", " QA", "Reliability is part of the design. The app has to communicate uncertainty and keep editable state aligned with the shown result.")
    trust = [
        ("Smart handoff", "Smart results open manual conversion with fresh presentation state."),
        ("Scan recovery", "Camera recognition can be ambiguous, so editing stays available."),
        ("Currency limits", "Rates are useful without pretending to be financial precision."),
        ("Watch repeat use", "Favorites and recents make the companion app practical."),
    ]
    for i, (head, body) in enumerate(trust):
        x = 132 + i * 345
        card(d, (x, y + 315, x + 295, y + 585), fill=(255, 255, 255, 210), outline="#e5d2e6", radius=34)
        d.ellipse((x + 32, y + 345, x + 86, y + 399), fill="#e9ffad")
        d.text((x + 48, y + 361), "OK", font=F["micro"], fill="#3c520d")
        d.text((x + 32, y + 460), head, font=F["h3"], fill="#17131b")
        draw_wrapped(d, body, (x + 32, y + 503), 230, F["small"], "#746c78", 5)
    y += 760

    # Closing
    d.rectangle((0, y, W, y + 900), fill="#07080d")
    add_glow(img, (800, y + 90), 420, "#75d5e4", 60)
    add_glow(img, (300, y + 720), 350, "#f1b45a", 55)
    d.text((126, y + 590), "UNITX", font=F["ghost_close"], fill=(255, 255, 255, 4))
    draw_wrapped(d, "Conversion is not one workflow. It is a family of moments.", (330, y + 210), 940, font(70, "bold"), "#ffffff", 18)
    draw_wrapped(
        d,
        "The best version of UnitX is not the converter with the most categories. It is the converter that lets people reach the answer in the way the moment naturally allows.",
        (360, y + 520),
        860,
        F["body_lg"],
        (255, 255, 255, 185),
        10,
    )
    d.text((510, y + 765), "CASE STUDY / UNITX / PRODUCT DESIGN AND SWIFTUI", font=F["micro"], fill=(255, 255, 255, 120))
    y += 900

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img = img.crop((0, 0, W, y)).convert("RGB")
    img.save(OUT, quality=95)
    print(OUT)
    print(f"{W}x{y}")


if __name__ == "__main__":
    build()
