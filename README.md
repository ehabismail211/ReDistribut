# ReDist

ReDist, short for Redistribut, is a circular inventory exchange platform for
businesses, charities, and approved organizations. It helps owners publish
excess, near-expiry, and slow-moving stock so other organizations can request,
reserve, collect, and complete a controlled handover.

Primary domain: `redistribut.com`

## What Is In This Workspace

- `apps/web` - Next.js web app and `/api/v1` route handlers.
- `packages/shared` - shared TypeScript validation schemas and domain types.
- `supabase/migrations` - PostgreSQL schema, Row Level Security, and workflow RPCs.
- `public/brand` - current Redistribut logo assets from the original concept files.
- `docs` - product interpretation, setup, deployment, and roadmap notes.
- `apps/mobile` - placeholder for the later Expo app.

## First Build Slice

1. Register and create an organization.
2. Publish a safe, non-regulated listing.
3. Discover and filter listings.
4. Request a quantity.
5. Owner accepts and reserves quantity transactionally.
6. Requester or owner completes the handover.
7. Audit history records the sensitive workflow actions.

## Local Setup

This repository expects Node.js 24 LTS and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Apply the Supabase migrations in order:

```text
supabase/migrations/202606060001_initial_redistribut.sql
supabase/migrations/202606130001_mvp_expansion.sql
```

Never put a Supabase service-role key in browser or mobile code.
