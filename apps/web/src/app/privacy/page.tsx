import type { Metadata } from "next";
import { CtaBand, MarketingShell, PageHero, SectionIntro } from "../components/marketing";

export const metadata: Metadata = {
  title: "Privacy Framework",
  description: "Public summary of the ReDist privacy framework for organization data, user data, documents, audit logs, and lead inquiries.",
  alternates: { canonical: "/privacy" },
};

const dataCategories = [
  "Organization data such as legal name, trade name, organization type, location, contact details, verification status, trust context, listings, requests, transfers, certificates, and impact summaries.",
  "User data such as name, email, role, organization membership, support requests, feedback submissions, and authorized workflow actions.",
  "Lead inquiry data submitted through the public contact form, including name, organization, email, phone, inquiry type, city, timeline, and message.",
  "Operational records such as verification documents, transfer certificates, handover evidence, audit actions, permission decisions, and support notes where required for platform operation.",
];

const useCases = [
  "Operate supplier, recipient, transfer, verification, certificate, impact, and founder review workflows.",
  "Review organization eligibility and pilot suitability.",
  "Support trust, safety, dispute review, auditability, and platform security.",
  "Respond to inquiries, schedule founder conversations, and manage pilot or partnership follow-up.",
];

const protectionItems = [
  "Sensitive documents should not be submitted through the public contact form.",
  "Founder and platform review areas are intended to be protected from public access.",
  "Public certificate verification should expose only public-safe transfer facts, not sensitive documents, contact details, or internal audit notes.",
  "Service role keys, private credentials, and sensitive environment variables must never be exposed in the browser or committed to the repository.",
];

const reviewItems = [
  "UAE Personal Data Protection Law applicability.",
  "Free zone or sector-specific data obligations.",
  "Consent, notice, retention, deletion, and correction rights.",
  "Cross-border processing disclosures for hosting, database, analytics, and support providers.",
  "Incident notification, audit log retention, and certificate evidence retention periods.",
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Privacy framework"
        title="Privacy framework for organization trust workflows."
        text="This page summarizes the ReDist privacy framework for public review. It is not a final privacy policy and must be reviewed by qualified UAE privacy or legal counsel before commercial use."
        primaryLabel="Contact founder"
        primaryHref="/contact?intent=question"
      />

      <section className="mkt-section">
        <SectionIntro
          eyebrow="Review notice"
          title="Framework pending formal UAE privacy review."
          text="ReDist collects only the information needed to operate founder-guided redistribution, lead review, verification, evidence, and pilot workflows. Final privacy obligations require professional review."
        />
      </section>

      <section className="mkt-section mkt-section-muted">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>Data ReDist may process</h2>
            <ul>
              {dataCategories.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="mkt-copy-card">
            <h2>Why data is used</h2>
            <ul>
              {useCases.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="mkt-section">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>Protection principles</h2>
            <ul>
              {protectionItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="mkt-copy-card">
            <h2>Professional review required</h2>
            <ul>
              {reviewItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <CtaBand
        title="Questions about data handling?"
        text="Contact the founder before submitting sensitive information, requesting pilot access, or using ReDist evidence in external reporting."
        href="/contact?intent=question"
        label="Ask a privacy question"
      />
    </MarketingShell>
  );
}
