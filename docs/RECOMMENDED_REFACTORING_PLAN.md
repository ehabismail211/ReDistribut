# ReDist Recommended Refactoring Plan

Audit date: 2026-06-16

## Guiding Constraint

Do not add new features during this stabilization phase. Refactoring should preserve current behavior while making the platform ready for API integration, role enforcement, and production QA.

## Phase 1 - Stabilize Tooling And Contracts

1. Replace the broken `next lint` script with supported ESLint tooling for Next.js 16.
2. Add CI commands for typecheck, build, lint, and tests.
3. Create a domain contract file that maps UI labels to shared/API/database enum values.
4. Align listing statuses across UI, shared schemas, and database.
5. Update README migration instructions to include all migrations.

Exit criteria:

- Typecheck, build, and lint pass from a clean shell with documented Node/pnpm requirements.
- Shared enum contracts are the only source of truth for UI labels and API values.

## Phase 2 - Split The Workspace Without Behavior Changes

1. Extract reusable primitives from `workspace.tsx`.
2. Move module sections into feature folders.
3. Keep the existing local state adapter temporarily to avoid functional changes.
4. Add smoke tests for rendering each module.

Suggested structure:

```text
apps/web/src/components/ui
apps/web/src/components/workspace
apps/web/src/features/dashboard
apps/web/src/features/discover
apps/web/src/features/publish
apps/web/src/features/requests
apps/web/src/features/messages
apps/web/src/features/groups
apps/web/src/features/notifications
apps/web/src/features/organizations
apps/web/src/features/verification
apps/web/src/features/locations
apps/web/src/features/teams
apps/web/src/features/categories
apps/web/src/features/settings
apps/web/src/features/moderation
apps/web/src/features/audit
```

Exit criteria:

- `workspace.tsx` becomes orchestration only.
- Each requested module has a clear ownership folder.
- No user-visible behavior changes.

## Phase 3 - Centralize Navigation And Permissions

1. Create a module registry with route/section id, label, icon, permission requirement, and badge source.
2. Add role mapping between product roles and database roles.
3. Decide whether workspace modules become nested routes or URL-addressable section hashes.
4. Add mobile navigation behavior that keeps selected content visible.

Exit criteria:

- Navigation is generated from one registry.
- Role-based visibility is testable.
- Modules are deep-linkable or otherwise restorable after refresh.

## Phase 4 - Complete Backend Readiness

1. Add missing API surfaces for messages, groups, notifications, saved searches/listings, reports, audit events, verification records, locations, teams, and categories as needed.
2. Add RLS policies for moderation, audit viewing, organization member management, category administration, and verification review.
3. Add database tests for all RPCs and RLS policies.
4. Replace local workspace mutations with an adapter boundary that can switch from local preview data to API data.

Exit criteria:

- Every production module has an API and database permission path.
- Local preview behavior is separated from production data behavior.

## Phase 5 - Production QA Pass

1. Add Playwright smoke tests for desktop, tablet, and mobile.
2. Add accessibility checks.
3. Add API route tests for validation, auth, and expected error statuses.
4. Add SQL workflow tests for request acceptance, cancellation, completion, and report review.
5. Add deployment readiness checks for environment variables and Supabase connectivity.

Exit criteria:

- Production readiness can be verified automatically.
- Manual QA focuses on workflow review rather than basic stability.

## Refactoring Order

Recommended order:

1. Tooling and contracts.
2. Component extraction.
3. Module extraction.
4. Navigation registry and permissions.
5. API/RLS completion.
6. Production QA automation.

This order reduces risk because it makes the current behavior easier to test before replacing local prototype state with live backend state.

