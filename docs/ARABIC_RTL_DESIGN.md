# Arabic & RTL Design

Date: 2026-06-20

## Purpose

ReDist should launch UAE-first with an English interface that is structurally ready for Arabic and RTL. Arabic should feel native, enterprise-grade, and operationally precise, not like a literal afterthought layered onto an English marketplace UI.

This document defines the design direction for Arabic, RTL, and bilingual UAE workflows. It is a planning document only. No implementation is included.

## Principles

- Arabic readiness should be designed into layout, typography, data models, validation, and content operations.
- RTL support should use logical layout rules rather than duplicated UI.
- English and Arabic should share the same product structure, trust model, verification language, and impact methodology.
- Arabic content should be professional and businesslike, avoiding charity-style wording.
- Bilingual UAE workflows should support organizations that operate in English, Arabic, or both.
- Native mobile should not begin before responsive web Arabic/RTL is proven.

## Language Switch

### Recommended Placement

Public site:

- Header language switch near account/sign-in controls.
- Footer language switch for secondary access.
- Mobile menu language switch near the top of the drawer.

Workspace:

- User/account menu language preference.
- Settings page language preference.
- Optional compact switch in the app shell for pilot testing.

Admin:

- User preference in admin profile.
- Do not force all admin views into Arabic unless the admin explicitly chooses Arabic.

### Behavior

Language switch should:

- Persist per user when authenticated.
- Persist in browser storage for public/guest users.
- Respect URL locale when present.
- Preserve the current page/record context when switching.
- Change text direction, typography, date formatting, and number formatting together.

Recommended URL strategy:

```text
/en
/ar
/en/app/dashboard
/ar/app/dashboard
```

Alternative query-string switching is acceptable for an early pilot but should not be the final production model.

### Language Labels

Use native labels:

- `English`
- `العربية`

Avoid flags for language selection because the UAE is bilingual and Arabic is not country-specific.

## RTL Strategy

### Direction Model

Use document-level and route-level direction:

```html
<html lang="ar" dir="rtl">
<html lang="en" dir="ltr">
```

Component-level `dir="auto"` should be reserved for user-generated text fields where mixed English/Arabic content can appear.

### CSS Strategy

Use logical CSS properties:

- `margin-inline-start`
- `margin-inline-end`
- `padding-inline-start`
- `padding-inline-end`
- `border-inline-start`
- `border-inline-end`
- `inset-inline-start`
- `inset-inline-end`
- `text-align: start`
- `text-align: end`

Avoid hard-coded directional styling:

- Avoid `margin-left` / `margin-right` for layout semantics.
- Avoid `left` / `right` for positioned UI when logical properties can be used.
- Avoid directional icons that do not mirror.

### Mirroring Rules

Mirror:

- Navigation sidebars
- Breadcrumb order
- Drawers
- Form label alignment
- Table action columns
- Stepper direction
- Timeline alignment
- Back/forward chevrons
- Pagination arrows
- Toast position

Do not mirror:

- Numbers
- Currency codes such as AED
- Email addresses
- URLs
- SKU/reference IDs
- Certificate numbers
- QR codes
- Maps unless the map provider handles locale
- Brand marks

### Icons

Directional icons must flip in RTL:

- Arrow left/right
- Chevron left/right
- Send
- Login/logout direction indicators
- Timeline arrows

Semantic icons should not flip:

- Shield
- Award
- Bell
- File
- QR code
- Package
- Check
- Warning

## Typography

Recommended font stack:

```css
font-family: Inter, "IBM Plex Sans Arabic", "Noto Sans Arabic", system-ui, sans-serif;
```

Arabic production font candidates:

- IBM Plex Sans Arabic
- Noto Sans Arabic
- Cairo
- DIN Next Arabic, if a licensed enterprise font is preferred

Typography rules:

- Test Arabic at small sizes in KPI cards, tables, badges, and navigation.
- Arabic text often needs slightly more line height than English.
- Avoid compressed Arabic typography in dense tables.
- Do not use negative letter spacing.
- Keep numerals readable and consistent across Arabic and English contexts.

Recommended line height:

| UI Area | Arabic Line Height |
| --- | ---: |
| Navigation | 1.35 |
| Cards | 1.45 |
| Paragraphs | 1.65 |
| Tables | 1.4 |
| Forms/help text | 1.5 |

## Dashboard Adaptation

Dashboard pages must remain scannable in Arabic.

### Layout

For RTL:

- Sidebar moves to the right.
- Primary content flows from right to left.
- KPI grid order starts from the top-right.
- Detail/action panels should appear on the left when paired with a main content area.
- Timelines should anchor on the right.

### KPI Cards

KPI cards should:

- Use `text-align: start`.
- Keep numbers visually dominant.
- Keep labels short and professionally translated.
- Preserve metric order across languages where possible.

Metric labels:

| English | Arabic Recommendation |
| --- | --- |
| AED Recovered | القيمة المستردة بالدرهم |
| Resources Redistributed | الموارد المعاد توزيعها |
| Waste Prevented | النفايات المتجنبة |
| Estimated CO2 Saved | الانبعاثات المقدرة المتجنبة |
| Completed Transactions | عمليات التحويل المكتملة |
| Active Listings | العروض النشطة |
| Active Requests | الطلبات النشطة |

### Charts

Charts should:

- Keep axis numbers LTR.
- Translate labels and legends.
- Place legends using logical alignment.
- Avoid overcrowding Arabic labels; abbreviate cautiously.
- Use tooltip layouts that support both directions.

## Discover Adaptation

Discover is one of the highest-risk Arabic/RTL areas because it combines search, filters, categories, cards, and details.

### Search

Search should:

- Accept Arabic and English queries.
- Support mixed-script category and item names.
- Use `dir="auto"` for the search input.
- Preserve filters when switching language.
- Use bilingual synonym support over time.

Examples:

- `food`, `طعام`, `وجبات`
- `packaging`, `تغليف`, `كراتين`
- `furniture`, `أثاث`, `كراسي`

### Filter Sidebar

For RTL:

- Desktop filter sidebar should move to the right.
- Mobile filter drawer should slide from the right.
- Checkboxes/toggles should place controls at inline-start.
- Filter count badges should remain close to the filter label.

### Listing Cards

Listing cards should:

- Show organization verification and trust badges in RTL order.
- Keep quantity/unit readable with correct number direction.
- Avoid truncating Arabic category names too aggressively.
- Use bilingual category slugs internally but localized display names in UI.

### Listing Details

Listing detail pages should:

- Show transfer/request actions using Arabic verbs.
- Keep handover instructions readable with generous line height.
- Preserve certificate numbers, QR tokens, and reference IDs as LTR inline text.

## Forms Adaptation

Forms must support bilingual organization data and UAE verification requirements.

### Field Alignment

For RTL:

- Labels align to start.
- Inputs inherit `dir` based on locale unless the field requires LTR.
- Help text appears below fields and aligns to start.
- Validation errors appear near the field and should not rely only on color.

### LTR Fields Inside Arabic UI

Keep these fields LTR:

- Email
- URL
- Phone number where entered in international format
- TRN/VAT number
- Trade license number
- Certificate number
- QR token
- API keys
- Postal/reference IDs

Use:

```html
dir="ltr"
inputmode="email|tel|numeric"
```

### Bilingual Organization Fields

Recommended production fields:

- `legal_name_en`
- `legal_name_ar`
- `trade_name_en`
- `trade_name_ar`
- `description_en`
- `description_ar`
- `address_en`
- `address_ar`

Arabic fields should be optional at early pilot stage but required for public Arabic organization profiles before public Arabic launch.

### Form Copy

Avoid literal translations. Arabic form labels should be concise and familiar to UAE business users.

Examples:

| English | Arabic Recommendation |
| --- | --- |
| Trade Name | الاسم التجاري |
| Legal Name | الاسم القانوني |
| Trade License | الرخصة التجارية |
| VAT/TRN | الرقم الضريبي / TRN |
| Authorized Contact | جهة الاتصال المخولة |
| Handover Method | طريقة التسليم |
| Submit for Review | إرسال للمراجعة |

## Tables Adaptation

Tables are common in admin, audit logs, requests, certificates, and verification review.

### Desktop Tables

For RTL:

- Row reading starts from the right.
- Primary entity column appears on the right.
- Actions appear on the left.
- Sort icons mirror with their column labels.
- Numeric columns can align end, but IDs/reference numbers should remain LTR.

Recommended order for Arabic request tables:

1. Listing/request title
2. Organization
3. Quantity
4. Status
5. Date
6. Actions

### Mobile Tables

Convert tables to stacked cards:

- Header/title at top.
- Status badge near title.
- Key facts in two-column or stacked rows.
- Actions at bottom.
- Use Arabic labels for field names.
- Keep reference numbers LTR.

### Audit Tables

Audit log tables should:

- Keep event IDs and timestamps machine-readable.
- Translate event labels, not event codes.
- Allow admins to copy raw event codes.
- Use localized display text over canonical stored values.

Example:

```text
certificate.issued → تم إصدار شهادة التحويل
handover.completed → تم إكمال التسليم
verification.approved → تمت الموافقة على التحقق
```

## Notifications Adaptation

Notifications should be localized and direction-aware.

### Placement

For Arabic/RTL:

- Toasts appear at top-left if the app shell sidebar is on the right.
- Notification drawer opens from the left only if the main nav is right-aligned; otherwise open from inline-end consistently.
- Badge placement should use logical positioning.

### Content

Notifications should:

- Use short Arabic titles.
- Use full Arabic body copy for user-facing messages.
- Keep entity names as entered by organizations.
- Keep certificate numbers and reference IDs LTR.
- Deep link to the same target as English notifications.

Examples:

| Event | English | Arabic Recommendation |
| --- | --- | --- |
| Request received | Request received | تم استلام طلب |
| Handover completed | Handover completed | تم إكمال التسليم |
| Certificate issued | Transfer certificate issued | تم إصدار شهادة التحويل |
| Verification submitted | Verification submitted | تم إرسال طلب التحقق |
| Document expired | Document expired | انتهت صلاحية المستند |

### Email Notifications

Email templates should:

- Use `dir="rtl"` for Arabic emails.
- Use Arabic subject lines.
- Keep mixed LTR tokens wrapped with `dir="ltr"`.
- Include English fallback only when the organization preference is bilingual.

## Mobile Adaptation

The first Arabic/RTL mobile experience should be responsive web, not native apps.

### Responsive Web

Mobile RTL rules:

- App navigation drawer opens from the right.
- Page titles align right.
- Primary actions remain sticky at bottom when useful.
- Bottom sheets should open with RTL-friendly headings and action order.
- Cards replace tables.
- Long Arabic labels should wrap gracefully.

### Future Native Mobile

When native mobile begins:

- Use the same translation keys as web.
- Keep bottom tabs mirrored for Arabic.
- Use native platform RTL support.
- Test gestures carefully; back gestures differ across platforms.
- Push notifications should use Arabic payloads when user language is Arabic.

### Mobile Priority Workflows

Arabic responsive web should validate:

- Login and registration
- Organization setup
- Verification document review/upload
- Discover search/filter
- Request item
- Handover completion
- Transfer certificate verification
- Notifications

## UAE Bilingual Strategy

### Launch Position

Recommended launch approach:

1. English-first UAE pilot.
2. Arabic-ready code and layout foundation.
3. Bilingual public verification and certificate pages.
4. Arabic workspace beta for selected pilot organizations.
5. Full bilingual UAE launch after founder review and translation QA.

### Content Priority

Translate in this order:

1. Public pages
2. Authentication
3. Organization setup
4. Verification
5. Discover
6. Request and handover workflow
7. Transfer certificates and public QR verification
8. Impact dashboard
9. Notifications and email templates
10. Admin review screens

### UAE Business Language

Arabic should use UAE/GCC business-friendly terminology.

Avoid:

- Overly charitable language
- Consumer marketplace tone
- Informal dialect
- Literal English structure
- Excessive sustainability slogans

Prefer:

- Formal Modern Standard Arabic
- Clear operational terms
- Compliance-aware phrasing
- Enterprise trust language
- Practical impact terms

## Technical Recommendations

### Internationalization Framework

Recommended:

- Use route-based locale support.
- Use structured translation keys.
- Keep canonical domain values in English/system enums.
- Map canonical values to localized display labels.
- Store user language preference.
- Store organization public language availability.

Suggested translation key structure:

```text
common.actions.save
common.actions.cancel
dashboard.kpi.aedRecovered
discover.filters.category
verification.status.pendingReview
certificate.status.issued
notifications.certificateIssued.title
```

### Data Model Recommendations

Add localized fields where user-facing content is persisted:

- Categories: `name_en`, `name_ar`, `description_en`, `description_ar`
- Organizations: bilingual legal/trade names and descriptions
- Listings: optional translated title/description or future translation table
- Notification templates: language-specific templates
- Email templates: language-specific templates

For scalable localization, consider translation tables:

```text
localized_strings
- id
- entity_type
- entity_id
- locale
- field_name
- value
- reviewed_at
- reviewed_by
```

### API Recommendations

APIs should:

- Accept `Accept-Language`.
- Return canonical values plus localized display labels where appropriate.
- Never localize stored enum codes.
- Support locale in public read models.
- Keep search indexes language-aware.

Example response pattern:

```json
{
  "status": "pending_review",
  "status_label": "قيد المراجعة"
}
```

### Search Recommendations

Arabic search should support:

- Arabic normalization
- English/Arabic synonyms
- Category aliases
- Typo tolerance
- Optional transliteration over time

Search should not depend only on translated UI labels. It should index:

- English title
- Arabic title
- Category aliases
- Organization names in both languages
- City/emirate names in both languages

### Testing Recommendations

Add automated and manual checks for:

- `dir="rtl"` route rendering
- Sidebar mirroring
- Dashboard KPI ordering
- Discover filter drawer direction
- Form label/input direction
- LTR fields inside Arabic forms
- Table-to-card mobile conversion
- Toast and notification placement
- Public QR verification page in Arabic
- Keyboard navigation in RTL
- Screen reader labels in Arabic

## UI Recommendations

### Components

All shared components should accept locale/direction naturally:

- Button
- Card
- Table
- Form field
- Status pill
- Trust badge
- Verification badge
- KPI card
- Notification item
- Drawer
- Modal
- Timeline
- Breadcrumb
- Pagination
- Empty state

### Design Tokens

Add direction-aware tokens where useful:

```text
--space-inline-start
--space-inline-end
--radius-card
--app-nav-inline-size
```

Use existing ReDist colors and enterprise styling. Arabic UI should not introduce a separate visual identity.

### Layout QA Checklist

Before shipping Arabic/RTL:

- No English-only labels remain in user-facing flows.
- No clipped Arabic text in cards, buttons, badges, or nav.
- Sidebar and drawers mirror correctly.
- Icons mirror only when directional.
- Numeric and reference fields remain readable.
- Tables have mobile card equivalents.
- Public pages and certificate verification are bilingual.
- Notifications deep link correctly.

## Translation Strategy

### Translation Workflow

Recommended workflow:

1. Extract keys from UI copy.
2. Create English source file.
3. Translate Arabic with UAE business context.
4. Review by Arabic-speaking business/legal reviewer.
5. Run UI screenshot QA.
6. Run founder review on core workflows.
7. Lock approved terminology glossary.

### Glossary

Maintain a glossary for core product terms.

| English | Arabic Recommendation |
| --- | --- |
| Listing | عرض |
| Request | طلب |
| Handover | تسليم |
| Transfer Certificate | شهادة التحويل |
| Verification | التحقق |
| Trust Score | مؤشر الثقة |
| Impact Dashboard | لوحة الأثر |
| Waste Prevented | النفايات المتجنبة |
| AED Recovered | القيمة المستردة بالدرهم |
| Organization | مؤسسة |
| Branch | فرع |
| Approved | معتمد |
| Pending Review | قيد المراجعة |
| Rejected | مرفوض |
| Expired | منتهي الصلاحية |

### Tone

Arabic tone should be:

- Professional
- Clear
- Concise
- Trust-oriented
- Suitable for UAE organizations

Avoid:

- Overly promotional sustainability language
- Donation-first wording
- Casual dialect
- Technical jargon where business language is clearer

### Translation Ownership

Recommended ownership:

- Product owns source copy.
- Arabic reviewer owns terminology quality.
- Legal/compliance reviews verification, certificate, and restricted category wording.
- Founder approves public positioning before launch.

## Phased Rollout

### Phase 1: RTL Readiness

- Replace directional CSS with logical properties.
- Add locale routing skeleton.
- Add Arabic font stack.
- Confirm layout mirroring manually.

### Phase 2: Core Bilingual UX

- Translate public site, authentication, dashboard, discover, requests, verification, certificates, and notifications.
- Add bilingual category and status labels.
- Add Arabic screenshots to founder validation.

### Phase 3: UAE Pilot Arabic Beta

- Enable Arabic for selected organizations.
- Track support tickets and misunderstood labels.
- Review workflows weekly.

### Phase 4: Full UAE Bilingual Launch

- Publish Arabic public pages.
- Enable Arabic workspace.
- Enable Arabic emails and notifications.
- Add Arabic support documentation.

## Success Criteria

Arabic/RTL design is ready for implementation when:

- Route-level locale and direction strategy is approved.
- Font stack is validated across dense dashboards and mobile cards.
- Dashboard, Discover, forms, tables, notifications, certificates, and mobile responsive views have RTL rules.
- Translation glossary is approved.
- Public and workspace content priority is defined.
- Technical recommendations are accepted by engineering.
- Founder review confirms the Arabic experience feels enterprise-grade and UAE-appropriate.
