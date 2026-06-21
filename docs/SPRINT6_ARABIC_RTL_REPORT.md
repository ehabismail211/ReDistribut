# Sprint 6 Arabic & RTL Report

Date: 2026-06-20

## Scope

Sprint 6 implemented Arabic and RTL support for the ReDist web MVP using:

- `docs/ARABIC_RTL_DESIGN.md`
- `docs/REDIST_DESIGN_SYSTEM.md`

The sprint focused only on responsive web Arabic/RTL readiness. No native mobile implementation, Resource Passport work, or unrelated feature development was started.

## Implemented

### 1. Language Switcher

Added a workspace language switcher with native labels:

- `English`
- `العربية`

The switcher is available in the workspace navigation and updates the interface immediately.

### 2. Persisted Language Preference

Language preference is persisted in browser local storage using:

- `redist-language`

When Arabic is selected, the workspace restores Arabic on reload and applies:

- `lang="ar"`
- `dir="rtl"`
- Arabic-aware formatting
- Arabic typography stack

### 3. Arabic Translations

Added a lightweight translation layer for the MVP workspace covering the highest-value operational surfaces:

- Navigation
- Dashboard
- Discover
- Verification
- Trust score
- Impact dashboard
- Transfer certificate viewer
- Public QR verification page
- Status labels
- Verification levels
- Trust levels
- Offer types
- Common UAE locations and categories

This is intentionally lightweight for Sprint 6. A production translation system should later move these strings into locale files or a localization service.

### 4. RTL Support

Implemented RTL handling through:

- Document-level `lang` and `dir` updates
- RTL workspace root attributes
- Logical text alignment
- Mirrored workspace sidebar on desktop
- RTL Discover layout ordering
- RTL certificate layout support
- RTL verification timeline alignment
- RTL-safe form alignment

The implementation preserves LTR behavior for technical fields such as email, URL, TRN, and document numbers.

### 5. Dashboard RTL

Dashboard now supports Arabic labels and RTL layout for:

- KPI cards
- Active listings
- Open requests
- Trust score
- Verification status
- Notifications preview
- Recent activity
- Organization setup

### 6. Discover RTL

Discover now supports Arabic/RTL for:

- Search area
- Search input with `dir="auto"`
- Sort controls
- Filter sidebar
- Category filters
- Listing cards
- Listing detail panel
- Request quantity/message controls
- Saved search placeholder

Tablet/mobile responsive behavior was adjusted so RTL Discover stacks cleanly instead of forcing the desktop three-column layout.

### 7. Verification RTL

Verification UI now supports Arabic/RTL for:

- Verification badge
- Verification status card
- Document status card
- Verification dashboard
- Verification document states
- Audit timeline alignment

### 8. Trust RTL

Trust UI now supports Arabic/RTL for:

- Trust badge
- Trust score card
- Trust explanation panel
- Score factor list
- Trust score numerals

### 9. Impact RTL

Impact UI now supports Arabic/RTL for:

- Impact KPI cards
- AED recovered
- Resources redistributed
- Waste prevented
- CO2 saved
- Completed transactions
- Trend cards
- Category and location breakdowns
- Platform impact dashboards
- Leaderboards

### 10. Certificate RTL Support

Certificate support now includes:

- Arabic/RTL internal certificate viewer
- Arabic labels in certificate metadata
- Arabic-aware date and number formatting
- Arabic public QR verification mode through `?lang=ar`
- RTL public verification page layout

## Formatting

### Currency

AED values now use `Intl.NumberFormat`:

- English: `en-AE`, `currency: AED`
- Arabic: `ar-AE`, `currency: AED`

### Dates

Certificate and workspace dates now use locale-aware formatting:

- English: `en-AE`
- Arabic: `ar-AE`

### Numbers

Counts and KPI values use:

- English: `en-US`
- Arabic: `ar-AE`

## Responsive Validation

Screenshots were captured with Playwright using the local app at:

- `http://127.0.0.1:3032`

### English

Desktop dashboard:

![Sprint 6 English Dashboard Desktop](screenshots/sprint6-dashboard-en-desktop.png)

Tablet Discover:

![Sprint 6 English Discover Tablet](screenshots/sprint6-discover-en-tablet.png)

Mobile Verification:

![Sprint 6 English Verification Mobile](screenshots/sprint6-verification-en-mobile.png)

### Arabic

Desktop dashboard:

![Sprint 6 Arabic Dashboard Desktop](screenshots/sprint6-dashboard-ar-desktop.png)

Tablet Discover:

![Sprint 6 Arabic Discover Tablet](screenshots/sprint6-discover-ar-tablet.png)

Tablet Impact:

![Sprint 6 Arabic Impact Tablet](screenshots/sprint6-impact-ar-tablet.png)

Mobile Verification:

![Sprint 6 Arabic Verification Mobile](screenshots/sprint6-verification-ar-mobile.png)

Mobile QR certificate verification:

![Sprint 6 Arabic QR Verification Mobile](screenshots/sprint6-certificate-qr-ar-mobile.png)

## Validation Results

| Validation | Result |
| --- | --- |
| Arabic workspace switch | Pass |
| English workspace switch | Pass |
| Language preference persistence | Pass |
| RTL document direction | Pass |
| Dashboard RTL | Pass |
| Discover RTL | Pass |
| Verification RTL | Pass |
| Trust RTL | Pass |
| Impact RTL | Pass |
| Certificate RTL | Pass |
| Desktop responsive validation | Pass |
| Tablet responsive validation | Pass |
| Mobile responsive validation | Pass |
| Public QR Arabic mode | Pass |

Commands completed successfully:

```bash
./.tools/pnpm typecheck
./.tools/pnpm build
./.tools/pnpm test
node scripts/simulation-runner.mjs
```

Results:

- Typecheck passed.
- Production build passed.
- Test suite passed: 25 tests.
- Simulation runner passed: 4/4 scenarios.

## Files Changed

- `apps/web/src/app/app/workspace.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/verify/certificates/[token]/page.tsx`
- `docs/SPRINT6_ARABIC_RTL_REPORT.md`
- `docs/screenshots/sprint6-dashboard-en-desktop.png`
- `docs/screenshots/sprint6-dashboard-ar-desktop.png`
- `docs/screenshots/sprint6-discover-en-tablet.png`
- `docs/screenshots/sprint6-discover-ar-tablet.png`
- `docs/screenshots/sprint6-impact-ar-tablet.png`
- `docs/screenshots/sprint6-verification-en-mobile.png`
- `docs/screenshots/sprint6-verification-ar-mobile.png`
- `docs/screenshots/sprint6-certificate-qr-ar-mobile.png`

## Known Limitations

- Translations are implemented as an MVP dictionary inside the workspace component. Production should extract translations into structured locale files.
- Some seeded business names, item names, descriptions, and audit details remain English because they represent demo data or user-generated content.
- Arabic route prefixes such as `/ar/app` are not implemented in this sprint.
- Server-side user preference persistence is not implemented yet; authenticated user language preference should later be stored with profile settings.
- Native mobile Arabic/RTL implementation was intentionally not started.

## Recommendation

Sprint 6 is ready for UAE pilot web validation. The product now supports an Arabic/RTL workspace experience across the most important MVP modules while preserving English behavior and existing workflow functionality.
