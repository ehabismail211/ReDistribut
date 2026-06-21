# UAE Pilot Go / No-Go Scorecard

Date: 2026-06-21  
Purpose: Score Wave 1 readiness and decide whether to proceed, pause, or expand.

## Scoring Model

Each category is scored from 0 to 5.

| Score | Meaning |
| ---: | --- |
| 0 | Not tested or unavailable |
| 1 | Major blocker |
| 2 | Serious gap with limited workaround |
| 3 | Usable with founder workaround |
| 4 | Ready for guided pilot |
| 5 | Ready for broader controlled use |

Weighted score:

- Technical and security categories have higher launch weight.
- Any Critical blocker overrides total score.

## Category Scorecard

| Category | Weight | Score | Weighted Score | Evidence |
| --- | ---: | ---: | ---: | --- |
| Technical readiness | 3 |  |  | Tests, typecheck, workflow evidence |
| Security and data isolation | 3 |  |  | Permission/RLS/security validation |
| Organization onboarding | 2 |  |  | Guided onboarding completion |
| Verification readiness | 2 |  |  | Document review and status clarity |
| Supplier listing workflow | 2 |  |  | Listing creation scenario |
| Recipient discovery workflow | 2 |  |  | Resource discovery scenario |
| Request approval workflow | 2 |  |  | Request/approval scenario |
| Handover and transfer verification | 3 |  |  | Completed transfer evidence |
| Certificate generation and QR review | 3 |  |  | Certificate evidence |
| Impact reporting credibility | 2 |  |  | Impact review scenario |
| Support and escalation process | 2 |  |  | Support owner and issue log |
| Participant readiness | 2 |  |  | Confirmed Wave 1 cohort |
| Mobile workflow usability | 1 |  |  | Mobile walkthrough |
| Founder/admin monitoring | 2 |  |  | Pilot monitoring and score review |

Maximum weighted score: 155

## Launch Readiness Thresholds

| Decision | Threshold | Conditions |
| --- | ---: | --- |
| Go | 130+ | No Critical blockers; all required pass criteria met; support owner active |
| Conditional Go | 105-129 | No Critical blockers; known workarounds owned; founder-guided only |
| No-Go | < 105 | Readiness too low or key workflows untested |

Override rules:

- Any unresolved Critical security issue means No-Go.
- Any cross-organization data exposure means No-Go.
- Certificate generation below 100% for completed handovers means No-Go for expansion.
- No support owner means No-Go.
- No committed supplier or no committed recipient means No-Go.

## Required Pass Criteria

These criteria must pass regardless of total score:

| Required Criterion | Pass / Fail | Evidence |
| --- | --- | --- |
| Existing tests pass |  |  |
| Typecheck passes |  |  |
| Founder approves participant list |  |  |
| At least one supplier and one recipient confirmed |  |  |
| Restricted categories excluded |  |  |
| Listing creation scenario passes |  |  |
| Resource discovery scenario passes |  |  |
| Request workflow scenario passes |  |  |
| Approval workflow scenario passes |  |  |
| Handover workflow scenario passes |  |  |
| Verification workflow scenario passes |  |  |
| Certificate workflow scenario passes |  |  |
| Impact reporting workflow reviewed |  |  |
| Support channel and escalation owner defined |  |  |
| 0 unresolved Critical issues |  |  |

## Wave 1 Initial Score

Initial recommendation from Sprint 1 revalidation: Conditional Go.

Reason:

- Corrected workflow is clear enough for founder-guided use.
- Tests and typecheck pass.
- Core operations are understandable.
- Admin separation, detailed transfer states, and route structure remain controlled-pilot limitations.

Suggested starting score before live Wave 1 observation: 118 / 155.

## Decision Log

| Date | Decision | Score | Owner | Notes |
| --- | --- | ---: | --- | --- |
| 2026-06-21 | Conditional Go | 118 / 155 | Founder | Ready for first founder-guided UAE organization workflow, not unmanaged self-serve onboarding |

## Final Decision Template

Decision: Go / Conditional Go / No-Go

Rationale:

- 

Required conditions before continuing:

- 

Next review date:

- 
