# Staging Deployment Validation Report

Date: 2026-06-21  
Baseline tag: `pilot-wave1-baseline-v0.1`  
Branch: `main`  
Validated commit: `83972b83101b6160a715368e3d93a0635ceff0d8`

## Executive Summary

ReDist now has a real external Vercel staging deployment connected to the GitHub repository `ehabismail211/ReDistribut`.

The protected staging URL for founder review is:

```text
https://re-distribut-web-git-main-ehab3.vercel.app
```

Vercel Authentication is enabled on preview deployments. Unauthenticated access to `/app` on the protected preview URL returns `401`, while the staging validator can access the deployment through Vercel Protection Bypass for Automation using the ignored local `VERCEL_AUTOMATION_BYPASS_SECRET`.

Readiness after external staging validation and staging copy polish: 95 / 100.

Recommendation: Conditional Go. The external protected staging gate is now cleared, automated validation is passing, and founder review can begin. First UAE organization invites should wait until the founder completes page-by-page desktop and mobile review and confirms the remaining low-priority copy polish is acceptable.

## Deployment Status

| Item | Status | Evidence |
| --- | --- | --- |
| GitHub repository connected | Pass | Vercel project imports `ehabismail211/ReDistribut`. |
| Vercel project created | Pass | Project: `re-distribut-web` under `ehab3`. |
| Root directory | Pass | Vercel root configured for `apps/web`. |
| Production deployment | Pass | `https://re-distribut-web.vercel.app` is live. |
| Protected staging URL | Pass | `https://re-distribut-web-git-main-ehab3.vercel.app`. |
| Access protection | Pass | Vercel Authentication enabled for preview deployments. |
| Unauthenticated protected URL check | Pass | `curl -I https://re-distribut-web-git-main-ehab3.vercel.app/app` returned `401`. |
| Automation bypass | Pass | `x-vercel-protection-bypass` header returned `200` for `/app`. |
| Required staging env vars | Pass | Configured in Vercel for Production and Preview. Values are sensitive and not committed. |
| Local staging URL config | Pass | `.env.staging.local` points to the protected preview URL. The file remains ignored. |

## Environment Variables Configured

The following variables were configured in Vercel for the staging deployment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STAGING_APP_URL`
- `STAGING_REQUIRE_LIVE`

The local ignored file `.env.staging.local` also includes `VERCEL_AUTOMATION_BYPASS_SECRET` for automated validation against the protected preview. Secrets were not committed.

## Validation Results

Commands run:

```bash
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm lint
./.tools/pnpm staging:validate
```

Results:

| Check | Result |
| --- | --- |
| Tests | Pass, 57 / 57 |
| Typecheck | Pass |
| Build | Pass |
| Lint | Pass |
| External staging validator | Pass, 69 / 69 |

## External Staging Validation Coverage

The external staging validator passed all 69 checks against the protected Vercel preview URL, including:

- Staging seed file presence.
- Founder, Platform Admin, Reviewer, and Pilot Coordinator seed accounts.
- Five pilot organizations and required memberships.
- Founder, admin, reviewer, coordinator, organization admin, and organization user login.
- Role claim validation.
- Founder dashboard and audit API access.
- Trust score update and persistence.
- Impact update and persistence.
- Certificate generation.
- Certificate QR token generation and public verification.
- Unauthorized founder route denial.
- Unauthorized audit API denial.
- Platform admin API protection.
- Reviewer and pilot coordinator founder route denial.
- Organization admin and user access.
- Cross-tenant denial.
- Organization user listing creation restriction.
- Permission audit logging.

## Browser Review Smoke Check

| Area | Result | Evidence |
| --- | --- | --- |
| Desktop `/app` open | Pass | Protected preview opened `/app` in the browser. |
| Mobile viewport `/app` open | Pass | `/app` rendered at `390 x 844` viewport. |
| Dashboard/action center visible | Pass | Browser text check found Dashboard/Action Center content. |
| Physical founder mobile device review | Pending founder action | Founder should open the protected preview URL from mobile while signed in to Vercel. |

## Page-By-Page Founder Review Status

| Area | Status |
| --- | --- |
| Login/workspace entry | Ready for founder review |
| Dashboard | Ready for founder review |
| Discover | Ready for founder review |
| Requests | Ready for founder review |
| Transfers | Ready for founder review |
| Impact | Ready for founder review |
| Listings | Ready for founder review |
| Organizations | Ready for founder review |
| Certificates | Ready for founder review |
| Documents | Ready for founder review |
| Verification/admin areas | Ready for founder review |
| Settings | Ready for founder review |
| Mobile responsive review | Browser viewport smoke check passed; physical device review pending |

Use `docs/LIVE_PREVIEW_PAGE_BY_PAGE_REVIEW_GUIDE.md` for the full founder review checklist.

## Remaining Risks

| Severity | Risk | Recommendation |
| --- | --- | --- |
| Medium | Founder has not yet completed full page-by-page review on the protected external URL. | Complete guided review before first live organization invite. |
| Medium | Physical mobile device access has not been personally confirmed by the founder. | Open the protected preview URL from mobile while signed in to Vercel. |
| Low | Production alias `https://re-distribut-web.vercel.app` is public/open. | Use only the protected preview URL for pilot staging review and invites until production access policy is intentionally decided. |

## Final Recommendation

Conditional Go.

The external protected staging requirement is satisfied, and all automated validation checks passed. ReDist is ready for founder-only page-by-page staging review. Move to first UAE organization invites after the founder confirms desktop and mobile review on the protected preview URL.
