# ReDist Dispute Resolution Framework

Date: 2026-06-21  
Status: Framework only; not legal advice  
Required review: Professional UAE legal review before commercial use

## Purpose

This framework defines how ReDist should conceptually handle disputes during pilot and future commercial operations.

It is not a formal dispute policy or legal procedure.

## Dispute Principles

- Record every dispute.
- Preserve relevant audit and workflow evidence.
- Pause risky workflows while reviewing.
- Keep parties informed.
- Avoid making legal determinations.
- Correct or revoke certificates where data is materially wrong.
- Escalate Critical issues immediately.
- Require UAE legal review before commercial dispute terms are published.

## Dispute Types

### Request Disputes

Examples:

- Recipient requested wrong quantity.
- Recipient misrepresented intended use.
- Supplier believes recipient is unsuitable.
- Supplier declined but recipient disputes reason.
- Request was submitted by unauthorized user.

Initial handling:

1. Log dispute in issue log.
2. Identify request reference.
3. Preserve request status and audit trail.
4. Ask both parties for clarification if needed.
5. Founder/admin decides whether request remains active, is cancelled, or is closed.

### Transfer Disputes

Examples:

- Handover did not occur.
- Quantity differs from approved request.
- Resource condition differs from listing.
- Pickup/drop-off failed.
- One party claims completion and the other disputes it.
- Evidence is missing or inaccurate.

Initial handling:

1. Pause completion or certificate issuance if unresolved.
2. Record transfer/request reference.
3. Preserve messages, audit logs, and evidence.
4. Ask both parties to confirm facts.
5. Decide whether to complete, cancel, reopen, or escalate.

### Certificate Disputes

Examples:

- Wrong supplier or recipient.
- Wrong resource name.
- Wrong quantity.
- Wrong date or location.
- Transfer was not actually completed.
- QR verification exposes incorrect public information.

Initial handling:

1. Mark certificate as under review if the product supports it.
2. If not supported, record manual status in issue log.
3. Pause external sharing of the certificate.
4. Verify underlying transfer data.
5. Correct, revoke, or reissue according to approved policy.

### Verification Disputes

Examples:

- Organization disputes verification rejection.
- Document expiry is contested.
- Category eligibility is contested.
- Reviewer decision is challenged.

Initial handling:

1. Preserve submitted documents and reviewer notes.
2. Assign founder/admin reviewer.
3. Request clarification or updated evidence.
4. Keep restricted categories disabled until resolved.

## Escalation Process

| Severity | Examples | Response Target | Action |
| --- | --- | --- | --- |
| Critical | Data exposure, unsafe goods, certificate fraud, security issue | Immediate | Pause affected workflow, notify founder, preserve evidence |
| High | Failed handover, certificate mismatch, disputed verification for active transfer | Same business day | Assign owner and track to closure |
| Medium | Quantity disagreement, unclear request, non-blocking status confusion | 2 business days | Founder/admin review |
| Low | Copy confusion, minor reporting mismatch, training issue | Weekly review | Defer or address operationally |

## Founder/Admin Review Steps

1. Open dispute record.
2. Identify affected organization(s).
3. Identify affected listing, request, transfer, certificate, and impact record.
4. Freeze certificate sharing if evidence is disputed.
5. Collect participant statements and evidence.
6. Review audit logs.
7. Decide operational outcome.
8. Update issue log.
9. Update certificate/impact/reporting status if needed.
10. Update post-mortem or decision gate for repeated issues.

## Possible Outcomes

| Outcome | Meaning |
| --- | --- |
| No action | Dispute not supported by evidence |
| Clarification | Workflow continues with updated notes |
| Request cancelled | Request closed before transfer |
| Transfer cancelled | Handover not completed |
| Transfer corrected | Quantity/details adjusted where permitted |
| Certificate corrected | Certificate data corrected or reissued |
| Certificate revoked | Certificate no longer treated as valid |
| Account/category restricted | Risk requires access limitation |
| Escalated to legal review | Formal legal input required |

## Required Legal Review

Legal counsel should define:

- Formal dispute terms.
- Liability limitations.
- Evidence standards.
- Customer notification obligations.
- Certificate correction/revocation rights.
- Account suspension rights.
- Jurisdiction and dispute forum.

