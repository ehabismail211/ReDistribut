# ReDist Production Architecture

## Purpose

This document reviews the current ReDist implementation and defines the target production architecture for a UAE-first, enterprise-grade circular inventory platform. It separates the current MVP foundation from the architecture required for launch, GCC expansion, and global readiness.

No product code, UI code, or database migration changes are defined here. This is a strategic architecture document only.

## 1. Current Architecture Assessment

### Current Implementation

The current repository contains:

- `apps/web`: Next.js App Router web application.
- `apps/web/src/app/page.tsx`: public landing page.
- `apps/web/src/app/app/workspace.tsx`: local preview workspace implemented as one large client component.
- `apps/web/src/app/api/v1`: versioned API route handlers.
- `packages/shared`: shared Zod schemas and domain type exports.
- `supabase/migrations`: PostgreSQL schema, Row Level Security, and workflow RPCs.
- `apps/mobile`: placeholder for future Expo mobile app.

### Current Strengths

- Clear monorepo structure for web, mobile, and shared packages.
- Versioned API namespace under `/api/v1`.
- Supabase Auth integration for bearer-token authenticated API calls.
- Shared validation schemas for profiles, organizations, listings, listing search, and requests.
- Core PostgreSQL tables for profiles, organizations, organization members, categories, listings, listing requests, and audit events.
- Expansion tables for listing images, groups, saved searches, conversations, messages, notifications, reports, licenses, and verification documents.
- Transactional database functions for publishing, pausing, accepting, declining, cancelling, and completing requests.
- Row Level Security exists across major tables.

### Current Production Gaps

- Workspace UI is mostly local-state preview and is not fully connected to the API.
- Workspace modules are concentrated in one large client component.
- Role model is currently limited to `admin` and `member`, while product requirements need owner, inventory manager, requester, verifier, moderator, support, country admin, and platform admin concepts.
- Locations, regions, cities, branches, permissions, reservations, transactions, handover records, trust scores, and certificates are not first-class production entities yet.
- Notification, messaging, moderation, groups, verification review, and audit review APIs are incomplete or absent.
- Audit logs exist but need scoped read models and admin/reviewer policies.
- Some current tables use weak polymorphic references, such as `entity_type` plus `entity_id`, without referential constraints.
- Public organization exposure needs a safer public profile or view pattern before launch.
- Automated tests, policy tests, monitoring, alerting, rate limiting, and production incident processes are not yet established.

### Assessment

The current architecture is suitable as a foundation and product prototype. It is not yet a production multi-tenant SaaS platform. Production readiness requires modular frontend routes, expanded tenant and permission models, complete workflow APIs, stronger operational observability, country-aware data modeling, and a formal security posture.

## 2. Target Production Architecture

### High-Level Architecture

```text
Clients
  Public Web
  Authenticated Web Workspace
  Admin Console
  Future Mobile App
  Future Enterprise Integrations

Application Layer
  Next.js Web App
  Route Handlers under /api/v1
  Server Actions or API handlers for workflow mutations
  Shared validation and domain contracts

Platform Services
  Supabase Auth
  PostgreSQL with RLS
  Supabase Storage
  Realtime or notification delivery service
  Background jobs
  Logging and monitoring

Data Layer
  Multi-tenant relational schema
  Transactional workflow functions
  Audit logs
  Read models and analytics views
```

### Production Principles

- Keep country, organization, branch, and user membership as explicit authorization boundaries.
- Use database transactions for inventory reservation, cancellation, and completion.
- Treat verification, moderation, and audit as platform-grade workflows, not UI-only states.
- Keep all public data behind explicit public views or API projections.
- Keep mobile and integrations on the same versioned API contracts.
- Use background jobs for notification fanout, expiry reminders, impact calculation, and operational reporting.

## 3. Frontend Architecture

### Current Frontend

- Public landing page exists at `/`.
- Workspace preview exists at `/app`.
- Workspace logic, data, local state, and rendering are concentrated in `workspace.tsx`.
- Current UI uses local storage for preview data.

### Target Frontend

Recommended route structure:

```text
/
/about
/impact
/pricing
/enterprise
/contact

/auth/login
/auth/register
/onboarding/organization

/app
/app/dashboard
/app/discover
/app/listings/[id]
/app/listings/new
/app/requests
/app/messages
/app/notifications
/app/organization
/app/verification
/app/impact
/app/settings

/admin
/admin/moderation
/admin/verification
/admin/categories
/admin/audit
/admin/analytics
```

### Frontend Modules

- Public marketing and education pages.
- Authentication and onboarding.
- Workspace shell with organization switcher.
- Listings and discovery.
- Requests and handovers.
- Messaging and notifications.
- Organization profile, members, branches, and verification.
- Impact dashboard.
- Administration console.

### Frontend Patterns

- Server-render public pages where practical.
- Use server-side data loading for authenticated route shells.
- Use client components for interactive filters, forms, drawers, and messaging.
- Centralize API client behavior, error handling, loading states, and permission-denied states.
- Extract shared UI primitives aligned with `docs/REDIST_DESIGN_SYSTEM.md`.
- Use Metronic-inspired enterprise patterns documented in `docs/METRONIC_PAGE_MAPPING.md` when template assets are introduced.

## 4. Backend Architecture

### Current Backend

- Next.js route handlers under `/api/v1`.
- Supabase client wrapper for authenticated requests.
- Shared validation through `@redist/shared`.
- Database RPCs for core listing and request workflow mutations.

### Target Backend

Backend responsibilities:

- Validate requests.
- Resolve authenticated user context.
- Resolve active organization and role context.
- Enforce application-level permission checks.
- Call database queries or workflow RPCs.
- Return stable API responses.
- Create audit events through shared workflow utilities or database functions.
- Trigger notification jobs.

Recommended backend modules:

- Identity context.
- Organization context.
- Permission service.
- Listing service.
- Request and reservation service.
- Handover service.
- Verification service.
- Notification service.
- Moderation service.
- Audit service.
- Impact service.
- Admin analytics service.

### Background Jobs

Production should add background processing for:

- Expiring listing reminders.
- Expiring document reminders.
- Saved search matching.
- Notification fanout.
- Impact recalculation.
- Trust score recalculation.
- Audit exports.
- Admin digest generation.

## 5. Database Architecture

### Current Database

Implemented core tables:

- `profiles`
- `organizations`
- `organization_members`
- `categories`
- `listings`
- `listing_requests`
- `audit_events`

Implemented expansion tables:

- `listing_images`
- `groups`
- `group_members`
- `saved_listings`
- `saved_searches`
- `conversations`
- `messages`
- `notifications`
- `reports`
- `organization_licenses`
- `organization_verification_documents`

### Target Database Domains

Production should organize entities into these domains:

- Geography: countries, regions, cities.
- Tenancy: organizations, branches, memberships.
- Identity and access: users, roles, permissions, role permissions.
- Catalog: categories and category rules.
- Inventory workflow: listings, requests, reservations, transactions, handover records.
- Trust and compliance: certificates, verification documents, trust scores.
- Communication: notifications, conversations, messages, groups, saved searches.
- Administration: moderation reports, audit logs, analytics read models.

### Database Principles

- Use UUID primary keys for tenant and workflow entities.
- Use country-aware foreign keys rather than free-text country/city fields for production.
- Keep quantities numeric with explicit units.
- Use append-only audit logs for sensitive events.
- Add indexes for tenant scoping, workflow status, search filters, and timestamps.
- Use RLS on all tenant and user data.
- Use database functions for race-prone workflows.
- Use public read views for public discovery instead of exposing raw organization tables.

## 6. Multi-Tenant Architecture

### Tenant Model

Recommended hierarchy:

```text
Country
  Region
    City
  Organization
    Branch
      Listings
      Handover Records
    Organization Memberships
```

### Tenant Rules

- Countries define legal, currency, category, verification, and localization rules.
- Regions and cities normalize geography and support future local operations.
- Organizations own listings, requests, branches, verification records, conversations, and impact data.
- Branches represent inventory and handover locations.
- Users access organization data only through membership and role assignments.
- Platform admins can be global or country-scoped.

### Cross-Tenant Controls

- A requester can view public published listings across permitted countries and categories.
- Private request, message, handover, verification, and audit data must remain scoped.
- Cross-country operations should require explicit country enablement.
- Enterprise groups operating across countries should use multiple organization-country records or a parent account model in a later phase.

## 7. Authentication Strategy

### Current Authentication

- Supabase Auth users are referenced through `auth.users`.
- API routes accept `Authorization: Bearer <access-token>`.
- A profile is created after signup through a database trigger.

### Target Authentication

Recommended strategy:

- Supabase Auth for email/password and magic link initially.
- Email verification required before organization actions.
- Optional SSO for enterprise accounts later.
- MFA for platform admins, verifiers, and moderators.
- Session refresh handled client-side through official Supabase client patterns.
- Server-side token verification for all authenticated API routes.
- Device/session audit for privileged roles.

### Account Lifecycle

- User registers.
- Profile is created.
- User creates or joins organization.
- Organization owner submits verification.
- User receives role assignment.
- Permissions derive from active organization and role.

## 8. Authorization Strategy

### Current Authorization

- Database uses RLS helper functions such as `is_organization_member` and `is_organization_admin`.
- Organization roles currently support `admin` and `member`.
- API relies heavily on RLS and workflow RPC authorization.

### Target Authorization

Recommended model:

- Roles and permissions become first-class production entities.
- Organization roles should include owner admin, inventory manager, requester, viewer, and billing/admin roles as needed.
- Platform roles should include verifier, moderator, support operator, country admin, and platform admin.
- Permissions should be evaluated in application code and enforced by RLS.

### Permission Layers

- UI gating: hide actions the user cannot perform.
- API authorization: reject invalid actions with clear errors.
- Database RLS: enforce tenant access even if API logic fails.
- Workflow functions: enforce state transitions and row locks.
- Audit logs: record privileged and sensitive operations.

## 9. API Strategy

### Current API

Current routes include:

- Categories.
- Listings.
- Listing detail.
- Listing publish and pause.
- Listing requests.
- Requests list.
- Request accept, decline, cancel, and complete.
- Organizations.
- Current user profile.

### Target API Families

Recommended `/api/v1` route families:

- `/auth/session-context`
- `/countries`
- `/regions`
- `/cities`
- `/organizations`
- `/organizations/{id}/branches`
- `/organizations/{id}/members`
- `/organizations/{id}/verification`
- `/categories`
- `/listings`
- `/listings/{id}`
- `/listings/{id}/publish`
- `/listings/{id}/pause`
- `/listings/{id}/requests`
- `/requests`
- `/requests/{id}/accept`
- `/requests/{id}/decline`
- `/requests/{id}/cancel`
- `/requests/{id}/complete`
- `/requests/{id}/handover`
- `/messages`
- `/notifications`
- `/groups`
- `/saved-searches`
- `/impact`
- `/admin/moderation`
- `/admin/verification`
- `/admin/categories`
- `/admin/audit`
- `/admin/analytics`

### API Principles

- Keep response envelopes consistent.
- Validate all mutations with shared schemas.
- Use cursor pagination for production lists.
- Use idempotency keys for request acceptance, handover completion, and future transactions.
- Use versioning for breaking changes.
- Do not expose service-role behavior through public route handlers.
- Keep mobile and web API contracts aligned.

## 10. Notification Architecture

### Current State

- `notifications` table exists.
- Workspace preview has local notifications.
- No complete production notification API or delivery pipeline is implemented.

### Target Architecture

Notification flow:

```text
Workflow event
  Audit event
  Notification event
  Background job
  In-app notification
  Email or push delivery when enabled
```

Notification types:

- Request received.
- Request accepted or declined.
- Handover due.
- Handover completed.
- Listing expiring.
- Saved search match.
- Verification submitted, approved, or needs changes.
- Document expiring.
- Moderation report update.

Delivery channels:

- In-app notifications at launch.
- Email notifications for critical workflow events.
- Push notifications after native mobile app launch.
- Digest notifications for low-priority events.

## 11. File Storage Architecture

### Current State

- Listing image table stores `storage_path`.
- Verification documents and licenses store document paths.
- Supabase Storage integration is implied but not fully production-modeled.

### Target Storage

Storage buckets:

- `listing-images`: public or signed-read according to listing status.
- `verification-documents`: private, signed-read only.
- `license-documents`: private, signed-read only.
- `handover-evidence`: private or participant-scoped.
- `support-attachments`: private, scoped to support cases.

Storage rules:

- Store metadata in PostgreSQL.
- Store binary files in Supabase Storage.
- Use signed URLs for private documents.
- Scan uploads where infrastructure allows.
- Restrict file types and sizes.
- Generate thumbnails for listing images.
- Preserve document history for audit-sensitive verification changes.

## 12. Audit Architecture

### Current State

- `audit_events` table exists.
- Workflow RPCs write audit events for sensitive listing and request actions.
- Audit visibility policies and admin APIs need expansion.

### Target Audit

Audit event categories:

- Authentication and session security events.
- Organization creation and updates.
- Membership and role changes.
- Verification submissions and review decisions.
- Listing publish, pause, edit, remove.
- Request accept, decline, cancel, complete.
- Reservation and transaction changes.
- Handover confirmation and dispute activity.
- Moderation actions.
- Category rule changes.
- Admin access to sensitive documents.

Audit principles:

- Append-only.
- Actor-aware.
- Tenant-scoped.
- Entity-linked.
- Timestamped.
- Searchable by authorized reviewers.
- Exportable for compliance.
- Protected from normal user deletion.

## 13. Logging & Monitoring Strategy

### Application Logging

Log:

- API request errors.
- Workflow failures.
- Authorization denials.
- Validation failures by route.
- External service failures.
- Background job failures.
- File upload failures.

Avoid logging:

- Access tokens.
- Service-role keys.
- Full verification documents.
- Private message bodies unless explicitly required for support review and access-controlled.

### Monitoring

Monitor:

- API latency.
- API error rate.
- Build and deployment health.
- Database query latency.
- RPC failure rates.
- Auth failure spikes.
- Notification delivery failures.
- Storage upload and signed URL failures.
- Queue depth.
- Uptime and synthetic checks.

### Alerts

Critical alerts:

- Production API unavailable.
- Database unavailable.
- High error rate.
- Failed workflow RPC spike.
- Auth outage.
- Storage outage.
- Backup failure.
- Suspicious admin activity.

## 14. Security Architecture

### Security Controls

- Supabase RLS on all tenant data.
- Application-level permission checks.
- Service-role key restricted to server-only operations.
- No secrets in client bundles.
- Private storage for sensitive documents.
- Signed URLs for document access.
- MFA for privileged users.
- Rate limiting on auth, listing creation, messaging, and request actions.
- Abuse reporting and moderation workflows.
- Audit logging for sensitive operations.
- Principle of least privilege for platform staff.

### Data Protection

- Minimize public organization fields.
- Keep verification documents private.
- Separate public listing projections from internal listing data.
- Use country-aware retention rules.
- Define deletion, suspension, and legal hold behavior.
- Encrypt data in transit and rely on provider encryption at rest.

### Threat Areas

- Fake organizations.
- Unauthorized organization access.
- Over-reservation or inventory manipulation.
- Sensitive document leakage.
- Spam listings or messages.
- Abuse of public discovery.
- Insider misuse of admin tools.

## 15. Scalability Strategy

### Near-Term Scale

For UAE launch:

- Single Next.js app deployment.
- Supabase managed Postgres.
- Supabase Storage.
- In-app notifications.
- Manual support and verification operations.

### Growth Scale

As usage grows:

- Add search indexing for listings.
- Add background job workers.
- Add read models for analytics.
- Add queue-backed notifications.
- Add caching for categories and public country configuration.
- Add partitioning or archival strategy for audit logs and notifications.
- Add branch-level and country-level analytics materialized views.

### Scaling Principles

- Keep transactional workflows in Postgres.
- Move derived analytics to read models.
- Keep search separate from source-of-truth tables when needed.
- Use country and organization indexes consistently.
- Keep heavy admin exports asynchronous.

## 16. UAE Launch Architecture

### Launch Shape

UAE launch should use:

- One production web app at `redistribut.com`.
- Supabase Auth and Postgres.
- UAE as the first configured country.
- Emirate and city data normalized or tightly controlled.
- UAE-specific verification document requirements.
- Safe categories only.
- Manual moderation and verification review.
- In-app and email notifications for critical events.

### UAE Launch Scope

Required production capabilities:

- Registration and login.
- Organization setup.
- Organization verification submission.
- Branch or location capture.
- Listing creation and publishing.
- Public discovery.
- Request, accept, decline, cancel, and complete.
- Basic messaging.
- Notification center.
- Audit trail for sensitive events.
- Admin verification and moderation queues.
- Impact summary.

## 17. GCC Expansion Architecture

### Country Configuration

GCC expansion should add country-level configuration for:

- Currency.
- Language defaults.
- Regions and cities.
- Legal entity types.
- Verification documents.
- Category availability.
- Restricted category rules.
- Support contacts.
- Retention rules.

### Operating Model

- Country-scoped admins.
- Country-scoped verification reviewers.
- Country-specific category rules.
- Regional analytics by country.
- Enterprise organizations enabled in multiple countries only after clear account modeling.

### Expansion Sequence

1. Stabilize UAE operations.
2. Add country configuration model.
3. Add second GCC country in staging.
4. Validate verification and category differences.
5. Launch with limited organizations and manual review.

## 18. Global Expansion Readiness

Global readiness requires:

- Country, region, and city entities.
- Multi-language and RTL support.
- Multi-currency support.
- Country-specific compliance configuration.
- International address handling.
- Data residency review.
- Enterprise parent/child account model.
- API integration patterns.
- Search and analytics scale planning.
- Support operations by region.

Global expansion should not require changing the core listing, request, reservation, handover, audit, and impact concepts.

## 19. Disaster Recovery Considerations

### Backups

- Enable managed database backups.
- Test restore regularly.
- Document restore ownership and steps.
- Keep migration history complete and ordered.
- Back up critical storage buckets or define provider recovery process.

### Recovery Objectives

Recommended initial targets:

- RPO: 24 hours for launch, tighter after commercial scale.
- RTO: 4-8 hours for launch, tighter after enterprise adoption.

### Failure Scenarios

Prepare for:

- Database outage.
- Failed deployment.
- Auth outage.
- Storage outage.
- Accidental category or organization change.
- Data corruption from workflow bug.
- Sensitive document exposure.
- Admin account compromise.

### Recovery Practices

- Use staged deployments.
- Keep rollback paths for app releases.
- Keep database migrations reviewed and tested.
- Keep incident runbooks.
- Review audit logs after incidents.
- Communicate clearly with affected organizations.

## 20. Deployment Strategy

### Environments

Recommended environments:

- Local development.
- Preview environment per pull request or branch.
- Staging environment connected to staging Supabase.
- Production environment connected to production Supabase.

### Deployment Pipeline

Required checks before production deployment:

- Install dependencies.
- Typecheck.
- Build.
- Unit and integration tests.
- API route tests.
- Database migration validation.
- RLS policy tests.
- Accessibility smoke tests for critical flows.
- Environment variable validation.

### Production Deployment

Deployment principles:

- Use separate Supabase projects for staging and production.
- Store secrets in deployment provider secret storage.
- Never expose service-role keys to the client.
- Apply migrations in order.
- Run smoke tests after deployment.
- Monitor errors immediately after release.
- Keep manual rollback process documented.

### Release Governance

Founder or product approval should be required for:

- Public launch.
- New country launch.
- Restricted category enablement.
- Verification rule changes.
- Payment or transaction changes.
- Admin permission model changes.

Production architecture should be reviewed again after the UAE pilot and before GCC expansion.
