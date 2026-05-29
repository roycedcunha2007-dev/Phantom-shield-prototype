"use client";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AIRiskPanel } from "@/components/dashboard/AIRiskPanel";
import { AITrendGraph } from "@/components/dashboard/AITrendGraph";
import { AnomalyTimeline } from "@/components/dashboard/AnomalyTimeline";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { useRiskCalculation } from "@/hooks/useRiskCalculation";
import { useAIStore } from "@/store/useAIStore";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";

export default function DashboardOverviewPage() {
  const alerts = useAlertStore((state) => state.alerts);
  const aiAnalyses = useAIStore((state) => state.analyses);
  const aiRecommendations = useAIStore((state) => state.recommendations);
  const organizationRiskScore = useAIStore((state) => state.organizationRiskScore);
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
      <section className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">AI Risk Intelligence</h2><p className="panel-subtitle">Hybrid rule and ML scoring with explainable recommendations.</p></div>
        </div>
        <AIRiskPanel latest={aiAnalyses[0]} organizationRiskScore={organizationRiskScore} recommendations={aiRecommendations} />
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
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Risk Trend Graph</h2><p className="panel-subtitle">Recent AI risk calculations from live telemetry.</p></div>
          </div>
          <AITrendGraph analyses={aiAnalyses} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Anomaly Timeline</h2><p className="panel-subtitle">Unusual behavior detected by Isolation Forest.</p></div>
          </div>
          <AnomalyTimeline analyses={aiAnalyses} />
        </div>
      </section>
      
      <section className="dashboard-grid" style={{ marginTop: "1.5rem" }}>
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Live Device Health</h2><p className="panel-subtitle">System metrics from connected endpoints.</p></div>
          </div>
          <div style={{ padding: "1rem" }}>
             {/* MVP placeholder for Device Health component */}
             <ul style={{ listStyle: "none", padding: 0 }}>
               {devices.map(device => (
                 <li key={device.id} style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                   <span>{device.name}</span>
                   <span style={{ color: device.status === "Online" ? "var(--success)" : "var(--danger)" }}>{device.status}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div><h2 className="panel-title">Endpoint Risk Heatmap</h2><p className="panel-subtitle">Vulnerability and behavioral risk.</p></div>
          </div>
          <div style={{ padding: "1rem" }}>
             {/* MVP placeholder for Risk Heatmap component */}
             <ul style={{ listStyle: "none", padding: 0 }}>
               {devices.map(device => (
                 <li key={device.id} style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", padding: "0.5rem", backgroundColor: device.risk > 70 ? "rgba(255, 0, 0, 0.1)" : "transparent", borderLeft: device.risk > 70 ? "3px solid red" : "3px solid green" }}>
                   <span>{device.name}</span>
                   <span>Score: {device.risk}/100</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
