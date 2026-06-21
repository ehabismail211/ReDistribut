# ReDist Risk Register V1

Date: 2026-06-21  
Status: Governance framework; not legal advice  
Scope: UAE pilot and pre-commercial launch

## Risk Rating

| Rating | Meaning |
| --- | --- |
| Critical | Could pause pilot/commercial launch immediately |
| High | Must be owned before expansion or paid launch |
| Medium | Manageable with controls, monitoring, and owner |
| Low | Track as operational polish or future readiness |

## Top 10 Launch Risks

| Rank | Risk | Category | Severity | Current Mitigation | Owner |
| ---: | --- | --- | --- | --- | --- |
| 1 | Legal/compliance terms are not professionally reviewed | Legal | Critical | Framework docs created; legal review required | Founder |
| 2 | Private document/evidence storage and retention rules are not commercial-ready | Privacy / Security | Critical | Pilot manual controls; framework created | Founder / Engineering |
| 3 | Certificate may be misunderstood as legal/tax/government proof | Legal / Trust | Critical | Disclaimers in docs; formal terms needed | Founder |
| 4 | Restricted or unsafe goods enter the workflow | Operational / Legal | Critical | Pilot category restrictions | Founder |
| 5 | Cross-organization data exposure | Security | Critical | RLS/API validation and staging checks | Engineering |
| 6 | Dispute process is not legally/operationally mature | Trust / Legal | High | Dispute framework created | Founder |
| 7 | Impact metrics are interpreted as audited ESG claims | Reputation / Legal | High | ESG disclaimer framework | Founder |
| 8 | Founder-dependent support cannot scale | Operational | High | Founder-guided pilot only | Founder |
| 9 | Enterprise buyers require contracts/security review not ready | Commercial / Legal | High | Enterprise package concept only | Founder |
| 10 | Billing/payment process is undefined for paid launch | Commercial / Operational | Medium | Manual invoicing recommended initially | Founder |

## Operational Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Handover fails or participant does not show | High | Medium | Issue log, founder support, transfer dispute process |
| Quantity mismatch at handover | Medium | Medium | Confirm quantity before approval and completion |
| Founder support load becomes too high | High | Medium | Limit cohort, create onboarding scripts, track repeated issues |
| Mobile handover path fails | High | Low-Medium | Mobile smoke checks; physical device review before expansion |
| Participant uses wrong category or unsafe item | Critical | Medium | Category allowlist and founder approval |
| Organization contact is not authorized | High | Medium | Confirm primary contact and authorization during onboarding |

## Trust Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Supplier does not trust recipient suitability | Medium | Medium | Verification context, founder-guided first workflow |
| Recipient does not trust supplier/resource condition | Medium | Medium | Listing condition details and handover confirmation |
| Trust score is misunderstood as public rating | Medium | Medium | Position as operational confidence signal |
| Certificate is challenged after completion | High | Medium | Certificate dispute framework |
| Public QR exposes too much information | High | Low | Public-safe QR payload and privacy review |

## Verification Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Expired or invalid document accepted | High | Medium | Reviewer process and expiry tracking |
| Verification level overstates assurance | High | Medium | Verification limitation language |
| Category-specific permits missing | Critical | Medium | Category controls and legal review |
| Manual pilot clearance becomes inconsistent | Medium | Medium | Governance model and founder decision log |

## Legal Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Terms of Service not finalized | Critical | High | Terms framework; UAE legal review required |
| Privacy notice not finalized | Critical | High | Privacy framework; UAE legal review required |
| Liability for resource safety unclear | Critical | Medium | Transfer responsibility model; legal review |
| Tax/donation implications misunderstood | High | Medium | Certificate limitation language |
| Commercial contracts not ready | High | Medium | Enterprise package requires MSA/DPA/SLA before sale |

## Reputation Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Pilot participant has poor experience | Medium | Medium | Founder-guided onboarding and feedback capture |
| Impact claims appear inflated | High | Medium | Estimate disclaimers and conservative reporting |
| Unsafe transfer damages trust | Critical | Low-Medium | Category restrictions and pause rules |
| Public launch occurs before readiness | Critical | Low | Launch blockers register and gated decision process |

## Security Risks

| Risk | Severity | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Cross-tenant access | Critical | Low | Tests, RLS, server permission checks |
| Secret leakage | Critical | Low | Gitignore and secret checks |
| Unauthorized admin access | Critical | Low | Route/API protection validation |
| Private file exposure | Critical | Medium | Private storage design required before commercial scale |
| Audit logs missing for sensitive action | High | Medium | Permission audit logging and admin controls |

## Risk Review Cadence

- During Wave 1: review after every participant session.
- Before first paid customer: review all Critical and High risks.
- Before enterprise sale: review legal, privacy, support, security, and contract risks.
- Before public launch: no Critical launch blocker may remain unresolved.

