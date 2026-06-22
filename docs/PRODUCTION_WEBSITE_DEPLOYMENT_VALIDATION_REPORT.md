# ReDist Production Website Deployment Validation Report

Date: 2026-06-22  
Production deployment URL validated: `https://re-distribut-web.vercel.app`  
Intended brand domain: `https://redistribut.com`  
Commit deployed for configuration update: `71e34b3`

## Executive Summary

The ReDist marketing website is publicly available on the Vercel production alias and validates successfully across the MVP public pages, SEO metadata, sitemap, robots file, analytics configuration, and lead capture workflow.

Recommendation: **Conditional Go for outreach campaigns.**

Use `https://re-distribut-web.vercel.app` for controlled founder outreach immediately. Delay broader brand/public campaigns until `redistribut.com` is pointed to the Vercel deployment and verified, because `redistribut.com` currently still serves an older Hostinger page.

## Production URL Status

| URL | Status | Notes |
| --- | --- | --- |
| `https://re-distribut-web.vercel.app` | Live | Current Next.js marketing website, validated. |
| `https://redistribut.com` | Not cut over | Still serves older Hostinger static page. |
| `https://www.redistribut.com` | Not cut over | Still serves older Hostinger static page. |

## Deployment Configuration

| Area | Result | Notes |
| --- | --- | --- |
| Vercel production alias | Passed | Public website reachable. |
| SEO metadata | Passed | Titles, descriptions, canonical links, Open Graph, and Twitter metadata are present. |
| Sitemap | Passed | `/sitemap.xml` uses the active production alias. |
| Robots | Passed | `/robots.txt` points to the active production sitemap and disallows `/api/`. |
| Analytics | Configured | Added Vercel Analytics component. Event ingestion should be confirmed in the Vercel dashboard after traffic. |
| Lead capture endpoint | Passed | `POST /api/v1/leads` returns `201 Created`. |
| Founder review | Passed | Founder-authenticated lead read and status update work through the production alias. |

## Route Validation

| Route | Status | Title | Canonical |
| --- | --- | --- | --- |
| `/` | `200` | `ReDist | Trusted surplus redistribution for UAE organizations` | `https://re-distribut-web.vercel.app` |
| `/how-it-works` | `200` | `How It Works | ReDist` | `https://re-distribut-web.vercel.app/how-it-works` |
| `/suppliers` | `200` | `For Suppliers | ReDist` | `https://re-distribut-web.vercel.app/suppliers` |
| `/recipients` | `200` | `For Recipients | ReDist` | `https://re-distribut-web.vercel.app/recipients` |
| `/faq` | `200` | `FAQ | ReDist` | `https://re-distribut-web.vercel.app/faq` |
| `/contact` | `200` | `Contact | ReDist` | `https://re-distribut-web.vercel.app/contact` |

All validated routes include an H1 and a contact/conversion path.

## Lead Capture Validation

Production alias lead test:

```json
{
  "submit": {
    "status": 201,
    "ok": true
  },
  "founderAuth": {
    "ok": true
  },
  "read": {
    "status": 200,
    "ok": true,
    "found": true
  },
  "update": {
    "status": 200,
    "ok": true,
    "persistedStatus": "contacted"
  }
}
```

Validation records were created in the lead table and should be archived from `/app/leads` after review.

## Mobile Validation

Mobile viewport tested at `390 x 844` on `/contact`.

Result:

```json
{
  "horizontalOverflow": false,
  "visibleControlCount": 12,
  "visibleControlsWithinViewport": true,
  "formGridColumns": "single column"
}
```

Screenshot capture timed out in the in-app browser after Supabase dashboard use, but DOM/layout validation confirmed that visible form controls fit within the mobile viewport and no horizontal overflow is present.

## Validation Commands

Local validation after deployment configuration changes:

- `./.tools/pnpm test`: passed, `63/63`
- `./.tools/pnpm typecheck`: passed
- `./.tools/pnpm build`: passed
- `./.tools/pnpm lint`: passed

## Files Changed

- `apps/web/package.json`
- `pnpm-lock.yaml`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/lib/site-url.ts`
- `docs/PRODUCTION_WEBSITE_DEPLOYMENT_VALIDATION_REPORT.md`

## Remaining Production Cutover Tasks

Before broad public campaigns:

1. Add `redistribut.com` and `www.redistribut.com` to the Vercel project.
2. Update DNS at Hostinger to point the domain to Vercel.
3. Set `NEXT_PUBLIC_APP_URL=https://redistribut.com` in Vercel production environment.
4. Redeploy production.
5. Revalidate:
   - `https://redistribut.com`
   - `https://www.redistribut.com`
   - `/sitemap.xml`
   - `/robots.txt`
   - lead capture
   - Vercel Analytics event ingestion

## Final Recommendation

**Conditional Go for outreach campaigns.**

Approved now:

- Founder-led, controlled outreach using `https://re-distribut-web.vercel.app`.
- Direct conversations, pilot invitations, and partner review where the Vercel URL is acceptable.

Hold until domain cutover:

- Broad public launch messaging.
- Website links in press-style materials.
- Paid campaigns or public SEO promotion.
- Any campaign that should use the brand domain `redistribut.com`.
