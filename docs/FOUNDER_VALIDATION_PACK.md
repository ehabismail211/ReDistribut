# ReDist Founder Validation Pack

## Purpose

This pack gives the founder a structured way to validate ReDist's core product workflows before UAE pilot launch. Each checklist should be completed in staging or a controlled pilot environment using realistic organizations, roles, categories, and quantities.

Each item should be marked:

- `Pass`: works as expected and evidence is captured.
- `Fail`: does not work or creates business, trust, security, or usability risk.
- `Blocked`: cannot be tested because a dependency is missing.

## 1. Registration

### Objective

Confirm that a new user can create an account, verify access, and reach the next logical step without confusion or unauthorized privileges.

### Test Steps

1. Open the registration flow as a new user.
2. Register with a valid email and password.
3. Confirm required fields are clear and validated.
4. Complete email verification if enabled.
5. Sign in with the new account.
6. Confirm the user lands on organization setup or a clear empty state.
7. Attempt to access organization-only features before creating or joining an organization.

### Expected Results

- Registration succeeds with valid details.
- Invalid or duplicate details show understandable errors.
- User profile is created.
- User cannot publish, request, or manage organization data before organization setup.
- Next step is obvious.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Valid registration succeeds |  |  |  |
| Invalid fields are blocked |  |  |  |
| Duplicate email is handled clearly |  |  |  |
| Email/session state is correct |  |  |  |
| User has no unauthorized organization access |  |  |  |
| Next step is clear |  |  |  |

### Evidence Required

- Screenshot of successful registration or post-registration state.
- Screenshot of validation error state.
- Test account email.
- Timestamp of test.
- Notes on any confusing copy or navigation.

## 2. Organization Setup

### Objective

Confirm that a registered user can create an organization with UAE launch fields and that organization ownership, membership, and profile state are correct.

### Test Steps

1. Start organization setup from a newly registered account.
2. Enter legal name, trade name, account type, country, emirate, city, address, contact details, and business category.
3. Submit the organization setup form.
4. Confirm the creator becomes organization owner/admin.
5. Confirm organization profile information is visible in workspace.
6. Attempt to create a second organization if the pilot rules allow it.
7. Attempt to access another organization's private profile or settings.

### Expected Results

- Organization setup succeeds with complete valid data.
- Required fields are enforced.
- Country defaults to UAE during launch.
- Creator receives correct owner/admin permissions.
- Organization data is isolated from other organizations.
- The next step is verification.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Required UAE fields are captured |  |  |  |
| Organization creation succeeds |  |  |  |
| Creator is assigned correct role |  |  |  |
| Organization profile displays correctly |  |  |  |
| Cross-organization access is blocked |  |  |  |
| Verification next step is clear |  |  |  |

### Evidence Required

- Screenshot of completed organization profile.
- Screenshot of organization role or membership state.
- Organization ID or test organization name.
- Notes on missing UAE-specific fields.

## 3. Verification

### Objective

Confirm that an organization can submit required verification information and that verification state controls trust and access appropriately.

### Test Steps

1. Open verification from an organization owner account.
2. Review required documents for the selected organization type.
3. Upload or simulate trade license, authorized signatory proof, registered address proof, and category-specific permits where applicable.
4. Submit verification for review.
5. Confirm status changes from draft to submitted or pending review.
6. Review the submission as a verifier or admin if available.
7. Mark verification as verified or needs changes.
8. Confirm verification badge/state updates across organization profile, listing flows, and admin review surfaces.

### Expected Results

- Required document checklist is clear.
- Missing required documents are blocked or clearly flagged.
- Submitted documents are private and not visible publicly.
- Verification status updates are understandable.
- Verified organizations receive the correct trust signal.
- Needs-changes state includes actionable reviewer notes.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Required documents are clear |  |  |  |
| Upload/submission works |  |  |  |
| Missing required documents are handled |  |  |  |
| Review status changes correctly |  |  |  |
| Verification badge is accurate |  |  |  |
| Private documents are not public |  |  |  |

### Evidence Required

- Screenshot of verification checklist.
- Screenshot of submitted or pending review state.
- Screenshot of verified or needs-changes state.
- Reviewer notes if applicable.
- Confirmation that documents are not public.

## 4. Publish Listing

### Objective

Confirm that an authorized organization user can create and publish a safe listing with correct category, quantity, offer type, location, and handover details.

### Test Steps

1. Sign in as an organization owner or inventory manager.
2. Open publish listing.
3. Create a draft listing using a UAE pilot scenario.
4. Enter title, category, reason, offer type, quantity, unit, location, expiry date if applicable, description, images if supported, and handover method.
5. Save draft.
6. Publish listing.
7. Confirm listing appears in discovery if it is public and eligible.
8. Attempt to publish with missing required fields.
9. Attempt to publish a restricted category without required verification.

### Expected Results

- Listing form captures operationally necessary information.
- Draft state is clear.
- Publish action is available only to authorized users.
- Published listing appears in discovery with correct status and quantity.
- Restricted category rules are enforced.
- Audit record exists for publish action where supported.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Authorized user can create draft |  |  |  |
| Required fields are enforced |  |  |  |
| Publish action succeeds |  |  |  |
| Listing appears in discovery |  |  |  |
| Restricted category is protected |  |  |  |
| Quantity and location are accurate |  |  |  |

### Evidence Required

- Screenshot of listing draft.
- Screenshot of published listing detail.
- Screenshot of listing in discovery.
- Listing ID or title.
- Notes on category and verification behavior.

## 5. Discover Listings

### Objective

Confirm that users can find relevant published listings by category, location, offer type, urgency, and search while seeing sufficient trust information.

### Test Steps

1. Open discovery as a visitor if public discovery is enabled.
2. Open discovery as an authenticated organization user.
3. Search by keyword.
4. Filter by category, country, city, offer type, and expiry/urgency if available.
5. Open a listing detail page.
6. Confirm organization verification state and trust badges are visible.
7. Confirm unpublished, paused, expired, removed, or private listings do not appear incorrectly.
8. Test discovery on mobile viewport.

### Expected Results

- Published listings are discoverable.
- Filters return relevant results.
- Listing details are clear enough to decide whether to request.
- Trust and verification signals are visible.
- Ineligible listings are hidden.
- Mobile discovery is usable.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Public discovery works as intended |  |  |  |
| Authenticated discovery works |  |  |  |
| Search works |  |  |  |
| Filters work |  |  |  |
| Listing detail is clear |  |  |  |
| Trust signals are visible |  |  |  |
| Mobile discovery is usable |  |  |  |

### Evidence Required

- Screenshot of search results.
- Screenshot of filtered results.
- Screenshot of listing detail.
- Mobile screenshot.
- Notes on irrelevant or missing results.

## 6. Request Item

### Objective

Confirm that an eligible requester can request a valid quantity and that the owner receives a clear, actionable request.

### Test Steps

1. Sign in as a user from a different organization than the listing owner.
2. Open a published listing.
3. Submit a request for a valid partial quantity.
4. Include a message and preferred handover method if available.
5. Confirm request status is pending.
6. Confirm owner organization receives the request.
7. Attempt to request more than available quantity.
8. Attempt to request the organization's own listing.
9. Attempt to request while unauthenticated or without an organization.

### Expected Results

- Valid request is created.
- Request quantity is validated.
- Own-organization requests are blocked.
- Unauthenticated or organization-less requests are blocked or redirected.
- Owner can see the request with requester details, quantity, message, and listing context.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Valid request succeeds |  |  |  |
| Pending status is clear |  |  |  |
| Owner receives request |  |  |  |
| Over-quantity request is blocked |  |  |  |
| Own listing request is blocked |  |  |  |
| Unauthenticated request is blocked |  |  |  |

### Evidence Required

- Screenshot of request form.
- Screenshot of pending request.
- Screenshot of owner request queue.
- Screenshot or note of blocked invalid request.
- Request ID.

## 7. Reservation

### Objective

Confirm that accepting a request reserves the correct quantity, prevents over-allocation, and updates owner/requester views consistently.

### Test Steps

1. Sign in as listing owner or authorized inventory manager.
2. Open pending request.
3. Accept request for a partial quantity.
4. Confirm listing availability decreases by accepted quantity.
5. Submit or review another request for remaining quantity.
6. Attempt to accept a request that exceeds available quantity.
7. Cancel an accepted request as requester if policy allows.
8. Confirm quantity restoration behavior is correct.

### Expected Results

- Accepting request changes status to accepted.
- Accepted quantity is reserved.
- Listing quantity available is accurate.
- Over-allocation is prevented.
- Owner and requester see consistent status.
- Cancellation restores quantity only when valid.
- Audit event exists for reservation-sensitive action where supported.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Owner can accept valid request |  |  |  |
| Quantity is reserved accurately |  |  |  |
| Over-allocation is prevented |  |  |  |
| Requester sees accepted status |  |  |  |
| Owner sees updated availability |  |  |  |
| Cancellation restoration is correct |  |  |  |

### Evidence Required

- Screenshot before acceptance showing available quantity.
- Screenshot after acceptance showing reduced quantity.
- Screenshot of accepted request status.
- Screenshot or log of blocked over-allocation attempt.
- Notes on audit event if visible.

## 8. Handover

### Objective

Confirm that owner and requester can coordinate the physical transfer with enough clarity to complete the exchange without support intervention.

### Test Steps

1. Open an accepted request as owner.
2. Confirm handover method, branch/location, pickup window, and instructions.
3. Open the same request as requester.
4. Confirm requester can see handover instructions.
5. Send or review request-linked messages if messaging is available.
6. Update handover notes or schedule if supported.
7. Test mobile view for pickup-time usability.
8. Confirm private details are visible only to involved organizations.

### Expected Results

- Both parties understand where, when, and how handover happens.
- Request-linked messaging or notes are scoped correctly.
- Mobile view is readable at pickup time.
- Uninvolved users cannot access handover details.
- Support can understand the handover state if intervention is needed.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Owner sees handover instructions |  |  |  |
| Requester sees handover instructions |  |  |  |
| Messaging/notes are scoped correctly |  |  |  |
| Mobile handover view is usable |  |  |  |
| Private details are protected |  |  |  |
| Support context is sufficient |  |  |  |

### Evidence Required

- Screenshot of owner handover view.
- Screenshot of requester handover view.
- Mobile screenshot.
- Example handover notes or message.
- Notes on privacy/access test.

## 9. Completion

### Objective

Confirm that a completed handover updates request, listing, inventory, audit, and impact states correctly.

### Test Steps

1. Open an accepted request after handover.
2. Complete the request as the authorized actor.
3. Confirm request status changes to completed.
4. Confirm listing status and remaining availability are correct.
5. Confirm completed handover is visible to both parties.
6. Confirm incomplete or wrong-actor completion is blocked.
7. Confirm completion contributes to impact metrics.
8. Confirm audit event exists where supported.

### Expected Results

- Completion is allowed only for valid accepted requests.
- Request status becomes completed.
- Listing availability and status remain accurate.
- Both parties see completion.
- Impact metrics update only after completion.
- Invalid completion attempts are blocked.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Valid completion succeeds |  |  |  |
| Request status is completed |  |  |  |
| Listing quantity/status is correct |  |  |  |
| Both parties see completion |  |  |  |
| Invalid completion is blocked |  |  |  |
| Impact updates after completion |  |  |  |

### Evidence Required

- Screenshot of accepted state before completion.
- Screenshot of completed state after completion.
- Screenshot of listing quantity/status after completion.
- Screenshot of impact metric update.
- Notes on blocked invalid completion.

## 10. Impact Dashboard

### Objective

Confirm that the impact dashboard reports credible, understandable, completion-based metrics for organizations and founders.

### Test Steps

1. Complete at least one realistic handover.
2. Open organization impact dashboard.
3. Review quantity redistributed, estimated value recovered, estimated waste avoided, completed handovers, and category breakdown.
4. Confirm estimates are labeled as estimates.
5. Compare dashboard totals with completed request data.
6. Confirm pending, cancelled, declined, or incomplete requests are excluded.
7. Open dashboard on mobile.
8. Review founder or admin aggregate impact view if available.

### Expected Results

- Impact metrics are based on completed handovers.
- Estimated values are clearly labeled.
- Totals reconcile with completed transactions.
- Incomplete workflows do not inflate impact.
- Dashboard is readable on desktop and mobile.
- Founder can identify outliers or suspicious data.

### Pass/Fail

| Item | Pass | Fail | Notes |
| --- | --- | --- | --- |
| Completed handovers are counted |  |  |  |
| Incomplete workflows are excluded |  |  |  |
| Estimates are clearly labeled |  |  |  |
| Totals reconcile with source data |  |  |  |
| Dashboard is mobile readable |  |  |  |
| Founder can review outliers |  |  |  |

### Evidence Required

- Screenshot of impact dashboard.
- Source request/listing IDs used for reconciliation.
- Manual calculation or notes validating totals.
- Screenshot showing estimates labeled clearly.
- Mobile screenshot.

## Founder Sign-Off Summary

| Workflow | Status | Critical Issues | Evidence Complete | Founder Initials | Date |
| --- | --- | --- | --- | --- | --- |
| Registration |  |  |  |  |  |
| Organization Setup |  |  |  |  |  |
| Verification |  |  |  |  |  |
| Publish Listing |  |  |  |  |  |
| Discover Listings |  |  |  |  |  |
| Request Item |  |  |  |  |  |
| Reservation |  |  |  |  |  |
| Handover |  |  |  |  |  |
| Completion |  |  |  |  |  |
| Impact Dashboard |  |  |  |  |  |

## Founder Go / No-Go Rule

Pilot should not start unless all ten workflows are marked `Pass` or have explicit founder-approved exceptions with documented operational workarounds.
