import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell, PageHero, SectionIntro } from "../components/marketing";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ReDist for supplier, recipient, partner, ESG, demo, or founder-guided pilot inquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ intent?: string }> }) {
  const params = await searchParams;

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Start with a founder conversation."
        text="Tell us whether you have surplus resources, need resources, want to partner, or want to discuss ReDist's controlled UAE pilot."
        primaryLabel="Complete the form"
        primaryHref="#lead-form"
      />
      <section className="mkt-section" id="lead-form">
        <SectionIntro
          eyebrow="Lead capture"
          title="Request pilot consideration or a founder walkthrough."
          text="Do not submit sensitive documents through this form. Pilot access is controlled and reviewed before any organization is invited."
        />
        <div className="mkt-contact-layout">
          <ContactForm initialIntent={params.intent ?? "pilot"} />
          <aside className="mkt-copy-card">
            <h2>What happens next</h2>
            <ol>
              <li>The founder reviews the inquiry.</li>
              <li>Qualified organizations are invited to a short discovery conversation.</li>
              <li>Potential pilot participants are assessed for safe category fit.</li>
              <li>Protected pilot access is shared only after qualification.</li>
            </ol>
            <p>
              Need guidance before contacting us? Open the{" "}
              <Link href="/help">ReDist Help Center</Link>{" "}
              for quick-start, supplier, recipient, and FAQ guidance.
            </p>
            <p>No public self-serve launch, real pilot results, or audited ESG impact claims are implied by this form.</p>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}
