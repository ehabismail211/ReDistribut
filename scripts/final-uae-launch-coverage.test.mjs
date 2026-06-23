import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");
const contact = readFileSync("apps/web/src/app/contact/page.tsx", "utf8");
const publicLanguage = readFileSync("apps/web/src/app/components/public-language.tsx", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");

test("workspace covers all UAE emirates and manual fallback locations", () => {
  for (const token of [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
    "Other UAE location",
    "Manual address required",
    "uaeLocationOptions",
  ]) {
    assert.ok(workspace.includes(token), `missing UAE location token: ${token}`);
  }
});

test("workspace category coverage includes safe UAE redistribution use cases and other options", () => {
  for (const token of [
    "Furniture",
    "Office equipment",
    "Shelving and storage",
    "Packaging materials",
    "Warehouse stock",
    "Hospitality supplies",
    "Linens and textiles",
    "Kitchen and non-food equipment",
    "Electronics and accessories",
    "School and community supplies",
    "Maintenance and tools",
    "Event and exhibition materials",
    "Other category",
    "Other subcategory",
    "medical-pharmaceutical",
    "hazardous-regulated",
    "restricted: true",
  ]) {
    assert.ok(workspace.includes(token), `missing category coverage token: ${token}`);
  }
});

test("workspace includes clearly labeled virtual validation organizations and listings", () => {
  for (const token of [
    "Virtual Hotel Supplier",
    "Virtual Warehouse Supplier",
    "Virtual NGO Recipient",
    "Virtual School Recipient",
    "Virtual Founder Admin",
    "Demo banquet chairs",
    "Demo folding tables",
    "Demo shelving units",
    "Demo storage bins",
    "Demo pallets and cartons",
    "Simulated/demo listing",
  ]) {
    assert.ok(workspace.includes(token), `missing simulated validation token: ${token}`);
  }
});

test("help and manual access are visible in public and app workflows", () => {
  for (const token of [
    "HelpWorkflowCallout",
    "How to use ReDist",
    "Open the bilingual manual for this workflow.",
    'href="/app/help"',
    "Register/Login",
    "Create listing",
    "Submit request",
    "Approve request",
    "Verify transfer",
    "Download/review certificate",
  ]) {
    assert.ok(workspace.includes(token), `missing workspace help token: ${token}`);
  }

  assert.ok(contact.includes('href="/help"'), "contact page should link to public Help Center");
  assert.ok(publicLanguage.includes("Need guidance before contacting us? Open the"), "public language dictionary should cover contact help copy");

  for (const token of [".workflow-help-callout", ".form-help"]) {
    assert.ok(css.includes(token), `missing help visibility CSS token: ${token}`);
  }
});

test("final UAE launch coverage QA report exists", () => {
  assert.ok(existsSync("docs/FINAL_UAE_LAUNCH_COVERAGE_QA_REPORT.md"));
});
