import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboard = readFileSync("apps/web/src/app/app/founder/page.tsx", "utf8");
const proxy = readFileSync("apps/web/src/proxy.ts", "utf8");
const css = readFileSync("apps/web/src/app/globals.css", "utf8");

test("founder revenue dashboard is backed by existing marketing leads", () => {
  for (const token of [
    "Founder revenue dashboard",
    "Lead Overview",
    "Pipeline Overview",
    "Conversion Funnel",
    "Founder KPIs",
    "listMarketingLeads",
    "marketing_leads",
    "pilot_candidate",
    "meeting_booked",
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
    "Leads this month",
    "Meetings this month",
    "Pilot commitments",
    "Active organizations",
  ]) {
    assert.ok(dashboard.includes(token), `missing ${token}`);
  }
});

test("founder revenue dashboard route is founder-only", () => {
  assert.ok(proxy.includes("/app/founder"));
  assert.ok(proxy.includes("founder revenue dashboard route"));
  assert.ok(proxy.includes("founder.route.access"));
});

test("founder revenue dashboard has responsive workspace styling", () => {
  for (const token of [
    ".founder-revenue-dashboard",
    ".founder-pipeline-grid",
    ".founder-funnel-grid",
    ".founder-revenue-hero",
  ]) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
});
