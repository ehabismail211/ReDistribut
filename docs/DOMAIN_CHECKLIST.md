# Redistribut.com Website Checklist

## Ready In This Repo

- Canonical domain metadata for `https://redistribut.com`.
- Open Graph and Twitter metadata.
- `robots.txt`.
- `sitemap.xml`.
- Web app manifest.
- Public brand assets.
- Production environment example.
- Build-tested Next.js app.

## Needed In Hostinger

- DNS access for `redistribut.com`.
- SSL enabled.
- `www.redistribut.com` redirect to `redistribut.com`.
- Hosting target selected:
  - Node-capable Hostinger environment or VPS for the full app.
  - External Node-capable deployment with Hostinger DNS pointing to it.

## Needed In Supabase

- Dedicated production project, for example `redistribut-prod`.
- Migrations applied in order.
- Email auth configured.
- Site URL set to `https://redistribut.com`.
- Redirect URLs configured for local and production.
- Private storage buckets created before image uploads go live.

## Launch Gate

Do not accept real production users until backups, SMTP, RLS review, and recovery
testing are complete.
