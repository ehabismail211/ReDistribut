import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("certificate download rejects unknown ids without demo fallback", () => {
  const source = read("apps/web/src/app/api/v1/certificates/[id]/download/route.ts");

  assert.equal(source.includes('publicCertificateFromToken("qr_demo_public_safe")'), false);
  assert.match(source, /Certificate not found\./);
  assert.match(source, /404/);
});

test("web lint command is compatible with the current Next setup", () => {
  const pkg = JSON.parse(read("apps/web/package.json"));

  assert.notEqual(pkg.scripts.lint, "next lint");
  assert.equal(pkg.scripts.lint, "tsc -p tsconfig.json --noEmit");
});

test("pre-invitation hardening documents exist", () => {
  for (const path of [
    "docs/PILOT_RELEASE_CONTROL_NOTE.md",
    "docs/PRE_INVITATION_STAGING_VALIDATION_CHECKLIST.md",
    "docs/PRE_INVITATION_CRITICAL_HARDENING_REPORT.md",
  ]) {
    assert.equal(existsSync(path), true, `missing ${path}`);
  }
});
