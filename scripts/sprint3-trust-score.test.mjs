import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { calculateTrustScore, trustLevelForScore } from "../apps/web/src/lib/trust-score.ts";
import { runAllScenarios } from "./simulation-runner.mjs";

const migration = readFileSync("supabase/migrations/202606200001_trust_score_engine.sql", "utf8");
const sharedContracts = readFileSync("packages/shared/src/index.ts", "utf8");

const scenarios = {
  newOrganization: {
    verificationLevel: "unverified",
    completedTransactions: 0,
    averageResponseHours: null,
    acceptanceRate: 0,
    cancellationRate: 0,
    disputeRate: 0,
    negativeAuditEvents: 0,
    profileCompleteness: 0.3,
    approvedDocuments: 0,
    expiredDocuments: 0,
    rejectedDocuments: 0,
  },
  verifiedOrganization: {
    verificationLevel: "business_verified",
    completedTransactions: 2,
    averageResponseHours: 20,
    acceptanceRate: 0.7,
    cancellationRate: 0,
    disputeRate: 0,
    negativeAuditEvents: 0,
    profileCompleteness: 0.9,
    approvedDocuments: 3,
    expiredDocuments: 0,
    rejectedDocuments: 0,
  },
  highPerformingOrganization: {
    verificationLevel: "enterprise_verified",
    completedTransactions: 8,
    averageResponseHours: 2,
    acceptanceRate: 0.92,
    cancellationRate: 0,
    disputeRate: 0,
    negativeAuditEvents: 0,
    profileCompleteness: 1,
    approvedDocuments: 5,
    expiredDocuments: 0,
    rejectedDocuments: 0,
  },
  lowPerformingOrganization: {
    verificationLevel: "basic_verified",
    completedTransactions: 1,
    averageResponseHours: 96,
    acceptanceRate: 0.35,
    cancellationRate: 0.35,
    disputeRate: 0.25,
    negativeAuditEvents: 5,
    profileCompleteness: 0.55,
    approvedDocuments: 1,
    expiredDocuments: 1,
    rejectedDocuments: 1,
  },
  expiredDocuments: {
    verificationLevel: "business_verified",
    completedTransactions: 3,
    averageResponseHours: 12,
    acceptanceRate: 0.75,
    cancellationRate: 0.05,
    disputeRate: 0,
    negativeAuditEvents: 1,
    profileCompleteness: 0.85,
    approvedDocuments: 2,
    expiredDocuments: 2,
    rejectedDocuments: 0,
  },
  highCancellationRate: {
    verificationLevel: "business_verified",
    completedTransactions: 4,
    averageResponseHours: 8,
    acceptanceRate: 0.8,
    cancellationRate: 0.4,
    disputeRate: 0.05,
    negativeAuditEvents: 2,
    profileCompleteness: 0.9,
    approvedDocuments: 3,
    expiredDocuments: 0,
    rejectedDocuments: 0,
  },
};

test("trust score levels match Sprint 3 ranges", () => {
  assert.equal(trustLevelForScore(0), "bronze");
  assert.equal(trustLevelForScore(49), "bronze");
  assert.equal(trustLevelForScore(50), "silver");
  assert.equal(trustLevelForScore(69), "silver");
  assert.equal(trustLevelForScore(70), "gold");
  assert.equal(trustLevelForScore(84), "gold");
  assert.equal(trustLevelForScore(85), "platinum");
  assert.equal(trustLevelForScore(100), "platinum");
});

test("trust score calculator covers required validation scenarios", () => {
  const results = Object.fromEntries(
    Object.entries(scenarios).map(([name, input]) => [name, calculateTrustScore(input)]),
  );

  assert.equal(results.newOrganization.level, "bronze");
  assert.ok(results.verifiedOrganization.score >= 70);
  assert.equal(results.highPerformingOrganization.level, "platinum");
  assert.equal(results.lowPerformingOrganization.level, "bronze");
  assert.ok(results.expiredDocuments.factors.find((factor) => factor.key === "document_status").points < 0);
  assert.ok(results.highCancellationRate.factors.find((factor) => factor.key === "cancellation_rate").points < 0);
});

test("trust score migration and API routes exist", () => {
  for (const table of ["organization_trust_scores", "organization_trust_score_history"]) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`));
  }

  for (const value of ["bronze", "silver", "gold", "platinum"]) {
    assert.ok(migration.includes(`'${value}'`), `migration missing ${value}`);
    assert.ok(sharedContracts.includes(`"${value}"`), `shared contracts missing ${value}`);
  }

  for (const route of [
    "apps/web/src/app/api/v1/trust-scores/route.ts",
    "apps/web/src/app/api/v1/organizations/[id]/trust-score/route.ts",
    "apps/web/src/app/api/v1/organizations/[id]/trust-score/recalculate/route.ts",
  ]) {
    assert.equal(existsSync(route), true, `missing route ${route}`);
  }
});

test("simulation runner remains compatible with trust score sprint", () => {
  const output = runAllScenarios();

  assert.equal(output.total, 4);
  assert.equal(output.failed, 0);
});
