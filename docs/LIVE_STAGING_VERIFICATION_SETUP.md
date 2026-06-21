# Live Staging Verification Setup

Project: ReDist  
Purpose: Configure the final live staging gate before inviting pilot organizations.

## Setup

Create a local staging env file from the template:

```bash
cp .env.staging.example .env.staging.local
```

Fill in:

```bash
STAGING_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STAGING_PILOT_PASSWORD=
STAGING_REQUIRE_LIVE=true
```

`scripts/staging-pilot-validation.mjs` automatically loads:

- `.env.staging.local`
- `.env.staging`
- `.env.local`

Do not commit `.env.staging.local`.

## Run

```bash
./.tools/pnpm staging:validate
```

For an explicit strict run:

```bash
STAGING_REQUIRE_LIVE=true ./.tools/pnpm staging:validate
```

## Pass Criteria

The live runner must pass:

- Founder login
- Platform Admin login
- Reviewer login
- Pilot Coordinator login
- Organization Admin login
- Organization User login
- Logout
- Role assignment
- Route protection
- API protection
- Cross-tenant denial
- Audit logging
- Certificate generation
- Certificate QR verification
- Trust updates
- Impact updates

## Decision

Only invite real pilot organizations after the strict live runner passes with zero failures.
