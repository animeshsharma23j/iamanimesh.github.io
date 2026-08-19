from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


OUTPUT = Path("assets/animesh-sharma-ats-resume.pdf")


def p(text, style):
    return Paragraph(text, style)


def role(title, company, dates, bullets, styles):
    content = [p(f"<b>{title}</b> | {company} | {dates}", styles["role"])]
    content.extend(p(f"• {item}", styles["bullet"]) for item in bullets)
    content.append(Spacer(1, 7))
    return KeepTogether(content)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, rightMargin=0.62 * inch, leftMargin=0.62 * inch,
        topMargin=0.52 * inch, bottomMargin=0.52 * inch,
        title="Animesh Sharma - ATS Resume", author="Animesh Sharma",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="name", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=23, spaceAfter=2, textColor=HexColor("#15191D")))
    styles.add(ParagraphStyle(name="resume_title", parent=styles["Normal"], fontName="Helvetica", fontSize=10.5, leading=14, textColor=HexColor("#333A42")))
    styles.add(ParagraphStyle(name="section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10, leading=13, spaceBefore=10, spaceAfter=4, textColor=HexColor("#1C5D80")))
    styles.add(ParagraphStyle(name="body", parent=styles["Normal"], fontName="Helvetica", fontSize=9.2, leading=12.4, textColor=HexColor("#20262D")))
    styles.add(ParagraphStyle(name="role", parent=styles["Normal"], fontName="Helvetica", fontSize=9.4, leading=13, textColor=HexColor("#11161B")))
    styles.add(ParagraphStyle(name="bullet", parent=styles["Normal"], leftIndent=8, firstLineIndent=-7, fontName="Helvetica", fontSize=8.9, leading=12, textColor=HexColor("#20262D")))

    story = [
        p("ANIMESH SHARMA", styles["name"]),
        p("Product / UX Designer | Mobile, Web, Wearables &amp; Public-Service Systems", styles["resume_title"]),
        p("+91 9582137784 | animeshsharma23j@gmail.com | www.iamanimesh.com", styles["resume_title"]),
        Spacer(1, 7), HRFlowable(width="100%", thickness=0.8, color=HexColor("#9AA4AE")),
        p("Professional Summary", styles["section"]),
        p("Product and UX designer with experience across mobile, web, smartwatch, enterprise, and public-service products. Skilled in user research, interaction design, design systems, accessibility, wireframes, prototypes, usability and A/B testing, and translating complex workflows into clear, practical experiences. Career includes 20+ Windows-platform apps reaching 4M+ downloads and work on Income Tax digital services.", styles["body"]),
        p("Core Skills", styles["section"]),
        p("Product Design; UX Research; Interaction Design; Information Architecture; Design Systems; Accessibility; User Flows; Wireframing; Prototyping; Usability Testing; A/B Testing; User Personas; Storyboards; Figma; Adobe Illustrator; AI-Assisted Design &amp; Development (Claude Code, Codex)", styles["body"]),
        p("Professional Experience", styles["section"]),
        role("Senior UX Designer", "Central Board of Direct Taxes (Income Tax)", "2021-Present", [
            "Contributed to the redesign and overhaul of the Income Tax website and improvements to ITBA, a case-disposal tool.",
            "Created UI elements, wireframes, prototypes, and user-testing materials for ITR experiences and Government of India mobile apps.",
        ], styles),
        role("UX Designer", "Independent / Freelance", "2019-Present", [
            "Designed watch faces for boAt Lifestyle India and contributed mobile and web design work for e-commerce and consumer products.",
            "Delivered user research, visual and interaction design, flows, wireframes, prototypes, and testing for projects including Country Delight and Wizikey.",
        ], styles),
        role("UI / UX Designer", "Comptroller General of Defence Accounts (CGDA) / DRDO", "2019-2021", [
            "Designed and maintained websites and apps, including work on an accounting system supporting employee bill-clearance workflows.",
            "Created menus, tabs, wireframes, prototypes, process flows, and testing plans for internal products.",
        ], styles),
        role("UI / UX Designer", "Galaxy Studio", "2016-2019", [
            "Designed Windows Phone, Windows 10, Nokia Asha, and BlackBerry OS 10 applications; team portfolio included 20+ apps and 4M+ downloads.",
            "Worked on Yube, eXpress Player, FitVid, and SuperHeroes Wallpapers; selected apps were featured in the Windows App Store and Windows Central.",
        ], styles),
        role("QA Analyst", "IBM India Pvt. Ltd.", "2014-2016", [
            "Created and executed test cases across McKesson Healthcare and C2C Rail projects, including unit, integration, interface, sanity, regression, usability, and beta testing.",
        ], styles),
        p("Selected Achievements", styles["section"]),
        p("100+ smartwatch face designs for boAt India; Microsoft Student Partner (2012-2013); Top 10 in Microsoft DVLUP, a Windows Phone developer reward program.", styles["body"]),
        p("Education", styles["section"]),
        p("Post Graduate Certificate in UX Design &amp; HCI, Indian Institute of Technology (IIT), Guwahati, 2023<br/>Bachelor of Technology (ECE), Netaji Subhash University of Technology (East Campus), 2009-2013", styles["body"]),
    ]
    document.build(story)


if __name__ == "__main__":
    main()
