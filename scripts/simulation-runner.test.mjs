import assert from "node:assert/strict";
import test from "node:test";

import { runAllScenarios, scenarios } from "./simulation-runner.mjs";

test("simulation runner includes the required pilot scenarios", () => {
  const scenarioIds = scenarios.map((scenario) => scenario.id).sort();

  assert.deepEqual(scenarioIds, ["hotel", "ngo", "restaurant", "warehouse"]);
});

test("all simulation scenarios pass their expected workflow checks", () => {
  const output = runAllScenarios();

  assert.equal(output.total, 4);
  assert.equal(output.passed, 4);
  assert.equal(output.failed, 0);
  assert.ok(output.results.every((result) => result.passed));
});

test("restaurant and warehouse scenarios prevent over-allocation", () => {
  const output = runAllScenarios();
  const restaurant = output.results.find((result) => result.id === "restaurant");
  const warehouse = output.results.find((result) => result.id === "warehouse");

  assert.equal(restaurant.requests.filter((request) => request.status === "prevented").length, 1);
  assert.equal(warehouse.requests.filter((request) => request.status === "prevented").length, 1);
  assert.equal(restaurant.listing.availableQuantity, 0);
  assert.equal(warehouse.listing.availableQuantity, 0);
});

test("ngo scenario supports declined requests without reducing completed impact", () => {
  const output = runAllScenarios();
  const ngo = output.results.find((result) => result.id === "ngo");

  assert.equal(ngo.requests.filter((request) => request.status === "declined").length, 1);
  assert.equal(ngo.listing.completedQuantity, 500);
  assert.equal(ngo.listing.availableQuantity, 0);
});

test("completed scenarios emit the expected audit trail events", () => {
  const output = runAllScenarios();

  for (const result of output.results) {
    const eventTypes = result.auditEvents.map((event) => event.type);

    assert.ok(eventTypes.includes("organization.setup"));
    assert.ok(eventTypes.includes("listing.published"));
    assert.ok(eventTypes.includes("request.accepted"));
    assert.ok(eventTypes.includes("handover.completed"));
    assert.ok(result.listing.availableQuantity >= 0);
  }
});
