# Resource Passport Design

Date: 2026-06-20

## Purpose

The ReDist Resource Passport is the long-lived, auditable identity and history record for a resource that enters the redistribution network. It connects a resource from listing creation through requests, reservations, handovers, transfer certificates, impact calculations, and future reuse cycles.

The Resource Passport should help organizations prove what moved, where it moved, who handled it, what impact was created, and what evidence exists. It should feel like enterprise asset traceability for circular inventory, not a consumer marketplace listing page or donation story.

This is a design document only. No implementation is included.

## 1. Resource Passport Concept

A Resource Passport is a structured record that describes a resource and its lifecycle across ReDist.

It answers:

- What is the resource?
- Who originally listed it?
- Which organization currently controls it?
- What category, quantity, unit, and condition does it have?
- What verification and compliance context applies?
- What transfers has it gone through?
- Which certificates prove completed transfers?
- What impact has been calculated from its reuse?
- What audit trail supports the history?

### Passport Scope

Resource Passports should initially be created at listing level, then evolve toward batch/item-level tracking as operational needs mature.

Recommended launch scope:

- One passport per listing or listing batch.
- Split passport events when partial quantities are transferred.
- Link each completed request/handover to the originating passport.

Future scope:

- One passport per physical asset.
- One passport per batch/lot for consumables.
- Parent-child passports for partial transfers or repackaging.
- Chain-of-custody passports for regulated categories when approved.

### What The Passport Is Not

The Resource Passport is not:

- A tax invoice.
- A payment receipt.
- A legal title document.
- A public guarantee of item condition.
- A replacement for verification documents or transfer certificates.

It is an operational evidence record that links ReDist workflow data.

## 2. Resource Lifecycle

Recommended lifecycle states:

| State | Description |
| --- | --- |
| `draft` | Resource details captured but not published. |
| `published` | Resource is visible for eligible discovery. |
| `requested` | One or more requests exist. |
| `reserved` | Quantity has been accepted and reserved. |
| `partially_transferred` | Some quantity completed, some remains. |
| `transferred` | Full quantity completed through handover. |
| `cancelled` | Workflow cancelled before completion. |
| `expired` | Resource no longer available due to expiry or policy. |
| `removed` | Removed by owner or platform moderation. |
| `archived` | Passport retained for audit and reporting. |

Lifecycle flow:

1. Organization creates listing.
2. Passport draft is created from listing data.
3. Listing is published.
4. Requester submits request.
5. Owner accepts request.
6. Reserved quantity is recorded.
7. Handover is completed.
8. Transfer certificate is issued.
9. Impact is calculated.
10. Passport timeline is updated.
11. Passport remains available to participant organizations and authorized admins.

Partial transfer behavior:

- If only part of the quantity transfers, the source passport remains active with reduced available quantity.
- Each completed transfer creates a passport event.
- Future child passports can represent downstream ownership or reuse cycles.

## 3. Resource ID Strategy

Resource IDs should be stable, non-sensitive, and globally unique.

### Internal IDs

Use UUID primary keys internally:

- `resource_passports.id`
- `resource_passport_events.id`

Internal IDs should not be exposed as the main public reference.

### Public Resource ID

Recommended public ID format:

```text
RP-UAE-2026-000001
```

Format components:

- `RP`: Resource Passport prefix
- `UAE`: Country code
- `2026`: Year created
- `000001`: country/year sequence

For global scale, use a separate non-sequential public slug for public validation:

```text
rp_8F4K2Q9MZP
```

### ID Rules

- Resource Passport ID should be created when the listing draft is first saved.
- ID should not change when title, description, quantity, or status changes.
- Passport should retain old category/name values in timeline events when changed.
- Public IDs should not reveal tenant database IDs.
- Child passports should reference parent passport ID.

### Relationship To Existing IDs

The passport should link to:

- Listing ID
- Category ID
- Owner organization ID
- Branch/location ID
- Request IDs
- Reservation IDs
- Transaction IDs
- Handover record IDs
- Transfer certificate IDs
- Impact snapshot IDs
- Audit event IDs

## 4. Resource History Timeline

The timeline is the most important user-facing element of the Resource Passport.

Recommended timeline events:

| Event | Trigger |
| --- | --- |
| `resource.passport_created` | Listing draft created. |
| `resource.published` | Listing published. |
| `resource.updated` | Key resource details changed. |
| `resource.requested` | Request created. |
| `resource.reserved` | Request accepted and quantity reserved. |
| `resource.handover_started` | Handover scheduled or started. |
| `resource.transferred` | Handover completed. |
| `resource.certificate_issued` | Transfer certificate issued. |
| `resource.impact_calculated` | Impact snapshot linked. |
| `resource.quantity_split` | Partial transfer creates child quantity. |
| `resource.cancelled` | Request or reservation cancelled. |
| `resource.expired` | Resource availability expired. |
| `resource.removed` | Removed by owner or moderation. |
| `resource.archived` | Passport archived for retention. |

Timeline event fields:

- Event type
- Event display label
- Actor
- Organization
- Branch/location
- Quantity affected
- Status before/after
- Related entity type
- Related entity ID
- Public/private visibility
- Timestamp
- Audit event reference

Timeline visibility:

- Public timeline should be minimal or disabled by default.
- Participant organizations can view transfer-relevant events.
- Owner organization can view full owner-side events.
- Platform admins can view full timeline.
- Public certificate verification can show only certificate-safe resource facts.

## 5. Transfer Linkage

Resource Passports should connect directly to completed transfer workflows.

Recommended linkage:

- Passport belongs to original listing.
- Requests reference passport.
- Reservations reference passport and quantity.
- Transactions reference passport.
- Handover records reference passport.
- Transfer certificate references passport.

Transfer events should update:

- Quantity available
- Quantity reserved
- Quantity transferred
- Current holder organization where applicable
- Last transfer date
- Transfer count
- Certificate count
- Impact totals

### Partial Transfers

If a listing quantity is split:

- Source passport keeps total quantity and remaining quantity.
- Each transfer event stores transferred quantity.
- Future child passport can represent transferred quantity under recipient organization.
- Certificate links to the transfer event and transferred quantity.

### Re-Listing After Receipt

Future behavior:

- Recipient organization can re-list received resources.
- New listing can create a child passport linked to original passport.
- Passport chain shows resource reuse across multiple organizations.

This should be a later phase after basic transaction, handover, and certificate models are stable.

## 6. Certificate Linkage

Transfer certificates are the formal proof layer for passport events.

Recommended linkage:

- `transfer_certificates.resource_passport_id`
- `transfer_certificates.resource_passport_event_id`
- `resource_passport_events.transfer_certificate_id`

Certificate linkage should support:

- Opening the certificate from passport timeline.
- Opening the passport from certificate detail.
- Public QR verification showing minimal resource summary.
- Admin audit view showing full passport-to-certificate relationship.

Certificate issuance event:

```text
resource.certificate_issued
```

Recommended certificate-linked timeline summary:

- Certificate number
- Transfer date
- Sender organization
- Receiver organization
- Quantity and unit
- Status: valid, revoked, superseded, expired

Revoked certificate behavior:

- Passport event remains.
- Certificate status changes to revoked.
- Timeline shows revocation event with admin-safe reason.
- Impact may require recalculation if the transfer is invalidated.

## 7. Impact Linkage

Resource Passports should make impact traceable to completed handovers, not marketing estimates.

Recommended impact fields on passport:

- Estimated value recovered
- Resources redistributed
- Waste prevented
- Estimated CO2 saved
- Transfer count
- Completed handover count
- Impact methodology version
- Last impact calculation timestamp

Impact linkage should support:

- Passport-level impact.
- Organization-level rollups.
- Platform-level rollups.
- Category and location leaderboards.
- Certificate impact summaries.

Recommended linkage:

- `impact_metric_history.resource_passport_id`
- `impact_metric_history.resource_passport_event_id`
- `resource_passports.impact_totals`

Impact timeline event:

```text
resource.impact_calculated
```

Impact recalculation rules:

- Recalculate after completed handover.
- Recalculate after certificate revocation when required.
- Recalculate if methodology version changes, but preserve prior snapshots.
- Mark impact as estimated unless independently verified.

## 8. Future AI Usage

AI should improve data quality and operational efficiency without making unreviewed high-risk decisions.

Future AI use cases:

- Auto-classify resource category and subcategory.
- Suggest standardized item names.
- Detect duplicate resource passports.
- Estimate condition from listing images.
- Suggest impact coefficients.
- Flag suspicious quantity/value patterns.
- Extract structured details from invoices, packing lists, or certificates.
- Summarize passport history for enterprise reports.
- Recommend best-fit recipient organizations.
- Detect restricted or regulated category risk.

AI guardrails:

- AI suggestions must be reviewable.
- AI should not issue certificates automatically without workflow completion.
- AI should not override verification or restricted category rules.
- AI-assisted changes should be audited.
- AI confidence and model/version should be stored for critical suggestions.
- Sensitive tenant data must not be sent to unapproved external services.

Recommended AI metadata:

- `ai_suggested_category`
- `ai_confidence`
- `ai_model_version`
- `ai_review_status`
- `ai_reviewed_by`
- `ai_reviewed_at`

## 9. Multi-Tenant Rules

Resource Passports are tenant-scoped but may involve multiple organizations after transfers.

### Ownership

Initial owner:

- Organization that creates the listing owns the source passport.

Participant access:

- Requesting/receiving organization can view transfer-related passport data after accepted request or completed transfer.

Platform access:

- Platform admins can view passports within their assigned scope.
- Country admins can view passports within their country.
- Moderators can view passport data needed for reports/disputes.

### Visibility Matrix

| Actor | View Passport | View Full Timeline | View Certificates | View Impact | Edit Passport |
| --- | --- | --- | --- | --- | --- |
| Public visitor | No by default | No | Public certificate summary only | No | No |
| Listing owner org | Yes | Owner-side full timeline | Yes | Yes | Before transfer only |
| Requesting org | Request-related summary | Request/transfer events only | Own transfer certificates | Transfer-related impact | No |
| Recipient org | Transfer-related passport | Transfer events after completion | Own transfer certificates | Transfer-related impact | Future child passport only |
| Branch user | Branch-scoped only | Branch-scoped events | Branch-scoped certificates | Branch-scoped impact | Role-dependent |
| Verifier | Compliance context only | Verification-related events | Read where needed | No by default | No |
| Moderator | Report/dispute context | Relevant events | Read where needed | No by default | No |
| Country admin | Country-scoped | Full country-scoped | Yes | Yes | Admin corrections |
| Platform admin | All | Full | Yes | Yes | Admin corrections |

### Data Exposure Rules

Public views should not expose:

- Internal notes
- Contact details
- Private handover instructions
- Uploaded documents
- Exact storage locations
- Non-public audit events
- Internal AI risk scores

Participant views can expose:

- Resource summary
- Transfer timeline
- Certificate links
- Impact summary
- Relevant handover details

Admin views can expose:

- Full audit trail
- Moderation/dispute context
- AI suggestions and review metadata
- Certificate revocation/supersession details

## 10. Enterprise Use Cases

### Circular Inventory Reporting

Organizations can show:

- Resource movement history.
- Recovered value.
- Waste prevented.
- CO2 saved.
- Completed transfer count.
- Category-level contribution.

### Audit And Compliance

Resource Passports help answer:

- Who listed the item?
- Who approved the transfer?
- When was handover completed?
- Which certificate proves it?
- What documents or verification levels applied?
- Was impact calculated from a completed workflow?

### Procurement And ESG

Enterprise users can use passports for:

- ESG reporting evidence.
- Internal circular procurement reporting.
- Supplier/resource reuse history.
- Waste diversion substantiation.
- Department or branch-level resource tracking.

### Multi-Branch Operations

Organizations can track:

- Which branch listed resources.
- Which branch completed handover.
- Which branch received resources.
- Branch-specific impact.
- Branch-level reuse patterns.

### Public Trust And Verification

Public or partner-facing views can show:

- Certificate-backed transfer proof.
- Minimal resource summary.
- Valid/invalid certificate state.
- Aggregated impact without exposing private tenant records.

## Database Recommendations

### `resource_passports`

Core passport table.

Recommended fields:

- `id`
- `public_id`
- `passport_number`
- `country_code`
- `owner_organization_id`
- `current_holder_organization_id`
- `branch_id`
- `listing_id`
- `category_id`
- `parent_passport_id`
- `title`
- `description`
- `resource_type`
- `condition`
- `quantity_total`
- `quantity_available`
- `quantity_reserved`
- `quantity_transferred`
- `unit`
- `estimated_unit_value`
- `currency`
- `expiry_date`
- `status`
- `visibility`
- `impact_totals`
- `ai_metadata`
- `created_by`
- `created_at`
- `updated_at`
- `archived_at`

### `resource_passport_events`

Append-only lifecycle timeline.

Recommended fields:

- `id`
- `resource_passport_id`
- `event_type`
- `actor_id`
- `organization_id`
- `branch_id`
- `related_entity_type`
- `related_entity_id`
- `quantity`
- `unit`
- `status_from`
- `status_to`
- `visibility`
- `details`
- `audit_event_id`
- `created_at`

### `resource_passport_links`

Optional flexible link table for future extensibility.

Recommended fields:

- `id`
- `resource_passport_id`
- `linked_entity_type`
- `linked_entity_id`
- `relationship_type`
- `created_at`

Examples:

- `listing`
- `request`
- `reservation`
- `transaction`
- `handover_record`
- `transfer_certificate`
- `impact_metric_history`
- `audit_event`

### `resource_passport_ai_suggestions`

Optional table for AI-assisted metadata.

Recommended fields:

- `id`
- `resource_passport_id`
- `suggestion_type`
- `suggested_value`
- `confidence`
- `model_name`
- `model_version`
- `status`
- `reviewed_by`
- `reviewed_at`
- `created_at`

### Indexing Recommendations

- Unique index on `public_id`.
- Unique index on `passport_number`.
- Index on `owner_organization_id, created_at desc`.
- Index on `current_holder_organization_id, updated_at desc`.
- Index on `listing_id`.
- Index on `category_id, status`.
- Index on `country_code, status`.
- Index on `parent_passport_id`.
- Index on `resource_passport_events.resource_passport_id, created_at desc`.
- Index on linked entity type/id for lookup from certificates, handovers, and impact snapshots.

### RLS Recommendations

- Owner organization can read and manage its own passports.
- Participant organizations can read passport events related to their requests/transfers.
- Current holder organization can read the received passport/child passport.
- Branch roles are scoped by branch once branch-level permissions exist.
- Platform/country admins can read according to scope.
- Mutations should happen through workflow RPCs, not direct client writes.
- Passport events should be append-only.

## API Recommendations

Recommended routes:

| Route | Purpose |
| --- | --- |
| `GET /api/v1/resource-passports` | List passports visible to authenticated user. |
| `POST /api/v1/resource-passports` | Create passport from listing draft. |
| `GET /api/v1/resource-passports/{id}` | Get passport detail. |
| `GET /api/v1/resource-passports/{id}/timeline` | Get passport event timeline. |
| `GET /api/v1/resource-passports/{id}/certificates` | List linked transfer certificates. |
| `GET /api/v1/resource-passports/{id}/impact` | Get passport-level impact summary. |
| `POST /api/v1/resource-passports/{id}/archive` | Archive passport after retention rules. |
| `POST /api/v1/resource-passports/{id}/split` | Create child passport for partial transfer. |
| `GET /api/v1/public/resource-passports/{publicId}` | Optional public-safe passport summary. |

Recommended RPCs:

- `create_resource_passport_from_listing(listing_id)`
- `record_resource_passport_event(passport_id, event_type, details)`
- `link_resource_passport_to_transfer(passport_id, transaction_id, handover_record_id)`
- `split_resource_passport(passport_id, quantity, target_organization_id)`
- `recalculate_resource_passport_impact(passport_id)`

API rules:

- Do not expose raw event payloads publicly.
- Return canonical event codes plus localized display labels.
- Use `Accept-Language` for bilingual display labels.
- Use idempotency keys for event-creating operations.
- Link certificates and impact snapshots by IDs, not duplicated copies where possible.
- Keep public passport summaries opt-in by organization/policy.

## UI Recommendations

### Passport Detail Page

Recommended sections:

1. Resource summary
2. Current status
3. Quantity and availability
4. Owner/current holder
5. Category and condition
6. Timeline
7. Linked transfers
8. Linked certificates
9. Impact summary
10. Audit/admin panel when permitted

### Timeline UI

Timeline should:

- Be chronological.
- Use event icons.
- Show quantity affected.
- Show related certificate or transfer links.
- Distinguish public, participant, and admin-only events.
- Keep canonical event codes visible in admin mode.

### Listing Integration

Listing detail should show:

- Passport number
- Passport status
- Timeline preview
- Impact estimate
- Certificate links after completion

### Certificate Integration

Certificate viewer should show:

- Resource Passport number
- Link to passport detail for authorized users
- Resource summary from passport
- Passport event that issued the certificate

### Impact Dashboard Integration

Impact dashboard should support:

- Top passports by recovered value.
- Top passports by waste prevented.
- Passport-level drilldown from category/location charts.
- Methodology version per passport impact.

### Admin UI

Admin passport tools should include:

- Passport search.
- Organization/country filters.
- Timeline inspection.
- Certificate linkage.
- Impact recalculation status.
- AI suggestion review queue.
- Moderation/dispute links.

### Public UI

Public passport views should be optional and minimal.

Recommended public fields:

- Passport valid/existing state
- Resource category
- General resource summary
- Certificate-backed transfer count
- Aggregated impact if approved

Do not expose tenant-private operational details.

## Implementation Sequence Recommendation

1. Stabilize first-class reservations, transactions, and handover records.
2. Add `resource_passports` and timeline events.
3. Auto-create passport when listing draft is created.
4. Link requests/reservations/handovers to passport.
5. Link transfer certificates to passport.
6. Link impact snapshots to passport.
7. Add organization passport detail page.
8. Add admin passport search and audit review.
9. Add optional AI suggestions.
10. Add optional public passport summaries.

## Success Criteria

Resource Passport design is ready for implementation when:

- Passport can be created from every listing.
- Passport remains stable across listing updates and transfers.
- Completed handovers create passport timeline events.
- Transfer certificates link back to passport.
- Impact snapshots link back to passport.
- Multi-tenant visibility rules are clear.
- Enterprise users can use passport history for audit and ESG reporting.
- Future AI suggestions are reviewable and auditable.
