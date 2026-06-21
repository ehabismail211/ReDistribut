# Pilot Security & Permissions Report

Date: 2026-06-20

## Scope

This sprint closed remaining critical security and permission gaps before onboarding real UAE pilot organizations.

Reviewed:

- `docs/UAE_MVP_READINESS_ASSESSMENT.md`
- `docs/UAE_PILOT_REMEDIATION_PLAN.md`
- `docs/PRODUCTION_ARCHITECTURE.md`

Implemented:

- Route-level protection
- Server-side permission enforcement
- API permission enforcement
- Founder-only route protection
- Admin/reviewer privileged API protection
- Organization admin and organization user permission checks
- Pilot monitoring route permissioning
- Verification review permissions
- Audit access permissions
- Privileged permission audit foundation

## Roles Implemented

| Role | Scope |
| --- | --- |
| Founder | Full pilot, admin, reviewer, audit, trust, impact, organization, listing, and request control |
| Platform Admin | Platform operations, admin APIs, reviewer workflows, audit, trust, and impact control |
| Reviewer | Verification review, document review, organization read, audit read |
| Pilot Coordinator | Pilot monitoring, organization read, request management, audit read |
| Organization Admin | Organization management, verification creation, listings, requests, organization audit read |
| Organization User | Organization read and request creation |

## Implemented Files

| File | Purpose |
| --- | --- |
| `supabase/migrations/202606200005_pilot_security_permissions.sql` | Platform roles, organization role expansion, permission audit events, permission audit function |
| `apps/web/src/lib/permissions.ts` | Server-side RBAC, permission checks, org-scope checks, request-scope checks, audit logging |
| `apps/web/src/proxy.ts` | Route-level direct URL/API protection using the current Next.js proxy convention |
| `apps/web/src/lib/api.ts` | Permission error status handling |
| `apps/web/src/app/api/v1/audit/route.ts` | Scoped audit access API |
| `scripts/pilot-security-permissions.test.mjs` | Security and permission validation tests |

## Security Coverage

### 1. Route-Level Protection

Protected by server-side proxy:

| Route | Permission |
| --- | --- |
| `/app/pilot-monitoring` | `founder.route.access` |
| `/api/v1/audit` | `audit.read` |
| `/api/v1/verifications/{id}/review` | `verification.review` |
| `/api/v1/organizations/{id}/trust-score/recalculate` | `trust.recalculate` |

Direct URL access now goes through server-side route guards before page/API execution.

### 2. Server-Side Permission Enforcement

Implemented reusable server permission checks:

- `roleFromRequest`
- `roleHasPermission`
- `requireRoutePermission`
- `requirePermission`
- `requireRequesterOrPermission`
- `hasOrganizationPermission`
- `getListingOrganizationId`
- `getVerificationOrganizationId`
- `getRequestScope`
- `recordPermissionAudit`

Permissions are evaluated on the server and are not client-side-only.

### 3. API Permission Enforcement

Added permission checks to privileged and tenant-scoped APIs:

| API Area | Enforcement |
| --- | --- |
| Verification review | Reviewer/platform/founder permission required |
| Verification document update | Reviewer required for review status changes; organization admin allowed for organization document updates |
| Verification list/create | Reviewer for platform list; organization-scoped access for organization read/create |
| Listing create | Organization admin or platform/founder permission required |
| Listing publish/pause | Organization admin or platform/founder permission required |
| Listing request create | Organization user/admin or platform/founder permission required |
| Request accept/decline | Sender organization admin or platform/founder permission required |
| Request complete/cancel | Requester or sender organization admin/platform permission required |
| Trust recalculation | Founder/platform admin permission required |
| Persisted impact calculation | Founder/platform/admin-scoped permission required |
| Certificate history | Audit read permission required |
| Audit API | Audit read permission and organization scope required |

### 4. Multi-Tenant Isolation

Implemented organization-scope checks before sensitive mutations:

- Listing organization is resolved before publish/pause.
- Verification organization is resolved before review/document changes.
- Listing request sender organization and requester are resolved before workflow actions.
- Organization-scoped audit reads require organization permission unless platform role allows broader access.

Database RLS remains the lower-level safety net, while application code now blocks unauthorized API access earlier.

### 5. Founder-Only Routes

The pilot monitoring dashboard route is protected server-side:

- `/app/pilot-monitoring`
- Permission: `founder.route.access`

This closes the previous gap where the page was founder-only by label but not by server-side access control.

### 6. Admin-Only Routes

Protected:

- Trust score recalculation.
- Persisted impact calculation.
- Audit access.

### 7. Reviewer-Only Actions

Protected:

- Verification review.
- Verification document status review.

### 8. Organization Admin Permissions

Organization admins can:

- Manage organization-scoped verification creation.
- Create listings.
- Publish/pause listings.
- Manage requests for their organization.
- Read organization-scoped audit records.

### 9. Organization User Permissions

Organization users can:

- Read organization context.
- Create listing requests.
- Complete/cancel their own request where requester scope matches.

### 10. Pilot Monitoring Permissions

Pilot monitoring is now server-gated at route level and reserved for founder access.

### 11. Audit Access Permissions

Added:

- `/api/v1/audit`
- `permission_audit_events`
- `record_permission_audit_event(...)`

Privileged permission decisions attempt to write permission audit records and mirror them into `audit_events`.

## Validation Coverage

Validation tests cover:

- Unauthorized route access patterns through proxy source checks.
- Founder-only route protection.
- Reviewer-only verification review protection.
- Admin-only trust recalculation protection.
- Audit route permission protection.
- API permission guards across tenant-scoped route handlers.
- Permission error status handling.
- Platform role migration and permission audit foundation.
- Simulation compatibility.

## Validation Results

| Command | Result |
| --- | --- |
| `./.tools/pnpm typecheck` | Pass |
| `./.tools/pnpm build` | Pass |
| `./.tools/pnpm test` | Pass, 46 tests |
| `node scripts/simulation-runner.mjs` | Pass, 4/4 scenarios |

The production build includes:

- `/api/v1/audit`
- `/app/pilot-monitoring`
- Next.js proxy route protection

## Pilot Onboarding Pack

Created pilot onboarding documents:

- `docs/UAE_PILOT_ONBOARDING_GUIDE.md`
- `docs/UAE_PILOT_TRAINING_GUIDE.md`
- `docs/UAE_PILOT_FEEDBACK_FORM.md`
- `docs/UAE_PILOT_WEEKLY_REVIEW_TEMPLATE.md`

These are documentation-only and are intended for real pilot onboarding.

## Remaining Risks

### High

| Risk | Status | Mitigation |
| --- | --- | --- |
| Role source is currently request-header/cookie based until production auth claims are wired. | Open | Before real pilot launch, map roles to Supabase user metadata or `user_platform_roles` lookups in session middleware. |
| Branch-scoped permissions are still not implemented. | Priority 2 | Keep first cohort single-branch per organization or use manual founder controls. |
| Audit exports are not yet implemented. | Priority 2 | Audit read API exists; export controls can follow after pilot starts. |
| Live private bucket configuration must still be verified. | Open ops task | Complete Supabase bucket setup and access test before collecting real documents. |

### Medium

| Risk | Status | Mitigation |
| --- | --- | --- |
| Permission tests are source/assertion based, not full live Supabase integration tests. | Open | Run staging tenant-boundary tests with real pilot-like accounts before invitations. |
| Organization role enum now supports expanded roles, but existing data may still use `admin` and `member`. | Expected | Permission helper maps `admin` to organization admin and `member` to organization user. |
| Pilot coordinator route access is intentionally limited. | Accepted | Founder dashboard remains founder-only; pilot coordinator can be expanded after role assignment is finalized. |

## Updated Readiness Estimate

| Readiness Area | Before Security Sprint | After Security Sprint |
| --- | ---: | ---: |
| UAE Pilot Readiness | 87% | 90% |
| Security Readiness | 78% | 86% |
| Architecture Readiness | 82% | 84% |
| UX Readiness | 84% | 84% |
| Mobile Browser Readiness | 82% | 82% |
| Commercial Readiness | 56% | 58% |

## Recommendation

**Conditional Go remains the correct decision for controlled UAE pilot onboarding.**

The platform now has materially stronger route-level, API-level, and organization-scope permission enforcement. Before inviting real pilot organizations, complete:

1. Supabase role claim or platform role assignment setup.
2. Staging tenant-boundary tests with real pilot-like accounts.
3. Private storage bucket verification.
4. Founder sign-off on onboarding, training, feedback, and weekly review documents.

After those operational gates are complete, stop building new platform features and begin real onboarding.
