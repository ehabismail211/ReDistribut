import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("supabase/migrations/202606200005_pilot_security_permissions.sql", "utf8");
const identityMigration = readFileSync("supabase/migrations/202606200006_identity_role_hardening.sql", "utf8");
const permissions = readFileSync("apps/web/src/lib/permissions.ts", "utf8");
const proxy = readFileSync("apps/web/src/proxy.ts", "utf8");
const api = readFileSync("apps/web/src/lib/api.ts", "utf8");

const routeFiles = [
  "apps/web/src/app/api/v1/verifications/[id]/review/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/documents/[documentId]/route.ts",
  "apps/web/src/app/api/v1/verifications/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/documents/route.ts",
  "apps/web/src/app/api/v1/listings/route.ts",
  "apps/web/src/app/api/v1/listings/[id]/publish/route.ts",
  "apps/web/src/app/api/v1/listings/[id]/pause/route.ts",
  "apps/web/src/app/api/v1/listings/[id]/requests/route.ts",
  "apps/web/src/app/api/v1/requests/[id]/accept/route.ts",
  "apps/web/src/app/api/v1/requests/[id]/decline/route.ts",
  "apps/web/src/app/api/v1/requests/[id]/complete/route.ts",
  "apps/web/src/app/api/v1/requests/[id]/cancel/route.ts",
  "apps/web/src/app/api/v1/organizations/[id]/trust-score/recalculate/route.ts",
  "apps/web/src/app/api/v1/impact/calculate/route.ts",
  "apps/web/src/app/api/v1/certificates/[id]/history/route.ts",
  "apps/web/src/app/api/v1/audit/route.ts",
];

function file(path) {
  return readFileSync(path, "utf8");
}

test("security migration defines platform roles and permission audit logging", () => {
  for (const token of [
    "create type public.platform_role",
    "founder",
    "platform_admin",
    "reviewer",
    "pilot_coordinator",
    "organization_admin",
    "organization_user",
    "create table if not exists public.user_platform_roles",
    "create table if not exists public.permission_audit_events",
    "record_permission_audit_event",
    "permission.' || target_decision",
  ]) {
    assert.ok(migration.includes(token), `missing ${token}`);
  }
});

test("identity hardening migration synchronizes platform roles into auth claims", () => {
  for (const token of [
    "sync_user_platform_role_claims",
    "raw_app_meta_data",
    "redist_platform_roles",
    "sync_user_platform_role_claims_after_change",
    "assign_platform_role",
    "revoke_platform_role",
    "platform_role.assign",
    "platform_role.revoke",
  ]) {
    assert.ok(identityMigration.includes(token), `missing ${token}`);
  }
});

test("server permission module defines required roles, permissions, and organization scope checks", () => {
  for (const token of [
    "founder.route.access",
    "pilot.monitor.read",
    "admin.route.access",
    "verification.review",
    "verification.document.review",
    "organization.manage",
    "organization.read",
    "listing.create",
    "listing.manage",
    "request.create",
    "request.manage",
    "trust.recalculate",
    "impact.calculate.persist",
    "audit.read",
    "rolesFromUserClaims",
    "rolesFromPlatformAssignments",
    "resolveActorRoles",
    "requirePermission",
    "getOrganizationRole",
    "getRequestScope",
    "recordPermissionAudit",
  ]) {
    assert.ok(permissions.includes(token), `missing ${token}`);
  }

  assert.equal(permissions.includes("x-redist-role"), false, "must not trust role headers");
  assert.equal(permissions.includes("redist_role"), false, "must not trust role cookies");
  assert.ok(permissions.includes('from("user_platform_roles")'));
  assert.ok(permissions.includes("redist_platform_roles"));
});

test("route-level proxy blocks direct founder, reviewer, admin, and audit access", () => {
  for (const token of [
    "/app/pilot-monitoring",
    "founder.route.access",
    "/api/v1/audit",
    "audit.read",
    "verification.review",
    "trust.recalculate",
    "Permission denied.",
    "getOptionalUser",
    "NextResponse.redirect",
  ]) {
    assert.ok(proxy.includes(token), `missing ${token}`);
  }
});

test("API error handler returns permission status codes instead of generic failures", () => {
  assert.ok(api.includes('"status" in error'));
  assert.ok(api.includes("error.status"));
});

test("privileged and tenant-scoped APIs call server-side permission checks", () => {
  for (const path of routeFiles) {
    assert.equal(existsSync(path), true, `missing ${path}`);
  }

  for (const path of routeFiles.filter((path) => !path.endsWith("audit/route.ts"))) {
    assert.ok(file(path).includes("requirePermission") || file(path).includes("requireRequesterOrPermission"), `missing permission guard in ${path}`);
  }

  assert.ok(file("apps/web/src/app/api/v1/audit/route.ts").includes('permission: "audit.read"'));
  assert.ok(file("apps/web/src/app/api/v1/verifications/[id]/review/route.ts").includes('permission: "verification.review"'));
  assert.ok(file("apps/web/src/app/api/v1/verifications/[id]/documents/[documentId]/route.ts").includes('permission: input.status_code ? "verification.document.review" : "verification.create"'));
  assert.ok(file("apps/web/src/app/api/v1/listings/route.ts").includes('permission: "listing.create"'));
  assert.ok(file("apps/web/src/app/api/v1/requests/[id]/complete/route.ts").includes("requireRequesterOrPermission"));
});

test("founder monitoring route is protected by middleware and no longer client-only", () => {
  const dashboard = file("apps/web/src/app/app/pilot-monitoring/page.tsx");

  assert.ok(dashboard.includes("Founder only"));
  assert.ok(proxy.includes("founder.route.access"));
  assert.ok(proxy.includes("/app/pilot-monitoring"));
});
