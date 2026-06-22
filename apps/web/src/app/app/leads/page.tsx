import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Inbox, Mail, Phone, ShieldCheck, Users } from "lucide-react";
import {
  leadInquiryLabels,
  leadStatusLabels,
  leadStatuses,
  listMarketingLeads,
  type LeadStatus,
  type MarketingLead,
} from "@/lib/leads";
import { LeadStatusActions } from "./lead-status-actions";

export const metadata: Metadata = {
  title: "Lead review | ReDist founder workspace",
  description: "Founder-operated review queue for ReDist marketing website inquiries.",
};

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(new Date(value));
}

function statusTone(status: LeadStatus) {
  if (status === "new") return "warning";
  if (status === "pilot_candidate" || status === "meeting_booked") return "success";
  if (status === "archived") return "info";
  return "info";
}

function LeadCard({ lead }: { lead: MarketingLead }) {
  return (
    <article className="dashboard-card lead-card">
      <div className="dashboard-card-header">
        <div>
          <span className="lead-reference">{leadInquiryLabels[lead.inquiry_type]}</span>
          <h2>{lead.organization}</h2>
          <p>{lead.name}{lead.role_title ? `, ${lead.role_title}` : ""}</p>
        </div>
        <span className={`status-pill ${statusTone(lead.status)}`}>{leadStatusLabels[lead.status]}</span>
      </div>

      <div className="lead-contact-grid">
        <span><Mail size={16} aria-hidden /> {lead.email}</span>
        <span><Phone size={16} aria-hidden /> {lead.phone ?? "No phone provided"}</span>
        <span><Users size={16} aria-hidden /> {lead.organization_type ?? "Organization type not provided"}</span>
        <span><CalendarDays size={16} aria-hidden /> {formatDate(lead.created_at)}</span>
      </div>

      <p className="lead-message">{lead.message}</p>

      <div className="lead-meta-grid">
        <span><strong>City</strong>{lead.city ?? "Not provided"}</span>
        <span><strong>Timeline</strong>{lead.timeline ?? "Not provided"}</span>
        <span><strong>Source</strong>{lead.source.replaceAll("_", " ")}</span>
      </div>

      <LeadStatusActions leadId={lead.id} currentStatus={lead.status} />
    </article>
  );
}

function StatusColumn({ status, leads }: { status: LeadStatus; leads: MarketingLead[] }) {
  return (
    <section className="lead-status-column" aria-labelledby={`lead-status-${status}`}>
      <div className="dashboard-card-header">
        <div>
          <h2 id={`lead-status-${status}`}>{leadStatusLabels[status]}</h2>
          <p>{leads.length} {leads.length === 1 ? "inquiry" : "inquiries"}</p>
        </div>
        <span className="dashboard-count">{leads.length}</span>
      </div>
      <div className="lead-card-stack">
        {leads.length > 0 ? leads.map((lead) => <LeadCard lead={lead} key={lead.id} />) : (
          <div className="dashboard-empty">
            No inquiries in this queue.
          </div>
        )}
      </div>
    </section>
  );
}

export default async function LeadsPage() {
  let leads: MarketingLead[] = [];
  let setupError: string | null = null;

  try {
    leads = await listMarketingLeads();
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Lead records could not be loaded.";
  }

  const grouped = new Map<LeadStatus, MarketingLead[]>(
    leadStatuses.map((status) => [status, leads.filter((lead) => lead.status === status)]),
  );

  return (
    <main className="workspace-shell lead-review-shell">
      <header className="workspace-header">
        <a className="back-link" href="/app"><ArrowLeft size={17} aria-hidden /> Workspace</a>
        <div>
          <span className="environment-pill"><ShieldCheck size={16} aria-hidden /> Founder only</span>
          <h1>Lead review</h1>
          <p>Founder-operated queue for website inquiries, pilot fit review, and first-contact tracking.</p>
        </div>
        <a className="mini-action" href="/contact?intent=pilot">Open contact form</a>
      </header>

      {setupError ? (
        <section className="dashboard-card lead-setup-card">
          <Inbox size={28} aria-hidden />
          <h2>Lead storage is not ready yet.</h2>
          <p>{setupError}</p>
          <p>Apply the `marketing_leads` Supabase migration and configure `SUPABASE_SERVICE_ROLE_KEY` for server-side lead storage.</p>
        </section>
      ) : (
        <>
          <section className="dashboard-kpi-grid compact" aria-label="Lead funnel summary">
            {leadStatuses.map((status) => (
              <div className={`dashboard-kpi-card ${status === "new" ? "primary" : ""}`} key={status}>
                <span>{leadStatusLabels[status]}</span>
                <strong>{grouped.get(status)?.length ?? 0}</strong>
                <p>{status === "new" ? "Awaiting founder review." : "Current lead queue count."}</p>
              </div>
            ))}
          </section>

          <section className="lead-review-grid" aria-label="Founder lead review queues">
            {leadStatuses.map((status) => (
              <StatusColumn leads={grouped.get(status) ?? []} status={status} key={status} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
