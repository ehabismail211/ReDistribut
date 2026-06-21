# UAE Pilot Launch Checklist

Date: 2026-06-20  
Status: Ready after final live staging verification

## Purpose

This checklist converts the verified staging environment into a controlled UAE pilot launch process.

Use this before inviting real users from:

- Restaurant A
- Restaurant B
- Hotel A
- Warehouse A
- NGO A

## Launch Gate

| Gate | Required Result | Status |
| --- | --- | --- |
| Live staging validation | `./.tools/pnpm staging:validate` passes |  |
| Typecheck | `./.tools/pnpm typecheck` passes |  |
| Build | `./.tools/pnpm build` passes |  |
| Tests | `./.tools/pnpm test` passes |  |
| Simulations | `node scripts/simulation-runner.mjs` passes |  |
| Password rotation | All external user passwords rotated |  |
| Founder sign-off | Founder approves controlled launch |  |

## Simulator-First Mode

Use simulator-first mode when no real pilot users are available yet.

Simulator-first mode means:

1. Do not invite external users.
2. Keep the seeded staging cohort active.
3. Run `node scripts/simulation-runner.mjs`.
4. Run the live seeded staging validator with the local app server running.
5. Use the results to rehearse founder monitoring, certificate review, trust updates, impact updates, and permission checks.

Required commands:

```bash
set -a; source .env.staging.local; set +a; ./.tools/pnpm dev
node scripts/simulation-runner.mjs
./.tools/pnpm staging:validate
```

Simulator-first mode is complete when:

- Restaurant, Hotel, Warehouse, and NGO simulations pass.
- Seeded live staging validation passes 69/69 controls.
- Founder dashboard, audit, trust, impact, certificate, and QR checks pass.
- Cross-tenant denial and organization user restrictions pass.

## Credential Rotation

Before sharing access:

1. Rotate each invited account password in Supabase Auth.
2. Share credentials only with the named pilot contact.
3. Record who received access and when.
4. Ask each user to confirm successful login.
5. Re-run live staging validation after all account changes.

## Invite Order

Recommended order:

1. Restaurant A
2. NGO A
3. Restaurant B
4. Warehouse A
5. Hotel A

Reason:

- Restaurant A and NGO A can validate the fastest high-value food redistribution loop.
- Restaurant B checks repeatability.
- Warehouse A validates bulk quantity controls.
- Hotel A validates non-food surplus workflows.

## First 7 Days

| Day | Founder Action | Expected Output |
| --- | --- | --- |
| Day 1 | Invite Restaurant A and NGO A | Both organizations log in |
| Day 2 | Complete training | First listing or request created |
| Day 3 | Assist first handover | First completed transaction |
| Day 4 | Review certificate and QR | Certificate accepted by both sides |
| Day 5 | Collect feedback | Feedback form completed |
| Day 6 | Invite Restaurant B | Repeat sender workflow |
| Day 7 | Weekly review | Go / pause / remediate decision |

## 30-Day Success Targets

| KPI | Target |
| --- | ---: |
| Organizations onboarded | 5 |
| Listings published | 50 |
| Requests created | 20 |
| Completed transfers | 10 |
| Certificates generated | 5+ |
| Feedback submissions | 5+ |
| Critical security issues | 0 |

## Stop Conditions

Pause onboarding immediately if any of these occur:

- Cross-organization data is visible to the wrong user.
- Certificate public verification exposes sensitive internal data.
- A user can access founder, admin, or reviewer functionality without the right role.
- A completed transaction fails to generate a certificate.
- A Critical bug blocks registration, listing, request, handover, or certificate review.

## Founder Decision

Choose one after the first weekly review:

- Continue controlled pilot.
- Continue with limited remediation.
- Pause one organization.
- Pause the full pilot.

Decision:

Evidence:
