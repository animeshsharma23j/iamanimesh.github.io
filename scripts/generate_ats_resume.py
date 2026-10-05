import os
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


OUTPUT = Path(os.environ.get("ATS_RESUME_OUTPUT", "assets/animesh-sharma-ats-resume.pdf"))


def p(text, style):
    return Paragraph(text, style)


def role(title, company, dates, bullets, styles):
    content = [p(f"<b>{title}</b> | {company} | {dates}", styles["role"])]
    content.extend(p(f"- {item}", styles["bullet"]) for item in bullets)
    content.append(Spacer(1, 6.5))
    return KeepTogether(content)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, rightMargin=0.6 * inch, leftMargin=0.6 * inch,
        topMargin=0.46 * inch, bottomMargin=0.46 * inch,
        title="Animesh Sharma - ATS Resume", author="Animesh Sharma",
        subject="Senior UX Designer resume",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="name", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=23, spaceAfter=2, textColor=HexColor("#15191D")))
    styles.add(ParagraphStyle(name="resume_title", parent=styles["Normal"], fontName="Helvetica", fontSize=10.2, leading=13.2, textColor=HexColor("#333A42")))
    styles.add(ParagraphStyle(name="contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.9, leading=12, textColor=HexColor("#333A42"), linkUnderline=False))
    styles.add(ParagraphStyle(name="section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10.2, leading=12.8, spaceBefore=9, spaceAfter=4, textColor=HexColor("#1B717E")))
    styles.add(ParagraphStyle(name="body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.2, leading=12.2, textColor=HexColor("#20262D")))
    styles.add(ParagraphStyle(name="role", parent=styles["Normal"], fontName="Helvetica", fontSize=9.35, leading=12.6, textColor=HexColor("#11161B")))
    styles.add(ParagraphStyle(name="bullet", parent=styles["Normal"], leftIndent=8, firstLineIndent=-7, fontName="Helvetica", fontSize=8.85, leading=11.7, textColor=HexColor("#20262D")))

    story = [
        p("ANIMESH SHARMA", styles["name"]),
        p("Senior UX Designer | UX Research, Complex Workflows &amp; Shipped iOS Products", styles["resume_title"]),
        p(
            "New Delhi, India | +91 9582137784 | "
            "<link href='mailto:animeshsharma23j@gmail.com'>animeshsharma23j@gmail.com</link> | "
            "Portfolio: <link href='https://www.iamanimesh.com'>www.iamanimesh.com</link><br/>"
            "LinkedIn: <link href='https://www.linkedin.com/in/animeshsharma23'>linkedin.com/in/animeshsharma23</link>",
            styles["contact"],
        ),
        Spacer(1, 6), HRFlowable(width="100%", thickness=0.8, color=HexColor("#9AA4AE")),
        p("Professional Summary", styles["section"]),
        p("Senior UX designer with 10+ years across government, enterprise, and consumer products. Leads field research on high-stakes, rule-bound workflows and turns it into decisions engineering and policy teams can act on. Founded Galaxy Studio (30+ apps, 4M+ downloads), and now designs and builds six live iOS apps end to end, AI-assisted throughout.", styles["body"]),
        p("Core Skills", styles["section"]),
        p("Product Design; UX Research (contextual inquiry, interviews, surveys and questionnaires, thematic analysis); Interaction Design; Information Architecture; Complex Workflow Design; Prototyping; Usability Testing; Design Systems; Accessibility; Figma; SwiftUI; AI-Assisted Design &amp; Development (Claude Code, Codex)", styles["body"]),
        p("Professional Experience", styles["section"]),
        role("Senior UX Designer", "Central Board of Direct Taxes (Income Tax)", "2021-Present", [
            "ITBA (case-disposal system for ~45,000 tax personnel across ~780 offices): led an 8-12 week field study with participants across all six officer cadres plus a 13-source documentary review, reducing 40+ symptoms to six root causes and separating what design could fix from platform limits.",
            "Redesigned four moments in the assessment flow (explicit case states, a clear primary action, persistent case context, and validation before submission) in a team of 3 designers, 1 PM, and 3-5 engineers; in validation sessions officers identified blocked cases faster from status alone.",
            "Resolved a density conflict between working cadres and reviewing officers by tying every field removal to a procedural requirement, so the simpler screen stayed defensible on audit.",
            "Conducted filer interviews for the Income Tax 2.0 website overhaul (Infosys x Income Tax Department), and built two live ITR filing concepts with a structured feedback instrument to test guided form selection and AIS reconciliation.",
        ], styles),
        role("UX Designer", "Independent / Freelance (alongside full-time roles)", "2019-Present", [
            "Designed and built six live App Store apps in SwiftUI for iPhone, iPad, and Apple Watch since Oct 2025: UnitX, BuildX, TradeBill, JobBook, Recital, and RateBook.",
            "UnitX: a 20-app competitive audit set the brief (offline, ad-free, free favourites); holds a 5.0 average across 25+ ratings.",
            "Trade suite (BuildX, TradeBill, JobBook, RateBook): coded 7,439 App Store reviews across 14 competing apps and six markets into five themes, and traced every product decision to one of them.",
            "Created 100+ smartwatch faces for boAt Lifestyle India, and delivered mobile, web, and e-commerce product work for clients including Country Delight and Wizikey.",
        ], styles),
        role("UI / UX Designer", "Comptroller General of Defence Accounts (CGDA) / DRDO", "2019-2021", [
            "Ran per-role working sessions with 15 participants across all five roles in the bill-clearance chain, plus a workaround audit, identifying four blockers behind stalled bills.",
            "Used the audit evidence to shift the department's brief from a visual refresh to structural change; submitted four recommendations, each traced to a blocker, in a team of 2 designers, 1 PM, and 3 engineers.",
        ], styles),
        role("Founder &amp; UI / UX Designer", "Galaxy Studio", "2016-2019", [
            "Founded the studio and shipped 30+ Windows Phone, Windows 10, Nokia Asha, and BlackBerry 10 apps: 4M+ downloads, 4.0+ average rating, and US$100K+ revenue.",
            "Designed Yube, eXpress Player, FitVid, and SuperHeroes Wallpapers; studio apps were featured by Microsoft, Nokia, and Windows Central.",
        ], styles),
        role("QA Analyst", "IBM India Pvt. Ltd.", "2014-2016", [
            "Functional, regression, and usability testing on McKesson Healthcare and C2C Rail projects.",
        ], styles),
        p("Recognition", styles["section"]),
        p("Microsoft Student Partner (2012-2013); Top 10 in Microsoft DVLUP, a Windows Phone developer reward program.", styles["body"]),
        p("Certifications &amp; Education", styles["section"]),
        p("Post Graduate Certificate in UX Design &amp; HCI, Indian Institute of Technology (IIT) Guwahati, 2023<br/>Google UX Design Professional Certificate<br/>Bachelor of Technology (ECE), Netaji Subhash University of Technology (East Campus), 2009-2013", styles["body"]),
    ]
    document.build(story)


if __name__ == "__main__":
    main()
