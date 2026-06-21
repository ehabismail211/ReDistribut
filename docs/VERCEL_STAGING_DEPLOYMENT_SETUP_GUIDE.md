# Vercel Staging Deployment Setup Guide

Date: 2026-06-21  
Purpose: Connect ReDist to a protected Vercel staging deployment so founder review and live UAE pilot validation can happen safely.

## Current Status

ReDist has a protected Vercel preview deployment for founder review:

```text
https://re-distribut-web-git-main-ehab3.vercel.app
```

Use this preview URL, not the public production alias, for pre-invitation staging review.

Do not invite UAE pilot organizations until:

- Vercel staging is deployed.
- Preview access protection is enabled.
- `STAGING_APP_URL` points to the protected external URL.
- `./.tools/pnpm staging:validate` passes against that URL.
- Founder page-by-page review is complete on desktop and mobile.

## Required Founder Setup

### 1. Create Or Connect The Repository

Preferred path:

1. Create a private GitHub repository for ReDist.
2. Push the local `main` branch and pilot tag:

```bash
cd /Users/ehabismail/Documents/Redistribution
git remote add origin <private-github-repository-url>
git push -u origin main
git push origin pilot-wave1-baseline-v0.1
```

3. Confirm the repository is private.
4. Confirm `.env.staging.local`, `.tools`, `node_modules`, `.next`, `dist`, logs, and TypeScript cache files are not committed.

### 2. Create A Vercel Project

In Vercel:

1. Create or open the founder/team Vercel account.
2. Select `Add New...` -> `Project`.
3. Import the private GitHub repository.
4. Configure project settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Install Command | `./.tools/pnpm install` if `.tools/pnpm` is available in deployment, otherwise use Vercel pnpm support |
| Build Command | `./.tools/pnpm build` if `.tools/pnpm` is available in deployment, otherwise `pnpm build` |
| Output Directory | Leave default for Next.js |

Important: `.tools/pnpm` is intentionally ignored in git. If Vercel cannot use it, set Vercel to use pnpm from `packageManager: pnpm@10.0.0` and use:

```text
pnpm install
pnpm build
```

## Required Environment Variables

Add these in Vercel Project Settings -> Environment Variables for Preview/Staging:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Staging Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Staging Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only staging service role key. Never expose publicly. |
| `STAGING_APP_URL` | Yes | The final protected Vercel staging URL after deployment. |
| `STAGING_REQUIRE_LIVE` | Yes | Set to `true` for final validation. |
| `STAGING_PILOT_PASSWORD` | Optional | Omit if using the current default pilot password; set if founder changed seeded passwords. |

Do not add production credentials to the staging project.

## Generate Vercel Credentials For CLI Validation

These are only needed if Codex or a terminal workflow will deploy/validate from the command line.

### VERCEL_TOKEN

1. Open Vercel.
2. Go to Account Settings -> Tokens.
3. Create a token named `redist-staging-deploy`.
4. Limit scope to the relevant team/project if Vercel allows.
5. Copy it once.
6. Provide it through a secure local environment variable, not chat and not git:

```bash
export VERCEL_TOKEN="<token>"
```

### VERCEL_ORG_ID And VERCEL_PROJECT_ID

Option A, after linking locally:

```bash
npx vercel link
cat .vercel/project.json
```

The file contains:

```json
{
  "orgId": "...",
  "projectId": "..."
}
```

Set them locally:

```bash
export VERCEL_ORG_ID="<orgId>"
export VERCEL_PROJECT_ID="<projectId>"
```

Option B, from Vercel dashboard:

1. Open the Vercel project.
2. Go to Settings -> General.
3. Copy Project ID.
4. Open Team/Account settings for the team identifier if needed.

Never commit `.vercel/project.json` unless the founder explicitly decides it is acceptable for the private repo. It is not a secret by itself, but it is deployment metadata and should be treated carefully.

## Enable Protected Preview Access

Before sharing the URL:

1. Open Vercel Project Settings.
2. Enable Deployment Protection or Vercel Authentication for preview deployments.
3. If available, require Vercel login for the founder/team.
4. If using password protection, create a strong staging-only password.
5. Confirm the preview is not publicly accessible from an incognito/private browser session.
6. Share the staging URL only with founder-approved reviewers.

Access protection must be enabled before any live organization invite.

## Deploy

Dashboard path:

1. Push `main` to GitHub.
2. In Vercel, deploy the connected project.
3. Confirm the deployment uses the pilot baseline or approved latest commit.
4. Copy the preview URL.

CLI path, after credentials are set:

```bash
cd /Users/ehabismail/Documents/Redistribution
git checkout main
git status --short
git tag --points-at HEAD
npx vercel pull --yes --environment=preview --token "$VERCEL_TOKEN"
npx vercel build --token "$VERCEL_TOKEN"
npx vercel deploy --prebuilt --token "$VERCEL_TOKEN"
```

## Set STAGING_APP_URL

After the protected Vercel URL exists, update local `.env.staging.local`:

```text
STAGING_APP_URL=https://re-distribut-web-git-main-ehab3.vercel.app
STAGING_REQUIRE_LIVE=true
```

Also update the Vercel project environment variable:

```text
STAGING_APP_URL=https://re-distribut-web-git-main-ehab3.vercel.app
```

Redeploy after changing Vercel environment variables.

## Rerun Validation Against External Staging

From the local project:

```bash
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm lint
./.tools/pnpm staging:validate
```

Expected result:

- Tests pass.
- Typecheck passes.
- Build passes.
- Lint passes.
- Staging validator passes against the external Vercel URL.
- `/app` opens on the protected staging site.
- Unauthorized founder/admin routes remain blocked.

## Confirm Mobile Access

On a phone:

1. Open the protected Vercel staging URL.
2. Pass the access protection gate.
3. Open `/app`.
4. Review:
   - Dashboard
   - Discover
   - Requests
   - Transfers
   - Impact
   - Certificates
5. Confirm navigation is usable.
6. Confirm no text overlaps or broken action buttons are visible.
7. Record notes in `docs/LIVE_PREVIEW_PAGE_BY_PAGE_REVIEW_GUIDE.md` or the pilot observation checklist.

## Founder Checklist

| Step | Done | Notes |
| --- | --- | --- |
| Create private GitHub repo |  |  |
| Push `main` and `pilot-wave1-baseline-v0.1` |  |  |
| Create/connect Vercel project |  |  |
| Link repo to Vercel |  |  |
| Add staging env vars |  |  |
| Enable protected preview access |  |  |
| Deploy staging preview |  |  |
| Set `STAGING_APP_URL` to protected URL |  |  |
| Redeploy after env update |  |  |
| Run validation commands |  |  |
| Confirm `/app` opens on desktop |  |  |
| Confirm `/app` opens on mobile |  |  |
| Complete founder page-by-page review |  |  |
| Share staging URL internally only |  |  |

## Do Not Do

- Do not deploy publicly without protection.
- Do not commit Vercel tokens, Supabase keys, service role keys, passwords, or `.env.staging.local`.
- Do not invite organizations before external staging validation passes.
- Do not use `localhost` as `STAGING_APP_URL` for live invites.
- Do not use production Supabase credentials in staging.
- Do not move or overwrite `pilot-wave1-baseline-v0.1`.
- Do not share the preview URL outside founder-approved reviewers.

## Next Step After Credentials Are Available

Once Vercel project access and credentials exist:

1. Deploy the protected preview.
2. Update `STAGING_APP_URL`.
3. Run external staging validation.
4. Update `docs/STAGING_DEPLOYMENT_VALIDATION_REPORT.md`.
5. Commit the successful staging validation report.
6. Decide Go / Conditional Go / No-Go for the first UAE organization invite.
