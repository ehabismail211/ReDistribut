# ReDist Enterprise Due Diligence Package

Date: 2026-06-21  
Status: Implementation/framework guidance; not formal certification  
Audience: Enterprise buyers, procurement, security reviewers, founder sales process

## Purpose

This package summarizes the materials and readiness areas ReDist should provide during enterprise due diligence.

It is not a completed enterprise compliance packet. It identifies current evidence and remaining review items.

## Executive Summary

ReDist is a UAE-first circular redistribution platform for verified organizations. It supports listing, request, transfer, certificate, and impact workflows with role-based access and audit foundations.

Current readiness:

- Strong for founder-guided pilot.
- Improving for commercial planning.
- Not yet ready for broad enterprise launch without legal/security/compliance review.

## Due Diligence Document Set

| Document | Status |
| --- | --- |
| Security overview | Created |
| Access control model | Created |
| Audit logging framework | Created |
| Data retention framework | Created |
| Privacy framework | Created |
| Terms framework | Created |
| Risk register | Created |
| Dispute framework | Created |
| Governance model | Created |
| Launch blockers register | Created |
| Enterprise package | Created |
| Commercial model | Created |
| Formal DPA/MSA/SLA | Pending legal counsel |
| Penetration test report | Pending |
| SOC 2 / ISO certification | Not available |

## Authentication And Authorization

Current evidence:

- Supabase Auth-based identity.
- Server-side role resolution.
- Platform and organization roles.
- Privileged route/API guards.
- Organization-scoped permission checks.
- Cross-tenant denial validated in staging.

Enterprise follow-up:

- Confirm MFA/SSO needs.
- Confirm branch-level access model.
- Confirm access review process.

## Audit Trails

Current evidence:

- Permission audit event foundation.
- Workflow audit events.
- Verification audit concepts.
- Certificate history.
- Audit API access controls.

Enterprise follow-up:

- Export capability.
- Retention policy.
- Alerting and monitoring.
- Immutable/append-only policy review.

## Data Ownership And Privacy

Current position:

- Organizations remain responsible for accuracy of their operational data.
- ReDist stores workflow data needed to operate the platform.
- Public certificate verification should expose only public-safe data.
- Privacy framework exists but formal privacy policy requires UAE legal review.

Enterprise follow-up:

- DPA.
- Privacy notice.
- Subprocessor list.
- Cross-border data processing disclosures.
- Data deletion and retention commitments.

## Data Retention

Current position:

- Draft retention framework exists.
- Final retention periods are not yet legally approved.
- Certificate/audit evidence likely requires longer retention.

Enterprise follow-up:

- Formal retention schedule.
- Legal hold procedure.
- Termination/deletion process.

## Incident Response Concepts

Current concept:

- Detect.
- Log.
- Assign owner.
- Preserve evidence.
- Contain affected access/workflow.
- Notify founder/stakeholders where appropriate.
- Resolve.
- Review.
- Update controls.

Enterprise follow-up:

- Formal incident response policy.
- Notification obligations.
- Incident drill evidence.
- Security contact and escalation SLA.

## Security Review Checklist

| Area | Current Status | Enterprise Need |
| --- | --- | --- |
| Authentication | Implemented | MFA/SSO decision |
| Authorization | Implemented for pilot | Branch-level roles |
| Tenant isolation | Validated | Continue live testing |
| Audit logs | Foundation | Export/retention/alerting |
| Private documents | Framework/manual controls | Private storage and access audit |
| Incident response | Framework | Formal drill and SLA |
| Legal/privacy | Framework | Counsel-approved documents |
| Security testing | Automated tests | Pen test before enterprise launch |
| Compliance certification | None | Decide SOC 2/ISO roadmap |

## Procurement Answers Summary

| Question | Short Answer |
| --- | --- |
| Is ReDist formally certified? | Not yet. Current documents are implementation/framework guidance. |
| Is staging protected? | Yes, protected Vercel preview is active. |
| Are roles enforced server-side? | Yes, privileged routes/APIs use server-side checks. |
| Is cross-tenant access tested? | Yes, staging validation includes cross-tenant denial checks. |
| Are audit logs available? | Audit foundations exist; enterprise export is pending. |
| Is there a DPA? | Pending legal counsel. |
| Are impact reports audited ESG claims? | No. They are estimates unless separately validated. |
| Is certificate a legal document? | No. It is platform proof of recorded transfer workflow. |

## Enterprise Readiness Recommendation

Recommendation: Use this package for early enterprise discovery conversations, not procurement closure.

Before signing enterprise customers:

1. Complete first real pilot transfer evidence.
2. Complete UAE legal/privacy review.
3. Prepare MSA/DPA/SLA.
4. Complete private document storage and retention controls.
5. Run incident response drill.
6. Decide penetration testing scope.
7. Confirm enterprise access control requirements.

