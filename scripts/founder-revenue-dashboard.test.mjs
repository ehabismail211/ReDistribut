import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboard = readFileSync("apps/web/src/app/app/founder/page.tsx", "utf8");
const proxy = readFileSync("apps/web/src/proxy.ts", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");
const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");
const guide = readFileSync("docs/FOUNDER_DASHBOARD_ACCESS_GUIDE.md", "utf8");

test("founder revenue dashboard is backed by existing marketing leads", () => {
  for (const token of [
    "Founder Dashboard",
    "Founder Summary",
    "Lead Pipeline",
    "Interest Type Breakdown",
    "Next Actions",
    "Pilot Readiness",
    "Founder KPIs",
    "listMarketingLeads",
    "marketing_leads",
    "pilot_candidate",
    "meeting_status",
    "pilot_status",
  ]) {
    assert.ok(dashboard.includes(token), `missing ${token}`);
  }
});

test("founder dashboard includes required pipeline segments and funnel states", () => {
  for (const token of [
    "NGOs",
    "Hotels",
    "Restaurants",
    "Warehouses",
    "ESG partners",
    "Active Organization",
    "Supplier inquiries",
    "Recipient inquiries",
    "Partnership requests",
    "ESG discussions",
    "Founder meetings",
    "General inquiries",
    "Leads this month",
    "Meetings booked",
    "Meetings completed",
    "Pilot conversion rate",
    "Pilot commitments",
    "Active organizations",
    "Leads needing follow-up",
    "Meetings to schedule",
    "Pilot candidates to review",
    "Supplier candidates",
    "Recipient candidates",
    "Ready for first pilot pair",
    "Pilot candidates",
    "Active pilots",
  ]) {
    assert.ok(dashboard.includes(token), `missing ${token}`);
  }
});

test("founder revenue dashboard route is founder-only", () => {
  assert.ok(proxy.includes("/app/founder"));
  assert.ok(proxy.includes("/app/leads"));
  assert.ok(proxy.includes("founder revenue dashboard route"));
  assert.ok(proxy.includes("founder lead review route"));
  assert.ok(proxy.includes("founder.route.access"));
  assert.ok(proxy.includes("permission=denied"));
  assert.ok(workspace.includes("Founder access required"));
  assert.ok(workspace.includes("Founder Dashboard"));
  assert.ok(workspace.includes("Leads"));
  assert.ok(workspace.includes("Pilot Pipeline"));
});

test("founder revenue dashboard has responsive workspace styling", () => {
  for (const token of [
    ".founder-revenue-dashboard",
    ".founder-pipeline-grid",
    ".founder-funnel-grid",
    ".founder-ops-grid",
    ".founder-pipeline-list",
    ".permission-denied-card",
    ".lead-card.highlighted",
    ".founder-revenue-hero",
  ]) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
});

test("founder access guide documents secure operating workflow", () => {
  for (const token of [
    "/app/founder",
    "/app/leads",
    "/app/leads?lead=<lead-id>",
    "founder.route.access",
    "Daily Founder Workflow",
    "Weekly Founder Review",
    "RESEND_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "Public visitors can submit leads but cannot read lead records",
  ]) {
    assert.ok(guide.includes(token), `missing ${token}`);
  }
});
