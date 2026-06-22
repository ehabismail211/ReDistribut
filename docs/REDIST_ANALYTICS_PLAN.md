# ReDist Analytics Plan

Date: 2026-06-22  
Status: Marketing website analytics plan  
Scope: KPIs, funnel metrics, conversion tracking, outreach attribution

## Analytics Principle

Website analytics should answer one question:

Are the right UAE organizations understanding ReDist and requesting founder conversations?

Avoid vanity metrics unless they help improve qualification.

## Core KPIs

| KPI | Definition | Why It Matters |
| --- | --- | --- |
| Qualified leads | Leads that match supplier, recipient, partner, or ESG criteria | Measures useful demand |
| Meeting requests | Visitors requesting founder walkthrough or pilot conversation | Measures conversion intent |
| Supplier inquiries | Leads with surplus resources | Measures supply-side interest |
| Recipient inquiries | Leads with resource needs | Measures demand-side interest |
| Partner inquiries | NGOs, ESG sponsors, ecosystem partners | Measures ecosystem pull |
| FAQ engagement | Visitors reaching FAQ or clicking FAQ CTAs | Measures trust questions |
| Contact completion rate | Started forms versus submitted forms | Measures form friction |

## Funnel Metrics

| Funnel Stage | Metric |
| --- | --- |
| Visitor | Sessions, unique visitors, source, landing page |
| Lead | Contact submissions, form completion rate, intent type |
| Meeting | Meetings booked, meetings completed |
| Pilot invite | Qualified leads invited |
| Pilot participant | Invited organizations activated |

## Conversion Tracking Events

Recommended events:

- `cta_click_request_pilot`
- `cta_click_supplier`
- `cta_click_recipient`
- `cta_click_partner`
- `cta_click_demo`
- `contact_form_start`
- `contact_form_submit`
- `faq_open`
- `how_it_works_view`
- `supplier_page_view`
- `recipient_page_view`
- `partner_page_view`
- `impact_page_view`

## Attribution

Track source for every lead:

- Direct.
- Founder outreach.
- LinkedIn.
- Partner referral.
- Email campaign.
- WhatsApp/manual share.
- Event.
- Search.
- Other.

Recommended URL parameters:

```text
utm_source=
utm_medium=
utm_campaign=
utm_content=
```

Example:

```text
/?utm_source=founder_email&utm_medium=outreach&utm_campaign=uae_wave1&utm_content=supplier_intro
```

## Outreach Attribution

Connect website leads to:

- [Founder Outreach Dashboard](REDIST_FOUNDER_OUTREACH_DASHBOARD.md)
- [Partnership Pipeline](REDIST_PARTNERSHIP_PIPELINE.md)
- [Outreach Cadence](REDIST_OUTREACH_CADENCE.md)
- [Target Organization List](REDIST_TARGET_ORGANIZATION_LIST.md)

Minimum lead source fields:

- Original source.
- Campaign.
- Referrer.
- Contact form intent.
- Organization segment.
- First founder action.

## Weekly Analytics Review

Every week:

1. Count leads by segment.
2. Count qualified leads.
3. Review CTA click patterns.
4. Review contact form completion.
5. Review FAQ questions with high engagement.
6. Identify confusing pages.
7. Update outreach messaging if lead quality is poor.

## Monthly Analytics Review

Every month:

1. Compare visitor-to-lead conversion.
2. Compare lead-to-meeting conversion.
3. Compare meeting-to-pilot-invite conversion.
4. Review best lead source.
5. Review strongest segment.
6. Decide whether to increase outreach, add partner content, or refine CTAs.

## Tools

Potential analytics tools:

- Vercel Analytics.
- Plausible.
- Google Analytics.
- PostHog.
- Simple CRM spreadsheet for early lead status.

Tooling rule:

Use the simplest setup that captures source, intent, and conversion. Do not overbuild analytics before real traffic exists.

