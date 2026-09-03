import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.iamanimesh.com";
const ROOT = process.cwd();

// The page list is read from disk rather than hand-maintained. The previous
// hard-coded list had drifted 17 pages behind the site, so whole sections
// (JobBook, TradeBill, RateX, the ITBA and CGDA case studies, the standalone
// calculators) were never checked at all.
const pages = readdirSync(ROOT)
  .filter((name) => name.endsWith(".html"))
  .sort();

// Pages that legitimately differ from the standard shape.
const exceptions = {
  // A 404 must not carry a canonical — it would point crawlers at a URL that
  // returns 404 — and it is not a shareable destination, so no Open Graph.
  "404.html": { canonical: null, og: false },
  // A stub kept so old links still resolve. It canonicalises to the page that
  // replaced it and ships none of the site chrome.
  "journey.html": { canonical: `${SITE}/about.html`, og: false, nav: false, skipLink: false },
};

// Every page carries the same top-level nav; a page that is itself a nav
// destination marks its own tab. Contact is an anchor on the home page, so it
// is a bare fragment there and a cross-page link everywhere else.
const navFor = (file) => [
  "products.html",
  "case-studies.html",
  "about.html",
  file === "index.html" ? "#work-with-me" : "index.html#work-with-me",
];
const activeNav = { "about.html": "about.html" };

const errors = [];

for (const file of pages) {
  const rules = exceptions[file] ?? {};
  const html = readFileSync(resolve(ROOT, file), "utf8");
  const expect = (condition, message) => { if (!condition) errors.push(`${file}: ${message}`); };

  const canonical = "canonical" in rules
    ? rules.canonical
    : `${SITE}/${file === "index.html" ? "" : file}`;

  expect(/<main id="main-content"/.test(html), "missing main-content landmark");

  if (rules.skipLink !== false) {
    expect(/<a class="skip-link" href="#main-content">/.test(html), "missing skip link");
  }

  if (canonical === null) {
    expect(!/<link rel="canonical"/.test(html), "must not declare a canonical URL");
  } else {
    expect(html.includes(`<link rel="canonical" href="${canonical}" />`), `canonical URL is missing or incorrect (expected ${canonical})`);
  }

  if (rules.og !== false) {
    expect(/<meta property="og:title"/.test(html) && /<meta property="og:description"/.test(html), "missing Open Graph metadata");
  }

  if (rules.nav !== false) {
    for (const href of navFor(file)) {
      expect(html.includes(`href="${href}"`), `missing global navigation link: ${href}`);
    }

    const activePage = activeNav[file] ?? null;
    const currentMatches = [...html.matchAll(/aria-current="page"/g)].length;
    expect(currentMatches === (activePage ? 1 : 0), "unexpected active-navigation state");
    if (activePage) {
      expect(html.includes(`href="${activePage}" aria-current="page"`), "active navigation points to the wrong page");
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?"/g)) {
    const target = match[1];
    if (["mailto:", "http:", "https:"].some((prefix) => target.startsWith(prefix))) continue;
    // Root-relative targets resolve against the site root, not the filesystem
    // root — `/icon.png` is `<repo>/icon.png`, not `/icon.png`.
    const onDisk = target.startsWith("/")
      ? resolve(ROOT, target.slice(1))
      : resolve(ROOT, target);
    expect(existsSync(onDisk), `missing local asset or route: ${target}`);
  }
}

const caseStudies = readFileSync(resolve(ROOT, "case-studies.html"), "utf8");
if (!/<h2>Income Tax/.test(caseStudies) || /case-row case-row-link[\s\S]*?<h3>/.test(caseStudies)) {
  errors.push("case-studies.html: project titles must use H2 headings");
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}

console.log(`✓ ${pages.length} pages: landmarks, skip links, canonicals, Open Graph, navigation, and local links verified.`);
