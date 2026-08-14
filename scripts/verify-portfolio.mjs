import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const pages = [
  ["index.html", "https://www.iamanimesh.com/", null],
  ["products.html", "https://www.iamanimesh.com/products.html", null],
  ["case-studies.html", "https://www.iamanimesh.com/case-studies.html", null],
  ["unitx.html", "https://www.iamanimesh.com/unitx.html", null],
  ["buildx.html", "https://www.iamanimesh.com/buildx.html", null],
  ["pacex.html", "https://www.iamanimesh.com/pacex.html", null],
  ["recital.html", "https://www.iamanimesh.com/recital.html", null],
  ["income-tax.html", "https://www.iamanimesh.com/income-tax.html", null],
  ["trade-cloud-apps.html", "https://www.iamanimesh.com/trade-cloud-apps.html", null],
  ["unitx-case-study.html", "https://www.iamanimesh.com/unitx-case-study.html", null],
  ["journey.html", "https://www.iamanimesh.com/journey.html", null],
  ["about.html", "https://www.iamanimesh.com/about.html", "about.html"],
];

const errors = [];
const requiredNav = ["index.html#products", "index.html#case-studies", "about.html", "mailto:animeshsharma23j@gmail.com"];

for (const [file, canonical, activePage] of pages) {
  const html = readFileSync(file, "utf8");
  const expect = (condition, message) => { if (!condition) errors.push(`${file}: ${message}`); };

  expect(/<main id="main-content"/.test(html), "missing main-content landmark");
  expect(/<a class="skip-link" href="#main-content">/.test(html), "missing skip link");
  expect(html.includes(`<link rel="canonical" href="${canonical}" />`), "canonical URL is missing or incorrect");
  expect(/<meta property="og:title"/.test(html) && /<meta property="og:description"/.test(html), "missing Open Graph metadata");

  const pageNav = file === "index.html"
    ? ["#products", "#case-studies", "about.html", "mailto:animeshsharma23j@gmail.com"]
    : requiredNav;
  for (const href of pageNav) expect(html.includes(`href="${href}"`), `missing global navigation link: ${href}`);

  const currentMatches = [...html.matchAll(/aria-current="page"/g)].length;
  expect(currentMatches === (activePage ? 1 : 0), "unexpected active-navigation state");
  if (activePage) expect(html.includes(`href="${activePage}" aria-current="page"`), "active navigation points to the wrong page");

  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?"/g)) {
    const target = match[1];
    if (!["mailto:", "http:", "https:"].some((prefix) => target.startsWith(prefix))) {
      expect(existsSync(resolve(target)), `missing local asset or route: ${target}`);
    }
  }
}

const index = readFileSync("case-studies.html", "utf8");
if (!/<h2>Income Tax/.test(index) || /case-row case-row-link[\s\S]*?<h3>/.test(index)) {
  errors.push("case-studies.html: project titles must use H2 headings");
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}

console.log(`✓ ${pages.length} pages, navigation, metadata, local links, and UnitX image budget verified.`);
