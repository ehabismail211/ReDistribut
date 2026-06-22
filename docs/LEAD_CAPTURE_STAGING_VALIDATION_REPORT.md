# Lead Capture Staging Validation Report

Date: 2026-06-22  
Environment: Protected Vercel staging  
Staging URL: `https://re-distribut-web-git-main-ehab3.vercel.app`  
Supabase project ref: `tgbnuitxtbycaplcvpse`  
Target migration: `supabase/migrations/202606220001_marketing_leads.sql`

## Executive Summary

Task 38 code is implemented and validated locally, but the staging Supabase database has not yet received the `marketing_leads` migration. Public lead capture is therefore not ready for real public use. The app endpoint is deployed and reachable behind Vercel protection, but persistence fails because `public.marketing_leads` does not exist in the hosted Supabase schema.

Recommendation: **No-Go for public lead capture until the migration is applied and the lead creation/status update checks pass.**

## Environment Variable Confirmation

The local staging env file contains the required variables without printing secret values:

| Variable | Status | Notes |
| --- | --- | --- |
| `STAGING_APP_URL` | Present | Points to protected Vercel staging. |
| `NEXT_PUBLIC_SUPABASE_URL` | Present | Supabase project reachable. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Present | Browser/public key present. |
| `SUPABASE_SERVICE_ROLE_KEY` | Present | Server-side only. Must never be exposed to browser or committed. |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Present | Used only for protected staging validation requests. |

Not available in the local environment:

- `supabase` CLI
- `psql`
- Supabase database connection string/password
- Supabase Management API token

Because those migration-capable credentials/tools are not available, the remote SQL migration could not be applied from this Codex environment.

## Migration Applied Status

Status: **Not applied to hosted staging Supabase**

Evidence from Supabase REST using the service role key:

```json
{
  "status": 404,
  "code": "PGRST205",
  "message": "Could not find the table 'public.marketing_leads' in the schema cache"
}
```

This confirms the target table is absent from the hosted staging schema.

## Supabase Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Supabase project reachable | Passed | Project ref `tgbnuitxtbycaplcvpse` responded. |
| `marketing_leads` table exists | Failed | REST returned `PGRST205` table not found. |
| RLS enabled | Blocked | Table does not exist yet. |
| Policies correct | Blocked | Table does not exist yet. |
| Service role can insert/read/update | Blocked | Table does not exist yet. |
| Public anon cannot read leads | Blocked | Anon also receives table-not-found; this does not prove RLS behavior. |

## App Validation Result

| Check | Result | Evidence |
| --- | --- | --- |
| Staging app reachable behind protection | Passed | Request succeeded with Vercel bypass header. |
| `POST /api/v1/leads` deployed | Passed | Endpoint responded from staging. |
| Test lead submission | Failed | Endpoint returned `500 Unexpected server error` because the database table is missing. |
| Lead appears in Supabase | Blocked | No table exists. |
| Lead appears in `/app/leads` | Blocked | No persisted lead can be created. |
| Lead status update persists | Blocked | No persisted lead exists to update. |

## Manual Lead Submission Test

Attempted payload:

- Name: Task 39 Validation Lead
- Organization: ReDist Internal Validation
- Inquiry type: Pilot interest
- Phone: provided test value
- Message: Task 39 staging validation message

Result:

```json
{
  "status": 500,
  "ok": false,
  "message": "Unexpected server error"
}
```

The likely cause is the missing `public.marketing_leads` table confirmed by the service role database check.

## Required Migration Step

Apply this SQL file to the staging Supabase project:

```text
supabase/migrations/202606220001_marketing_leads.sql
```

Safe options:

1. Supabase Dashboard SQL Editor:
   - Open the staging Supabase project.
   - Open SQL Editor.
   - Paste the full migration SQL.
   - Run once.
   - Confirm no errors.

2. Supabase CLI from a machine with access:
   - Install/login to Supabase CLI.
   - Link the project.
   - Apply migrations using the project’s approved migration workflow.

3. Direct `psql` from a secured operator machine:
   - Use the staging database connection string.
   - Apply only `202606220001_marketing_leads.sql`.
   - Do not expose or commit database credentials.

## Revalidation Steps After Migration

Run these checks after the migration is applied:

1. Service role read:
   - Query `public.marketing_leads`.
   - Expected: `200 OK`, empty array or existing rows.

2. Anon read:
   - Query `public.marketing_leads` using anon key.
   - Expected: blocked by RLS, not readable lead data.

3. Lead creation:
   - Submit a test lead from `/contact`.
   - Expected: success response and new row in Supabase.

4. Founder review:
   - Open `/app/leads` as founder.
   - Expected: test lead appears under New leads.

5. Status update:
   - Move test lead to Contacted or Archived.
   - Expected: status persists in Supabase and remains visible after refresh.

## Validation Commands Run

Local validation remains healthy:

- `./.tools/pnpm test`
- `./.tools/pnpm typecheck`
- `./.tools/pnpm build`
- `./.tools/pnpm lint`

## Blockers

Critical blocker:

- Hosted staging Supabase does not contain `public.marketing_leads`.

Operational blocker:

- This Codex environment does not have migration-capable Supabase access. The service role key can validate and use tables but cannot execute schema migrations through PostgREST.

## Final Recommendation

**No-Go for public lead capture.**

ReDist should not publicly promote the lead capture form until:

- The migration is applied to staging Supabase.
- A real lead can be submitted from `/contact`.
- The lead appears in `/app/leads`.
- Status updates persist.
- Anon users cannot read lead data.

After those checks pass, the recommendation can move to **Go for controlled public lead capture**.
