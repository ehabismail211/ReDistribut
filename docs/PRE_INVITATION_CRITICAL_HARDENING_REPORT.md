# Pre-Invitation Critical Hardening Report

Date: 2026-06-21  
Scope: Resolve or gate critical risks identified before first founder-guided UAE Pilot Wave 1 invitations.

## Executive Summary

ReDist has moved from a 77 / 100 Conditional Go posture to an 84 / 100 pre-invitation readiness posture.

The certificate demo fallback and broken lint validation were fixed. Release control and live staging validation remain gated because this folder is still not a git repository and no deployed staging run was executed in this local pass.

Recommendation: Conditional Go for first live UAE organization invites, limited to founder-guided sessions, after founder approval of the release-control gate and completion of the live staging checklist.

## Git / Release Control

Status: Gated.

`/Users/ehabismail/Documents/Redistribution` is still not a git repository.

Evidence:

```text
fatal: not a git repository (or any of the parent directories): .git
```

Action taken:

- Created `docs/PILOT_RELEASE_CONTROL_NOTE.md`.
- Documented exact safe commands for initializing git, creating a baseline commit, and tagging `pilot-wave-1-baseline`.
- Did not run `git init`.

Risk remaining:

- No validated commit/tag baseline exists yet.
- Diffs and rollback cannot be guaranteed until founder approves version-control initialization.

## Certificate Demo Fallback

Status: Fixed.

Action taken:

- Removed demo fallback from `apps/web/src/app/api/v1/certificates/[id]/download/route.ts`.
- Unknown certificate IDs now return `404` with `Certificate not found.`
- The public verification route already returns a public-safe invalid state for unknown QR tokens and was left unchanged.

Pilot safety result:

- Invalid certificate download IDs no longer produce demo PDF evidence.
- Demo certificate generation remains available only through the explicit demo token helper used by local tests and demo UI data.

## Live Staging Validation

Status: Gated.

Action taken:

- Created `docs/PRE_INVITATION_STAGING_VALIDATION_CHECKLIST.md`.
- Added exact manual checks for login, Dashboard, Discover, request submission, request approval, transfer verification, certificate generation/download, public verification, Impact, admin/founder areas, mobile, and error states.
- Added a lightweight regression test for the certificate fallback and lint command.

Risk remaining:

- Strict live staging validation must still run against deployed staging:

```bash
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

## Admin / Founder Separation

Status: Assessed and acceptable for founder-guided Wave 1.

Current posture:

- Primary organization workflow remains Dashboard -> Discover -> Requests -> Transfers -> Impact.
- Listings, Organizations, Certificates, Administration, Settings, and other review tools remain in secondary navigation groups.
- Founder/admin tools are visually separated from the daily organization workflow but still share the same workspace shell.

Risk remaining:

- A dedicated admin shell is still recommended before unmanaged or self-serve rollout.
- For Wave 1, keep admin/founder use guided and do not expose admin review sessions as part of ordinary supplier/recipient walkthroughs.

## Lint Script

Status: Fixed with a repeatable Next 16-compatible replacement.

Action taken:

- Replaced `apps/web` lint script from `next lint` to:

```bash
tsc -p tsconfig.json --noEmit
```

Reason:

- `next lint` is not valid in this Next 16.2 setup.
- No ESLint configuration currently exists in the project.
- The replacement provides a reliable, repeatable local quality gate until a formal ESLint setup is introduced.

## Fixed vs Gated

| Item | Status | Notes |
| --- | --- | --- |
| Certificate demo fallback | Fixed | Unknown download IDs now return 404. |
| Broken lint command | Fixed | `./.tools/pnpm lint` now runs repeatable TypeScript validation. |
| Staging validation checklist | Fixed | Manual checklist created. |
| Lightweight automated coverage | Fixed | Added regression coverage for fallback removal, lint replacement, and hardening docs. |
| Admin/founder separation | Gated/acceptable | Existing secondary navigation is acceptable for guided Wave 1; dedicated admin shell deferred. |
| Git/release control | Gated | Exact commands documented; `git init` not run. |
| Live deployed staging pass | Gated | Must run with `STAGING_REQUIRE_LIVE=true`. |

## Revised Readiness Score

Overall readiness: 84 / 100.

Decision level: Conditional Go.

Full Go requires:

- Founder-approved git baseline or explicit risk acceptance.
- Passing strict live staging validation.
- Founder sign-off on the first invited organizations and guided workflow script.

## Validation Commands

Run before invitation:

```bash
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm lint
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

## Recommendation

Conditional Go for first live UAE organization invites after the remaining gates are explicitly closed. Do not proceed to unmanaged production or self-serve onboarding from this state.
