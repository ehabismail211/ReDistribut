import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const paths = {
  lib: "apps/web/src/lib/leads.ts",
  api: "apps/web/src/app/api/v1/leads/route.ts",
  updateApi: "apps/web/src/app/api/v1/leads/[id]/route.ts",
  form: "apps/web/src/app/contact/contact-form.tsx",
  page: "apps/web/src/app/app/leads/page.tsx",
  proxy: "apps/web/src/proxy.ts",
  migration: "supabase/migrations/202606220001_marketing_leads.sql",
  docs: "docs/LEAD_MANAGEMENT_WORKFLOW.md",
};

function file(path) {
  return readFileSync(path, "utf8");
}

test("lead management foundation files exist", () => {
  for (const path of Object.values(paths)) {
    assert.equal(existsSync(path), true, `missing ${path}`);
  }
});

test("contact form submits lead records through the server endpoint", () => {
  const form = file(paths.form);

  for (const token of [
    'fetch("/api/v1/leads"',
    'name: String(formData.get("name")',
    'organization: String(formData.get("organization")',
    'email: String(formData.get("email")',
    'phone: String(formData.get("phone")',
    "inquiryType",
    "message",
    "consent",
    "website",
    "renderedAt",
  ]) {
    assert.ok(form.includes(token), `missing ${token}`);
  }

  assert.equal(form.includes("localStorage"), false, "contact form must not use browser-only storage");
});

test("lead API validates fields, applies spam controls, and uses server-side storage", () => {
  const api = file(paths.api);
  const lib = file(paths.lib);

  for (const token of [
    "createLeadSchema",
    "assertHumanSubmission",
    "assertRateLimit",
    "x-forwarded-for",
    "created(data)",
    "supabaseClient({ serviceRole: true })",
    "marketing_leads",
  ]) {
    assert.ok(`${api}\n${lib}`.includes(token), `missing ${token}`);
  }
});

test("founder lead review route is protected and exposes required statuses", () => {
  const page = file(paths.page);
  const proxy = file(paths.proxy);
  const updateApi = file(paths.updateApi);
  const lib = file(paths.lib);

  for (const token of [
    "New leads",
    "Contacted",
    "Meeting booked",
    "Pilot candidate",
    "Archived",
    "LeadStatusActions",
    "/app/leads",
    "founder.route.access",
  ]) {
    assert.ok(`${page}\n${proxy}\n${updateApi}\n${lib}`.includes(token), `missing ${token}`);
  }
});

test("Supabase migration creates lead table with RLS and operator-only review policies", () => {
  const migration = file(paths.migration);

  for (const token of [
    "create table public.marketing_leads",
    "name text not null",
    "organization text not null",
    "email text not null",
    "phone text",
    "inquiry_type public.marketing_lead_inquiry_type not null",
    "message text not null",
    "created_at timestamptz not null default now()",
    "alter table public.marketing_leads enable row level security",
    "platform operators view marketing leads",
    "platform operators update marketing leads",
  ]) {
    assert.ok(migration.includes(token), `missing ${token}`);
  }
});

test("lead management workflow document defines founder-operated process", () => {
  const docs = file(paths.docs);

  for (const token of [
    "Lead Capture Flow",
    "Captured Fields",
    "Lead Statuses",
    "Founder Review Routine",
    "Spam Protection",
    "Access Control",
    "Environment Requirements",
  ]) {
    assert.ok(docs.includes(token), `missing ${token}`);
  }
});
