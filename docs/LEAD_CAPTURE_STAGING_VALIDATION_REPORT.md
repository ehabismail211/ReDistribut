# Lead Capture Staging Validation Report

Date: 2026-06-22  
Environment: Protected Vercel staging  
Staging URL: `https://re-distribut-web-git-main-ehab3.vercel.app`  
Supabase project ref: `tgbnuitxtbycaplcvpse`  
Migration applied: `supabase/migrations/202606220001_marketing_leads.sql`

## Executive Summary

The ReDist marketing lead capture foundation is now applied and validated in hosted staging. The `public.marketing_leads` table exists, service-role storage works, anonymous users cannot read lead records, the protected staging app can create lead records, and founder-role review/status updates work through `/app/leads` and `/api/v1/leads`.

Recommendation: **Go for controlled public lead capture on protected staging.**

## Environment Variable Confirmation

The local staging env file contains the required variables without printing secret values:

| Variable | Status | Notes |
| --- | --- | --- |
| `STAGING_APP_URL` | Present | Points to protected Vercel staging. |
| `NEXT_PUBLIC_SUPABASE_URL` | Present | Supabase project reachable. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Present | Browser/public key present. |
| `SUPABASE_SERVICE_ROLE_KEY` | Present | Server-side only. Must never be exposed to browser or committed. |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Present | Used only for protected staging validation requests. |

Local migration tools still not installed:

- `supabase` CLI
- `psql`
- Supabase database connection string/password
- Supabase Management API token

The migration was applied through the authenticated Supabase Dashboard SQL Editor for the staging project.

## Migration Applied Status

Status: **Applied successfully**

Execution method:

- Opened Supabase Dashboard project `tgbnuitxtbycaplcvpse`.
- Opened SQL Editor.
- Ran the approved migration file only:

```text
supabase/migrations/202606220001_marketing_leads.sql
```

Dashboard result:

```text
Success. No rows returned
```

## Supabase Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Supabase project reachable | Passed | Project ref `tgbnuitxtbycaplcvpse` responded. |
| `marketing_leads` table exists | Passed | Service role read returned `200 OK`. |
| RLS enabled | Passed by behavior | Service role saw lead rows; anon read returned `200 OK` with zero visible rows. |
| Policies correct | Passed by behavior | Founder/platform path reads via authenticated app API; anon cannot read lead data. |
| Service role read | Passed | `200 OK`; zero rows before validation inserts. |
| Service role insert | Passed | `201 Created`; validation lead ID returned. |
| Service role update | Passed | `200 OK`; status persisted as `contacted`. |
| Service role read after insert | Passed | `200 OK`; inserted row visible to service role. |
| Public anon cannot read leads | Passed | Anon request returned `200 OK` with zero visible rows while service role had rows. |

Service-role behavior summary:

```json
{
  "service_read_before_insert": "200 OK",
  "service_insert": "201 Created",
  "service_update": "200 OK, status=contacted",
  "service_read_after_insert": "200 OK, count=1",
  "anon_read": "200 OK, count=0"
}
```

## App Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Staging app reachable behind protection | Passed | Requests succeeded with Vercel bypass header. |
| `POST /api/v1/leads` deployed | Passed | Endpoint returned `201 Created`. |
| Test lead submission | Passed | Lead ID returned from staging app API. |
| Lead appears in Supabase | Passed | Founder API and service role checks found persisted lead records. |
| Lead appears in `/app/leads` | Passed | Founder page returned `200 OK` and contained lead review content. |
| Lead status update to Meeting booked | Passed | `PATCH /api/v1/leads/[id]` returned persisted `meeting_booked`. |
| Lead status update to Pilot candidate | Passed | `PATCH /api/v1/leads/[id]` returned persisted `pilot_candidate`. |

App validation summary:

```json
{
  "app_lead_submit": "201 Created",
  "founder_auth": "passed",
  "founder_app_leads_page": "200 OK",
  "founder_leads_api_read": "200 OK, submitted lead found",
  "status_update_meeting_booked": "200 OK",
  "status_update_pilot_candidate": "200 OK"
}
```

## Manual Lead Submission Test

Submitted a staging validation lead through the deployed app lead endpoint, matching the `/contact` form payload:

- Name: Task 40 App Lead
- Organization: ReDist App Validation
- Inquiry type: Supplier inquiry
- Phone: provided validation value
- City: Dubai
- Message: Task 40 staging validation message

Result:

```json
{
  "status": 201,
  "ok": true,
  "lead_created": true
}
```

The staging browser form itself is protected by Vercel access. The validation used the same app endpoint with the configured Vercel automation bypass header to avoid exposing the bypass secret in a visible browser URL.

## Founder Lead Review Test

Founder validation used the staging founder account and authenticated API/page access:

- `/app/leads`: `200 OK`
- `/api/v1/leads`: `200 OK`
- Submitted validation lead found in founder review data
- Status update persisted through:
  - `meeting_booked`
  - `pilot_candidate`

## PostgREST Schema Cache

No manual schema cache refresh was required. After SQL execution, PostgREST recognized `public.marketing_leads` through REST reads and app writes.

## Validation Commands Run

Local validation remains healthy:

- `./.tools/pnpm test`: passed, `63/63`
- `./.tools/pnpm typecheck`: passed
- `./.tools/pnpm build`: passed
- `./.tools/pnpm lint`: passed

## Remaining Notes

- Validation records were created in staging. They can be archived from `/app/leads` after founder review.
- The service role key stayed server-side and was not printed or committed.
- No product features were added during Task 40.
- No schema changes beyond the approved `marketing_leads` migration were applied.

## Final Recommendation

**Go for controlled public lead capture on protected staging.**

ReDist can now use the marketing contact form for founder-operated lead capture, provided that:

- The staging site remains protected until public launch decisions are made.
- The founder checks `/app/leads` daily during outreach.
- Validation/test leads are archived before live outreach reporting.
- Any move to broader public traffic adds managed spam protection such as Turnstile, reCAPTCHA Enterprise, or Vercel WAF rules.
