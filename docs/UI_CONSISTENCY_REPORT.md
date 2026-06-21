# ReDist UI Consistency Report

Audit date: 2026-06-16

## Scope

Reviewed:

- Public landing page at `/`
- Workspace at `/app`
- Dashboard, Discover, Publish, Requests, Messages, Groups, Notifications, Categories, Settings, Moderation, Verification, Locations, Teams, and Audit Trail UI sections

## Design Consistency

The current UI has a coherent visual direction:

- Consistent green/mint/lime/amber palette.
- Repeated rounded panels, metric cards, tags, and form controls.
- Lucide icons are used consistently.
- Workspace sections share `PanelHeading`, `Metric`, list, form, and panel patterns.
- Empty states are present in Requests, Messages, Moderation, and Licenses.

## Inconsistencies

- Public page and workspace share global CSS, but their layout systems differ significantly.
- Some module names in the requested product map are nested rather than visible as top-level modules.
- Buttons mix action text styles: `Approve`, `Decline`, `Complete`, `Submit verification`, `Publish local listing`, `Invite locally`.
- Some production-sensitive UI copy explicitly says "local", "preview", and "before production", which is useful for MVP but must be removed or environment-gated before production.
- Role labels are user-friendly in UI but not consistent with database roles.
- Status labels differ across UI and database.
- Category capitalization differs between public sample data, local workspace data, and database seed data.

## Responsive Behavior

Tested viewports:

- Desktop: 1440 x 900
- Tablet: 768 x 1024
- Mobile browser: 390 x 844

Findings:

- No horizontal overflow was detected on `/` or `/app`.
- Public landing page collapses cleanly from multi-column to single-column.
- Workspace grids collapse to one column at smaller breakpoints.
- Forms and panels remain readable on mobile.
- Workspace nav stacks above content on tablet/mobile; on mobile it consumes most of the first screen.
- Selected workspace content often starts below the visible viewport after tapping a nav item on mobile.

## Component Reuse

Effective local reuse:

- `PanelHeading`
- `Metric`
- `AuditPanel`
- `VerificationSummary`
- `RequiredDocumentsField`
- `LicenseList`

Reuse gaps:

- Components are not extracted from the workspace file.
- Forms repeat layout and field patterns without typed form components.
- List rows/cards repeat similar structure across requests, groups, notifications, categories, licenses, and locations.

## Accessibility Observations

Positive:

- Many icon-only buttons have `aria-label`.
- Most form fields are wrapped in labels.
- Buttons use semantic `<button>` elements.

Risks:

- No automated accessibility tests are configured.
- In-page section switching has no route or focus management.
- Mobile section selection does not move focus or scroll to selected content.
- Some count badges are concatenated with nav labels in accessible text, for example `Discover2`.
- Color-coded states should be contrast-tested before production.

## Recommended UI Stabilization

1. Extract reusable UI primitives before integrating live APIs.
2. Add module-level layout wrappers for consistent headings, empty states, loading states, and error states.
3. Add mobile workspace navigation that keeps selected content immediately visible.
4. Normalize status, role, and category labels through shared formatting utilities.
5. Add accessibility checks to CI.
6. Gate MVP/local preview language by environment or remove it before launch.

