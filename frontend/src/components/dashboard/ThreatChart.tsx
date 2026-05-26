import type { Alert, Severity } from "@/types";

export function ThreatChart({ alerts }: { alerts: Alert[] }) {
  const severityRows: Array<{ label: Severity; style: string }> = [
    { label: "Critical", style: "danger" },
    { label: "High", style: "warning" },
    { label: "Medium", style: "info" },
    { label: "Low", style: "" },
  ];
  const total = alerts.length;

  if (!total) {
    return <p className="panel-subtitle">No threat signals recorded.</p>;
  }

  return (
    <div className="threat-chart">
      {severityRows.map(({ label, style }) => {
        const count = alerts.filter((alert) => alert.severity === label).length;
        const value = Math.round((count / total) * 100);
        return (
          <div className="chart-row" key={label}>
            <span className="chart-label">{label}</span>
            <span className="chart-track"><span className={`chart-fill ${style}`} style={{ width: `${value}%` }} /></span>
            <span className="chart-value">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
