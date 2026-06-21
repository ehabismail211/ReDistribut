# API Surface

All routes are versioned under `/api/v1`.

## Public

- `GET /api/v1/categories`
- `GET /api/v1/listings`
- `GET /api/v1/listings/{id}`
- `GET /api/v1/verification-statuses`

## Authenticated

- `GET /api/v1/me`
- `PATCH /api/v1/me`
- `POST /api/v1/organizations`
- `GET /api/v1/organizations`
- `POST /api/v1/listings`
- `PATCH /api/v1/listings/{id}`
- `POST /api/v1/listings/{id}/publish`
- `POST /api/v1/listings/{id}/pause`
- `POST /api/v1/listings/{id}/requests`
- `GET /api/v1/requests`
- `POST /api/v1/requests/{id}/accept`
- `POST /api/v1/requests/{id}/decline`
- `POST /api/v1/requests/{id}/cancel`
- `POST /api/v1/requests/{id}/complete`
- `GET /api/v1/verifications`
- `POST /api/v1/verifications`
- `GET /api/v1/verifications/{id}`
- `PATCH /api/v1/verifications/{id}`
- `POST /api/v1/verifications/{id}/submit`
- `POST /api/v1/verifications/{id}/review`
- `GET /api/v1/verifications/{id}/documents`
- `POST /api/v1/verifications/{id}/documents`
- `PATCH /api/v1/verifications/{id}/documents/{documentId}`
- `GET /api/v1/trust-scores`
- `GET /api/v1/organizations/{id}/trust-score`
- `POST /api/v1/organizations/{id}/trust-score/recalculate`
- `GET /api/v1/impact`
- `POST /api/v1/impact/calculate`
- `GET /api/v1/organizations/{id}/impact`
- `GET /api/v1/certificates`
- `POST /api/v1/certificates`
- `GET /api/v1/certificates/{id}/history`
- `GET /api/v1/certificates/{id}/download`
- `GET /api/v1/public/certificates/{token}`

Authenticated calls should include a Supabase access token:

```http
Authorization: Bearer <access-token>
```

Mutating routes validate input with shared Zod schemas and rely on Supabase Row
Level Security plus workflow RPCs for authorization and inventory safety.

## Verification Foundation

Verification routes provide the backend foundation for organization verification. They do not create UI pages, forms, or admin screens.

Supported verification levels:

- `unverified`
- `basic_verified`
- `business_verified`
- `enterprise_verified`
- `ngo_verified`
- `government_verified`

Supported verification document types:

- `trade_license`
- `vat_trn`
- `food_permit`
- `storage_permit`
- `ngo_license`
- `government_authorization`
- `other`

Verification mutations create verification-specific audit events and mirror those events into the generic `audit_events` table through the database audit function.

## Trust Score

Trust score routes provide the backend foundation for organization reputation.

Supported trust levels:

- `bronze`: 0-49
- `silver`: 50-69
- `gold`: 70-84
- `platinum`: 85-100

Score factors:

- Verification level
- Completed transactions
- Response time
- Acceptance rate
- Cancellation rate
- Dispute rate
- Audit events
- Profile completeness
- Document status

Trust score recalculation writes to:

- `organization_trust_scores`
- `organization_trust_score_history`
- Existing generic `audit_events`

## Impact Dashboard

Impact routes provide the backend foundation for circularity reporting at user, organization, and platform scope.

Supported impact scopes:

- `user`
- `organization`
- `platform`

Tracked impact metrics:

- AED recovered
- Resources redistributed
- Waste prevented in kilograms
- Estimated CO2 saved in kilograms
- Completed transactions
- Active listings
- Active requests
- Top categories
- Top locations

Impact calculation and persisted snapshots write to:

- `impact_metric_history`
- Existing generic `audit_events` through `impact.snapshot.recorded`

`POST /api/v1/impact/calculate` can calculate metrics from listings and requests without persistence, or persist a snapshot when `persist` is `true`.

## Transfer Certificates

Transfer certificate routes provide auditable proof for completed redistribution transactions.

Certificate issuance requires:

- Completed transaction or completed request/handover reference
- Sender organization
- Receiver organization or public-safe receiver name
- Item, category, quantity, estimated value, transfer date, location, and handover method
- Trust snapshot
- Impact snapshot
- QR verification token

Certificate persistence writes to:

- `transfer_certificates`
- `transfer_certificate_history`
- Existing generic `audit_events`

Public certificate verification returns only:

- Valid/status state
- Certificate ID
- Sender and receiver public names
- Transfer date
- Resource summary

It does not expose private notes, uploaded verification documents, storage paths, contact details, or internal audit records.
