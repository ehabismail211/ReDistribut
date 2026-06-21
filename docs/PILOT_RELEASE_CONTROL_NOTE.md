# Pilot Release Control Note

Date: 2026-06-21

## Current Status

`/Users/ehabismail/Documents/Redistribution` is now under git release control for the UAE Pilot Wave 1 baseline.

Baseline:

- Branch: `main`
- Baseline tag: `pilot-wave1-baseline-v0.1`
- Baseline commit message: `chore: establish ReDist pilot baseline`

## Branch Strategy

- `main`: stable baseline branch for founder-approved pilot releases.
- `pilot/wave-1-readiness`: optional working branch for post-baseline hardening before broader rollout.
- Feature branches: use only after the pilot baseline is protected and named clearly, for example `fix/certificate-download-guard`.
- Deploy only from `main` or a founder-approved pilot tag.

## Tag Strategy

- `pilot-wave1-baseline-v0.1`: first controlled pilot baseline.
- Future pilot release candidates should use `pilot-wave1-rcN`, for example `pilot-wave1-rc2`.
- Do not move existing pilot tags after sharing a preview or inviting organizations.

## Rollback Command

To inspect the pilot baseline:

```bash
cd /Users/ehabismail/Documents/Redistribution
git checkout pilot-wave1-baseline-v0.1
```

To return to active development:

```bash
git checkout main
```

For production deployment rollback, deploy the artifact or commit referenced by `pilot-wave1-baseline-v0.1` through the hosting provider rather than editing files manually.

## Release Checklist

- Run `./.tools/pnpm test`.
- Run `./.tools/pnpm typecheck`.
- Run `./.tools/pnpm build`.
- Run `./.tools/pnpm lint`.
- Confirm `git status --short` shows no unexpected product changes.
- Confirm `.env.staging.local`, `.env.local`, `node_modules`, `.next`, `dist`, and `.tools` are not staged.
- Confirm staging preview is private before sharing.
- Confirm invalid certificate download IDs return `404`.
- Record preview URL, branch, commit hash, tag, and reviewer in the live preview guide.

## What Must Never Be Committed

- `.env`
- `.env.local`
- `.env.*.local`
- `.env.staging.local`
- `.env.production.local`
- Supabase service role keys
- API keys, passwords, personal tokens, private keys, certificates, or credential exports
- Database dumps or production data exports
- `node_modules`
- `.next`
- `dist`
- `.tools`
- `*.tsbuildinfo`
- Logs, screenshots containing credentials, or local debug artifacts

## Tooling Note

The local `.tools/pnpm` binary is intentionally ignored as a local tool artifact. The repository records the package manager in `package.json`; deployment environments should install/use pnpm through their standard package manager support or restore the local tool outside git.
