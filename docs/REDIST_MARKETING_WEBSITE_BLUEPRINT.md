# ReDist Marketing Website Blueprint

Date: 2026-06-22  
Status: Website implementation blueprint  
Scope: Public marketing website build package. Documentation only.

## Purpose

This blueprint translates the existing ReDist public content package into an implementation plan for a marketing website.

Source content:

- [Website Sitemap](REDIST_WEBSITE_SITEMAP.md)
- [Homepage Copy](REDIST_HOMEPAGE_COPY.md)
- [How It Works Page](REDIST_HOW_IT_WORKS_PAGE.md)
- [Supplier Landing Page](REDIST_SUPPLIER_LANDING_PAGE.md)
- [Recipient Landing Page](REDIST_RECIPIENT_LANDING_PAGE.md)
- [Public FAQ](REDIST_FAQ_PUBLIC.md)
- [Brand Messaging Guide](REDIST_BRAND_MESSAGING_GUIDE.md)
- [Launch Press Release](REDIST_LAUNCH_PRESS_RELEASE.md)

## Build Principle

The website should convert qualified UAE organizations into founder-led pilot conversations without implying that ReDist has completed live pilot results.

The website should not claim:

- Public self-serve launch.
- Real pilot outcomes.
- Audited ESG results.
- Government approval.
- Legal, safety, tax, or donation certification.

## Sitemap

Phase 1 launch pages:

| Page | Path | Purpose | Source Document |
| --- | --- | --- | --- |
| Home | `/` | Explain ReDist and route users by intent | [Homepage Copy](REDIST_HOMEPAGE_COPY.md) |
| How It Works | `/how-it-works` | Explain List, Discover, Request, Transfer, Verify, Impact | [How It Works Page](REDIST_HOW_IT_WORKS_PAGE.md) |
| Suppliers | `/suppliers` | Convert surplus-holding organizations | [Supplier Landing Page](REDIST_SUPPLIER_LANDING_PAGE.md) |
| Recipients | `/recipients` | Convert NGOs and recipient organizations | [Recipient Landing Page](REDIST_RECIPIENT_LANDING_PAGE.md) |
| FAQ | `/faq` | Answer trust, pilot, certificate, and category questions | [Public FAQ](REDIST_FAQ_PUBLIC.md) |
| Contact | `/contact` | Capture pilot, demo, supplier, recipient, and partner interest | [Lead Capture Strategy](REDIST_LEAD_CAPTURE_STRATEGY.md) |

Phase 2 pages:

| Page | Path | Purpose |
| --- | --- | --- |
| Impact | `/impact` | Explain evidence model, impact metrics, and reporting boundaries |
| Partners | `/partners` | Convert NGOs, ESG partners, sponsors, and ecosystem collaborators |
| About | `/about` | Explain mission, UAE-first focus, and responsible launch principles |

## Navigation

Primary navigation:

- Home
- How It Works
- Suppliers
- Recipients
- FAQ
- Contact

Phase 2 additions:

- Impact
- Partners
- About

Header CTA:

- Request pilot conversation

Footer links:

- About
- How It Works
- Suppliers
- Recipients
- FAQ
- Contact
- Security overview
- Privacy framework
- Terms framework

## Conversion Goals

Primary conversion:

- Qualified organization submits a pilot, demo, supplier, recipient, or partner inquiry.

Secondary conversions:

- Visitor views How It Works.
- Supplier clicks supplier CTA.
- Recipient clicks recipient CTA.
- Partner clicks partner CTA.
- FAQ visitor clicks Contact.
- Visitor requests founder conversation.

## CTA Strategy

| Visitor Intent | CTA Label | Destination | Form Type |
| --- | --- | --- | --- |
| General interest | Request a pilot conversation | `/contact?intent=pilot` | Pilot interest |
| Supplier | I have surplus resources | `/contact?intent=supplier` | Supplier inquiry |
| Recipient | I need resources | `/contact?intent=recipient` | Recipient inquiry |
| Partner | I want to partner | `/contact?intent=partner` | Partnership request |
| ESG / reporting | Discuss impact reporting | `/contact?intent=impact` | Partnership / ESG request |
| Demo | Request founder walkthrough | `/contact?intent=demo` | Demo request |

CTA rules:

- Every page should have one primary CTA.
- The homepage may include role-based CTAs.
- Avoid "Sign up now" until self-serve access is intentionally enabled.
- Use "Request", "Apply", or "Start a conversation" rather than public launch language.

## Page Build Priority

1. Home.
2. Contact.
3. How It Works.
4. Suppliers.
5. Recipients.
6. FAQ.
7. Impact.
8. Partners.
9. About.

## Website Implementation Readiness Score

Website implementation readiness: 82 / 100.

Rationale:

- Public content exists.
- Messaging guardrails are clear.
- Sitemap, CTA strategy, lead capture, analytics, and roadmap are now defined.
- Visual design, implementation, production legal review, and live contact handling remain pending.

