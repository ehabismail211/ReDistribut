import type { Metadata } from "next";
import { CtaBand, MarketingShell, PageHero, SectionIntro, TrustNotice } from "../components/marketing";

export const metadata: Metadata = {
  title: "Terms Framework",
  description: "Public summary of the ReDist terms framework for responsible UAE surplus redistribution workflows.",
  alternates: { canonical: "/terms" },
};

const responsibilityItems = [
  "Provide accurate account, organization, listing, request, handover, and feedback information.",
  "Use ReDist only through authorized organization representatives and approved workflow roles.",
  "Confirm that listed resources are lawful, usable, controlled by the organization, and suitable for redistribution.",
  "Follow internal safety, compliance, approval, and handover procedures before completing any transfer.",
  "Report incorrect information, unsafe content, disputes, suspicious activity, or unauthorized access promptly.",
];

const limitationItems = [
  "ReDist facilitates workflow coordination and evidence, but does not independently inspect every resource.",
  "ReDist does not guarantee resource quality, safety, legality, suitability, or handover completion.",
  "Verification indicates reviewed information or documents; it is not a government approval or future conduct guarantee.",
  "Transfer certificates are operational platform evidence, not tax invoices, payment receipts, customs documents, legal title documents, or audited ESG certificates.",
  "Impact values and environmental estimates should be treated as platform-supported estimates unless separately audited.",
];

const disputeItems = [
  "A dispute can be raised for incorrect listing details, quantity mismatch, failed handover, certificate errors, or verification concerns.",
  "ReDist may preserve audit evidence, pause a workflow, request clarification from the parties, and mark certificates as corrected, disputed, revoked, or closed where appropriate.",
  "Founder or platform review may result in account, category, listing, request, certificate, or access restrictions when risk is identified.",
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal framework"
        title="Terms framework for responsible redistribution."
        text="This page summarizes the ReDist Terms of Service framework for public review. It is not final legal advice and must be reviewed by qualified UAE legal counsel before commercial use."
        primaryLabel="Contact founder"
        primaryHref="/contact?intent=question"
      />

      <section className="mkt-section">
        <SectionIntro
          eyebrow="Review notice"
          title="Framework pending formal UAE legal review."
          text="ReDist is currently operated as a founder-guided platform and pilot workflow. These terms concepts explain intended responsibilities and limitations, but they do not replace a finalized legal agreement."
        />
        <TrustNotice />
      </section>

      <section className="mkt-section mkt-section-muted">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>Scope of service</h2>
            <p>
              ReDist provides a platform workflow for verified or pilot-approved organizations to list surplus
              resources, discover available resources, submit and review requests, coordinate handovers, record
              transfer completion, generate certificate-backed platform evidence, and view impact summaries.
            </p>
            <p>
              ReDist is not a logistics provider, payment processor, escrow provider, tax advisor, legal title
              transfer service, food safety certifier, customs broker, or government regulator.
            </p>
          </article>
          <article className="mkt-copy-card">
            <h2>User and organization responsibilities</h2>
            <ul>
              {responsibilityItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>Platform limitations</h2>
            <ul>
              {limitationItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="mkt-copy-card">
            <h2>Disputes and restrictions</h2>
            <ul>
              {disputeItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <CtaBand
        title="Questions about ReDist responsibilities?"
        text="Contact the founder before joining a pilot workflow, submitting sensitive information, or using ReDist evidence externally."
        href="/contact?intent=question"
        label="Ask a question"
      />
    </MarketingShell>
  );
}
