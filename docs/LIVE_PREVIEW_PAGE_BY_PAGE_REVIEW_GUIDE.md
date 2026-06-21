# Live Preview Page-By-Page Review Guide

Date: 2026-06-21  
Purpose: Give the founder a private, page-by-page review path before UAE pilot invitations.

## Local Preview

From the project root:

```bash
cd /Users/ehabismail/Documents/Redistribution
./.tools/pnpm install
./.tools/pnpm dev
```

Open:

```text
http://localhost:3000/app
```

Production-mode local preview:

```bash
./.tools/pnpm build
./.tools/pnpm start
```

Open:

```text
http://localhost:3000/app
```

If port `3000` is already in use, Next.js may ask for or choose another port. Use the port shown in the terminal.

## Review Method

The current preview workspace is a single operational workspace at `/app`. Use the left navigation on desktop or the mobile navigation menu on small screens to review each workspace area.

Use this checklist for every page or section:

| Check | Pass / Fail | Notes |
| --- | --- | --- |
| Page opens correctly |  |  |
| Navigation works |  |  |
| Mobile layout acceptable |  |  |
| Main action clear |  |  |
| No confusing wording |  |  |
| No broken buttons |  |  |
| No demo-only behavior exposed |  |  |

## Page-By-Page Review Links And Checkpoints

| Area | Local review path | How to open | Founder checkpoints |
| --- | --- | --- | --- |
| Dashboard | `http://localhost:3000/app` | Open `/app`; select `Dashboard`. | Action Center appears first; supplier, recipient, and admin next steps are understandable. |
| Discover | `http://localhost:3000/app` | Select `Discover`. | Resources feel like operational surplus discovery, not shopping; filters and request actions are clear. |
| Requests | `http://localhost:3000/app` | Select `Requests`. | Awaiting my action, awaiting other party, active transfers, and closed work are separated. |
| Transfers | `http://localhost:3000/app` | Select `Transfers`. | Ready for handover, verification required, completed transfers, and exceptions are understandable. |
| Impact | `http://localhost:3000/app` | Select `Impact`. | AED value, resources redistributed, waste diverted, and certificate evidence feel credible. |
| Listings | `http://localhost:3000/app` | Open secondary `Supplier tools`; select `Listings`. | Supplier can understand how surplus listings are created or managed. |
| Organizations | `http://localhost:3000/app` | Open secondary `Workspace settings`; select `Organizations`. | Organization profile and verification context are understandable. |
| Certificates | `http://localhost:3000/app` | Open secondary `Operations admin`; select `Certificates`. | Certificate list, viewer, history, and QR context are clear; invalid downloads must not show demo evidence. |
| Documents | `http://localhost:3000/app` | Open secondary `Operations admin`; select `Documents`. | Document review status and expiry signals are understandable. |
| Verification | `http://localhost:3000/app` | Open secondary `Operations admin`; select `Verification`. | Verification queue and required review actions are clear. |
| Administration | `http://localhost:3000/app` | Open secondary `Operations admin`; select `Administration`. | Admin review tools are visibly secondary to organization workflow. |
| Settings | `http://localhost:3000/app` | Open secondary `Workspace settings`; select `Settings`. | Workspace controls are understandable and do not distract from daily workflow. |
| Mobile view | `http://localhost:3000/app` | Use browser device toolbar or a phone. | Dashboard, Discover, Requests, Transfers, Impact, and certificate evidence remain usable. |

Additional founder/admin preview:

| Area | Local review path | Founder checkpoints |
| --- | --- | --- |
| Pilot Monitoring | `http://localhost:3000/app/pilot-monitoring` | Founder-only monitoring page opens locally and pilot readiness signals are understandable. |

## Staging Deployment Checklist

Use Vercel or similar private preview hosting.

### Build Settings

- Framework: Next.js.
- Root directory: project root.
- Install command: `./.tools/pnpm install`.
- Build command: `./.tools/pnpm build`.
- Start command, if needed outside Vercel: `./.tools/pnpm start`.

### Environment Variables

Configure staging values only:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STAGING_APP_URL=
STAGING_PILOT_PASSWORD=
STAGING_REQUIRE_LIVE=true
```

Do not expose production credentials in preview.

### Private Access Protection

Before sharing the preview URL:

- Enable Vercel Deployment Protection, password protection, SSO, or an equivalent private access gate.
- Share the preview URL only with founder-approved reviewers.
- Do not index the preview; confirm `robots.txt` and hosting settings discourage public indexing.
- Use staging Supabase data only.

### Build Validation

Before review:

```bash
./.tools/pnpm test
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm lint
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

### Preview URL Record

| Field | Value |
| --- | --- |
| Preview URL |  |
| Deployment provider |  |
| Build ID / commit / tag |  |
| Access protection enabled |  |
| Reviewer |  |
| Review date |  |

## Go / No-Go For Founder Review

Start founder page-by-page review only when:

- Local or staging preview opens `/app` successfully.
- Build validation passes.
- Preview is private.
- Certificate invalid IDs return not found instead of demo evidence.
- Founder has the observation checklist ready for notes.
