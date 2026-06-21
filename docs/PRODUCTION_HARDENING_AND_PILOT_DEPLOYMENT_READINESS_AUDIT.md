# Production Hardening And Pilot Deployment Readiness Audit

Date: 2026-06-21  
Scope: Final technical, security, deployment, reliability, UX, and operational readiness audit before inviting first real UAE pilot organizations.

## Executive Summary

ReDist is technically strong enough to proceed with a founder-guided UAE Wave 1 pilot, but it is not ready for unmanaged production launch or self-serve onboarding.

The strongest readiness signals are:

- UI Correction Sprint 1 completed the core operational workflow: Dashboard -> Discover -> Requests -> Transfers -> Impact.
- Existing tests pass: 54 / 54.
- Typecheck passes.
- Production build passes.
- Server-side permission checks exist for privileged and tenant-scoped APIs.
- Route protection exists for founder-only pilot monitoring and selected privileged APIs.
- Request workflow, transfer completion, certificate generation, trust, impact, and staging pilot readiness are covered by regression tests.
- Wave 1 execution, participant selection, scenario, observation, and scorecard documents are ready.

The main blockers before inviting live organizations are operational and release-control risks:

- The folder is not a git repository, so release history, branch control, and rollback discipline are absent.
- Live staging validation still must pass against a real deployed environment with real seeded accounts.
- The product workspace still uses local client state for the `/app` pilot preview; production API foundations exist, but the corrected UI workflow is not fully API-backed.
- `./.tools/pnpm lint` fails because the configured script uses `next lint`, which is not valid in this Next 16 setup.
- Certificate download currently falls back to a demo certificate when a requested token/id is not found. This is acceptable for local demos but should be removed or gated before live users.

Recommendation: Conditional Go for inviting first live UAE organizations only after the pilot environment checklist is completed.

## Current Readiness Score

| Area | Score | Notes |
| --- | ---: | --- |
| UI workflow readiness | 84 / 100 | Core workflow is clear after Sprint 1. |
| Authentication readiness | 72 / 100 | Supabase auth helpers exist; live account/session validation still required. |
| Authorization and role access | 80 / 100 | Server permission layer and tests exist; live role mapping must be verified. |
| Organization boundary protection | 78 / 100 | Tenant checks and RLS hardening exist; live cross-tenant denial must pass. |
| Request workflow integrity | 84 / 100 | Tests cover workflow and over-allocation prevention. |
| Transfer and certificate readiness | 80 / 100 | Flow works; demo certificate fallback is a pre-live hardening risk. |
| Admin/founder controls | 74 / 100 | Protected route/API foundations exist; admin shell separation remains incomplete. |
| Deployment readiness | 70 / 100 | Build passes; env, staging, DNS, backups, and live validation remain. |
| Release hygiene | 35 / 100 | Not a git repository. This is the largest release-management risk. |
| Operational pilot readiness | 84 / 100 | Wave 1 documentation package is complete. |

Overall readiness: 77 / 100.

Decision level: Conditional Go, not full Go.

## Critical Blockers

### C1. Workspace is not a git repository

Status: Open.

Evidence:

```text
fatal: not a git repository (or any of the parent directories): .git
```

Risk:

- No commit history.
- No branch or release tag.
- No easy rollback.
- No reliable diff to confirm exactly what changed between validation and deployment.
- No safe collaboration model for production hardening.

Required action:

- Do not initialize git automatically without explicit founder approval.
- Before inviting live organizations, place this project under version control.
- Create a release branch or tag for the pilot deployment.

Recommended branch/release strategy:

1. Initialize or connect to a private remote repository.
2. Create `main` as the protected stable branch.
3. Create `pilot/wave-1-readiness` for final pilot hardening.
4. Tag the validated pilot candidate as `pilot-wave-1-rc1`.
5. Deploy only from a tagged release or protected branch.
6. Keep emergency rollback target as the previous validated tag.

### C2. Live staging validation must pass before real organization invites

Status: Open.

Risk:

- Local tests passing does not prove live auth, cookies, Supabase policies, seed accounts, DNS, or environment variables are correct.

Required action:

- Run `./.tools/pnpm staging:validate` with `STAGING_REQUIRE_LIVE=true`.
- Confirm all live staging checks pass:
  - Login/logout.
  - Role assignment.
  - Route protection.
  - API protection.
  - Cross-tenant denial.
  - Audit logging.
  - Certificate generation.
  - QR verification.
  - Trust and impact updates.

### C3. Demo certificate fallback must be removed or gated before live certificates

Status: Open.

Evidence:

- `apps/web/src/app/api/v1/certificates/[id]/download/route.ts` uses:

```ts
publicCertificateFromToken(id) ?? publicCertificateFromToken("qr_demo_public_safe")
```

Risk:

- A bad certificate id can return a demo certificate PDF.
- This can confuse live users and weaken evidence integrity.

Required action:

- Before live certificate downloads, return `404` for unknown certificate IDs.
- If demo fallback is needed, gate it behind a local/demo environment flag.

## High-Priority Risks

| Risk | Area | Impact | Mitigation |
| --- | --- | --- | --- |
| Corrected workspace UI is still local-state preview | Data persistence | Live users may believe UI state is persisted when it is local | Use only founder-guided sessions until API-backed UI is connected |
| Admin/founder controls live in same workspace shell | Admin-only areas | Organization users may see irrelevant controls if access model is not scoped | Keep founder/admin sections internal; separate admin shell later |
| Role source and live session wiring need staging proof | Authorization | Permission model can fail if roles are not mapped into Supabase claims or assignments | Run live staging validation with all seed roles |
| Branch/location scope is not complete | Organization boundaries | Multi-location organizations may need more granularity | Keep Wave 1 single-branch or founder-managed |
| Verification document storage must be checked live | Security | Private documents must not be public | Verify Supabase private buckets and access policies before collecting documents |
| Error handling returns raw error messages in some cases | Error states | Database or operational errors may be too technical | Founder-guided pilot can tolerate this; improve before self-serve |
| Lint command is broken | Project hygiene | CI quality gate cannot use current lint script | Replace or remove `next lint` script for Next 16 |

## Medium-Priority Risks

| Risk | Area | Impact | Mitigation |
| --- | --- | --- | --- |
| Request/transfer lifecycle states are simplified | Workflow integrity | Accepted represents multiple real-world states | Founder narrates workflow; add richer states later |
| UI sections are not URL-addressable pages | UX/deployment | Deep linking and browser history are limited | Convert core sections to routes after Wave 1 |
| Mobile responsiveness is CSS-validated but not live-device audited here | Mobile UX | Field handover users may hit layout issues | Run mobile walkthrough before first pickup |
| Impact metrics remain pilot/mock-derived until live completions exist | Reporting | Users may overinterpret estimates | Explain pilot-based calculation in guided sessions |
| Notification and messaging surfaces are local/partial | Reliability | Users may expect delivered alerts | Use external support channel for Wave 1 |
| Audit exports are not implemented | Operations | Founder review may require manual evidence collection | Use observation checklist and manual logs |

## Low-Priority Polish Items

| Item | Area |
| --- | --- |
| Add clearer production empty states for no live listings/requests/certificates | UX |
| Add explicit "pilot/demo data" banners where local preview data appears | UX |
| Add route-level pages for Dashboard, Discover, Requests, Transfers, and Impact | Navigation |
| Improve print/export handling for pilot evidence packs | Operations |
| Add more formal accessibility pass with keyboard-only and screen reader review | Accessibility |
| Add performance budget and bundle analysis once live hosting target is chosen | Performance |

## Security Review Notes

### Authentication

Supabase auth helpers exist:

- `requireUser`
- `getOptionalUser`
- Cookie and bearer-token extraction

Readiness:

- Suitable for API-protected pilot workflows if live Supabase environment is correctly configured.
- Must be validated in deployed staging with real browser sessions.

### Authorization / Role Access

Server permission layer exists:

- Platform roles.
- Role-permission map.
- Claims and `user_platform_roles` resolution.
- Organization membership fallback.
- Permission errors and audit attempts.

Readiness:

- Good foundation for founder-guided pilot.
- Requires live role assignment validation before real users.

### Organization Boundaries

Implemented checks exist for:

- Listing organization resolution.
- Verification organization resolution.
- Request scope resolution.
- Organization-scoped audit reads.

Readiness:

- Strong enough for controlled single-branch Wave 1 if live cross-tenant denial passes.

### Request Workflow Integrity

Tests cover:

- Request creation.
- Accept/decline/cancel/complete.
- Over-allocation prevention in simulation scenarios.
- Durable reservation/transaction/handover foundations from Priority 1 remediation.

Readiness:

- Suitable for controlled pilot.

### Transfer Completion Flow

Accepted/completed flow is implemented and validated by tests.

Risk:

- UI and local preview compress real-world handover states.

Readiness:

- Suitable for guided pilot, not yet ideal for self-serve operations.

### Certificate Generation / Verification

Strengths:

- Transfer certificate foundations exist.
- Public QR verification payload is tested as public-safe.
- Certificate PDF generation is tested.

Risk:

- Demo fallback in certificate download route must be removed or gated before live users.

### Admin-Only Areas

Protected:

- `/app/pilot-monitoring`
- audit API.
- verification review API.
- trust recalculation API.

Risk:

- Some admin concepts remain available as secondary local UI sections in `/app`.

Readiness:

- Founder-guided only. Do not expose unmanaged admin workflows.

## Reliability And Data Persistence Notes

The product has production-oriented APIs and database migrations, but the corrected `/app` workspace still uses local client state for much of the pilot UI experience.

Risk:

- Browser reset or local storage clearing can remove preview state.
- Live organizations should not assume all UI interactions persist unless routed through production APIs.

Pilot mitigation:

- Founder-guided Wave 1.
- Manual observation checklist.
- Use staging validation for API-backed workflows.
- Do not run unmanaged production onboarding.

## Error States And Empty States

Strengths:

- Sprint 1 improved empty states across Dashboard, Discover, Requests, Transfers, and Impact.
- API error handling produces structured JSON.

Risks:

- Some API errors may still expose technical messages through generic `handleError`.
- Self-serve users may need more recovery instructions.

Pilot readiness:

- Acceptable with founder guidance.

## Mobile And Accessibility Notes

Mobile:

- CSS responsive rules exist for navigation, dashboard, Discover, Requests, Transfers, and Impact.
- Mobile visual behavior should be manually tested on at least one iPhone and one Android device before first pickup/handover.

Accessibility basics:

- Buttons and semantic sections are used broadly.
- Some complex interactive grids/tables should receive deeper keyboard/screen-reader review later.
- Founder-guided pilot can proceed, but broad launch needs accessibility QA.

## Performance Risks

Current risks:

- `apps/web/src/app/app/workspace.tsx` is large and holds many workflows in one client component.
- Local-state workspace renders many sections from one module.
- No bundle analysis has been run.

Mitigation:

- Production build passes.
- Wave 1 cohort is small.
- Route-splitting should be considered before broader rollout.

## Deployment Checklist

Before inviting first live organizations:

- [ ] Put project under version control.
- [ ] Create protected pilot release branch/tag.
- [ ] Configure production/staging environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Confirm service-role key is server-only.
- [ ] Apply Supabase migrations to staging.
- [ ] Apply staging pilot seed where appropriate.
- [ ] Rotate seed/default passwords.
- [ ] Configure Supabase auth URLs and email settings.
- [ ] Configure private storage buckets for documents/evidence.
- [ ] Confirm RLS policies in live staging.
- [ ] Run strict live staging validation.
- [ ] Confirm certificate QR verification on deployed URL.
- [ ] Confirm backup/restore plan.
- [ ] Confirm support owner and escalation channel.
- [ ] Confirm DNS and SSL.
- [ ] Confirm deployment rollback target.
- [ ] Remove/gate demo certificate fallback.

## Pilot Environment Checklist

- [ ] Founder account can log in.
- [ ] Platform admin account can log in.
- [ ] Reviewer account can log in.
- [ ] Pilot coordinator account can log in.
- [ ] Organization admin account can log in.
- [ ] Organization user account can log in.
- [ ] Unauthorized user cannot access founder route.
- [ ] Unauthorized user cannot call privileged APIs.
- [ ] Cross-tenant organization access is denied.
- [ ] Audit event records permission decision.
- [ ] Listing can be created in permitted category.
- [ ] Request can be submitted.
- [ ] Request can be accepted.
- [ ] Over-request is blocked.
- [ ] Transfer can be completed.
- [ ] Certificate is generated.
- [ ] Public QR verification returns safe payload.
- [ ] Impact updates after completed transfer.
- [ ] Mobile walkthrough passes for Dashboard, Discover, Requests, Transfers.

## Validation Results

Commands run on 2026-06-21:

| Command | Result | Notes |
| --- | --- | --- |
| `./.tools/pnpm test` | Pass | 54 / 54 tests passing |
| `./.tools/pnpm typecheck` | Pass | Shared and web typecheck pass |
| `./.tools/pnpm build` | Pass | Next.js 16 production build succeeds |
| `./.tools/pnpm lint` | Fail | Script calls `next lint`; Next 16 treats `lint` as invalid project directory |

Lint result is a tooling/configuration issue that should be fixed before CI is treated as complete.

## Go / Conditional Go / No-Go Recommendation

Recommendation: Conditional Go for inviting the first live UAE organizations.

Conditions before invitation:

1. Put the project under git/version control and tag a pilot release candidate.
2. Remove or gate the demo certificate fallback in certificate download.
3. Run strict live staging validation with zero failures.
4. Verify Supabase private storage and RLS in the deployed environment.
5. Rotate all staging seed/default passwords.
6. Complete mobile walkthrough on real devices.
7. Keep the first workflow founder-guided.

No-Go triggers:

- Any cross-tenant data exposure.
- Any public exposure of private documents or sensitive certificate data.
- Any unresolved Critical security issue.
- Failed live staging validation.
- No support owner or escalation channel.
- No version-controlled release candidate.

## Final Readiness Statement

ReDist remains at Conditional Go. The product is ready for a founder-guided UAE Wave 1 pilot after the listed pre-invitation hardening actions are completed. It is not ready for unmanaged production launch, public self-serve onboarding, or broad organization invitation.
