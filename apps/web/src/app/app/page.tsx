import { Workspace } from "./workspace";

export const metadata = {
  title: "ReDist Workspace | Private Pilot Preview",
  description: "Private pilot workspace for publishing, requesting, reserving, and completing surplus inventory handovers.",
};

export default function AppWorkspacePage() {
  return (
    <main className="workspace-shell">
      <Workspace />
    </main>
  );
}
