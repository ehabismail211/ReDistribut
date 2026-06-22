import type { Metadata } from "next";
import { CtaBand, IconGrid, MarketingShell, PageHero, SectionIntro, TrustNotice, workflowSteps } from "../components/marketing";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how ReDist helps verified organizations move surplus resources from listing to request, handover, verification, and impact evidence.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="How it works"
        title="A practical workflow for verified redistribution."
        text="ReDist gives organizations a structured way to list resources, discover available surplus, submit requests, coordinate handovers, verify completion, and track impact evidence."
      />
      <section className="mkt-section">
        <SectionIntro eyebrow="Workflow" title="List, Discover, Request, Transfer, Verify, Impact." />
        <IconGrid items={workflowSteps} />
      </section>
      <section className="mkt-section mkt-section-muted">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>For suppliers</h2>
            <p>Create a listing with practical details such as resource name, quantity, condition, location, urgency, supplier organization, and handover notes.</p>
            <p>Suppliers keep control over what gets released and which requests are approved.</p>
          </article>
          <article className="mkt-copy-card">
            <h2>For recipients</h2>
            <p>Discover available resources by category, location, urgency, quantity, condition, and supplier context.</p>
            <p>Submit structured requests and track status through approval, handover, verification, and certificate review.</p>
          </article>
        </div>
      </section>
      <section className="mkt-section">
        <SectionIntro
          eyebrow="Evidence"
          title="Verification and impact are tied to completed workflows."
          text="ReDist is designed to preserve evidence after handover, but impact claims should be based on completed transfers and clearly labeled estimates."
        />
        <TrustNotice />
      </section>
      <CtaBand />
    </MarketingShell>
  );
}
