# UAE Pilot Decision Gate

Date created: 2026-06-21  
Pilot mode: Founder-guided UAE Pilot Wave 1  
Current launch status: Approved for first controlled organization invitations

## Purpose

This decision gate defines when to continue Wave 1, expand the pilot, pause execution, or begin commercial readiness assessment.

Use this document at the end of every major pilot checkpoint:

- After first supplier-recipient workflow.
- After first completed transfer and certificate.
- End of Wave 1 week.
- Before inviting any additional organizations.

## Current Decision

Recommendation: Continue to first invitation sequence.

Reason:

- Founder review is complete.
- Protected staging validation passed.
- External staging is protected.
- Core automated pilot validation passed.
- No active Critical or High blockers are open at launch readiness handoff.

## Continue Pilot Criteria

Continue the current Wave 1 sequence if all are true:

| Criterion | Required |
| --- | --- |
| No unresolved Critical issues | Yes |
| No cross-organization data incident | Yes |
| Founder can guide participants through current blocker, if any | Yes |
| At least one supplier and one recipient remain engaged | Yes |
| Issue log is updated after each session | Yes |
| Certificate path remains available for completed transfers | Yes |

Continue decision output:

- Keep current cohort size.
- Continue guided sessions.
- Do not expand yet.
- Track issues and satisfaction.

## Expand Pilot Criteria

Expand beyond the first Wave 1 cohort only if all are true:

| Criterion | Expansion Threshold |
| --- | --- |
| Organizations onboarded | 5 / 5 or founder-approved equivalent |
| Completed transfers | 5+ or at least 2 high-quality complete workflows with strong evidence |
| Certificates generated | 100% of completed transfers |
| Critical unresolved issues | 0 |
| High unresolved issues | 0, unless founder-approved operational workaround exists |
| Average satisfaction | 4/5 or better |
| Founder support load | Manageable without product changes |
| Workflow clarity | Participants understand daily flow after first guided session |

Expand decision output:

- Invite 3-5 additional organizations.
- Preserve founder-guided onboarding.
- Keep category restrictions.
- Continue using protected staging or an intentionally approved production environment.

## Pause Pilot Criteria

Pause the affected workflow or full pilot if any are true:

| Trigger | Pause Scope |
| --- | --- |
| Cross-organization data exposure | Full pilot |
| Certificate generation or verification failure for completed handovers | Transfer/certificate workflow |
| Unauthorized admin/founder access issue | Full pilot until verified safe |
| Participant trust or safety concern | Affected participant/workflow |
| Restricted or unsafe goods appear in workflow | Affected listing and participant |
| Critical bug blocks listing, request, transfer, or certificate completion | Affected workflow |
| Founder cannot support participant confusion safely | Expansion pause |

Pause decision output:

- Stop new invitations.
- Document issue in `docs/UAE_PILOT_ISSUE_LOG.md`.
- Notify affected participant if needed.
- Resolve, workaround, or defer with founder approval.
- Re-run validation before resuming if product or configuration changed.

## Commercial Readiness Assessment Criteria

Begin commercial readiness assessment only after Wave 1 proves:

| Area | Evidence Required |
| --- | --- |
| Demand | Recipients submit real requests without founder writing the request for them |
| Supply | Suppliers can publish accurate listings and respond on time |
| Trust | Organizations accept verification, certificate, and evidence workflow |
| Operations | Handovers can complete without excessive founder coordination |
| Impact | Participants understand redistributed value, waste diversion, and certificate evidence |
| Support | Issues are explainable, repeatable, and reducible through training or small product polish |
| Safety | No Critical security, privacy, or category-control issues occur |

Commercial readiness output:

- Keep founder-guided pilot.
- Prepare limited commercial pilot offer.
- Define onboarding requirements.
- Define support and verification obligations.
- Do not move to public launch until self-serve risk is separately validated.

## Decision Log

| Date | Decision | Score / Basis | Conditions | Owner |
| --- | --- | --- | --- | --- |
| 2026-06-21 | Continue to first invitation sequence | Readiness 95/100 after protected staging and founder review | Invite first supplier-recipient pair only; record all issues and feedback | Founder |

## First Invitation Sequence Recommendation

Recommended first sequence:

1. Invite `UAE-W1-001` Restaurant supplier.
2. Invite `UAE-W1-002` NGO recipient.
3. Complete first guided login for both.
4. Create one urgent surplus listing with the supplier.
5. Have the recipient discover and request that resource.
6. Supplier approves or declines with founder observation.
7. Complete one handover and generate one certificate.
8. Review Impact and certificate evidence with both participants.
9. Record satisfaction and issues before inviting the remaining three organizations.

This sequence validates the full ReDist workflow with the lowest useful cohort size before expansion.

