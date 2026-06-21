# Transfer Certificate Design

Date: 2026-06-20

## Purpose

The ReDist Transfer Certificate is the official proof that a redistribution transaction was completed between verified or pilot-approved organizations. It should support enterprise reporting, audit readiness, circular economy impact evidence, and buyer/recipient confidence without making ReDist feel like a charity platform or open marketplace.

The certificate is not a payment invoice, tax document, donation receipt, customs document, or legal ownership contract. It is an operational completion record backed by ReDist workflow data, audit events, and platform verification controls.

## 1. Certificate Structure

Each certificate should be generated from a completed transaction and handover record.

Recommended certificate fields:

| Field | Description |
| --- | --- |
| Certificate ID | Stable public identifier, non-sequential where possible. |
| Certificate number | Human-readable reference, for example `RD-UAE-2026-000001`. |
| QR verification code | Encoded public verification URL or signed token. |
| Status | Draft, issued, revoked, superseded, or expired. |
| Country | Launch country, initially UAE. |
| Region/city | Handover geography. |
| Issued date | Date/time certificate was generated. |
| Completed date | Date/time handover was completed. |
| Listing reference | Listing ID, listing title, category, and quantity. |
| Request reference | Request ID and accepted quantity. |
| Transaction reference | Transaction ID once transaction entity is first-class. |
| Handover reference | Handover record ID and method. |
| Provider organization | Organization name, branch, verification level, and public identifier. |
| Recipient organization | Organization name, branch, verification level, and public identifier. |
| Resource details | Item title, category, unit, quantity, condition, expiry date when applicable. |
| Transfer type | Free, sale, exchange, or pilot exception. |
| Impact summary | AED recovered, waste prevented, estimated CO2 saved where calculation is available. |
| Verification summary | Organization verification badge states at time of transfer. |
| Audit summary | Completion event timestamp and certificate issuance timestamp. |
| Disclaimer | Plain statement of certificate scope and non-tax/non-payment status. |

Sensitive data should not appear on the public certificate unless explicitly approved:

- Personal phone numbers
- Private email addresses
- Internal notes
- Uploaded verification document URLs
- Exact storage paths
- Internal trust score factors
- Rejected or expired document details unrelated to the transfer

## 2. QR Verification Strategy

The QR code should verify authenticity without exposing tenant-private records.

Recommended QR target:

```text
https://redist.example/verify/certificates/{public_certificate_id}
```

For UAE launch, the QR target can resolve to a public validation page with a minimal read model.

Recommended QR behavior:

- QR code links to a public certificate validation page.
- The URL should use a non-sequential public ID or slug, not the internal database primary key.
- The validation page should show certificate status, key transfer facts, and issue timestamp.
- Public verification should not require login.
- Private details require authenticated organization or admin access.

Recommended anti-tamper controls:

- Store a `certificate_hash` generated from canonical certificate payload fields.
- Store a `payload_version` so future certificate formats remain verifiable.
- Store a `signed_payload` or signature metadata for future cryptographic verification.
- Do not encode all certificate data directly inside the QR code.
- Rotate signing keys through a managed secret store when production security controls are ready.

QR status outcomes:

| Outcome | Meaning |
| --- | --- |
| Valid | Certificate exists, is issued, and payload hash matches. |
| Revoked | Certificate was invalidated after issue. |
| Superseded | A corrected replacement certificate exists. |
| Expired | Certificate validation period ended, if expiry is applied. |
| Not found | Public ID does not match an issued certificate. |
| Restricted | Certificate exists but public visibility is disabled by policy. |

## 3. Certificate Lifecycle

The certificate lifecycle should be append-only and auditable.

Recommended statuses:

| Status | Description |
| --- | --- |
| `draft` | Certificate payload prepared but not issued. |
| `issued` | Certificate is active and publicly verifiable. |
| `revoked` | Certificate is no longer valid due to dispute, error, fraud, or admin decision. |
| `superseded` | Certificate has been replaced by a corrected version. |
| `expired` | Certificate is no longer treated as active after retention/validity rules. |

Recommended lifecycle:

1. Request is accepted and quantity is reserved.
2. Handover is completed by the required participant(s).
3. Transaction is marked complete.
4. Impact metrics are calculated for the completed transaction.
5. Certificate draft payload is assembled from immutable completion data.
6. Certificate is issued automatically or after admin approval, depending on category risk.
7. PDF is generated and stored.
8. QR validation page becomes available.
9. Audit event is written for issuance.
10. Certificate can later be revoked or superseded by an authorized admin action.

Issuance rules:

| Transfer Type | UAE Launch Recommendation |
| --- | --- |
| Standard free transfer | Auto-issue after completed handover. |
| Standard exchange | Auto-issue after both sides confirm completion. |
| Commercial sale | Issue only as transfer proof, not payment/tax proof. |
| Restricted category | Manual admin review before issuance. |
| Disputed transfer | Block issuance until dispute is resolved. |
| Unverified organization | Allow only if pilot exception is recorded and audited. |

Revocation reasons:

- Incorrect quantity
- Incorrect recipient/provider
- Duplicate certificate
- Fraud or policy violation
- Completed handover reversed
- Dispute upheld
- Admin correction
- Legal/compliance request

Superseding rules:

- Corrected certificate should reference the previous certificate ID.
- Previous certificate should remain auditable but public status should show `superseded`.
- Validation page should link to the replacement certificate when allowed.

## 4. PDF Layout

The PDF should look like an enterprise operations certificate, not a marketplace receipt or donation certificate.

Recommended page format:

- A4 portrait
- ReDist wordmark or compact logo
- Certificate title: `Transfer Certificate`
- Certificate number and issue date
- QR code in top-right or right-side verification block
- Clear status badge
- Structured two-column transfer summary
- Impact summary band
- Audit and verification footer

Recommended PDF sections:

1. Header
   - ReDist brand
   - Certificate title
   - Certificate number
   - Issue date
   - QR verification block

2. Transfer Summary
   - Provider organization
   - Recipient organization
   - Transaction/request/handover references
   - Country, city, and branch where applicable

3. Resource Details
   - Listing title
   - Category
   - Quantity and unit
   - Condition
   - Offer type
   - Handover method
   - Completion date

4. Impact Summary
   - AED recovered
   - Resources redistributed
   - Waste prevented
   - Estimated CO2 saved
   - Calculation methodology version

5. Verification Summary
   - Provider verification level at completion
   - Recipient verification level at completion
   - Trust badge level where approved for display

6. Audit Footer
   - Certificate ID
   - Payload version
   - Hash short reference
   - Public verification URL
   - Disclaimer

Design guidance:

- Use ReDist enterprise green as the primary accent.
- Keep white or neutral surfaces dominant.
- Use restrained badges and tables.
- Avoid charity visual language.
- Avoid overuse of recycling symbols.
- Avoid marketplace purchase language such as “buyer,” “seller,” or “order receipt.”

PDF disclaimer example:

```text
This certificate confirms that the referenced ReDist transfer workflow was completed on the platform. It is not a tax invoice, payment receipt, customs declaration, or legal title document. Impact metrics are estimates calculated using the methodology version shown above.
```

## 5. Validation Page

The validation page should provide quick public confidence while protecting tenant data.

Recommended route:

```text
/verify/certificates/{public_certificate_id}
```

Public validation page should show:

- Certificate status
- Certificate number
- Issue date
- Completion date
- Country and city
- Provider organization public name
- Recipient organization public name when public visibility is allowed
- Category and quantity
- High-level impact summary
- QR verified state
- Revocation or supersession state when applicable

Authenticated participant view can additionally show:

- Full request reference
- Full handover details
- Branch and contact instructions
- Download PDF button
- Internal transaction reference
- Audit timeline relevant to the certificate

Admin view can additionally show:

- Full audit events
- Hash/signature metadata
- Issuance actor
- Revocation actor and reason
- Superseded certificate links
- Related dispute/moderation records

Validation page states:

| State | UI Recommendation |
| --- | --- |
| Valid | Green verification badge and certificate summary. |
| Revoked | Red warning panel with revocation date and public-safe reason. |
| Superseded | Amber notice with replacement certificate link if public. |
| Expired | Neutral notice explaining historical record state. |
| Not found | Minimal error page with no record leakage. |
| Restricted | Explain that certificate visibility is restricted and login may be required. |

## 6. Audit Integration

Certificate events must be recorded in the generic audit stream and should support certificate-specific querying.

Recommended audit events:

| Event | Trigger |
| --- | --- |
| `certificate.draft_created` | Certificate payload assembled. |
| `certificate.issued` | Certificate becomes valid. |
| `certificate.pdf_generated` | PDF file generated and stored. |
| `certificate.viewed` | Authenticated certificate detail viewed. |
| `certificate.public_verified` | Public validation page accessed, if public access logging is enabled. |
| `certificate.downloaded` | PDF downloaded by participant or admin. |
| `certificate.revoked` | Admin revokes certificate. |
| `certificate.superseded` | Replacement certificate issued. |
| `certificate.visibility_changed` | Public/private validation setting changed. |

Recommended audit payload fields:

- `certificate_id`
- `public_certificate_id`
- `transaction_id`
- `handover_record_id`
- `request_id`
- `listing_id`
- `provider_organization_id`
- `recipient_organization_id`
- `actor_id`
- `status_from`
- `status_to`
- `reason`
- `payload_hash`
- `payload_version`
- `ip_address` and `user_agent` for public verification only if privacy policy allows it

Audit rules:

- Issuance, revocation, supersession, and PDF regeneration must be append-only.
- Revoking a certificate should never delete the certificate row or PDF metadata.
- Public verification access can be logged as aggregate analytics if raw logs create privacy concerns.
- Certificate issuance should occur in the same transaction as status update where possible.
- Manual admin actions must include reason notes.

## 7. Multi-Tenant Rules

Certificates are platform-issued but organization-scoped.

Ownership model:

- Platform owns certificate issuance policy and public validation.
- Provider organization owns its side of transfer evidence.
- Recipient organization owns its side of transfer evidence.
- Both participant organizations can view and download certificates for their completed transactions.
- Platform admins can view all certificates within their permission scope.
- Country admins can view certificates for their country.
- Public users can view only the approved public validation read model.

Tenant visibility rules:

| Actor | View Certificate | Download PDF | Revoke | Supersede | View Audit |
| --- | --- | --- | --- | --- | --- |
| Public visitor | Public-safe validation only | No by default | No | No | No |
| Provider org member | Own transfer certificates | Yes | No | No | Own certificate events |
| Recipient org member | Own transfer certificates | Yes | No | No | Own certificate events |
| Branch user | Branch-scoped certificates | Yes when branch-scoped role allows | No | No | Branch-scoped events |
| Verifier | Read certificate verification context | No by default | No | No | Verification-related events |
| Country admin | Country-scoped certificates | Yes | Yes | Yes | Country-scoped audit |
| Platform admin | All certificates | Yes | Yes | Yes | Full audit |

Country and expansion rules:

- Certificate numbers should include country code.
- Public validation URLs should remain globally unique.
- Certificate payload should store country, region, city, and branch IDs at time of issue.
- Future GCC expansion should allow country-specific certificate disclaimers.
- Global expansion should support localized PDF labels without changing canonical stored payload fields.

## Database Recommendations

Recommended entities:

### `transfer_certificates`

Core certificate record.

Suggested fields:

- `id`
- `public_id`
- `certificate_number`
- `status`
- `country_code`
- `provider_organization_id`
- `recipient_organization_id`
- `provider_branch_id`
- `recipient_branch_id`
- `listing_id`
- `request_id`
- `reservation_id`
- `transaction_id`
- `handover_record_id`
- `category_id`
- `quantity`
- `unit`
- `offer_type`
- `completed_at`
- `issued_at`
- `issued_by`
- `revoked_at`
- `revoked_by`
- `revocation_reason`
- `superseded_by_certificate_id`
- `payload_version`
- `payload`
- `payload_hash`
- `signature_key_id`
- `pdf_storage_path`
- `public_visibility`
- `created_at`
- `updated_at`

### `transfer_certificate_events`

Optional certificate-specific event table when generic audit queries become too broad.

Suggested fields:

- `id`
- `certificate_id`
- `event_type`
- `actor_id`
- `organization_id`
- `country_code`
- `details`
- `created_at`

### `certificate_pdf_renders`

Optional render history table if PDFs can be regenerated.

Suggested fields:

- `id`
- `certificate_id`
- `storage_path`
- `render_version`
- `payload_hash`
- `generated_by`
- `generated_at`

### Relationship Notes

- Certificate belongs to provider organization.
- Certificate belongs to recipient organization.
- Certificate belongs to listing, request, transaction, and handover record.
- Certificate may reference reservation once reservation is first-class.
- Certificate can have many audit events.
- Certificate can have many PDF render records.
- Certificate may supersede one previous certificate.

### Indexing Recommendations

- Unique index on `public_id`.
- Unique index on `certificate_number`.
- Index on `provider_organization_id, issued_at desc`.
- Index on `recipient_organization_id, issued_at desc`.
- Index on `country_code, issued_at desc`.
- Index on `transaction_id`.
- Index on `handover_record_id`.
- Partial index on revoked certificates.
- Partial index on public visible certificates.

### RLS Recommendations

- Public validation should use a restricted read model or RPC, not broad table access.
- Organization members can read certificates where their organization is provider or recipient.
- Branch users can read only branch-scoped certificates when branch scoping is active.
- Country admins can read and manage country-scoped certificates.
- Platform admins can manage all certificates.
- Insert/update should be performed through workflow RPCs, not direct client table writes.

## API Recommendations

Recommended routes:

| Route | Purpose |
| --- | --- |
| `GET /api/v1/certificates` | List authenticated participant or admin certificates. |
| `GET /api/v1/certificates/{id}` | Get authenticated certificate detail. |
| `POST /api/v1/transactions/{id}/certificate` | Issue certificate for completed transaction. |
| `GET /api/v1/certificates/{id}/download` | Download authenticated PDF. |
| `POST /api/v1/certificates/{id}/revoke` | Revoke certificate with reason. |
| `POST /api/v1/certificates/{id}/supersede` | Create corrected replacement certificate. |
| `GET /api/v1/certificates/{id}/audit` | Get scoped certificate audit events. |
| `GET /api/v1/public/certificates/{publicId}` | Public validation payload. |

Recommended RPCs:

- `issue_transfer_certificate(transaction_id, handover_record_id)`
- `revoke_transfer_certificate(certificate_id, reason)`
- `supersede_transfer_certificate(certificate_id, corrected_payload, reason)`
- `verify_transfer_certificate(public_id)`

API rules:

- Issuance endpoint must verify completed transaction status.
- Issuance endpoint must verify completed handover record.
- Issuance endpoint must verify no unresolved dispute blocks issuance.
- Duplicate issuance should be idempotent by transaction/handover ID.
- Public API must return a minimal validation payload.
- PDF download should require participant/admin access unless public download is explicitly enabled.
- Revocation and supersession must require privileged roles.
- All mutating APIs must write audit events.

## UI Recommendations

### Organization Workspace

Add certificate access in:

- Completed transaction detail
- Handover completion confirmation
- Organization impact dashboard
- Organization profile compliance area
- Notifications after certificate issuance

Recommended UI components:

- Transfer Certificate Card
- Certificate Status Badge
- Certificate QR Block
- Certificate Impact Summary
- Certificate Audit Timeline
- Certificate Download Button
- Revoked/Superseded Warning Panel

### Admin Workspace

Add admin certificate tools:

- Certificate review/search page
- Certificate detail page
- Revocation modal with required reason
- Supersede flow for corrected certificate
- Audit timeline
- Public validation preview

Admin filters:

- Status
- Country
- Organization
- Category
- Date range
- Transfer type
- Verification level
- Disputed only

### Public Validation Page

Design priorities:

- Fast confidence check
- Minimal data exposure
- Clear valid/revoked/superseded states
- Professional enterprise appearance
- Mobile-friendly QR scan flow

Recommended public page sections:

1. Certificate status
2. Transfer summary
3. Resource summary
4. Impact summary
5. Verification summary
6. Disclaimer

### Notification Recommendations

Trigger notifications for:

- Certificate issued
- PDF ready
- Certificate revoked
- Certificate superseded
- Certificate validation failed due to revoked/superseded state when participant access occurs

## UAE Launch Recommendation

For UAE launch, implement certificates after first-class reservations, transactions, and handover records are stable.

Recommended launch sequence:

1. Complete transaction and handover entity foundation.
2. Add certificate database model and issuance RPC.
3. Add PDF generation and private storage.
4. Add QR public validation page.
5. Add organization certificate access.
6. Add admin revoke/supersede controls.
7. Connect certificates to impact dashboard and audit logs.

Initial scope should include only non-restricted categories and pilot-approved organizations. Restricted categories should require manual admin approval before certificate issuance.

## Success Criteria

Transfer Certificate design is ready when:

- Every issued certificate maps to one completed transaction and handover.
- QR verification proves authenticity without exposing private tenant data.
- Participant organizations can access their own certificates.
- Platform and country admins can audit and revoke certificates.
- PDF layout supports enterprise reporting.
- Public validation page clearly communicates valid, revoked, superseded, and not-found states.
- Certificate issuance and revocation are fully audited.
- Multi-tenant data boundaries are enforced by RLS and API policy.
