# ReDist Design System

## Purpose

The ReDist design system defines a consistent enterprise SaaS interface for a UAE-first circular inventory platform. It should support public pages, authentication, workspace modules, verification workflows, impact dashboards, and administration screens without drifting into charity campaign visuals or consumer marketplace styling.

The product should feel:

- Operational, trusted, and enterprise-grade.
- Circular economy aware without relying on obvious recycling symbols.
- UAE-first, internationally expandable.
- Calm, data-rich, and workflow-oriented.
- Suitable for businesses, institutions, NGOs, and platform administrators.

## 1. Brand Identity

### Brand Position

ReDist is a controlled circular inventory exchange for verified organizations. It is not a donation-only platform, classified ads site, or open consumer marketplace.

Core brand ideas:

- Recover value.
- Reduce waste.
- Redistribute responsibly.
- Verify organizations.
- Track measurable impact.

### Visual Personality

The visual system should communicate:

- Trust through structure, spacing, and restrained color.
- Sustainability through measured green accents and impact language.
- Enterprise readiness through dashboards, verification states, and audit-friendly components.
- UAE relevance through country-aware flows, emirate fields, Arabic readiness, and high-quality business presentation.

### Logo Usage

Existing assets:

- `public/brand/redistribut-wordmark.png`
- `public/brand/redistribut-mark.png`

Guidelines:

- Use the wordmark on public pages, authentication, and formal documents.
- Use the mark for compact navigation, favicon-style placement, and app shell collapse states.
- Keep clear space around the logo equal to at least the height of the mark.
- Do not combine the logo with recycling arrows, leaf icons, charity hands, or marketplace cart symbols.
- Avoid applying gradients or drop shadows to the logo.

### Voice and Tone

Use language that is clear, businesslike, and confident.

Preferred terms:

- Inventory, listings, requests, handover, verification, impact, recovered value, waste avoided, organization.

Avoid overusing:

- Donate, charity, marketplace, bargain, eco, green, rescue, save the planet.

## 2. Color Palette

The palette should be enterprise-first with sustainability accents. Green should signal circularity and approval, not dominate every screen.

### Core Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `brand-900` | `#102A2A` | Primary headings, app shell dark text, high-trust surfaces |
| `brand-800` | `#163B3A` | Navigation, active states, dark panels |
| `brand-700` | `#1F5C55` | Primary buttons, selected tabs, key links |
| `brand-600` | `#28756B` | Hover states, chart accents |
| `brand-500` | `#2F8F7B` | Positive circularity accent |
| `brand-100` | `#DDF3EC` | Subtle brand backgrounds |
| `brand-50` | `#F2FBF7` | Light section tint |

### Enterprise Neutrals

| Token | Hex | Usage |
| --- | --- | --- |
| `neutral-950` | `#111827` | Primary text |
| `neutral-800` | `#1F2937` | Secondary headings |
| `neutral-700` | `#374151` | Body text |
| `neutral-500` | `#6B7280` | Metadata |
| `neutral-300` | `#D1D5DB` | Borders |
| `neutral-200` | `#E5E7EB` | Dividers |
| `neutral-100` | `#F3F4F6` | App background |
| `neutral-50` | `#F9FAFB` | Card background |
| `white` | `#FFFFFF` | Primary surfaces |

### UAE-First Accent Colors

Use these sparingly for launch-market context, priority, and visual richness.

| Token | Hex | Usage |
| --- | --- | --- |
| `sand-500` | `#C6A15B` | UAE enterprise accent, premium markers |
| `sand-100` | `#F4EAD4` | Subtle enterprise highlight |
| `blue-600` | `#2563EB` | Links, informational states |
| `blue-100` | `#DBEAFE` | Informational backgrounds |

### Semantic Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `success-600` | `#168A5A` | Verified, completed, active |
| `success-100` | `#DCFCE7` | Success pill background |
| `warning-600` | `#B7791F` | Pending, near expiry, needs review |
| `warning-100` | `#FEF3C7` | Warning pill background |
| `danger-600` | `#B42318` | Declined, suspended, destructive actions |
| `danger-100` | `#FEE2E2` | Error pill background |
| `info-600` | `#2563EB` | Submitted, informational notices |
| `info-100` | `#DBEAFE` | Info pill background |

### Color Rules

- Use neutral surfaces as the default.
- Use brand green for primary actions and verified trust moments.
- Use sand as a restrained UAE/premium accent, not a full theme.
- Use semantic colors only when status meaning is needed.
- Avoid pages dominated by green, beige, or gradient backgrounds.
- Avoid recycling-symbol green as the only brand signal.

## 3. Typography

### Font Direction

Use a modern sans-serif family that supports enterprise UI density and Arabic readiness.

Recommended stack:

```css
Inter, "IBM Plex Sans Arabic", "Noto Sans Arabic", system-ui, sans-serif
```

Future Arabic UI should use a tested Arabic font with strong legibility at small sizes.

### Type Scale

| Role | Size | Weight | Usage |
| --- | --- | --- | --- |
| Display | 48-56 px | 700 | Public landing hero only |
| Page title | 30-36 px | 700 | Workspace and admin page headers |
| Section title | 22-26 px | 650 | Dashboard sections, form groups |
| Card title | 16-18 px | 650 | Cards, tables, drawer headings |
| Body | 14-16 px | 400 | Standard content |
| Metadata | 12-13 px | 500 | Labels, timestamps, secondary values |
| Button | 14-15 px | 650 | Buttons and segmented controls |
| Table header | 12-13 px | 700 | Uppercase or title case table headers |

### Typography Rules

- Use sentence case for labels and headings unless a proper noun requires title case.
- Keep letter spacing at `0`.
- Avoid oversized headings inside dense panels.
- Use clear numeric formatting for quantities, currency, and KPIs.
- Do not rely on color alone to differentiate status text.

## 4. Buttons

Buttons should feel operational and decisive. They should not look like marketplace bargain CTAs.

### Button Types

| Type | Usage | Visual Direction |
| --- | --- | --- |
| Primary | Main page action, publish, request, accept | Brand green fill, white text |
| Secondary | Navigation action, preview, save draft | White or neutral surface, neutral border |
| Tertiary | Low-emphasis inline action | Text-only or minimal background |
| Destructive | Decline, suspend, remove, cancel when risky | Danger text or fill depending severity |
| Success | Complete handover, approve verification | Success fill or success outline |
| Icon | Filter, search, more, settings, close | Square or circular neutral control with tooltip |

### Button Rules

- Primary buttons should be limited to one main action per section.
- Use verbs that describe workflow actions: `Publish listing`, `Request quantity`, `Accept request`, `Complete handover`.
- Use destructive styles only for irreversible or high-risk actions.
- Pair icons with labels for primary workflow actions.
- Icon-only buttons require accessible labels and hover/focus tooltips.
- Button height should be consistent: 40 px standard, 32 px compact, 48 px mobile primary.

## 5. Cards

Cards should organize operational information, not decorate the page.

### Card Types

- Listing card.
- Request card.
- Organization card.
- KPI card.
- Verification card.
- Notification card.
- Admin review card.

### Card Anatomy

Recommended card structure:

- Header: title, status, optional timestamp.
- Body: key facts and summary.
- Metadata row: organization, branch, category, location, quantity.
- Footer: primary action and secondary action.

### Card Rules

- Use 8 px border radius.
- Use subtle borders over heavy shadows.
- Keep surfaces white or neutral.
- Avoid nested cards.
- Avoid decorative illustrations for operational cards.
- Make cards scannable with consistent metadata placement.

## 6. Tables

Tables are essential for enterprise administration and workspace operations.

### Table Uses

- Requests.
- Listings.
- Verification review.
- Categories.
- Audit logs.
- Platform analytics drilldowns.
- Organization members.

### Table Anatomy

- Search and filters above the table.
- Bulk actions only when supported by permissions.
- Sticky or repeated key action column where appropriate.
- Status pill column.
- Owner/requester organization column.
- Last updated timestamp.
- Empty, loading, and error states.

### Table Rules

- Use compact density for admin pages and comfortable density for workspace pages.
- Support sorting for date, status, category, and organization.
- Use title case headers.
- Avoid truncating critical quantities or statuses.
- On mobile, convert tables to list cards with the same information hierarchy.
- Audit log tables should prioritize timestamp, actor, action, entity, and organization.

## 7. Forms

Forms should reduce operational mistakes and support verification-heavy workflows.

### Form Types

- Authentication forms.
- Organization setup wizard.
- Listing publish form.
- Request quantity form.
- Verification document form.
- Admin review form.
- Settings forms.

### Form Anatomy

- Clear page or drawer title.
- Short contextual description only when needed.
- Grouped sections.
- Labels above controls.
- Inline validation.
- Required field indicators.
- Persistent primary action.
- Save draft where appropriate.

### Form Rules

- Use one column by default; two columns only for short related fields on desktop.
- Keep long workflows in wizards or grouped sections.
- Use select controls for country, emirate, organization type, category, and status.
- Use date pickers for expiry dates and document validity.
- Use file upload components for verification documents and listing images.
- Never hide compliance-critical fields behind optional accordions.
- Confirm before abandoning unsaved long forms.

## 8. KPI Cards

KPI cards should make operational health and impact visible without exaggeration.

### KPI Types

- Active listings.
- Pending requests.
- Completed handovers.
- Quantity redistributed.
- Estimated waste avoided.
- Estimated value recovered.
- Verification review SLA.
- Dispute rate.
- Cancellation rate.
- Response time.

### KPI Anatomy

- Label.
- Primary value.
- Unit.
- Change indicator.
- Time period.
- Optional sparkline or mini bar.
- Source or estimate label where needed.

### KPI Rules

- Distinguish actual values from estimated values.
- Use neutral KPI cards for operational metrics.
- Use impact accent only for completed or verified impact.
- Avoid vanity metrics on founder and admin dashboards.
- Use consistent number formatting: `AED 318k`, `41 t`, `12.4%`, `2h 15m`.

## 9. Trust Badges

Trust badges show credibility signals about organizations, listings, and workflows.

### Badge Types

- Verified organization.
- Trade license submitted.
- Category approved.
- Handover completed.
- High completion rate.
- Fast responder.
- Pilot participant.
- Enterprise account.

### Trust Badge Rules

- Use badges only when backed by data or platform review.
- Keep labels short and specific.
- Avoid generic feel-good badges.
- Do not use badges as decoration.
- Use tooltips or details panels to explain what each trust badge means.
- Never imply regulatory approval unless ReDist has actually verified that approval.

## 10. Verification Badges

Verification badges are stricter than trust badges and must map to workflow states.

### Verification States

| State | Visual Style | Meaning |
| --- | --- | --- |
| Draft | Neutral outline | Organization has not submitted verification |
| Submitted | Info outline | Verification has been submitted |
| Pending review | Warning outline | Awaiting platform review |
| Verified | Success fill or success outline | Organization passed required checks |
| Needs changes | Warning fill or outline | Reviewer requested corrections |
| Expired | Danger outline | Required document expired |
| Suspended | Danger fill | Organization access is restricted |

### Verification Badge Rules

- Place organization verification near organization name.
- Place category-specific verification near restricted category actions.
- Use date-aware warnings for expiring documents.
- Show reviewer notes in verification detail views, not in public surfaces.
- Use audit logs for all verification state changes.

## 11. Status Pills

Status pills should make workflow state easy to scan across cards, tables, and details.

### Listing Statuses

| Status | Style |
| --- | --- |
| Draft | Neutral |
| Published | Success |
| Paused | Warning |
| Reserved | Info |
| Completed | Success solid |
| Expired | Warning |
| Removed | Danger |

### Request Statuses

| Status | Style |
| --- | --- |
| Pending | Warning |
| Accepted | Info |
| Declined | Danger |
| Cancelled | Neutral |
| Completed | Success |

### Moderation Statuses

| Status | Style |
| --- | --- |
| Open | Warning |
| Reviewing | Info |
| Resolved | Success |
| Escalated | Danger |

### Status Pill Rules

- Use consistent labels across UI, API, and database documentation.
- Pair color with text.
- Use compact pill height in tables and larger pills in detail headers.
- Avoid using the same color for different risk meanings in the same view.

## 12. Notification Styles

Notifications should help users act, not overwhelm them.

### Notification Types

- Request received.
- Request accepted.
- Request declined.
- Handover due.
- Handover completed.
- Verification submitted.
- Verification needs changes.
- Document expiring.
- Listing expiring soon.
- Report reviewed.
- Saved search match.

### Notification Anatomy

- Icon.
- Short title.
- Body with entity reference.
- Timestamp.
- Read/unread state.
- Action link.
- Severity or category marker.

### Notification Rules

- Use unread indicators sparingly and clearly.
- Group repeated notifications by listing or request.
- Use warning styling for time-sensitive items.
- Use danger styling only for risk, suspension, failed verification, or urgent moderation.
- Mobile notifications should deep link to the exact request, listing, or verification screen.

## 13. Dashboard Layouts

Dashboard layouts should follow the Metronic mapping direction: app shell, KPI cards, tables, drawers, timelines, and analytics widgets.

### Workspace Dashboard

Recommended structure:

- Header with organization switcher, verification status, and primary action.
- KPI row: active listings, pending requests, completed handovers, impact estimate.
- Action queue: requests requiring decision, verification tasks, expiring listings.
- Recent activity timeline.
- Listings or requests table.

### Discover Layout

Recommended structure:

- Search and filters.
- Category chips.
- Listing results.
- Saved search control.
- Map or location filter only when operationally useful.
- Filter drawer on mobile.

### Listing Detail Layout

Recommended structure:

- Listing title, status, organization, and trust badges.
- Quantity and availability summary.
- Category, reason, offer type, expiry, location, handover methods.
- Request panel.
- Owner details and report action.
- Related audit-safe timeline for involved users.

### Admin Dashboard

Recommended structure:

- Country and date filters.
- Platform KPI row.
- Verification review queue.
- Moderation queue.
- Category and listing health.
- Impact analytics.
- Audit and incident trends.

### Layout Rules

- Keep the app shell consistent between workspace and administration.
- Use drawers for filters, review details, and secondary workflows.
- Use modals only for focused confirmations.
- Do not make dense admin pages look like public marketing pages.
- Keep dashboards scannable before requiring chart interpretation.

## 14. Mobile Design Principles

Mobile should support real operational use: checking requests, responding, uploading documents, and completing handovers.

### Navigation

- Use bottom tabs for native mobile future: Dashboard, Discover, Requests, Messages, Account.
- Use a compact mobile workspace switcher on responsive web.
- Keep selected content visible after changing workspace sections.
- Avoid long top navigation stacks that push content below the first viewport.

### Mobile Components

- Convert tables to list cards.
- Use bottom sheets for filters and quick actions.
- Use stack screens for details and forms.
- Use sticky bottom actions for request, accept, complete, and submit flows.
- Use large touch targets of at least 44 x 44 px.
- Keep file upload and camera flows simple.

### Mobile Workflow Rules

- Listing discovery must work with one-handed filtering.
- Request status must be visible without opening multiple screens.
- Handover instructions must be readable at pickup time.
- Verification upload must handle mobile documents and photos.
- Admin mobile should support urgent review, not full desktop replacement.

## 15. Accessibility Standards

ReDist should target WCAG 2.2 AA for public, workspace, and administration surfaces.

### Standards

- Minimum text contrast: 4.5:1.
- Minimum large text contrast: 3:1.
- Visible focus state for every interactive element.
- Keyboard support for navigation, forms, drawers, modals, menus, and tables.
- Semantic headings in logical order.
- Form labels associated with controls.
- Error messages tied to invalid fields.
- Icon-only controls with accessible labels.
- Status information conveyed by text, not color alone.
- Motion should be limited and respect reduced-motion preferences.

### Accessibility Rules

- Manage focus after route changes, section changes, drawer open/close, and modal open/close.
- Do not concatenate badge counts into navigation labels in a way that harms screen reader output.
- Provide accessible names for organization switchers, filters, and table actions.
- Ensure file upload controls are keyboard accessible.
- Provide alt text for listing images when images communicate item condition.
- Support Arabic and RTL layouts without breaking reading order.

## Design Governance

Before implementing major UI changes:

- Confirm the page's Metronic pattern from `docs/METRONIC_PAGE_MAPPING.md`.
- Confirm the component category in this design system.
- Use existing ReDist terminology.
- Verify role, status, and category labels against product documentation.
- Check desktop and mobile layouts.
- Check color contrast and focus states.

This design system should be updated before large UI implementation begins, after Metronic assets are imported, and after the UAE pilot reveals workflow-specific usability issues.
