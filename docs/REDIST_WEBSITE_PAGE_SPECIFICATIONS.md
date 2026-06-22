# ReDist Website Page Specifications

Date: 2026-06-22  
Status: Page-by-page implementation specifications  
Scope: Public marketing website development handoff

## Build Boundary

This package is documentation only. It does not create product routes, backend logic, lead storage, analytics instrumentation, or architecture changes.

Public copy must not claim:

- Completed real pilot results.
- Audited ESG impact.
- Government approval.
- Legal, safety, tax, or donation certification.
- Public self-serve launch.

## Page: Home

Path: `/`

Conversion goal:

- Convert qualified visitors into pilot, supplier, recipient, partner, or demo inquiries.

Primary CTA:

- Request a pilot conversation -> `/contact?intent=pilot`

Secondary CTA:

- See how it works -> `/how-it-works`

Content sources:

- [Homepage Copy](REDIST_HOMEPAGE_COPY.md)
- [Brand Messaging Guide](REDIST_BRAND_MESSAGING_GUIDE.md)
- [Website Section Library](REDIST_WEBSITE_SECTION_LIBRARY.md)

Sections:

1. Hero.
2. Problem.
3. Value proposition by role.
4. How it works preview.
5. Trust section.
6. Impact section.
7. Pilot section.
8. Role-based CTA block.
9. Footer.

Implementation notes:

- Above the fold should explain ReDist in under 10 seconds.
- Role-based CTAs should route to supplier, recipient, partner, and impact/contact paths.
- Include a short pilot-status note to avoid overclaiming.

## Page: How It Works

Path: `/how-it-works`

Conversion goal:

- Help visitors understand the workflow and continue to Contact, Suppliers, or Recipients.

Primary CTA:

- Request a pilot conversation -> `/contact?intent=pilot`

Content sources:

- [How It Works Page](REDIST_HOW_IT_WORKS_PAGE.md)
- [Website Section Library](REDIST_WEBSITE_SECTION_LIBRARY.md)

Sections:

1. Hero intro.
2. Workflow timeline: List, Discover, Request, Transfer, Verify, Impact.
3. Supplier and recipient role explanation.
4. Certificate boundary note.
5. Impact boundary note.
6. CTA block.

Implementation notes:

- Desktop can use a horizontal or vertical timeline.
- Mobile should use stacked cards.
- Avoid marketplace language such as shop, seller, buyer, cart.

## Page: Suppliers

Path: `/suppliers`

Conversion goal:

- Convert surplus-holding organizations into qualified supplier inquiries.

Primary CTA:

- Become a pilot supplier -> `/contact?intent=supplier`

Content sources:

- [Supplier Landing Page](REDIST_SUPPLIER_LANDING_PAGE.md)
- [Brand Messaging Guide](REDIST_BRAND_MESSAGING_GUIDE.md)

Sections:

1. Supplier hero.
2. Who this is for.
3. Supplier problem.
4. Supplier value proposition.
5. What suppliers can list.
6. Supplier workflow.
7. Trust and control.
8. Pilot invitation criteria.
9. CTA block.

Implementation notes:

- Emphasize control and approval.
- Include high-risk category caution.
- Do not imply suppliers must accept every request.

## Page: Recipients

Path: `/recipients`

Conversion goal:

- Convert NGOs, schools, community organizations, and approved recipients into qualified recipient inquiries.

Primary CTA:

- Become a pilot recipient -> `/contact?intent=recipient`

Content sources:

- [Recipient Landing Page](REDIST_RECIPIENT_LANDING_PAGE.md)
- [Brand Messaging Guide](REDIST_BRAND_MESSAGING_GUIDE.md)

Sections:

1. Recipient hero.
2. Who this is for.
3. Recipient problem.
4. Recipient value proposition.
5. What recipients can request.
6. Recipient workflow.
7. Trust and evidence.
8. Pilot invitation criteria.
9. CTA block.

Implementation notes:

- Emphasize discovery, suitability, and status tracking.
- Avoid implying requests are guaranteed.
- Explain certificate evidence carefully.

## Page: Impact

Path: `/impact`

Conversion goal:

- Convert ESG, CSR, corporate, and partner visitors into impact/reporting conversations.

Primary CTA:

- Discuss impact reporting -> `/contact?intent=impact`

Content sources:

- [Impact Model](REDIST_IMPACT_MODEL.md)
- [Homepage Copy](REDIST_HOMEPAGE_COPY.md)
- [Evidence Readiness Scorecard](REDIST_EVIDENCE_READINESS_SCORECARD.md)

Sections:

1. Impact hero.
2. Impact model overview.
3. Impact metric capability cards.
4. Certificate evidence section.
5. Evidence boundary / no real pilot results note.
6. Future case study placeholder.
7. CTA block.

Implementation notes:

- Do not show fake numbers.
- Use "designed to track" or "future reporting can include" until real evidence exists.
- Keep certificate limitations visible.

## Page: FAQ

Path: `/faq`

Conversion goal:

- Resolve trust, pilot, certificate, category, and launch objections before founder calls.

Primary CTA:

- Contact founder -> `/contact?intent=question`

Content sources:

- [Public FAQ](REDIST_FAQ_PUBLIC.md)

Sections:

1. FAQ hero.
2. Category filters or grouped accordion:
   - General.
   - Suppliers.
   - Recipients.
   - Trust and verification.
   - Impact.
   - Pilot and launch.
   - Contact.
3. CTA block.

Implementation notes:

- Use accordion with accessible keyboard behavior.
- All answers should be indexable for SEO if possible.
- Make certificate and pilot-status questions easy to find.

## Page: Contact

Path: `/contact`

Conversion goal:

- Capture qualified leads for founder review and pipeline routing.

Primary CTA:

- Submit inquiry.

Content sources:

- [Lead Capture Strategy](REDIST_LEAD_CAPTURE_STRATEGY.md)
- [Conversion Funnel](REDIST_CONVERSION_FUNNEL.md)

Sections:

1. Contact hero.
2. Intent selector.
3. Contact form.
4. What happens next.
5. Privacy/consent note.
6. Alternative contact placeholder if approved.

Form fields:

- Full name.
- Work email.
- Organization name.
- Role / title.
- City / emirate.
- Interest type.
- Organization type.
- Resource category or need.
- Timeline.
- Message.
- Consent to contact.

Implementation notes:

- Do not collect sensitive documents through public contact form.
- Preserve query-param intent from CTAs.
- Route form submissions into founder pipeline process.

## MVP Website Launch Scope

Recommended MVP launch pages:

1. Home.
2. How It Works.
3. Suppliers.
4. Recipients.
5. FAQ.
6. Contact.

Impact can be included in MVP if no fake numbers are shown and evidence boundaries remain clear.

