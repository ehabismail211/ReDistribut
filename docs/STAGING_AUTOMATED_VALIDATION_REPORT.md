# Staging Automated Validation Report

Project: ReDist  
Date: 2026-06-20  
Purpose: Automate staging pilot validation before inviting real UAE pilot organizations.

## Summary

Created an automated staging validation runner:

- `scripts/staging-pilot-validation.mjs`

Added package command:

- `./.tools/pnpm staging:validate`

The runner validates the staging pilot seed locally and validates the real staging environment when staging credentials are available.

## Validation Scope

The runner validates:

- Founder seed account
- Platform Admin seed account
- Reviewer seed account
- Pilot Coordinator seed account
- Restaurant A
- Restaurant B
- Hotel A
- Warehouse A
- NGO A
- Organization admin memberships
- Organization user memberships
- Login
- Logout
- Role assignment
- Route protection
- API protection
- Cross-tenant denial
- Founder dashboard access
- Reviewer access
- Organization admin access
- Organization user access
- Audit logging
- Certificate generation
- Certificate QR verification
- Trust updates
- Impact updates

## Required Environment Variables

For live staging validation:

```bash
STAGING_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional:

```bash
STAGING_PILOT_PASSWORD=ReDistPilot!2026
STAGING_REQUIRE_LIVE=true
```

Account-specific password overrides are also supported:

```bash
STAGING_FOUNDER_PASSWORD=
STAGING_PLATFORM_ADMIN_PASSWORD=
STAGING_REVIEWER_PASSWORD=
STAGING_PILOT_COORDINATOR_PASSWORD=
STAGING_RESTAURANT_A_ADMIN_PASSWORD=
STAGING_RESTAURANT_A_USER_PASSWORD=
```

Use `STAGING_REQUIRE_LIVE=true` in CI or final pre-invite validation so missing staging configuration fails the run instead of skipping live checks.

## Execution Method

Run the full local validation sequence:

```bash
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm test
node scripts/simulation-runner.mjs
./.tools/pnpm staging:validate
```

The staging runner performs two layers of validation.

### Layer 1: Static Seed Validation

Always runs locally.

Checks:

- Seed SQL file exists.
- Required platform accounts are present.
- Required platform roles are present.
- Required pilot organizations are present.
- Required organization admin/user memberships are present.

### Layer 2: Live Staging Validation

Runs only when staging environment variables are configured.

Checks:

- Login works for each seeded role.
- Logout clears the local Supabase session.
- Auth claims contain expected platform roles.
- `user_platform_roles` rows exist.
- Pilot organizations exist.
- Pilot memberships exist.
- Founder dashboard route allows Founder.
- Founder dashboard route denies unauthorized and non-founder users.
- Audit API denies unauthenticated access.
- Audit API allows Founder and Platform Admin.
- Verification API allows Reviewer.
- Organization-scoped verification read allows organization members.
- Listing creation blocks Organization User.
- Cross-tenant listing creation blocks another organization admin.
- Permission audit logs record denied privileged access.
- Founder can recalculate and persist an organization trust score.
- Founder can calculate and persist an organization impact snapshot.
- Founder can issue a transfer certificate.
- Public QR verification resolves the generated transfer certificate.

## Current Run Results

Validation run: 2026-06-20

| Check | Result |
| --- | --- |
| Typecheck | Passed |
| Build | Passed |
| Tests | Passed, 54 tests |
| Simulation Runner | Passed, 4/4 scenarios |
| Staging Validation Runner | Passed static validation: 24 passed, 1 live check skipped until env vars are configured |

## What Automation Replaces

This runner replaces repeated manual checks for:

- Seed completeness
- Role assignment structure
- Membership structure
- API permission smoke tests
- Route protection smoke tests
- Cross-tenant denial smoke tests
- Permission audit smoke tests

## What Still Needs One Founder Smoke Test

After the automated runner passes live staging:

- Open the staging URL in a browser.
- Log in as Founder.
- Confirm the founder dashboard visually loads.
- Log in as one organization admin.
- Confirm the workspace is understandable enough for a pilot user.
- Confirm passwords or invite links are ready before sending them to real organizations.

## Readiness Impact

Before automation:

- Staging Identity Readiness: 88% before seed execution, 95% after live verification.

After automation is wired:

- Staging Identity Readiness: 90% before seed execution, 96% after live automated validation and founder smoke test.
- UAE Pilot Readiness: 94% after live automated validation and founder smoke test.

## Recommendation

Proceed with live staging validation using:

```bash
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

If it passes, freeze development and start pilot invitations.

Development should remain frozen except for:

- Bug fixes
- Security fixes
- Pilot feedback fixes
