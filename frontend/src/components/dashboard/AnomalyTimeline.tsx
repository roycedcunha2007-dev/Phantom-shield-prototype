import type { AIAnalysis } from "@/types";

export function AnomalyTimeline({ analyses }: { analyses: AIAnalysis[] }) {
  const anomalies = analyses.filter((item) => item.anomalyScore >= 40).slice(0, 5);

  if (!anomalies.length) {
    return <p className="panel-subtitle">No anomalous AI events detected.</p>;
  }

  return (
    <div className="activity-feed">
      {anomalies.map((item) => (
        <article className="feed-item" key={item.id}>
          <div className="item-topline">
            <span className="item-title">{item.classification}</span>
            <span className="item-time">{Math.round(item.anomalyScore)}/100</span>
          </div>
          <p className="item-body">Device {item.deviceId} produced an elevated anomaly score with {Math.round(item.confidence)}% confidence.</p>
        </article>
      ))}
    </div>
  );
}
