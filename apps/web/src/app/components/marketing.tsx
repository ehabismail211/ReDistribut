import type { ComponentType, ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  HelpCircle,
  PackagePlus,
  Recycle,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { PublicLanguageController } from "./public-language";

type Icon = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;

export const siteNav = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/recipients", label: "Recipients" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const legalNav = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export const workflowSteps = [
  {
    icon: PackagePlus,
    title: "List",
    text: "Suppliers list available surplus with quantity, condition, location, urgency, and handover notes.",
  },
  {
    icon: Search,
    title: "Discover",
    text: "Recipients discover available resources by practical details such as category, city, quantity, and supplier context.",
  },
  {
    icon: ClipboardCheck,
    title: "Request",
    text: "Recipients submit structured requests and suppliers review before approving any handover.",
  },
  {
    icon: Truck,
    title: "Transfer",
    text: "Approved requests move into handover coordination with clear next steps for both organizations.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    text: "Completion is verified through the workflow before certificate evidence is reviewed.",
  },
  {
    icon: BarChart3,
    title: "Impact",
    text: "Completed transfers can support value, item, waste diversion, certificate, and usefulness evidence.",
  },
];

export const featureCards = [
  {
    icon: Building2,
    title: "Verified organization workflow",
    text: "Built for organization-to-organization redistribution, not anonymous consumer browsing.",
  },
  {
    icon: Handshake,
    title: "Supplier approval control",
    text: "Suppliers review requests and control what quantity moves forward before handover.",
  },
  {
    icon: FileCheck2,
    title: "Certificate evidence",
    text: "Completed transfers can create operational evidence tied to a platform workflow.",
  },
  {
    icon: Recycle,
    title: "Impact visibility",
    text: "ReDist is designed to track recovered value, redistributed items, and waste diversion from completed transfers.",
  },
];

export const faqGroups = [
  {
    title: "General",
    items: [
      ["What is ReDist?", "ReDist is a UAE-first redistribution management platform for verified organizations. It helps organizations list surplus resources, discover available resources, submit requests, coordinate handovers, verify completion, and track impact evidence."],
      ["Is ReDist a marketplace?", "ReDist is not designed as a consumer marketplace. It is an organization-to-organization redistribution workflow built around trust, approval, handover evidence, and impact visibility."],
      ["Who is ReDist for?", "ReDist is for suppliers with usable surplus, recipients that need resources, administrators who manage verification, and partners who support circular economy activity."],
      ["Is ReDist live publicly?", "ReDist is preparing founder-guided UAE pilot workflows. Public self-serve access is not the current launch mode."],
      ["What problem does ReDist solve?", "ReDist helps organizations move from informal surplus coordination to a structured workflow with listings, requests, handovers, certificates, and impact tracking."],
      ["Why is ReDist UAE-first?", "The UAE has strong hospitality, logistics, retail, NGO, and ESG activity. ReDist is starting there to validate a focused operating model before broader expansion."],
      ["What does redistribution mean?", "Redistribution means moving usable surplus resources from one organization to another organization that can use them."],
      ["What does surplus mean?", "Surplus means usable resources an organization no longer needs, has in excess, or wants to redirect before they become waste or idle inventory."],
    ],
  },
  {
    title: "Suppliers",
    items: [
      ["Who can become a supplier?", "UAE organizations with usable surplus may apply for pilot consideration. Early supplier fit depends on category safety, responsible contact availability, and willingness to complete one guided workflow."],
      ["What can suppliers list?", "Pilot-safe examples include furniture, fixtures, reusable warehouse materials, cartons, bins, non-sensitive equipment, and packaged non-perishable supplies."],
      ["Can restaurants list food?", "Food-adjacent workflows may require additional compliance review. ReDist should not begin with prepared food unless safety, handling, and legal requirements are reviewed."],
      ["Can hotels list surplus furniture?", "Yes, hotel furniture and fixtures are strong examples of practical early pilot categories if condition, quantity, and pickup details are clear."],
      ["Can warehouses list pallets or cartons?", "Yes, reusable warehouse materials such as pallets, cartons, bins, and packaging are strong early pilot examples."],
      ["Does a supplier have to accept every request?", "No. Suppliers review requests before approving or declining."],
      ["Can suppliers control quantity?", "Yes. Suppliers should list available quantity and approve only the quantity they are willing to transfer."],
      ["What does a supplier receive after a transfer?", "A supplier can receive operational evidence of the completed transfer, including certificate-backed confirmation where supported."],
    ],
  },
  {
    title: "Recipients",
    items: [
      ["Who can become a recipient?", "Recipients may include NGOs, charities, community organizations, schools, training centers, social enterprises, or approved organizations with real resource needs."],
      ["How do recipients find resources?", "Recipients use Discover to view available surplus by practical details such as category, location, quantity, condition, urgency, and supplier context."],
      ["Can recipients request any resource?", "Recipients can submit requests for available resources, but supplier approval and category eligibility still apply."],
      ["Does ReDist guarantee that requests are approved?", "No. Suppliers review and decide whether to approve requests."],
      ["Can recipients request partial quantities?", "The workflow is designed to support practical quantity decisions. For early pilot workflows, the founder may help clarify partial request handling."],
      ["Can individuals request resources?", "ReDist is designed for organization-to-organization workflows, not individual consumer requests."],
      ["What happens after a request is approved?", "The workflow moves toward handover coordination, verification, certificate review, and impact tracking."],
      ["Can recipients use certificates for reporting?", "Certificates may support internal evidence, but they are operational records, not audited ESG certificates or legal documents."],
    ],
  },
  {
    title: "Trust and verification",
    items: [
      ["Are organizations verified?", "ReDist is designed around verified organization workflows. Early pilot participation is founder-guided and controlled."],
      ["What does verification mean?", "Verification may include organization identity, responsible contact, eligibility, and category review. It does not mean ReDist guarantees every outcome."],
      ["Does ReDist inspect every item?", "No. ReDist is not an inspection service. Suppliers and recipients remain responsible for accurate descriptions and handover confirmation."],
      ["Does ReDist guarantee item quality?", "No. ReDist does not guarantee item quality, suitability, safety, or legal compliance."],
      ["What is a ReDist certificate?", "A ReDist certificate is operational evidence that a transfer workflow was completed in the platform."],
      ["Is a certificate a legal document?", "No. It is not a legal guarantee, tax receipt, safety certificate, government approval, or audited ESG certificate."],
      ["Can certificates be verified?", "ReDist is designed to support certificate verification and referenceable transfer evidence."],
      ["Can certificates be disputed?", "Yes. Certificate disputes should be reviewed through the support and dispute process."],
    ],
  },
  {
    title: "Impact, pilot, and launch",
    items: [
      ["What impact does ReDist track?", "ReDist is designed to track value recovered, items redistributed, waste diverted, certificate evidence, and recipient usefulness."],
      ["Does ReDist have real impact results yet?", "No public real pilot impact results are available yet. ReDist should publish results only after completed, verified workflows and participant approval."],
      ["Are CO2 metrics available?", "Environmental estimates may be possible where defensible data exists, but they must be clearly labeled and should not be treated as audited claims."],
      ["Can organizations use ReDist for ESG reporting?", "ReDist can support evidence gathering for ESG conversations, but formal ESG reporting requires appropriate methodology and review."],
      ["What is the current pilot status?", "ReDist is prepared for founder-guided UAE Pilot Wave 1. The first real live organization workflows are pending."],
      ["How can an organization join the pilot?", "Organizations can request a founder conversation and may be invited if they fit the pilot criteria."],
      ["What categories are not suitable for the first pilot?", "Hazardous, medical, regulated, legally sensitive, unsafe, or unclear categories are not suitable for the first pilot."],
      ["Does ReDist charge during the pilot?", "The recommended early pilot model is founder-guided and free while value and willingness to pay are validated."],
    ],
  },
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <main className="mkt-page">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </main>
  );
}

export function MarketingHeader() {
  return (
    <header className="mkt-header">
      <a className="mkt-brand" href="/" aria-label="ReDist home">
        <img className="mkt-brand-wordmark" src="/brand/redistribut-wordmark-header.svg" alt="" />
        <span className="visually-hidden">ReDist</span>
      </a>
      <nav className="mkt-nav" aria-label="Primary navigation">
        {siteNav.slice(1).map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
      </nav>
      <div className="mkt-header-actions">
        <PublicLanguageController />
        <a className="mkt-button mkt-button-primary" href="/contact?intent=pilot">Request pilot conversation</a>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mkt-footer">
      <div>
        <a className="mkt-brand" href="/" aria-label="ReDist home">
          <img className="mkt-brand-wordmark" src="/brand/redistribut-wordmark-header.svg" alt="" />
          <span className="visually-hidden">ReDist</span>
        </a>
        <p>UAE-first redistribution management for verified organizations. Founder-guided pilot preparation is underway.</p>
      </div>
      <nav aria-label="Footer navigation">
        {siteNav.map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
        {legalNav.map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
        <a href="/app">Workspace</a>
      </nav>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  primaryLabel = "Request a pilot conversation",
  primaryHref = "/contact?intent=pilot",
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  title: string;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mkt-hero">
      <div className="mkt-hero-copy">
        <span className="mkt-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="mkt-actions">
          <a className="mkt-button mkt-button-primary" href={primaryHref}>{primaryLabel}<ArrowRight size={18} aria-hidden /></a>
          {secondaryLabel && secondaryHref ? <a className="mkt-button mkt-button-secondary" href={secondaryHref}>{secondaryLabel}</a> : null}
        </div>
      </div>
      <div className="mkt-proof-panel" aria-label="Pilot status">
        <span>Founder-guided pilot status</span>
        <strong>Controlled UAE workflows</strong>
        <p>Access is qualified and staged. Public impact claims will wait for completed, approved real transfers.</p>
      </div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mkt-section-intro">
      <span className="mkt-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function IconGrid({ items }: { items: Array<{ icon: Icon; title: string; text: string }> }) {
  return (
    <div className="mkt-card-grid">
      {items.map((item) => (
        <article className="mkt-card" key={item.title}>
          <item.icon size={26} aria-hidden />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Ready to test a guided redistribution workflow?",
  text = "Start with a founder conversation. ReDist is looking for UAE organizations and ecosystem partners who can validate practical, trusted redistribution workflows.",
  href = "/contact?intent=pilot",
  label = "Request a pilot conversation",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="mkt-cta-band">
      <div>
        <span className="mkt-eyebrow">Controlled pilot</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <a className="mkt-button mkt-button-light" href={href}>{label}<ArrowRight size={18} aria-hidden /></a>
    </section>
  );
}

export function TrustNotice() {
  return (
    <aside className="mkt-notice">
      <CheckCircle2 size={22} aria-hidden />
      <p>
        ReDist certificates are operational evidence of a platform workflow. They are not legal guarantees,
        government approvals, safety certifications, tax receipts, or audited ESG certificates.
      </p>
    </aside>
  );
}

export function FaqPreview() {
  return (
    <div className="mkt-faq-list">
      {faqGroups.slice(0, 3).flatMap((group) => group.items.slice(0, 2)).map(([question, answer]) => (
        <details key={question}>
          <summary>{question}<HelpCircle size={18} aria-hidden /></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
