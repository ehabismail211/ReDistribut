# Pre-Pilot Identity & Role Hardening Report

Project: ReDist  
Date: 2026-06-20  
Sprint Goal: Close the final critical identity and role-resolution gap before onboarding real UAE pilot organizations.

## Executive Summary

The pilot security layer has been hardened so privileged access is no longer based on client-provided role headers or role cookies. Route, API, and server-side permission checks now resolve roles from authenticated Supabase identity, synchronized platform role assignments, and organization membership records.

This closes the final critical security readiness gap identified in `PILOT_SECURITY_PERMISSIONS_REPORT.md`: temporary role source dependency.

Recommendation: **Conditional Go for controlled UAE pilot onboarding**, pending staging role seeding and founder sign-off.

## Documents Reviewed

- `docs/PILOT_SECURITY_PERMISSIONS_REPORT.md`
- `docs/PRODUCTION_ARCHITECTURE.md`

## Implementation Summary

### 1. Supabase Auth Claim Integration

Implemented authenticated identity extraction in `apps/web/src/lib/supabase.ts`.

Supported server-side auth sources:

- `Authorization: Bearer <token>`
- Supabase auth session cookies
- Explicit `redist_access_token` cookie for controlled deployment flows

Role claims are resolved from Supabase user metadata:

- `app_metadata.redist_platform_roles`
- `app_metadata.redist_platform_role`
- `app_metadata.platform_roles`
- `app_metadata.platform_role`
- `app_metadata.roles`
- `app_metadata.role`
- `user_metadata.redist_platform_roles`
- `user_metadata.redist_platform_role`

Security rule:

- Role headers and role cookies are no longer trusted for authorization.

### 2. `user_platform_roles` Integration

Updated `apps/web/src/lib/permissions.ts` to resolve active platform role assignments from:

- `public.user_platform_roles`
- `revoked_at is null`
- Authenticated `user.id`

Supported platform roles:

- Founder
- Platform Admin
- Reviewer
- Pilot Coordinator

### 3. Role Synchronization

Added migration:

- `supabase/migrations/202606200006_identity_role_hardening.sql`

The migration adds:

- `sync_user_platform_role_claims(target_user_id uuid)`
- `sync_user_platform_role_claims_from_row()`
- Trigger: `sync_user_platform_role_claims_after_change`
- `assign_platform_role(target_user_id uuid, target_role public.platform_role)`
- `revoke_platform_role(target_user_id uuid, target_role public.platform_role)`

Behavior:

- Active platform roles are synchronized into `auth.users.raw_app_meta_data.redist_platform_roles`.
- Role assignment and revocation are audited through permission audit events.
- Only Founder and Platform Admin can assign or revoke platform roles.

### 4. Founder Role Resolution

Founder access now resolves from:

- Supabase auth claims, or
- Active `user_platform_roles` assignment.

Founder-only permissions include:

- `founder.route.access`
- `pilot.monitor.read`
- `admin.route.access`
- `verification.review`
- `verification.document.review`
- `trust.recalculate`
- `impact.calculate.persist`
- `audit.read`

Protected route:

- `/app/pilot-monitoring`

### 5. Admin Role Resolution

Platform Admin access now resolves from:

- Supabase auth claims, or
- Active `user_platform_roles` assignment.

Admin permissions include:

- Admin route access
- Verification review
- Organization read/manage
- Listing and request management
- Trust recalculation
- Persisted impact calculation
- Audit access

### 6. Reviewer Role Resolution

Reviewer access now resolves from:

- Supabase auth claims, or
- Active `user_platform_roles` assignment.

Reviewer permissions include:

- Verification review
- Verification document review
- Organization read
- Audit read

Protected API:

- `/api/v1/verifications/:id/review`

### 7. Organization Admin Role Resolution

Organization Admin access resolves from:

- `public.organization_members`
- Matching `organization_id`
- Matching authenticated `user_id`
- Role value: `admin` or `organization_admin`

Organization Admin permissions include:

- Verification creation
- Organization management
- Organization read
- Listing creation and management
- Request creation and management
- Organization-scoped audit read

### 8. Organization User Role Resolution

Organization User access resolves from:

- `public.organization_members`
- Matching `organization_id`
- Matching authenticated `user_id`
- Non-admin organization membership role

Organization User permissions include:

- Organization read
- Request creation

### 9. Server-Side Enforcement

Updated enforcement model:

- All privileged APIs call `requireUser`.
- All privileged APIs call `requirePermission` or `requireRequesterOrPermission`.
- Permission checks resolve identity and role server-side.
- Permission denials return `401` or `403` through the API error handler.

### 10. Route Enforcement

Updated `apps/web/src/proxy.ts` to resolve the authenticated Supabase user before route permission checks.

Protected routes and APIs include:

- Founder pilot monitoring route
- Trust recalculation API
- Audit access API
- Verification review API

Direct URL access without authenticated permission is blocked.

### 11. API Enforcement

Hardened API behavior now covers:

- Verification review
- Verification document review
- Verification creation
- Listing creation
- Listing publish/pause
- Request creation
- Request accept/decline/cancel/complete
- Trust recalculation
- Persisted impact calculation
- Certificate history
- Audit read

### 12. Multi-Tenant Isolation

Tenant isolation is enforced by combining:

- Authenticated user identity
- Organization-scoped permission checks
- `organization_members` lookup
- Entity-to-organization resolution before privileged action
- Requester-or-owner checks for transaction actions

Blocked access patterns:

- Cross-organization listing management
- Cross-organization verification submission
- Cross-organization request management
- Direct audit access without platform or organization-admin permission

## Audit Logging

Permission decisions are audited through:

- `permission_audit_events`
- `audit_events`

Logged fields include:

- Actor ID
- Resolved actor role
- Permission
- Decision
- Entity type
- Entity ID
- Organization ID
- Role source
- Resolved role list

Privileged role assignment and revocation are also audited.

## Validation Results

Validation run: 2026-06-20 22:02 +04

| Validation | Result |
| --- | --- |
| Typecheck | Passed |
| Build | Passed |
| Tests | Passed, 47 tests |
| Simulation Runner | Passed, 4/4 scenarios |

### Security Validation Coverage

| Scenario | Coverage |
| --- | --- |
| Login | Authenticated user resolution via bearer token or Supabase session cookie |
| Role changes | `assign_platform_role`, `revoke_platform_role`, claim sync trigger |
| Unauthorized access | `401` / `403` from route and API permission checks |
| Cross-tenant access | Organization membership lookup before tenant-scoped actions |
| Audit logging | Permission decisions and role changes recorded |
| Direct URL access | Protected by Next proxy permission checks |
| API access without permission | Blocked by `requirePermission` |

### Simulation Validation

The simulation runner passed:

- Restaurant scenario
- Hotel scenario
- Warehouse scenario
- NGO scenario

All four scenarios retained workflow compatibility after identity hardening.

## Files Changed

### Application

- `apps/web/src/lib/supabase.ts`
- `apps/web/src/lib/permissions.ts`
- `apps/web/src/proxy.ts`

### Database

- `supabase/migrations/202606200006_identity_role_hardening.sql`

### Tests

- `scripts/pilot-security-permissions.test.mjs`

### Documentation

- `docs/PRE_PILOT_IDENTITY_HARDENING_REPORT.md`

## Remaining Risks

### Medium: Staging Role Seeding Required

The platform now supports production-grade role resolution, but pilot users still need real assignments in staging and production:

- Founder user assigned Founder role
- Reviewer user assigned Reviewer role
- Pilot coordinator assigned Pilot Coordinator role
- Organization users assigned to the correct organization memberships

Mitigation:

- Seed pilot roles before onboarding.
- Verify role claims after assignment.
- Confirm route/API access using real pilot accounts.

### Medium: Supabase Cookie Format Should Be Confirmed in Deployment

The server supports common Supabase auth cookie formats, but the exact deployed auth flow should be verified in the production hosting environment.

Mitigation:

- Test browser login on staging.
- Confirm server proxy receives auth token.
- Confirm `/app/pilot-monitoring` blocks and allows the correct users.

### Low: Admin Role Management UI Not Built

Role assignment is available through database functions, but no admin UI exists for role management.

Mitigation:

- Use controlled founder/admin SQL or Supabase console role assignment during the pilot.
- Defer role management UI until post-pilot unless operationally required.

## Updated Readiness Estimate

| Area | Before | After |
| --- | ---: | ---: |
| UAE Pilot Readiness | 90% | 92% |
| Security Readiness | 86% | 91% |
| Architecture Readiness | 84% | 86% |
| UX Readiness | 84% | 84% |
| Mobile Browser Readiness | 82% | 82% |
| UAE Commercial Readiness | 58% | 60% |

## Go / Conditional Go / No-Go Recommendation

Recommendation: **Conditional Go**

ReDist is ready to proceed into controlled UAE pilot onboarding after:

1. Founder, reviewer, pilot coordinator, and organization pilot accounts are seeded.
2. Staging login is verified end to end.
3. Role assignment and revocation are tested on real Supabase users.
4. Founder confirms access to pilot monitoring and audit views.
5. One cross-tenant denial test is completed using real pilot accounts.

## Founder Decision

Proceed with controlled pilot onboarding once the staging identity checklist is completed.

Do not add new platform features before pilot onboarding. The next highest-value work is real organization setup, training, and weekly feedback collection.
