# UAE Pilot Operations Controls

Date: 2026-06-20

## Purpose

This document closes the Priority 1 founder and operations controls from `docs/UAE_PILOT_REMEDIATION_PLAN.md`.

These controls are required before external UAE pilot organizations are invited.

## Pilot Gate Status

| Gate | Status | Owner | Evidence Required | Validation |
| --- | --- | --- | --- | --- |
| Tenant-boundary staging validation | Active | Founder / Engineering lead | Two-organization staging checklist with negative access tests | API/RLS tests and signed checklist |
| Pilot SOP and category policy | Active | Founder | Approved SOP covering verification, categories, handover, certificates, impact, and support | Founder sign-off |
| Private document/evidence handling | Active | Founder / Engineering lead | Approved private storage flow or manual off-platform handling procedure | Access-audit test or manual control approval |
| Support and escalation ownership | Active | Founder / Support owner | Named owners and escalation response targets | Issue routing drill |
| Mobile browser critical path QA | Active | QA owner | iOS Safari and Android Chrome checklist | Screenshot evidence and issue log |
| Monitoring, backup, and incident response | Active | Engineering lead | Uptime check, error alert, restore drill, rollback runbook | Incident drill and restore evidence |

## Tenant-Boundary Validation

### Test Organizations

| Organization | User Roles | Required Negative Tests |
| --- | --- | --- |
| Pilot Restaurant A | Owner, inventory manager, requester | Cannot access Hotel verification documents, transactions, private files, or audit events |
| Pilot Hotel B | Owner, inventory manager, requester | Cannot access Restaurant verification documents, transactions, private files, or audit events |

### Required Checks

1. User from Organization A cannot list Organization B private files.
2. User from Organization A cannot read Organization B verification documents.
3. User from Organization A cannot read Organization B transactions.
4. User from Organization A cannot read Organization B handover evidence.
5. User from Organization A cannot mutate Organization B listings, requests, verifications, or certificates.
6. Platform public QR verification returns only public-safe certificate fields.

## Pilot SOP

### Allowed Pilot Categories

| Category | Pilot Status | Controls |
| --- | --- | --- |
| Prepared food | Manual approval only | Business verification, food permit, same-day handover, explicit disclaimer |
| Furniture and fixtures | Allowed | Business verification, condition notes, receiver acceptance |
| Packaging materials | Allowed | Business verification, quantity confirmation |
| Warehouse materials | Allowed | Business verification, storage permit if applicable |
| NGO/community supplies | Manual approval only | NGO verification or approved recipient validation |

### Restricted Categories

| Category | Status |
| --- | --- |
| Medical and pharmaceutical | Blocked for first pilot |
| Hazardous materials | Blocked for first pilot |
| Government-controlled resources | Founder approval required |
| Temperature-sensitive food without same-day handover | Blocked |

### Handover SOP

1. Sender confirms available quantity before acceptance.
2. Receiver confirms pickup or delivery window.
3. Handover record is created at completion.
4. Manual evidence is required for the first pilot cohort.
5. Evidence must be stored in approved private storage or approved off-platform folder until private storage is live.
6. Certificate is treated as platform proof of recorded pilot completion, not a tax invoice or regulatory certificate.

## Private Document And Evidence Handling

### Pilot Rule

Sensitive verification documents and handover evidence must not be stored in public buckets or pasted into notes.

### Approved Paths

| Path | Use |
| --- | --- |
| `private/{organization_id}/verification/...` | Verification licenses and permits |
| `private/{organization_id}/handover/...` | Handover photos, signatures, and delivery evidence |
| `private/{organization_id}/pilot-approval/...` | Founder approval evidence |
| `private/{organization_id}/incident/...` | Incident screenshots and support evidence |

### Access Rules

1. Organization admins can access their own private files.
2. Platform reviewers can access files only for assigned review/support work.
3. Every signed upload, signed download, metadata view, and review view must create an access audit event.
4. Real documents require retention and deletion decisions before commercial launch.

## Support Ownership

| Area | Primary Owner | Backup Owner | Response Target |
| --- | --- | --- | --- |
| Verification review | Founder | Engineering lead | 1 business day |
| Handover issue | Support owner | Founder | Same business day |
| Certificate or QR issue | Engineering lead | Founder | Same business day |
| Critical security issue | Engineering lead | Founder | Immediate triage |
| Pilot feedback | Support owner | Founder | 2 business days |

## Escalation Matrix

| Severity | Examples | Required Action |
| --- | --- | --- |
| Critical | Cross-tenant access, unsafe document exposure, failed handover with sensitive category | Pause affected workflow, notify founder, preserve audit evidence |
| High | Certificate mismatch, verification dispute, mobile path blocked | Assign owner same day and track issue to closure |
| Medium | UX confusion, non-blocking notification issue | Add to pilot backlog and review weekly |
| Low | Copy, layout, or reporting refinement | Defer unless repeatedly reported |

## Mobile Browser QA

### Devices

| Platform | Browser |
| --- | --- |
| iOS | Safari |
| Android | Chrome |

### Critical Paths

1. Registration and login.
2. Organization setup.
3. Verification dashboard and document status review.
4. Discover listings.
5. Submit request.
6. Accept request.
7. Complete handover.
8. View certificate.
9. Download certificate.
10. Scan public QR verification page.

### Pass Criteria

- No blocked workflow.
- No unreadable Arabic/RTL layout.
- No horizontal overflow on critical pages.
- Certificate QR page loads and exposes only public-safe fields.
- Issues are logged with screenshot evidence.

## Monitoring, Backup, And Incident Response

### Minimum Pilot Monitoring

| Monitor | Requirement |
| --- | --- |
| Uptime | Public app and certificate verification page |
| API health | Listings, requests, verification, transactions, certificates |
| Errors | Server-side route errors and client rendering errors |
| Database | Connection health and backup completion |
| Security | Failed auth bursts and unexpected permission errors |

### Backup And Restore

1. Confirm automated database backups are active.
2. Run one restore drill in a non-production environment.
3. Document rollback owner and rollback command/process.
4. Keep incident notes linked to audit evidence.

### Incident Drill

1. Trigger a controlled test error.
2. Confirm alert reaches engineering owner.
3. Create an issue record.
4. Confirm founder notification path.
5. Record resolution and evidence.

## Founder Approval Checklist

| Checklist Item | Status |
| --- | --- |
| Tenant-boundary checklist approved | Required before external pilot |
| Category policy approved | Required before external pilot |
| Verification document handling approved | Required before external pilot |
| Handover SOP approved | Required before external pilot |
| Certificate disclaimer approved | Required before external pilot |
| Impact estimate wording approved | Required before external pilot |
| Support ownership approved | Required before external pilot |
| Mobile QA evidence reviewed | Required before external pilot |
| Monitoring and backup drill reviewed | Required before external pilot |

## Exit Criteria

ReDist may invite external UAE pilot organizations when:

1. All checklist items above are approved or have a founder-approved manual control.
2. Restaurant, Hotel, Warehouse, and NGO simulations pass.
3. Typecheck, build, and tests pass.
4. No Critical pilot blocker remains unresolved.
