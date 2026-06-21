# ReDist Architecture Review Report

Audit date: 2026-06-16

## Executive Summary

The current ReDist platform is a working local MVP preview, not yet a production-ready multi-screen application. The public landing page, local workspace UI, shared validation schemas, API route handlers, and Supabase migrations all build successfully. The largest architectural risk is that the application experience is concentrated in one large client component, `apps/web/src/app/app/workspace.tsx`, with localStorage-backed state and no live integration between most workspace modules and the `/api/v1` backend.

Production readiness should focus on splitting the workspace into route-backed, API-backed modules, aligning UI domain types with shared schemas and database enums, and completing role, organization, moderation, messaging, notification, verification, location, team, and audit APIs before adding features.

## Reviewed Surfaces

- Web app: `apps/web`
- Public site: `apps/web/src/app/page.tsx`
- Workspace app: `apps/web/src/app/app/page.tsx`, `apps/web/src/app/app/workspace.tsx`
- API routes: `apps/web/src/app/api/v1`
- Shared schemas: `packages/shared/src/index.ts`
- Supabase migrations: `supabase/migrations`
- Existing docs: `README.md`, `docs/*.md`

## Current Architecture

- Next.js App Router application with a public landing page at `/` and workspace preview at `/app`.
- API surface under `/api/v1` for categories, listings, organizations, profile, and listing request workflow actions.
- Shared package contains Zod schemas for organizations, profiles, listings, listing requests, and listing search.
- Supabase schema includes core tables, RLS policies, and RPC functions for request acceptance/completion, publishing, pausing, declining, and cancelling.
- Workspace product UI is implemented as one client-side state machine with localStorage persistence.

## Module Status Matrix

| Module | UI Exists | API/DB Exists | Production Readiness |
| --- | --- | --- | --- |
| Dashboard | Yes | Partial via audit/listing/request tables | Prototype only; local metrics |
| Discover | Yes | Listings/categories API | UI uses local state, not API |
| Publish | Yes | Listings API/RPC | UI publishes local records only |
| Requests | Yes | Listing requests/RPC | UI does local reservation logic |
| Messages | Yes | Conversations/messages tables | No API integration |
| Groups | Yes | Groups/group_members tables | No API integration |
| Notifications | Yes | Notifications table | No API integration |
| Organizations | Partial | Organizations/members tables | UI supports one local org only |
| Verification | Yes | Verification columns/tables | No API or storage integration |
| Locations | Yes | No dedicated location table | Local-only settings data |
| Teams | Yes | organization_members table | UI roles do not map to DB roles |
| Categories | Yes | Categories API/table | UI subcategories not modeled in DB |
| Settings | Yes | Mixed org/profile data | Local-only forms |
| Moderation | Yes | Reports table | No moderator role or review API |
| Audit Trail | Yes | audit_events table | No read policy/API for UI |

## Duplicate Pages And Components

No duplicate route pages were found. The platform currently has only `/` and `/app` as user-facing pages.

Component duplication is mostly structural rather than exact copy/paste. Good reusable primitives exist inside `workspace.tsx`:

- `PanelHeading`
- `Metric`
- `AuditPanel`
- `VerificationSummary`
- `RequiredDocumentsField`
- `LicenseList`

However, all of these are file-local. They cannot be reused across future route-level screens until extracted into shared component modules.

## Redundant Code And Coupling

- `workspace.tsx` combines domain types, seed data, state persistence, business rules, navigation, forms, and all module rendering in one 2,536-line client file.
- API action routes for publish, pause, accept, decline, cancel, and complete repeat the same handler shape.
- UI-only domain types duplicate concepts from `@redist/shared` and Supabase enums.
- Local request acceptance, completion, messaging, notifications, reports, team invites, category changes, and verification submission duplicate intended backend behavior.

## Component Reuse

The UI consistently uses internal primitives within the monolithic workspace. Reuse is effective locally but not architectural. The next stabilization step is to extract primitives and domain sections into reusable modules without changing behavior.

Recommended extraction targets:

- `components/workspace/WorkspaceShell`
- `components/workspace/WorkspaceNav`
- `components/ui/PanelHeading`
- `components/ui/Metric`
- `components/audit/AuditPanel`
- `components/verification/*`
- `features/{dashboard,discover,publish,requests,messages,groups,notifications,settings,moderation,categories}`

## Role-Based Access Review

The database has only two organization roles: `admin` and `member`. The UI previews four roles: `Owner admin`, `Inventory manager`, `Requester`, and `Moderator`. These are not mapped to database roles or enforced in the workspace UI.

Current enforcement exists mainly through Supabase RLS:

- Organization admins can update organizations.
- Organization members can create/update listings.
- Requesters can create and cancel eligible requests.
- Participants can view conversations/messages.

Gaps:

- No moderator role in the database.
- No inventory manager-specific permission.
- No UI gating by role.
- No centralized permission model in shared code.
- Reports cannot be reviewed by moderators through RLS/API.
- Audit events have RLS enabled but no select policy, making read access unavailable through normal authenticated clients.

## Multi-Organization Review

The database can support multiple organizations through `organization_members`. The UI only models one active organization string and one local team list. There is no organization switcher, active organization context, or API-backed membership selection in the workspace.

Production risk: route handlers accept `organization_id` from the request body and rely on RLS for authorization. This is acceptable as a backend guard, but the client needs explicit active organization selection and consistent request scoping.

## Production Readiness Assessment

Strengths:

- Clean build and typecheck with the correct Node runtime.
- Versioned API namespace exists.
- Core transactional reservation functions exist in SQL.
- RLS is present on all main tables.
- Landing page and local workspace are responsive without horizontal overflow in tested viewports.

Blockers:

- Workspace is local-state-only for most modules.
- Role model is incomplete and inconsistent.
- Several database-backed modules have no API surface.
- UI and database enums are mismatched.
- No automated test suite.
- Lint command is broken for Next.js 16.
- No production auth flow in UI.
- No error, loading, empty, or permission-denied states around real API calls.

