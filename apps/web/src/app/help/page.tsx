import type { Metadata } from "next";
import { HelpCenterContent } from "../components/help-center";
import { CtaBand, MarketingShell, PageHero } from "../components/marketing";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Bilingual ReDist help center with quick start, user manual, supplier guide, recipient guide, screenshots, and FAQ access.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Help Center"
        title="Bilingual guidance for ReDist users."
        text="Use quick-start instructions, role-specific guides, screenshots, Arabic guidance, and FAQ answers before or during a founder-guided pilot workflow."
        primaryLabel="Open FAQ"
        primaryHref="/faq"
        secondaryLabel="Contact support"
        secondaryHref="/contact?intent=question"
      />
      <HelpCenterContent />
      <CtaBand
        title="Need founder support?"
        text="Send a short inquiry with your organization, role, and the workflow step you are trying to complete."
        href="/contact?intent=question"
        label="Contact ReDist"
      />
    </MarketingShell>
  );
}
