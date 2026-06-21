# ReDist Vendor Security Questionnaire

Date: 2026-06-21  
Status: Draft questionnaire response; not formal certification  
Audience: Enterprise security and procurement review

## Company And Product

| Question | Response |
| --- | --- |
| What is ReDist? | A UAE-first circular redistribution platform for verified organizations to manage surplus listings, requests, transfers, certificates, and impact evidence. |
| Is ReDist production-certified? | No formal security certification is currently claimed. |
| Is this document a certification? | No. It is implementation/framework guidance for due diligence. |
| What deployment is currently available? | Protected Vercel staging preview for founder-guided pilot. |

## Authentication

| Question | Response |
| --- | --- |
| How are users authenticated? | Supabase Auth-based identity is used in the current implementation. |
| Are roles resolved server-side? | Yes. Server-side permission logic resolves authenticated user and platform/organization roles. |
| Are client role headers trusted? | No. Role headers and role cookies are not trusted for authorization. |
| Is MFA supported? | Not formally defined for enterprise launch yet. MFA requirements should be reviewed before enterprise sale. |
| Is SSO supported? | Not currently positioned as available. SSO should be considered for enterprise phase. |

## Authorization

| Question | Response |
| --- | --- |
| Is access role-based? | Yes. Platform and organization roles are used. |
| Is tenant isolation supported? | Yes. Organization-scoped checks and database RLS provide tenant isolation. |
| Are privileged APIs protected? | Yes. Privileged APIs use server-side permission checks. |
| Can ordinary users access admin routes? | Protected routes/APIs deny unauthorized access. |
| Is branch-level access supported? | Not fully implemented for enterprise depth. First enterprise use should be scoped carefully. |

## Audit Trails

| Question | Response |
| --- | --- |
| Are privileged actions audited? | Audit foundations exist for permission decisions, workflow events, verification, and certificate history. |
| Are denied access attempts logged? | Permission audit foundations support denied permission decisions. |
| Can customers export audit logs? | Enterprise audit export is not yet implemented. |
| Are audit logs immutable? | Formal immutable/append-only policy requires further implementation/review. |

## Data Ownership

| Question | Response |
| --- | --- |
| Who owns organization data? | Organizations remain responsible for the accuracy and authority of their operational data. |
| What does ReDist store? | Workflow data needed for listings, requests, transfers, certificates, impact summaries, support, and audit trails. |
| Is public certificate data limited? | Public verification should expose public-safe certificate fields only. |
| Are impact metrics audited? | No. Impact metrics are estimates unless separately validated. |

## Data Retention

| Question | Response |
| --- | --- |
| Is there a formal retention policy? | A retention framework exists, but final policy requires legal/privacy review. |
| How long are certificates retained? | Not finalized. Certificate retention likely needs longer evidence retention. |
| Can customers request deletion? | To be defined by formal privacy policy and legal review. |
| Is legal hold supported? | Conceptual framework exists; operational procedure pending. |

## Data Storage And Documents

| Question | Response |
| --- | --- |
| Are private documents handled? | Verification and evidence document handling is defined as a framework/manual pilot control. |
| Are documents stored publicly? | Sensitive documents should not be stored publicly. Private storage/access audit is required before commercial scale. |
| Are access logs kept for documents? | Access audit is a required enterprise control; final implementation must be verified. |

## Incident Response

| Question | Response |
| --- | --- |
| Is there an incident response plan? | Incident response concepts are documented; formal policy and drill evidence are pending. |
| Who owns security incidents? | Founder and engineering owner during pilot; enterprise roles must be formalized. |
| Are notification timelines defined? | Not formally; legal review required. |
| Are incidents post-mortemed? | Post-mortem framework exists for pilot transfer and should be extended to incidents. |

## Security Testing

| Question | Response |
| --- | --- |
| Are automated tests run? | Yes. Current test suite passes and includes security/permission validation. |
| Has a penetration test been completed? | Not yet. Recommended before enterprise launch. |
| Is there SOC 2 or ISO 27001 certification? | Not currently. |
| Is vulnerability management documented? | Not formally yet. Should be added before enterprise procurement. |

## Compliance

| Question | Response |
| --- | --- |
| Is ReDist legal advice or ESG certification provider? | No. ReDist provides workflow evidence and impact estimates, not legal/tax/ESG certification. |
| Is there a DPA? | Pending UAE legal/privacy counsel. |
| Are UAE privacy obligations reviewed? | Framework exists; professional UAE review required. |
| Are certificates legally binding? | No. Certificates are platform evidence of recorded ReDist transfers, not legal title/tax/customs/payment documents. |

## Security Review Checklist For Enterprise Prospects

| Item | Status |
| --- | --- |
| Security overview shared | Ready |
| Access control model shared | Ready |
| Audit logging framework shared | Ready |
| Data retention framework shared | Ready |
| Privacy framework shared | Ready |
| Risk register shared | Ready |
| DPA/MSA/SLA | Pending |
| Pen test | Pending |
| Incident drill evidence | Pending |
| Private document storage evidence | Pending |

## Recommended Enterprise Response

ReDist can proceed with enterprise discovery and pilot discussions. It should not represent itself as formally certified or procurement-ready for large enterprise rollout until legal documents, security testing, incident procedures, and private document controls are completed.

