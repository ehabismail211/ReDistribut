# Pre-Invitation Staging Validation Checklist

Date: 2026-06-21  
Purpose: Manual live-environment checks before inviting first UAE pilot organizations.

## Prerequisites

- Staging URL is deployed and accessible over HTTPS.
- Seeded pilot accounts are available.
- Supabase auth, API, and storage environment variables are configured.
- `STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate` passes.
- Founder has recorded the exact build or git tag being validated.

## Manual Checks

| Area | Steps | Pass Criteria | Result |
| --- | --- | --- | --- |
| Login/workspace entry | Open staging URL, sign in as founder/admin, organization supplier, and organization recipient. | Each user lands in the correct workspace without console-breaking errors. |  |
| Dashboard | Open Dashboard for supplier, recipient, and admin/founder. | Action Center, Needs Attention, Active Workflow, and Impact Snapshot are understandable and role-appropriate. |  |
| Discover | Open Discover as recipient, scan filters, select a resource, and review details. | Resource name, quantity, condition, city, supplier, urgency, and request path are clear. |  |
| Request submission | Submit a request from an available resource using only pilot-approved data. | Request is created or clearly confirmed by the existing workflow; no duplicate or confusing state appears. |  |
| Request approval | Sign in as supplier/admin and review the submitted request. | The approval/rejection decision point is clear and status changes are reflected. |  |
| Transfer verification | Move an accepted request through handover/verification using the existing workflow. | Verification action is visible; completed transfer is separated from active handovers. |  |
| Certificate generation/download | Complete a transfer, open certificate evidence, download PDF, and test an invalid certificate id. | Valid certificate downloads; invalid id returns not found and never downloads demo evidence. |  |
| Public certificate verification | Open QR/public verification page for valid and invalid tokens. | Valid token exposes public-safe fields; invalid token shows invalid state with no internal data. |  |
| Impact update | Return to Impact after completion. | Value recovered, redistributed resources, waste diversion, and evidence context reflect completed pilot data where supported. |  |
| Admin/founder review areas | Open secondary admin/founder areas: Verification, Documents, Certificates, Pilot Monitoring, Administration, Trust Overview, Platform Impact, Moderation, Organizations, Settings. | These areas remain visually secondary and do not interrupt the organization workspace flow. |  |
| Mobile walkthrough | Repeat Dashboard, Discover, Requests, Transfers, and certificate evidence on a phone viewport. | Navigation is usable and core actions remain reachable. |  |
| Error/empty states | Test empty lists, invalid certificate id, and unauthorized admin route access. | Empty states guide the next step; unauthorized routes fail closed. |  |

## Automated Checks To Run During Validation

```bash
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm lint
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

## Required Pass Criteria

- No critical workflow failure in login, discovery, request, approval, handover, verification, certificate, or impact.
- Invalid certificate IDs must not return demo PDF evidence.
- Admin/founder areas must remain secondary or access-controlled during organization use.
- Founder records all observed confusion points in `docs/UAE_PILOT_OBSERVATION_CHECKLIST.md`.

## Decision

Invite first live organizations only after every required pass criterion is complete or explicitly accepted by the founder for a guided pilot session.
