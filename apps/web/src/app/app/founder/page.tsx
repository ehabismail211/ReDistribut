import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  Handshake,
  Inbox,
  LineChart,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { listMarketingLeads, type MarketingLead } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Founder revenue dashboard | ReDist",
  description: "Founder-only revenue and partnership pipeline dashboard for ReDist.",
};

export const dynamic = "force-dynamic";

type PipelineSegment = {
  label: string;
  description: string;
  keywords: string[];
  inquiryTypes?: MarketingLead["inquiry_type"][];
};

const pipelineSegments: PipelineSegment[] = [
  {
    label: "NGOs",
    description: "Recipient and charity organizations in the outreach pipeline.",
    keywords: ["ngo", "charity", "community", "nonprofit", "non-profit", "foundation"],
    inquiryTypes: ["recipient"],
  },
  {
    label: "Hotels",
    description: "Hotel groups and hospitality operators with surplus potential.",
    keywords: ["hotel", "hospitality", "resort"],
  },
  {
    label: "Restaurants",
    description: "Restaurants, cafes, caterers, and food operators.",
    keywords: ["restaurant", "cafe", "coffee", "catering", "food"],
    inquiryTypes: ["supplier"],
  },
  {
    label: "Warehouses",
    description: "Warehouse, logistics, and inventory operators.",
    keywords: ["warehouse", "logistics", "storage", "distribution", "fulfillment"],
  },
  {
    label: "ESG partners",
    description: "Corporate ESG, sustainability, and strategic partnership leads.",
    keywords: ["esg", "sustainability", "corporate", "csr", "partner", "government"],
    inquiryTypes: ["impact", "partner"],
  },
];

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function organizationKey(lead: MarketingLead) {
  return normalize(lead.organization) || normalize(lead.email) || lead.id;
}

function countUniqueOrganizations(leads: MarketingLead[]) {
  return new Set(leads.map(organizationKey)).size;
}

function isThisMonth(value: string | null | undefined) {
  if (!value) return false;

  const date = new Date(value);
  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function leadMatchesSegment(lead: MarketingLead, segment: PipelineSegment) {
  const haystack = [
    lead.organization,
    lead.organization_type,
    lead.role_title,
    lead.message,
    lead.city,
  ].map(normalize).join(" ");

  return (
    segment.keywords.some((keyword) => haystack.includes(keyword)) ||
    Boolean(segment.inquiryTypes?.includes(lead.inquiry_type))
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  primary = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof BarChart3;
  primary?: boolean;
}) {
  return (
    <article className={`dashboard-kpi-card founder-revenue-kpi ${primary ? "primary" : ""}`}>
      <div className="dashboard-kpi-icon">
        <Icon size={20} aria-hidden />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function EmptyLeadStorage({ message }: { message: string }) {
  return (
    <section className="dashboard-card lead-setup-card">
      <Inbox size={28} aria-hidden />
      <h2>Founder revenue dashboard is waiting for lead storage.</h2>
      <p>{message}</p>
      <p>Apply the `marketing_leads` Supabase migration and configure the server-side Supabase service role before using this dashboard with live inquiries.</p>
    </section>
  );
}

export default async function FounderRevenueDashboardPage() {
  let leads: MarketingLead[] = [];
  let setupError: string | null = null;

  try {
    leads = await listMarketingLeads();
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Lead records could not be loaded.";
  }

  const activeLeads = leads.filter((lead) => lead.status !== "archived");
  const newLeads = activeLeads.filter((lead) => lead.status === "new");
  const contactedLeads = activeLeads.filter((lead) => lead.status === "contacted");
  const meetingLeads = activeLeads.filter((lead) => lead.status === "meeting_booked");
  const pilotCandidateLeads = activeLeads.filter((lead) => lead.status === "pilot_candidate");
  const leadsThisMonth = activeLeads.filter((lead) => isThisMonth(lead.created_at));
  const meetingsThisMonth = activeLeads.filter((lead) => (
    lead.status === "meeting_booked" && (isThisMonth(lead.contacted_at) || isThisMonth(lead.created_at))
  ));
  const activeOrganizations = countUniqueOrganizations(activeLeads);
  const activePilotOrganizations = countUniqueOrganizations(pilotCandidateLeads);

  const funnel = [
    {
      label: "Lead",
      value: activeLeads.length,
      detail: "Website and founder-sourced inquiries still in the active queue.",
    },
    {
      label: "Meeting",
      value: meetingLeads.length,
      detail: "Qualified leads with a founder discussion booked.",
    },
    {
      label: "Pilot",
      value: pilotCandidateLeads.length,
      detail: "Leads marked as ready for founder-guided pilot review.",
    },
    {
      label: "Active Organization",
      value: activePilotOrganizations,
      detail: "Unique pilot-candidate organizations ready to move into onboarding.",
    },
  ];

  return (
    <main className="workspace-shell founder-revenue-shell">
      <header className="workspace-header">
        <Link className="back-link" href="/app">
          <ArrowLeft size={17} aria-hidden />
          Workspace
        </Link>
        <div>
          <span className="environment-pill"><ShieldCheck size={16} aria-hidden /> Founder only</span>
          <h1>Founder revenue dashboard</h1>
          <p>Business pipeline view for leads, meetings, pilot candidates, and organization acquisition.</p>
        </div>
        <Link className="mini-action" href="/app/leads">Review leads</Link>
      </header>

      {setupError ? (
        <EmptyLeadStorage message={setupError} />
      ) : (
        <section className="dashboard-shell founder-revenue-dashboard" aria-label="Founder revenue and pipeline dashboard">
          <div className="dashboard-hero founder-revenue-hero">
            <div>
              <span className="eyebrow">Founder business command</span>
              <h2>Revenue and partnership pipeline</h2>
              <p>
                Track inquiry volume, segment demand, conversion progress, and current founder KPIs from the
                existing lead capture system.
              </p>
            </div>
            <div className="founder-revenue-snapshot">
              <span className="status-pill success">Founder-only access</span>
              <strong>{activeOrganizations}</strong>
              <small>active organizations in the current lead pipeline</small>
            </div>
          </div>

          <section className="founder-dashboard-section" aria-labelledby="lead-overview-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Lead Overview</span>
                <h2 id="lead-overview-heading">Current inquiry queues</h2>
              </div>
              <span className="dashboard-count">{activeLeads.length}</span>
            </div>
            <div className="dashboard-kpi-grid compact">
              <MetricCard icon={Inbox} label="Total leads" value={activeLeads.length} detail="Active leads excluding archived records." primary />
              <MetricCard icon={Target} label="New leads" value={newLeads.length} detail="Needs first founder review." />
              <MetricCard icon={Users} label="Contacted" value={contactedLeads.length} detail="Initial outreach has started." />
              <MetricCard icon={CalendarDays} label="Meetings booked" value={meetingLeads.length} detail="Discovery or pilot calls scheduled." />
              <MetricCard icon={Handshake} label="Pilot candidates" value={pilotCandidateLeads.length} detail="Qualified for pilot consideration." />
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="pipeline-overview-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Pipeline Overview</span>
                <h2 id="pipeline-overview-heading">Organization segments</h2>
              </div>
              <span className="dashboard-count">{pipelineSegments.length}</span>
            </div>
            <div className="founder-pipeline-grid">
              {pipelineSegments.map((segment) => {
                const segmentLeads = activeLeads.filter((lead) => leadMatchesSegment(lead, segment));
                return (
                  <article className="founder-segment-card" key={segment.label}>
                    <Building2 size={20} aria-hidden />
                    <span>{segment.label}</span>
                    <strong>{segmentLeads.length}</strong>
                    <p>{segment.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="conversion-funnel-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Conversion Funnel</span>
                <h2 id="conversion-funnel-heading">Lead to active organization</h2>
              </div>
              <LineChart size={24} aria-hidden />
            </div>
            <div className="founder-funnel-grid">
              {funnel.map((step, index) => (
                <article className="founder-funnel-step" key={step.label}>
                  <span>{index + 1}</span>
                  <strong>{step.value}</strong>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="founder-kpis-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Founder KPIs</span>
                <h2 id="founder-kpis-heading">This month and current commitments</h2>
              </div>
              <BarChart3 size={24} aria-hidden />
            </div>
            <div className="dashboard-kpi-grid compact">
              <MetricCard icon={Inbox} label="Leads this month" value={leadsThisMonth.length} detail="New active lead records created this month." primary />
              <MetricCard icon={CalendarDays} label="Meetings this month" value={meetingsThisMonth.length} detail="Meeting-booked leads created or contacted this month." />
              <MetricCard icon={Handshake} label="Pilot commitments" value={pilotCandidateLeads.length} detail="Current pilot-candidate lead count." />
              <MetricCard icon={Building2} label="Active organizations" value={activeOrganizations} detail="Unique non-archived organizations in the lead pipeline." />
            </div>
          </section>
        </section>
      )}
    </main>
  );
}
