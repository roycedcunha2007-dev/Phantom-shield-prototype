import { getRiskLevel, toClassName } from "@/utils/risk";

export function RiskMeter({ score, compact = false }: { score: number; compact?: boolean }) {
  const level = toClassName(getRiskLevel(score));
  return (
    <div className="risk-meter">
      <span className="risk-track"><span className={`risk-fill ${level}`} style={{ width: `${score}%` }} /></span>
      <span className="risk-score">{compact ? score : `${score}/100`}</span>
    </div>
  );
}
