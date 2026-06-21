# ReDist Data Retention Framework

Date: 2026-06-21  
Status: Implementation/framework guidance; not legal advice or formal retention policy  
Required review: UAE privacy/legal review before commercial use

## Purpose

This framework defines draft retention concepts for ReDist data categories.

It does not set final legal retention periods. Final policy must be approved by legal/privacy counsel.

## Retention Principles

- Keep only what is needed for operations, trust, evidence, support, security, and legal obligations.
- Retain certificate and audit evidence long enough to support disputes and customer reporting.
- Avoid indefinite retention without clear reason.
- Separate active data, archived data, deleted data, and legal hold.
- Make retention expectations visible in privacy/commercial terms.

## Data Categories And Concepts

| Data Category | Examples | Draft Retention Concept | Review Needed |
| --- | --- | --- | --- |
| Organization profile | Name, legal name, trade name, address, category | Active account plus defined post-closure period | Legal/privacy |
| User profile | Name, email, role, membership | Active user plus defined post-removal period | Legal/privacy |
| Verification documents | Trade license, permits, NGO license | Active verification period plus audit period | Legal/privacy |
| Listings | Resource details, quantity, location, status | Active plus historical transfer evidence period | Legal/privacy |
| Requests | Quantity, requester, status, decision | Retain with transfer/audit evidence | Legal/privacy |
| Transfers | Handover, status, completion, exception | Retain as evidence record | Legal/privacy |
| Certificates | Certificate ID, QR token, impact snapshot | Longer evidence retention likely needed | Legal/privacy |
| Impact snapshots | AED, waste, CO2 estimates | Retain with certificate/reporting period | Legal/privacy |
| Audit logs | Permission, admin, security, workflow events | Longer security/evidence retention | Legal/privacy |
| Support/issues | Feedback, disputes, screenshots | Retain for support and risk review | Legal/privacy |

## Proposed Retention States

| State | Meaning |
| --- | --- |
| Active | Data used in current operations |
| Archived | Data preserved for evidence/reporting but not active workflow |
| Deleted | Data removed according to policy where allowed |
| Anonymized | Personal identifiers removed where practical |
| Legal hold | Deletion paused due to dispute, legal, or security need |

## Deletion Concepts

Deletion requests may be limited by:

- Audit/security obligations.
- Dispute records.
- Certificate evidence.
- Legal hold.
- Contractual obligations.
- Regulatory requirements.

Privacy/legal counsel must define final deletion rights and exceptions.

## Certificate Retention

Certificate retention requires special handling because certificates may be used as transfer evidence.

Conceptual rule:

- Certificate records should not be deleted while related transfer evidence, dispute, or customer reporting obligations remain active.
- Public QR verification may need expiration, revocation, or archived status concepts.
- Revoked/corrected certificates should retain history for audit integrity.

## Audit Log Retention

Audit logs may need longer retention than ordinary data.

Conceptual rule:

- Permission denied events, admin actions, certificate events, and role changes should be retained for security and evidence review.
- Audit logs should not expose excessive personal data.
- Audit access should be restricted.

## Enterprise Retention Questions

| Question | Required Decision |
| --- | --- |
| How long should certificates remain QR-verifiable? | Founder + legal |
| How long should audit logs be retained? | Legal/privacy/security |
| Can customers request deletion of organization profile data? | Legal/privacy |
| What data must remain after account termination? | Legal/privacy/commercial |
| How should legal hold be triggered and released? | Legal |
| Should enterprise customers be able to configure retention? | Product/commercial/security |

## Security Review Checklist

- Does each data type have a retention owner?
- Are private documents stored outside public access?
- Are audit logs protected from ordinary deletion?
- Are expired documents handled clearly?
- Can certificate records be corrected/revoked without hiding history?
- Are retention expectations disclosed to customers?
- Is legal hold defined before commercial launch?

