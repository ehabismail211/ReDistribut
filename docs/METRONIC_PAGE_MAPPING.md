# Metronic Page Mapping

## Repository Template Inventory

No Metronic template files are currently available in this repository.

Review performed against repository paths and text references found no `metronic`, `keenthemes`, `kt_`, `demo*`, or bundled Metronic HTML/React/Vue/Laravel assets outside generic application code. The recommendations below therefore use Metronic reference patterns that should be imported or recreated later, not existing local files.

Recommended import convention when Metronic assets are added:

```text
templates/metronic/{framework}/demo1/...
templates/metronic/{framework}/demo2/...
templates/metronic/{framework}/apps/...
```

Until those assets exist, every `Template path` below should be treated as a target reference path.

## Selection Principles

- Public pages should use Metronic landing, SaaS, pricing, and contact patterns rather than dense admin layouts.
- Workspace pages should use Metronic app shell, cards, tables, drawers, forms, timelines, and inbox patterns.
- Administration pages should use table-heavy admin, audit, analytics, and workflow review patterns.
- Mobile suitability should prioritize responsive navigation, collapsible filters, touch-friendly tables, and drawer-based workflows.
- Future mobile equivalents should map to native tabs, stack screens, bottom sheets, and push notification surfaces.

## Public Pages

| ReDist page | Template path | Why selected | Required modifications | Mobile suitability | Future mobile equivalent |
| --- | --- | --- | --- | --- | --- |
| Landing Page | `templates/metronic/html/demo1/dist/landing.html` or SaaS landing equivalent | Best fit for explaining marketplace value, discovery, trust, and impact in one public page | Replace generic SaaS hero with ReDist circular inventory positioning, UAE search panel, trust badges, category previews, and impact proof | Good if hero, cards, and search collapse cleanly | Mobile home/discover entry with search, category shortcuts, and impact snapshot |
| About | `templates/metronic/html/demo1/dist/pages/about.html` | Suitable for mission, company story, operating model, and founder narrative | Add ReDist mission, UAE pilot story, circular economy framing, and organization trust model | Good; content sections can stack | Native content screen under profile/help |
| Impact | `templates/metronic/html/demo1/dist/pages/social/overview.html` or dashboard stats page | Impact needs metric cards, charts, and story blocks | Add waste avoided, value recovered, completed handovers, NGO support, and category impact | Moderate; charts require simplified mobile views | Impact tab with KPI cards and lightweight charts |
| Pricing | `templates/metronic/html/demo1/dist/pages/pricing.html` | Metronic pricing pages support plan comparison and enterprise CTA | Add pilot/free tier, verified business, enterprise, and impact reporting packages | Good if comparison table becomes stacked plan cards | Plan selection and billing screen after monetization |
| Enterprise | `templates/metronic/html/demo1/dist/pages/corporate/about.html` or enterprise landing equivalent | Enterprise needs trust, compliance, multi-branch, and API messaging | Add multi-branch controls, integration roadmap, ESG reporting, and verification SLAs | Good with simplified CTA hierarchy | Enterprise inquiry flow in mobile, not full sales page |
| Contact | `templates/metronic/html/demo1/dist/pages/contact.html` | Fits contact form, support routes, and pilot onboarding inquiry | Add UAE launch contact, pilot application reason, organization type, and support topic | Good with single-column form | Support/contact form with attachment support |

## Authentication Pages

| ReDist page | Template path | Why selected | Required modifications | Mobile suitability | Future mobile equivalent |
| --- | --- | --- | --- | --- | --- |
| Login | `templates/metronic/html/demo1/dist/authentication/layouts/corporate/sign-in.html` | Clean business login pattern with brand and form focus | Add Supabase auth fields, forgot password, organization invite context, and Arabic-ready copy | Good; standard auth forms are mobile-friendly | Native sign-in screen |
| Registration | `templates/metronic/html/demo1/dist/authentication/layouts/corporate/sign-up.html` | Supports account creation and conversion from visitor to user | Add user profile fields, terms acceptance, email verification, and optional organization creation prompt | Good with short first step | Native sign-up and email verification flow |
| Organization Setup | `templates/metronic/html/demo1/dist/utilities/wizards/horizontal.html` | Organization setup requires multi-step data collection | Add organization details, country, emirate/city, branch, authorized contact, document checklist, and review step | Moderate; wizard must become vertical on mobile | Native onboarding stack with document upload screens |

## Workspace Pages

| ReDist page | Template path | Why selected | Required modifications | Mobile suitability | Future mobile equivalent |
| --- | --- | --- | --- | --- | --- |
| Dashboard | `templates/metronic/html/demo1/dist/index.html` | Metronic dashboard pattern fits KPIs, recent listings, requests, and alerts | Replace generic widgets with active listings, pending requests, verification state, impact summary, and quick actions | Good if widgets stack and tables become lists | Native dashboard tab |
| Discover | `templates/metronic/html/demo1/dist/apps/ecommerce/catalog/products.html` | Product catalog layout maps well to inventory listings and filters | Rename products to listings, add category/location/offer/expiry filters, saved searches, request CTA, and trust badges | Moderate; filter drawer required | Native discover tab with filters bottom sheet |
| Listing Details | `templates/metronic/html/demo1/dist/apps/ecommerce/catalog/product.html` | Product detail page supports image gallery, details, metadata, and actions | Add quantity available, owner verification, handover methods, request quantity form, audit-safe status, and report action | Good if request form moves below summary | Listing detail stack screen |
| Publish Listing | `templates/metronic/html/demo1/dist/apps/ecommerce/catalog/add-product.html` | Add product form closely matches listing creation | Replace commerce fields with ReDist category, reason, offer type, quantity, unit, expiry, photos, branch, and handover methods | Moderate; long form needs steps | Native publish flow with camera/upload |
| Requests | `templates/metronic/html/demo1/dist/apps/support-center/tickets/list.html` or order list pattern | Requests behave like operational tickets with status and owner actions | Add pending/accepted/declined/cancelled/completed tabs, requester/owner views, quantity, timeline, and accept/decline actions | Moderate; table must become cards | Requests tab with segmented status filters |
| Messages | `templates/metronic/html/demo1/dist/apps/chat/private.html` | Request-linked messaging maps to chat/inbox pattern | Scope conversations by request, add listing context, handover details, moderation/report controls | Good if conversation list and thread are stacked | Native messages tab or request thread screen |
| Notifications | `templates/metronic/html/demo1/dist/pages/profile/activity.html` or notification drawer pattern | Activity feed pattern fits workflow alerts and reminders | Add unread/read, notification preferences, entity links, and digest grouping | Good; feed is naturally mobile | Native notification center plus push |
| Organization Profile | `templates/metronic/html/demo1/dist/pages/user-profile/overview.html` | Profile overview can represent organization identity, branches, members, and badges | Replace user profile with organization legal/trade details, verification badge, branches, members, and public profile preview | Good if sections stack | Organization profile/settings stack |
| Verification | `templates/metronic/html/demo1/dist/utilities/wizards/vertical.html` | Verification is document-heavy and stateful | Add required UAE documents, upload status, review notes, expiry warnings, and category unlocks | Moderate; upload controls need mobile QA | Native verification checklist and upload screens |
| Impact Dashboard | `templates/metronic/html/demo1/dist/dashboards/logistics.html` or analytics dashboard | Impact needs charts, totals, trends, and category breakdowns | Add waste avoided, recovered value, handovers, recipients, category and branch filters | Moderate; charts need simplified mobile cards | Native impact tab for org admins |
| Settings | `templates/metronic/html/demo1/dist/account/settings.html` | Account settings pattern fits profile, security, notifications, and organization preferences | Add user profile, organization preferences, notification settings, branch defaults, privacy, and API settings later | Good; standard settings stack well | Native settings stack |

## Administration Pages

| ReDist page | Template path | Why selected | Required modifications | Mobile suitability | Future mobile equivalent |
| --- | --- | --- | --- | --- | --- |
| Moderation | `templates/metronic/html/demo1/dist/apps/support-center/tickets/list.html` | Report queues behave like support/moderation tickets | Add report reason, entity type, risk level, status, reviewer notes, and enforcement actions | Moderate; admin mobile should be read-first with limited actions | Moderator queue for urgent actions only |
| Verification Review | `templates/metronic/html/demo1/dist/apps/user-management/users/list.html` plus detail drawer | Verification review needs organization table, document status, and reviewer workflow | Add country, organization type, submitted docs, expiry, reviewer assignment, approve/needs changes/suspend actions | Limited; document review is better on desktop | Mobile review summary, defer document inspection to web |
| Categories | `templates/metronic/html/demo1/dist/apps/ecommerce/catalog/categories.html` | Category management maps to ecommerce category admin | Add restricted flag, country availability, required fields, prohibited examples, sort order, and audit trail | Moderate; editing should use drawer forms | Mobile category read/reorder only if needed |
| Audit Logs | `templates/metronic/html/demo1/dist/apps/subscriptions/list.html` or admin log table pattern | Audit logs need dense filtering, timestamps, actors, and entity links | Add actor, organization, country, entity type, action, IP/device fields if captured, and export controls | Limited; audit review is desktop-heavy | Mobile incident timeline for selected entity only |
| Platform Analytics | `templates/metronic/html/demo1/dist/dashboards/analytics.html` | Analytics dashboard supports charts, funnels, and KPI cards | Add country/org/category filters, conversion funnel, handover completion, verification SLA, disputes, and impact metrics | Moderate; executive summary works on mobile | Mobile admin analytics summary |

## Implementation Notes

- Import Metronic assets only after confirming license, framework target, and permitted customization model.
- Prefer one shell pattern for workspace and administration to avoid navigation fragmentation.
- Map ReDist design tokens before importing template styles.
- Replace all commerce language with redistribution language.
- Replace generic user profile assumptions with organization membership assumptions.
- Ensure all table-heavy pages have card/list mobile variants.
- Keep restricted actions role-gated in the application layer and backed by database policies.
