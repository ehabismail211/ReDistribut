import type { Metadata } from "next";
import { ArrowRight, Building2, FileCheck2, Handshake, PackageCheck, Search, ShieldCheck } from "lucide-react";
import { CtaBand, featureCards, IconGrid, MarketingShell, PageHero, SectionIntro, TrustNotice, workflowSteps } from "./components/marketing";

export const metadata: Metadata = {
  title: "ReDist | Trusted surplus redistribution for UAE organizations",
  description: "ReDist helps verified UAE organizations move usable surplus from listing to request, handover, certificate, and impact tracking.",
  alternates: { canonical: "/" },
};

const roleRoutes = [
  {
    icon: PackageCheck,
    title: "I have surplus resources",
    text: "List available surplus, review recipient requests, approve handovers, and keep evidence of completed transfers.",
    href: "/suppliers",
    label: "For suppliers",
  },
  {
    icon: Search,
    title: "I need resources",
    text: "Discover available resources, request what your organization needs, and track transfer status through handover.",
    href: "/recipients",
    label: "For recipients",
  },
  {
    icon: Handshake,
    title: "I want to partner",
    text: "Support a UAE-first circular economy workflow with practical verification and certificate evidence.",
    href: "/contact?intent=partner",
    label: "For partners",
  },
];

const trustItems = [
  "Verified organization workflow",
  "Supplier approval before handover",
  "Transfer status tracking",
  "Certificate-backed completion evidence",
  "Impact metrics tied to completed workflows",
];

export default function Home() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="UAE-first redistribution management"
        title="Redistribute surplus resources with trust, evidence, and impact."
        text="ReDist helps verified UAE organizations move usable surplus from listing to request, handover, certificate, and impact tracking."
        primaryLabel="Request a pilot conversation"
        primaryHref="/contact?intent=pilot"
        secondaryLabel="See how it works"
        secondaryHref="/how-it-works"
      />

      <section className="mkt-section">
        <SectionIntro
          eyebrow="Why ReDist"
          title="Useful surplus should not disappear into informal coordination."
          text="Many organizations hold resources that could be reused, but redistribution is often slowed by unclear requests, manual follow-up, missing evidence, and trust questions."
        />
        <div className="mkt-split">
          <div className="mkt-copy-card">
            <h3>One workflow for responsible redistribution</h3>
            <p>
              Suppliers, recipients, and administrators get a structured operating path: list available resources,
              request what is needed, coordinate handover, verify completion, and preserve evidence.
            </p>
          </div>
          <div className="mkt-check-list" aria-label="Common redistribution questions">
            {["Who needs this resource?", "Is the organization verified?", "What quantity is available?", "Who approves the request?", "What evidence exists after completion?"].map((item) => (
              <div key={item}><ShieldCheck size={18} aria-hidden /><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-section-muted">
        <SectionIntro eyebrow="Choose your path" title="Built for suppliers, recipients, and partners." />
        <div className="mkt-card-grid three">
          {roleRoutes.map((route) => (
            <a className="mkt-card mkt-link-card" href={route.href} key={route.title}>
              <route.icon size={28} aria-hidden />
              <span className="mkt-card-label">{route.label}</span>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
              <strong>Learn more <ArrowRight size={16} aria-hidden /></strong>
            </a>
          ))}
        </div>
      </section>

      <section className="mkt-section">
        <SectionIntro eyebrow="How it works" title="From surplus to evidence in six steps." />
        <IconGrid items={workflowSteps} />
      </section>

      <section className="mkt-section mkt-section-muted">
        <SectionIntro eyebrow="Trust by design" title="Organization-to-organization, not anonymous browsing." />
        <div className="mkt-split">
          <IconGrid items={featureCards} />
          <div className="mkt-copy-card">
            <Building2 size={28} aria-hidden />
            <h3>Controlled pilot access</h3>
            <p>
              ReDist is currently preparing founder-guided UAE pilot workflows. Public impact results will be shared
              only after real transfers are completed and approved for publication.
            </p>
            <ul>
              {trustItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <TrustNotice />
      </section>

      <section className="mkt-section">
        <SectionIntro
          eyebrow="Impact visibility"
          title="Make redistribution visible without overclaiming."
          text="ReDist is designed to help organizations understand value recovered, items redistributed, waste diverted, certificate evidence, and recipient usefulness once transfers are completed."
        />
        <div className="mkt-metric-grid">
          {["AED value recovered", "Items redistributed", "Waste diverted", "Certificate evidence"].map((metric) => (
            <article className="mkt-metric-card" key={metric}>
              <FileCheck2 size={24} aria-hidden />
              <h3>{metric}</h3>
              <p>Designed to track after completed, verified workflows. No public real pilot results are claimed yet.</p>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </MarketingShell>
  );
}
