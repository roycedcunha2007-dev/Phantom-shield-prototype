"use client";

import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { useRecommendationStore } from "@/store/useRecommendationStore";

export default function RecommendationsPage() {
  const recommendations = useRecommendationStore((state) => state.recommendations);
  const applied = recommendations.filter((item) => item.applied).length;
  return (
    <div className="view recommendation-grid">
      <section className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">Recommended Actions</h2><p className="panel-subtitle">Actions are generated from active alert patterns, device posture, and insider risk movement.</p></div>
        </div>
        <div className="recommendation-list">{recommendations.map((item) => <RecommendationCard key={item.id} recommendation={item} />)}</div>
      </section>
      <aside className="panel">
        <div className="panel-header">
          <div><h2 className="panel-title">AI Risk Summary</h2><p className="panel-subtitle">Current recommendation summary.</p></div>
        </div>
        <div className="insight-stack">
          <div className="insight"><span className="insight-label">Recommendations applied</span><span className="insight-value">{applied}/{recommendations.length}</span></div>
          <div className="insight"><span className="insight-label">Projected risk reduction</span><span className="insight-value">{applied * 11}%</span></div>
          <div className="insight"><span className="insight-label">Highest pressure area</span><span className="insight-value">Data Loss</span></div>
        </div>
      </aside>
    </div>
  );
}
