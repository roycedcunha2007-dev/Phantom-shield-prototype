import type { AIAnalysis } from "@/types";

export function AITrendGraph({ analyses }: { analyses: AIAnalysis[] }) {
  const points = analyses.slice(0, 12).reverse();

  if (!points.length) {
    return <p className="panel-subtitle">AI risk trend will appear after telemetry is analyzed.</p>;
  }

  return (
    <div className="ai-trend">
      {points.map((item) => (
        <div className="ai-trend-bar" key={item.id}>
          <span style={{ height: `${Math.max(8, item.riskScore)}%` }} />
          <small>{Math.round(item.riskScore)}</small>
        </div>
      ))}
    </div>
  );
}
