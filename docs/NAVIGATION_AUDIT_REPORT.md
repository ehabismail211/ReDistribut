# ReDist Navigation Audit Report

Audit date: 2026-06-16

## User-Facing Routes

Current user-facing routes:

- `/` public landing page
- `/app` local MVP workspace

No duplicate pages were found.

## Public Site Navigation

The public site has header links for:

- Discover
- Workflow
- Platform
- API
- List item

Responsive behavior:

- Desktop: main navigation is visible.
- Tablet: center nav is hidden at the 980px breakpoint; API and List item remain visible.
- Mobile: API button is hidden; List item remains visible.

This is visually stable, but the mobile public site has a reduced navigation surface.

## Workspace Navigation

Workspace navigation is an in-page section switcher, not route-based navigation.

Workspace sections:

- Account
- Dashboard
- Discover
- Publish
- Categories
- Requests
- Messages
- Groups
- Notifications
- Moderation
- Settings

The requested modules Organizations, Verification, Locations, Teams, and Audit Trail are nested inside Dashboard and Settings rather than exposed as first-class navigation items. This is consistent with the current implementation, but not with the requested module list.

## Navigation Consistency Findings

- The same left-side section navigation is used across all workspace modules.
- Count badges are shown for discover, categories, requests, messages, groups, notifications, and moderation.
- Active section state is visually tracked.
- Sections are reachable by click at desktop, tablet, and mobile widths.
- Navigation state is local React state; it is not reflected in the URL, browser history, deep links, or refresh restoration.

## Responsive Navigation Findings

Tested viewports:

- Desktop: 1440 x 900
- Tablet: 768 x 1024
- Mobile browser: 390 x 844

Results:

- No horizontal overflow was detected on `/` or `/app`.
- All workspace nav items remained clickable on mobile.
- On mobile, the workspace nav stacks above content and consumes most of the first viewport. After selecting a section, the selected content often begins below the fold.
- There is no compact mobile navigation pattern such as tabs, drawer, sticky segmented control, or jump links.

## Navigation Risks

- Users cannot link directly to a workspace module.
- Browser Back does not return to the previous workspace module.
- Refresh resets the current section to Dashboard.
- First-class modules are hidden inside Settings/Dashboard, which makes audit trail, verification, team, location, and organization workflows harder to find.
- Role-based navigation is not implemented.

## Recommended Stabilization Actions

1. Add URL-addressable workspace routes or query/hash state for all major modules.
2. Promote Organizations, Verification, Locations, Teams, and Audit Trail to first-class navigation entries or clearly grouped subnavigation.
3. Add a compact mobile workspace nav pattern.
4. Centralize nav item definitions with role requirements and module metadata.
5. Add navigation tests for route access, active state, and mobile reachability.

