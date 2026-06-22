import type { Metadata } from "next";
import { CtaBand, faqGroups, MarketingShell, PageHero } from "../components/marketing";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to public questions about ReDist, suppliers, recipients, verification, certificates, impact, and pilot access.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="FAQ"
        title="Answers before your founder conversation."
        text="Understand the ReDist pilot model, supplier and recipient workflows, verification, certificates, impact boundaries, and launch limits."
        primaryLabel="Contact founder"
        primaryHref="/contact?intent=question"
      />
      <section className="mkt-section">
        <div className="mkt-faq-groups">
          {faqGroups.map((group) => (
            <section className="mkt-faq-group" key={group.title}>
              <h2>{group.title}</h2>
              <div className="mkt-faq-list">
                {group.items.map(([question, answer]) => (
                  <details key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <CtaBand title="Still have questions?" text="Send a short inquiry and the founder can route you to the right supplier, recipient, partner, or pilot conversation." href="/contact?intent=question" label="Contact ReDist" />
    </MarketingShell>
  );
}
