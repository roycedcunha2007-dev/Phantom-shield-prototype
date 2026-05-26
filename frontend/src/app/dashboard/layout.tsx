import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DashboardRuntime } from "@/components/dashboard/DashboardRuntime";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dashboard-shell">
      <DashboardRuntime />
      <Sidebar />
      <section className="main-area">
        <Topbar />
        <section className="content">{children}</section>
      </section>
    </main>
  );
}
