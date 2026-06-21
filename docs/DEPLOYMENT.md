# Redistribut.com Deployment Notes

## Domain

Use `redistribut.com` for the first public web app. Add `app.redistribut.com`
only when the signed-in workspace needs to be separated from the public site.

Production environment:

```text
NEXT_PUBLIC_APP_URL=https://redistribut.com
NEXT_PUBLIC_SUPABASE_URL=https://<redistribut-prod>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable anon key>
```

## Hostinger

For DNS:

- `redistribut.com` should point to the selected web deployment target.
- `www.redistribut.com` should redirect to `redistribut.com`.
- Configure SSL.
- Set production environment variables in the hosting control panel.
- Keep service-role secrets server-only and never expose them to browser code.

This workspace uses Next.js route handlers under `/api/v1`, so the full app
needs a Node-capable hosting target. If the current Hostinger plan only supports
static uploads, use one of these options:

- Hostinger VPS or Node.js hosting for the full Next.js app.
- Deploy the Next.js app to a Node-capable platform and point Hostinger DNS to it.
- Deploy only a static marketing site on Hostinger and keep app/API on a subdomain
  later.

## Supabase

Use a dedicated Redistribut Supabase project. Do not share credentials or data
with other products.

Before real users:

- Upgrade for managed backups.
- Configure custom SMTP.
- Review authentication rate limits.
- Create private storage buckets for listing images and documents.
- Test backup restore.
- Review Row Level Security policies.

## Production Build

From the repository root:

```bash
PATH="/Users/ehabismail/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./.tools/pnpm install
PATH="/Users/ehabismail/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./.tools/pnpm build
```

Run the production server from `apps/web`:

```bash
PATH="/Users/ehabismail/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../.tools/pnpm start
```

## Current Status

- Public website shell: ready.
- API route shell: ready.
- Supabase migrations: ready to apply.
- Production DNS: requires access to Hostinger DNS.
- Production Supabase project: should be configured before real user data.
