import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { runAllScenarios } from "./simulation-runner.mjs";

const migration = readFileSync("supabase/migrations/202606200004_priority1_pilot_remediation.sql", "utf8");
const sharedContracts = readFileSync("packages/shared/src/index.ts", "utf8");
const operationsControls = readFileSync("docs/UAE_PILOT_OPERATIONS_CONTROLS.md", "utf8");
const organizationProgram = readFileSync("docs/UAE_PILOT_ORGANIZATION_PROGRAM.md", "utf8");

test("Priority 1 migration creates transaction, reservation, handover, evidence, and pilot control foundations", () => {
  for (const token of [
    "create table if not exists public.resource_reservations",
    "create table if not exists public.redistribution_transactions",
    "create table if not exists public.handover_records",
    "create table if not exists public.handover_evidence",
    "create table if not exists public.private_file_assets",
    "create table if not exists public.private_file_access_events",
    "create table if not exists public.pilot_safety_controls",
    "create_redistribution_transaction_for_request",
    "record_private_file_access_event",
    "redistribution_transaction.completed",
  ]) {
    assert.ok(migration.includes(token), `missing ${token}`);
  }
});

test("Priority 1 migration wires accepted and completed requests into durable pilot records", () => {
  assert.match(migration, /create or replace function public\.accept_listing_request/);
  assert.match(migration, /insert into public\.resource_reservations/);
  assert.match(migration, /reservation_created/);
  assert.match(migration, /create or replace function public\.complete_listing_request/);
  assert.match(migration, /public\.create_redistribution_transaction_for_request/);
  assert.match(migration, /insert into public\.handover_records/);
  assert.match(migration, /pilot_manual_control/);
});

test("Priority 1 migration adds tenant-safe RLS and private evidence access audit controls", () => {
  for (const token of [
    "alter table public.resource_reservations enable row level security",
    "alter table public.redistribution_transactions enable row level security",
    "alter table public.handover_records enable row level security",
    "alter table public.handover_evidence enable row level security",
    "alter table public.private_file_assets enable row level security",
    "reservation participants can view reservations",
    "transaction participants can view transactions",
    "handover participants can view handovers",
    "organization admins manage private file assets",
    "private_file.accessed",
  ]) {
    assert.ok(migration.includes(token), `missing ${token}`);
  }
});

test("shared contracts expose Priority 1 remediation vocabulary", () => {
  for (const token of [
    "reservationStatuses",
    "redistributionTransactionStatuses",
    "handoverStatuses",
    "handoverEvidenceTypes",
    "privateFileAssetTypes",
    "pilotControlStatuses",
    "resourceReservationSchema",
    "redistributionTransactionSchema",
    "handoverRecordSchema",
    "handoverEvidenceSchema",
    "privateFileAssetSchema",
    "pilotSafetyControlSchema",
  ]) {
    assert.ok(sharedContracts.includes(token), `missing ${token}`);
  }
});

test("simulations validate reservation, transaction, handover, and private evidence controls", () => {
  const output = runAllScenarios();

  assert.equal(output.failed, 0);

  for (const scenario of output.results) {
    const completedRequests = scenario.requests.filter((request) => request.status === "completed").length;

    assert.equal(scenario.reservations.length, completedRequests, `${scenario.id} reservations mismatch`);
    assert.equal(scenario.transactions.length, completedRequests, `${scenario.id} transactions mismatch`);
    assert.equal(scenario.handoverRecords.length, completedRequests, `${scenario.id} handovers mismatch`);
    assert.equal(scenario.evidenceControls.length, completedRequests, `${scenario.id} evidence controls mismatch`);
    assert.ok(scenario.auditEvents.some((event) => event.type === "reservation.created"));
    assert.ok(scenario.auditEvents.some((event) => event.type === "redistribution_transaction.completed"));
  }
});

test("operations controls document closes founder-dependent Priority 1 gates", () => {
  const normalizedControls = operationsControls.toLowerCase();

  for (const token of [
    "Tenant-boundary Validation",
    "Pilot SOP",
    "Private Document And Evidence Handling",
    "Support Ownership",
    "Mobile Browser QA",
    "Monitoring, Backup, And Incident Response",
    "Founder Approval Checklist",
  ]) {
    assert.ok(normalizedControls.includes(token.toLowerCase()), `missing ${token}`);
  }
});

test("pilot organization program covers the requested pilot cohorts and operating targets", () => {
  for (const token of [
    "Restaurant",
    "Hotel",
    "Warehouse",
    "Packaging Supplier",
    "NGO",
    "onboarding workflow",
    "Verification Requirements",
    "Success Criteria",
    "Expected Listings",
    "Expected Requests",
    "Expected Transactions",
    "KPI Targets",
    "Feedback Requirements",
  ]) {
    assert.ok(organizationProgram.toLowerCase().includes(token.toLowerCase()), `missing ${token}`);
  }
});
