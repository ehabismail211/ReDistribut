import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { calculateImpactMetrics } from "../apps/web/src/lib/impact.ts";
import { runAllScenarios } from "./simulation-runner.mjs";

const migration = readFileSync("supabase/migrations/202606200002_impact_dashboard_engine.sql", "utf8");
const sharedContracts = readFileSync("packages/shared/src/index.ts", "utf8");
const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");

function inputsFromSimulation() {
  const output = runAllScenarios();
  const listings = [];
  const requests = [];

  for (const scenario of output.results) {
    const listingId = `${scenario.id}-listing`;
    listings.push({
      id: listingId,
      title: scenario.listing.title,
      category: scenario.listing.category,
      city: scenario.organization.location,
      unit: scenario.listing.unit,
      unitPrice: scenario.listing.unitPrice ?? null,
      status: scenario.listing.status,
    });

    scenario.requests.forEach((request, index) => {
      requests.push({
        id: `${scenario.id}-request-${index}`,
        listingId,
        quantity: request.quantity,
        status: request.status,
      });
    });
  }

  return { listings, requests };
}

test("impact calculator aggregates required Sprint 4 metrics", () => {
  const metrics = calculateImpactMetrics(inputsFromSimulation());

  assert.equal(metrics.resources_redistributed, 1880);
  assert.equal(metrics.completed_transactions, 8);
  assert.equal(metrics.active_listings, 0);
  assert.equal(metrics.active_requests, 0);
  assert.equal(metrics.aed_recovered, 30260);
  assert.equal(metrics.waste_prevented_kg, 11674);
  assert.equal(metrics.co2_saved_kg, 16908);
  assert.equal(metrics.top_categories[0].label, "warehouse materials");
  assert.equal(metrics.top_locations[0].label, "Jebel Ali");
});

test("impact calculator validates the four automation scenarios", () => {
  const output = runAllScenarios();
  const expected = {
    restaurant: { resources: 120, aed: 2160, waste: 54, transactions: 2 },
    hotel: { resources: 60, aed: 2700, waste: 420, transactions: 2 },
    warehouse: { resources: 1200, aed: 14400, waste: 10800, transactions: 2 },
    ngo: { resources: 500, aed: 11000, waste: 400, transactions: 2 },
  };

  for (const scenario of output.results) {
    const listingId = `${scenario.id}-listing`;
    const metrics = calculateImpactMetrics({
      listings: [{
        id: listingId,
        title: scenario.listing.title,
        category: scenario.listing.category,
        city: scenario.organization.location,
        unit: scenario.listing.unit,
        unitPrice: scenario.listing.unitPrice ?? null,
        status: scenario.listing.status,
      }],
      requests: scenario.requests.map((request, index) => ({
        id: `${scenario.id}-${index}`,
        listingId,
        quantity: request.quantity,
        status: request.status,
      })),
    });

    assert.equal(metrics.resources_redistributed, expected[scenario.id].resources);
    assert.equal(metrics.aed_recovered, expected[scenario.id].aed);
    assert.equal(metrics.waste_prevented_kg, expected[scenario.id].waste);
    assert.equal(metrics.completed_transactions, expected[scenario.id].transactions);
  }
});

test("impact migration, shared contracts, and API routes exist", () => {
  assert.match(migration, /create type public\.impact_scope as enum \('user', 'organization', 'platform'\)/);
  assert.match(migration, /create table if not exists public\.impact_metric_history/);
  assert.match(migration, /record_impact_metric_snapshot/);
  assert.match(migration, /impact\.snapshot\.recorded/);

  for (const scope of ["user", "organization", "platform"]) {
    assert.ok(sharedContracts.includes(`"${scope}"`), `shared contracts missing ${scope}`);
    assert.ok(migration.includes(`'${scope}'`), `migration missing ${scope}`);
  }

  for (const route of [
    "apps/web/src/app/api/v1/impact/route.ts",
    "apps/web/src/app/api/v1/impact/calculate/route.ts",
    "apps/web/src/app/api/v1/organizations/[id]/impact/route.ts",
  ]) {
    assert.equal(existsSync(route), true, `missing route ${route}`);
  }
});

test("impact admin dashboard includes required leaderboards", () => {
  for (const label of ["Top organizations", "Top cities", "Top categories"]) {
    assert.ok(workspace.includes(`title="${label}"`) || workspace.includes(`title={${label}}`), `missing ${label}`);
  }
});
