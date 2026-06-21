import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { runAllScenarios } from "./simulation-runner.mjs";

const dashboardPath = "apps/web/src/app/app/pilot-monitoring/page.tsx";
const dashboard = readFileSync(dashboardPath, "utf8");
const styles = readFileSync("apps/web/src/app/globals.css", "utf8");
const executionPack = readFileSync("docs/UAE_CONTROLLED_PILOT_EXECUTION_PACK.md", "utf8");

test("founder pilot monitoring dashboard route exists", () => {
  assert.equal(existsSync(dashboardPath), true);
  assert.ok(dashboard.includes("Founder only"));
  assert.ok(dashboard.includes("Pilot monitoring dashboard"));
  assert.ok(dashboard.includes("Conditional Go"));
});

test("founder pilot monitoring dashboard shows required monitoring domains", () => {
  for (const token of [
    "Pilot organizations",
    "Listings",
    "Requests",
    "Transactions",
    "Certificates",
    "Trust scores",
    "Verification status",
    "Feedback",
    "Open issues",
  ]) {
    assert.ok(dashboard.includes(token), `missing ${token}`);
  }
});

test("founder pilot monitoring dashboard validates against simulation cohort", () => {
  const output = runAllScenarios();

  assert.equal(output.failed, 0);
  assert.deepEqual(output.results.map((scenario) => scenario.id).sort(), ["hotel", "ngo", "restaurant", "warehouse"]);
  assert.ok(dashboard.includes("Dubai Marina Restaurant"));
  assert.ok(dashboard.includes("Abu Dhabi Hotel Group"));
  assert.ok(dashboard.includes("Jebel Ali Logistics"));
  assert.ok(dashboard.includes("Dubai Community NGO"));
});

test("founder pilot monitoring dashboard has responsive styling", () => {
  for (const token of [
    ".founder-monitor-shell",
    ".pilot-monitor-grid",
    ".pilot-monitor-columns",
    ".pilot-monitor-table",
    ".founder-feedback-list",
  ]) {
    assert.ok(styles.includes(token), `missing ${token}`);
  }
});

test("controlled pilot execution pack defines pilot operations and launch criteria", () => {
  for (const token of [
    "Pilot timeline",
    "Organization Onboarding Sequence",
    "Founder Responsibilities",
    "Pilot Organization Responsibilities",
    "Weekly Review Process",
    "KPI Tracking Process",
    "Feedback Collection Process",
    "Bug Triage Process",
    "Issue Escalation Process",
    "Exit Criteria",
    "Go",
    "Conditional Go",
    "No-Go",
  ]) {
    assert.ok(executionPack.toLowerCase().includes(token.toLowerCase()), `missing ${token}`);
  }
});
