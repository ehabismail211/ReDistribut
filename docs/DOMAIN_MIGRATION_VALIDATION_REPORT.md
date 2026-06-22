# ReDist Brand Domain Migration Validation Report

Date: 2026-06-22  
Domain: `redistribut.com`  
Target platform: Vercel project `re-distribut-web`  
Current recommendation: **Go**

## Executive Summary

The Redistribut brand domain has been connected to the Vercel project and Hostinger DNS has been updated from the previous Hostinger CDN records to Vercel routing records.

DNS is resolving to Vercel, HTTPS is active, the apex domain redirects to `www.redistribut.com`, and the ReDist marketing website is reachable on the brand domain. Brand-domain metadata now uses `https://www.redistribut.com`, sitemap entries use the brand host, and lead creation from the brand domain returned a successful `201` response.

No product features were added.

## Domain Configuration

### Vercel Domains

The following domains were added to the Vercel project:

| Domain | Intended behavior | Status |
| --- | --- | --- |
| `redistribut.com` | Apex domain, redirects to `www.redistribut.com` | Added in Vercel; DNS now points to Vercel |
| `www.redistribut.com` | Primary public website hostname | Added in Vercel; DNS now points to Vercel |

Vercel selected the recommended behavior to redirect the apex domain to `www.redistribut.com`.

## Hostinger DNS Changes Applied

Hostinger nameservers remain active:

- `apollo.dns-parking.com`
- `athena.dns-parking.com`

The DNS records were updated as follows:

| Host | Type | Previous value | New value | Status |
| --- | --- | --- | --- | --- |
| `@` | `ALIAS` | `redistribut.com.cdn.hstgr.net` | Removed | Complete |
| `@` | `A` | none | `216.198.79.1` | Complete |
| `www` | `CNAME` | `www.redistribut.com.cdn.hstgr.net` | `bde4461575f74123.vercel-dns-017.com` | Complete |
| `ftp` | `A` | `82.25.120.152` | unchanged | Left untouched |

Mail, TXT, ownership, and unrelated records were not changed.

## DNS Validation

Terminal checks after DNS update:

```text
redistribut.com A
216.198.79.1

www.redistribut.com CNAME
bde4461575f74123.vercel-dns-017.com.
```

Result: **DNS cutover to Vercel confirmed.**

## Website Validation

| Check | Result | Notes |
| --- | --- | --- |
| `http://redistribut.com` | Pass | Vercel returns `308` redirect to `https://www.redistribut.com/` |
| `http://www.redistribut.com` | Pass | Vercel serves the ReDist marketing website |
| `https://redistribut.com` | Pass | Vercel returns `308` redirect to `https://www.redistribut.com/` |
| `https://www.redistribut.com` | Pass | Vercel serves the ReDist marketing website with `200` |
| Home page content | Pass | ReDist marketing page is served by Vercel |
| Sitemap route | Pass | `/sitemap.xml` returns `200` from Vercel |
| Robots route | Pass | `/robots.txt` returns `200` from Vercel |

## SEO URL Configuration

The app URL helper was updated so generated canonicals, Open Graph URLs, sitemap URLs, and robots host references default to the brand domain:

```text
https://www.redistribut.com
```

`NEXT_PUBLIC_APP_URL` remains supported and should be set to `https://www.redistribut.com` in Vercel production for explicit environment control.

Validation after redeploy:

```text
canonical: https://www.redistribut.com
og:url: https://www.redistribut.com
sitemap URLs: https://www.redistribut.com/...
```

## Lead Capture Validation

Lead capture was validated on the brand domain:

- Endpoint: `https://www.redistribut.com/api/v1/leads`
- Result: `201 Created`
- Test lead ID: `aa43c852-78ca-46c3-8180-ffdae5a016df`
- Test lead status: `new`

Founder lead review protection was also checked:

- `/app/leads` redirects unauthenticated requests to `/app?permission=denied&route=founder%20lead%20review%20route`.
- This confirms the review dashboard is not public.

Remaining authenticated founder check:

1. Sign in as founder/admin.
2. Open `https://www.redistribut.com/app/leads`.
3. Confirm the test lead appears.
4. Archive or update the test lead status.

## Mobile Validation

Mobile browser access was checked with a mobile Safari user agent against `https://www.redistribut.com/contact`; the route returned `200` from Vercel. Founder device review is still recommended before a large campaign, but there is no technical mobile-access blocker from this validation.

Required recheck after HTTPS is available:

- Home
- How It Works
- Suppliers
- Recipients
- FAQ
- Contact
- Lead capture submission

## Remaining Gates

### Recommended Operational Follow-Up

1. **Set explicit Vercel environment variable**
   - Recommended value:
     - `NEXT_PUBLIC_APP_URL=https://www.redistribut.com`
   - This is not a code feature; it makes the production URL explicit in deployment settings.

2. **Archive the test lead**
   - Test lead ID: `aa43c852-78ca-46c3-8180-ffdae5a016df`
   - Recommended founder action: open `/app/leads` while authenticated and archive or mark the test lead.

## Post-Propagation Checklist

Run these checks before public outreach:

```bash
dig +short A redistribut.com
dig +short CNAME www.redistribut.com
curl -I -L https://redistribut.com
curl -I -L https://www.redistribut.com
curl -s https://www.redistribut.com | rg 'canonical|og:url'
curl -I https://www.redistribut.com/sitemap.xml
curl -I https://www.redistribut.com/robots.txt
```

Expected result:

- Apex `A` resolves to Vercel.
- `www` CNAME resolves to Vercel.
- HTTPS returns `200` or expected redirect chain.
- Canonical and Open Graph URLs use `https://www.redistribut.com`, matching the Vercel primary hostname.
- Sitemap and robots are available over HTTPS.
- Lead capture works from the brand domain.

## Recommendation

**Go** for brand-domain migration.

DNS, HTTPS, routing, metadata, sitemap, robots, public pages, mobile access, and lead creation are working on `https://www.redistribut.com`. Public outreach can use the brand domain. The founder should archive the internal test lead during the next authenticated lead-dashboard review.
