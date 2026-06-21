# ReDist Access Control Model

Date: 2026-06-21  
Status: Implementation/framework guidance; not formal access-control certification

## Purpose

This document defines ReDist's current access-control model for pilot and future enterprise due diligence.

## Access Control Principles

- Least privilege.
- Organization-scoped access.
- Server-side authorization.
- Defense in depth with database RLS.
- Privileged action auditability.
- Founder/admin access limited to operational need.
- Public certificate verification exposes only public-safe data.

## Authentication Sources

Current model:

- Supabase Auth identifies users.
- Auth claims may include synchronized platform roles.
- Active `user_platform_roles` assignments can provide platform role context.
- Organization membership records provide organization-scoped role context.

Not accepted:

- Client-provided role headers.
- Client role cookies.
- UI-only role labels.

## Platform Roles

| Role | Scope | Typical Access |
| --- | --- | --- |
| Founder | Full pilot oversight | Founder routes, audit, admin, trust, impact, organizations, listings, requests |
| Platform Admin | Platform operations | Admin APIs, verification, audit, trust, impact |
| Reviewer | Verification review | Verification packages, documents, organization read, audit read |
| Pilot Coordinator | Pilot monitoring support | Pilot monitoring, organization read, request management, audit read |
| Organization Admin | Organization operations | Own organization setup, listings, requests, verification, scoped audit |
| Organization User | Limited organization workflow | Own organization read, request creation, assigned request actions |

## Permission Areas

| Area | Permission Concept |
| --- | --- |
| Founder route access | Founder-only protected routes |
| Audit read | Platform/founder or scoped organization admin access |
| Organization read/manage | Organization-scoped membership or platform permission |
| Verification create/review | Organization admin creates; reviewer/admin reviews |
| Listing create/manage | Organization admin or platform/founder |
| Request create | Organization user/admin or platform/founder |
| Request accept/decline | Sender organization admin or platform/founder |
| Request complete/cancel | Requester or sender organization admin/platform permission |
| Trust recalculation | Founder/platform admin |
| Impact persistence | Founder/platform/admin-scoped permission |
| Certificate history | Audit-read permission |

## Organization Boundary Model

Organization boundary checks should ensure:

- User belongs to the organization they are acting for.
- Listing organization is resolved before publish/pause.
- Request sender and receiver scopes are resolved before action.
- Verification organization is resolved before review/document changes.
- Audit reads are scoped unless platform role allows broader access.

## Public Access

Public access should be limited to:

- Public website pages.
- Public-safe certificate verification route.
- No private documents.
- No internal audit logs.
- No sensitive organization contact details unless explicitly approved.

## Admin Access Governance

Admin access should require:

- Named user identity.
- Assigned platform role.
- Operational reason for access.
- Audit trail for privileged action.
- Periodic role review.
- Immediate revocation when no longer needed.

## Enterprise Gaps

| Gap | Priority | Notes |
| --- | --- | --- |
| Branch/location-scoped permissions | High | Needed for larger groups |
| Role management UI | Medium | Pilot can use controlled admin/SQL process |
| Periodic access review | High | Needed for enterprise security review |
| SSO/MFA policy | Medium | Needed for larger accounts |
| External auditor/read-only role | Medium | Useful for ESG/certificate review |

## Validation

Current validation includes:

- Source/tests for server permission checks.
- Staging validation for role claims and access.
- Unauthorized founder route denial.
- Unauthorized audit API denial.
- Cross-tenant denial.
- Organization user restrictions.

This document is not a formal access-control certification.

