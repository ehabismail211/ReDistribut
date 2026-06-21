# ReDist Privacy Framework

Date: 2026-06-21  
Status: Framework only; not legal advice  
Required review: Professional UAE privacy/legal review before commercial use

## Purpose

This document outlines the privacy and data governance areas ReDist should define before commercial UAE launch.

It is not a privacy policy. It is a framework to guide formal privacy notice, data processing terms, retention rules, and operational controls.

## UAE Privacy Review Required

Professional review is required for:

- UAE Personal Data Protection Law applicability.
- Free zone or sector-specific data obligations.
- Consent and notice language.
- Data processing agreements.
- Cross-border data transfer requirements.
- Retention and deletion obligations.
- Employee/user data handling.
- Incident notification requirements.

## Data Categories

### Organization Data

Examples:

- Organization name.
- Legal name.
- Trade name.
- Organization type.
- Country, emirate, city, address.
- Contact details.
- Business category.
- Verification status.
- Trust score and trust history.
- Listings, requests, transfers, certificates, and impact summaries.

Governance concept:

- Organization data should be visible only to authorized users and platform roles based on workflow need.
- Public sharing requires explicit product/legal decision and participant approval where appropriate.

### User Data

Examples:

- Name.
- Email.
- Role.
- Organization membership.
- Authentication events.
- Support and feedback submissions.
- Audit actions.

Governance concept:

- User data should support identity, authorization, auditability, support, and workflow execution.
- User access should be removed when the person no longer represents the organization.

### Document Storage

Examples:

- Trade licenses.
- Food permits.
- Storage permits.
- NGO licenses.
- Authorization letters.
- Handover evidence.
- Incident screenshots.

Governance concept:

- Sensitive documents should not be stored in public locations.
- Access should be permissioned, logged, and limited by role.
- Signed upload/download or equivalent private access controls should be used.
- Manual off-platform handling may be used only as a founder-approved pilot control.

Professional legal review must define final storage, retention, and deletion rules.

### Audit Logs

Audit logs may include:

- User ID.
- Organization ID.
- Action type.
- Timestamp.
- Target entity.
- Permission decision.
- IP address and user agent where appropriate.
- Admin/reviewer action notes.

Governance concept:

- Audit logs support security, dispute review, trust scoring, and compliance evidence.
- Audit logs may need longer retention than ordinary user-generated content.
- Privacy notice must explain what is logged and why.

## Retention Concepts

Draft retention model:

| Data Type | Conceptual Retention | Notes |
| --- | --- | --- |
| Organization profile | While account is active plus defined post-closure period | Legal review required |
| User profile | While user is active plus defined post-removal period | Deactivation vs deletion decision required |
| Verification documents | Active verification period plus legal/audit period | Must support expiry and revocation |
| Transfer certificates | Longer retention may be needed for evidence | Legal review required |
| Handover evidence | Retain while dispute/certificate risk remains | Legal review required |
| Audit logs | Security/audit retention period | May be restricted from user deletion |
| Feedback and support issues | Retain for pilot learning and support history | Anonymize where possible |

## Data Access Concepts

| Role | Access Concept |
| --- | --- |
| Organization Admin | Own organization profile, users, listings, requests, transfers, certificates |
| Organization User | Limited workflow access based on role |
| Founder | Pilot oversight and support access |
| Platform Admin | Operational administration |
| Reviewer | Verification and evidence review as assigned |
| Public QR Viewer | Public-safe certificate verification only |

## Privacy Risks

| Risk | Severity | Mitigation Concept |
| --- | --- | --- |
| Cross-organization data exposure | Critical | RLS, server checks, staging validation, audit logs |
| Public exposure of private documents | Critical | Private storage, signed access, no public buckets |
| Excessive personal data collection | High | Collect only what supports workflow and compliance |
| Unclear retention rules | High | Define retention policy before commercial launch |
| Audit logs contain personal data | Medium | Explain in privacy notice and restrict access |
| Public certificate shows too much data | Medium | Public-safe QR payload only |

## Privacy Notice Topics

Formal privacy notice should cover:

- What data is collected.
- Why it is collected.
- Who can access it.
- How long it is retained.
- Whether it is shared externally.
- How participants request correction or deletion.
- How audit/security logs are handled.
- How certificates and public verification work.
- How incidents are reported.
- Contact details for privacy requests.

## Open Privacy Questions

| Question | Required Review |
| --- | --- |
| What UAE privacy obligations apply to ReDist's customer data? | UAE privacy/legal counsel |
| Are verification documents personal data, business data, or both? | UAE privacy/legal counsel |
| What retention period is appropriate for certificates and audit logs? | UAE privacy/legal counsel |
| What cross-border processing disclosures are required for Supabase/Vercel or future providers? | UAE privacy/legal counsel |
| What user deletion rights apply when audit logs must be preserved? | UAE privacy/legal counsel |

