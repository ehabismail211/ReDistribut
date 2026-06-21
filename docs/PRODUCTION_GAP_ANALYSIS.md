# ReDist Production Gap Analysis

## Purpose

This document reviews the current ReDist implementation against:

- `docs/REDIST_FOUNDATION_BLUEPRINT.md`
- `docs/PRODUCTION_ARCHITECTURE.md`
- `docs/ENTITY_RELATIONSHIP_DIAGRAM.md`
- `docs/TRUST_VERIFICATION_DESIGN.md`

It identifies what already exists, what is missing, the severity of each production gap, and the recommended implementation sequence for a UAE launch.

This is a documentation-only analysis. No product code, UI code, API code, or database migrations are implemented here.

## Severity Model

| Severity | Meaning |
| --- | --- |
| Critical | Blocks UAE production launch, tenant safety, trust, verification, or controlled inventory workflows. |
| High | Required for a credible UAE pilot or enterprise-grade operating model. |
| Medium | Required for scale, admin efficiency, analytics, integrations, or stronger product completeness. |
| Low | Useful hardening or expansion work that can follow after launch foundations are stable. |

## Executive Summary

The current ReDist codebase is a strong MVP foundation. It includes a Next.js web app, versioned API routes, Supabase Auth integration, shared Zod schemas, PostgreSQL tables, Row Level Security, and transactional RPCs for key listing/request workflow actions.

The implementation is not yet production-ready for the UAE launch described in the foundation and architecture documents. The largest gaps are:

- No first-class country, emirate/region, city, or branch hierarchy.
- No production role and permission model beyond `admin` and `member`.
- No durable reservation, transaction, or handover record model.
- Verification has database fields and tables, but no submission, review, storage, expiry, or admin workflow APIs.
- Audit logs exist but are not broadly complete, queryable, or permission-scoped for admin review.
- Notifications exist as a table, but there is no notification service, API, delivery pipeline, or preference model.
- Trust score, category eligibility, restricted category controls, and impact records are still target architecture items.
- Workspace behavior remains mostly local-state preview rather than API-backed production modules.

## Current Implementation Snapshot

| Area | Current state |
| --- | --- |
| App structure | Next.js App Router under `apps/web`; single preview workspace at `/app`; public landing page at `/`. |
| API namespace | Versioned route handlers under `/api/v1`. |
| Auth | Supabase bearer-token user resolution in API handlers. |
| Shared contracts | Zod schemas for profile, organization, listing, listing search, and listing requests. |
| Database | Supabase PostgreSQL migrations for core marketplace/workflow entities and partial expansion entities. |
| RLS | Enabled across implemented core and expansion tables. |
| Workflow RPCs | Publish, pause, accept, decline, cancel, and complete request workflows exist. |
| UI state | Workspace modules are mostly local-state simulations with some production-oriented styling. |

## 1. Existing Database Entities

| Entity | Implementation | Production readiness |
| --- | --- | --- |
| Users | Supabase `auth.users` | Exists through platform auth. |
| Profiles | `profiles` | Basic user profile exists. |
| Organizations | `organizations` | Exists with core and verification-related columns. |
| Organization members | `organization_members` | Exists with limited role enum. |
| Categories | `categories` | Exists with active/restricted flags. |
| Listings | `listings` | Exists with quantity, status, category, offer, location text fields. |
| Listing requests | `listing_requests` | Exists with request status and quantity. |
| Audit events | `audit_events` | Exists with generic event fields. |
| Listing images | `listing_images` | Table exists; API/storage workflow missing. |
| Groups | `groups` | Table exists; API workflow missing. |
| Group members | `group_members` | Table exists; API workflow missing. |
| Saved listings | `saved_listings` | Table exists; API workflow missing. |
| Saved searches | `saved_searches` | Table exists; API workflow missing. |
| Conversations | `conversations` | Table exists; created after listing request. |
| Messages | `messages` | Table and RLS policies exist; API workflow missing. |
| Notifications | `notifications` | Table and RLS policies exist; API/service workflow missing. |
| Reports | `reports` | Table exists; reporter-only workflow is partial. |
| Organization licenses | `organization_licenses` | Partial certificate/license model exists. |
| Verification documents | `organization_verification_documents` | Table exists; workflow/API/storage missing. |

## 2. Missing Database Entities

| Missing entity | Why it matters | Severity |
| --- | --- | --- |
| Countries | Required for UAE launch configuration, GCC expansion, currency, language, and compliance boundaries. | Critical |
| Regions/emirates | Required for UAE operational geography and future GCC regional configuration. | High |
| Cities | Required for normalized discovery, branches, handovers, and analytics. | High |
| Branches | Required for organization locations, inventory ownership, handover points, and branch-scoped permissions. | Critical |
| Roles | Required to replace the two-role `admin`/`member` model with owner, inventory manager, requester, verifier, moderator, support, country admin, and platform admin. | Critical |
| Permissions | Required for granular action control and auditable access decisions. | Critical |
| Role permissions | Required to map roles to capabilities consistently. | Critical |
| Platform staff assignments | Required for verifier, moderator, support, country admin, and platform admin scopes. | Critical |
| Organization invitations | Required for controlled team onboarding. | High |
| Reservations | Required to separate requested intent from quantity holds and expiry. | Critical |
| Transactions | Required as durable business records after accepted/completed requests. | Critical |
| Handover records | Required for proof of transfer, signatures, timestamps, pickup/delivery data, and disputes. | Critical |
| Handover evidence | Required for photos, documents, and confirmation artifacts. | High |
| Trust scores | Required by trust strategy and dashboard placeholders. | High |
| Trust score events | Required to explain trust score changes. | Medium |
| Impact records | Required for durable impact reporting after completed handovers. | High |
| Document types | Required for country-specific verification requirements and expiry rules. | High |
| Verification levels | Required for Level 0-4 verification capability gates. | High |
| Category verification rules | Required for restricted category eligibility. | Critical |
| Organization category eligibilities | Required to unlock controlled categories safely. | Critical |
| Notification preferences | Required for user/org notification configuration. | Medium |
| Notification deliveries | Required to track email/SMS/push delivery outcomes. | Medium |
| Moderation actions | Required to preserve structured admin decisions on reports and disputes. | High |
| Audit exports | Required for compliance-grade audit review and controlled exports. | Medium |
| API keys / integration clients | Required for future enterprise inventory integrations. | Low |
| Webhook subscriptions / deliveries | Required for future enterprise event integrations. | Low |

## 3. Existing APIs

| API area | Routes | Production readiness |
| --- | --- | --- |
| Categories | `GET /api/v1/categories` | Public read-only category list. |
| Listings | `GET /api/v1/listings`, `POST /api/v1/listings` | Basic discovery and creation. |
| Listing detail | `GET /api/v1/listings/{id}`, `PATCH /api/v1/listings/{id}` | Basic read/update. |
| Listing workflow | `POST /api/v1/listings/{id}/publish`, `POST /api/v1/listings/{id}/pause` | RPC-backed workflow exists. |
| Listing requests | `POST /api/v1/listings/{id}/requests` | Basic request creation. |
| Requests | `GET /api/v1/requests` | Authenticated request list. |
| Request workflow | `POST /api/v1/requests/{id}/accept`, `decline`, `cancel`, `complete` | RPC-backed workflow exists. |
| Profile | `GET /api/v1/me`, `PATCH /api/v1/me` | Basic profile read/update. |
| Organizations | `GET /api/v1/organizations`, `POST /api/v1/organizations` | Basic organization list/create. |

## 4. Missing APIs

| Missing API | Why it matters | Severity |
| --- | --- | --- |
| Country/region/city APIs | Required for country-aware onboarding, discovery, and admin configuration. | High |
| Branch APIs | Required for organization locations, branch inventory, and handover points. | Critical |
| Organization detail/update APIs | Required for production organization profile and verification profile management. | High |
| Membership and invitation APIs | Required for team onboarding and role assignment. | Critical |
| Role/permission APIs | Required for permission-aware UI, admin management, and platform staff control. | Critical |
| Verification profile APIs | Required to update legal/trade/contact/authorized representative details. | Critical |
| Verification document APIs | Required to create, upload, replace, review, and version documents. | Critical |
| Admin verification review APIs | Required for queues, assignment, approve, needs changes, reject, suspend, and reinstate flows. | Critical |
| License/certificate APIs | Required for license submission, review, expiry, and renewals. | High |
| Category eligibility APIs | Required for restricted and controlled category unlocks. | Critical |
| Listing image/storage APIs | Required for signed uploads, image management, and safe media access. | High |
| Reservation APIs | Required for explicit hold/release/expire flows. | Critical |
| Transaction APIs | Required for durable transaction creation, status, completion, cancellation, and exports. | Critical |
| Handover APIs | Required for pickup/delivery evidence, confirmations, signatures, and disputes. | Critical |
| Conversation/message APIs | Required to connect existing tables to production messaging UX. | High |
| Notification APIs | Required to list, mark read, configure preferences, and expose notification center state. | High |
| Notification delivery APIs/jobs | Required for email/SMS/push fanout and delivery tracking. | High |
| Saved listing/search APIs | Required to connect saved search placeholders to durable user behavior. | Medium |
| Group APIs | Required for follow/unfollow and group-based inventory alerts. | Medium |
| Report/moderation APIs | Required for report review, resolution, suspension, and admin notes. | Critical |
| Audit log APIs | Required for tenant/admin/reviewer audit visibility and exports. | Critical |
| Category admin APIs | Required for restricted flags, country availability, rules, prohibited examples, and audit. | High |
| Platform analytics APIs | Required for verification SLA, transaction funnel, impact, and pilot operations. | Medium |
| Public safe organization APIs | Required to expose organization badges/trust safely without leaking raw verification fields. | High |
| Rate limiting and abuse APIs/middleware | Required to protect public discovery and authenticated mutations. | High |

## 5. Existing Permissions

| Permission capability | Current implementation |
| --- | --- |
| Authenticated API access | API handlers require Supabase bearer token where needed. |
| Organization membership check | `is_organization_member()` database helper exists. |
| Organization admin check | `is_organization_admin()` database helper exists. |
| Organization roles | `organization_role` enum supports `admin` and `member`. |
| Profile ownership | Users can manage their own profile through RLS. |
| Organization creation | Signed-in users can create organizations where `created_by = auth.uid()`. |
| Organization update | Organization admins can update organizations. |
| Listing visibility | Published listings are visible; organization members can view their own listings. |
| Listing create/update | Organization members can create/update listings. |
| Restricted category create block | Listing insert blocks categories where `is_restricted = true`. |
| Request visibility | Requester and listing owner organization members can view requests. |
| Request creation | Signed-in users can request published listings. |
| Request workflow RPC access | Authenticated users can execute workflow functions; functions enforce owner/requester checks. |
| Messages RLS | Conversation participants can view/send messages at DB policy level. |
| Notifications RLS | Users can manage their own notification records at DB policy level. |
| Verification document RLS | Organization members/admins can view/manage verification document records. |

## 6. Missing Permissions

| Missing permission | Why it matters | Severity |
| --- | --- | --- |
| Owner admin role | Required to distinguish organization ownership from general admin/member behavior. | Critical |
| Inventory manager role | Required to control listing creation, publish, pause, and request decisions. | Critical |
| Requester role | Required to allow requesting without full inventory administration. | High |
| Viewer role | Required for read-only enterprise staff and auditors. | Medium |
| Verifier role | Required for verification review and document decisions. | Critical |
| Moderator role | Required for reports, flagged content, and dispute moderation. | Critical |
| Support operator role | Required for pilot support without unsafe admin powers. | High |
| Country admin role | Required for UAE-first and GCC country-scoped operations. | High |
| Platform admin role | Required for global operational control and emergency overrides. | Critical |
| Branch-scoped permissions | Required for multi-branch inventory and handover operations. | High |
| Category eligibility permissions | Required to safely unlock restricted categories. | Critical |
| Audit read/export permissions | Required for tenant/admin/reviewer visibility. | Critical |
| Verification review permissions | Required to approve/reject documents safely. | Critical |
| Moderation review permissions | Required to review reports beyond reporter visibility. | Critical |
| Notification admin permissions | Required for platform notices and operational alerts. | Medium |
| Permission-denied API standard | Required for predictable UI and integration behavior. | Medium |
| Frontend permission gating | Required so users only see actions they can actually take. | High |

## 7. Existing Audit Functionality

| Audit capability | Current implementation |
| --- | --- |
| Audit table | `audit_events` exists with actor, event type, entity type, entity ID, details, timestamp. |
| Workflow audit inserts | Accept, complete, publish, pause, decline, and cancel workflows insert audit events. |
| Audit RLS enabled | `audit_events` has Row Level Security enabled. |
| Local audit preview | Workspace includes local audit events for simulated activity. |

## 8. Missing Audit Functionality

| Missing audit capability | Why it matters | Severity |
| --- | --- | --- |
| Audit read policy/API | Audit events exist but are not exposed through scoped production APIs. | Critical |
| Organization-scoped audit views | Required for organization owners and admins. | Critical |
| Platform audit review | Required for platform admins, verifiers, moderators, and support. | Critical |
| Verification audit coverage | Required for profile updates, document upload, review, approval, rejection, suspension, expiry. | Critical |
| Moderation audit coverage | Required for report review, decisions, suspensions, and reinstatements. | Critical |
| Membership audit coverage | Required for invitations, role changes, removals, and access changes. | High |
| Branch/location audit coverage | Required for handover location changes. | High |
| File access audit | Required for private verification documents and handover evidence. | High |
| Notification audit | Required for operational notices and sensitive delivery events. | Medium |
| Consistent audit schema | Current details payloads are sparse and inconsistent. | High |
| Audit export workflow | Required for compliance and founder/admin review. | Medium |
| Retention policy | Required for legal and operational governance. | Medium |

## 9. Existing Notification Capabilities

| Notification capability | Current implementation |
| --- | --- |
| Notification table | `notifications` exists with user, type, title, body, entity reference, read timestamp, created timestamp. |
| Notification RLS | Users can manage their own notification records. |
| Notification index | Indexed by user, read state, and created timestamp. |
| Local notification preview | Workspace simulates notifications and mark-all-read behavior locally. |
| Notification references | Table can reference entity type and entity ID as loose polymorphic fields. |

## 10. Missing Notification Capabilities

| Missing notification capability | Why it matters | Severity |
| --- | --- | --- |
| Notification API | Required to list, mark read/unread, delete/archive, and query notification center data. | High |
| Notification creation service | Required to create workflow alerts consistently. | High |
| Notification fanout jobs | Required for verification, request, saved search, expiry, and moderation events. | High |
| Delivery channels | Email, SMS, push, and in-app delivery are not implemented. | High |
| Delivery tracking | Required to know whether critical alerts were sent or failed. | Medium |
| Notification preferences | Required for user/org notification control. | Medium |
| Saved search alerts | Required by discovery strategy and saved search placeholders. | Medium |
| Verification reminders | Required for expiry and needs-changes workflows. | High |
| Admin queue notifications | Required for verification and moderation SLA operations. | High |
| Typed entity references | Current `entity_type`/`entity_id` lacks referential integrity. | Medium |
| Realtime strategy | Required for live request, message, and notification updates. | Medium |

## 11. Existing Verification Capabilities

| Verification capability | Current implementation |
| --- | --- |
| Organization verification columns | Organizations include verification status, notes, submitted date, and verified date columns. |
| Account type enum | `account_type` supports `company` and `supplier`. |
| Verification status enum | `draft`, `pending_review`, `verified`, `needs_changes`, `rejected` exist. |
| License table | `organization_licenses` captures license details, expiry, status, reviewer fields. |
| Verification document table | `organization_verification_documents` captures document type, path, status, reviewer fields. |
| Verification RLS | Organization members can view and organization admins can manage license/document records. |
| Local verification UI preview | Workspace simulates verification profile, license, documents, and submission. |

## 12. Missing Verification Capabilities

| Missing verification capability | Why it matters | Severity |
| --- | --- | --- |
| Verification submission API | Required to move from local preview to production review workflow. | Critical |
| Verification review API | Required for approve, reject, needs changes, suspend, reinstate. | Critical |
| Reviewer roles/policies | Required so only authorized verifiers/platform admins can review. | Critical |
| Document storage architecture | Required for private signed upload/download and access control. | Critical |
| Document type model | Required for UAE/GCC-specific document requirements. | High |
| Verification levels | Required for Level 0-4 trust and capability gates. | High |
| Category eligibility model | Required for restricted category unlocks. | Critical |
| Expiry reminders/jobs | Required for trade license, permits, and certificates. | High |
| Expiry-driven capability downgrade | Required when critical documents expire. | Critical |
| Verification audit events | Required for compliance and trust. | Critical |
| Public-safe verification projection | Required to show badges without exposing private details. | High |
| Trust score integration | Required to connect verification to reliability scoring. | High |
| Restricted category country rules | Required before enabling controlled categories at launch. | Critical |
| Manual review SOP integration | Required for founder-led UAE pilot operations. | High |

## 13. Existing Transaction Lifecycle Capabilities

| Lifecycle capability | Current implementation |
| --- | --- |
| Listing draft/published/paused/completed status | Implemented on `listings`. |
| Request pending/accepted/declined/cancelled/completed status | Implemented on `listing_requests`. |
| Request creation | Implemented through `POST /api/v1/listings/{id}/requests`. |
| Publish listing | RPC-backed `publish_listing`. |
| Pause listing | RPC-backed `pause_listing`. |
| Accept request | RPC-backed `accept_listing_request`; decrements available quantity transactionally. |
| Decline request | RPC-backed `decline_listing_request`. |
| Cancel request | RPC-backed `cancel_listing_request`; restores quantity if accepted. |
| Complete request | RPC-backed `complete_listing_request`; marks request completed and sometimes listing completed. |
| Conversation creation | Trigger creates conversation after listing request insert. |
| Basic workflow audit | Key workflow RPCs write audit events. |

## 14. Missing Transaction Lifecycle Capabilities

| Missing lifecycle capability | Why it matters | Severity |
| --- | --- | --- |
| Explicit reservation entity | Accepted requests currently act as implicit reservations; no independent hold, expiry, or reconciliation record. | Critical |
| Reservation expiry | Required to prevent stale accepted requests from holding inventory forever. | Critical |
| Transaction entity | Required to preserve durable business event separate from request state. | Critical |
| Handover record | Required for pickup/delivery method, branch, time window, contact, evidence, and confirmation. | Critical |
| Dual confirmation | Required when both owner and requester must confirm handover. | High |
| Handover evidence | Required for photos, documents, notes, signatures, and dispute proof. | High |
| Dispute lifecycle | Required for failed, contested, or incomplete handovers. | High |
| Cancellation reason codes | Required for trust scoring and operations review. | Medium |
| Completion evidence audit | Required for compliance and trust score inputs. | High |
| Requester organization reference | Requests currently reference requester user but not requester organization as a first-class party. | Critical |
| Owner organization snapshot | Required to preserve historical organization data at time of transaction. | Medium |
| Impact record generation | Required for durable avoided waste/value metrics. | High |
| Transaction export/proof | Required for enterprise and audit reporting. | Medium |
| SLA/status timeline | Required for operational monitoring and user clarity. | Medium |

## 15. Existing Scalability Readiness

| Scalability capability | Current implementation |
| --- | --- |
| Monorepo structure | `apps/web`, `apps/mobile`, and `packages/shared` support future separation. |
| Versioned API namespace | `/api/v1` gives room for API evolution. |
| Shared validation schemas | Zod schemas reduce contract drift for implemented routes. |
| Database indexes | Key indexes exist for listings discovery, requests, notifications, messages, and verification records. |
| RLS foundation | Row Level Security is enabled on implemented tables. |
| RPC workflows | Race-prone request acceptance/cancellation/completion use database functions and row locks. |
| Supabase Auth integration | API handlers can resolve current user with bearer token. |
| Responsive web direction | Web app has responsive UI work and a mobile placeholder app exists. |

## 16. Missing Scalability Requirements

| Missing scalability requirement | Why it matters | Severity |
| --- | --- | --- |
| Modular route-backed workspace | Current workspace is concentrated in one large client component. | High |
| API-backed workspace data | Many workspace modules are local preview state, not production API state. | Critical |
| Domain service layer | Route handlers call Supabase directly; business rules are not centralized. | Medium |
| Background job system | Required for notifications, expiry, saved searches, trust scores, impact, and admin digests. | Critical |
| Observability | No structured logging, metrics, tracing, uptime checks, or alerts are defined in implementation. | Critical |
| Rate limiting | Required for public discovery and authenticated workflow protection. | High |
| Search strategy | Basic filtering and `ILIKE` are not enough for larger catalogs. | High |
| File storage scaling | Bucket layout, signed URL flow, lifecycle, scanning, and CDN policy are not implemented. | High |
| Analytics read models | Required for platform analytics, verification SLA, and impact dashboards. | Medium |
| Backup/restore runbook | Required for production disaster recovery. | High |
| Policy tests | RLS and permission behavior need automated tests before launch. | Critical |
| API integration tests | Required for workflow confidence and regression prevention. | High |
| Public safe views | Required to avoid exposing raw organization/verification fields. | High |
| Multi-country configuration | Country fields exist as text, but no production country configuration model exists. | High |
| Mobile API readiness | API contracts are incomplete for future mobile app parity. | Medium |

## Consolidated Critical Gaps

| Gap | Category | Severity |
| --- | --- | --- |
| Country, branch, and requester organization modeling | Database | Critical |
| Role, permission, platform staff, verifier, and moderator model | Permissions | Critical |
| Verification submission/review/storage/expiry architecture | Verification | Critical |
| Category eligibility and restricted category enforcement | Verification/Categories | Critical |
| Reservation, transaction, and handover records | Transaction lifecycle | Critical |
| Audit read APIs, audit coverage, and audit permissions | Audit | Critical |
| Moderation review workflow and permissions | Admin | Critical |
| Notification service/fanout for critical workflow events | Notifications | High |
| API-backed workspace production modules | Application architecture | Critical |
| Background jobs, observability, rate limiting, and policy tests | Scalability/Security | Critical |

## Recommended Implementation Sequence for UAE Launch

### Phase 1: Production Foundations

Objective: establish the minimum safe multi-tenant foundation.

1. Add country, region/emirate, city, and branch data model.
2. Add requester organization references to request workflow.
3. Add roles, permissions, role-permission mapping, and platform staff assignments.
4. Add permission helper/service patterns for API handlers and RLS.
5. Add policy tests for organization, listing, request, verification, and audit boundaries.

Launch dependency: Critical.

### Phase 2: Verification and Restricted Category Control

Objective: make UAE organization approval real and auditable.

1. Add document types, verification levels, category verification rules, and organization category eligibility.
2. Add private storage architecture for verification documents with signed upload/download URLs.
3. Add organization verification submission APIs.
4. Add admin verification review APIs and reviewer role policies.
5. Add expiry rules, reminders, capability downgrade rules, and verification audit events.
6. Keep medicines, hazardous materials, controlled substances, and other regulated goods disabled until legal and operational approval.

Launch dependency: Critical.

### Phase 3: Transaction Lifecycle Hardening

Objective: separate interest, reservation, transaction, handover, and impact.

1. Add explicit reservations with hold/release/expiry behavior.
2. Add transaction records created from accepted requests.
3. Add handover records with branch/location, time window, method, contacts, confirmation, and evidence.
4. Add cancellation/dispute reason codes.
5. Add impact records generated from completed handovers.
6. Extend audit events across every lifecycle transition.

Launch dependency: Critical.

### Phase 4: Admin, Audit, and Moderation

Objective: support founder-led and admin-led UAE pilot operations.

1. Add audit log query APIs with organization, verifier, moderator, country admin, and platform admin scopes.
2. Add moderation review APIs for reports and flagged listings.
3. Add category admin APIs for allowed examples, prohibited examples, required fields, restricted flags, and country availability.
4. Add platform analytics for verification SLA, request funnel, completion rate, disputes, cancellations, and impact.
5. Add audit export workflow for controlled operational review.

Launch dependency: High.

### Phase 5: Notifications and Operational Jobs

Objective: make workflow events visible and actionable.

1. Add notification service for request, verification, moderation, expiry, saved search, and handover events.
2. Add notification APIs for list, read/unread, preferences, and archival behavior.
3. Add background jobs for expiry reminders, saved search matching, trust score recalculation, impact recalculation, and admin digests.
4. Add delivery tracking for future email/SMS/push.

Launch dependency: High.

### Phase 6: Production Application Architecture

Objective: move from local preview workspace to production modules.

1. Split `/app` workspace into route-backed modules: dashboard, discover, listing detail, publish, requests, messages, notifications, organization, verification, impact, settings.
2. Connect modules to API-backed data and permission-aware action states.
3. Add loading, empty, error, and permission-denied states.
4. Add public safe organization/listing projections.
5. Preserve responsive web and RTL readiness.

Launch dependency: High.

### Phase 7: Production Operations

Objective: make the UAE launch supportable.

1. Add structured logging, metrics, tracing, uptime checks, and alert thresholds.
2. Add rate limiting for public and authenticated APIs.
3. Add backup/restore and incident response runbooks.
4. Add API integration tests for critical workflows.
5. Add RLS regression tests.
6. Add founder weekly review dashboards for verification, trust, completion, disputes, and support issues.

Launch dependency: Critical for public production; High for controlled private pilot.

## UAE Launch Readiness Gate

ReDist should not move from controlled pilot to production UAE launch until these conditions are true:

- Organizations, branches, users, roles, and permissions are first-class and enforced.
- Verification submission and admin review are production workflows, not local preview states.
- Restricted categories are disabled or enforced by explicit category eligibility rules.
- Requests produce durable reservations, transactions, and handover records.
- Audit logs are complete, scoped, and reviewable by authorized users.
- Notifications exist for critical workflow and verification events.
- Public views do not expose private organization or verification data.
- API and RLS tests cover critical tenant and workflow boundaries.
- Monitoring, backup, incident, and support processes are ready for UAE pilot operations.
