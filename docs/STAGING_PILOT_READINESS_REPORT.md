# Staging Pilot Readiness Report

Project: ReDist  
Date: 2026-06-20  
Sprint: Pilot Staging Readiness  
Goal: Prepare the staging environment for real UAE pilot users.

## Executive Summary

ReDist now has a staging pilot seed package for the first controlled UAE pilot cohort, plus validation coverage for identity, roles, organizations, memberships, route protection, API protection, and cross-tenant denial.

The seed is intentionally kept outside normal production migrations so pilot users can be applied to staging/local environments without polluting production.

Recommendation: **Pilot Go after staging seed execution and live account verification**.

## Implemented Artifacts

### Staging Seed

Created:

- `supabase/seeds/staging_pilot_seed.sql`

The seed creates:

- Founder seed account
- Platform Admin seed account
- Reviewer seed account
- Pilot Coordinator seed account
- Five sample pilot organizations
- Organization admin and organization user memberships for each pilot organization
- Audit event confirming the staging pilot seed was applied

Default seed password:

- `ReDistPilot!2026`

Operational requirement:

- Rotate passwords before inviting real pilot users.

### Organization Role RLS Hardening

Created:

- `supabase/migrations/202606200007_organization_role_rls_hardening.sql`

Purpose:

- Updates `public.is_organization_admin` so database policies recognize both legacy `admin` and production `organization_admin`.

This keeps API-level organization admin resolution aligned with database RLS behavior.

### Test Coverage

Created:

- `scripts/staging-pilot-readiness.test.mjs`

Coverage:

- Required platform accounts
- Required platform roles
- Required pilot organizations
- Organization admin/user memberships
- Organization admin RLS compatibility
- Staging report presence and freeze guidance

## Seed Accounts

| Account | Email | Role |
| --- | --- | --- |
| Founder | `founder@staging.redist.ae` | Founder |
| Platform Admin | `platform-admin@staging.redist.ae` | Platform Admin |
| Reviewer | `reviewer@staging.redist.ae` | Reviewer |
| Pilot Coordinator | `pilot-coordinator@staging.redist.ae` | Pilot Coordinator |

## Pilot Organizations

| Organization | Slug | City | Country |
| --- | --- | --- | --- |
| Restaurant A | `restaurant-a` | Dubai | UAE |
| Restaurant B | `restaurant-b` | Dubai | UAE |
| Hotel A | `hotel-a` | Abu Dhabi | UAE |
| Warehouse A | `warehouse-a` | Dubai | UAE |
| NGO A | `ngo-a` | Sharjah | UAE |

## Sample Memberships

Each organization has:

- One `organization_admin`
- One `organization_user`

| Organization | Admin Account | User Account |
| --- | --- | --- |
| Restaurant A | `restaurant-a-admin@staging.redist.ae` | `restaurant-a-user@staging.redist.ae` |
| Restaurant B | `restaurant-b-admin@staging.redist.ae` | `restaurant-b-user@staging.redist.ae` |
| Hotel A | `hotel-a-admin@staging.redist.ae` | `hotel-a-user@staging.redist.ae` |
| Warehouse A | `warehouse-a-admin@staging.redist.ae` | `warehouse-a-user@staging.redist.ae` |
| NGO A | `ngo-a-admin@staging.redist.ae` | `ngo-a-user@staging.redist.ae` |

## Validation Plan

The following checks are ready to execute in staging after applying migrations and seed data.

Required validation checklist: Login, Logout, Role assignment, Route protection, API protection, Cross-tenant denial, Founder dashboard access, Reviewer access, Organization admin access, Organization user access.

### 1. Login

Objective:

- Confirm each seed account can authenticate through the staging login flow.

Expected result:

- Valid credentials create a Supabase session.
- Invalid credentials are rejected.
- Authenticated routes receive a server-readable session token.

Status:

- Ready for staging execution.

### 2. Logout

Objective:

- Confirm logout clears the browser session and protected route access.

Expected result:

- After logout, protected pages redirect or deny access.
- Protected APIs return `401` or `403`.

Status:

- Ready for staging execution.

### 3. Role Assignment

Objective:

- Confirm platform role assignments resolve from `user_platform_roles` and synced auth claims.
- Role assignment must be verified by changing at least one staging user role and confirming route/API access changes accordingly.

Expected result:

- Founder can access founder-only routes.
- Platform Admin can access admin operations.
- Reviewer can access verification review.
- Pilot Coordinator can access pilot monitoring permissions but not founder-only access.

Status:

- Seed and sync functions implemented.

### 4. Route Protection

Objective:

- Confirm direct URL access does not bypass server-side route checks.

Routes:

- `/app/pilot-monitoring`

Expected result:

- Founder allowed.
- Unauthorized users denied.
- Organization-only users denied.

Status:

- Implemented through Next proxy.

### 5. API Protection

Objective:

- Confirm privileged APIs enforce permissions server-side.

APIs:

- Verification review
- Verification document review
- Trust recalculation
- Audit access
- Persisted impact calculation

Expected result:

- Authorized roles succeed.
- Unauthorized users receive `401` or `403`.

Status:

- Implemented and covered by regression tests.

### 6. Cross-Tenant Denial

Objective:

- Confirm users from one organization cannot manage another organization.

Test example:

- `restaurant-a-admin@staging.redist.ae` attempts to modify `Restaurant B`.

Expected result:

- Access denied.
- Permission denial is audit logged.

Status:

- Tenant checks implemented; staging live-user execution required.

### 7. Founder Dashboard Access

Objective:

- Confirm founder can access pilot monitoring.

Expected result:

- `founder@staging.redist.ae` can access `/app/pilot-monitoring`.
- Non-founder users are denied.

Status:

- Implemented and ready for staging verification.

### 8. Reviewer Access

Objective:

- Confirm reviewer can perform verification review actions but cannot perform founder-only actions.

Expected result:

- Reviewer can access verification review API.
- Reviewer cannot access founder-only route.

Status:

- Implemented and ready for staging verification.

### 9. Organization Admin Access

Objective:

- Confirm organization admins can manage their own organization workflows.

Expected result:

- Organization admin can create listings for their own organization.
- Organization admin can manage own organization requests.
- Organization admin cannot manage another organization.

Status:

- Implemented and ready for staging verification.

### 10. Organization User Access

Objective:

- Confirm organization users have limited workspace permissions.

Expected result:

- Organization user can read their organization.
- Organization user can create requests.
- Organization user cannot publish listings or manage organization settings.

Status:

- Implemented and ready for staging verification.

## Validation Results

Validation run: 2026-06-20 22:08 +04

| Validation | Result |
| --- | --- |
| Typecheck | Passed |
| Build | Passed |
| Tests | Passed, 52 tests |
| Simulation Runner | Passed, 4/4 scenarios |

This report is complete from a repository validation perspective. Final pilot Go still requires applying the seed to the real staging Supabase project and verifying live browser sessions.

## Staging Execution Checklist

Before inviting pilot users:

- Apply all migrations through `202606200007_organization_role_rls_hardening.sql`.
- Apply `supabase/seeds/staging_pilot_seed.sql` to the staging project only.
- Rotate all default passwords.
- Confirm each platform account can log in.
- Confirm each organization account can log in.
- Confirm Founder dashboard access.
- Confirm Reviewer verification access.
- Confirm Organization Admin own-tenant access.
- Confirm Organization User limited access.
- Confirm one cross-tenant denial.
- Confirm permission audit event is written for a denied action.

## Remaining Blockers

### High: Seed Must Be Applied to Real Staging Supabase

The seed artifact exists locally, but the actual staging project must be migrated and seeded before real users are invited.

Resolution:

- Apply migrations and seed SQL to staging.
- Capture login evidence for all role classes.

### High: Password Rotation Required

The seed uses a shared controlled password for setup speed.

Resolution:

- Rotate passwords before inviting organizations.
- Prefer one-time setup links for real pilot participants.

### Medium: Live Browser Login Evidence Required

Automated checks validate code and seed completeness, but live browser evidence is still required for staging auth cookies and protected route access.

Resolution:

- Execute founder validation checklist in staging.
- Capture screenshots or notes for each role.

### Medium: Cross-Tenant Denial Must Be Verified with Real Staging Sessions

The application has tenant checks, but final assurance should use real staged accounts.

Resolution:

- Use Restaurant A Admin to attempt Restaurant B action.
- Confirm denial and audit event.

## Readiness Estimate

| Area | Estimate |
| --- | ---: |
| Product Readiness | 92% |
| Security Readiness | 92% |
| Architecture Readiness | 87% |
| Staging Identity Readiness | 88% before seed execution, 95% after live verification |
| UAE Pilot Readiness | 93% after seed execution and live verification |
| UAE Commercial Readiness | 61% |

## Pilot Go / No-Go Recommendation

Recommendation: **Pilot Go after staging execution checklist is complete**.

Current state:

- **Conditional Go**

Go criteria:

- Staging seed applied.
- Passwords rotated.
- Login/logout verified.
- Founder route verified.
- Reviewer action verified.
- Organization admin action verified.
- Organization user limitation verified.
- Cross-tenant denial verified.
- Audit logging verified.
- No critical security issues found.

No-Go criteria:

- Any role can access another tenant’s protected data.
- Any organization user can perform organization admin actions.
- Any protected route is accessible after logout.
- Any privileged API succeeds without a valid authenticated session.
- Permission audit logging fails for denied privileged access.

## Freeze Development

After this staging readiness report and successful validation, development should freeze except for:

- Bug fixes
- Security fixes
- Pilot feedback fixes

Do not start new platform modules before pilot onboarding.

## First 30-Day Pilot Targets

Measure:

- Adoption: did pilot users log in?
- Usage: did they create listings?
- Engagement: did they request items?
- Success: did they complete transfers?
- Satisfaction: would they continue using ReDist?

Success target:

- 5 organizations onboarded
- 50 listings
- 20 requests
- 10 completed transfers
- 5 certificates
- 0 critical security issues

If achieved:

- Move to Commercial Readiness Phase targeting 95%+ readiness.
