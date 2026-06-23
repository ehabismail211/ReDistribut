# ReDist Current Release Notes

Date: 2026-06-22  
Branch: `main`  
Production URL: `https://www.redistribut.com`  
Founder dashboard URL: `https://www.redistribut.com/app/founder`
Founder leads URL: `https://www.redistribut.com/app/leads`  
Public Help Center URL: `https://www.redistribut.com/help`  
Workspace Help Center URL: `https://www.redistribut.com/app/help`

Update: 2026-06-23 - Final UAE launch coverage, visual QA, and production release sync.

## Summary

This release consolidates the pending founder-operations, lead-management, notification, and Help Center work into a clean repository state before the next customer-facing release. It also includes the latest customer-facing portfolio and presentation documentation created after the Help Center work.

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
- Added lead overview, meeting tracking, pilot tracking, pipeline segment counts, conversion funnel, and founder KPIs.
- Protected the route with the existing `founder.route.access` middleware permission.
- Added regression tests for dashboard content, styling, lead-source reuse, and route protection.

### Lead Review And Pipeline Tracking

- Expanded `/app/leads` to support lead status, meeting status, and pilot status updates.
- Added pipeline states for scheduled meetings, completed meetings, follow-up required, invited pilots, accepted pilots, onboarding, active pilots, completed pilots, and archived leads.
- Added Supabase migration `202606220002_marketing_lead_pipeline_tracking.sql` for meeting and pilot tracking fields.
- Updated lead management workflow documentation for founder-operated use.

### Lead Email Notification Workflow

- Added server-side lead notification support using `RESEND_API_KEY`.
- Notifications run only after successful lead persistence.
- If email delivery fails, the lead remains saved and the error is logged.
- Notification emails include lead details and a direct dashboard link to `/app/leads?lead=<lead-id>`.
- Added `docs/LEAD_NOTIFICATION_WORKFLOW.md`.

### Founder Access And Private Navigation

- Confirmed `/app/founder` and `/app/leads` are founder-only through `founder.route.access`.
- Added unauthorized redirect messaging for founder-only workspace routes.
- Added founder workspace links for Founder Dashboard, Leads, and Pilot Pipeline.
- Added `docs/FOUNDER_DASHBOARD_ACCESS_GUIDE.md`.

### Help Center And Documentation Access

- Added public Help Center at `/help`.
- Added workspace Help Center at `/app/help`.
- Added Help Center links to public navigation, footer navigation, and workspace Support navigation.
- Published user-manual screenshots under `/help/` for public and workspace documentation.
- Added bilingual sections for Quick Start, User Manual, Supplier Guide, Recipient Guide, Requests/Transfers, Certificates/Impact, and FAQ access.
- Updated the Help Center UX so English and Arabic manuals display one language at a time based on the selected `redist-language` preference, instead of showing both languages together in each section.
- `/help` and `/app/help` now include an explicit manual language selector for English and Arabic guidance.
- Added `docs/HELP_CENTER_RELEASE_NOTES.md`.

### Customer-Facing Portfolio And Presentation Docs

- Added founder business portfolio, supplier/recipient/partner meeting packs, executive one-pager, discovery question library, meeting evaluation form, and pilot qualification checklist.
- Added executive, supplier, recipient, and partnership deck structures plus printable meeting pack guidance.
- Added official exported ReDist executive presentation assets under `docs/exports/`:
  - `redist-executive-presentation.pptx`
  - `redist-executive-presentation.pdf`
  - `redist-executive-presentation-contact-sheet.png`
- The older desktop `ReDistribution.pdf` was replaced manually with the updated executive PDF, with a timestamped local backup kept outside the repository.
- Temporary generation folders `output/` and `outputs/` are ignored; official customer-facing exports should live in `docs/exports/`.
- These are documentation/design assets only and do not change product behavior.

### Final UAE Launch Coverage QA

- Expanded workspace Arabic coverage for UAE locations, areas, category labels, help callouts, simulated organizations, and simulated listings.
- Added all UAE emirates plus `Other UAE location` support for founder-guided pilot workflows.
- Expanded safe redistribution categories for furniture, office equipment, shelving/storage, packaging, warehouse stock, hospitality supplies, textiles, kitchen equipment, electronics/accessories, school/community supplies, tools, event materials, and `Other category`.
- Added `Other subcategory` fallback coverage while keeping regulated medical/pharmaceutical and hazardous categories restricted for the early pilot.
- Added workflow help callouts for account setup, listing creation, resource discovery, requests, transfers, certificates, and UAE location settings.
- Added clearly labeled virtual/test organizations and simulated listings for continued validation before real pilot organizations are active.
- Added final coverage regression test `scripts/final-uae-launch-coverage.test.mjs`.
- Added `docs/FINAL_UAE_LAUNCH_COVERAGE_QA_REPORT.md`.

## Validation Results

Latest validation before release commit:

```bash
./.tools/pnpm test       # 84/84 passed
./.tools/pnpm typecheck  # passed
./.tools/pnpm build      # passed
./.tools/pnpm lint       # passed
```

## Security And Secret Check

- `.env.local`, `.env.staging.local`, `.env.production.local`, `node_modules`, `.next`, and build outputs remain ignored.
- No service role keys, API tokens, Vercel tokens, or local secrets were staged for commit.
- Only environment example files are tracked.
- Lead notification variables are documented as placeholders only:
  - `RESEND_API_KEY`
  - `LEAD_NOTIFICATION_TO`
  - `LEAD_NOTIFICATION_FROM`

## Known Remaining Caveats

- Public Terms and Privacy pages are still framework language and require formal UAE legal/privacy review before broad commercial self-serve launch.
- Arabic SEO is client-side/localized in the current website experience; dedicated `/ar` routes and hreflang metadata remain future improvements.
- Founder should run a final authenticated production smoke test after deployment: submit a test lead, verify it appears in `/app/leads`, update status, then archive the test lead.
- The founder dashboard depends on configured Supabase lead storage and `SUPABASE_SERVICE_ROLE_KEY` in the deployment environment.
- Lead email delivery requires production/staging email provider configuration and verified sender/domain settings.
- Meeting and pilot tracking require the Supabase pipeline tracking migration to be applied in the target hosted environment.
- Help Center screenshots are static documentation images and should be refreshed after major UI changes.
- Public marketing localization still uses the current client-side language approach; dedicated localized routes remain a future improvement before broad paid acquisition.
- Simulated/test organizations and listings must not be represented as real pilot evidence.

## Release Recommendation

**Go** for founder-guided UAE outreach using the brand domain and founder-managed onboarding flow. Continue to avoid broad unguided public self-serve onboarding until legal pages are formally reviewed and production operations are staffed or scheduled.
