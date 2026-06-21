# UAE Pilot Remediation Plan

Date: 2026-06-20

## Purpose

This plan converts the Critical and High findings from `docs/UAE_MVP_READINESS_ASSESSMENT.md` into a prioritized remediation roadmap.

The goal is to raise UAE Pilot Readiness from **78%** to **85%+** without expanding scope into open commercial launch readiness.

No implementation was performed for this plan.

## Target Outcome

| Metric | Current | Target |
| --- | ---: | ---: |
| UAE Pilot Readiness | 78% | 85%+ |
| Security Readiness | 66% | 78%+ |
| Architecture Readiness | 74% | 82%+ |
| Mobile Browser Readiness | 73% | 82%+ |
| Performance Readiness | 70% | 80%+ |

## Priority Model

| Priority | Meaning | Pilot Impact |
| --- | --- | --- |
| Priority 1 | Must complete before external UAE pilot organizations are invited | Raises pilot safety, tenant isolation, workflow proof, and operational control. |
| Priority 2 | Complete during the first pilot hardening sprint | Reduces operational burden and supports cohort expansion. |
| Priority 3 | Complete before larger UAE rollout or commercial conversion | Improves scale, polish, governance, and enterprise readiness. |

## Priority Summary

### Priority 1

1. Run staging tenant-boundary security validation.
2. Approve UAE pilot SOPs and category rules.
3. Add first-class transaction and handover record foundation.
4. Define private document/evidence handling approach for pilot.
5. Assign support, verification, and issue escalation owners.
6. Run real-device mobile browser QA for critical paths.
7. Establish basic production monitoring, backups, and incident response.

### Priority 2

1. Implement granular pilot roles and permissions.
2. Add branch/location model for pilot organizations.
3. Persist pilot onboarding, feedback, issues, and KPI history.
4. Add audit read/export APIs for founder and admin review.
5. Add rate limiting for public and mutation-heavy routes.
6. Add notification delivery and preferences for workflow events.
7. Run pilot-scale load testing.

### Priority 3

1. Add commercial/legal operating pack.
2. Add payment and commercial account operations.
3. Prepare enterprise contracts and data processing terms.
4. Extend admin workflow action states.
5. Add mobile-first handover evidence capture.
6. Expand observability and performance testing for commercial scale.

## Security

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Private document and evidence storage is incomplete | Verification documents and handover evidence do not yet have a complete private storage, signed access, retention, and access-audit model. | Critical | Real trade licenses, permits, and handover evidence could be mishandled or exposed. | Implement private Supabase storage buckets, signed upload/download APIs, file metadata, access audit events, retention rules, and admin-only review permissions. For the first pilot, use an approved manual off-platform procedure if storage is not ready. | 5-8 engineering days | Upload/download permission tests, cross-tenant file access tests, audit event checks, manual reviewer workflow test. | Priority 1 |
| Tenant-boundary security testing is not formally completed | The platform has RLS foundations, but staging tests with multiple real pilot organizations and roles are not documented. | Critical | Cross-tenant access bugs would undermine trust before the pilot starts. | Create a tenant-boundary test pack using at least two organizations, multiple users, and role variants. Validate listings, requests, verification, trust, impact, certificates, pilot data, and audit visibility. | 2-3 days | Automated integration tests plus manual staging checklist with screenshots/evidence. | Priority 1 |
| Rate limiting and abuse controls are not production hardened | Public QR verification, search, auth-sensitive routes, and workflow mutations lack documented rate limits. | High | Public routes and mutation endpoints can be abused or overloaded during pilot. | Add middleware or platform-level rate limits for public certificate verification, listing search, request creation, workflow actions, login-sensitive routes, and admin actions. | 3-5 days | Simulated burst tests, expected 429 responses, logs confirming blocked excess traffic. | Priority 2 |
| Legal, privacy, acceptable use, category liability, and certificate disclaimers are incomplete | Commercial-grade policy documents are not finalized. | Critical | Users may misunderstand responsibility, certificate authority, food/resource liability, or data use. | For pilot, approve concise pilot terms, privacy notice, category restrictions, certificate disclaimer, and impact estimate disclaimer. Defer full commercial pack to commercial readiness. | 3-5 founder/legal days | Founder approval record, published pilot terms, signup acknowledgement, certificate disclaimer review. | Priority 1 |

## Architecture

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Country, city, and branch hierarchy is not first-class | UAE geography and organization branches are not modeled deeply enough for multi-location operators. | Critical | Inventory ownership, handovers, permissions, and analytics cannot be safely scoped by branch. | Add country, emirate/region, city, and branch entities. Link organizations, listings, users, requests, transactions, handovers, verification, and audit events to branch where applicable. | 8-12 engineering days | Migration tests, RLS tests, branch-scoped listing/request tests, multi-branch simulation. | Priority 2 |
| Pilot operations are not fully database-backed | Pilot organizations, onboarding milestones, feedback, issues, and KPI history still depend on MVP workspace state. | High | Founder cannot reliably operate or audit a real pilot cohort over time. | Add pilot cohort, pilot organization status, onboarding milestone, feedback, issue, and pilot KPI history tables/APIs. | 5-8 engineering days | CRUD/API tests, founder dashboard persistence test, feedback-to-issue workflow test. | Priority 2 |
| Production monitoring, backups, incident response, and support SLAs are not confirmed active | Operational architecture is not yet proven for live pilot users. | Critical | Failures may go unnoticed or be unrecoverable during pilot activity. | Establish uptime checks, error monitoring, structured logs, database backup confirmation, rollback process, incident severity model, and pilot support response targets. | 3-6 ops/engineering days | Trigger test error, verify alert, restore backup in test environment, complete incident drill. | Priority 1 |
| Open UAE commercial launch lacks operations readiness | Architecture is strong for MVP, but not ready for public self-serve commercial scale. | Critical | Public launch would create compliance, reliability, and support exposure. | Keep pilot gated. Treat public commercial launch as a separate readiness phase after pilot remediation and legal/commercial controls. | Planning: 2-3 days; implementation varies | Founder launch gate review, commercial readiness checklist, No-Go retained until criteria pass. | Priority 3 |

## Permissions

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Granular role and permission model is incomplete | Enterprise teams need roles beyond broad organization admin/member patterns. | Critical | Users may gain too much access or be blocked from legitimate pilot tasks. | Implement pilot-safe roles: owner, organization admin, inventory manager, requester, verifier, support operator, moderator, country admin, and platform admin. Map roles to explicit permissions. | 8-12 engineering days | Permission matrix tests, API authorization tests, UI action visibility tests, negative access tests. | Priority 2 |
| Branch-scoped permissions are missing | Future branch model needs access scoped to location and responsibility. | Critical | Multi-location organizations could expose listings, requests, or handovers to the wrong staff. | Add branch membership and branch-level permissions after branch entities are introduced. | 4-6 engineering days after branch model | Multi-branch user tests, branch-scoped RLS checks, UI role-gating checks. | Priority 2 |
| Pilot support ownership is not assigned | Named users are not yet responsible for verification, support, issue triage, and escalation. | High | Pilot issues may stall or be handled inconsistently. | Assign named founder/support owners and define escalation rules for verification, transaction, handover, certificate, and technical issues. | 1 day | Founder sign-off, support rota, escalation matrix, test issue triage drill. | Priority 1 |

## Transactions

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dedicated transaction, reservation, and handover records are required | Current lifecycle validates request completion, but durable transfer proof needs explicit reservation, transaction, and handover records. | Critical | Certificates, impact, disputes, and compliance depend on a stronger transaction ledger. | Add reservation, transaction, handover record, and handover evidence entities. Move completion, trust, impact, and certificate generation onto the transaction lifecycle. | 10-15 engineering days | Migration tests, lifecycle API tests, simulation compatibility, certificate generation from transaction, impact recalculation tests. | Priority 1 |
| Transaction proof is not centered on a dedicated ledger | Request completion currently carries too much business meaning. | Critical | Audit and certificate records may not represent the full real-world handover event. | Define transaction as the authoritative record after request acceptance. Include sender, receiver, resource, quantity, value, handover method, timestamps, status, and immutable completion snapshot. | Included above | End-to-end Restaurant/Hotel/Warehouse/NGO simulations with transaction IDs and certificates. | Priority 1 |
| Handover flows need mobile-first evidence capture | Handover proof will likely happen on phones, but evidence capture is not yet built. | High | Pilot users may complete transfers without adequate proof, especially outside desktop workflows. | After handover entities exist, add mobile-first confirmation flow with photo/document evidence, recipient confirmation, timestamps, and optional notes. | 5-8 engineering days | iOS/Android handover QA, evidence upload tests, certificate snapshot check. | Priority 3 |
| Category rules need operational approval before live regulated resources | Restricted category policy is not approved for pilot operation. | Critical | Food, storage-sensitive, NGO, government, or regulated goods could be mishandled. | Define pilot category allowlist, restricted categories, verification requirements, prohibited examples, and manual override procedure. Enforce eligibility in API workflows. | Policy: 2-3 days; enforcement: 4-6 days | Category eligibility tests, blocked listing/request tests, founder approval record. | Priority 1 |

## Notifications

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Notification delivery architecture is incomplete | Notification records and previews exist, but production delivery, preferences, and read states are incomplete. | High | Users may miss verification, request, handover, certificate, support, or issue events. | Add notification service, notification preferences, delivery channels, delivery status, mark-read API, and event triggers for core workflows. Begin with in-app and email for pilot. | 6-9 engineering days | Event-trigger tests, delivery status tests, email sandbox test, notification center QA. | Priority 2 |
| Support and dispute operating model is not active | Notification and escalation paths for failed handovers or issues are not formalized. | High | Live issues may not reach the right owner quickly. | Connect feedback/issues to support notifications and define escalation triggers for Critical and High pilot issues. | 2-4 days after notification foundation | Submit issue, confirm owner notification, verify status changes and audit events. | Priority 2 |

## Audit

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Audit read/export APIs are incomplete | Audit data exists, but admin and organization review access is not complete. | High | Founder/admins cannot reliably inspect evidence, workflow history, or compliance records. | Add scoped audit list/detail/export APIs for organization admins, support, verifiers, country admins, and platform admins. Include filters by organization, user, entity, event type, severity, and date. | 5-8 engineering days | Audit API tests, permission tests, export file validation, admin workflow QA. | Priority 2 |
| Admin workflows need deeper action states for evidence, dispute, and audit review | Admin screens exist, but review actions are not operationally deep enough for live disputes. | High | Reviewers may need to handle cases manually outside the platform. | Add admin action states for evidence requested, under review, approved, rejected, escalated, resolved, and reopened. Link each action to audit events. | 5-7 engineering days | Admin queue workflow tests, audit event checks, screenshot QA. | Priority 3 |
| Founder onboarding validation must be repeated with real pilot accounts | Validation exists in docs and simulations, but staging account evidence is still needed. | High | Pilot users may hit onboarding or permission gaps not covered by seeded data. | Execute the founder validation pack in staging using real pilot-like accounts and capture evidence. | 1-2 days | Completed checklist, screenshots, pass/fail register, issue log. | Priority 1 |

## Performance

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No load testing evidence for concurrent search, requests, QR verification, or dashboards | The app builds and tests cleanly, but concurrency has not been validated. | High | Pilot traffic spikes could slow discovery, workflow actions, dashboards, or public QR pages. | Add pilot-scale load tests for listing search, request creation, workflow completion, QR verification, trust/impact aggregation, and dashboard load. | 3-5 days | Load test report with latency, error rate, throughput, and failure thresholds. | Priority 2 |
| No production observability baseline documented as active | Monitoring and alerting are not verified as operating. | High | Production incidents could go undetected. | Add application logs, error monitoring, uptime checks, database health checks, API latency alerts, and pilot incident dashboard. | 3-6 days | Alert drill, error capture test, uptime check verification, dashboard screenshot. | Priority 1 |
| Production backups and rollback process need confirmation | The assessment requires operations readiness before external pilot users. | Critical | Data loss or failed deployment could disrupt pilot trust. | Confirm database backups, test restore, document rollback steps, and define release owner. | 2-4 days | Backup restore test, rollback drill, runbook sign-off. | Priority 1 |

## UX

| Finding | Gap Description | Severity | Risk | Recommended Fix | Estimated Effort | Validation Method | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Real-device mobile QA is incomplete | Responsive layouts exist, but mobile browser QA across critical pilot paths is not complete. | High | Pilot users may encounter mobile issues during discovery, handover, or QR verification. | Test iOS Safari and Android Chrome across registration, verification, discover, request, acceptance, completion, certificate download, and QR verification. | 2-4 days | Mobile QA checklist, screenshots, issue register, pass/fail summary. | Priority 1 |
| Pilot SOPs require founder approval | Verification, categories, handover, support, certificates, and impact wording are not formally approved. | Critical | Pilot decisions may become inconsistent or risky. | Approve a single pilot operations pack covering onboarding, document handling, category allowlist, handover procedure, certificate disclaimer, impact estimate language, support process, and escalation. | 2-3 founder days | Signed approval checklist, versioned SOP document, team walkthrough. | Priority 1 |
| Pilot feedback, issue, and onboarding state should be persisted | Current pilot workspace is useful for readiness but should become durable before cohort expansion. | High | Founder may lose operational history or lack reliable pilot metrics. | Persist pilot feedback, issues, status, milestones, and KPI snapshots through APIs and database tables. | 5-8 engineering days | Persistence tests, reload tests, API tests, dashboard data reconciliation. | Priority 2 |
| Payment/commercial account operations are not implemented or assessed | Commercial operations are out of scope for MVP pilot but required before conversion. | High | Revenue collection and account status will be manual or undefined. | Defer for pilot unless charging participants. Before commercial rollout, define invoicing, account status, plan limits, and payment workflow. | 5-10 days when prioritized | Commercial workflow test, invoice/account status validation. | Priority 3 |
| Enterprise contracts and data processing terms are not ready | Legal agreement package is not prepared for commercial expansion. | High | Enterprise users may not be onboardable beyond pilot agreements. | Prepare pilot participation agreement first, then MSA, DPA, SLA, and data retention terms for commercial launch. | 5-10 legal/founder days | Legal approval, agreement templates, participant acknowledgement. | Priority 3 |

## Implementation Priority Roadmap

### Priority 1: Pilot Safety Gate

**Goal:** Raise UAE Pilot Readiness from 78% to approximately 85%-88%.

| Work Item | Primary Category | Expected Readiness Impact |
| --- | --- | --- |
| Staging tenant-boundary tests | Security | Confirms tenant safety before external access. |
| Pilot SOP and category approval | UX/Transactions/Security | Creates consistent operating rules for regulated resources. |
| Transaction and handover foundation | Transactions | Creates durable transfer proof for certificates and impact. |
| Private document/evidence handling plan | Security | Prevents unsafe collection of sensitive documents. |
| Support ownership and escalation matrix | Permissions/Notifications | Gives live pilot issues clear accountability. |
| Real-device mobile QA | UX | Validates mobile browser use for critical pilot workflows. |
| Basic monitoring, backups, and incident drill | Performance/Architecture | Reduces operational risk during live usage. |

Exit criteria:

- All Priority 1 items have named owners and evidence.
- No Critical pilot-blocking item remains unresolved without approved manual control.
- Restaurant, Hotel, Warehouse, and NGO simulations still pass.
- Typecheck, build, and tests pass.
- Founder signs controlled pilot Go decision.

### Priority 2: Pilot Expansion Hardening

**Goal:** Support a larger UAE pilot cohort with lower manual load.

| Work Item | Primary Category | Expected Readiness Impact |
| --- | --- | --- |
| Granular roles and permissions | Permissions | Enables safe multi-user organization workflows. |
| Branch/location model | Architecture | Supports hotels, restaurants, warehouses, and schools with multiple sites. |
| Persistent pilot operations | Architecture/UX | Makes onboarding, feedback, issues, and KPIs durable. |
| Audit read/export APIs | Audit | Gives founder/admins evidence review capability. |
| Rate limiting | Security/Performance | Protects public and workflow endpoints. |
| Notification delivery | Notifications | Reduces missed requests, reviews, handovers, and support items. |
| Pilot-scale load tests | Performance | Validates expected early traffic. |

Exit criteria:

- Pilot can support 10-25 organizations with durable monitoring.
- Admins can review audit history without direct database access.
- Notifications cover critical workflow events.
- Branch and permission tests pass.

### Priority 3: Commercial Conversion Preparation

**Goal:** Prepare for UAE commercial readiness after pilot validation.

| Work Item | Primary Category | Expected Readiness Impact |
| --- | --- | --- |
| Commercial legal pack | Security/UX | Supports paid enterprise onboarding. |
| Payment and account operations | UX | Enables billing, plan status, and account controls. |
| Enterprise contracts and data processing terms | UX/Security | Enables procurement and compliance review. |
| Deeper admin workflow states | Audit/UX | Supports dispute, evidence, and moderation operations. |
| Mobile-first handover evidence capture | Transactions/UX | Strengthens real-world completion proof. |
| Expanded observability and performance testing | Performance | Supports broader launch scale. |

Exit criteria:

- UAE Commercial Readiness improves from 56% to 75%+.
- No Critical commercial launch blocker remains unowned.
- Legal, support, monitoring, and commercial operations are founder-approved.

## Validation Framework

Every remediation item should be validated through at least one of the following methods:

| Validation Method | Applies To |
| --- | --- |
| Typecheck/build/test | All engineering changes. |
| Simulation runner | Transaction, handover, certificate, trust, impact, and pilot workflow changes. |
| Multi-tenant staging test | Security, permissions, branches, audit, verification, and pilot data. |
| Mobile browser QA | Registration, verification, discover, request, handover, certificate, and QR verification. |
| Load test report | Search, requests, QR verification, dashboards, and APIs. |
| Founder approval checklist | SOPs, category rules, support ownership, certificate language, impact wording, and legal disclaimers. |
| Evidence pack | Screenshots, logs, exported audit records, test output, and signed checklists. |

## 85%+ Readiness Gate

ReDist should be considered above 85% UAE Pilot Ready when:

1. Priority 1 is complete or has founder-approved manual controls.
2. Tenant-boundary staging validation passes.
3. Transaction and handover records exist or a tightly controlled manual handover evidence process is approved for the first cohort.
4. Private document/evidence handling is safe for pilot use.
5. Pilot SOPs, category rules, support ownership, and escalation rules are approved.
6. Mobile browser QA passes for critical paths.
7. Monitoring, backups, and incident response are active.
8. Simulations pass for Restaurant, Hotel, Warehouse, and NGO scenarios.
9. Typecheck, build, and tests pass.

## Recommendation

Proceed with **Priority 1 remediation immediately** before inviting external UAE pilot organizations.

The fastest path to 85%+ UAE Pilot Readiness is not adding new product scope. It is reducing operational risk around tenant safety, transaction proof, document handling, pilot procedures, support ownership, mobile validation, and observability.

After Priority 1 is complete, ReDist can enter a controlled pilot with substantially stronger confidence while Priority 2 work prepares the platform for a larger cohort.
