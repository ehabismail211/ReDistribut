import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Handshake,
  Inbox,
  LineChart,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import {
  leadStatusLabels,
  leadStatuses,
  listMarketingLeads,
  meetingStatusLabels,
  pilotStatusLabels,
  type MarketingLead,
} from "@/lib/leads";

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
type InquiryType = MarketingLead["inquiry_type"];

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

function PipelineList({
  title,
  description,
  leads,
  empty,
}: {
  title: string;
  description: string;
  leads: MarketingLead[];
  empty: string;
}) {
  return (
    <article className="founder-pipeline-list">
      <div className="dashboard-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="dashboard-count">{leads.length}</span>
      </div>
      <div className="founder-pipeline-list-stack">
        {leads.length > 0 ? leads.slice(0, 5).map((lead) => (
          <div className="founder-pipeline-list-item" key={lead.id}>
            <div>
              <strong>{lead.organization}</strong>
              <span>{lead.name}{lead.city ? ` · ${lead.city}` : ""}</span>
            </div>
            <div>
              <span className="status-pill info">{meetingStatusLabels[lead.meeting_status]}</span>
              <span className="status-pill success">{pilotStatusLabels[lead.pilot_status]}</span>
            </div>
          </div>
        )) : (
          <p className="dashboard-empty">{empty}</p>
        )}
      </div>
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
  const pilotCandidateLeads = activeLeads.filter((lead) => lead.status === "pilot_candidate");
  const scheduledMeetings = activeLeads.filter((lead) => lead.meeting_status === "scheduled");
  const completedMeetings = activeLeads.filter((lead) => lead.meeting_status === "completed");
  const followUpMeetings = activeLeads.filter((lead) => lead.meeting_status === "follow_up_required");
  const pilotInvitedLeads = activeLeads.filter((lead) => lead.pilot_status === "invited");
  const pilotAcceptedLeads = activeLeads.filter((lead) => lead.pilot_status === "accepted");
  const onboardingPilots = activeLeads.filter((lead) => lead.pilot_status === "onboarding");
  const activePilots = activeLeads.filter((lead) => lead.pilot_status === "active");
  const completedPilots = activeLeads.filter((lead) => lead.pilot_status === "completed");
  const leadsThisMonth = activeLeads.filter((lead) => isThisMonth(lead.created_at));
  const meetingsBooked = scheduledMeetings.length + completedMeetings.length + followUpMeetings.length;
  const meetingsCompleted = completedMeetings.length;
  const meetingsThisMonth = activeLeads.filter((lead) => (
    (lead.meeting_status === "scheduled" || lead.meeting_status === "completed" || lead.meeting_status === "follow_up_required") &&
    (isThisMonth(lead.meeting_status_updated_at) || isThisMonth(lead.contacted_at) || isThisMonth(lead.created_at))
  ));
  const activeOrganizations = countUniqueOrganizations(activeLeads);
  const activePilotOrganizations = countUniqueOrganizations([...onboardingPilots, ...activePilots]);
  const pilotPipelineLeads = [
    ...pilotCandidateLeads,
    ...pilotInvitedLeads,
    ...pilotAcceptedLeads,
    ...onboardingPilots,
    ...activePilots,
  ];
  const pilotConversionRate = meetingsBooked > 0
    ? Math.round(((pilotAcceptedLeads.length + onboardingPilots.length + activePilots.length + completedPilots.length) / meetingsBooked) * 100)
    : 0;
  const archivedLeads = leads.filter((lead) => lead.status === "archived");
  const leadPipeline = leadStatuses.map((status) => ({
    label: leadStatusLabels[status],
    value: status === "archived" ? archivedLeads.length : activeLeads.filter((lead) => lead.status === status).length,
    detail: status === "new"
      ? "Needs founder review."
      : status === "contacted"
        ? "Initial outreach started."
        : status === "meeting_booked"
          ? "Founder conversation booked."
          : status === "pilot_candidate"
            ? "Ready for pilot assessment."
            : "No longer active.",
  }));
  const inquiryBreakdownBase: Array<{ label: string; types: InquiryType[]; detail: string }> = [
    { label: "Supplier inquiries", types: ["supplier"], detail: "Organizations with surplus inventory." },
    { label: "Recipient inquiries", types: ["recipient"], detail: "NGOs, schools, and receiving organizations." },
    { label: "Partnership requests", types: ["partner"], detail: "Strategic and ecosystem partners." },
    { label: "ESG discussions", types: ["impact"], detail: "Impact, sustainability, and ESG conversations." },
    { label: "Founder meetings", types: ["demo", "pilot"], detail: "Walkthroughs and pilot interest." },
    { label: "General inquiries", types: ["question"], detail: "Questions that need routing." },
  ];
  const inquiryBreakdown = inquiryBreakdownBase.map((item) => ({
    ...item,
    value: activeLeads.filter((lead) => item.types.includes(lead.inquiry_type)).length,
  }));
  const meetingsToSchedule = contactedLeads.filter((lead) => lead.meeting_status === "not_scheduled");
  const supplierCandidates = pilotPipelineLeads.filter((lead) => (
    lead.inquiry_type === "supplier" || ["Hotels", "Restaurants", "Warehouses"].some((label) => leadMatchesSegment(lead, pipelineSegments.find((segment) => segment.label === label)!))
  ));
  const recipientCandidates = pilotPipelineLeads.filter((lead) => (
    lead.inquiry_type === "recipient" || leadMatchesSegment(lead, pipelineSegments[0])
  ));
  const readyForFirstPilotPair = supplierCandidates.length > 0 && recipientCandidates.length > 0;

  const funnel = [
    {
      label: "Lead",
      value: activeLeads.length,
      detail: "Website and founder-sourced inquiries still in the active queue.",
    },
    {
      label: "Meeting",
      value: meetingsBooked,
      detail: "Leads with scheduled, completed, or follow-up meeting tracking.",
    },
    {
      label: "Pilot",
      value: pilotPipelineLeads.length,
      detail: "Leads invited, accepted, onboarding, active, or marked as pilot candidates.",
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
              <span className="eyebrow">Founder Dashboard</span>
              <h2>Private pipeline and pilot command center</h2>
              <p>
                Manage leads, meetings, pilot candidates, and founder KPIs from one secure founder-only area.
              </p>
            </div>
            <div className="founder-revenue-snapshot">
              <span className="status-pill success">Founder-only access</span>
              <strong>{activeOrganizations}</strong>
              <small>active organizations in the current lead pipeline</small>
            </div>
          </div>

          <section className="founder-dashboard-section" aria-labelledby="founder-summary-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Founder Summary</span>
                <h2 id="founder-summary-heading">Current operating position</h2>
              </div>
              <span className="dashboard-count">{activeLeads.length}</span>
            </div>
            <div className="dashboard-kpi-grid compact">
              <MetricCard icon={Inbox} label="Total leads" value={activeLeads.length} detail="Active leads excluding archived records." primary />
              <MetricCard icon={Target} label="New leads" value={newLeads.length} detail="Needs first founder review." />
              <MetricCard icon={Users} label="Contacted" value={contactedLeads.length} detail="Initial outreach has started." />
              <MetricCard icon={CalendarDays} label="Meetings booked" value={scheduledMeetings.length} detail="Discovery or pilot calls scheduled." />
              <MetricCard icon={Handshake} label="Pilot candidates" value={pilotCandidateLeads.length} detail="Qualified for pilot consideration." />
              <MetricCard icon={Building2} label="Active organizations" value={activeOrganizations} detail="Unique non-archived organizations in the pipeline." />
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="lead-pipeline-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Lead Pipeline</span>
                <h2 id="lead-pipeline-heading">Lead status queues</h2>
              </div>
              <Inbox size={24} aria-hidden />
            </div>
            <div className="founder-funnel-grid">
              {leadPipeline.map((step, index) => (
                <article className="founder-funnel-step" key={step.label}>
                  <span>{index + 1}</span>
                  <strong>{step.value}</strong>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="interest-breakdown-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Interest Type Breakdown</span>
                <h2 id="interest-breakdown-heading">Demand by inquiry type</h2>
              </div>
              <Users size={24} aria-hidden />
            </div>
            <div className="founder-pipeline-grid">
              {inquiryBreakdown.map((item) => (
                <article className="founder-segment-card" key={item.label}>
                  <Building2 size={20} aria-hidden />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="next-actions-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Next Actions</span>
                <h2 id="next-actions-heading">Founder work queue</h2>
              </div>
              <Clock3 size={24} aria-hidden />
            </div>
            <div className="founder-ops-grid three">
              <PipelineList
                title="Leads needing follow-up"
                description="Conversations or leads requiring founder response."
                leads={[...followUpMeetings, ...newLeads]}
                empty="No lead follow-up is waiting."
              />
              <PipelineList
                title="Meetings to schedule"
                description="Contacted leads without a scheduled meeting."
                leads={meetingsToSchedule}
                empty="No contacted leads are waiting for scheduling."
              />
              <PipelineList
                title="Pilot candidates to review"
                description="Qualified leads ready for pilot fit decision."
                leads={pilotCandidateLeads}
                empty="No pilot candidates are waiting."
              />
            </div>
          </section>

          <section className="founder-dashboard-section" aria-labelledby="pilot-readiness-heading">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Pilot Readiness</span>
                <h2 id="pilot-readiness-heading">First pilot pair readiness</h2>
              </div>
              <Handshake size={24} aria-hidden />
            </div>
            <div className="dashboard-kpi-grid compact">
              <MetricCard icon={Target} label="Supplier candidates" value={supplierCandidates.length} detail="Supplier-side leads or pilot candidates." />
              <MetricCard icon={Users} label="Recipient candidates" value={recipientCandidates.length} detail="Recipient-side leads or pilot candidates." />
              <MetricCard icon={CheckCircle2} label="Ready for first pilot pair" value={readyForFirstPilotPair ? "Yes" : "No"} detail="Requires one supplier and one recipient candidate." primary={readyForFirstPilotPair} />
              <MetricCard icon={Building2} label="Active pilots" value={activePilots.length} detail="Organizations currently active in pilot operations." />
            </div>
            <div className="founder-ops-grid">
              <PipelineList
                title="Supplier candidates"
                description="Potential suppliers for Transfer #0001."
                leads={supplierCandidates}
                empty="No supplier candidates are ready yet."
              />
              <PipelineList
                title="Recipient candidates"
                description="Potential recipients for Transfer #0001."
                leads={recipientCandidates}
                empty="No recipient candidates are ready yet."
              />
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
              <MetricCard icon={CalendarDays} label="Meetings booked" value={meetingsBooked} detail={`${meetingsThisMonth.length} meeting records were updated this month.`} />
              <MetricCard icon={CheckCircle2} label="Meetings completed" value={meetingsCompleted} detail="Completed founder conversations." />
              <MetricCard icon={Handshake} label="Pilot commitments" value={pilotCandidateLeads.length} detail="Current pilot-candidate lead count." />
              <MetricCard icon={LineChart} label="Pilot conversion rate" value={`${pilotConversionRate}%`} detail="Accepted, onboarding, active, or completed pilots divided by tracked meetings." />
              <MetricCard icon={Building2} label="Active organizations" value={activeOrganizations} detail="Unique non-archived organizations in the lead pipeline." />
            </div>
          </section>
        </section>
      )}
    </main>
  );
}
