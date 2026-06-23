# ReDist Lead Management Workflow

Status: Founder-operated CRM foundation  
Scope: Marketing website inquiries, pilot fit review, and first-contact tracking  
Implementation: Supabase-backed lead records with protected founder review and pipeline pages

## Purpose

The ReDist marketing website now converts public inquiries into server-side lead records instead of browser-only storage. The goal is not to build an advanced CRM. The goal is to give the founder a simple, production-safe queue for reviewing supplier, recipient, partner, ESG, demo, and pilot inquiries.

## Lead Capture Flow

1. A visitor submits the Contact form.
2. The form sends the inquiry to `POST /api/v1/leads`.
3. The server validates required fields and consent.
4. Spam protection checks run before storage.
5. A lead record is created in Supabase table `marketing_leads`.
6. The lead appears in the protected founder review page at `/app/leads`.
7. Meeting and pilot progress rolls up into `/app/founder`.

## Captured Fields

- Name
- Organization
- Email
- Phone
- Inquiry type
- Message
- Organization type
- Role/title
- City/emirate
- Timeline
- Created date
- Source
- Lead status
- Meeting status
- Pilot status

## Lead Statuses

| Status | Meaning | Founder action |
| --- | --- | --- |
| New leads | Inquiry has not been reviewed yet. | Review fit, check category safety, decide whether to contact. |
| Contacted | Founder has contacted the organization. | Wait for reply or schedule next step. |
| Meeting booked | A discovery or pilot fit call is scheduled. | Prepare onboarding questions and pilot suitability notes. |
| Pilot candidate | Organization appears suitable for Founder-Guided UAE Pilot Wave 1. | Move into invitation/onboarding package. |
| Archived | Inquiry is not active. | Keep as record; do not pursue now. |

## Meeting Statuses

| Status | Meaning | Founder action |
| --- | --- | --- |
| Not scheduled | No founder conversation is booked yet. | Qualify the lead or keep in outreach. |
| Scheduled | Discovery, demo, or pilot fit conversation is booked. | Prepare the call and confirm attendee context. |
| Completed | Founder conversation has happened. | Decide whether the lead should become a pilot candidate. |
| Follow-up required | Founder owes follow-up after a conversation. | Send next steps, invitation materials, or clarification. |

## Pilot Statuses

| Status | Meaning | Founder action |
| --- | --- | --- |
| Not invited | Lead has not entered pilot invitation workflow. | Continue lead qualification. |
| Invited | Organization has received a pilot invitation. | Track response and answer questions. |
| Accepted | Organization accepted pilot participation. | Start onboarding. |
| Onboarding | Organization is preparing account, verification, or first workflow. | Guide setup and remove blockers. |
| Active | Organization is participating in pilot operations. | Monitor requests, transfers, issues, and feedback. |
| Completed | Organization completed the agreed pilot workflow. | Capture evidence, feedback, and success story readiness. |

## Founder Review Routine

Daily:

- Open `/app/leads`.
- Review all New leads.
- Archive spam, irrelevant, unsafe, or non-UAE inquiries.
- Move qualified leads to Contacted after first outreach.
- Move scheduled conversations to Meeting booked and set Meeting tracking to Scheduled.
- After a founder conversation, set Meeting tracking to Completed or Follow-up required.
- Move suitable organizations to Pilot candidate only after a founder review conversation.
- Set Pilot tracking as Invited, Accepted, Onboarding, Active, or Completed as the organization progresses.

Weekly:

- Open `/app/founder`.
- Review Upcoming meetings, Pilot candidates, Active pilots, and pilot conversion rate.
- Compare Pilot candidate leads against the pilot participant selection guide.
- Update outreach pipeline documents if a lead moves into active partner acquisition.
- Review whether lead volume requires a dedicated CRM or support owner.

## Spam Protection

The lead endpoint includes lightweight protection:

- Honeypot field rejection.
- Minimum form review time before submission.
- Per-IP in-memory rate limiting.
- Server-side schema validation and field length limits.

This is sufficient for private/low-volume launch readiness. If ReDist receives public traffic, add managed protection such as Turnstile, reCAPTCHA Enterprise, Vercel WAF rules, or equivalent.

## Access Control

- Public visitors can submit leads only through the API.
- Public visitors cannot read lead records.
- `/app/leads` is protected by founder route access.
- `/app/founder` is protected by founder route access.
- Lead review and status updates require an authenticated founder/platform role.
- Supabase RLS allows lead select/update only for platform operator roles.

## Operational Rules

- Do not store sensitive documents in lead messages.
- Do not treat a lead as a pilot participant until founder qualification is complete.
- Do not make ESG, impact, or pilot-result claims based on an inquiry.
- Do not export or share lead data outside approved founder-operated workflows.

## Environment Requirements

Server-side lead storage requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Founder email notifications require:

- `RESEND_API_KEY`
- `LEAD_NOTIFICATION_TO` or `FOUNDER_EMAIL`
- `LEAD_NOTIFICATION_FROM`

The service role key and email provider API key must never be committed, exposed to the browser, included in screenshots, or shared with pilot organizations.

## Next Upgrade Trigger

Move from this CRM foundation to a fuller CRM only when one of these conditions is met:

- More than 30 active leads are being managed at once.
- More than 10 partner meetings are booked per month.
- More than one team member needs lead ownership.
- Lead response times cannot be maintained by the founder.
