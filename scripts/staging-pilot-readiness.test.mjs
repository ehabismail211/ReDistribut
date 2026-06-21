import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const seedPath = "supabase/seeds/staging_pilot_seed.sql";
const rlsMigrationPath = "supabase/migrations/202606200007_organization_role_rls_hardening.sql";
const reportPath = "docs/STAGING_PILOT_READINESS_REPORT.md";
const automatedReportPath = "docs/STAGING_AUTOMATED_VALIDATION_REPORT.md";
const validationRunnerPath = "scripts/staging-pilot-validation.mjs";

const seed = readFileSync(seedPath, "utf8");
const rlsMigration = readFileSync(rlsMigrationPath, "utf8");

test("staging pilot seed creates required platform accounts and roles", () => {
  for (const token of [
    "founder@staging.redist.ae",
    "platform-admin@staging.redist.ae",
    "reviewer@staging.redist.ae",
    "pilot-coordinator@staging.redist.ae",
    "redist_platform_roles",
    "'founder'",
    "'platform_admin'",
    "'reviewer'",
    "'pilot_coordinator'",
    "public.user_platform_roles",
  ]) {
    assert.ok(seed.includes(token), `missing ${token}`);
  }
});

test("staging pilot seed creates five requested pilot organizations", () => {
  for (const token of [
    "Restaurant A",
    "restaurant-a",
    "Restaurant B",
    "restaurant-b",
    "Hotel A",
    "hotel-a",
    "Warehouse A",
    "warehouse-a",
    "NGO A",
    "ngo-a",
  ]) {
    assert.ok(seed.includes(token), `missing ${token}`);
  }
});

test("staging pilot seed creates organization admin and user memberships", () => {
  const organizationAdminCount = seed.match(/organization_admin/g)?.length ?? 0;
  const organizationUserCount = seed.match(/organization_user/g)?.length ?? 0;

  assert.ok(organizationAdminCount >= 5, "expected at least one organization_admin per pilot organization");
  assert.ok(organizationUserCount >= 5, "expected at least one organization_user per pilot organization");

  for (const email of [
    "restaurant-a-admin@staging.redist.ae",
    "restaurant-a-user@staging.redist.ae",
    "restaurant-b-admin@staging.redist.ae",
    "restaurant-b-user@staging.redist.ae",
    "hotel-a-admin@staging.redist.ae",
    "hotel-a-user@staging.redist.ae",
    "warehouse-a-admin@staging.redist.ae",
    "warehouse-a-user@staging.redist.ae",
    "ngo-a-admin@staging.redist.ae",
    "ngo-a-user@staging.redist.ae",
  ]) {
    assert.ok(seed.includes(email), `missing ${email}`);
  }
});

test("organization admin RLS recognizes the production organization_admin role", () => {
  assert.ok(rlsMigration.includes("role in ('admin', 'organization_admin')"));
  assert.ok(rlsMigration.includes("create or replace function public.is_organization_admin"));
});

test("staging readiness report exists with required validation and freeze guidance", () => {
  assert.equal(existsSync(reportPath), true, `missing ${reportPath}`);

  const report = readFileSync(reportPath, "utf8");
  for (const token of [
    "Login",
    "Logout",
    "Role assignment",
    "Route protection",
    "API protection",
    "Cross-tenant denial",
    "Founder dashboard access",
    "Reviewer access",
    "Organization admin access",
    "Organization user access",
    "Freeze Development",
    "Pilot Go / No-Go Recommendation",
  ]) {
    assert.ok(report.includes(token), `missing ${token}`);
  }
});

test("automated staging validation runner covers live pilot readiness checks", () => {
  assert.equal(existsSync(validationRunnerPath), true, `missing ${validationRunnerPath}`);
  const runner = readFileSync(validationRunnerPath, "utf8");

  for (const token of [
    "STAGING_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STAGING_REQUIRE_LIVE",
    "founder dashboard access",
    "reviewer access",
    "organization admin access",
    "organization user access",
    "cross-tenant denial",
    "audit logging",
    "certificate generation",
    "certificate QR verification",
    "trust updates",
    "impact updates",
    "signInWithPassword",
    "signOut",
  ]) {
    assert.ok(runner.includes(token), `missing ${token}`);
  }
});

test("automated staging validation report documents execution and freeze rule", () => {
  assert.equal(existsSync(automatedReportPath), true, `missing ${automatedReportPath}`);
  const report = readFileSync(automatedReportPath, "utf8");

  for (const token of [
    "./.tools/pnpm staging:validate",
    "STAGING_REQUIRE_LIVE=true",
    "Login",
    "Logout",
    "Route protection",
    "API protection",
    "Cross-tenant denial",
    "Audit logging",
    "freeze development",
  ]) {
    assert.ok(report.includes(token), `missing ${token}`);
  }
});
