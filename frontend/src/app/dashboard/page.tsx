"use client";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { useRiskCalculation } from "@/hooks/useRiskCalculation";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";

export default function DashboardOverviewPage() {
  const alerts = useAlertStore((state) => state.alerts);
  const devices = useDeviceStore((state) => state.devices);
  const { averageRisk, averageRiskLevel } = useRiskCalculation();
  const activeAlerts = alerts.filter((alert) => !["Resolved", "Blocked"].includes(alert.status)).length;
  const blockedCount = alerts.filter((alert) => alert.status === "Blocked").length;

  return (
    <div className="view">
      <section className="metric-grid">
        <MetricCard label="Active threats" value={activeAlerts} trend={`${blockedCount} blocked today`} footer="Open incidents needing review" />
        <MetricCard label="Devices monitored" value={devices.length} trend="Live records" footer="Endpoints, mobiles, and kiosks" />
        <MetricCard label="Risk level" value={averageRiskLevel} trend={`${averageRisk}/100`} footer="Blended insider and endpoint score" />
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Live Threat Tracking</h2><p className="panel-subtitle">Signal density by category across monitored devices.</p></div>
          </div>
          <ThreatChart alerts={alerts} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Activity Feed</h2><p className="panel-subtitle">Real-time breach prevention events.</p></div>
          </div>
          <ActivityFeed />
        </div>
      </section>
    </div>
  );
}
