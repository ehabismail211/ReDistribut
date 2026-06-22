import type { Metadata } from "next";
import { FileCheck2, MapPin, Search, ShieldCheck } from "lucide-react";
import { CtaBand, IconGrid, MarketingShell, PageHero, SectionIntro } from "../components/marketing";

export const metadata: Metadata = {
  title: "For Recipients",
  description: "Discover available surplus resources, submit requests, track handovers, and receive evidence after completed transfers.",
  alternates: { canonical: "/recipients" },
};

const recipientBenefits = [
  { icon: Search, title: "Discover available surplus", text: "Find resources by practical details such as category, location, condition, and urgency." },
  { icon: MapPin, title: "Understand handover fit", text: "Review quantity, city, supplier context, and pickup notes before requesting." },
  { icon: ShieldCheck, title: "Track request status", text: "Follow the workflow through supplier review, handover, verification, and completion." },
  { icon: FileCheck2, title: "Receive evidence", text: "Completed transfers can provide certificate-backed operational evidence for internal records." },
];

export default function RecipientsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For recipients"
        title="Discover available surplus resources from verified organizations."
        text="ReDist helps recipient organizations find resources, submit requests, track handovers, and receive evidence after completed transfers."
        primaryLabel="Become a pilot recipient"
        primaryHref="/contact?intent=recipient"
      />
      <section className="mkt-section">
        <SectionIntro eyebrow="Recipient value" title="Find resources with clarity before requesting." />
        <IconGrid items={recipientBenefits} />
      </section>
      <section className="mkt-section mkt-section-muted">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <h2>Who this is for</h2>
            <ul>
              <li>NGOs and charities</li>
              <li>Community support organizations</li>
              <li>Schools and training centers</li>
              <li>Social enterprises</li>
              <li>Approved organizational recipients</li>
            </ul>
          </article>
          <article className="mkt-copy-card">
            <h2>What recipients can request</h2>
            <p>
              Early pilot categories should stay low-risk: furniture, shelving, storage bins, cartons, non-sensitive equipment,
              training supplies, and packaged non-perishable resources.
            </p>
          </article>
        </div>
      </section>
      <CtaBand
        title="Need practical resources for your organization?"
        text="The ideal first recipient has a real resource need, one responsible contact, pickup or handover capacity, and willingness to provide feedback."
        href="/contact?intent=recipient"
        label="Request recipient pilot consideration"
      />
    </MarketingShell>
  );
}
