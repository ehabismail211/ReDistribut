# ReDist Security Overview

Date: 2026-06-21  
Status: Implementation/framework guidance; not formal security certification  
Audience: Enterprise prospects, internal review, founder due diligence

## Purpose

This document summarizes ReDist's current security posture and the controls expected before enterprise/commercial launch.

It is not a SOC 2 report, ISO certification, penetration test report, or legal/compliance certification.

## Current Security Position

ReDist is ready for protected, founder-guided UAE pilot use. Enterprise commercial readiness still requires additional legal, security, support, retention, and contract review.

Current validated strengths:

- Protected external staging deployment.
- Authentication through Supabase-based identity.
- Server-side role and permission checks.
- Route-level protection for privileged areas.
- Organization-scoped authorization checks.
- Permission audit event foundation.
- Public-safe certificate verification route.
- Automated tests covering critical permission and certificate behavior.

Known enterprise gaps:

- No formal third-party security audit yet.
- No SOC 2 / ISO 27001 certification.
- No finalized commercial DPA/SLA/security exhibit.
- Private document/evidence storage and retention process require final commercial review.
- Enterprise branch/role governance requires real customer validation.

## Authentication

Authentication model:

- Users authenticate through Supabase Auth.
- Server-side code resolves authenticated identity from request/session context.
- Platform roles can be synchronized into Supabase auth claims.
- Role headers and role cookies are not trusted for authorization.

Implemented platform roles include:

- Founder.
- Platform Admin.
- Reviewer.
- Pilot Coordinator.
- Organization Admin.
- Organization User.

Enterprise review items:

- Confirm production identity provider and session behavior.
- Decide whether SSO/SAML is required for enterprise accounts.
- Define MFA requirements before larger commercial deployments.
- Define user deprovisioning process and owner responsibility.

## Authorization

Authorization model:

- Server-side permission checks gate privileged APIs and routes.
- Organization-scoped checks prevent users from acting on another organization's records.
- Database RLS provides an additional lower-level safety layer.
- Privileged founder/admin/reviewer routes are protected.

Examples of protected actions:

- Audit access.
- Verification review.
- Trust score recalculation.
- Listing create/publish/pause.
- Request accept/decline/complete/cancel.
- Persisted impact calculation.
- Certificate history access.

Enterprise review items:

- Branch/location-scoped permissions.
- More granular enterprise roles.
- Admin role assignment UI and approval process.
- Periodic access review process.

## Audit Trails

ReDist has an audit foundation for:

- Permission decisions.
- Role assignment/revocation.
- Workflow events.
- Verification review events.
- Certificate history.
- Organization-scoped audit access.

Audit logs support:

- Security review.
- Dispute handling.
- Trust scoring.
- Admin oversight.
- Pilot monitoring.

Enterprise review items:

- Audit export.
- Immutable retention policy.
- Admin access review.
- Security event alerting.
- Legal hold process.

## Data Ownership

Data ownership concept:

- Organizations own their operational information and are responsible for its accuracy.
- ReDist stores workflow data needed to operate listings, requests, transfers, certificates, impact summaries, support, and audit trails.
- Public certificate verification should expose only public-safe certificate fields.

Professional legal/privacy review is required before commercial use.

## Data Retention

Retention framework:

- Organization profile data retained while account is active plus defined post-closure period.
- Verification documents retained according to verification/audit requirements.
- Certificates and audit logs may require longer evidence retention.
- Feedback/support issues retained for operational learning and support history.

Final retention periods require UAE legal/privacy review.

## Incident Response Concepts

Incident categories:

- Security incident.
- Privacy/data exposure incident.
- Certificate integrity incident.
- Verification/document incident.
- Dispute/handover incident.
- Availability or deployment incident.

Conceptual response:

1. Detect and log incident.
2. Assign owner.
3. Preserve evidence and audit logs.
4. Contain affected workflow or access.
5. Notify founder and affected stakeholders as appropriate.
6. Resolve or mitigate.
7. Review root cause.
8. Update risk register and controls.

Legal review is required for notification obligations.

## Security Review Checklist

| Control | Current Status | Enterprise Requirement |
| --- | --- | --- |
| Authentication | Implemented for pilot | Confirm production auth and MFA/SSO needs |
| Server authorization | Implemented | Expand branch/enterprise granularity |
| RLS / tenant isolation | Implemented and tested | Continue live negative testing |
| Audit logging | Foundation implemented | Add export, retention, alerting |
| Protected staging | Implemented | Production access policy required |
| Secret handling | Gitignore and checks used | Formal secret management process |
| Private documents | Framework/manual controls | Commercial storage/access audit required |
| Incident response | Framework | Drill and notification process required |
| Security certification | Not available | Decide if SOC 2/ISO needed |
| Penetration test | Not completed | Recommended before enterprise launch |

## Enterprise Security Readiness

Current enterprise security readiness: 74 / 100.

Rationale:

- Strong pilot-level authorization and audit foundation.
- Protected staging and automated checks are passing.
- Enterprise certification, formal policies, retention, incident drills, and private evidence controls remain pending.

