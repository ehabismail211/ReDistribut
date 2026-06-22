import type { Metadata } from "next";
import { Boxes, ClipboardCheck, FileCheck2, PackagePlus, ShieldCheck, Truck } from "lucide-react";
import { CtaBand, IconGrid, MarketingShell, PageHero, SectionIntro } from "../components/marketing";

export const metadata: Metadata = {
  title: "For Suppliers",
  description: "List surplus resources responsibly, review recipient requests, coordinate handovers, and keep evidence after completion.",
  alternates: { canonical: "/suppliers" },
};

const supplierBenefits = [
  { icon: PackagePlus, title: "List surplus responsibly", text: "Make usable resources visible with quantity, condition, location, and handover details." },
  { icon: ClipboardCheck, title: "Review every request", text: "Approve, decline, or clarify requests before any resource moves forward." },
  { icon: Truck, title: "Coordinate handover", text: "Keep pickup readiness, timing, and access instructions clear." },
  { icon: FileCheck2, title: "Keep evidence", text: "Completed transfers can produce certificate-backed operational evidence." },
];

export default function SuppliersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For suppliers"
        title="Turn surplus resources into verified redistribution."
        text="ReDist helps suppliers list available surplus, review recipient requests, coordinate handovers, and keep certificate-backed evidence after completion."
        primaryLabel="Become a pilot supplier"
        primaryHref="/contact?intent=supplier"
      />
      <section className="mkt-section">
        <SectionIntro eyebrow="Supplier value" title="Keep control while making surplus useful." />
        <IconGrid items={supplierBenefits} />
      </section>
      <section className="mkt-section mkt-section-muted">
        <div className="mkt-two-column">
          <article className="mkt-copy-card">
            <Boxes size={28} aria-hidden />
            <h2>Good early categories</h2>
            <ul>
              <li>Furniture and fixtures</li>
              <li>Reusable warehouse materials</li>
              <li>Cartons, packaging, and storage bins</li>
              <li>Non-sensitive equipment</li>
              <li>Packaged non-perishable supplies</li>
            </ul>
          </article>
          <article className="mkt-copy-card">
            <ShieldCheck size={28} aria-hidden />
            <h2>Categories that need review</h2>
            <p>
              Prepared food, medical items, hazardous goods, regulated goods, or legally sensitive categories require
              separate review and may not be accepted for early pilot workflows.
            </p>
          </article>
        </div>
      </section>
      <CtaBand
        title="Have one low-risk surplus category to test?"
        text="The ideal first supplier can assign one responsible contact, complete one guided workflow within two weeks, and provide direct feedback."
        href="/contact?intent=supplier"
        label="Request supplier pilot consideration"
      />
    </MarketingShell>
  );
}
