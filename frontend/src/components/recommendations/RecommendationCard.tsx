"use client";

import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { useAlertStore } from "@/store/useAlertStore";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import { currentTime } from "@/utils/time";
import type { Recommendation } from "@/types";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const applyRecommendation = useRecommendationStore((state) => state.applyRecommendation);
  const updateAllRisks = useDeviceStore((state) => state.updateAllRisks);
  const addFeedItem = useAlertStore((state) => state.addFeedItem);

  const onApply = () => {
    const item = applyRecommendation(recommendation.id);
    if (!item || item.applied) return;
    updateAllRisks(item.severity === "Critical" ? -10 : -6, 12);
    addFeedItem({ title: "AI recommendation applied", time: currentTime(), body: `${item.action} was applied across affected security policies.` });
  };

  return (
    <article className={`recommendation-card ${recommendation.applied ? "applied" : ""}`}>
      <div className="recommendation-head">
        <h3 className="recommendation-title">{recommendation.title}</h3>
        <Badge value={recommendation.severity} />
      </div>
      <p className="recommendation-copy">{recommendation.explanation}</p>
      <Button onClick={onApply} disabled={recommendation.applied}>{recommendation.applied ? "Applied" : recommendation.action}</Button>
    </article>
  );
}
