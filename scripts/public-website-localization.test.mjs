import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const localization = readFileSync("apps/web/src/app/components/public-language.tsx", "utf8");
const marketing = readFileSync("apps/web/src/app/components/marketing.tsx", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");

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
  ]) {
    assert.ok(localization.includes(token), `missing Arabic text: ${token}`);
  }
});
