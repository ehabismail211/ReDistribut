# ReDist Foundation Blueprint

## 1. Product Vision

ReDist is the trusted circular inventory exchange for organizations that want to move excess, near-expiry, slow-moving, or underused stock before it becomes waste. The platform should make redistribution operationally simple, commercially useful, and socially measurable across businesses, charities, schools, suppliers, and approved institutions.

The long-term vision is a country-aware, multi-tenant network where organizations can publish available inventory, discover needed inventory, request controlled quantities, complete handovers, and report measurable environmental and social impact.

## 2. Mission Statement

ReDist helps organizations recover value, reduce waste, and support communities by making surplus inventory visible, verifiable, requestable, and traceable.

## 3. UAE Launch Scope

The UAE launch should focus on one reliable responsive web platform at `redistribut.com`, covering core redistribution workflows for approved organization accounts.

Launch priorities:

- English-first interface with Arabic and RTL readiness.
- UAE country configuration, emirate and city fields, and UAE business verification logic.
- Organization onboarding with trade license and authorized contact collection.
- Safe non-regulated categories first.
- Public discovery for published listings.
- Authenticated listing creation, publishing, pausing, requesting, accepting, declining, cancelling, and completion.
- Basic audit trail for sensitive workflow actions.
- Administrative review for categories, reports, organization verification, and audit visibility.

Deferred at launch:

- Medicines, prescription products, hazardous materials, controlled substances, and regulated goods without compliance workflows.
- Payments, escrow, delivery integrations, and insurance.
- Native mobile apps.
- Enterprise inventory integrations.
- AI automation beyond internal planning and future enrichment.

## 4. UAE Pilot Scope

The UAE pilot should validate the operating model with a controlled set of organization types and a limited number of categories.

Pilot boundaries:

- 20-50 verified organizations across food service, hospitality, retail, packaging, education, warehousing, NGOs, and light manufacturing.
- Dubai-first operational density, with Abu Dhabi, Sharjah, and other emirates enabled once the workflow is stable.
- Manual support for verification, dispute handling, and category approvals.
- Listing limits per organization during the first month to preserve moderation quality.
- Founder-led weekly review of completed and failed transactions.

Pilot success should be judged by completed handovers, trust quality, repeat usage, and waste/value impact rather than raw account volume.

## 5. GCC Expansion Scope (1-2 Years)

The GCC expansion should add country configuration without changing the core product model.

Target scope:

- UAE as the operating template.
- Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman as configurable country tenants.
- Country-specific organization verification rules, document names, business license authorities, and restricted categories.
- Local currency support and country-aware tax fields.
- Country-level platform admins and regional operations teams.
- Localized Arabic and English experiences.
- Country-specific impact reporting.

Expansion should begin only after the UAE workflow has proven repeatable and support operations can handle verification, moderation, and dispute review.

## 6. Global Expansion Scope

Global expansion should position ReDist as a configurable redistribution infrastructure platform.

Global capabilities:

- Multi-country tenant isolation.
- Region-specific compliance configuration.
- Multiple languages, currencies, units, and date formats.
- Enterprise account structures for multinational organizations.
- API-based inventory ingestion.
- Partner integrations for logistics, charities, ESG reporting, and procurement systems.
- Advanced trust scoring and automated risk review.

The global product should preserve one domain model while allowing country-level legal and operational differences.

## 7. User Types

- Visitor: browses public pages and public published listings.
- Registered user: owns an account and can join or create organizations.
- Organization owner: manages organization profile, members, verification, listings, and requests.
- Inventory manager: creates and manages listings for an organization.
- Requester: requests inventory and manages handover communication.
- Verifier: reviews organization documents and compliance state.
- Moderator: reviews reported listings, risky content, categories, and disputes.
- Platform admin: manages countries, organizations, categories, policies, audit access, and analytics.
- Support operator: assists users, reviews failed workflows, and documents pilot feedback.

## 8. Organization Types

- Restaurant or food service operator.
- Hotel or hospitality group.
- Retail business.
- Warehouse or logistics operator.
- Packaging supplier.
- School or university.
- NGO, charity, or community organization.
- Manufacturer.
- Distributor or wholesaler.
- Corporate office.
- Government or semi-government entity.

Each organization type may require different verification documents, listing rules, and impact assumptions.

## 9. Core Modules

- Public website: landing, about, impact, pricing, enterprise, contact.
- Authentication: login, registration, account recovery, and organization setup.
- Organization management: profile, branches, members, verification, documents, and settings.
- Listings: create, draft, publish, pause, discover, view, request, and complete.
- Requests: request inbox, owner decisions, requester status tracking, and handover completion.
- Messaging: request-linked conversations after the request is accepted or permitted by policy.
- Notifications: workflow alerts, verification alerts, moderation alerts, and saved search alerts.
- Impact: avoided waste, recovered value, completed handovers, and beneficiary outcomes.
- Administration: moderation, verification review, categories, audit logs, and platform analytics.
- API: versioned public and authenticated routes under `/api/v1`.
- Mobile future: responsive web first, native app after workflow stability.

## 10. Multi-Tenant Architecture

ReDist should operate as a multi-tenant platform where countries, organizations, branches, and users are explicit authorization boundaries.

Tenant principles:

- Country configuration controls legal, compliance, category, currency, and localization rules.
- Organizations own their operational records.
- Branches represent physical locations and inventory handover points.
- Users can belong to multiple organizations with different roles.
- Platform admins can operate across tenants according to their assigned scope.
- Country admins should be limited to their country unless explicitly granted global privileges.

## 11. Country -> Organization -> Branch -> User Hierarchy

Recommended hierarchy:

```text
Country
  Organization
    Branch
      Listings
      Handover locations
      Local inventory managers
    Users through organization membership
      Owner admin
      Inventory manager
      Requester
      Viewer
```

Operational rules:

- A country contains many organizations.
- An organization can operate in one or more countries when approved.
- An organization can have many branches.
- A branch belongs to one organization and one country.
- A user belongs to organizations through memberships, not direct ownership of all organization data.
- Listings should belong to an organization and optionally to a branch.
- Requests should reference the listing, owner organization, requester organization, and involved users.

## 12. Data Ownership Rules

- Profiles are owned by the authenticated user.
- Organizations own organization profile data, verification records, branches, listings, conversations, and request history.
- Listing owners control draft, publish, pause, edit, and request decision actions until platform rules intervene.
- Requester organizations own their request intent, messages, and completion confirmation.
- Platform records such as categories, audit events, moderation reports, and country rules are platform-owned.
- Verification documents are organization-owned but reviewable by authorized verification staff.
- Audit logs must be append-only and visible only to authorized users.
- Public listing views must expose only safe, intentional fields.
- Deleted or removed records should preserve audit history and legal evidence where required.

## 13. Permission Matrix

| Capability | Visitor | User | Org requester | Inventory manager | Org owner | Verifier | Moderator | Platform admin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| View public pages | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| View published listings | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create organization | No | Yes | Yes | Yes | Yes | No | No | Yes |
| Edit organization profile | No | No | No | No | Yes | No | No | Yes |
| Submit verification | No | No | No | No | Yes | No | No | Yes |
| Review verification | No | No | No | No | No | Yes | No | Yes |
| Create listing | No | No | No | Yes | Yes | No | No | Yes |
| Publish or pause listing | No | No | No | Yes | Yes | No | Moderator action only | Yes |
| Request listing quantity | No | No | Yes | Yes | Yes | No | No | Yes |
| Accept or decline request | No | No | No | Yes | Yes | No | No | Yes |
| Complete handover | No | No | Involved request only | Involved listing only | Yes | No | No | Yes |
| Send request messages | No | No | Involved request only | Involved request only | Involved org only | No | Review only | Yes |
| Report listing | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Moderate reported content | No | No | No | No | No | No | Yes | Yes |
| Manage categories | No | No | No | No | No | No | Recommend only | Yes |
| View audit logs | No | Own actions only | Own request only | Own org only | Own org only | Verification scope | Moderation scope | Yes |
| View platform analytics | No | No | No | No | Org analytics only | Review analytics | Moderation analytics | Yes |

## 14. Category Strategy

Launch categories should be useful, low-risk, and easy to verify.

Recommended UAE launch categories:

- Food and beverage, restricted to safe, permitted, non-regulated use cases.
- Packaging.
- Office furniture and fixtures.
- Retail inventory.
- School and office supplies.
- Warehouse materials.
- Manufacturing surplus.
- Equipment and tools, excluding regulated or dangerous items.

Category principles:

- Every category has allowed examples, prohibited examples, required fields, and verification rules.
- Restricted categories remain hidden or disabled until compliance is approved.
- Subcategories should be country-aware.
- Category changes should preserve historical listing meaning.
- Admin category management should be audited.

## 15. Trust Strategy

Trust should come from verification, transparent workflow status, auditability, and repeated successful handovers.

Trust mechanisms:

- Organization verification before sensitive actions.
- Clear listing owner identity and verification badge.
- Request quantity reservation that prevents double allocation.
- Request-linked messaging.
- Completion confirmation and dispute pathway.
- Report listing and moderation workflows.
- Organization reliability indicators based on completed transactions, cancellations, disputes, and response time.

## 16. Verification Strategy

Verification should be country-specific and risk-based.

UAE baseline documents:

- Trade license.
- Chamber membership certificate when applicable.
- VAT certificate or TRN proof when applicable.
- Authorized signatory proof.
- Authorized person Emirates ID or passport.
- Registered address proof.
- Food safety permit when handling food.
- Warehouse, storage, vehicle, charity, or NGO permits when applicable.

Verification states:

- Draft.
- Submitted.
- Pending review.
- Verified.
- Needs changes.
- Suspended.
- Expired.

Verification rules:

- High-risk categories require additional documents.
- Expired documents should downgrade category access.
- Review actions must be audited.
- Verification status should affect listing visibility and request privileges.

## 17. Impact Strategy

Impact should be practical, defensible, and tied to completed handovers.

Core impact dimensions:

- Weight or units redistributed.
- Estimated waste avoided.
- Estimated financial value recovered.
- Number of completed handovers.
- Number of recipient organizations served.
- Category-level impact.
- Location-level impact.
- NGO/community benefit where applicable.

Impact reporting should distinguish estimated values from verified values. Founder dashboards should track pilot outcomes manually at first, then automate after data quality is proven.

## 18. API Strategy

The API should remain versioned under `/api/v1`, with shared validation schemas and server-side authorization.

Principles:

- Public routes expose categories and published listing discovery only.
- Authenticated routes require Supabase access tokens.
- Mutating routes validate inputs with shared schemas.
- Workflow actions use database transactions or RPCs for inventory safety.
- API responses should use stable field names aligned with shared domain types.
- Breaking changes require a new API version.
- Native apps and enterprise integrations should reuse the same API contracts.

Current route families:

- Categories.
- Listings.
- Organizations.
- Profiles.
- Requests.
- Listing workflow actions.
- Request workflow actions.

## 19. Mobile Strategy

The first mobile strategy is responsive web. Native mobile should follow once core flows are stable.

Responsive web priorities:

- Mobile listing discovery.
- Mobile request status.
- Mobile owner decision queue.
- Mobile handover instructions.
- Mobile notifications.
- Document upload usability.

Native app future:

- Expo-based app in `apps/mobile`.
- Shared schemas through `@redist/shared`.
- Push notifications.
- Camera-based listing images and document upload.
- Location-aware handover support.
- Offline draft listing capture if operationally needed.

## 20. AI Strategy (Future)

AI should support trust, operational efficiency, and data quality without making unreviewed high-risk decisions.

Future AI uses:

- Listing title and description improvement.
- Category and subcategory suggestions.
- Risk flagging for prohibited items.
- Document completeness checks.
- Duplicate listing detection.
- Suggested recipient matches.
- Impact estimation assistance.
- Founder analytics summaries.
- Support triage.

AI guardrails:

- Human approval for verification, moderation, and enforcement.
- Clear audit trails for AI-assisted decisions.
- No automatic approval of regulated goods.
- Privacy controls for organization documents and messages.

## 21. Revenue Strategy

Revenue should align with recovered value and operational trust.

Potential models:

- Free pilot for selected UAE organizations.
- Freemium organization accounts with usage limits.
- Paid verified business accounts.
- Enterprise subscriptions for multi-branch organizations.
- Impact reporting packages.
- API access for inventory integrations.
- Sponsored logistics or partner services.
- Success fee for commercial transactions once payments and compliance are mature.

Revenue should not block charitable redistribution during the pilot.

## 22. UAE Launch KPIs

- Verified organizations onboarded.
- Listings published.
- Request conversion rate.
- Completed handovers.
- Average time from listing publish to first request.
- Average time from request to owner decision.
- Quantity redistributed.
- Estimated value recovered.
- Estimated waste avoided.
- Dispute rate.
- Cancellation rate.
- Repeat organization activity.
- Verification review turnaround time.

## 23. GCC KPIs

- Active countries launched.
- Country-specific verified organizations.
- Cross-country category readiness.
- Country admin review SLA.
- Localized content completion.
- Regional monthly completed handovers.
- Regional recovered value.
- Regional waste avoided.
- Enterprise multi-country accounts.
- Support volume by country.

## 24. Global KPIs

- Countries configured.
- Monthly active organizations.
- Completed handovers per country.
- Global redistribution volume.
- Verified impact value.
- API integration volume.
- Enterprise retention.
- Category compliance incident rate.
- Platform uptime.
- Median request decision time.
- International expansion cost per country.

## 25. Security Principles

- Least privilege by default.
- Row Level Security for all tenant data.
- Server-side authorization for every mutation.
- Private storage for sensitive documents and listing images until explicitly public.
- No service-role key in browser or mobile code.
- Append-only audit trail for sensitive actions.
- Rate limiting and abuse protection.
- Secure session handling.
- Explicit platform admin roles.
- Regular backup and restore testing.

## 26. Scalability Principles

- Country and organization boundaries should be first-class.
- Versioned APIs should support web, mobile, and integrations.
- Workflow actions should be transactional.
- Search and analytics can be separated from transactional tables as usage grows.
- Category and verification rules should be configuration-driven where possible.
- Background jobs should handle notifications, impact calculations, expiry checks, and document reminders.
- Observability should track latency, error rates, workflow failures, and queue health.

## 27. Technical Principles

- Keep domain types shared across web, API, and future mobile clients.
- Align UI enums, API schemas, and database enums.
- Prefer explicit workflow states over inferred behavior.
- Keep database policies testable.
- Keep migrations ordered, reversible where practical, and documented.
- Avoid product logic that bypasses audit events.
- Build responsive web before native mobile.
- Keep product, UI, database, and API decisions documented before major implementation phases.

## 28. Success Metrics

Near-term success:

- Pilot organizations can complete the full publish-request-accept-handover-complete flow.
- Verification and moderation can be operated manually without confusion.
- Users understand who owns an item, what is available, and what happens next.
- Inventory quantity remains accurate after requests and cancellations.

Medium-term success:

- Organizations return to list or request again.
- Handovers happen with low support intervention.
- ReDist can show credible impact metrics.
- UAE workflows can be repeated in another GCC country with configuration changes.

Long-term success:

- ReDist becomes a trusted redistribution network across sectors and countries.
- Enterprise and NGO partners rely on ReDist for circular inventory operations.
- The platform produces defensible environmental, financial, and social impact reporting.
