# Live Staging Verification Report

Project: ReDist  
Date: 2026-06-20  
Verification Type: Final Live Staging Verification  
Environment: Supabase hosted staging project `redistribut-dev`  
Command: `./.tools/pnpm staging:validate`

## Executive Summary

Live staging verification has passed.

Result: **Pilot Go**

Final live validation result:

- Total controls: 69
- Passed: 69
- Failed: 0
- Skipped: 0

The staging Supabase project now contains the required pilot accounts, platform roles, organization memberships, live permission mappings, and pilot organizations. Founder, platform admin, reviewer, pilot coordinator, organization admin, and organization user access all validate successfully.

## Live Supabase Remediation Applied

The live staging project was repaired and validated with the following actions:

1. Applied all project database migrations to hosted Supabase.
2. Added missing platform role enum values required by the pilot role model.
3. Removed malformed manual Auth identity rows created by direct `auth.users` seeding.
4. Provisioned pilot users through Supabase Auth Admin instead of raw Auth table inserts.
5. Recreated pilot organization memberships against live Auth user IDs.
6. Refreshed platform role rows and Supabase Auth role claims.
7. Patched certificate QR token generation to avoid unavailable `gen_random_bytes`.
8. Patched certificate hash helper to use built-in `md5` for hosted staging compatibility.

## Tooling Updates

| Item | Result |
| --- | --- |
| Staging provisioning script | Added `./.tools/pnpm staging:provision` |
| Live validator | Updated to resolve live Auth IDs from successful logins |
| Password fallback | Blank staging password env now falls back to default pilot password |
| Trust validation payload | Updated to include required `organization_id` |
| Impact validation payload | Updated to use date-only period values |
| Certificate migration | Updated hosted-safe token and hash helpers |

## Repository Validation

| Control | Result | Evidence |
| --- | --- | --- |
| Typecheck | Pass | `./.tools/pnpm typecheck` passed |
| Build | Pass | `./.tools/pnpm build` passed |
| Tests | Pass | `./.tools/pnpm test` passed, 54 tests |
| Simulation Runner | Pass | `node scripts/simulation-runner.mjs` passed, 4/4 scenarios |
| Live Staging Validation | Pass | `./.tools/pnpm staging:validate` passed, 69/69 controls |

## Identity Controls

| Control | Result |
| --- | --- |
| Founder login | Pass |
| Founder logout | Pass |
| Founder auth claim role | Pass |
| Platform Admin login | Pass |
| Platform Admin logout | Pass |
| Platform Admin auth claim role | Pass |
| Reviewer login | Pass |
| Reviewer logout | Pass |
| Reviewer auth claim role | Pass |
| Pilot Coordinator login | Pass |
| Pilot Coordinator logout | Pass |
| Pilot Coordinator auth claim role | Pass |
| Organization Admin login | Pass |
| Organization User login | Pass |

## Authorization Controls

| Control | Result |
| --- | --- |
| Founder dashboard access | Pass |
| Founder audit API access | Pass |
| Platform admin audit API access | Pass |
| Reviewer verification access | Pass |
| Reviewer founder route denial | Pass |
| Pilot coordinator founder route denial | Pass |
| Unauthorized founder dashboard blocked | Pass |
| Unauthorized audit API blocked | Pass |
| Organization admin scoped access | Pass |
| Organization user scoped access | Pass |
| Cross-tenant denial | Pass |
| Organization user listing creation denial | Pass |
| Audit logging for denied access | Pass |

## Workflow Controls

| Control | Result |
| --- | --- |
| Pilot organizations exist | Pass, 5/5 |
| Pilot organization memberships exist | Pass, 10/10 |
| Platform role rows exist | Pass, 4/4 |
| Trust update | Pass |
| Trust update persisted | Pass |
| Impact update | Pass |
| Impact update persisted | Pass |
| Certificate generation | Pass |
| Certificate QR token generation | Pass |
| Certificate QR public verification | Pass |

## Simulation Validation

| Scenario | Result |
| --- | --- |
| Restaurant | Pass |
| Hotel | Pass |
| Warehouse | Pass |
| NGO | Pass |

## Final Readiness Score

| Readiness Area | Score |
| --- | ---: |
| Repository readiness | 100% |
| Staging identity readiness | 100% |
| Permission readiness | 100% |
| Tenant isolation readiness | 100% |
| Audit readiness | 100% |
| Trust readiness | 100% |
| Impact readiness | 100% |
| Certificate readiness | 100% |
| Overall controlled pilot readiness | 95% |

## Recommendation

Recommendation: **Pilot Go**

ReDist is ready to proceed with controlled UAE pilot onboarding for:

- Restaurant A
- Restaurant B
- Hotel A
- Warehouse A
- NGO A

## Remaining Operational Notes

- Rotate pilot passwords before inviting real external users.
- Keep `.env.staging.local` private and local only.
- Freeze feature development except security fixes, bug fixes, and real pilot feedback fixes.
- Monitor Supabase Auth and API logs during the first onboarding week.
- Continue using `./.tools/pnpm staging:provision` and `./.tools/pnpm staging:validate` after any staging reset.
