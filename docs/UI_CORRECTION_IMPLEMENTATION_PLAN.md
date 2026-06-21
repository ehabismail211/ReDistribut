# ReDist UI Correction Implementation Plan

Date: 2026-06-21  
Purpose: Define the corrective implementation sequence for improving ReDist page layouts and workflow arrangement after UI/workflow revalidation.

## Goal

Move ReDist from a dense MVP workspace into a clean enterprise SaaS workflow that matches:

- `docs/REDIST_DESIGN_SYSTEM.md`
- `docs/METRONIC_PAGE_MAPPING.md`
- `docs/METRONIC_UI_TRANSFORMATION_PLAN.md`
- Current pilot-stage backend capabilities

This plan focuses on layout, navigation, workflow arrangement, and usability. It does not add new platform capabilities.

## Design Direction

ReDist should feel like:

- Enterprise resource governance.
- UAE-first circular inventory infrastructure.
- Compliance-aware operational software.
- Trust, audit, and impact platform.

ReDist should not feel like:

- A charity donation portal.
- A consumer marketplace.
- A recycling-themed landing page.
- A dashboard full of unrelated cards.

## Implementation Principles

| Principle | Application |
| --- | --- |
| Route-first structure | Major workflows should have URL-addressable pages |
| Action-first dashboards | Dashboard starts with pending work, not generic metrics |
| Operational density | Use tables, queues, tabs, drawers, timelines, and compact cards |
| Role separation | Founder/admin/reviewer views should be visually separate from organization workspace |
| Workflow continuity | Publish, request, handover, certificate, trust, and impact must feel connected |
| Mobile task focus | Mobile should prioritize handover, request actions, document status, and QR verification |
| RTL readiness | Layout should use logical spacing and directional-safe patterns |

## Recommended Navigation Model

### Organization Workspace Navigation

Primary:

- Dashboard
- Discover
- Publish Listing
- Requests
- Messages
- Notifications

Trust and governance:

- Verification
- Trust Score
- Impact
- Certificates

Organization:

- Organization Profile
- Branches and Members
- Settings

### Admin Workspace Navigation

Founder and platform:

- Founder Dashboard
- Pilot Monitoring
- Platform Analytics

Operations:

- Verification Review
- Moderation
- Categories
- Audit Logs

## Sprint Sequence

## UI Correction Sprint 1: App Shell, Dashboard, Discover

Objective: Fix the first impression and daily navigation structure.

Pages:

- `/app/dashboard`
- `/app/discover`
- Shared app shell/navigation

Scope:

- Create a clearer workspace shell.
- Make dashboard action-first.
- Rebuild Discover as enterprise resource discovery.
- Improve mobile navigation.
- Keep existing functionality unchanged.

Dashboard acceptance criteria:

- Top of page clearly shows verification status, trust score, impact summary, open requests, and expiring documents.
- First main panel is an action queue.
- Active listings and recent activity are below the primary action area.
- Notifications preview is visible but not dominant.
- No card competes with the primary action area.
- Works on desktop, tablet, and mobile.
- Dark mode and RTL layout do not break the hierarchy.

Discover acceptance criteria:

- Search area is prominent and compact.
- Filters are organized by category, location, verification, expiry, offer type, and handover method.
- Desktop uses sidebar filters.
- Mobile uses drawer-style filter behavior.
- Listing cards show verification badge, trust badge, quantity, expiry, city, handover method, and request action.
- Saved search is visible as a secondary action.
- Page feels like enterprise resource discovery, not a consumer marketplace.

Estimated effort: High.

Validation:

- Typecheck.
- Build.
- Tests.
- Desktop visual review.
- Tablet visual review.
- Mobile visual review.

## UI Correction Sprint 2: Request Workflow Spine

Objective: Make the core transaction lifecycle obvious and operational.

Pages:

- `/app/requests`
- `/app/requests/[id]`
- Listing request panel integration

Scope:

- Convert requests into queue-based workflow.
- Add clear owner/requester states.
- Add request detail view with timeline.
- Make certificate generation the visible final outcome after completion.

Acceptance criteria:

- Requests have status tabs: Incoming, Outgoing, Accepted, Handover, Completed, Closed.
- Each request shows next action.
- Request detail shows listing summary, participants, quantity, handover method, messages, timeline, and certificate if completed.
- Owner and requester actions are visually distinct.
- Completed request naturally leads to certificate and impact update.

Estimated effort: High.

Validation:

- Restaurant scenario.
- Hotel scenario.
- Warehouse scenario.
- NGO scenario.
- Direct mobile handover path review.

## UI Correction Sprint 3: Verification And Organization Profile

Objective: Make trust and compliance credible.

Pages:

- `/app/verification`
- `/app/organization`
- `/admin/verification-review`

Scope:

- Reframe verification as a guided compliance workflow.
- Separate organization identity from settings.
- Improve reviewer queue structure.

Verification acceptance criteria:

- Current level and status are visible at top.
- Required document checklist is easy to scan.
- Pending, approved, rejected, and expired states are clear.
- Expiry warnings are prominent.
- Verification timeline is visible.
- Submit/resubmit action is obvious.

Organization profile acceptance criteria:

- Profile header shows trade name, legal name, city, verification badge, and trust badge.
- Tabs separate overview, branches, members, verification, certificates, and activity.
- Public-safe information is separated from internal admin-only information.

Admin review acceptance criteria:

- Reviewer sees pending queue first.
- Each item has organization, level requested, document count, expiry risk, and submitted date.
- Review action is clear and permission-gated.

Estimated effort: High.

Validation:

- Verified organization.
- Pending review.
- Rejected review.
- Expired document.
- Unauthorized reviewer action denial.

## UI Correction Sprint 4: Impact, Certificates, Admin Separation

Objective: Polish the governance, proof, and founder monitoring experience.

Pages:

- `/app/impact`
- `/app/certificates`
- `/admin/dashboard`
- `/admin/pilot-monitoring`
- `/admin/audit-logs`

Scope:

- Separate organization impact from platform impact.
- Make certificate history easy to find.
- Move founder/pilot monitoring into a protected admin experience.
- Improve audit review layout.

Acceptance criteria:

- Organization impact dashboard focuses on the current organization only.
- Admin impact dashboard focuses on platform-wide pilot health.
- Certificate list includes certificate ID, resource, sender, receiver, date, QR status, and download action.
- Founder dashboard shows pilot organization health, critical issues, completed transfers, certificates, trust, verification, and feedback.
- Audit logs are dense, filterable, and role-safe.

Estimated effort: Medium to High.

Validation:

- Certificate generation.
- QR verification.
- Founder access.
- Organization user denial.
- Audit visibility by role.

## UI Correction Sprint 5: Public And Auth Pages

Objective: Make the external story match the product maturity.

Pages:

- `/`
- `/about`
- `/impact`
- `/pricing`
- `/enterprise`
- `/contact`
- `/login`
- `/register`
- `/onboarding/organization`

Scope:

- Rework public pages into enterprise UAE-first narrative.
- Add route-level auth/onboarding.
- Avoid charity, donation, and generic marketplace language.

Acceptance criteria:

- Landing page communicates ReDist as circular inventory infrastructure.
- Public impact page uses conservative pilot-ready claims.
- Enterprise page speaks to multi-branch operations, audit, compliance, and reporting.
- Contact page supports pilot inquiry.
- Auth pages feel production-ready and trustworthy.
- Onboarding wizard guides organization setup without overwhelming the user.

Estimated effort: Medium to High.

Validation:

- Founder demo rehearsal.
- First-time user walkthrough.
- Mobile landing and auth review.

## Page-Level Corrections

| Page | Main correction | Priority |
| --- | --- | --- |
| Dashboard | Make action queue primary and reduce card competition | Priority 1 |
| Discover | Reframe as enterprise resource discovery | Priority 1 |
| Requests | Convert to operations queue and detail workflow | Priority 1 |
| Verification | Convert to guided compliance workflow | Priority 2 |
| Organization Profile | Make organization identity first-class | Priority 2 |
| Admin Review | Separate reviewer/admin workflow from organization workspace | Priority 2 |
| Impact | Separate organization and platform analytics | Priority 3 |
| Certificates | Tie visibly to completed transactions | Priority 3 |
| Pilot Monitoring | Move into founder/admin shell | Priority 3 |
| Public/Auth | Improve confidence before wider external demos | Priority 4 |

## What To Avoid During Correction

- Do not add new features during layout correction.
- Do not make cosmetic-only changes without workflow improvement.
- Do not make every page a grid of cards.
- Do not use marketplace language like cart, checkout, product purchase, or seller.
- Do not overuse recycling symbols.
- Do not overload the dashboard with every metric.
- Do not mix founder/admin controls into organization user navigation.

## Recommended Immediate Decision

Start with **UI Correction Sprint 1**.

Reason:

- Dashboard and Discover are the first two pages most pilot users will judge.
- They define whether ReDist feels like enterprise software or an MVP marketplace.
- Fixing the app shell now will make every later page easier to correct.

Recommended Sprint 1 deliverables:

1. Route-level app shell proposal or implementation.
2. Corrected Dashboard layout.
3. Corrected Discover layout.
4. Updated screenshots.
5. Validation report.

Recommended report:

- `docs/UI_CORRECTION_SPRINT1_REPORT.md`

## Readiness Impact

Current technical readiness remains high for controlled pilot validation.  
Current demo confidence is reduced by layout/workflow concerns.  
After UI Correction Sprint 1 and Sprint 2, the platform should be significantly easier to demo without founder explanation.

Updated recommendation:

- Do not expand outreach demos widely until Dashboard, Discover, and Requests are corrected.
- Continue simulator validation.
- Use the corrected UI as the next founder demo baseline.

