# ReDist Database Review Report

Audit date: 2026-06-16

## Schema Overview

Core tables:

- `profiles`
- `organizations`
- `organization_members`
- `categories`
- `listings`
- `listing_requests`
- `audit_events`

Expansion tables:

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

## Relationship Review

Strong relationships:

- `profiles.id` references `auth.users`.
- `organizations.created_by` references `auth.users`.
- `organization_members` joins users to organizations.
- `listings` references organizations, users, and categories.
- `listing_requests` references listings and requester users.
- `listing_images`, `saved_listings`, `conversations`, and verification records cascade from their parent records where appropriate.
- Conversations are uniquely tied to listing requests.

Weak or polymorphic relationships:

- `audit_events.entity_id` is not constrained to the entity named by `entity_type`.
- `notifications.entity_id` is not constrained.
- `reports.entity_id` is not constrained.
- Locations are modeled only in the UI and not represented as a database table.
- Team invitations are modeled only in the UI and not represented beyond `organization_members`.
- Category subcategories are modeled only in the UI.

## RLS Review

Positive findings:

- RLS is enabled on all main and expansion tables.
- Public discovery is limited by published listings and active categories.
- Organization membership is checked through helper functions.
- Request insertion prevents users from requesting their own organization listing.
- Messages and conversations are limited to participants.
- Verification records are visible/manageable by organization members/admins.

Gaps:

- `audit_events` has RLS enabled but no select policy.
- `reports` has reporter-only select and no moderator/admin review policy.
- `organizations` are publicly visible, which may expose verification/account columns added later.
- `organization_members` has no insert/update/delete policy for inviting or changing members.
- `groups` can be publicly viewed and created by any authenticated user, but no update/moderation ownership policy exists.
- `categories` have public select only; no admin management policy exists.
- Verification review fields exist, but there is no platform-admin reviewer role.

## Workflow Function Review

Implemented RPCs:

- `accept_listing_request`
- `complete_listing_request`
- `publish_listing`
- `pause_listing`
- `decline_listing_request`
- `cancel_listing_request`

Strengths:

- `accept_listing_request` locks request and listing rows before reserving quantity.
- `cancel_listing_request` restores quantity when cancelling an accepted request.
- Workflow actions insert audit events.
- Execute permissions are limited to authenticated users.

Risks:

- `cancel_listing_request` can restore quantity and set a listing back to `published` when status is `paused`, even if the pause was manual rather than caused by zero quantity.
- `complete_listing_request` only marks a listing completed when quantity is zero and no other accepted request exists; partial completed handovers leave listing status unchanged.
- Decline/cancel/complete audit details are sparse compared with accept.
- UI status `reserved` is not a database enum value.

## API/Schema Alignment

Aligned:

- Listing create/update schemas broadly match listing table constraints.
- Organization create schema matches base organization fields.
- Listing request schema matches request quantity/message.

Misaligned:

- UI enum labels do not match API/database enum values.
- UI verification model includes document references and license states not fully exposed by API.
- UI team roles do not match database roles.
- UI locations and subcategories have no database model.
- README migration instructions omit `202606130002_company_verification.sql`.

## Recommended Database Stabilization

1. Define the production role model before implementing more UI gating.
2. Add platform/admin/moderator policies for reports, categories, verification review, and audit visibility.
3. Decide whether locations, subcategories, and invitations are first-class tables.
4. Replace public `organizations` exposure with a safe public view or column-level access pattern.
5. Add database tests for all RLS policies and RPC edge cases.
6. Align UI/shared/database enums before connecting the workspace to live APIs.

