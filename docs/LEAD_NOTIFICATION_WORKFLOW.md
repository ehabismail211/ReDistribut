# ReDist Lead Notification Workflow

Status: Founder-operated notification workflow  
Scope: Public contact form leads submitted through `POST /api/v1/leads`  
Provider: Resend HTTP API, configured through server-only environment variables

## Purpose

When a new lead is submitted from the public website, ReDist saves the lead first and then sends the founder an email notification. Email delivery must never block lead persistence.

## Trigger

1. Visitor submits the public Contact form.
2. `POST /api/v1/leads` validates the request.
3. ReDist creates a lead record in `marketing_leads`.
4. After successful persistence, ReDist sends a founder notification email.
5. The API still returns success if email delivery fails after the lead is saved.

## Email Content

Each notification includes:

- Lead ID
- Name
- Organization
- Email
- Phone
- Interest Type
- Message
- Direct founder dashboard link: `/app/leads?lead=<lead-id>`

## Required Environment Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes for delivery | Server-only. Never expose to browser or commit. |
| `LEAD_NOTIFICATION_TO` | Yes for delivery | Founder or founder operations inbox. |
| `LEAD_NOTIFICATION_FROM` | Recommended | Defaults to `ReDist Leads <notifications@redistribut.com>`. Domain must be verified with provider. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Used to build the direct dashboard link. |

`FOUNDER_EMAIL` can be used as a fallback recipient if `LEAD_NOTIFICATION_TO` is not set.

## Failure Handling

If email configuration is missing:

- Lead remains saved.
- Server logs a warning.
- API response remains successful.

If provider delivery fails:

- Lead remains saved.
- Server logs `Lead notification email failed after lead persistence.`
- API response remains successful.

## Validation Checklist

- Submit a test lead from `/contact`.
- Confirm the API returns success.
- Confirm the lead appears in Supabase `marketing_leads`.
- Confirm the lead appears in `/app/leads`.
- Confirm founder receives the email.
- Confirm the email includes Lead ID and direct dashboard link.
- Temporarily remove or invalidate `RESEND_API_KEY` in a non-production environment.
- Submit another test lead.
- Confirm lead still persists and failure is logged.

## Operational Notes

- Do not include sensitive documents in lead messages.
- Do not forward lead emails outside approved founder operations.
- Use a verified sending domain before public outreach campaigns.
- Keep notification credentials server-only in Vercel/Supabase environment settings.
