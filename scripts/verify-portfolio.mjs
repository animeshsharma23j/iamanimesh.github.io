import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const pages = [
  ["index.html", "https://iamanimesh.com/", null],
  ["products.html", "https://iamanimesh.com/products.html", "products.html"],
  ["case-studies.html", "https://iamanimesh.com/case-studies.html", "case-studies.html"],
  ["unitx.html", "https://iamanimesh.com/unitx.html", "products.html"],
  ["buildx.html", "https://iamanimesh.com/buildx.html", "products.html"],
  ["pacex.html", "https://iamanimesh.com/pacex.html", "products.html"],
  ["income-tax.html", "https://iamanimesh.com/income-tax.html", "case-studies.html"],
  ["trade-cloud-apps.html", "https://iamanimesh.com/trade-cloud-apps.html", "case-studies.html"],
  ["unitx-case-study.html", "https://iamanimesh.com/unitx-case-study.html", "case-studies.html"],
  ["journey.html", "https://iamanimesh.com/journey.html", "journey.html"],
  ["about.html", "https://iamanimesh.com/about.html", "about.html"],
];

const errors = [];
const requiredNav = ["products.html", "case-studies.html", "journey.html", "about.html", "mailto:animeshsharma23j@gmail.com"];

for (const [file, canonical, activePage] of pages) {
  const html = readFileSync(file, "utf8");
  const expect = (condition, message) => { if (!condition) errors.push(`${file}: ${message}`); };

  expect(/<main id="main-content"/.test(html), "missing main-content landmark");
  expect(/<a class="skip-link" href="#main-content">/.test(html), "missing skip link");
  expect(html.includes(`<link rel="canonical" href="${canonical}" />`), "canonical URL is missing or incorrect");
  expect(/<meta property="og:title"/.test(html) && /<meta property="og:description"/.test(html), "missing Open Graph metadata");

  for (const href of requiredNav) expect(html.includes(`href="${href}"`), `missing global navigation link: ${href}`);

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
