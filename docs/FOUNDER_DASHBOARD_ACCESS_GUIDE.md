# ReDist Founder Dashboard Access Guide

Status: Founder operations guide  
Scope: `/app/founder`, `/app/leads`, `/app/pilot-monitoring`, lead notifications, and daily pipeline review

## Founder URLs

- Founder Dashboard: `/app/founder`
- Leads: `/app/leads`
- Specific lead from email: `/app/leads?lead=<lead-id>`
- Pilot Pipeline: `/app/pilot-monitoring`

## Access Rules

- `/app/founder` is protected by `founder.route.access`.
- `/app/leads` is protected by `founder.route.access`.
- `/app/pilot-monitoring` is protected by `founder.route.access`.
- Unauthorized browser access redirects to `/app?permission=denied&route=<route>`.
- Unauthorized API access returns `403 Permission denied`.
- Lead data is never exposed through public pages.

## How the Founder Logs In

1. Open the private ReDist workspace URL.
2. Sign in with the founder or platform admin account.
3. Open Founder Dashboard from the workspace founder operations area, or navigate directly to `/app/founder`.
4. If a permission warning appears, confirm the account has the founder/platform admin role.

## How to Review Leads

1. Open `/app/leads`.
2. Review New leads first.
3. Check organization, contact details, inquiry type, city, timeline, and message.
4. Archive spam, irrelevant, unsafe, or non-target inquiries.
5. Move qualified leads to Contacted.
6. Use the direct email notification link to open a specific lead when available.

## How to Update Status

Each lead has three founder-operated status tracks:

1. Lead status:
   - New leads
   - Contacted
   - Meeting booked
   - Pilot candidate
   - Archived

2. Meeting tracking:
   - Not scheduled
   - Scheduled
   - Completed
   - Follow-up required

3. Pilot tracking:
   - Not invited
   - Invited
   - Accepted
   - Onboarding
   - Active
   - Completed

## How to Use Email Notifications

When a public website lead is submitted:

1. ReDist saves the lead first.
2. ReDist sends a founder notification email if email environment variables are configured.
3. The email includes Lead ID, contact details, interest type, message, and a direct dashboard link.
4. If email delivery fails, the lead still remains saved and the server logs the error.

Required server-only email variables:

- `RESEND_API_KEY`
- `LEAD_NOTIFICATION_TO` or `FOUNDER_EMAIL`
- `LEAD_NOTIFICATION_FROM`

## Daily Founder Workflow

1. Open `/app/founder`.
2. Review Founder Summary.
3. Review New leads and Leads needing follow-up.
4. Schedule meetings for contacted leads.
5. Review Pilot candidates.
6. Check whether a supplier candidate and recipient candidate are ready for the first pilot pair.

## Weekly Founder Review

1. Review lead counts, meetings booked, pilot candidates, and active organizations.
2. Review Interest Type Breakdown to see which segment is responding.
3. Review Pilot Readiness before pursuing Transfer #0001.
4. Update outreach priorities.
5. Keep product changes limited to issues that block Lead #0001, Meeting #0001, Pilot Commitment #0001, Transfer #0001, Certificate #0001, or Case Study #0001.

## Security Confirmation

- `SUPABASE_SERVICE_ROLE_KEY` is used only in server-side code.
- `RESEND_API_KEY` is used only in server-side notification code.
- Example environment files contain placeholders only.
- Founder routes are protected by middleware and permission checks.
- Public visitors can submit leads but cannot read lead records.
