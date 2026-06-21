# ReDist Technical Debt Report

Audit date: 2026-06-16

## High Priority Debt

1. Monolithic workspace component

`apps/web/src/app/app/workspace.tsx` is 2,536 lines and contains types, seed data, local storage, business logic, navigation, forms, and all module views. This makes role enforcement, API integration, testing, and future route splitting risky.

2. Prototype state duplicates backend workflow

Request submission, reservation, completion, messages, reports, notifications, groups, categories, locations, teams, and verification all mutate local state. This diverges from the Supabase schema and RPC functions.

3. Domain model mismatch

The UI uses labels and statuses such as `Free`, `For sale`, `Exchange`, `Excess stock`, and listing status `reserved`. Shared schemas and database enums use values such as `free`, `sale`, `exchange`, `excess`, and do not include `reserved`.

4. Incomplete authorization model

The UI exposes roles that the database does not enforce. Database roles are `admin` and `member`; UI roles include owner admin, inventory manager, requester, and moderator.

5. Missing API coverage

No API routes exist for messages, groups, notifications, saved searches/listings, reports review, audit events, verification documents/licenses, locations, team invitations, or category management.

6. Broken lint command

`pnpm --filter @redist/web lint` fails because `next lint` is not supported by the installed Next.js 16 setup. Typecheck and build pass, but lint cannot currently act as a CI gate.

## Medium Priority Debt

- API error handling returns many auth and database errors as HTTP 400 instead of clear 401, 403, 404, 409, or 422 statuses.
- Several RPC wrapper routes repeat the same logic and should use a small helper.
- Listing search interpolates query text into a PostgREST `.or(...)` filter without escaping reserved syntax.
- `organizations` are publicly selectable by RLS, including verification-related columns added later unless column-level controls or views are introduced.
- `audit_events` has RLS enabled but no select policy or API, so the UI cannot safely read production audit data.
- `reports` supports reporter visibility only; no moderator/admin review policy exists.
- Polymorphic `entity_type`/`entity_id` references in reports, notifications, and audit events are flexible but not referentially enforced.
- No automated tests for SQL functions, RLS behavior, API routes, or UI flows.
- No loading, failure, unauthorized, or optimistic-update recovery patterns in the workspace.
- File upload inputs exist in UI, but storage buckets, signed upload flow, and storage RLS are not implemented.

## Low Priority Debt

- Reusable UI primitives are trapped in `workspace.tsx`.
- Landing page and app use the same global CSS file, making style ownership harder as the app grows.
- CSS class names are consistent but global, with no component boundary.
- `README.md` migration list omits the company verification migration.
- The mobile app folder is only a placeholder.

## Verification Results

Commands run with bundled Node runtime on 2026-06-16:

- `pnpm typecheck`: passed.
- `pnpm --filter @redist/web build`: passed.
- `pnpm --filter @redist/web lint`: failed due to invalid `next lint` command.

The shell PATH does not include `node` by default in this environment. Verification required the bundled Node binary at `/Users/ehabismail/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.

