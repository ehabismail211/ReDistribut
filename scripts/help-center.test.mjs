import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const publicHelp = readFileSync("apps/web/src/app/help/page.tsx", "utf8");
const appHelp = readFileSync("apps/web/src/app/app/help/page.tsx", "utf8");
const helpContent = readFileSync("apps/web/src/app/components/help-center.tsx", "utf8");
const marketing = readFileSync("apps/web/src/app/components/marketing.tsx", "utf8");
const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");
const sitemap = readFileSync("apps/web/src/app/sitemap.ts", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");
const releaseNotes = readFileSync("docs/HELP_CENTER_RELEASE_NOTES.md", "utf8");

test("public and workspace help center routes exist with required manuals", () => {
  for (const token of [
    "Help Center",
    "Bilingual guidance for ReDist users.",
    "HelpCenterContent",
    "Open FAQ",
    "Contact support",
  ]) {
    assert.ok(publicHelp.includes(token), `missing public help token: ${token}`);
  }

  for (const token of [
    "Workspace Help Center",
    "Guides for suppliers, recipients, administrators, and pilot users.",
    "HelpCenterContent internal",
    "Back to workspace",
  ]) {
    assert.ok(appHelp.includes(token), `missing app help token: ${token}`);
  }

  for (const token of [
    "Quick Start Guide",
    "User Manual",
    "Supplier Guide",
    "Recipient Guide",
    "FAQ",
    "دليل البدء السريع",
    "دليل المستخدم",
    "دليل المورد",
    "دليل المستفيد",
    "Founder support",
  ]) {
    assert.ok(helpContent.includes(token), `missing help content token: ${token}`);
  }
});

test("help center exposes screenshots and simple searchable sections", () => {
  for (const file of [
    "apps/web/public/help/public-home.png",
    "apps/web/public/help/public-contact.png",
    "apps/web/public/help/workspace-dashboard.png",
    "apps/web/public/help/workspace-discover.png",
    "apps/web/public/help/workspace-submit-request.png",
    "apps/web/public/help/workspace-requests.png",
    "apps/web/public/help/workspace-transfers.png",
    "apps/web/public/help/workspace-certificates.png",
    "apps/web/public/help/workspace-impact.png",
  ]) {
    assert.ok(existsSync(file), `missing published screenshot ${file}`);
  }

  for (const token of [
    "Searchable guide sections",
    "Use browser find to search English or Arabic terms.",
    "/help/workspace-dashboard.png",
    "/help/workspace-discover.png",
    "/help/workspace-impact.png",
  ]) {
    assert.ok(helpContent.includes(token), `missing searchable/screenshot token: ${token}`);
  }
});

test("help center is linked from public and workspace navigation", () => {
  assert.ok(marketing.includes('{ href: "/help", label: "Help Center" }'));
  assert.ok(workspace.includes('href="/app/help"'));
  assert.ok(workspace.includes('href="/faq"'));
  assert.ok(workspace.includes("Guides, FAQ, and founder support for pilot workflows."));
  assert.ok(sitemap.includes('["/help", 0.78]'));
});

test("help center styling and release notes are present", () => {
  for (const token of [
    ".help-center",
    ".help-document-grid",
    ".help-guide-section",
    ".help-arabic",
    ".help-support-card",
    ".workspace-standalone-page",
  ]) {
    assert.ok(css.includes(token), `missing CSS token: ${token}`);
  }

  for (const token of [
    "Public Help Center",
    "Platform Help Center",
    "Documentation Coverage",
    "Screenshots Published",
    "/app/help",
    "/help",
  ]) {
    assert.ok(releaseNotes.includes(token), `missing release note token: ${token}`);
  }
});
