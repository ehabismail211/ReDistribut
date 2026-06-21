import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Handshake,
  MessageSquare,
  PackageSearch,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Pilot Monitoring Dashboard | ReDist",
  description: "Founder-only monitoring dashboard for the controlled UAE pilot.",
};

type PilotOrganization = {
  name: string;
  type: string;
  location: string;
  status: "Active" | "Onboarding" | "Attention";
  verificationStatus: "Approved" | "Pending Review";
  trustScore: number;
  listings: number;
  requests: number;
  transactions: number;
  certificates: number;
  feedback: number;
  openIssues: number;
};

const pilotOrganizations: PilotOrganization[] = [
  {
    name: "Dubai Marina Restaurant",
    type: "Restaurant",
    location: "Dubai Marina",
    status: "Active",
    verificationStatus: "Approved",
    trustScore: 72,
    listings: 1,
    requests: 3,
    transactions: 2,
    certificates: 2,
    feedback: 1,
    openIssues: 0,
  },
  {
    name: "Abu Dhabi Hotel Group",
    type: "Hotel",
    location: "Abu Dhabi",
    status: "Active",
    verificationStatus: "Approved",
    trustScore: 76,
    listings: 1,
    requests: 2,
    transactions: 2,
    certificates: 2,
    feedback: 0,
    openIssues: 0,
  },
  {
    name: "Jebel Ali Logistics",
    type: "Warehouse",
    location: "Jebel Ali",
    status: "Attention",
    verificationStatus: "Pending Review",
    trustScore: 64,
    listings: 1,
    requests: 3,
    transactions: 2,
    certificates: 2,
    feedback: 1,
    openIssues: 1,
  },
  {
    name: "Dubai Community NGO",
    type: "NGO",
    location: "Dubai",
    status: "Onboarding",
    verificationStatus: "Pending Review",
    trustScore: 68,
    listings: 1,
    requests: 3,
    transactions: 2,
    certificates: 2,
    feedback: 1,
    openIssues: 1,
  },
];

const feedback = [
  {
    organization: "Jebel Ali Logistics",
    priority: "High",
    category: "Verification",
    title: "Storage permit renewal reminder needs clearer owner",
    status: "Open",
  },
  {
    organization: "Dubai Marina Restaurant",
    priority: "Medium",
    category: "Handover",
    title: "Add pickup window confirmation before completion",
    status: "Reviewing",
  },
  {
    organization: "Dubai Community NGO",
    priority: "Low",
    category: "Impact",
    title: "Show monthly impact summary for board reporting",
    status: "Resolved",
  },
];

const totals = pilotOrganizations.reduce(
  (current, organization) => ({
    organizations: current.organizations + 1,
    listings: current.listings + organization.listings,
    requests: current.requests + organization.requests,
    transactions: current.transactions + organization.transactions,
    certificates: current.certificates + organization.certificates,
    feedback: current.feedback + organization.feedback,
    openIssues: current.openIssues + organization.openIssues,
    trustTotal: current.trustTotal + organization.trustScore,
    verified: current.verified + (organization.verificationStatus === "Approved" ? 1 : 0),
  }),
  {
    organizations: 0,
    listings: 0,
    requests: 0,
    transactions: 0,
    certificates: 0,
    feedback: 0,
    openIssues: 0,
    trustTotal: 0,
    verified: 0,
  },
);

const averageTrust = Math.round(totals.trustTotal / Math.max(totals.organizations, 1));
const verificationCompletion = Math.round((totals.verified / Math.max(totals.organizations, 1)) * 100);

function statusClass(value: string) {
  if (value === "Active" || value === "Approved" || value === "Resolved") return "success";
  if (value === "Attention" || value === "High" || value === "Open") return "danger";
  return "warning";
}

function trustLevel(score: number) {
  if (score >= 85) return "Platinum";
  if (score >= 70) return "Gold";
  if (score >= 50) return "Silver";
  return "Bronze";
}

function KpiCard({
  label,
  value,
  text,
  icon: Icon,
}: {
  label: string;
  value: string;
  text: string;
  icon: typeof Building2;
}) {
  return (
    <article className="dashboard-kpi-card pilot-monitor-kpi">
      <div className="dashboard-kpi-icon">
        <Icon size={20} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}

export default function PilotMonitoringDashboardPage() {
  return (
    <main className="workspace-shell founder-monitor-shell">
      <header className="workspace-header">
        <Link className="back-link" href="/app">
          <ArrowLeft size={18} />
          Workspace
        </Link>
        <div>
          <span className="eyebrow">Founder only</span>
          <h1>Pilot monitoring dashboard</h1>
        </div>
        <span className="environment-pill">UAE pilot</span>
      </header>

      <section className="dashboard-shell founder-monitor-dashboard" aria-label="Founder pilot monitoring dashboard">
        <div className="dashboard-hero pilot-monitor-hero">
          <div>
            <span className="eyebrow">Controlled UAE pilot</span>
            <h2>Founder command view</h2>
            <p>
              Monitor pilot organizations, listings, requests, transactions, certificates, trust scores,
              verification status, feedback, and open issues from the current validated simulation cohort.
            </p>
          </div>
          <div className="pilot-monitor-decision">
            <span className="status-pill warning">Conditional Go</span>
            <strong>87% readiness</strong>
            <small>Founder approval gates remain before external invites.</small>
          </div>
        </div>

        <div className="dashboard-kpi-grid pilot-monitor-grid">
          <KpiCard icon={Building2} label="Pilot organizations" value={String(totals.organizations)} text="Invited organizations in the controlled UAE cohort." />
          <KpiCard icon={PackageSearch} label="Listings" value={String(totals.listings)} text="Published pilot listings available for workflow validation." />
          <KpiCard icon={ClipboardList} label="Requests" value={String(totals.requests)} text="Requests created across pilot organizations." />
          <KpiCard icon={Handshake} label="Transactions" value={String(totals.transactions)} text="Completed redistribution transactions from simulations." />
          <KpiCard icon={QrCode} label="Certificates" value={String(totals.certificates)} text="QR-verifiable certificates expected from completed transactions." />
          <KpiCard icon={Award} label="Trust scores" value={`${averageTrust}/100`} text={`${trustLevel(averageTrust)} average pilot trust level.`} />
          <KpiCard icon={ShieldCheck} label="Verification status" value={`${verificationCompletion}%`} text="Organizations with approved verification." />
          <KpiCard icon={MessageSquare} label="Feedback" value={String(totals.feedback)} text="Founder review inputs submitted by pilot users." />
          <KpiCard icon={AlertTriangle} label="Open issues" value={String(totals.openIssues)} text="Unresolved pilot issues requiring founder attention." />
        </div>

        <div className="pilot-monitor-columns">
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Organizations</span>
                <h3>Pilot organization health</h3>
              </div>
              <span className="dashboard-count">{totals.organizations}</span>
            </div>
            <div className="pilot-monitor-table">
              <div className="pilot-monitor-row pilot-monitor-head">
                <span>Organization</span>
                <span>Status</span>
                <span>Verification</span>
                <span>Trust</span>
                <span>Flow</span>
                <span>Issues</span>
              </div>
              {pilotOrganizations.map((organization) => (
                <div className="pilot-monitor-row" key={organization.name}>
                  <strong>
                    {organization.name}
                    <small>{organization.type} · {organization.location}</small>
                  </strong>
                  <span className={`status-pill ${statusClass(organization.status)}`}>{organization.status}</span>
                  <span className={`status-pill ${statusClass(organization.verificationStatus)}`}>{organization.verificationStatus}</span>
                  <span>{organization.trustScore}/100</span>
                  <span>{organization.listings}L · {organization.requests}R · {organization.transactions}T</span>
                  <span>{organization.openIssues}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="dashboard-card pilot-monitor-review">
            <div className="dashboard-card-header">
              <div>
                <span className="eyebrow">Founder review</span>
                <h3>Priority watchlist</h3>
              </div>
              <Bell size={20} />
            </div>
            <div className="dashboard-feed">
              <article className="dashboard-feed-item">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Simulation validation passed</strong>
                  <p>Restaurant, Hotel, Warehouse, and NGO scenarios validate completed transactions and certificates.</p>
                  <span>Current sprint</span>
                </div>
              </article>
              <article className="dashboard-feed-item">
                <FileCheck2 size={18} />
                <div>
                  <strong>Founder gates pending</strong>
                  <p>Tenant-boundary evidence, private bucket confirmation, mobile QA, and incident drill must be signed off.</p>
                  <span>Before external invite</span>
                </div>
              </article>
              <article className="dashboard-feed-item">
                <AlertTriangle size={18} />
                <div>
                  <strong>{totals.openIssues} open pilot issues</strong>
                  <p>Review unresolved feedback before inviting the next organization.</p>
                  <span>Weekly review</span>
                </div>
              </article>
            </div>
          </aside>
        </div>

        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <span className="eyebrow">Feedback and issues</span>
              <h3>Pilot feedback queue</h3>
            </div>
            <span className="dashboard-count">{feedback.length}</span>
          </div>
          <div className="pilot-feedback-list founder-feedback-list">
            {feedback.map((item) => (
              <article className={`pilot-feedback-card ${item.priority.toLowerCase()}`} key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <span className={`status-pill ${statusClass(item.priority)}`}>{item.priority}</span>
                </div>
                <small>{item.organization} · {item.category}</small>
                <p>{item.status}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
