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
        subject="Senior Product and UX Designer resume",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="name", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=23, spaceAfter=2, textColor=HexColor("#15191D")))
    styles.add(ParagraphStyle(name="resume_title", parent=styles["Normal"], fontName="Helvetica", fontSize=10.2, leading=13.2, textColor=HexColor("#333A42")))
    styles.add(ParagraphStyle(name="contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.9, leading=12, textColor=HexColor("#333A42"), linkUnderline=False))
    styles.add(ParagraphStyle(name="section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10.2, leading=12.8, spaceBefore=9, spaceAfter=4, textColor=HexColor("#1C5D80")))
    styles.add(ParagraphStyle(name="body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.2, leading=12.2, textColor=HexColor("#20262D")))
    styles.add(ParagraphStyle(name="role", parent=styles["Normal"], fontName="Helvetica", fontSize=9.35, leading=12.6, textColor=HexColor("#11161B")))
    styles.add(ParagraphStyle(name="bullet", parent=styles["Normal"], leftIndent=8, firstLineIndent=-7, fontName="Helvetica", fontSize=8.85, leading=11.7, textColor=HexColor("#20262D")))

    story = [
        p("ANIMESH SHARMA", styles["name"]),
        p("Senior Product &amp; UX Designer | Mobile, Web, Wearables &amp; Public-Service Systems", styles["resume_title"]),
        p(
            "New Delhi, India | +91 9582137784 | "
            "<link href='mailto:animeshsharma23j@gmail.com'>animeshsharma23j@gmail.com</link> | "
            "Portfolio: <link href='https://www.iamanimesh.com'>iamanimesh.com</link><br/>"
            "LinkedIn: <link href='https://www.linkedin.com/in/animesh-sharma-57829344/'>linkedin.com/in/animesh-sharma-57829344</link>",
            styles["contact"],
        ),
        Spacer(1, 6), HRFlowable(width="100%", thickness=0.8, color=HexColor("#9AA4AE")),
        p("Professional Summary", styles["section"]),
        p("Senior product and UX designer with 10+ years of experience across public-service, enterprise, mobile, web, and wearable products. Leads user research and translates complex workflows into accessible user flows, interaction designs, prototypes, and testable experiences. Experience includes Income Tax digital services and a team portfolio of 30+ Windows-platform apps reaching 4M+ downloads.", styles["body"]),
        p("Core Skills", styles["section"]),
        p("Product Design; UX Strategy; UX Research; Service Design; Interaction Design; Information Architecture; Design Systems; Accessibility; Complex Workflow Design; User Flows; Wireframing; Prototyping; Usability Testing; A/B Testing; Design QA; Figma; Adobe Illustrator; AI-Assisted Design &amp; Development (Claude Code, Codex)", styles["body"]),
        p("Professional Experience", styles["section"]),
        role("Senior UX Designer", "Central Board of Direct Taxes (Income Tax)", "2021-Present", [
            "Lead UX research and contribute UI, prototypes, and user-testing materials for Income Tax Return (ITR) and public-service experiences.",
            "Contributed to the Income Tax website redesign and improvements to ITBA, an internal case-disposal tool, translating complex tax and operational tasks into clearer user flows.",
        ], styles),
        role("UX Designer", "Independent / Freelance", "2019-Present", [
            "Deliver product design for mobile, web, e-commerce, and wearable products, from research and user flows through interaction design, prototypes, and testing.",
            "Created 100+ smartwatch face designs for boAt Lifestyle India and contributed product work for clients including Country Delight and Wizikey.",
        ], styles),
        role("UI / UX Designer", "Comptroller General of Defence Accounts (CGDA) / DRDO", "2019-2021", [
            "Conducted UX research and designed workflows, information architecture, wireframes, prototypes, navigation, and testing plans for internal websites, apps, and accounting systems.",
            "Clarified employee bill-clearance workflows through interaction design for complex enterprise processes.",
        ], styles),
        role("UI / UX Designer", "Galaxy Studio", "2016-2019", [
            "Designed Windows Phone, Windows 10, Nokia Asha, and BlackBerry OS 10 applications in a team portfolio of 30+ apps with 4M+ downloads.",
            "Designed Yube, eXpress Player, FitVid, and SuperHeroes Wallpapers; selected apps were featured in the Windows App Store and Windows Central.",
        ], styles),
        role("QA Analyst", "IBM India Pvt. Ltd.", "2014-2016", [
            "Created and executed test cases across McKesson Healthcare and C2C Rail projects, covering unit, integration, interface, sanity, regression, usability, and beta testing.",
        ], styles),
        p("Recognition", styles["section"]),
        p("Microsoft Student Partner (2012-2013); Top 10 in Microsoft DVLUP, a Windows Phone developer reward program.", styles["body"]),
        p("Education", styles["section"]),
        p("Post Graduate Certificate in UX Design &amp; HCI, Indian Institute of Technology (IIT), Guwahati, 2023<br/>Bachelor of Technology (ECE), Netaji Subhash University of Technology (East Campus), 2009-2013", styles["body"]),
    ]
    document.build(story)


if __name__ == "__main__":
    main()
