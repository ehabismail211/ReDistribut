import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("supabase/migrations/202606190001_verification_foundation.sql", "utf8");
const sharedContracts = readFileSync("packages/shared/src/index.ts", "utf8");
const serviceLayer = readFileSync("apps/web/src/lib/verification.ts", "utf8");
const repositoryLayer = readFileSync("apps/web/src/lib/verification-repository.ts", "utf8");
const apiDocs = readFileSync("docs/API.md", "utf8");

const expectedLevels = [
  "unverified",
  "basic_verified",
  "business_verified",
  "enterprise_verified",
  "ngo_verified",
  "government_verified",
];

const expectedDocumentTypes = [
  "trade_license",
  "vat_trn",
  "food_permit",
  "storage_permit",
  "ngo_license",
  "government_authorization",
  "other",
];

const expectedRoutes = [
  "apps/web/src/app/api/v1/verification-statuses/route.ts",
  "apps/web/src/app/api/v1/verifications/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/submit/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/review/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/documents/route.ts",
  "apps/web/src/app/api/v1/verifications/[id]/documents/[documentId]/route.ts",
];

test("migration defines verification foundation entities", () => {
  for (const table of [
    "verification_statuses",
    "organization_verifications",
    "verification_documents",
    "verification_audit_events",
    "platform_staff_roles",
  ]) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`));
  }
});

test("migration and shared contracts include required levels and document types", () => {
  for (const value of [...expectedLevels, ...expectedDocumentTypes]) {
    assert.ok(migration.includes(`'${value}'`), `migration missing ${value}`);
    assert.ok(sharedContracts.includes(`"${value}"`), `shared contracts missing ${value}`);
  }
});

test("verification permission and audit functions are present", () => {
  for (const functionName of [
    "has_platform_role",
    "can_submit_verification",
    "can_review_verification",
    "record_verification_audit_event",
  ]) {
    assert.ok(migration.includes(`function public.${functionName}`), `missing ${functionName}`);
  }
});

test("verification service and repository layers are separated", () => {
  assert.ok(serviceLayer.includes("verification-repository"), "service layer should use repository layer");
  assert.ok(repositoryLayer.includes("organization_verifications"), "repository should own verification table access");
  assert.ok(repositoryLayer.includes("verification_documents"), "repository should own document table access");
  assert.ok(repositoryLayer.includes("record_verification_audit_event"), "repository should own audit RPC access");
});

test("verification API route files and API documentation exist", () => {
  for (const route of expectedRoutes) {
    assert.equal(existsSync(route), true, `missing route ${route}`);
  }

  for (const endpoint of [
    "/api/v1/verification-statuses",
    "/api/v1/verifications",
    "/api/v1/verifications/{id}/submit",
    "/api/v1/verifications/{id}/review",
    "/api/v1/verifications/{id}/documents",
  ]) {
    assert.ok(apiDocs.includes(endpoint), `API docs missing ${endpoint}`);
  }
});
