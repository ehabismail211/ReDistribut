import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { runAllScenarios } from "./simulation-runner.mjs";

const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");
const styles = readFileSync("apps/web/src/app/globals.css", "utf8");

test("pilot platform includes the required UAE pilot scenarios", () => {
  const output = runAllScenarios();
  const ids = output.results.map((scenario) => scenario.id).sort();

  assert.deepEqual(ids, ["hotel", "ngo", "restaurant", "warehouse"]);
  assert.equal(output.failed, 0);
});

test("pilot workspace implements onboarding, monitoring, feedback, issues, and KPIs", () => {
  for (const token of [
    "PilotWorkspaceSection",
    "pilotOrganizations",
    "PilotFeedback",
    "submitPilotFeedback",
    "updatePilotFeedbackStatus",
    "Founder monitoring dashboard",
    "Feedback center",
    "Issue tracking",
    "Pilot organizations",
    "Verification completion",
    "Transactions completed",
  ]) {
    assert.ok(workspace.includes(token), `missing ${token}`);
  }
});

test("pilot platform styles support dashboard, feedback, and responsive layouts", () => {
  for (const token of [
    ".pilot-workspace-shell",
    ".pilot-kpi-grid",
    ".pilot-dashboard-grid",
    ".pilot-org-card",
    ".pilot-feedback-form",
    ".pilot-feedback-card",
    ".pilot-progress-track",
  ]) {
    assert.ok(styles.includes(token), `missing ${token}`);
  }
});
