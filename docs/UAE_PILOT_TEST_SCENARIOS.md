# UAE Pilot Test Scenarios

Date: 2026-06-21  
Purpose: Define Wave 1 founder-guided scenarios for validating the corrected ReDist workflow end to end.

These scenarios reuse the existing simulation themes from `docs/SIMULATION_SCENARIOS.md` and the corrected workflow from UI Correction Sprint 1.

## Scenario 1: Listing Creation

### Objective

Validate that a supplier can create a clear, safe, operational surplus listing.

### Steps

1. Open Dashboard.
2. Select Create a listing.
3. Enter item/resource name.
4. Select category and subcategory.
5. Enter quantity, unit, city, location, and description.
6. Enter handover method and expiry/urgency where relevant.
7. Publish listing.
8. Confirm listing appears in Discover.

### Expected Result

- Supplier understands what information is required.
- Listing appears as an available resource.
- Quantity and location are visible.
- Urgency is visible if expiry is present.

### Pass Criteria

- Listing can be created without founder editing the data after submission.
- No restricted category is used.
- Supplier can explain handover instructions.

## Scenario 2: Resource Discovery

### Objective

Validate that a recipient can find suitable available surplus.

### Steps

1. Open Dashboard.
2. Select Discover resources.
3. Review Discovery Summary.
4. Filter by category, location, urgency, and pickup readiness.
5. Open resource detail preview.
6. Review supplier, quantity, handover location, verification/trust, and urgency.

### Expected Result

- Recipient understands what is available.
- Recipient can identify whether the resource is suitable.
- Recipient understands handover expectations.

### Pass Criteria

- Recipient can find a resource in under 5 minutes.
- Recipient can describe next action without founder prompting.

## Scenario 3: Request Workflow

### Objective

Validate request submission from resource discovery.

### Steps

1. Select a resource from Discover.
2. Enter requested quantity.
3. Add handover note.
4. Send request.
5. Open Requests.
6. Confirm request is visible in the operational queue.

### Expected Result

- Request appears in Requests.
- Supplier/recipient/resource/quantity/location are clear.
- Next step is understandable.

### Pass Criteria

- Request quantity respects available quantity.
- Request status is clear to both founder and participant.

## Scenario 4: Approval Workflow

### Objective

Validate supplier review of incoming requests.

### Steps

1. Open Requests.
2. Review Awaiting My Action.
3. Open request card details.
4. Approve a valid request.
5. Decline an invalid or unsuitable request if one is present.
6. Confirm approved request moves toward transfer.

### Expected Result

- Supplier can identify requests requiring action.
- Approval reserves or advances the request correctly.
- Decline closes unsuitable requests.

### Pass Criteria

- Supplier can make an approval decision from visible information.
- No over-reservation occurs.

## Scenario 5: Handover Workflow

### Objective

Validate active transfer management.

### Steps

1. Open Transfers.
2. Review Ready for Handover.
3. Confirm supplier, recipient, quantity, handover method, and location.
4. Confirm pickup/drop-off with participants.
5. Record any delay or mismatch in observation notes.

### Expected Result

- Accepted handovers are easy to find.
- Handover method and location are clear.
- Founder can supervise the transfer.

### Pass Criteria

- Participant can identify where and how handover should happen.
- No handover proceeds with unclear quantity or location.

## Scenario 6: Verification Workflow

### Objective

Validate transfer completion confirmation.

### Steps

1. Open Transfers.
2. Review Verification Required.
3. Confirm handover completion with supplier and recipient.
4. Select Verify transfer.
5. Confirm transfer moves to completed state.

### Expected Result

- Verification action is obvious.
- Completed transfer is separated from active work.
- Certificate generation is triggered by existing workflow behavior.

### Pass Criteria

- Founder can complete the transfer without data correction.
- Verification state is understandable.

## Scenario 7: Certificate Workflow

### Objective

Validate certificate availability after completed transfer.

### Steps

1. Complete a transfer.
2. Review completed transfer card.
3. Open Certificates if needed.
4. Review certificate number, sender, receiver, item, quantity, location, and QR verification path.
5. Confirm certificate is accurate with both parties.

### Expected Result

- Certificate is available for completed transfer.
- Certificate details match handover.
- QR verification path is understandable.

### Pass Criteria

- 100% of completed handovers generate certificates.
- No private or sensitive internal data appears in public verification.

## Scenario 8: Impact Reporting Workflow

### Objective

Validate whether participants understand redistribution outcomes.

### Steps

1. Complete at least one transfer.
2. Open Impact.
3. Review Impact Summary.
4. Review Transfer Outcomes.
5. Review Organization Contribution.
6. Review Impact Evidence and certificate references.
7. Explain pilot-based vs completed-transfer metrics.

### Expected Result

- Participants understand value recovered, items redistributed, waste diverted, and evidence.
- Founder can explain ESG/commercial reporting direction.

### Pass Criteria

- Participant can describe what value was created.
- Participant does not interpret estimates as audited ESG claims.

## Required Scenario Coverage

Wave 1 must complete at least:

- 1 urgent food/resource scenario.
- 1 non-food scenario.
- 1 bulk quantity scenario.
- 1 completed transfer with certificate.
- 1 impact review using certificate evidence.

## Failure Handling

Any scenario failure should be logged with:

- Organization.
- User role.
- Step.
- Expected behavior.
- Actual behavior.
- Severity.
- Screenshot or notes.
- Founder decision: continue, workaround, pause, or remediate.
