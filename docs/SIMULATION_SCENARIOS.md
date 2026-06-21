# ReDist Simulation Scenarios

## Purpose

These scenarios define realistic operating simulations for ReDist. They should be used to validate onboarding, listing quality, request behavior, approvals, handover coordination, completion, trust, and impact tracking.

Each scenario should be run in a test or staging environment with representative user roles and clear expected outcomes.

## 1. Restaurant

### Organization Setup

- Organization type: Restaurant.
- Country: UAE.
- Location: Dubai Marina.
- Verification documents: trade license, authorized signatory proof, food safety permit, registered address proof.
- Roles: owner admin, inventory manager, requester.

### Listings

- 120 prepared chicken meals.
- Category: food and beverage.
- Reason: near expiry.
- Offer type: free.
- Expiry: within 48 hours.
- Handover method: pickup.

### Requests

- NGO requests 80 meals.
- School requests 40 meals.
- Retail requester attempts to request 150 meals.

### Approval Flow

- Owner accepts NGO request for 80 meals.
- Owner accepts school request for remaining 40 meals.
- System rejects or prevents the 150-meal request because requested quantity exceeds availability.

### Handover Flow

- NGO schedules same-day pickup.
- School schedules next morning pickup.
- Owner provides pickup window and packaging notes.

### Completion Flow

- NGO confirms receipt.
- School confirms receipt.
- Owner marks both handovers completed if requester confirmation is missing within support policy.

### Expected Outcome

- Listing quantity reaches zero.
- Listing is completed or no longer available.
- Impact records 120 meals redistributed.
- Audit logs show request acceptance and completion events.

### Success Criteria

- No over-reservation occurs.
- Near-expiry urgency is visible.
- Food safety verification is required before listing.
- Both recipients understand pickup instructions.

## 2. Hotel

### Organization Setup

- Organization type: Hotel.
- Country: UAE.
- Location: Abu Dhabi.
- Verification documents: trade license, authorized contact, registered address proof.
- Roles: owner admin, housekeeping inventory manager.

### Listings

- 60 gently used banquet chairs.
- Category: furniture and fixtures.
- Reason: renovation surplus.
- Offer type: exchange.
- Handover method: requester delivery or pickup.

### Requests

- Event supplier requests all 60 chairs and offers storage shelving.
- School requests 20 chairs.

### Approval Flow

- Owner reviews both requests.
- Owner accepts school request for 20 because community use is prioritized.
- Owner negotiates exchange terms with event supplier for remaining 40.

### Handover Flow

- School collects 20 chairs.
- Event supplier delivers shelving and collects 40 chairs.
- Photos or handover notes are attached if supported.

### Completion Flow

- Each request is completed separately.
- Listing remains active until all accepted quantities are completed or unavailable.

### Expected Outcome

- 60 chairs redistributed.
- Exchange value is recorded qualitatively or as estimated value.
- Hotel profile shows completed handovers.

### Success Criteria

- Partial requests work correctly.
- Exchange offer type is understandable.
- Multiple handover methods are clear.

## 3. Retail

### Organization Setup

- Organization type: Retail store.
- Country: UAE.
- Location: Sharjah.
- Verification documents: trade license, VAT/TRN proof when applicable, authorized contact.
- Roles: owner admin, store inventory manager.

### Listings

- 300 phone cases for older models.
- Category: retail inventory.
- Reason: slow moving.
- Offer type: sale.
- Unit price: AED 3.
- Handover method: pickup or courier coordination.

### Requests

- Discount retailer requests 200 units.
- NGO requests 50 units for community program.
- Individual visitor attempts to request without organization account.

### Approval Flow

- System requires organization login before request.
- Owner accepts discount retailer request.
- Owner offers NGO a free allocation or discounted price outside automated payment flow.

### Handover Flow

- Discount retailer arranges courier.
- NGO collects from branch.

### Completion Flow

- Owner marks commercial request completed after courier handover.
- NGO confirms receipt.

### Expected Outcome

- Stock is reduced from 300 to 50 units.
- Sale listing remains active for remaining units.
- No payment is processed inside ReDist during launch scope.

### Success Criteria

- Sale offer type captures price and currency.
- Non-organization users cannot request.
- Remaining available quantity is accurate.

## 4. Warehouse

### Organization Setup

- Organization type: Warehouse/logistics operator.
- Country: UAE.
- Location: Jebel Ali.
- Verification documents: trade license, warehouse/storage permit, authorized contact, registered address proof.
- Roles: owner admin, warehouse manager.

### Listings

- 1,200 reusable plastic pallets.
- Category: warehouse materials.
- Reason: excess stock.
- Offer type: sale.
- Unit price: AED 12.
- Handover method: requester delivery.

### Requests

- Manufacturer requests 500 pallets.
- Packaging supplier requests 700 pallets.
- Retail business requests 100 pallets after both requests are accepted.

### Approval Flow

- Owner accepts manufacturer request.
- Owner accepts packaging supplier request.
- Retail request is prevented or waitlisted because no quantity remains.

### Handover Flow

- Requesters provide truck collection windows.
- Warehouse confirms loading dock instructions.

### Completion Flow

- Each requester confirms collection.
- Owner completes handovers after loading.

### Expected Outcome

- Listing availability reaches zero.
- Two completed requests are recorded.
- Impact includes reuse of 1,200 pallets.

### Success Criteria

- Large quantities and partial reservation work.
- Handover instructions support warehouse operations.
- Late request cannot overbook stock.

## 5. Packaging Supplier

### Organization Setup

- Organization type: Packaging supplier.
- Country: UAE.
- Location: Ajman.
- Verification documents: trade license, VAT/TRN proof, authorized contact.
- Roles: owner admin, sales/inventory manager.

### Listings

- 850 double-wall cardboard boxes.
- Category: packaging.
- Reason: excess stock.
- Offer type: sale.
- Unit price: AED 1.25.
- Handover method: pickup or courier coordination.

### Requests

- Restaurant group requests 300 boxes.
- NGO requests 200 boxes.
- Manufacturer requests 350 boxes.

### Approval Flow

- Owner accepts all three requests.
- System reserves exact quantities.
- Listing becomes unavailable after full allocation.

### Handover Flow

- Restaurant group uses courier.
- NGO picks up.
- Manufacturer schedules bulk collection.

### Completion Flow

- Each request is completed on separate dates.
- Listing remains in reserved or published state according to remaining availability rules until all handovers complete.

### Expected Outcome

- 850 boxes redistributed.
- Supplier records recovered value.
- Requesters receive clear pickup/courier instructions.

### Success Criteria

- Multi-request allocation is accurate.
- Sale value is measurable.
- Completion can happen across multiple dates.

## 6. School

### Organization Setup

- Organization type: School.
- Country: UAE.
- Location: Dubai.
- Verification documents: education institution license or trade license, authorized signatory proof, registered address proof.
- Roles: owner admin, facilities manager, requester.

### Listings

- 75 student desks.
- Category: furniture and fixtures.
- Reason: replacement cycle.
- Offer type: free.
- Handover method: pickup.

### Requests

- NGO requests 30 desks.
- Another school requests 45 desks.
- Hotel requests 20 desks after partial allocation.

### Approval Flow

- School accepts NGO request for 30.
- School accepts other school request for 45.
- Hotel request is blocked or declined because no quantity remains.

### Handover Flow

- NGO collects in two trips.
- Other school schedules transport provider.

### Completion Flow

- Owner marks each request completed after pickup confirmation.
- Impact is associated with education/community reuse.

### Expected Outcome

- 75 desks redistributed.
- School avoids disposal.
- Recipients receive usable furniture.

### Success Criteria

- Free listings attract qualified organizations.
- Pickup logistics are clear.
- Completion works for split transport.

## 7. NGO

### Organization Setup

- Organization type: NGO/charity.
- Country: UAE.
- Location: Dubai.
- Verification documents: charity/NGO approval, authorized signatory proof, registered address proof.
- Roles: owner admin, program coordinator, requester.

### Listings

- 500 hygiene kits assembled for a completed campaign.
- Category: community supplies.
- Reason: excess stock.
- Offer type: free.
- Handover method: pickup or delivery by owner.

### Requests

- School requests 200 kits.
- Community organization requests 300 kits.
- Retail company requests 100 kits.

### Approval Flow

- NGO accepts school and community organization requests.
- NGO declines retail company request because beneficiary fit is lower and stock is fully allocated.

### Handover Flow

- NGO delivers to school.
- Community organization collects remaining kits.

### Completion Flow

- Requesters confirm receipt.
- NGO completes handovers and records beneficiary notes if available.

### Expected Outcome

- 500 kits redistributed to mission-aligned recipients.
- Impact includes beneficiary-oriented notes.

### Success Criteria

- NGO verification is required.
- Owner can choose recipients based on mission fit.
- Decline reason can be recorded without exposing sensitive notes publicly.

## 8. Manufacturer

### Organization Setup

- Organization type: Manufacturer.
- Country: UAE.
- Location: Ras Al Khaimah.
- Verification documents: industrial license, trade license, authorized contact, storage permit if applicable.
- Roles: owner admin, plant inventory manager.

### Listings

- 2,000 meters of surplus fabric rolls.
- Category: manufacturing surplus.
- Reason: excess stock.
- Offer type: sale or exchange.
- Unit price: AED 4 per meter.
- Handover method: requester delivery.

### Requests

- School requests 300 meters for vocational program.
- Retail textile shop requests 1,000 meters.
- NGO requests 700 meters for community sewing program.

### Approval Flow

- Owner accepts all three requests.
- System reserves quantities.
- Owner verifies that requester transport can handle loading requirements.

### Handover Flow

- Each requester schedules collection.
- Manufacturer provides loading bay, roll dimensions, and safety instructions.

### Completion Flow

- Owner confirms release from warehouse.
- Requesters confirm received quantities.
- Any discrepancy is flagged for support review.

### Expected Outcome

- 2,000 meters of fabric redistributed.
- Manufacturer recovers value and avoids disposal.
- Recipients receive usable material for resale, education, or community programs.

### Success Criteria

- Unit-based inventory works for non-item quantities.
- Large material handover instructions are captured.
- Discrepancy handling is available or manually documented.

## Cross-Scenario Validation Checklist

- Organization verification state affects listing and request privileges.
- Restricted or high-risk category behavior is explicit.
- Quantity cannot be over-requested or over-reserved.
- Owner and requester see status-specific next actions.
- Request-linked messages are tied to the correct transaction.
- Completion records impact only after handover.
- Audit events are created for sensitive actions.
- Mobile web can complete the same core flows.
