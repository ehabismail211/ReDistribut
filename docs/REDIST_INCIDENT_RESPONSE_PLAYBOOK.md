# ReDist Incident Response Playbook

Date: 2026-06-21  
Status: Operational playbook; not legal advice or formal incident policy  
Owner: Founder during pilot; Engineering Owner for technical incidents

## Purpose

Use this playbook when an incident affects ReDist security, data, transfer integrity, certificates, platform availability, or misuse.

## Severity Levels

| Severity | Meaning | Response |
| --- | --- | --- |
| Critical | Security/data exposure, unsafe transfer, certificate fraud, major outage | Immediate triage and workflow pause |
| High | Transfer/certificate blocked, verification dispute, participant cannot proceed | Same business day owner assigned |
| Medium | Degraded workflow, repeated confusion, non-critical issue | 2 business days |
| Low | Minor support, copy, or training issue | Weekly review |

## Universal Incident Steps

1. Open incident record in issue log.
2. Assign severity.
3. Assign owner.
4. Preserve evidence.
5. Contain affected workflow or access.
6. Notify founder.
7. Communicate with affected participant where appropriate.
8. Resolve or apply workaround.
9. Document root cause.
10. Update risk register and blocker register if needed.

## Security Incidents

Examples:

- Unauthorized access.
- Cross-organization data exposure.
- Admin route/API access issue.
- Secret leakage.
- Suspicious permission behavior.

Immediate actions:

- Pause affected access/workflow.
- Preserve logs and screenshots.
- Rotate exposed secrets if relevant.
- Disable affected account/role if needed.
- Run relevant validation tests.
- Notify founder and engineering owner.

Escalate to legal/privacy review if personal, organization, or document data may have been exposed.

## Data Incidents

Examples:

- Private document exposed.
- Wrong organization sees data.
- Certificate exposes too much public information.
- Audit logs show unexpected access.
- Data deletion/retention concern.

Immediate actions:

- Restrict access.
- Preserve evidence.
- Identify affected organization(s).
- Identify data fields exposed.
- Review audit trail.
- Decide participant communication with founder/legal input.

## Transfer Disputes

Examples:

- Handover did not happen.
- Quantity mismatch.
- Condition mismatch.
- One party disputes completion.
- Unauthorized user acted on transfer.

Immediate actions:

- Pause completion or certificate if unresolved.
- Record request/transfer reference.
- Ask parties for clarification.
- Preserve evidence and audit logs.
- Update issue log.
- Decide complete, cancel, correct, or escalate.

## System Outage

Examples:

- Staging or production app unavailable.
- Certificate verification page unavailable.
- API outage.
- Database connection failure.

Immediate actions:

- Confirm affected URL/API.
- Check deployment status.
- Check database provider status.
- Notify founder.
- Communicate expected delay to active pilot participants.
- Preserve error logs.
- Roll back if recent deployment caused outage.

## Misuse Reports

Examples:

- Unsafe listing.
- Restricted category.
- Fraudulent organization claim.
- Harassment or abusive message.
- Suspicious request.

Immediate actions:

- Hide/pause affected workflow where possible.
- Preserve listing/request evidence.
- Review organization verification.
- Contact participant if safe.
- Restrict account/category access if needed.

## Incident Closeout

Close an incident only after:

- Owner confirms resolution.
- Evidence is attached or referenced.
- Participant communication is complete where needed.
- Risk register is updated if severity was High/Critical.
- Founder accepts residual risk.
- Follow-up action is assigned.

## Post-Incident Review

For Critical/High incidents, write:

- What happened?
- Who was affected?
- What data/workflow was affected?
- How was it contained?
- What fixed it?
- What remains open?
- What must change before expansion?

