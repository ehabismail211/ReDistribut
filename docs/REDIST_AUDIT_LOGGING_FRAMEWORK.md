# ReDist Audit Logging Framework

Date: 2026-06-21  
Status: Implementation/framework guidance; not formal audit certification

## Purpose

This framework defines how ReDist should use audit logs to support security, trust, workflow evidence, certificate integrity, and enterprise review.

## Audit Logging Goals

- Record privileged actions.
- Record permission decisions.
- Support dispute review.
- Support certificate history.
- Support verification decisions.
- Support trust score context.
- Preserve evidence for founder/admin review.

## Current Audit Concepts

Current audit areas include:

- `audit_events`.
- `permission_audit_events`.
- Verification audit events.
- Certificate history.
- Workflow events in the workspace preview.

## Events To Capture

| Event Area | Examples |
| --- | --- |
| Authentication | Login, logout, failed login where available |
| Role management | Platform role assignment, revocation, claim sync |
| Organization access | Organization read/manage actions |
| Listing workflow | Create, publish, pause, update |
| Request workflow | Submit, accept, decline, cancel, complete |
| Transfer workflow | Handover completion, verification, exception |
| Certificate workflow | Issue, view history, download, revoke/correct concept |
| Verification workflow | Submit, approve, reject, request changes |
| Admin actions | Trust recalculation, impact persistence, review decisions |
| Security events | Permission denied, cross-tenant attempt, suspicious access |
| Support/disputes | Issue opened, escalated, resolved, closed |

## Recommended Audit Fields

| Field | Purpose |
| --- | --- |
| Event ID | Unique event reference |
| Timestamp | Event time |
| Actor user ID | Who performed action |
| Actor role | Role at time of action |
| Organization ID | Tenant context |
| Entity type | Listing, request, certificate, verification, etc. |
| Entity ID | Target record |
| Action | What happened |
| Decision | Allowed, denied, changed, completed |
| IP / user agent | Security context where appropriate |
| Details | Minimal structured details |

## Audit Access

Audit access should be limited to:

- Founder.
- Platform Admin.
- Reviewer where relevant.
- Organization Admin for organization-scoped logs.
- Enterprise auditor role if implemented later.

Audit access itself should be logged.

## Audit Retention

Audit retention requires legal/privacy review.

Conceptual approach:

- Security and permission logs may need longer retention.
- Certificate and transfer audit records may need longer evidence retention.
- Routine UI/workflow logs may have shorter retention.
- Logs under dispute or legal hold should not be deleted until resolved.

## Audit Export

Enterprise accounts may request audit export.

Before offering audit export:

- Define export scope.
- Remove unrelated tenant data.
- Protect personal data.
- Include timestamp and actor context.
- Mark whether export is operational evidence, not legal certification.

## Audit Integrity Risks

| Risk | Mitigation Concept |
| --- | --- |
| Missing privileged events | Add tests for privileged actions |
| Excess personal data in logs | Minimize details and review privacy notice |
| Cross-tenant log exposure | Organization-scoped audit read checks |
| Log tampering | Restrict mutation and consider append-only model |
| Unclear retention | Define retention policy before commercial launch |

## Security Review Checklist

- Are all privileged API actions logged?
- Are denied permission attempts logged?
- Can organization users see only their own organization logs?
- Are audit records protected from ordinary user edits?
- Is certificate history linked to audit evidence?
- Are retention rules documented?
- Is log access itself auditable?

