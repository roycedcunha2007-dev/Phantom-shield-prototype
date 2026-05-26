export function MetricCard({ label, value, trend, footer }: { label: string; value: string | number; trend: string; footer: string }) {
  return (
    <article className="metric-card">
      <span className="metric-label">{label}</span>
      <div className="metric-value">{value}<span className="metric-trend">{trend}</span></div>
      <p className="metric-footer">{footer}</p>
    </article>
  );
}
