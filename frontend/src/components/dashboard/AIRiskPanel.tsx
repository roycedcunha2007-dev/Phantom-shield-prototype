import type { AIAnalysis, AIRecommendation } from "@/types";

function scoreClass(score: number) {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function AIRiskPanel({
  latest,
  organizationRiskScore,
  recommendations,
}: {
  latest: AIAnalysis | undefined;
  organizationRiskScore: number;
  recommendations: AIRecommendation[];
}) {
  const confidence = latest?.confidence ?? 0;

  return (
    <div className="ai-grid">
      <div className="ai-score-card">
        <span className="metric-label">AI Risk Panel</span>
        <strong className={`ai-score ${scoreClass(latest?.riskScore ?? organizationRiskScore)}`}>
          {Math.round(latest?.riskScore ?? organizationRiskScore)}
        </strong>
        <p className="panel-subtitle">
          {latest ? `${latest.classification} behavior on ${latest.deviceId}` : "Waiting for AI telemetry analysis."}
        </p>
        <div className="confidence-row">
          <span>Confidence</span>
          <span>{Math.round(confidence)}%</span>
        </div>
        <span className="risk-track"><span className={`risk-fill ${scoreClass(confidence)}`} style={{ width: `${confidence}%` }} /></span>
      </div>
      <div className="ai-mini-list">
        <div>
          <span className="metric-label">Anomaly</span>
          <strong>{Math.round(latest?.anomalyScore ?? 0)}/100</strong>
        </div>
        <div>
          <span className="metric-label">Insider Risk</span>
          <strong>{Math.round(latest?.insiderRiskScore ?? 0)}/100</strong>
        </div>
        <div>
          <span className="metric-label">Org Risk</span>
          <strong>{Math.round(organizationRiskScore)}/100</strong>
        </div>
      </div>
      <div className="ai-recommendation-center">
        {recommendations.slice(0, 3).map((item) => (
          <article className="ai-recommendation" key={item.id}>
            <div className="item-topline">
              <span className="item-title">{item.title}</span>
              <span className="chart-value">{Math.round(item.confidence)}%</span>
            </div>
            <p className="item-body">{item.description}</p>
            <p className="item-body">{item.reason}</p>
          </article>
        ))}
        {!recommendations.length && <p className="panel-subtitle">No AI recommendations generated yet.</p>}
      </div>
    </div>
  );
}
