# UAE Pilot Onboarding Guide

Date: 2026-06-20

Status: Pilot Go after live staging verification.  
Evidence: `docs/LIVE_STAGING_VERIFICATION_REPORT.md` passed 69/69 live controls.

## Purpose

This guide enables real UAE pilot onboarding for the first controlled ReDist cohort:

- Restaurant A
- Restaurant B
- Hotel A
- Warehouse A
- NGO A

No feature development is included in this guide.

## Pilot Positioning

ReDist is running a controlled UAE pilot to validate real redistribution workflows between verified organizations. The pilot focuses on practical movement of surplus resources, trust, impact tracking, and transfer certificates.

## Onboarding Sequence

| Step | Owner | Output |
| --- | --- | --- |
| 1. Rotate staging credentials | Founder | Unique temporary password per invited user |
| 2. Invite organization | Founder | Named owner/admin and pilot contact |
| 3. Explain pilot scope | Founder | Organization understands invite-only pilot rules |
| 4. Register or sign in | Organization | User account and organization profile |
| 5. Submit verification | Organization | Required documents or approved manual evidence |
| 6. Approve category eligibility | Founder | Allowed listing/request categories |
| 7. Create first listing/request | Organization | First real workflow item |
| 8. Complete assisted transaction | Founder + Organization | First completed handover |
| 9. Review certificate and QR | Organization | Certificate details confirmed |
| 10. Submit feedback | Organization | Feedback form within 48 hours |
| 11. Weekly review | Founder | KPI and issue review |

## Live Staging Access

Use the live staging accounts provisioned by the final staging verification:

| Organization | Admin Account | User Account |
| --- | --- | --- |
| Restaurant A | `restaurant-a-admin@staging.redist.ae` | `restaurant-a-user@staging.redist.ae` |
| Restaurant B | `restaurant-b-admin@staging.redist.ae` | `restaurant-b-user@staging.redist.ae` |
| Hotel A | `hotel-a-admin@staging.redist.ae` | `hotel-a-user@staging.redist.ae` |
| Warehouse A | `warehouse-a-admin@staging.redist.ae` | `warehouse-a-user@staging.redist.ae` |
| NGO A | `ngo-a-admin@staging.redist.ae` | `ngo-a-user@staging.redist.ae` |

Before sharing credentials externally:

1. Rotate every invited account password.
2. Confirm the email belongs to the intended organization contact.
3. Confirm the user role before the first login.
4. Re-run `./.tools/pnpm staging:validate`.
5. Record founder approval in the weekly review template.

## Organization Requirements

### Restaurants

Required:

- Trade license
- Food permit
- Authorized contact
- Registered address
- Same-day handover acknowledgement

Expected pilot workflow:

- Publish prepared food or packaged food surplus.
- Coordinate pickup with NGO or approved recipient.
- Complete same-day or next-day handover.
- Review transfer certificate.

### Hotel

Required:

- Trade license
- Authorized contact
- Registered address
- Property or department contact

Expected pilot workflow:

- Publish furniture, fixtures, linens, or surplus operational supplies.
- Coordinate pickup or exchange.
- Complete one documented handover.
- Review impact and certificate output.

### Warehouse

Required:

- Trade license
- Storage permit if applicable
- Authorized contact
- Pickup/loading location confirmation

Expected pilot workflow:

- Publish bulk resources such as pallets, packaging, bins, cartons, or warehouse materials.
- Validate quantity controls and over-allocation prevention.
- Complete one bulk transaction.

### NGO

Required:

- NGO license or founder-approved equivalent
- Authorized signatory
- Registered address
- Beneficiary/use-case declaration

Expected pilot workflow:

- Request food, furniture, hygiene kits, packaging, or other approved resources.
- Confirm beneficiary fit.
- Complete at least one receipt workflow.
- Review certificate and impact summary.

## Founder Pre-Invite Checklist

Before inviting an organization:

1. Confirm live staging validation is still passing.
2. Confirm organization type and contact owner.
3. Confirm category eligibility.
4. Confirm pilot expectations and time commitment.
5. Confirm support/escalation contact.
6. Confirm no restricted category will be used without founder approval.
7. Confirm mobile browser access is available if handover happens away from desktop.
8. Confirm credentials were rotated and shared through a secure channel.

## First Transaction Checklist

Before completion:

1. Listing/request details are accurate.
2. Quantity is confirmed by sender and receiver.
3. Handover method and location are confirmed.
4. Evidence handling path is approved.
5. Certificate disclaimer is understood.
6. Feedback owner is assigned.

## Stop Conditions

Pause the organization onboarding if:

- Verification is incomplete for a restricted category.
- Private documents are shared outside approved handling.
- Handover cannot be confirmed.
- Certificate details are inaccurate.
- A Critical security or tenant-boundary issue is reported.

## Onboarding Completion

An organization is considered onboarded when:

1. Registration is complete.
2. Verification is approved or manually cleared for pilot.
3. First listing or request is created.
4. First transaction is completed.
5. Certificate is generated and reviewed.
6. Feedback is submitted.
