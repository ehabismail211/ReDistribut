# ReDist Current Release Notes

Date: 2026-06-22  
Branch: `main`  
Production URL: `https://www.redistribut.com`  
Founder dashboard URL: `https://www.redistribut.com/app/founder`

## Summary

This release consolidates the pending launch-readiness work into a clean repository state before the next feature cycle. It includes public legal framework pages, bilingual user documentation, refreshed brand identity assets, expanded Arabic/customer-facing polish, and a founder-only revenue and pipeline dashboard.

## Included Changes

### Legal Pages And Launch Audit

- Added public `/terms` and `/privacy` framework pages.
- Added footer links for Terms and Privacy.
- Added Terms and Privacy to the sitemap.
- Updated the final launch readiness audit to reflect public legal framework availability and remaining legal-review caveats.

### Bilingual User Manuals And Screenshots

- Added bilingual English/Arabic end-user manual.
- Added supplier, recipient, administrator, and quick-start guides.
- Added real screenshot assets for public website, contact, dashboard, discover, request, transfer, certificate, and impact walkthroughs.

### Arabic And Brand Identity Polish

- Added refreshed ReDist SVG and PNG brand assets.
- Updated marketing, workspace, certificate, and public verification surfaces to use the new brand mark.
- Expanded Arabic public-language coverage for legal pages and related public website copy.

### Founder Dashboard Feature

- Added founder-only `/app/founder` revenue and pipeline dashboard.
- Reused existing `marketing_leads` data and statuses.
- Added lead overview, pipeline segment counts, conversion funnel, and founder KPIs.
- Protected the route with the existing `founder.route.access` middleware permission.
- Added regression tests for dashboard content, styling, lead-source reuse, and route protection.

## Validation Results

Latest validation before release commit:

```bash
./.tools/pnpm test       # 72/72 passed
./.tools/pnpm typecheck  # passed
./.tools/pnpm build      # passed
./.tools/pnpm lint       # passed
```

## Security And Secret Check

- `.env.local`, `.env.staging.local`, `.env.production.local`, `node_modules`, `.next`, and build outputs remain ignored.
- No service role keys, API tokens, Vercel tokens, or local secrets were staged for commit.
- Only environment example files are tracked.

## Known Remaining Caveats

- Public Terms and Privacy pages are still framework language and require formal UAE legal/privacy review before broad commercial self-serve launch.
- Arabic SEO is client-side/localized in the current website experience; dedicated `/ar` routes and hreflang metadata remain future improvements.
- Founder should run a final authenticated production smoke test after deployment: submit a test lead, verify it appears in `/app/leads`, update status, then archive the test lead.
- The founder dashboard depends on configured Supabase lead storage and `SUPABASE_SERVICE_ROLE_KEY` in the deployment environment.

## Release Recommendation

**Conditional Go** for founder-led outreach using the brand domain and founder-managed onboarding flow. Continue to avoid broad unguided public self-serve onboarding until legal pages are formally reviewed and production operations are staffed or scheduled.
