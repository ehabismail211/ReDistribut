import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Workspace } from "./workspace";

export const metadata = {
  title: "ReDist Workspace | Local MVP Preview",
  description: "Local preview workspace for publishing, requesting, reserving, and completing surplus inventory handovers.",
};

export default function AppWorkspacePage() {
  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <Link className="back-link" href="/">
          <ArrowLeft size={18} />
          Public site
        </Link>
        <div>
          <span className="eyebrow">Local MVP preview</span>
          <h1>ReDist workspace</h1>
        </div>
        <span className="environment-pill">Local only</span>
      </header>
      <Workspace />
    </main>
  );
}
