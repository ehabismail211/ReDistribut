# Implementation Plan

## Phase 1 - Foundation

- Install dependencies and run the Next.js app.
- Create the Supabase development project or use the configured Redistribut project.
- Apply both migrations in timestamp order.
- Configure email authentication, callback URLs, and local environment variables.
- Verify `/api/v1/categories` returns active public categories.

## Phase 2 - Auth and Organization Onboarding

- Add sign-up, sign-in, account recovery, and profile screens.
- Add organization creation and membership management.
- Build role-aware navigation for visitors, members, organization members, and admins.

## Phase 3 - Listings and Discovery

- Replace the static listing cards with Supabase data.
- Add listing creation with image upload to private Supabase Storage.
- Add filters for category, location, offer type, expiry urgency, and reason.
- Add saved listings, saved searches, and group following.

## Phase 4 - Requests and Handover

- Add request forms and owner request inbox.
- Use `accept_listing_request` for transactional reservation.
- Add cancel, decline, complete, status history, and audit UI.
- Add request-linked conversations.

## Phase 5 - Launch Readiness

- Accessibility pass against WCAG 2.2 AA.
- Abuse reporting and moderation console.
- Rate limiting and bot protection.
- Production Supabase project with paid backups.
- Hostinger DNS, SSL, environment variables, and deployment pipeline.
- Error monitoring, structured logs, and backup restore test.

## Phase 6 - Apps

- Build an Expo app in `apps/mobile` after the web API and shared schemas are stable.
- Reuse `@redist/shared` validation and API contracts.
- Add push notifications only after notification preferences and moderation rules exist.
