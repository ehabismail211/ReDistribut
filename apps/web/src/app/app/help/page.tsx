import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HelpCenterContent } from "../../components/help-center";

export const metadata: Metadata = {
  title: "Workspace Help Center | ReDist",
  description: "Internal ReDist help center for pilot participants, suppliers, recipients, and administrators.",
};

export default function WorkspaceHelpPage() {
  return (
    <main className="workspace-standalone-page">
      <div className="workspace-standalone-header">
        <Link className="mini-action" href="/app">
          <ArrowLeft size={16} aria-hidden />
          Back to workspace
        </Link>
        <span className="environment-pill">Pilot support</span>
      </div>
      <section className="dashboard-hero founder-revenue-hero">
        <div>
          <span className="dashboard-eyebrow">Workspace Help Center</span>
          <h1>Guides for suppliers, recipients, administrators, and pilot users.</h1>
          <p>Use the bilingual quick start, user manual, role guides, screenshots, FAQ, and founder support notes while completing ReDist workflows.</p>
        </div>
      </section>
      <HelpCenterContent internal />
    </main>
  );
}
