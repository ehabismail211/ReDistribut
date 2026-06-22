import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const localization = readFileSync("apps/web/src/app/components/public-language.tsx", "utf8");
const marketing = readFileSync("apps/web/src/app/components/marketing.tsx", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");

function quotedKey(value) {
  return `${JSON.stringify(value)}:`;
}

function extractQuotedStrings(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start);
  assert.ok(start >= 0, `missing source section ${startToken}`);
  assert.ok(end > start, `missing section end ${endToken}`);
  const section = source.slice(start, end);
  return [...section.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map((match) => JSON.parse(`"${match[1]}"`));
}

test("public website exposes Arabic language switching and RTL support", () => {
  for (const token of [
    '"use client"',
    "redist-language",
    "PublicLanguageController",
    "document.documentElement.lang = locale",
    "document.documentElement.dir = locale === \"ar\" ? \"rtl\" : \"ltr\"",
    "MutationObserver",
    "mkt-language-switcher",
  ]) {
    assert.ok(localization.includes(token), `missing ${token}`);
  }

  assert.ok(marketing.includes("<PublicLanguageController />"), "marketing header should render the public language switcher");
  assert.ok(css.includes('.mkt-page[dir="rtl"]'), "public marketing pages should define RTL styling");
  assert.ok(css.includes('.mkt-page[lang="ar"]'), "public marketing pages should define Arabic font styling");
});

test("public Arabic dictionary covers customer-facing routes and lead capture", () => {
  for (const token of [
    "Redistribute surplus resources with trust, evidence, and impact.",
    "A practical workflow for verified redistribution.",
    "Turn surplus resources into verified redistribution.",
    "Discover available surplus resources from verified organizations.",
    "Answers before your founder conversation.",
    "Start with a founder conversation.",
    "Full name",
    "Work email",
    "Submit inquiry",
    "Pilot interest",
    "Hotel / hospitality",
    "Supplier approval control",
    "General",
    "Trust and verification",
    "Impact, pilot, and launch",
    "What is ReDist?",
    "Does ReDist have real impact results yet?",
    "Can organizations use ReDist for ESG reporting?",
    "ReDist home",
    "Primary navigation",
    "Footer navigation",
    "Pilot status",
    "Common redistribution questions",
    "Language",
  ]) {
    assert.ok(localization.includes(token), `missing dictionary source text: ${token}`);
  }

  for (const token of [
    "أعد توزيع الموارد الفائضة",
    "مسار عملي",
    "للموردين",
    "للمستفيدين",
    "الأسئلة الشائعة",
    "إرسال الاستفسار",
    "ما هي ReDist؟",
    "الثقة والتحقق",
    "الصفحة الرئيسية لـ ReDist",
  ]) {
    assert.ok(localization.includes(token), `missing Arabic text: ${token}`);
  }
});

test("public Arabic dictionary covers shared marketing workflow, cards, and FAQ details", () => {
  const sharedMarketingStrings = [
    ...extractQuotedStrings(marketing, "export const siteNav", "export const workflowSteps"),
    ...extractQuotedStrings(marketing, "export const workflowSteps", "export const featureCards"),
    ...extractQuotedStrings(marketing, "export const featureCards", "export const faqGroups"),
    ...extractQuotedStrings(marketing, "export const faqGroups", "export function MarketingShell"),
  ];

  for (const sourceText of sharedMarketingStrings) {
    if (sourceText === "/" || sourceText.startsWith("/")) continue;
    assert.ok(localization.includes(quotedKey(sourceText)), `missing Arabic dictionary key: ${sourceText}`);
  }
});
