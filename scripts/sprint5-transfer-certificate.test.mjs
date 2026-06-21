import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  createLocalTransferCertificate,
  generateTransferCertificatePdf,
  publicCertificateFromToken,
  verificationUrl,
} from "../apps/web/src/lib/transfer-certificate.ts";
import { runAllScenarios } from "./simulation-runner.mjs";

const migration = readFileSync("supabase/migrations/202606200003_transfer_certificate_foundation.sql", "utf8");
const sharedContracts = readFileSync("packages/shared/src/index.ts", "utf8");
const workspace = readFileSync("apps/web/src/app/app/workspace.tsx", "utf8");

function certificateFromScenario(scenario, index) {
  return createLocalTransferCertificate({
    transaction_id: `txn-${scenario.id}`,
    listing_request_id: null,
    sender_organization_id: "00000000-0000-4000-8000-000000000001",
    receiver_organization_id: null,
    sender_organization_name: scenario.organization.type,
    receiver_organization_name: "Approved recipient organization",
    item_name: scenario.listing.title,
    category: scenario.listing.category,
    quantity: scenario.listing.completedQuantity,
    unit: scenario.listing.unit,
    estimated_value: scenario.listing.completedQuantity * (scenario.listing.unitPrice ?? 18),
    currency: "AED",
    transfer_date: "2026-06-20T10:30:00.000Z",
    location: scenario.organization.location,
    handover_method: scenario.listing.handoverMethod,
    trust_snapshot: {
      score: 82,
      level: "Gold",
      verification_level: "Business Verified",
      verification_status: "Verified",
    },
    impact_snapshot: {
      aed_recovered: scenario.listing.completedQuantity * (scenario.listing.unitPrice ?? 18),
      resources_redistributed: scenario.listing.completedQuantity,
      waste_prevented_kg: scenario.listing.completedQuantity,
      co2_saved_kg: scenario.listing.completedQuantity * 2,
    },
  }, index + 1);
}

test("transfer certificate migration defines entity, history, audit, and public verification", () => {
  assert.match(migration, /create table if not exists public\.transfer_certificates/);
  assert.match(migration, /create table if not exists public\.transfer_certificate_history/);
  assert.match(migration, /certificate\.issued/);
  assert.match(migration, /verify_transfer_certificate/);
  assert.match(migration, /issue_transfer_certificate/);
  assert.match(migration, /qr_verification_token/);
});

test("shared contracts include certificate fields and statuses", () => {
  for (const value of ["issued", "revoked", "superseded", "expired"]) {
    assert.ok(sharedContracts.includes(`"${value}"`), `missing status ${value}`);
  }

  for (const field of [
    "transaction_id",
    "sender_organization_name",
    "receiver_organization_name",
    "item_name",
    "trust_snapshot",
    "impact_snapshot",
  ]) {
    assert.ok(sharedContracts.includes(field), `missing field ${field}`);
  }
});

test("completed simulation scenarios produce QR-verifiable certificates", () => {
  const output = runAllScenarios();
  const certificates = output.results.map(certificateFromScenario);

  assert.equal(certificates.length, 4);

  for (const certificate of certificates) {
    assert.equal(certificate.status, "issued");
    assert.ok(certificate.certificate_number.startsWith("RD-UAE-"));
    assert.ok(certificate.qr_verification_token.startsWith("qr_"));
    assert.ok(verificationUrl(certificate.qr_verification_token).startsWith("/verify/certificates/"));
    assert.equal(certificate.history[0].event, "certificate.issued");
    assert.ok(certificate.impact_snapshot.resources_redistributed > 0);
  }
});

test("public verification payload is public safe", () => {
  const certificate = publicCertificateFromToken("qr_demo_public_safe");

  assert.ok(certificate);
  assert.equal(certificate.status, "issued");
  assert.equal(certificate.sender_organization_name, "Demo Restaurant Group");
  assert.equal(certificate.receiver_organization_name, "Dubai Community NGO");
  assert.equal(certificate.item_name, "Prepared chicken meals");
  assert.equal("authorizedEmail" in certificate, false);
  assert.equal("internal_notes" in certificate, false);
});

test("public verification rejects invalid QR tokens", () => {
  assert.equal(publicCertificateFromToken("invalid-token"), null);
});

test("certificate PDF generation returns a PDF payload with certificate metadata", () => {
  const certificate = publicCertificateFromToken("qr_demo_public_safe");
  assert.ok(certificate);

  const pdf = generateTransferCertificatePdf(certificate);
  const text = new TextDecoder().decode(pdf);

  assert.ok(text.startsWith("%PDF-1.4"));
  assert.ok(text.includes("ReDist Transfer Certificate"));
  assert.ok(text.includes(certificate.certificate_number));
  assert.ok(text.includes("Impact Summary"));
  assert.ok(text.includes("Trust Summary"));
  assert.ok(text.includes("QR Token"));
});

test("certificate API routes and UI surfaces exist", () => {
  for (const route of [
    "apps/web/src/app/api/v1/certificates/route.ts",
    "apps/web/src/app/api/v1/certificates/[id]/history/route.ts",
    "apps/web/src/app/api/v1/certificates/[id]/download/route.ts",
    "apps/web/src/app/api/v1/public/certificates/[token]/route.ts",
    "apps/web/src/app/verify/certificates/[token]/page.tsx",
  ]) {
    assert.equal(existsSync(route), true, `missing route ${route}`);
  }

  for (const component of ["CertificatesSection", "CertificatePdfLayout", "CertificateHistory", "QrVerificationBlock"]) {
    assert.ok(workspace.includes(component), `missing UI component ${component}`);
  }
});
