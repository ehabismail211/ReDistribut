# UAE Pilot Readiness Checklist

## Purpose

This checklist defines the Go / No-Go criteria for launching the ReDist UAE pilot. It should be completed after founder validation, technical validation, security review, and pilot participant preparation.

The UAE pilot should validate real redistribution workflows with selected organizations, not maximize public signups.

## Pilot Decision Summary

| Readiness Area | Status | Owner | Blocking Issues | Go / No-Go |
| --- | --- | --- | --- | --- |
| Technical Readiness |  |  |  |  |
| Operational Readiness |  |  |  |  |
| Security Readiness |  |  |  |  |
| Compliance Readiness |  |  |  |  |
| Support Readiness |  |  |  |  |
| Pilot Readiness |  |  |  |  |

Overall decision:

- `Go`: all critical criteria pass, risks are documented, and support coverage is ready.
- `Conditional Go`: minor non-critical gaps exist with founder-approved workarounds and owners.
- `No-Go`: any critical trust, security, transaction, verification, or support gap remains unresolved.

## Technical Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| Production build | Build completes without critical errors |  |  | Build output or CI run |
| Typecheck | Typecheck passes across app and shared packages |  |  | Typecheck output or CI run |
| Core API routes | Categories, listings, organizations, profile, requests, and workflow routes work |  |  | API test evidence |
| Database migrations | Production migrations apply in order to clean environment |  |  | Migration log |
| RLS policies | Cross-organization access is blocked |  |  | Permission test notes |
| Workflow RPCs | Publish, pause, accept, decline, cancel, complete behave correctly |  |  | Test cases or screenshots |
| Quantity integrity | No over-request or over-reservation in simulations |  |  | Reservation test evidence |
| Responsive web | Core workflows work on mobile, tablet, and desktop |  |  | Screenshots |
| Error handling | User-facing errors are understandable and safe |  |  | Error state screenshots |
| Environment variables | Production secrets are configured server-side only |  |  | Deployment checklist |

### Go Criteria

- Core workflow from registration to completion works in staging.
- Quantity and request status remain accurate.
- No critical build, type, API, or migration blockers remain.
- Mobile web supports pilot-critical actions.

### No-Go Criteria

- Users can access another organization's private data.
- Requests can over-reserve inventory.
- Core workflow cannot be completed.
- Production build or deployment is unstable.
- Service-role or sensitive keys are exposed to client code.

## Operational Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| Pilot operating model | Founder has approved pilot scope and limits |  |  | Signed pilot scope |
| Organization onboarding | Invite, registration, and setup process is documented |  |  | Onboarding guide |
| Verification process | Manual review steps and responsibilities are clear |  |  | Verification SOP |
| Category rules | Allowed and prohibited launch categories are documented |  |  | Category policy |
| Listing review | High-risk listings can be reviewed or removed |  |  | Moderation SOP |
| Handover process | Pickup/delivery expectations are documented |  |  | Handover guide |
| Dispute process | Failed handover and dispute handling path is defined |  |  | Dispute SOP |
| KPI tracking | Pilot KPIs are defined and review cadence is set |  |  | KPI dashboard or tracker |
| Founder review | Weekly founder review meeting is scheduled |  |  | Calendar or review template |
| Manual workarounds | Known gaps have safe operational workarounds |  |  | Workaround register |

### Go Criteria

- Founder and operations team know how to onboard, verify, moderate, support, and review pilot organizations.
- Manual processes exist for gaps not yet automated.
- Pilot KPIs are trackable from day one.

### No-Go Criteria

- No owner for verification, support, or moderation.
- No clear process for failed handovers or disputes.
- Categories are unclear or include unapproved regulated goods.
- Founder cannot review pilot performance weekly.

## Security Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| Authentication | Only valid authenticated users can access workspace actions |  |  | Auth test notes |
| Authorization | Role and organization boundaries are enforced |  |  | Permission matrix test |
| Private documents | Verification documents are not public |  |  | Storage access test |
| Public data | Public listing data exposes only intended fields |  |  | Public response sample |
| Admin access | Admin/reviewer privileges are limited to assigned users |  |  | Admin account list |
| Audit logging | Sensitive workflow actions are recorded |  |  | Audit sample |
| Rate limiting plan | Abuse-prone actions have protection or manual monitoring |  |  | Security notes |
| Secret handling | Environment secrets are stored outside code |  |  | Secret management evidence |
| Backup access | Database and storage backup access is restricted |  |  | Access review |
| Incident contact | Security incident owner and escalation path are defined |  |  | Incident contact list |

### Go Criteria

- Organization data isolation is verified.
- Sensitive documents are private.
- Privileged access is known and limited.
- Security incident owner is defined.

### No-Go Criteria

- Cross-tenant data exposure exists.
- Verification documents are publicly accessible.
- Admin access is broad, unknown, or shared.
- Secrets are committed or exposed.
- Audit records are absent for sensitive actions.

## Compliance Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| UAE organization requirements | Required organization fields and documents are defined |  |  | Verification checklist |
| Restricted goods policy | Medicines, hazardous materials, and controlled goods are excluded |  |  | Category exclusions |
| Food handling rules | Food listings require appropriate permits or manual approval |  |  | Food category rules |
| Terms and policies | Pilot terms, acceptable use, privacy, and disclaimers are ready |  |  | Policy documents |
| Data retention approach | Retention expectations are documented for pilot |  |  | Retention note |
| Impact claims | Impact metrics distinguish estimates from verified values |  |  | Impact wording review |
| Commercial transactions | Payment/escrow exclusions are clear |  |  | Product copy review |
| Verification review | Reviewer decision states and notes are documented |  |  | Review SOP |
| Entity responsibility | Owner/requester responsibilities are clear |  |  | Handover terms |
| Founder approval | Founder approves pilot compliance boundaries |  |  | Sign-off |

### Go Criteria

- Pilot excludes unapproved regulated categories.
- Organization verification requirements are clear.
- Terms and user responsibilities are documented.
- Impact and value claims are not overstated.

### No-Go Criteria

- Restricted goods can be listed without review.
- Pilot users are unclear about responsibility for item condition, pickup, or compliance.
- ReDist appears to guarantee regulatory approval or item quality without basis.
- Policies are missing for pilot participants.

## Support Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| Support owner | Named person owns pilot support |  |  | Owner assignment |
| Support channels | Email, phone, WhatsApp, or in-app support route is defined |  |  | Support channel list |
| Response SLA | Pilot response expectations are documented |  |  | SLA note |
| Issue categories | Bugs, verification, listing, request, handover, dispute, and abuse categories exist |  |  | Support tracker |
| Escalation path | Critical issues escalate to founder or technical owner |  |  | Escalation matrix |
| User guides | Short guides exist for listing, requesting, and handover |  |  | Guide links |
| Feedback process | Post-handover and weekly feedback process is ready |  |  | Survey or interview template |
| Known issues list | Known limitations are documented for support |  |  | Known issues register |
| Incident template | Support can record incident timeline and resolution |  |  | Incident template |
| Pilot communications | Welcome, reminder, and status messages are ready |  |  | Message templates |

### Go Criteria

- Pilot users know how to get help.
- Support team can classify, escalate, and resolve issues.
- Feedback can be collected consistently.
- Known limitations are transparent to support staff.

### No-Go Criteria

- No active support owner.
- No escalation path for failed handovers or security issues.
- No way to track pilot issues.
- Users receive no onboarding or handover guidance.

## Pilot Readiness

### Checklist

| Criteria | Go Standard | Pass | Fail | Evidence Required |
| --- | --- | --- | --- | --- |
| Pilot participant list | 20-50 target organizations identified or staged by cohort |  |  | Participant list |
| Organization mix | Restaurants, hotels, retail, warehouse, packaging, school, NGO, manufacturer represented if possible |  |  | Cohort plan |
| First listings | Initial listing supply is planned |  |  | Listing plan |
| Demand side | Requesting organizations are ready to test |  |  | Requester list |
| Founder validation | Founder validation pack is completed |  |  | Completed checklist |
| Simulation scenarios | At least three realistic scenarios are tested |  |  | Scenario evidence |
| KPI baseline | Baseline and first-month targets are set |  |  | KPI tracker |
| Pilot timeline | Start date, review dates, and end date are defined |  |  | Pilot calendar |
| Communication plan | Participants know pilot expectations and limitations |  |  | Pilot email/message |
| Launch approval | Founder gives final Go decision |  |  | Signed decision |

### Go Criteria

- A controlled pilot cohort is ready.
- Both supply and demand sides are represented.
- Founder validation is complete.
- At least three end-to-end simulations pass.
- KPI tracking and weekly review are ready.

### No-Go Criteria

- No committed pilot participants.
- Only supply or only demand side is present.
- End-to-end scenarios have not been tested.
- Founder has not approved the pilot boundaries.

## Final Go / No-Go Criteria

### Go

The UAE pilot can start when:

- All critical Technical Readiness criteria pass.
- All critical Security Readiness criteria pass.
- Compliance boundaries exclude unapproved restricted categories.
- Support owner, channels, and escalation path are active.
- Founder validation pack is completed with no unresolved critical failures.
- Pilot cohort and KPI tracking are ready.

### Conditional Go

The UAE pilot can start with conditions when:

- Only non-critical gaps remain.
- Each gap has an owner, workaround, and review date.
- Founder explicitly approves the risk.
- Pilot participants are informed where the limitation affects them.

### No-Go

The UAE pilot must not start when any of the following is true:

- Cross-organization data exposure is possible.
- Inventory can be over-reserved.
- Verification documents are public or mishandled.
- Restricted goods can be listed without control.
- Users cannot complete the request, reservation, handover, and completion workflow.
- No support owner or escalation path exists.
- Founder has not signed off.

## Final Sign-Off

| Role | Name | Decision | Signature/Initials | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| Founder |  |  |  |  |  |
| Technical Owner |  |  |  |  |  |
| Operations Owner |  |  |  |  |  |
| Security/Compliance Reviewer |  |  |  |  |  |
| Support Owner |  |  |  |  |  |
