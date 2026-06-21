# ReDist Trust & Verification Design

## Purpose

This document defines the future trust and verification model for ReDist. It is a design artifact only: no database migrations, API routes, UI components, or product behavior are implemented by this document.

The goal is to make ReDist feel like a controlled enterprise circular inventory platform, not a charity site or open marketplace. Trust should come from verified organizations, clear category rules, auditable workflows, and reliable handover history.

## Design Principles

- Verify organizations before giving them sensitive capabilities.
- Make trust visible without exaggerating certainty.
- Keep verification country-specific and risk-based.
- Separate organization verification from category eligibility.
- Keep all verification documents private.
- Audit every sensitive verification and trust decision.
- Use manual review during the UAE pilot, then automate only after patterns are proven.
- Avoid consumer-style ratings as the primary trust signal.

## 1. Verification Levels

Verification levels should represent operational readiness, not social popularity.

| Level | Label | Meaning | Typical capabilities |
| --- | --- | --- | --- |
| Level 0 | Unverified | User or organization profile exists but required organization checks are incomplete. | Browse public listings, start organization setup, save drafts. |
| Level 1 | Profile verified | Basic organization identity, contact, address, and authorized person are reviewed. | Publish low-risk non-restricted listings, request low-risk items, appear with basic badge. |
| Level 2 | Business verified | Trade license and required business documents are approved and current. | Standard UAE pilot participation, normal request/listing workflows, verified badge. |
| Level 3 | Category verified | Organization has extra approvals for specific restricted or higher-risk categories. | Publish or request approved restricted categories within policy limits. |
| Level 4 | Enterprise trusted | Organization has strong history, current documents, low dispute rate, and high completion reliability. | Higher limits, enterprise trust badge, potential priority review. |
| Suspended | Suspended | Verification is revoked due to expired documents, unresolved disputes, policy breach, or admin action. | Restricted from publishing, requesting, or completing sensitive workflows depending on reason. |

### Level Rules

- Levels are organization-scoped, not user-scoped.
- A user may belong to multiple organizations with different verification levels.
- Category verification is additive and should not automatically unlock all restricted categories.
- Suspended state overrides all positive levels.
- Expired critical documents should downgrade or suspend the affected capability.

## 2. Trust Score Model

The trust score should summarize operational reliability. It should support internal risk review and user-facing confidence, but it should not be presented as a marketplace rating.

Recommended scale:

- 0-100 internal score.
- Public display as bands rather than raw precision during pilot.
- Raw score can appear in admin tools and organization owner dashboards.

### Trust Bands

| Band | Score range | Public label | Meaning |
| --- | --- | --- | --- |
| New | 0-39 | New organization | Not enough verified activity yet. |
| Developing | 40-59 | Building history | Some successful activity, still limited history. |
| Reliable | 60-79 | Reliable participant | Good verification and completion behavior. |
| Trusted | 80-89 | Trusted organization | Strong reliability and low issue rate. |
| Enterprise trusted | 90-100 | Enterprise trusted | High confidence across verification, handovers, and operations. |

### Suggested Score Inputs

| Input | Suggested weight | Notes |
| --- | --- | --- |
| Verification completeness | 25% | Required profile, business documents, category documents, and current status. |
| Document freshness | 10% | Penalize expired or near-expiry required documents. |
| Completed handovers | 20% | Reward completed, confirmed, non-disputed handovers. |
| Cancellation and no-show rate | 15% | Penalize accepted requests that fail after commitment. |
| Disputes and moderation actions | 15% | Strong negative weight for unresolved or repeated issues. |
| Response time | 5% | Measures operational responsiveness to requests/review actions. |
| Listing quality | 5% | Complete descriptions, accurate quantities, photos, and handover details. |
| Account tenure and consistency | 5% | Stable, compliant participation over time. |

### Score Rules

- Do not calculate a high trust score from profile data alone.
- Do not let payment, paid plan, or enterprise contract override operational trust.
- Keep negative events time-weighted but never invisible to admins.
- Show “not enough history” when transaction volume is low.
- Recalculate on verification decisions, completed handovers, cancellations, disputes, expired documents, and moderation outcomes.

## 3. Verification Workflow

The verification workflow should be a controlled organization-level process.

Recommended states:

| State | Meaning |
| --- | --- |
| Draft | Organization profile is incomplete or not submitted. |
| Submitted | Owner submitted verification package. |
| Pending review | Package is in admin review queue. |
| Needs changes | Reviewer requires corrections or additional documents. |
| Verified | Required documents and profile are approved. |
| Partially verified | Organization is approved for limited capabilities or categories. |
| Expiring soon | One or more critical documents are close to expiry. |
| Expired | Critical document has expired and capabilities may be reduced. |
| Suspended | Verification is paused or revoked by admin action. |
| Rejected | Submission failed and cannot proceed without major correction. |

### Organization Flow

1. Organization owner completes profile: legal name, trade name, account type, business category, address, authorized representative, contact details.
2. System shows required documents based on country, organization type, and intended categories.
3. Owner uploads documents and confirms accuracy.
4. Owner submits package for review.
5. System locks submitted document versions for review while allowing draft replacement requests.
6. Reviewer approves, rejects, or requests changes.
7. Organization receives notification with status and next steps.
8. Approved verification level unlocks eligible platform actions.

### Capability Gates

| Capability | Minimum recommended status |
| --- | --- |
| Browse public listings | No verification required |
| Save searches/listings | Registered user |
| Create organization | Registered user with verified email |
| Publish low-risk draft listing | Organization member with listing permission |
| Publish low-risk live listing | Level 1 or Level 2 depending country policy |
| Request low-risk listing | Level 1 or organization policy approval |
| Accept requests | Level 1 or Level 2 |
| Complete handover | Involved verified organization or approved pilot exception |
| Use restricted category | Level 3 category-specific approval |
| Access admin verification review | Verifier or platform admin permission |

## 4. Admin Review Workflow

Admin review should be queue-based, auditable, and permission-scoped.

### Reviewer Roles

| Role | Scope |
| --- | --- |
| Verifier | Reviews organization documents and verification submissions. |
| Senior verifier | Handles escalations, suspensions, and high-risk approvals. |
| Country admin | Reviews country-specific policies and escalated organizations. |
| Platform admin | Full review and override capability. |
| Support operator | Can view review state and support notes but cannot approve. |

### Review Queue Fields

- Organization name and legal name.
- Country, emirate/region, city.
- Account type and organization type.
- Submitted date and SLA age.
- Requested verification level.
- Intended categories.
- Missing or expired documents.
- Risk flags.
- Assigned reviewer.
- Current status.

### Review Actions

| Action | Result |
| --- | --- |
| Assign reviewer | Locks accountability without blocking reassignment. |
| Approve profile | Confirms organization identity fields. |
| Approve document | Confirms one document version. |
| Request changes | Returns package to organization with notes. |
| Reject document | Marks document invalid with reason. |
| Approve category eligibility | Unlocks category-specific capability. |
| Suspend verification | Removes or limits capabilities pending investigation. |
| Reinstate verification | Restores approved capability after issue resolution. |
| Escalate | Sends record to senior verifier or country/platform admin. |

### Review SLA Targets

| Review type | UAE pilot target |
| --- | --- |
| Basic profile review | 1 business day |
| Trade license review | 2 business days |
| Food-related category review | 2-3 business days |
| NGO/charity review | 2-3 business days |
| Restricted category escalation | Manual SLA, case by case |
| Expired document renewal | 1 business day after resubmission |

## 5. Verification Badges

Badges should be precise and conservative. They should communicate what was verified, not imply a general guarantee.

| Badge | Display label | Usage |
| --- | --- | --- |
| `profile_verified` | Profile verified | Basic organization identity and contact reviewed. |
| `business_verified` | Business verified | Trade license/business documents approved. |
| `category_verified` | Category verified | Approved for a specific category. |
| `food_handling_verified` | Food handling verified | Food safety permit or equivalent approved. |
| `ngo_verified` | NGO verified | Charity/NGO approval reviewed. |
| `enterprise_trusted` | Enterprise trusted | Strong trust score and current verification. |
| `expiring_soon` | Verification expiring soon | Documents need renewal soon. |
| `suspended` | Suspended | Capabilities are restricted. |

### Badge Placement

- Organization profile header.
- Listing cards and listing details.
- Request detail owner/requester summary.
- Verification dashboard.
- Admin review queue.
- Public organization profile projection.

### Badge Rules

- Do not show document names or private details publicly.
- Category badges should show category context, such as “Food handling verified”.
- Suspended and expired states must override positive badges in action areas.
- Internal admin screens may show more detailed verification metadata than public screens.

## 6. Document Types

Document requirements should be country-configurable. UAE launch should start with a defined baseline.

### UAE Baseline Documents

| Document | Required for | Expiry required | Notes |
| --- | --- | --- | --- |
| Trade license | Companies, suppliers, manufacturers, hospitality, retail | Yes | Core business verification document. |
| Authorized signatory proof | Organizations with delegated representatives | Optional or case-based | Confirms submitter authority. |
| Emirates ID or passport of authorized person | Authorized representative verification | Yes or manual review | Store privately with strict access. |
| Registered address proof | Most organizations | Optional | Utility bill, tenancy, license address, or official record. |
| VAT certificate or TRN proof | VAT-registered organizations | Optional | Required when tax-related business metadata matters. |
| Chamber membership certificate | Applicable organizations | Yes when provided | Country/industry dependent. |
| Food safety permit | Food and beverage handling | Yes | Required before food-related restricted actions. |
| Warehouse/storage permit | Warehouses, logistics, controlled storage | Yes when applicable | Required for storage-sensitive goods. |
| Vehicle/cold-chain permit | Delivery or temperature-sensitive handover | Yes when applicable | Future phase if logistics controls are added. |
| Charity/NGO approval | NGOs and charities | Yes | Required before NGO-specific trust badge. |
| Industrial license | Manufacturers | Yes | Required for manufacturing-specific account type. |
| Insurance certificate | Enterprise or higher-risk operations | Yes when applicable | Future optional trust input. |

### Document Metadata

Each document record should capture:

- Organization ID.
- Country ID.
- Document type.
- Document number when applicable.
- Issuing authority.
- Issue date.
- Expiry date.
- File storage path.
- Version.
- Status.
- Submitted by.
- Reviewed by.
- Review notes.
- Rejection reason.
- Created, submitted, reviewed, and updated timestamps.

## 7. Expiry Rules

Expiry rules should prevent stale verification from silently preserving trust.

| Rule | Recommended behavior |
| --- | --- |
| 60 days before expiry | Notify organization owner and show renewal notice. |
| 30 days before expiry | Show warning badge and include in admin renewal queue. |
| 7 days before expiry | Escalate reminder and mark document as urgent. |
| On expiry | Mark document expired and recalculate capabilities. |
| Critical document expired | Downgrade verification or suspend affected capabilities. |
| Category document expired | Remove that category eligibility until renewed. |
| Renewal submitted | Keep current capability only if policy allows grace period. |
| Renewal approved | Restore capability and audit decision. |

### Grace Period Policy

During the UAE pilot, grace periods should be manual and conservative:

- No automatic grace period for restricted categories.
- Up to 7 days manual grace for low-risk profile/business documents if the renewal is submitted before expiry.
- No grace period when a document is rejected, suspicious, or tied to a moderation issue.

## 8. Restricted Category Rules

Restricted category rules should combine category policy, organization verification, document requirements, and admin approval.

### Category Risk Tiers

| Tier | Meaning | Examples | Default behavior |
| --- | --- | --- | --- |
| Open | Low-risk non-regulated inventory | Office supplies, packaging, furniture | Allowed for verified organizations. |
| Controlled | Needs extra fields or category-specific checks | Food, storage-sensitive goods, high-value equipment | Requires category eligibility. |
| Restricted | Requires formal compliance workflow | Medicines, hazardous materials, controlled substances | Hidden or disabled until approved architecture exists. |
| Prohibited | Not allowed on ReDist | Illegal goods, unsafe goods, recalled items | Cannot be listed. |

### Restricted Category Controls

- Category has country-specific availability.
- Category defines required documents.
- Category defines required listing fields.
- Category defines prohibited examples.
- Category defines allowed organization types.
- Category defines whether requester also needs verification.
- Category publish action checks current eligibility.
- Category request action checks requester eligibility when needed.
- Every restricted action is audited.

### UAE Launch Position

For UAE launch, medicines, pharmaceuticals, hazardous materials, controlled substances, and other regulated goods should remain disabled until legal, storage, transport, verification, and audit controls are explicitly approved.

## 9. Verification Audit Events

Verification audit events should be append-only and scoped to organization, reviewer, country, and document where applicable.

Recommended event types:

| Event | Trigger |
| --- | --- |
| `verification.profile.updated` | Organization verification profile changes. |
| `verification.document.uploaded` | New document file submitted. |
| `verification.document.replaced` | Existing document version replaced. |
| `verification.submitted` | Owner submits package for review. |
| `verification.review.assigned` | Reviewer assignment changes. |
| `verification.document.approved` | Reviewer approves document. |
| `verification.document.rejected` | Reviewer rejects document. |
| `verification.needs_changes` | Reviewer requests corrections. |
| `verification.approved` | Organization verification level approved. |
| `verification.partially_approved` | Limited or category-specific approval granted. |
| `verification.suspended` | Verification suspended. |
| `verification.reinstated` | Verification restored. |
| `verification.expiring_soon` | System flags upcoming expiry. |
| `verification.expired` | Document or package expires. |
| `verification.category_approved` | Category eligibility granted. |
| `verification.category_revoked` | Category eligibility removed. |
| `trust_score.recalculated` | Trust score changes after relevant event. |

### Audit Details

Audit payloads should include:

- Actor ID.
- Organization ID.
- Country ID.
- Entity type and entity ID.
- Previous status.
- New status.
- Reason code.
- Reviewer notes visibility level.
- Document version ID when applicable.
- Source, such as user action, admin action, or system job.
- Timestamp.

## 10. User Experience Flow

### Organization Owner Flow

1. Owner opens Verification from organization workspace.
2. System shows current verification level, missing requirements, expiring documents, and unlocked capabilities.
3. Owner completes organization profile.
4. Owner uploads required documents.
5. Owner reviews privacy notice and submits.
6. Owner sees pending review state and expected SLA.
7. Owner receives approval, needs-changes, rejection, expiry, or suspension notifications.
8. Owner can view reviewer notes and resubmit corrected documents.

### Listing Flow

1. User selects category while creating listing.
2. System shows whether the category is open, controlled, restricted, or prohibited.
3. If verification is sufficient, user continues.
4. If verification is missing, user sees required documents and a link to verification.
5. If category is prohibited or disabled, user cannot publish and sees policy explanation.
6. Listing cards show safe verification badges for the owning organization.

### Request Flow

1. Requester views listing owner verification badge and trust band.
2. If category requires requester verification, system checks requester organization eligibility.
3. Requester submits request only when eligibility is satisfied.
4. Trust and verification context appears in the request detail and handover flow.

### Admin Flow

1. Verifier opens review queue.
2. Verifier filters by country, status, SLA age, category, organization type, and risk flags.
3. Verifier opens organization review detail.
4. Verifier reviews profile fields, documents, history, notes, and audit timeline.
5. Verifier approves, requests changes, rejects, suspends, escalates, or grants category eligibility.
6. System records audit event and sends notification.

## Database Recommendations

### Recommended Tables

| Table | Purpose |
| --- | --- |
| `verification_levels` | Country-configurable level definitions and capability mapping. |
| `organization_verifications` | Current organization verification package and status. |
| `organization_verification_documents` | Uploaded document records and review status. |
| `document_types` | Country-specific document definitions and expiry rules. |
| `organization_certificates` | General certificates and permits beyond trade licenses. |
| `category_verification_rules` | Required documents and eligibility rules per category/country. |
| `organization_category_eligibilities` | Approved category permissions per organization. |
| `trust_scores` | Current and historical trust score snapshots. |
| `trust_score_events` | Inputs and deltas used to explain score changes. |
| `verification_review_assignments` | Reviewer assignment and queue accountability. |
| `verification_audit_events` or scoped `audit_events` records | Append-only verification history. |

### Recommended Constraints

- Verification documents must reference organization, document type, country, submitter, and current status.
- Document expiry dates should be required when the document type requires expiry.
- Category eligibility must reference category, country, organization, status, approved_by, and expiry where applicable.
- Trust score snapshots should be immutable once created.
- Sensitive document paths should never be exposed through public views.
- Organization public profiles should use safe projection views rather than raw organization tables.

### Recommended Status Enums

Verification status:

- `draft`
- `submitted`
- `pending_review`
- `needs_changes`
- `partially_verified`
- `verified`
- `expiring_soon`
- `expired`
- `suspended`
- `rejected`

Document status:

- `draft`
- `submitted`
- `pending_review`
- `approved`
- `needs_changes`
- `rejected`
- `expired`
- `replaced`

Category eligibility status:

- `not_required`
- `required`
- `pending_review`
- `approved`
- `expired`
- `revoked`
- `suspended`

## API Recommendations

### Organization Verification APIs

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/organizations/{id}/verification` | Get verification state, requirements, documents, and capabilities. |
| `PATCH /api/v1/organizations/{id}/verification/profile` | Update verification profile fields. |
| `POST /api/v1/organizations/{id}/verification/documents` | Create document metadata and signed upload intent. |
| `PATCH /api/v1/organizations/{id}/verification/documents/{documentId}` | Update document metadata or replace version. |
| `POST /api/v1/organizations/{id}/verification/submit` | Submit package for review. |
| `GET /api/v1/organizations/{id}/verification/audit` | Get scoped verification audit events. |

### Admin Verification APIs

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/admin/verification` | Review queue with filters and pagination. |
| `GET /api/v1/admin/verification/{organizationId}` | Review detail with documents, notes, history, and capabilities. |
| `POST /api/v1/admin/verification/{organizationId}/assign` | Assign or reassign reviewer. |
| `POST /api/v1/admin/verification/{organizationId}/approve` | Approve verification package or level. |
| `POST /api/v1/admin/verification/{organizationId}/needs-changes` | Request changes with notes. |
| `POST /api/v1/admin/verification/{organizationId}/reject` | Reject verification package or document. |
| `POST /api/v1/admin/verification/{organizationId}/suspend` | Suspend verification. |
| `POST /api/v1/admin/verification/{organizationId}/reinstate` | Reinstate verification. |
| `POST /api/v1/admin/verification/{organizationId}/categories/{categoryId}/approve` | Grant category eligibility. |
| `POST /api/v1/admin/verification/{organizationId}/categories/{categoryId}/revoke` | Revoke category eligibility. |

### Trust APIs

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/organizations/{id}/trust` | Organization owner/admin trust score and explanation. |
| `GET /api/v1/public/organizations/{slug}/trust` | Public-safe trust band and badge projection. |
| `POST /api/v1/admin/organizations/{id}/trust/recalculate` | Admin-triggered recalculation. |

### API Rules

- All document access should use short-lived signed URLs.
- Public APIs should return badges and trust bands, not sensitive document metadata.
- Admin APIs must require verifier, country admin, or platform admin permissions.
- Mutating verification APIs must create audit events in the same transaction where possible.
- Responses should include actionable next steps, such as missing documents and blocked capabilities.

## UI Recommendations

### Organization Workspace

- Verification summary card with level, status, trust band, missing requirements, and expiring documents.
- Step-based verification wizard for profile, documents, review, and category eligibility.
- Document checklist grouped by required, conditional, optional, and expired.
- Clear locked/unlocked capability list.
- Reviewer notes shown in a controlled, non-technical style.
- Renewal warnings at 60, 30, and 7 days.

### Listing and Discover

- Show verification badge and trust band near organization name.
- On listing creation, show category eligibility before the user fills the full form.
- For restricted categories, explain required verification without encouraging workarounds.
- Do not show private document names publicly.
- Keep badges compact and enterprise-grade.

### Admin Review

- Queue table with filters for country, status, SLA, category, organization type, assigned reviewer, and risk level.
- Review detail with organization profile, document list, preview/download controls, notes, trust history, and audit timeline.
- Decision panel with approve, needs changes, reject, suspend, reinstate, and escalate actions.
- Required reason codes for rejection, suspension, and category revocation.
- Clear separation between public notes and internal reviewer notes.

### Badge Visual Style

- Use ReDist status pills and verification badges from the design system.
- Use green only for approved/verified states.
- Use amber for pending, expiring, or needs changes.
- Use red only for rejected, suspended, or expired critical states.
- Use neutral for new or insufficient-history states.
- Avoid large shield graphics or charity-style trust illustrations.

### Accessibility and Localization

- Badge meaning must be available as text, not color alone.
- Reviewer decision forms must have explicit labels and validation messages.
- Arabic/RTL support should be planned for all status labels and reviewer notes.
- Dates should support country-specific formats.
- Document upload errors should be direct and recoverable.

## Pilot Operating Recommendations

- Start with manual verification review for all UAE pilot organizations.
- Keep restricted categories disabled unless explicitly approved by founders and operations.
- Review trust score calculations weekly during pilot.
- Track false positives and false negatives in verification decisions.
- Maintain a founder-visible list of suspended, expired, and needs-changes organizations.
- Do not expose raw trust scores publicly until the score has enough real handover history.

## Non-Goals

- No automated document verification is required for the first UAE pilot.
- No AI-based trust decisions should approve or reject organizations without human review.
- No payment history should influence trust score during launch.
- No public access to verification documents should ever be allowed.
- No restricted category should be enabled by design alone without legal and operational approval.
