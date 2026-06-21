# UAE Controlled Pilot Execution Pack

Date: 2026-06-20

## Purpose

This pack defines how ReDist should run the controlled UAE pilot after Priority 1 remediation.

The pilot objective is to get real UAE organizations using ReDist, observe behavior, collect feedback, and only remediate issues found by real users.

No feature development is included in this document.

## 1. Pilot Timeline

Recommended duration: **4-8 weeks**.

| Phase | Duration | Objective | Output |
| --- | --- | --- | --- |
| Phase A: Controlled Pilot | Weeks 1-4 | Onboard first organizations and complete real transactions | Real usage, KPI data, feedback, issue log |
| Phase B: Pilot Review | Week 5 | Assess adoption, bugs, feedback, and missing functionality | Pilot review report |
| Phase C: Pilot Remediation | Weeks 6-7 | Fix only issues found by real users | Focused remediation backlog |
| Phase D: Commercial Readiness Assessment | Week 8 | Decide if ReDist can move toward open UAE launch | Go / Conditional Go / No-Go decision |

## 2. Organization Onboarding Sequence

Initial cohort:

- 2 Restaurants
- 1 Hotel
- 1 Warehouse
- 1 NGO

### Sequence

1. Founder confirms pilot organization owner and business contact.
2. Organization receives pilot invitation and pilot expectations.
3. Organization completes registration and profile.
4. Organization submits verification requirements.
5. Founder reviews verification and category eligibility.
6. Organization creates first listing or first request.
7. Founder assists first request and handover.
8. Transaction is completed.
9. Transfer certificate and QR verification are reviewed.
10. Organization submits feedback within 48 hours.

### Onboarding Order

| Order | Organization Type | Reason |
| --- | --- | --- |
| 1 | Restaurant 1 | Validates food category controls and same-day handover. |
| 2 | NGO | Validates recipient workflow and beneficiary fit. |
| 3 | Restaurant 2 | Tests repeatability across a second food sender. |
| 4 | Hotel | Validates furniture/fixtures and slower handover cycles. |
| 5 | Warehouse | Validates bulk quantity, over-allocation prevention, and logistics handover. |

## 3. Founder Responsibilities

| Responsibility | Cadence | Evidence |
| --- | --- | --- |
| Approve organization participation | Before invite | Pilot approval record |
| Approve verification and category eligibility | Before first listing/request | Verification notes |
| Monitor transactions and handovers | Daily during active transfers | Dashboard review |
| Review certificates and QR verification | After every completion | Certificate check |
| Review feedback and issues | Twice weekly | Feedback log |
| Run weekly pilot review | Weekly | Review notes and KPI snapshot |
| Decide escalation and stop conditions | As needed | Issue record |

## 4. Pilot Organization Responsibilities

| Responsibility | Required Behavior |
| --- | --- |
| Provide accurate organization details | Legal name, contact, location, and authorized person must be accurate. |
| Submit verification documents | Required documents depend on organization type. |
| Publish/request real resources only | No test or misleading listings after onboarding. |
| Confirm quantity before acceptance | Quantity must be available and handover-ready. |
| Complete handover evidence | Manual evidence or approved private evidence path is required. |
| Review certificate | Organization must confirm certificate details after first transaction. |
| Submit feedback | Required after first completed transfer. |
| Report issues quickly | Critical and High issues must be reported same day. |

## 5. Weekly Review Process

Weekly review owner: Founder.

### Agenda

1. Organizations onboarded.
2. Verification completion.
3. Listings published.
4. Requests created.
5. Transactions completed.
6. Certificates generated.
7. Trust score movement.
8. Feedback submitted.
9. Open issues and severity.
10. Stop conditions or escalation needs.

### Weekly Outputs

- KPI snapshot.
- Feedback summary.
- Bug/issue register update.
- Founder decision: continue, pause, expand, or remediate.

## 6. KPI Tracking Process

Pilot success KPIs:

| KPI | Target For Controlled Pilot | Tracking Method |
| --- | ---: | --- |
| Organizations onboarded | 5 | Founder dashboard and onboarding log |
| Listings published | 6+ | Listing count by organization |
| Requests created | 8+ | Request workflow count |
| Transactions completed | 5+ | Completed transaction count |
| Certificates generated | 100% of completed transactions | Certificate count matched to transactions |
| Feedback submitted | 100% after first transfer | Feedback log |
| Critical bugs | 0 unresolved | Issue register |

### KPI Review Rules

- Track KPIs weekly.
- Do not expand the cohort if Critical bugs are open.
- Do not move to commercial readiness if certificate coverage is below 100%.
- Treat feedback quality as more important than volume during the first two weeks.

## 7. Feedback Collection Process

### Required Feedback Points

| Moment | Required From |
| --- | --- |
| After onboarding | Every organization |
| After verification | Every organization submitting documents |
| After first listing | Every sender |
| After first request | Every requester |
| After first completed handover | Sender and receiver |
| After certificate review | Sender and receiver |

### Feedback Categories

- Onboarding
- Verification
- Listings
- Requests
- Handover
- Impact
- Certificate
- Trust
- Arabic/RTL
- Mobile browser

### Feedback Quality Standard

Every feedback item should include:

- Organization
- User role
- Workflow step
- Expected behavior
- Actual behavior
- Severity
- Screenshot or evidence if relevant

## 8. Bug Triage Process

| Severity | Definition | Response Target | Action |
| --- | --- | --- | --- |
| Critical | Security issue, data exposure, blocked transaction, incorrect certificate exposure | Immediate | Pause affected workflow and assign founder/engineering owner |
| High | Major pilot workflow blocked for one organization | Same business day | Assign owner and track to closure |
| Medium | Workaround exists but friction is significant | 2 business days | Add to pilot remediation backlog |
| Low | Minor copy, layout, reporting, or usability issue | Weekly review | Batch with other improvements |

### Triage Rules

1. Security and tenant-boundary issues override all other work.
2. Certificate data exposure is Critical.
3. Handover failure is High unless it affects safety or regulated categories, then Critical.
4. Do not build requested enhancements until the founder confirms they affect pilot completion.

## 9. Issue Escalation Process

| Escalation Type | Trigger | Escalation Owner |
| --- | --- | --- |
| Security | Cross-tenant access, document exposure, unauthorized certificate data | Engineering lead and founder |
| Verification | Document dispute, expired permit, rejected license | Founder |
| Handover | Pickup failure, quantity mismatch, unsafe item | Support owner and founder |
| Certificate | Incorrect sender/receiver/resource/QR payload | Engineering lead |
| Commercial | Contract, liability, or payment question | Founder |

### Stop Conditions

Pause pilot expansion if:

1. Any Critical security issue is open.
2. Certificate QR verification exposes sensitive internal data.
3. Private documents are stored or shared outside the approved handling process.
4. Two or more handovers fail for the same reason.
5. Any restricted category is listed without founder approval.

## 10. Exit Criteria

### Pilot Completion Criteria

The controlled pilot is complete when:

1. At least 5 organizations are onboarded.
2. At least 6 listings are published.
3. At least 8 requests are created.
4. At least 5 transactions are completed.
5. 100% of completed transactions generate certificates.
6. 100% of first-transfer organizations submit feedback.
7. 0 Critical bugs remain unresolved.
8. Founder review confirms the product solves a real operating need.

## Commercial Launch Decision Criteria

### Go

Move from pilot to commercial launch only if:

- UAE Pilot Readiness is 90-95%.
- 0 Critical bugs are unresolved.
- 90%+ of pilot organizations complete onboarding.
- 5+ real transactions are completed.
- 100% certificate coverage is maintained.
- Positive qualitative feedback from at least 4 pilot organizations.
- Founder approves legal, support, monitoring, and commercial operations.

### Conditional Go

Move to a limited paid or expanded pilot only if:

- UAE Pilot Readiness is 85-90%.
- No Critical security or certificate issues are unresolved.
- Some High issues remain but have clear workarounds.
- Pilot organizations show repeat usage intent.
- Founder keeps onboarding invite-only.

### No-Go

Do not move to commercial launch if:

- Any Critical bug is unresolved.
- Certificate generation or QR verification is unreliable.
- Less than 3 organizations complete real transactions.
- Feedback shows the workflow does not solve a real operational problem.
- Handover failures are frequent or unresolved.
- Legal, compliance, support, or monitoring controls are not approved.

## Recommendation

Start Phase A with the controlled pilot cohort.

After the first real completed transaction, stop and review the full workflow before inviting the next organization. At this phase, real behavior is more valuable than additional internal feature development.
