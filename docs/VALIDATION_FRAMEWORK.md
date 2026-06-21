# ReDist Validation Framework

## Purpose

This framework defines how ReDist should validate technical quality, business correctness, founder readiness, and pilot performance before launch and during controlled rollout.

Validation should confirm that the platform is reliable, permission-safe, trusted by users, and aligned with the circular inventory mission.

## Validation Cadence

- Daily during active development: technical validation for changed areas.
- Weekly during build phase: founder review against workflows and priorities.
- Weekly during pilot: KPI, support, trust, and transaction review.
- Before launch milestones: full technical, business, permission, responsive, and security validation.
- After production incidents: focused regression validation and founder review.

## Technical Validation

### Typecheck

Goal:

- Confirm TypeScript correctness across web and shared packages.

Recommended checks:

- Run workspace typecheck.
- Confirm shared schemas compile.
- Confirm app routes and client components have no type regressions.
- Confirm generated or inferred API types match expected domain fields.

Pass criteria:

- Typecheck completes without errors.
- No ignored type errors are introduced.
- UI, API, and shared enum values remain aligned.

### Build

Goal:

- Confirm the production app can compile and bundle.

Recommended checks:

- Run production build.
- Confirm route handlers compile.
- Confirm environment variable validation is documented.
- Confirm static public pages and app pages are build-safe.

Pass criteria:

- Production build completes.
- No server/client boundary errors.
- No secret values are bundled into client code.

### Tests

Goal:

- Validate critical domain behavior and prevent workflow regressions.

Recommended coverage:

- Shared validation schemas.
- Listing creation and update rules.
- Request quantity validation.
- Status transitions.
- Permission helpers.
- API route behavior.
- Database workflow RPCs.
- RLS policies.

Pass criteria:

- Critical workflow tests pass.
- Known gaps are documented before pilot.
- New workflow logic includes targeted tests.

### API Validation

Goal:

- Confirm `/api/v1` behaves consistently for public and authenticated clients.

Validation areas:

- Public categories and published listing discovery.
- Authenticated profile and organization routes.
- Listing create, update, publish, and pause.
- Request create, accept, decline, cancel, and complete.
- Error response consistency.
- Schema validation on all mutation routes.
- Authorization with valid, missing, expired, and wrong-organization tokens.

Pass criteria:

- Public routes expose only intended data.
- Authenticated routes reject unauthenticated calls.
- Cross-organization access is blocked.
- Workflow actions preserve quantity integrity.
- Errors are understandable and do not leak secrets.

### Permissions Validation

Goal:

- Confirm users can perform only actions allowed by role, organization membership, and workflow state.

Validation matrix:

- Visitor.
- Registered user without organization.
- Organization requester.
- Inventory manager.
- Organization owner.
- Verifier.
- Moderator.
- Platform admin.

Scenarios:

- User tries to edit another organization's listing.
- Requester tries to request own organization's listing.
- Inventory manager accepts valid request.
- Non-member tries to view private request messages.
- Moderator reviews reported listing.
- Verifier reviews documents but cannot edit unrelated organization data.
- Platform admin manages categories and audit access.

Pass criteria:

- UI hides unavailable actions.
- API blocks unauthorized actions.
- Database policies enforce the same boundary.
- Sensitive actions create audit events.

### Responsive Validation

Goal:

- Confirm core workflows work on mobile, tablet, and desktop.

Viewports:

- Mobile small.
- Mobile large.
- Tablet.
- Desktop.
- Wide desktop.

Workflows:

- Browse public landing page.
- Discover listings and use filters.
- View listing details.
- Publish listing.
- Request listing quantity.
- Accept or decline request.
- Complete handover.
- Submit verification documents.
- Review dashboard and notifications.

Pass criteria:

- No overlapping or clipped controls.
- Forms are usable with touch.
- Tables degrade into lists or cards.
- Navigation remains discoverable.
- Critical actions are reachable without horizontal scrolling.

## Business Validation

### Workflow Validation

Goal:

- Confirm ReDist's end-to-end redistribution model is understandable and operationally complete.

Core workflow:

1. Organization registers.
2. Organization submits verification.
3. Organization creates draft listing.
4. Listing is published.
5. Requester discovers listing.
6. Requester submits quantity request.
7. Owner accepts or declines.
8. Accepted quantity is reserved.
9. Owner and requester coordinate handover.
10. Handover is completed.
11. Impact is recorded.

Pass criteria:

- Each actor knows the next step.
- Status labels match business reality.
- No workflow dead ends.
- Support can understand and recover failed states.

### Transaction Validation

Goal:

- Confirm inventory quantities and request states remain accurate.

Scenarios:

- Single request for partial quantity.
- Multiple requests for the same listing.
- Request larger than available quantity.
- Accepted request cancellation.
- Owner declines request.
- Handover completion with remaining quantity.
- Listing pause while requests exist.
- Expired or removed listing.

Pass criteria:

- Quantity is never over-reserved.
- Cancellation restores quantity only when appropriate.
- Completion reflects actual fulfilled quantity.
- Audit history explains state changes.

### Trust Validation

Goal:

- Confirm users can decide whether to engage with another organization.

Validation areas:

- Verification badge clarity.
- Organization profile completeness.
- Required documents by organization type.
- Report listing action.
- Moderator workflow.
- Request-linked messaging.
- Dispute and support escalation.

Pass criteria:

- Verified and unverified states are clear.
- High-risk categories cannot bypass verification.
- Reported content can be reviewed.
- Users understand who they are transacting with.

### Impact Validation

Goal:

- Confirm impact metrics are credible and tied to completed handovers.

Validation areas:

- Quantity redistributed.
- Unit and weight assumptions.
- Estimated value recovered.
- Estimated waste avoided.
- Category-level metrics.
- Organization-level metrics.
- Pilot-level aggregate metrics.

Pass criteria:

- Impact is calculated only from completed or approved states.
- Estimated values are labeled as estimates.
- Founder can manually review outlier impact values.
- Reports can be explained to pilot participants.

## Founder Validation

### Weekly Review Process

Recommended weekly agenda:

1. Review completed handovers and failed workflows.
2. Review new organizations and verification outcomes.
3. Review published listings and category quality.
4. Review pending requests and response times.
5. Review support issues, disputes, and moderation cases.
6. Review technical errors and unresolved product risks.
7. Review impact metrics and outliers.
8. Decide next week's priorities.

Artifacts:

- Weekly founder notes.
- KPI snapshot.
- Open risk list.
- Product decision log.
- Pilot participant feedback summary.

### Approval Checklist

Founder approval should be required before:

- Pilot launch.
- Public launch.
- Adding a new restricted category.
- Adding a new country.
- Enabling payments.
- Enabling enterprise integrations.
- Enabling native mobile app rollout.

Approval checklist:

- Core workflow validated.
- Permissions validated.
- Verification rules approved.
- Category rules approved.
- Support process ready.
- Dispute process ready.
- KPI dashboard ready.
- Launch risks documented.
- Rollback or disable plan documented.

## Pilot Validation

### User Feedback Process

Feedback channels:

- Structured onboarding interview.
- Post-handover survey.
- Weekly pilot check-in.
- Support issue log.
- Founder observation notes.
- In-product feedback form when available.

Feedback topics:

- Ease of onboarding.
- Clarity of verification.
- Listing creation effort.
- Discovery relevance.
- Request and owner decision clarity.
- Handover coordination.
- Trust concerns.
- Impact reporting value.
- Missing organization types or categories.

Feedback review:

- Classify each item as bug, confusion, trust issue, workflow gap, feature request, or operational issue.
- Assign owner and priority.
- Review unresolved high-risk issues weekly.
- Convert repeated confusion into product or documentation changes.

### KPI Tracking

Pilot KPIs:

- Organizations invited.
- Organizations registered.
- Organizations verified.
- Listings created.
- Listings published.
- Requests submitted.
- Requests accepted.
- Handovers completed.
- Average request response time.
- Average time to completion.
- Quantity redistributed.
- Estimated value recovered.
- Estimated waste avoided.
- Reported listings.
- Disputes.
- Cancellations.
- Repeat usage.
- Support tickets per completed handover.

KPI interpretation:

- Low listings indicate onboarding or supply acquisition issue.
- Low requests indicate discovery, demand, pricing, or trust issue.
- Low acceptance indicates listing quality, owner response, or requester fit issue.
- Low completion indicates handover coordination or reliability issue.
- High cancellation or dispute rate indicates trust, expectation, or operational issue.

## Launch Gate

ReDist is ready for a controlled UAE pilot when:

- Technical validation has no critical blockers.
- The core workflow succeeds across desktop and mobile web.
- Permissions are enforced by UI, API, and database.
- Founder has approved categories, verification rules, and support process.
- Pilot users understand how to list, request, hand over, and complete.
- KPI tracking is ready.
- Support can manually intervene in failed transactions.
